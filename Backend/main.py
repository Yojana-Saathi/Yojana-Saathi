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
import jwt
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Query, Request, Depends, UploadFile, File, Form, status, Header, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .agents.drafter_agent import build_next_steps, draft_application
from .agents.pipeline import run_intake_pipeline
from .agents.docgap_agent import missing_documents_for_scheme
from .agents.document_agent import OCRSpaceProvider
from .config import Settings, get_settings
from .core.logging_config import (
    capture_exception,
    configure_logging,
    get_logger,
)
from .core.request_cache import RequestCache
from .core.scheme_loader import load_schemes
from .core.security import build_limiter, configure_cors
from .core.supabase_client import get_service_role_client
from .core.auth import AuthenticatedUser, get_current_user, get_current_user_client, verify_internal_secret
from .llm.gemini_client import GeminiClient
from .models.enums import ErrorCode, ProcessingStatus, GOV_ID_KEYS, Gender, Occupation, SocialCategory, DisabilityStatus, EducationLevel
from .models.response_models import (
    DraftResponse,
    HealthResponse,
    IntakeResponse,
)
from .models.scheme_models import Scheme, EligibilityRules
from .models.request_models import CitizenProfile, ChatRequest
from .models.response_models import ChatResponse


AGENTS_ONLINE = ["intake", "eligibility", "ranking", "docgap", "drafter", "document"]



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

    # Auto-seed local schemes into Supabase DB on startup so DB is never out of sync
    try:
        if settings.supabase_url and settings.supabase_service_role_key:
            service_client = get_service_role_client()
            payload = [
                {**s.model_dump(), "is_active": True} for s in schemes
            ]
            service_client.table("schemes").upsert(payload, on_conflict="scheme_id").execute()
            logger.info("schemes_seeded_to_db", count=len(payload))
    except Exception as exc:
        logger.warning("schemes_seed_failed", error=str(exc))

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

    @app.get("/api/intake")
    @app.get("/api/matches")
    async def get_matches(auth: AuthenticatedUser = Depends(get_current_user_client)):
        """Return existing eligibility matches for the current user."""
        user_id = auth.user_id
        supabase = auth.supabase
        try:
            res = supabase.table("eligibility_matches").select("*, schemes(*)").eq("user_id", user_id).order("priority_rank", desc=False).execute()
            matches = []
            for row in res.data:
                scheme = row.get("schemes") or {}
                matches.append({
                    "scheme_id": scheme.get("scheme_id", ""),
                    "scheme_name": scheme.get("scheme_name", ""),
                    "scheme_category": scheme.get("scheme_category", ""),
                    "issuing_authority": scheme.get("issuing_authority", ""),
                    "match_score": row.get("match_score", 0.0),
                    "eligibility_match_score": row.get("match_score", 0.0),
                    "benefit_summary": scheme.get("benefit_summary", ""),
                    "benefit_value_estimate": scheme.get("benefit_value_estimate", ""),
                    "missing_documents": row.get("missing_documents") or [],
                    "priority_rank": row.get("priority_rank", 1),
                    "application_url": scheme.get("application_url", ""),
                    "id": row.get("id", ""),
                    "matched_at": row.get("matched_at", "")
                })
            return {"ranked_schemes": matches, "eligible_schemes": matches, "total_eligible_count": len(matches)}
        except Exception as exc:
            logger.error("get_matches_failed", error=str(exc))
            return {"ranked_schemes": [], "eligible_schemes": [], "total_eligible_count": 0}

    @app.post("/api/intake", response_model=IntakeResponse)
    async def intake(
        request: Request,
        profile: CitizenProfile,
        auth: AuthenticatedUser = Depends(get_current_user_client)
    ) -> IntakeResponse:
        user_id = auth.user_id
        supabase = auth.supabase
        request_id = str(uuid.uuid4())
        # Bind request_id to the log context; NEVER log the full profile.
        structlog.contextvars.bind_contextvars(request_id=request_id)
        try:
            # Upsert profile — single operation handles both first-time and updates.
            # The UNIQUE(user_id) constraint means on conflict it updates in-place.
            profile_dict = {
                "user_id": user_id,
                "full_name": profile.full_name.strip(),
                "age": profile.age,
                "gender": profile.gender.value,
                "state": profile.state.strip(),
                "district": profile.district.strip(),
                "annual_income": profile.annual_income,
                "occupation": profile.occupation.value,
                "social_category": profile.social_category.value,
                "disability_status": profile.disability_status.value,
                "family_size": profile.family_size,
                "has_bpl_card": profile.has_bpl_card,
                "land_owned_acres": profile.land_owned_acres,
                "education_level": profile.education_level.value,
                "is_current": True
            }
            supabase.table("citizen_profiles").upsert(profile_dict, on_conflict="user_id").execute()

            # 3. Seed documents table with available IDs checked in the intake form
            existing_docs = supabase.table("documents").select("doc_type").eq("user_id", user_id).execute()
            existing_types = {d["doc_type"] for d in existing_docs.data}
            for doc_type, available in profile.gov_id_available.model_dump().items():
                if available and doc_type not in existing_types:
                    supabase.table("documents").insert({
                        "user_id": user_id,
                        "doc_type": doc_type,
                        "storage_path": "seeded_via_intake",
                        "verification_status": "verified"
                    }).execute()

            # 4. Fetch active schemes from database (fallback to local verified schemes if empty/error)
            schemes = []
            slug_to_uuid = {}
            try:
                db_schemes = supabase.table("schemes").select("*").eq("is_active", True).execute()
                for row in db_schemes.data:
                    schemes.append(Scheme(
                        scheme_id=row["scheme_id"],
                        scheme_name=row["scheme_name"],
                        scheme_category=row["scheme_category"],
                        issuing_authority=row["issuing_authority"],
                        eligibility_rules=EligibilityRules(**row["eligibility_rules"]),
                        benefit_summary=row["benefit_summary"],
                        benefit_value_estimate=row["benefit_value_estimate"],
                        required_documents=row["required_documents"],
                        application_url=row["application_url"]
                    ))
                    slug_to_uuid[row["scheme_id"]] = row.get("id", row["scheme_id"])
            except Exception as exc:
                logger.warning("fetch_db_schemes_failed", error=str(exc))

            if not schemes:
                schemes = list(request.app.state.schemes)
                slug_to_uuid = {s.scheme_id: s.scheme_id for s in schemes}

            # 5. Run pipeline using newly updated documents mapping

            output = await run_intake_pipeline(
                profile=profile,
                request_id=request_id,
                schemes=tuple(schemes),
                llm=request.app.state.llm,
                user_id=user_id
            )
            # Cache the normalized profile for the later /api/draft call.
            request.app.state.request_cache.set(request_id, output.normalized_profile)

            # Sync matches to eligibility_matches table in Supabase so dashboard/history queries work directly
            try:
                eligible_slugs = {s.scheme_id for s in output.response.eligible_schemes}
                eligible_uuids = {slug_to_uuid[s] for s in eligible_slugs if s in slug_to_uuid}
                if eligible_uuids:
                    supabase.table("eligibility_matches").delete().eq("user_id", user_id).not_.in_("scheme_id", list(eligible_uuids)).execute()
                else:
                    supabase.table("eligibility_matches").delete().eq("user_id", user_id).execute()
                for match in output.response.eligible_schemes:
                    scheme_uuid = slug_to_uuid.get(match.scheme_id)
                    if scheme_uuid:
                        supabase.table("eligibility_matches").upsert({
                            "user_id": user_id,
                            "scheme_id": scheme_uuid,
                            "match_score": match.eligibility_match_score,
                            "missing_documents": match.missing_documents,
                            "priority_rank": match.priority_rank,
                            "matched_at": "now()"
                        }, on_conflict="user_id,scheme_id").execute()
            except Exception as exc:
                logger.warning("sync_eligibility_matches_failed", error=str(exc))

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
        auth: AuthenticatedUser = Depends(get_current_user_client)
    ):
        user_id = auth.user_id
        supabase = auth.supabase
        structlog.contextvars.bind_contextvars(request_id=request_id)
        try:
            
            # Fetch scheme from global cache
            scheme: Scheme | None = request.app.state.schemes_by_id.get(scheme_id)
            if scheme is None:
                # Try fetching from DB if not in static list
                db_scheme = supabase.table("schemes").select("*").eq("scheme_id", scheme_id).execute()
                if db_scheme.data:
                    row = db_scheme.data[0]
                    scheme = Scheme(
                        scheme_id=row["scheme_id"],
                        scheme_name=row["scheme_name"],
                        scheme_category=row["scheme_category"],
                        issuing_authority=row["issuing_authority"],
                        eligibility_rules=EligibilityRules(**row["eligibility_rules"]),
                        benefit_summary=row["benefit_summary"],
                        benefit_value_estimate=row["benefit_value_estimate"],
                        required_documents=row["required_documents"],
                        application_url=row["application_url"]
                    )
            
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

    # ── Document Vault Endpoints (JWT Protected) ──

    @app.post("/api/documents/upload")
    async def upload_document(
        request: Request,
        doc_type: str = Form(...),
        file: UploadFile = File(...),
        auth: AuthenticatedUser = Depends(get_current_user_client)
    ):
        user_id = auth.user_id
        supabase = auth.supabase
        try:
            
            # Enforce owner-prefixed unique path structure {user_id}/{doc_type}/{unique_filename}
            unique_filename = f"{uuid.uuid4()}_{file.filename}"
            storage_path = f"{user_id}/{doc_type}/{unique_filename}"
            
            file_bytes = await file.read()
            
            # Upload to private citizen-documents bucket
            supabase.storage.from_("citizen-documents").upload(
                path=storage_path,
                file=file_bytes,
                file_options={"content-type": file.content_type}
            )
            
            # OCR Processing
            ocr_provider = OCRSpaceProvider()
            try:
                extracted_data, confidence = ocr_provider.extract(file_bytes, file.filename, doc_type)
            except Exception:
                extracted_data, confidence = None, 0.0
                
            # Insert into database
            db_res = supabase.table("documents").insert({
                "user_id": user_id,
                "doc_type": doc_type,
                "storage_path": storage_path,
                "verification_status": "pending",
                "extracted_data": extracted_data,
                "extraction_confidence": confidence
            }).execute()
            
            doc_id = db_res.data[0]["id"]
            
            # Generate short-lived signed URL (300s TTL)
            signed_url_res = supabase.storage.from_("citizen-documents").create_signed_url(storage_path, expires_in=300)
            signed_url = signed_url_res.get("signedURL") or ""
            
            return {
                "document_id": doc_id,
                "doc_type": doc_type,
                "verification_status": "pending",
                "extracted_data": extracted_data,
                "extraction_confidence": confidence,
                "signed_url": signed_url
            }
        except Exception as exc:
            capture_exception(exc)
            logger.error("upload_failed", error=str(exc))
            return JSONResponse(
                status_code=500,
                content=_error_payload("Failed to process document upload.", ErrorCode.INTERNAL_ERROR)
            )

    @app.post("/api/documents/{doc_id}/confirm")
    async def confirm_document(
        doc_id: str,
        confirmed_data: dict,
        auth: AuthenticatedUser = Depends(get_current_user_client)
    ):
        user_id = auth.user_id
        supabase = auth.supabase
        try:
            
            # Verify owner
            doc_res = supabase.table("documents").select("*").eq("id", doc_id).eq("user_id", user_id).execute()
            if not doc_res.data:
                raise HTTPException(status_code=404, detail="Document not found or access denied")
                
            doc = doc_res.data[0]
            doc_type = doc["doc_type"]
            
            # 1. Update verification_status to verified and merge confirmed data
            supabase.table("documents").update({
                "verification_status": "verified",
                "extracted_data": confirmed_data
            }).eq("id", doc_id).execute()
            
            # 2. Update citizen_profiles if fields correspond to demographic attributes
            profile_res = supabase.table("citizen_profiles").select("*").eq("user_id", user_id).eq("is_current", True).execute()
            if profile_res.data:
                p = profile_res.data[0]
                updated_fields = {}
                
                if doc_type == "income_certificate" and "annual_income" in confirmed_data:
                    updated_fields["annual_income"] = float(confirmed_data["annual_income"])
                elif doc_type == "caste_certificate" and "social_category" in confirmed_data:
                    updated_fields["social_category"] = confirmed_data["social_category"]
                elif doc_type == "disability_certificate" and "disability_status" in confirmed_data:
                    updated_fields["disability_status"] = confirmed_data["disability_status"]
                    
                if updated_fields:
                    supabase.table("citizen_profiles").update({"is_current": False}).eq("user_id", user_id).eq("is_current", True).execute()
                    
                    new_profile = {
                        "user_id": user_id,
                        "full_name": p["full_name"],
                        "age": p["age"],
                        "gender": p["gender"],
                        "state": p["state"],
                        "district": p["district"],
                        "annual_income": updated_fields.get("annual_income", float(p["annual_income"])),
                        "occupation": p["occupation"],
                        "social_category": updated_fields.get("social_category", p["social_category"]),
                        "disability_status": updated_fields.get("disability_status", p["disability_status"]),
                        "family_size": p["family_size"],
                        "has_bpl_card": p["has_bpl_card"],
                        "land_owned_acres": float(p["land_owned_acres"]),
                        "education_level": p["education_level"],
                        "is_current": True
                    }
                    supabase.table("citizen_profiles").insert(new_profile).execute()
                    
            return {"status": "success", "message": "Document confirmed and profile updated."}
        except HTTPException:
            raise
        except Exception as exc:
            capture_exception(exc)
            logger.error("confirm_failed", error=str(exc))
            return JSONResponse(
                status_code=500,
                content=_error_payload("Failed to confirm document parameters.", ErrorCode.INTERNAL_ERROR)
            )

    @app.get("/api/documents")
    async def list_documents(auth: AuthenticatedUser = Depends(get_current_user_client)):
        user_id = auth.user_id
        supabase = auth.supabase
        try:
            res = supabase.table("documents").select("*").eq("user_id", user_id).execute()
            
            docs = []
            for row in res.data:
                try:
                    signed_url_res = supabase.storage.from_("citizen-documents").create_signed_url(row["storage_path"], expires_in=300)
                    signed_url = signed_url_res.get("signedURL") or ""
                except Exception:
                    signed_url = ""
                    
                docs.append({
                    "id": row["id"],
                    "doc_type": row["doc_type"],
                    "storage_path": row["storage_path"],
                    "verification_status": row["verification_status"],
                    "extracted_data": row["extracted_data"],
                    "extraction_confidence": row["extraction_confidence"],
                    "uploaded_at": row["uploaded_at"],
                    "signed_url": signed_url
                })
            return docs
        except Exception as exc:
            capture_exception(exc)
            logger.error("list_documents_failed", error=str(exc))
            return JSONResponse(
                status_code=500,
                content=_error_payload("Failed to fetch documents list.", ErrorCode.INTERNAL_ERROR)
            )

    # ── Edge Function Callback Endpoints (Internal Secret Secured) ──

    @app.post("/api/internal/match-profile")
    async def match_profile(
        request: Request,
        body: dict,
        x_secret: str = Depends(verify_internal_secret)
    ):
        user_id = body.get("user_id")
        if not user_id:
            return JSONResponse(status_code=400, content={"error": "Missing user_id"})
            
        try:
            supabase = get_service_role_client()
            
            # Fetch active profile
            profile_res = supabase.table("citizen_profiles").select("*").eq("user_id", user_id).eq("is_current", True).execute()
            if not profile_res.data:
                return {"status": "no_current_profile", "user_id": user_id}
                
            p = profile_res.data[0]
            
            # Query documents
            docs_res = supabase.table("documents").select("doc_type").eq("user_id", user_id).neq("verification_status", "rejected").execute()
            db_docs = {d["doc_type"] for d in docs_res.data}
            gov_ids = {
                "aadhaar": "aadhaar" in db_docs,
                "income_certificate": "income_certificate" in db_docs,
                "caste_certificate": "caste_certificate" in db_docs,
                "ration_card": "ration_card" in db_docs
            }
            
            # Build Pydantic profile representation
            profile = CitizenProfile(
                full_name=p["full_name"],
                age=p["age"],
                gender=Gender(p["gender"]),
                state=p["state"],
                district=p["district"],
                annual_income=float(p["annual_income"]),
                occupation=Occupation(p["occupation"]),
                social_category=SocialCategory(p["social_category"]),
                disability_status=DisabilityStatus(p["disability_status"]),
                family_size=p["family_size"],
                has_bpl_card=p["has_bpl_card"],
                land_owned_acres=float(p["land_owned_acres"]),
                education_level=EducationLevel(p["education_level"]),
                gov_id_available=gov_ids
            )
            
            # Fetch active schemes
            db_schemes = supabase.table("schemes").select("*").eq("is_active", True).execute()
            schemes = []
            slug_to_uuid = {}
            for row in db_schemes.data:
                schemes.append(Scheme(
                    scheme_id=row["scheme_id"],
                    scheme_name=row["scheme_name"],
                    scheme_category=row["scheme_category"],
                    issuing_authority=row["issuing_authority"],
                    eligibility_rules=EligibilityRules(**row["eligibility_rules"]),
                    benefit_summary=row["benefit_summary"],
                    benefit_value_estimate=row["benefit_value_estimate"],
                    required_documents=row["required_documents"],
                    application_url=row["application_url"]
                ))
                slug_to_uuid[row["scheme_id"]] = row["id"]
                
            # Run matching pipeline
            output = await run_intake_pipeline(
                profile=profile,
                request_id=str(uuid.uuid4()),
                schemes=tuple(schemes),
                llm=request.app.state.llm,
                user_id=user_id
            )
            
            # Identify UUIDs of eligible schemes
            eligible_slugs = {s.scheme_id for s in output.response.eligible_schemes}
            eligible_uuids = {slug_to_uuid[s] for s in eligible_slugs if s in slug_to_uuid}
            
            # Delete matches no longer eligible
            if eligible_uuids:
                supabase.table("eligibility_matches").delete().eq("user_id", user_id).not_.in_("scheme_id", list(eligible_uuids)).execute()
            else:
                supabase.table("eligibility_matches").delete().eq("user_id", user_id).execute()
                
            # Upsert eligible matches (idempotent notification database trigger handles notification row insertion)
            for match in output.response.eligible_schemes:
                scheme_uuid = slug_to_uuid.get(match.scheme_id)
                if scheme_uuid:
                    supabase.table("eligibility_matches").upsert({
                        "user_id": user_id,
                        "scheme_id": scheme_uuid,
                        "match_score": match.eligibility_match_score,
                        "missing_documents": match.missing_documents,
                        "priority_rank": match.priority_rank,
                        "matched_at": "now()"
                    }, on_conflict="user_id,scheme_id").execute()
                    
            return {"status": "success", "eligible_count": len(eligible_slugs)}
        except Exception as exc:
            capture_exception(exc)
            logger.error("match_profile_failed", error=str(exc))
            return JSONResponse(status_code=500, content={"error": "Failed to re-match profile."})

    @app.post("/api/internal/match-scheme")
    async def match_scheme(
        request: Request,
        body: dict,
        x_secret: str = Depends(verify_internal_secret)
    ):
        scheme_id = body.get("scheme_id")
        candidate_user_ids = body.get("candidate_user_ids")
        if not scheme_id or not candidate_user_ids:
            return JSONResponse(status_code=400, content={"error": "Missing scheme_id or candidate_user_ids"})
            
        try:
            supabase = get_service_role_client()
            
            # Fetch scheme
            scheme_res = supabase.table("schemes").select("*").or_(f"id.eq.{scheme_id},scheme_id.eq.{scheme_id}").execute()
            if not scheme_res.data:
                return JSONResponse(status_code=404, content={"error": "Scheme not found"})
                
            row = scheme_res.data[0]
            scheme = Scheme(
                scheme_id=row["scheme_id"],
                scheme_name=row["scheme_name"],
                scheme_category=row["scheme_category"],
                issuing_authority=row["issuing_authority"],
                eligibility_rules=EligibilityRules(**row["eligibility_rules"]),
                benefit_summary=row["benefit_summary"],
                benefit_value_estimate=row["benefit_value_estimate"],
                required_documents=row["required_documents"],
                application_url=row["application_url"]
            )
            scheme_uuid = row["id"]
            
            processed = []
            for user_id in candidate_user_ids:
                profile_res = supabase.table("citizen_profiles").select("*").eq("user_id", user_id).eq("is_current", True).execute()
                if not profile_res.data:
                    continue
                p = profile_res.data[0]
                
                # Fetch documents
                docs_res = supabase.table("documents").select("doc_type").eq("user_id", user_id).neq("verification_status", "rejected").execute()
                db_docs = {d["doc_type"] for d in docs_res.data}
                gov_ids = {
                    "aadhaar": "aadhaar" in db_docs,
                    "income_certificate": "income_certificate" in db_docs,
                    "caste_certificate": "caste_certificate" in db_docs,
                    "ration_card": "ration_card" in db_docs
                }
                
                profile = CitizenProfile(
                    full_name=p["full_name"],
                    age=p["age"],
                    gender=Gender(p["gender"]),
                    state=p["state"],
                    district=p["district"],
                    annual_income=float(p["annual_income"]),
                    occupation=Occupation(p["occupation"]),
                    social_category=SocialCategory(p["social_category"]),
                    disability_status=DisabilityStatus(p["disability_status"]),
                    family_size=p["family_size"],
                    has_bpl_card=p["has_bpl_card"],
                    land_owned_acres=float(p["land_owned_acres"]),
                    education_level=EducationLevel(p["education_level"]),
                    gov_id_available=gov_ids
                )
                
                from .agents.eligibility_agent import evaluate_scheme
                result = evaluate_scheme(profile, scheme)
                if result.eligible:
                    missing_docs = missing_documents_for_scheme(profile, scheme, user_id=user_id)
                    supabase.table("eligibility_matches").upsert({
                        "user_id": user_id,
                        "scheme_id": scheme_uuid,
                        "match_score": result.score,
                        "missing_documents": missing_docs,
                        "priority_rank": 1,
                        "matched_at": "now()"
                    }, on_conflict="user_id,scheme_id").execute()
                    processed.append({"user_id": user_id, "eligible": True})
                else:
                    supabase.table("eligibility_matches").delete().eq("user_id", user_id).eq("scheme_id", scheme_uuid).execute()
                    processed.append({"user_id": user_id, "eligible": False})
                    
            return {"status": "success", "processed": processed}
        except Exception as exc:
            capture_exception(exc)
            logger.error("match_scheme_failed", error=str(exc))
            return JSONResponse(status_code=500, content={"error": "Failed to run scheme matching."})

    # ── Schemes Search Endpoint (Public Browse) ──

    @app.get("/api/schemes/search")
    async def search_schemes(q: str = Query(..., min_length=1)):
        try:
            supabase = get_service_role_client()
            res = supabase.rpc("search_schemes", {"query_text": q}).execute()
            return {"results": res.data}
        except Exception as exc:
            capture_exception(exc)
            logger.error("search_failed", error=str(exc))
            return JSONResponse(
                status_code=500,
                content=_error_payload("An error occurred while searching schemes.", ErrorCode.INTERNAL_ERROR)
            )

    # ── Notifications Endpoints (JWT Protected) ──

    @app.get("/api/notifications")
    async def get_notifications(
        page: int = 1,
        limit: int = 20,
        auth: AuthenticatedUser = Depends(get_current_user_client)
    ):
        user_id = auth.user_id
        supabase = auth.supabase
        try:
            offset = (page - 1) * limit
            res = (
                supabase.table("notifications")
                .select("*")
                .eq("user_id", user_id)
                .order("read_at", nulls_first=True)
                .order("created_at", desc=True)
                .range(offset, offset + limit - 1)
                .execute()
            )
            return {"page": page, "limit": limit, "notifications": res.data}
        except Exception as exc:
            capture_exception(exc)
            logger.error("notifications_fetch_failed", error=str(exc))
            return JSONResponse(
                status_code=500,
                content=_error_payload("Failed to retrieve notifications.", ErrorCode.INTERNAL_ERROR)
            )

    @app.post("/api/notifications/{notification_id}/read")
    async def mark_notification_read(
        notification_id: str,
        auth: AuthenticatedUser = Depends(get_current_user_client)
    ):
        user_id = auth.user_id
        supabase = auth.supabase
        try:
            res = supabase.table("notifications").update({"read_at": "now()"}).eq("id", notification_id).eq("user_id", user_id).execute()
            if not res.data:
                raise HTTPException(status_code=404, detail="Notification not found")
            return {"status": "success", "notification": res.data[0]}
        except HTTPException:
            raise
        except Exception as exc:
            capture_exception(exc)
            logger.error("notification_read_failed", error=str(exc))
            return JSONResponse(
                status_code=500,
                content=_error_payload("Failed to update notification status.", ErrorCode.INTERNAL_ERROR)
            )

    # ── Admin endpoints (JWT + Role checked) ──

    @app.post("/api/admin/schemes")
    async def create_scheme(
        request: Request,
        body: dict,
        authorization: str | None = Header(None, alias="Authorization")
    ):
        if not authorization or not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content=_error_payload("Bearer token required", ErrorCode.INVALID_INPUT)
            )
        token = authorization.split(" ")[1]
        settings = get_settings()
        try:
            payload = jwt.decode(token, settings.supabase_jwt_secret, algorithms=["HS256"], audience="authenticated")
            app_meta = payload.get("app_metadata", {})
            user_meta = payload.get("user_metadata", {})
            is_admin = app_meta.get("is_admin") or user_meta.get("is_admin") or payload.get("email") == "admin@yojanasaathi.in"
            if not is_admin:
                return JSONResponse(
                    status_code=403,
                    content=_error_payload("Forbidden: Admin access required", ErrorCode.INVALID_INPUT)
                )
        except Exception as err:
            logger.error("admin_jwt_failed", error=str(err))
            return JSONResponse(
                status_code=401,
                content=_error_payload("Invalid admin session", ErrorCode.INVALID_INPUT)
            )
            
        try:
            supabase = get_service_role_client()
            res = supabase.table("schemes").insert(body).execute()
            return {"status": "created", "scheme": res.data[0]}
        except Exception as exc:
            capture_exception(exc)
            return JSONResponse(
                status_code=400,
                content=_error_payload(f"Failed to create scheme: {str(exc)}", ErrorCode.INVALID_INPUT)
            )

    # ── Chat Q&A Endpoint (Public) ──

    @app.post("/api/chat", response_model=ChatResponse)
    async def chat(request: Request, body: ChatRequest) -> ChatResponse:
        try:
            schemes: tuple[Scheme, ...] = request.app.state.schemes
            llm: GeminiClient = request.app.state.llm

            # Find schemes relevant to the question
            import re as _re
            q = body.message.lower()
            q_clean = _re.sub(r"[^a-z0-9\s-]", "", q)

            def _score_scheme(s: Scheme) -> int:
                name = s.scheme_name.lower()
                cat = s.scheme_category.lower()
                summary = s.benefit_summary.lower()
                score = 0
                # Exact phrase match in name
                if q_clean in name:
                    score += 100
                # All words match in name
                words = [w for w in q_clean.split() if len(w) > 2]
                name_matches = sum(1 for w in words if w in name)
                summary_matches = sum(1 for w in words if w in summary)
                cat_matches = sum(1 for w in words if w in cat)
                score += name_matches * 20 + summary_matches * 5 + cat_matches * 10
                return score

            scored = [(s, _score_scheme(s)) for s in schemes if _score_scheme(s) > 0]
            scored.sort(key=lambda x: -x[1])
            matched = [s for s, _ in scored[:5]]

            # Build context from matched schemes
            context = ""
            sources = []
            if matched:
                lines = []
                for s in matched:
                    lines.append(f"- {s.scheme_name} ({s.scheme_category}): {s.benefit_summary}")
                    sources.append(s.scheme_name)
                context = "\n".join(lines)

            prompt = f"""You are YojanaSaathi, a helpful assistant for Indian government welfare schemes.
Answer the user's question using ONLY the scheme information below. If the information
isn't in the provided schemes, say you don't have that information yet.

Available schemes:
{context or "No specific schemes matched — answer generally if possible."}

User question: {body.message}

Give a concise, helpful answer. If relevant schemes were found, mention them by name
and explain their benefits, eligibility, or how to apply based on the data above."""

            reply, _used_llm = await llm.polish(prompt, fallback="")
            
            if not reply:
                # Deterministic fallback: build from real scheme data
                if matched:
                    lines = [f"I found some relevant schemes for you:"]
                    for s in matched:
                        cat = s.scheme_category.replace("SchemeCategory.", "").replace("_", " ").title() if s.scheme_category else ""
                        lines.append(f"\n**{s.scheme_name}** ({cat})")
                        lines.append(f"  {s.benefit_summary}")
                        lines.append(f"  Benefit estimate: {s.benefit_value_estimate}")
                        if s.required_documents:
                            lines.append(f"  Required docs: {', '.join(s.required_documents)}")
                        lines.append(f"  Apply: {s.application_url or 'Contact issuing authority'}")
                    reply = "\n".join(lines)
                else:
                    reply = (
                        "I couldn't find specific schemes matching your question. "
                        "Try asking about a specific scheme name, category (e.g. agriculture, education, health), "
                        "or benefit type. You can also browse all schemes on the Schemes page."
                    )

            return ChatResponse(reply=reply, sources=sources)

        except Exception as exc:
            capture_exception(exc)
            logger.error("chat_failed", error=str(exc))
            return ChatResponse(
                reply="I encountered an error while processing your question. Please try again.",
                sources=[]
            )

    # ── Health Route ──

    @app.get("/api/health", response_model=HealthResponse)
    async def health(request: Request) -> HealthResponse:
        return HealthResponse(status="ok", agents_online=list(AGENTS_ONLINE))


app = create_app()
