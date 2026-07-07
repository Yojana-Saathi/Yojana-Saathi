"""YojanaSaathi backend — FastAPI application.

Wires the deterministic eligibility pipeline behind three endpoints:
  - POST /api/intake             -> IntakeResponse
  - GET  /api/draft/{scheme_id}  -> DraftResponse
  - GET  /api/health             -> HealthResponse

Security: explicit CORS allowlist, per-IP rate limiting, no secrets in code, and
a standard error shape on every failure (no raw tracebacks leak to clients).
"""

from __future__ import annotations

import uuid
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .agents.drafter_agent import build_next_steps, draft_application
from .agents.pipeline import run_intake_pipeline
from .config import Settings, get_settings
from .core.logging_config import (
    capture_exception,
    configure_logging,
    get_logger,
)
from .core.request_cache import RequestCache
from .core.scheme_loader import load_schemes
from .core.security import build_limiter, configure_cors
from .llm.gemini_client import GeminiClient
from .models.enums import ErrorCode, ProcessingStatus
from .models.request_models import CitizenProfile
from .models.response_models import (
    DraftResponse,
    HealthResponse,
    IntakeResponse,
)
from .models.scheme_models import Scheme

AGENTS_ONLINE = ["intake", "eligibility", "ranking", "docgap", "drafter"]


def _error_payload(message: str, code: ErrorCode) -> dict:
    """Build the standard error shape used on every failure."""
    return {
        "processing_status": ProcessingStatus.ERROR.value,
        "error_message": message,
        "error_code": code.value,
    }


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load schemes and initialize shared services once at startup."""
    settings: Settings = get_settings()
    configure_logging(settings)
    logger = get_logger("startup")

    schemes = tuple(load_schemes())
    app.state.settings = settings
    app.state.schemes = schemes
    app.state.schemes_by_id = {s.scheme_id: s for s in schemes}
    app.state.llm = GeminiClient(settings)
    app.state.request_cache = RequestCache(
        ttl_seconds=settings.request_cache_ttl_seconds,
        max_size=settings.request_cache_max_size,
    )
    logger.info(
        "startup_complete",
        scheme_count=len(schemes),
        llm_active=app.state.llm.available,
        environment=settings.environment,
    )
    yield
    logger.info("shutdown")


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings)

    app = FastAPI(
        title="YojanaSaathi API",
        version="1.0.0",
        description="Government welfare scheme eligibility engine.",
        lifespan=lifespan,
    )

    # Rate limiting (slowapi): limiter on state + middleware + 429 handler.
    limiter = build_limiter(settings)
    app.state.limiter = limiter
    app.add_middleware(SlowAPIMiddleware)

    # CORS with explicit allowlist (never "*").
    configure_cors(app, settings)

    _register_error_handlers(app)
    _register_routes(app)
    return app


def _register_error_handlers(app: FastAPI) -> None:
    logger = get_logger("errors")

    @app.exception_handler(RateLimitExceeded)
    async def _rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content=_error_payload(
                "Rate limit exceeded. Please try again shortly.", ErrorCode.AGENT_TIMEOUT
            ),
        )

    @app.exception_handler(RequestValidationError)
    async def _validation_handler(request: Request, exc: RequestValidationError):
        # 422 with the standard error shape; do not echo internal structures.
        return JSONResponse(
            status_code=422,
            content=_error_payload(
                "Invalid input. Please check the submitted fields.", ErrorCode.INVALID_INPUT
            ),
        )

    @app.exception_handler(Exception)
    async def _unhandled_handler(request: Request, exc: Exception):
        # Log full detail server-side (Sentry), return a generic message.
        capture_exception(exc)
        logger.error("unhandled_exception", path=request.url.path, error=str(exc))
        return JSONResponse(
            status_code=500,
            content=_error_payload(
                "An internal error occurred. Please try again later.", ErrorCode.INTERNAL_ERROR
            ),
        )


def _register_routes(app: FastAPI) -> None:
    logger = get_logger("api")

    @app.post("/api/intake", response_model=IntakeResponse)
    async def intake(request: Request, profile: CitizenProfile) -> IntakeResponse:
        request_id = str(uuid.uuid4())
        # Bind request_id to the log context; NEVER log the full profile.
        structlog.contextvars.bind_contextvars(request_id=request_id)
        try:
            output = await run_intake_pipeline(
                profile=profile,
                request_id=request_id,
                schemes=request.app.state.schemes,
                llm=request.app.state.llm,
            )
            # Cache the normalized profile for the later /api/draft call.
            request.app.state.request_cache.set(request_id, output.normalized_profile)
            logger.info(
                "intake_processed",
                outcome=output.response.processing_status.value,
                eligible_count=output.response.total_eligible_count,
            )
            return output.response
        except Exception as exc:
            capture_exception(exc)
            logger.error("intake_failed", error=str(exc))
            # Return the standard error shape (200-body style contract error).
            return JSONResponse(
                status_code=500,
                content=_error_payload(
                    "An internal error occurred while processing the request.",
                    ErrorCode.INTERNAL_ERROR,
                ),
            )
        finally:
            structlog.contextvars.unbind_contextvars("request_id")

    @app.get("/api/draft/{scheme_id}", response_model=DraftResponse)
    async def draft(
        request: Request,
        scheme_id: str,
        request_id: str = Query(..., description="request_id from the earlier /api/intake call"),
    ):
        structlog.contextvars.bind_contextvars(request_id=request_id)
        try:
            scheme: Scheme | None = request.app.state.schemes_by_id.get(scheme_id)
            if scheme is None:
                return JSONResponse(
                    status_code=404,
                    content=_error_payload(
                        f"Unknown scheme_id: {scheme_id}", ErrorCode.INVALID_INPUT
                    ),
                )

            profile = request.app.state.request_cache.get(request_id)
            if profile is None:
                return JSONResponse(
                    status_code=404,
                    content=_error_payload(
                        "Unknown or expired request_id. Please submit the intake form again.",
                        ErrorCode.INVALID_INPUT,
                    ),
                )

            drafted_text, _used_llm = await draft_application(
                profile=profile, scheme=scheme, llm=request.app.state.llm
            )
            logger.info("draft_generated", scheme_id=scheme_id)
            return DraftResponse(
                scheme_id=scheme_id,
                drafted_application_text=drafted_text,
                required_documents=list(scheme.required_documents),
                next_steps=build_next_steps(scheme),
            )
        except Exception as exc:
            capture_exception(exc)
            logger.error("draft_failed", scheme_id=scheme_id, error=str(exc))
            return JSONResponse(
                status_code=500,
                content=_error_payload(
                    "An internal error occurred while drafting the application.",
                    ErrorCode.INTERNAL_ERROR,
                ),
            )
        finally:
            structlog.contextvars.unbind_contextvars("request_id")

    @app.get("/api/health", response_model=HealthResponse)
    async def health(request: Request) -> HealthResponse:
        return HealthResponse(status="ok", agents_online=list(AGENTS_ONLINE))


app = create_app()
