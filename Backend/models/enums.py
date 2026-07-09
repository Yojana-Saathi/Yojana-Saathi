"""Shared enum types for the frozen API contract.

These enums encode the exact lowercase snake_case values shared by the backend
Pydantic models and frontend TypeScript types.
Any value outside these sets must be rejected with a 422 by Pydantic.
"""

from __future__ import annotations

from enum import Enum


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class Occupation(str, Enum):
    FARMER = "farmer"
    DAILY_WAGE = "daily_wage"
    STUDENT = "student"
    SELF_EMPLOYED = "self_employed"
    SALARIED = "salaried"
    UNEMPLOYED = "unemployed"
    OTHER = "other"


class SocialCategory(str, Enum):
    GENERAL = "general"
    OBC = "obc"
    SC = "sc"
    ST = "st"
    EWS = "ews"


class DisabilityStatus(str, Enum):
    NONE = "none"
    PHYSICAL = "physical"
    VISUAL = "visual"
    HEARING = "hearing"
    INTELLECTUAL = "intellectual"
    MULTIPLE = "multiple"


class EducationLevel(str, Enum):
    NONE = "none"
    PRIMARY = "primary"
    SECONDARY = "secondary"
    HIGHER_SECONDARY = "higher_secondary"
    GRADUATE = "graduate"
    POSTGRADUATE = "postgraduate"


class SchemeCategory(str, Enum):
    EDUCATION = "education"
    HEALTH = "health"
    AGRICULTURE = "agriculture"
    DISABILITY = "disability"
    WOMEN_CHILD = "women_child"
    HOUSING = "housing"
    PENSION = "pension"
    OTHER = "other"


class ProcessingStatus(str, Enum):
    SUCCESS = "success"
    PARTIAL_SUCCESS = "partial_success"
    ERROR = "error"


class ErrorCode(str, Enum):
    INVALID_INPUT = "INVALID_INPUT"
    AGENT_TIMEOUT = "AGENT_TIMEOUT"
    INTERNAL_ERROR = "INTERNAL_ERROR"


class GenderRestriction(str, Enum):
    """Scheme-side gender restriction; 'any' means no restriction."""

    MALE = "male"
    FEMALE = "female"
    ANY = "any"


# The extensible government-ID document keys, used by both gov_id_available (request)
# and required_documents / missing_documents (response). Order is canonical.
GOV_ID_KEYS: tuple[str, ...] = (
    "aadhaar",
    "income_certificate",
    "caste_certificate",
    "ration_card",
    "domicile_certificate",
    "disability_certificate",
    "land_record",
    "bank_passbook",
    "voter_id",
    "education_marksheet",
)
