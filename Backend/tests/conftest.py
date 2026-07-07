"""Shared pytest fixtures and helpers for the backend test suite."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

import pytest

# A complete, contract-valid raw request body. Tests copy and mutate this.
VALID_PROFILE_DICT: dict[str, Any] = {
    "full_name": "Asha Devi",
    "age": 34,
    "gender": "female",
    "state": "Bihar",
    "district": "Patna",
    "annual_income": 180000,
    "occupation": "farmer",
    "social_category": "obc",
    "disability_status": "none",
    "family_size": 4,
    "has_bpl_card": True,
    "land_owned_acres": 2.5,
    "education_level": "secondary",
    "gov_id_available": {
        "aadhaar": True,
        "income_certificate": False,
        "caste_certificate": True,
        "ration_card": True,
    },
}


def make_profile_dict(**overrides: Any) -> dict[str, Any]:
    """Return a deep copy of the valid profile with top-level fields overridden."""
    data = deepcopy(VALID_PROFILE_DICT)
    data.update(overrides)
    return data


@pytest.fixture
def valid_profile_dict() -> dict[str, Any]:
    return deepcopy(VALID_PROFILE_DICT)
