"""Internal models for scheme definitions loaded from data/schemes.json.

These are not part of the public API contract, but validating the scheme file at
load time turns a malformed data entry into a clear startup error rather than a
silent eligibility bug.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, field_validator

from .enums import GOV_ID_KEYS, GenderRestriction, SchemeCategory


class EligibilityRules(BaseModel):
    """Deterministic eligibility rules for one scheme.

    Semantics (see eligibility_agent): a null number or an empty list means
    "no restriction" for that dimension, NOT "nobody qualifies".
    """

    model_config = ConfigDict(extra="forbid")

    min_age: int | None = None
    max_age: int | None = None
    max_annual_income: float | None = None
    allowed_occupations: list[str] = Field(default_factory=list)
    allowed_social_categories: list[str] = Field(default_factory=list)
    required_disability_status: list[str] = Field(default_factory=list)
    state_restricted_to: list[str] = Field(default_factory=list)
    gender_restricted_to: GenderRestriction = GenderRestriction.ANY


class Scheme(BaseModel):
    """One welfare scheme definition from data/schemes.json."""

    model_config = ConfigDict(extra="forbid")

    scheme_id: str = Field(min_length=1)
    scheme_name: str = Field(min_length=1)
    scheme_category: SchemeCategory
    issuing_authority: str = Field(min_length=1)
    eligibility_rules: EligibilityRules
    benefit_summary: str
    benefit_value_estimate: str
    required_documents: list[str] = Field(default_factory=list)
    application_url: str
    eligibility_text_raw: str | None = None
    official_source_url: str | None = None
    last_verified_date: str | None = None
    eligibility_verified: bool = False

    @field_validator("scheme_id")
    @classmethod
    def _scheme_id_is_slug(cls, v: str) -> str:
        """scheme_id must be lowercase, hyphenated (e.g. 'pmfby-001')."""
        if v != v.lower() or " " in v or "_" in v:
            raise ValueError(
                f"scheme_id must be lowercase and hyphenated (no spaces/underscores): {v!r}"
            )
        return v

    @field_validator("required_documents")
    @classmethod
    def _docs_match_gov_id_keys(cls, v: list[str]) -> list[str]:
        """required_documents must use exactly the 4 gov_id_available keys."""
        invalid = [d for d in v if d not in GOV_ID_KEYS]
        if invalid:
            raise ValueError(
                f"required_documents must be a subset of {GOV_ID_KEYS}; got invalid: {invalid}"
            )
        return v
