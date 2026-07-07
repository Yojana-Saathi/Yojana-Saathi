"""Thin Gemini client for LANGUAGE GENERATION ONLY.

Hard rule: the LLM is used exclusively to make benefit summaries and application
drafts read more naturally. It is NEVER asked to make an eligibility decision.
Every call has a timeout and a fallback model, and ANY failure (missing key,
timeout, API error, empty response) results in the caller's deterministic
fallback text being used instead of an error.
"""

from __future__ import annotations

import asyncio

from ..config import Settings
from ..core.logging_config import get_logger

logger = get_logger(__name__)


class GeminiClient:
    """Async wrapper around google-genai with timeout + fallback + graceful degradation."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = None
        self._init_error: str | None = None
        if settings.llm_active:
            self._try_init_client()

    def _try_init_client(self) -> None:
        try:
            from google import genai

            self._client = genai.Client(api_key=self._settings.gemini_api_key)
        except Exception as exc:  # missing dep, bad key format, etc.
            self._init_error = str(exc)
            self._client = None
            logger.warning("gemini_init_failed", error=str(exc))

    @property
    def available(self) -> bool:
        return self._client is not None

    async def _generate_once(self, model: str, prompt: str) -> str | None:
        """One generation attempt against a specific model, bounded by timeout."""
        client = self._client
        if client is None:
            return None

        def _call() -> str:
            resp = client.models.generate_content(model=model, contents=prompt)
            return (getattr(resp, "text", None) or "").strip()

        try:
            text = await asyncio.wait_for(
                asyncio.to_thread(_call),
                timeout=self._settings.gemini_timeout_seconds,
            )
            return text or None
        except asyncio.TimeoutError:
            logger.warning("gemini_timeout", model=model)
            return None
        except Exception as exc:  # any API/network error
            logger.warning("gemini_error", model=model, error=str(exc))
            return None

    async def polish(self, prompt: str, fallback: str) -> tuple[str, bool]:
        """Return (text, used_llm).

        Tries the primary model, then the fallback model, then returns the
        provided deterministic ``fallback`` text. ``used_llm`` is True only when
        the LLM produced the returned text.
        """
        if not self.available:
            return fallback, False

        for model in (self._settings.gemini_model, self._settings.gemini_fallback_model):
            text = await self._generate_once(model, prompt)
            if text:
                return text, True

        return fallback, False
