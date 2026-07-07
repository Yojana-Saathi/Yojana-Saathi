# YojanaSaathi — Backend Documentation

> A government welfare-scheme **eligibility engine**. A citizen submits a single
> profile; the backend deterministically decides which of 20 Indian government
> schemes they qualify for, ranks them by value, tells them which documents they
> are missing, and can draft a ready-to-submit application on demand.

This document explains **everything** in the `Backend/` folder: the architecture,
every "agent", every module, the data contract, the security model, the LLM
policy, and how to run and test it.

---

## Table of Contents

1. [Design philosophy (read this first)](#1-design-philosophy-read-this-first)
2. [High-level architecture](#2-high-level-architecture)
3. [Folder & file map](#3-folder--file-map)
4. [The request lifecycle end-to-end](#4-the-request-lifecycle-end-to-end)
5. [The five agents in detail](#5-the-five-agents-in-detail)
6. [The pipeline orchestrator](#6-the-pipeline-orchestrator)
7. [Data models & the frozen API contract](#7-data-models--the-frozen-api-contract)
8. [The scheme dataset](#8-the-scheme-dataset)
9. [Core infrastructure modules](#9-core-infrastructure-modules)
10. [The LLM layer (Gemini)](#10-the-llm-layer-gemini)
11. [Configuration & environment](#11-configuration--environment)
12. [Security model](#12-security-model)
13. [API endpoints reference](#13-api-endpoints-reference)
14. [Testing](#14-testing)
15. [Running & deploying](#15-running--deploying)

---

## 1. Design philosophy (read this first)

Three principles drive every decision in this backend:

### 1.1 Eligibility is deterministic — never an LLM decision

This is the single most important rule in the codebase. The system touches **real
legal entitlements**, so the question *"is this person eligible for this scheme?"*
is answered exclusively by a hand-written rule engine
(`agents/eligibility_agent.py`). The LLM is **never** asked to make that call.

Every eligibility verdict is:
- **Auditable** — you can trace exactly which rule passed or failed.
- **Reproducible** — same input + same `schemes.json` → identical output, always.

### 1.2 The LLM is language polish only, and always optional

Gemini is used for exactly two cosmetic things:
- Rewriting a scheme's `benefit_summary` into friendlier phrasing.
- Rewriting a drafted application letter into more natural formal English.

If the LLM is missing, misconfigured, times out, or errors — **the system degrades
gracefully** to deterministic template text. The API never fails because of the
LLM. A partial degradation is reported honestly as `processing_status:
"partial_success"`.

### 1.3 The API contract is frozen

The request/response shapes match a `API_CONTRACT.md` spec exactly. All Pydantic
models use `extra="forbid"` (unknown fields are rejected with a `422`), enum
values are exact lowercase snake_case, and numeric fields refuse string values.
`eligible_schemes` is **always an array, never null** — an empty match is a valid,
successful outcome, not an error.

---

## 2. High-level architecture

```
                          POST /api/intake
                                │
                                ▼
        ┌─────────────────────────────────────────────────┐
        │             run_intake_pipeline()                │
        │                                                  │
        │  1. Intake      normalize + sanitize profile     │
        │  2. Eligibility deterministic rule engine        │
        │  3. Ranking     assign priority_rank             │
        │  4. DocGap      compute missing documents        │
        │  5. (optional)  LLM polish of benefit summaries  │
        └─────────────────────────────────────────────────┘
                                │
                                ▼
                        IntakeResponse  ──►  request_cache[request_id] = profile
                                                     │
                          GET /api/draft/{scheme_id}?request_id=…
                                                     │
                                                     ▼
                                          Drafter agent (template + optional LLM)
                                                     │
                                                     ▼
                                              DraftResponse
```

- **Framework:** FastAPI + Uvicorn (ASGI), Python 3.12.
- **Validation:** Pydantic v2 (request/response models + scheme file validation).
- **State:** stateless request handling, except an in-memory TTL cache that holds
  the normalized profile between the `intake` and `draft` calls (keyed by
  `request_id`).
- **No database.** Schemes load from a JSON file at startup; nothing is persisted.

---

## 3. Folder & file map

```
Backend/
├── main.py                     # FastAPI app: lifespan, routes, error handlers
├── config.py                   # Typed Settings (pydantic-settings), env-driven
├── pytest.ini                  # Test config (asyncio auto mode)
├── requirements.txt            # Pinned exact dependency versions
├── Dockerfile                  # Multi-stage build, non-root, healthcheck
├── .env.example                # Env variable NAMES (no secrets)
│
├── agents/                     # The five "agents" + orchestrator
│   ├── intake_agent.py         # 1. normalize + sanitize the profile
│   ├── eligibility_agent.py    # 2. deterministic rule engine (the core)
│   ├── ranking_agent.py        # 3. priority ranking
│   ├── docgap_agent.py         # 4. missing-document computation
│   ├── drafter_agent.py        # 5. application-letter drafting (on demand)
│   └── pipeline.py             # orchestrates agents 1-4 (+ LLM polish)
│
├── models/                     # Pydantic contract & internal models
│   ├── enums.py                # All enum types + GOV_ID_KEYS
│   ├── request_models.py       # CitizenProfile, GovIdAvailable (request)
│   ├── response_models.py      # IntakeResponse, DraftResponse, etc.
│   └── scheme_models.py        # Scheme, EligibilityRules (internal)
│
├── core/                       # Cross-cutting infrastructure
│   ├── scheme_loader.py        # load + validate schemes.json at startup
│   ├── security.py             # rate limiter + CORS wiring
│   ├── sanitization.py         # HTML/script stripping for free text
│   ├── request_cache.py        # in-memory TTL/LRU cache (request_id → profile)
│   └── logging_config.py       # structlog + Sentry setup
│
├── llm/
│   └── gemini_client.py        # thin async Gemini wrapper (generation only)
│
├── data/
│   └── schemes.json            # 20 welfare scheme definitions + rules
│
└── tests/                      # pytest suite (~1,200 lines, per-agent + e2e)
    ├── conftest.py             # shared fixtures (VALID_PROFILE_DICT)
    ├── test_intake_agent.py
    ├── test_eligibility_agent.py
    ├── test_ranking_agent.py
    ├── test_docgap_agent.py
    ├── test_drafter_agent.py
    ├── test_pipeline.py
    └── test_api_integration.py
```

> The `.venv/` and `.venv_clean/` directories are local virtual environments and
> are not part of the source.

---

## 4. The request lifecycle end-to-end

### 4.1 Startup (`main.py` → `lifespan`)

On application start, the `lifespan` async context manager runs once and populates
`app.state`:

1. `get_settings()` — load and cache typed settings from the environment.
2. `configure_logging(settings)` — set up structlog (+ Sentry if a DSN is set).
3. `load_schemes()` — read, parse, and **validate** all 20 schemes from
   `data/schemes.json`. A malformed file fails **loudly at startup**.
4. Build lookups: `app.state.schemes` (tuple) and `app.state.schemes_by_id` (dict).
5. Construct the `GeminiClient` (LLM) and the `RequestCache`.
6. Log `startup_complete` with the scheme count, whether the LLM is active, and
   the environment.

### 4.2 `POST /api/intake`

1. A `request_id` (UUID) is generated and bound to the log context.
2. FastAPI validates the body against `CitizenProfile` (a `422` on any violation).
3. `run_intake_pipeline(...)` executes agents 1→4 plus optional LLM polish.
4. The **normalized profile** is stored in the request cache under `request_id`
   (so the later draft call can reuse it).
5. An `IntakeResponse` is returned; the outcome and eligible count are logged.
   The full profile is **never** logged.

### 4.3 `GET /api/draft/{scheme_id}?request_id=…`

1. Look up the scheme by id → `404` if unknown.
2. Look up the cached profile by `request_id` → `404` if unknown/expired.
3. The Drafter agent builds a deterministic letter template, then optionally
   polishes it via the LLM (falling back to the template on any failure).
4. Returns a `DraftResponse` with the letter, required documents, and next steps.

### 4.4 `GET /api/health`

Returns `{"status": "ok", "agents_online": [...]}` — a simple liveness probe used
by the Docker `HEALTHCHECK`.

---

## 5. The five agents in detail

The word "agent" here means a **single-responsibility module** in the pipeline —
not an autonomous LLM agent. Four run inside the intake pipeline; the fifth
(Drafter) runs only on the draft endpoint.

### 5.1 Intake Agent — `agents/intake_agent.py`

**Job:** turn a validated raw request into a clean, normalized profile.

Pydantic already handles schema validation (types, ranges, enum values, defaults).
The Intake agent adds what schema validation *cannot* express:

- **Defaults** (applied by the model): `disability_status → "none"`,
  `land_owned_acres → 0`.
- **Sanitization** of the free-text fields `full_name`, `state`, `district` — HTML
  and script markup is stripped (see [sanitization](#93-sanitization--coresanitizationpy)).
- **Guard:** if any free-text field is *empty after sanitization* (e.g. the input
  was pure markup), it raises `ValueError` — we never proceed with a blank name,
  state, or district.

Returns a normalized `CitizenProfile` via `model_copy(update=…)`.

### 5.2 Eligibility Reasoning Agent — `agents/eligibility_agent.py` ★ the core

**Job:** deterministically decide eligibility and compute a confidence score.

#### Rule semantics (critical)

A rule field that is `None` (for numbers) or an **empty list** means
**"NO RESTRICTION"** on that dimension — it does **not** mean "nobody qualifies".
A scheme is eligible only if **every applicable check passes**.

#### The seven rule checks

Each check is a small, independently unit-tested function returning a `RuleCheck`
(`name`, `applicable`, `passed`, `detail`). By convention `applicable=False` always
implies `passed=True`.

| Check | Rule fields | Passes when |
|-------|-------------|-------------|
| `check_age` | `min_age`, `max_age` | age within `[min, max]` (either bound may be open) |
| `check_income` | `max_annual_income` | `annual_income <= cap` |
| `check_occupation` | `allowed_occupations` | citizen's occupation is in the list |
| `check_social_category` | `allowed_social_categories` | citizen's category is in the list |
| `check_disability` | `required_disability_status` | citizen's status is in the required set |
| `check_state` | `state_restricted_to` | citizen's state matches (case-insensitive) |
| `check_gender` | `gender_restricted_to` | matches, unless restriction is `any` |

`evaluate_scheme()` runs all checks; the scheme is eligible iff `all(passed)`.

#### Confidence scoring (`eligibility_match_score`, 0.0–1.0)

For an eligible scheme, the score starts at **1.0** and subtracts penalties for
**near-boundary** conditions — an honest "this is a close call, double-check with
the authority" signal:

- Income within **10%** of the cap → `income_near_cap` → **−0.10**.
- Age within **2 years** of `min_age` → `age_near_min` → **−0.05**.
- Age within **2 years** of `max_age` → `age_near_max` → **−0.05**.

Score is clamped to `[0.0, 1.0]`. Interpretation: `>= 0.95` clearly eligible,
`~0.70–0.85` eligible but boundary-close. Ineligible schemes score `0.0`.

`find_eligible_schemes()` returns `EligibilityResult`s only for schemes the citizen
qualifies for — an empty list is a perfectly valid outcome.

### 5.3 Ranking Agent — `agents/ranking_agent.py`

**Job:** order eligible schemes and assign `priority_rank` (1 = highest priority).

Fully deterministic ordering:

1. **Value tier** — classify each scheme's `benefit_value_estimate` string into
   LOW/MEDIUM/HIGH:
   - Parse the **largest rupee figure** in the text.
   - `>= 100,000` **or** contains a high-value keyword
     (`insurance`, `pension`, `cover`, `subsidy`) → **HIGH (3)**.
   - `>= 10,000` → **MEDIUM (2)**; otherwise **LOW (1)**.
2. **Combined score** = `1.0 × value_tier + 1.0 × eligibility_match_score` (tier
   dominates, match score refines).
3. **Sort** descending by combined score. Ties break by a fixed **category
   priority** (pension → health → agriculture → disability → women_child →
   education → housing → other), then by `scheme_id` for total determinism.
4. Assign `priority_rank` starting at 1.

Empty input → empty list.

### 5.4 Document Gap Agent — `agents/docgap_agent.py`

**Job:** for each eligible scheme, list the required documents the citizen lacks.

- `available_documents(profile)` — the set of doc keys the citizen marked `True`
  in `gov_id_available`.
- `missing_documents_for_scheme(profile, scheme)` — `required_documents − available`,
  returned in the canonical `GOV_ID_KEYS` order (stable, deterministic).
- An empty list means the citizen has every document the scheme requires.

The four canonical document keys are: `aadhaar`, `income_certificate`,
`caste_certificate`, `ration_card`.

### 5.5 Application Drafter Agent — `agents/drafter_agent.py`

**Job:** generate a pre-filled application letter — **on demand only**, via
`GET /api/draft/{scheme_id}`. It is deliberately **not** run for every scheme in
the intake response (that would be wasteful).

- `build_template(profile, scheme)` — a deterministic formal letter: addressee =
  the scheme's `issuing_authority`, subject, the citizen's name/district/state,
  income, social category, and attached (available) documents.
- `build_next_steps(scheme)` — a generic 3-step submission checklist (visit CSC/
  portal, submit with documents, note the reference number).
- `draft_application(profile, scheme, llm)` — builds the template, then optionally
  polishes it via Gemini. Returns `(text, used_llm)`; **any** LLM failure returns
  the raw template with `used_llm=False`.

---

## 6. The pipeline orchestrator

**File:** `agents/pipeline.py` — `run_intake_pipeline(...)`.

Sequence for every intake request:

1. **Intake** → `normalize_profile(profile)`.
2. **Eligibility** → `find_eligible_schemes(normalized, schemes)`.
3. **Ranking** → `rank_schemes(eligible)`.
4. **DocGap + optional LLM polish** → build one `SchemeResult` per ranked scheme.

The Drafter is intentionally *not* invoked here.

### Optional benefit-summary polish (concurrent)

If the LLM is available and there are ranked schemes, all benefit summaries are
polished **concurrently** via `asyncio.gather(..., return_exceptions=True)`. Each
polish call has its own fallback to the raw summary. If **any** polish raised or
fell back, a `degraded` flag is set.

### Processing status

- All good → `processing_status = "success"`.
- Any LLM degradation → `processing_status = "partial_success"`.

The orchestrator returns a `PipelineOutput(response, normalized_profile)`. `main.py`
puts `response` on the wire and stashes `normalized_profile` in the request cache.

---

## 7. Data models & the frozen API contract

All models live in `models/` and use Pydantic v2 with `extra="forbid"`.

### 7.1 Enums — `models/enums.py`

Exact lowercase snake_case values; anything else is rejected with a `422`.

- `Gender`: `male | female | other`
- `Occupation`: `farmer | daily_wage | student | self_employed | salaried | unemployed | other`
- `SocialCategory`: `general | obc | sc | st | ews`
- `DisabilityStatus`: `none | physical | visual | hearing | intellectual | multiple`
- `EducationLevel`: `none | primary | secondary | higher_secondary | graduate | postgraduate`
- `SchemeCategory`: `education | health | agriculture | disability | women_child | housing | pension | other`
- `ProcessingStatus`: `success | partial_success | error`
- `ErrorCode`: `INVALID_INPUT | AGENT_TIMEOUT | INTERNAL_ERROR`
- `GenderRestriction` (scheme-side): `male | female | any`
- `GOV_ID_KEYS`: `("aadhaar", "income_certificate", "caste_certificate", "ration_card")`

### 7.2 Request models — `models/request_models.py`

**`CitizenProfile`** (the `POST /api/intake` body):

| Field | Type | Constraint / default |
|-------|------|----------------------|
| `full_name` | str | 1–200 chars |
| `age` | int | 0–120 |
| `gender` | Gender enum | required |
| `state` | str | 1–100 chars |
| `district` | str | 1–100 chars |
| `annual_income` | float | ≥ 0, must be a JSON number |
| `occupation` | Occupation enum | required |
| `social_category` | SocialCategory enum | required |
| `disability_status` | DisabilityStatus enum | default `"none"` |
| `family_size` | int | 1–50 |
| `has_bpl_card` | bool | required |
| `land_owned_acres` | float | ≥ 0, default `0` |
| `education_level` | EducationLevel enum | required |
| `gov_id_available` | GovIdAvailable | required |

**`GovIdAvailable`** — exactly four booleans (`aadhaar`, `income_certificate`,
`caste_certificate`, `ration_card`), `extra="forbid"`.

**Numeric-string guard:** a `field_validator` on `annual_income` and
`land_owned_acres` explicitly rejects `str` and `bool` inputs (Pydantic would
otherwise coerce `"180000"` → `180000`). `bool` is a subclass of `int`, so it is
blocked from masquerading as a number.

### 7.3 Response models — `models/response_models.py`

- **`SchemeResult`** — one eligible scheme: `scheme_id`, `scheme_name`,
  `scheme_category`, `benefit_summary`, `benefit_value_estimate`,
  `eligibility_match_score` (0–1), `priority_rank` (≥1), `missing_documents`,
  `application_url`, and `drafted_application_text` (always `null` in intake).
- **`IntakeResponse`** — `request_id`, `eligible_schemes` (**always an array**),
  `total_eligible_count`, `processing_status`, `error_message`.
- **`DraftResponse`** — `scheme_id`, `drafted_application_text`,
  `required_documents`, `next_steps`.
- **`HealthResponse`** — `status`, `agents_online`.
- **`ErrorResponse`** — the standard error shape: `processing_status="error"`,
  `error_message`, `error_code`.

### 7.4 Scheme models — `models/scheme_models.py` (internal)

Not part of the public contract, but validated at load time so a bad data entry
becomes a clear startup error rather than a silent eligibility bug.

- **`EligibilityRules`** — `min_age`, `max_age`, `max_annual_income` (nullable),
  `allowed_occupations`, `allowed_social_categories`, `required_disability_status`,
  `state_restricted_to` (lists, default empty), `gender_restricted_to` (default
  `any`).
- **`Scheme`** — `scheme_id`, `scheme_name`, `scheme_category`,
  `issuing_authority`, `eligibility_rules`, `benefit_summary`,
  `benefit_value_estimate`, `required_documents`, `application_url`.
  - Validator: `scheme_id` must be lowercase, hyphenated (no spaces/underscores).
  - Validator: `required_documents` must be a subset of the four `GOV_ID_KEYS`.

---

## 8. The scheme dataset

**File:** `data/schemes.json` — a JSON array of **20 real Indian welfare schemes**.

Coverage spans every category: agriculture (PM-KISAN, PMFBY, KALIA), housing
(PMAY-Gramin, PMAY-Urban), pensions (old-age, widow, disability), health
(Ayushman Bharat PM-JAY), education scholarships (NMMS, SC/OBC/ST post/pre-matric,
disability), women & child (Matru Vandana, Ladli Behna, Sukanya Samriddhi), and
other livelihood schemes (PM-SVANidhi, MGNREGA, NFBS).

Each entry contains the deterministic `eligibility_rules` block consumed by the
Eligibility agent, plus display fields (`benefit_summary`,
`benefit_value_estimate`, `application_url`) and `required_documents`.

Some schemes demonstrate specific rule dimensions:
- **State-restricted:** KALIA (Odisha), Ladli Behna (Madhya Pradesh).
- **Gender-restricted:** Matru Vandana, Ladli Behna, Sukanya, widow pension (female).
- **Category-restricted:** SC/OBC/ST scholarships.
- **Disability-required:** disability pension & scholarship.
- **No income cap:** PMFBY, PM-SVANidhi, MGNREGA, Sukanya (open on that dimension).

To add or edit a scheme, edit this file — no code changes needed. The loader
re-validates the whole file at startup and rejects duplicates.

---

## 9. Core infrastructure modules

### 9.1 Scheme loader — `core/scheme_loader.py`

- `load_schemes(path=None)` — reads `data/schemes.json`, parses JSON, validates
  every entry against `Scheme`, and rejects duplicate `scheme_id`s. Raises
  `SchemeDataError` on a missing file, invalid JSON, a validation failure, or a
  duplicate id — **fail loud at startup**.
- `get_schemes()` — an `lru_cache`d tuple of validated schemes.

### 9.2 Security wiring — `core/security.py`

- `build_limiter(settings)` — a slowapi `Limiter` keyed by client IP, with the
  configured default rate limit. Storage is **Redis** if `REDIS_URL` is set, else
  **in-memory** (`memory://`) — zero external deps locally. `headers_enabled=False`
  because slowapi's header injection needs a `Response` object, which would break
  endpoints returning Pydantic models.
- `configure_cors(app, settings)` — attaches `CORSMiddleware` with the **explicit
  origin allowlist** (never `"*"`), credentials allowed, methods limited to
  `GET/POST/OPTIONS`.

### 9.3 Sanitization — `core/sanitization.py`

`sanitize_text(value)` defensively strips markup from free text so nothing can
carry an injection payload downstream (into logs, drafted letters, or a future UI):

- Removes `<script>` and `<style>` blocks (including their contents).
- Strips remaining HTML tags **repeatedly** to defeat nested/malformed constructs
  like `<<b>>`.
- Unescapes HTML entities (so `&lt;script&gt;` payloads don't survive), then
  strips again.
- Drops any stray angle brackets and collapses whitespace.

### 9.4 Request cache — `core/request_cache.py`

`RequestCache` — a thread-safe, TTL + size-bounded (LRU-style) in-memory map of
`request_id → CitizenProfile`. It bridges the `intake` call (which stores the
normalized profile) and the later `draft` call (which reads it).

- TTL default **1800 s (30 min)**, max size default **1000** entries.
- `set` / `get` are guarded by a lock; `get` drops expired entries; eviction
  purges expired entries first, then evicts the oldest to honor the size cap.
- Uses `time.monotonic()` so it's immune to wall-clock changes.
- **Intentionally ephemeral:** it does not survive a restart or span multiple
  instances. Swapping in Redis/Postgres later is a drop-in change.

### 9.5 Logging — `core/logging_config.py`

- `configure_logging(settings)` — idempotent structlog setup. JSON renderer in
  production (`LOG_JSON=true`), pretty console renderer otherwise. Merges
  contextvars (so `request_id` rides along), adds level + ISO timestamp.
- **Logging policy (security):** log request *outcomes* and coarse counters with
  the `request_id` — **never** the citizen's full profile in plaintext.
- Sentry is initialized only if `SENTRY_DSN` is set, with `send_default_pii=False`.
  `capture_exception()` is a safe no-op when Sentry is absent.

---

## 10. The LLM layer (Gemini)

**File:** `llm/gemini_client.py` — `GeminiClient`.

A thin async wrapper around `google-genai`, used for **language generation only**.

- Constructed at startup. It initializes the underlying client **only if**
  `settings.llm_active` (i.e. `LLM_ENABLED` is true **and** a `GEMINI_API_KEY` is
  present). A failed init is caught and logged; `available` becomes `False`.
- `polish(prompt, fallback)` → `(text, used_llm)`:
  - Tries the **primary** model, then the **fallback** model.
  - Each attempt runs the blocking SDK call in a thread with an
    `asyncio.wait_for` **timeout** (default 8 s).
  - On timeout, API/network error, or empty response → returns the caller's
    deterministic `fallback` text with `used_llm=False`.
- **Guarantee:** no LLM failure ever propagates as an API error. Worst case, the
  user gets accurate deterministic text and the response is marked
  `partial_success`.

Default models: `gemini-2.0-flash` (primary), `gemini-1.5-flash` (fallback).

---

## 11. Configuration & environment

**File:** `config.py` — a `pydantic-settings` `Settings` class, the single source
of truth. Loaded from environment variables (and a local `.env` in development).
**No secret is ever hardcoded** — only variable names and safe non-secret defaults.

| Env var | Default | Purpose |
|---------|---------|---------|
| `ENVIRONMENT` | `development` | `development` / `production` |
| `DEBUG` | `false` | debug flag |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowlist (comma-separated, never `*`) |
| `RATE_LIMIT` | `20/minute` | per-IP rate limit |
| `REDIS_URL` | *(unset)* | if set, use Redis for rate-limit storage |
| `GEMINI_API_KEY` | *(unset)* | enables LLM polish when present |
| `GEMINI_MODEL` | `gemini-2.0-flash` | primary LLM model |
| `GEMINI_FALLBACK_MODEL` | `gemini-1.5-flash` | fallback LLM model |
| `GEMINI_TIMEOUT_SECONDS` | `8` | per-call LLM timeout |
| `LLM_ENABLED` | `true` | master LLM switch |
| `SENTRY_DSN` | *(unset)* | enables Sentry when present |
| `LOG_LEVEL` | `INFO` | log level |
| `LOG_JSON` | `true` | JSON vs console logs |
| `REQUEST_CACHE_TTL_SECONDS` | `1800` | profile cache TTL |
| `REQUEST_CACHE_MAX_SIZE` | `1000` | profile cache capacity |

Helper properties: `cors_origins` (parsed list), `is_production`, and `llm_active`
(true only when `llm_enabled` **and** a key is present). A validator **rejects a
literal `"*"`** in `ALLOWED_ORIGINS` at load time.

See `.env.example` for the full annotated template (names only, no values).

---

## 12. Security model

The backend is designed for a system handling sensitive citizen data:

1. **Strict input validation** — every field is typed, bounded, and enum-checked;
   `extra="forbid"` rejects unknown fields; numeric fields reject string coercion.
2. **CORS allowlist, never `*`** — enforced by both config default and a validator.
3. **Per-IP rate limiting** (slowapi) — in-memory or Redis-backed.
4. **No secrets in code** — everything sensitive comes from the environment.
5. **Defensive sanitization** of free text — strips HTML/script from name/state/
   district before it touches logs, drafts, or a UI.
6. **PII-safe logging** — the full profile is never logged; only `request_id` and
   coarse counters are. Sentry runs with `send_default_pii=False`.
7. **Standard error shape everywhere** — no raw tracebacks leak to clients. All
   failures return `{processing_status, error_message, error_code}`:
   - `422` invalid input → `INVALID_INPUT`
   - `429` rate limited → `AGENT_TIMEOUT`
   - `404` unknown scheme / expired request_id → `INVALID_INPUT`
   - `500` unhandled → `INTERNAL_ERROR` (full detail captured server-side only)
8. **Non-root container** — the Docker image runs as an unprivileged `app` user.

---

## 13. API endpoints reference

### `POST /api/intake`

Submit a citizen profile; get ranked eligible schemes.

**Request body:** `CitizenProfile` (see [§7.2](#72-request-models--modelsrequest_modelspy)).

**Response `200`:** `IntakeResponse`
```json
{
  "request_id": "3f2c…",
  "eligible_schemes": [
    {
      "scheme_id": "pm-kisan-001",
      "scheme_name": "PM-KISAN Samman Nidhi",
      "scheme_category": "agriculture",
      "benefit_summary": "…",
      "benefit_value_estimate": "₹6,000/year",
      "eligibility_match_score": 1.0,
      "priority_rank": 1,
      "missing_documents": ["income_certificate"],
      "application_url": "https://pmkisan.gov.in/",
      "drafted_application_text": null
    }
  ],
  "total_eligible_count": 1,
  "processing_status": "success",
  "error_message": null
}
```

### `GET /api/draft/{scheme_id}?request_id=…`

Generate a pre-filled application for one scheme, using the profile cached from the
earlier intake call.

**Response `200`:** `DraftResponse` (letter text + required documents + next steps).
**`404`** if the `scheme_id` is unknown or the `request_id` is unknown/expired.

### `GET /api/health`

**Response `200`:** `{"status": "ok", "agents_online": ["intake","eligibility","ranking","docgap","drafter"]}`.

---

## 14. Testing

**Config:** `pytest.ini` (asyncio auto mode; tests under `tests/`).
**Fixtures:** `tests/conftest.py` provides `VALID_PROFILE_DICT`, a complete
contract-valid body that tests copy and mutate.

The suite (~1,200 lines) covers each agent in isolation plus end-to-end API flows:

| Test file | Focus |
|-----------|-------|
| `test_intake_agent.py` | normalization, sanitization, empty-after-sanitize guard |
| `test_eligibility_agent.py` | every rule check, boundary scoring, no-restriction semantics (largest file, ~424 lines) |
| `test_ranking_agent.py` | value tiering, combined score, deterministic tie-breaks |
| `test_docgap_agent.py` | missing-document sets, canonical ordering |
| `test_drafter_agent.py` | template contents, LLM polish + fallback |
| `test_pipeline.py` | full orchestration, partial-success on LLM degradation |
| `test_api_integration.py` | HTTP-level: validation `422`s, endpoints, error shapes |

**Run the tests** (from the repo root so `Backend.<module>` imports resolve):

```bash
cd D:/Yojana-Saathi
python -m pytest Backend/tests -v
```

---

## 15. Running & deploying

### Local development

```bash
cd D:/Yojana-Saathi/Backend
python -m venv .venv && source .venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt
cp .env.example .env            # then fill in optional values

# Run from the repo root so the Backend package imports resolve:
cd ..
uvicorn Backend.main:app --reload --port 8000
```

Open <http://localhost:8000/docs> for the auto-generated OpenAPI UI.

> The LLM is **optional** — the API is fully functional without a `GEMINI_API_KEY`;
> it just returns deterministic (unpolished) text and never marks `partial_success`
> for LLM reasons.

### Docker

The `Dockerfile` is a multi-stage build (wheels built in stage 1, installed
offline in stage 2), runs as a **non-root** user, exposes `8000`, respects an
injected `$PORT`, and ships a stdlib-based `HEALTHCHECK` hitting `/api/health`.

```bash
docker build -t yojanasaathi-backend Backend/
docker run -p 8000:8000 --env-file Backend/.env yojanasaathi-backend
```

### Render

The repo root `render.yaml` blueprint deploys this backend as a web service
(platform injects `$PORT`; the container CMD binds `uvicorn Backend.main:app` to it).

---

### Quick mental model

> **Deterministic core, cosmetic AI, frozen contract, fail-safe everywhere.**
> The rule engine decides eligibility and is fully auditable; Gemini only makes the
> words nicer and can vanish without breaking anything; the API shape never drifts;
> and every failure returns a clean, PII-safe error instead of a traceback.
