<div align="center">

# 🪔 YojanaSaathi

### *Your companion for finding the government welfare you're actually entitled to.*

An AI-assisted eligibility engine that turns a single citizen profile into a ranked list of the exact Indian government schemes a person qualifies for — with the missing documents, benefit value, and a pre-filled application draft for each one.

[![Backend CI](https://github.com/Yojana-Saathi/Yojana-Saathi/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Yojana-Saathi/Yojana-Saathi/actions/workflows/backend-ci.yml)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)

[**Problem**](#-the-problem) · [**How it works**](#-how-it-works) · [**Quickstart**](#-quickstart) · [**API**](#-api-reference) · [**Architecture**](#-architecture) · [**Wiki**](https://github.com/Yojana-Saathi/Yojana-Saathi/wiki) · [**Contribute**](CONTRIBUTING.md) · [**Deploy**](#-deployment)

</div>

---

## 🎯 The Problem

India runs **thousands of central and state welfare schemes** — income support, scholarships, pensions, housing, health cover, disability benefits. The money is allocated. The problem is *discovery and access*:

- A citizen has no single place to ask *"which of these am I eligible for?"*
- Eligibility rules are buried in PDFs and legalese across dozens of departments.
- Even when someone finds a scheme, they don't know **which documents they're missing** or **how to apply**.

The result is billions in benefits going unclaimed by exactly the people they were designed for.

**YojanaSaathi collapses that entire journey into one form.** A citizen enters their profile once; the system returns every scheme they qualify for, ranked by value, with a document checklist and a ready-to-submit application draft.

---

## ✨ How It Works

```
   Citizen profile                          Ranked, actionable results
 ┌─────────────────┐    ┌──────────────────────┐    ┌───────────────────────────┐
 │ age, income,    │    │  Deterministic        │    │ ✅ PM-KISAN      ₹6,000/yr │
 │ occupation,     │──▶ │  multi-agent pipeline │──▶ │ ✅ Ayushman Bharat        │
 │ state, category,│    │  (rules, not an LLM   │    │ ✅ NSAP Pension           │
 │ documents…      │    │   deciding eligibility)│    │  + missing docs + draft   │
 └─────────────────┘    └──────────────────────┘    └───────────────────────────┘
```

The pipeline is **five specialized agents** run in sequence — every one of them deterministic and auditable:

| # | Agent | Responsibility |
|---|-------|----------------|
| 1 | **Intake** | Validates and normalizes the profile; strips HTML/script from free-text fields. |
| 2 | **Eligibility** | A pure **rule engine** matches the profile against each scheme's rules and assigns an honest 0–1 confidence score (lower near a boundary condition). |
| 3 | **Ranking** | Orders eligible schemes by estimated benefit value × match confidence, with fully deterministic tie-breaking. |
| 4 | **DocGap** | Computes exactly which required documents the citizen is still missing. |
| 5 | **Drafter** | On demand, produces a pre-filled application draft for a chosen scheme. |

> ### 🔒 The LLM never decides eligibility.
> This is the core design principle. An LLM is **never** asked *"is this person eligible?"* — that judgment touches real legal entitlements and must be reproducible and auditable. Gemini is used **only** to make benefit summaries and application drafts read more naturally, and **every** LLM call has a timeout, a fallback model, and graceful degradation to deterministic text on any failure. The system runs fully correctly with **no API key at all.**

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.12 · FastAPI · Pydantic v2 · Uvicorn |
| **Frontend** | Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 |
| **AI (optional)** | Google Gemini (`google-genai`) — language polish only |
| **Resilience** | SlowAPI rate limiting (Redis or in-memory) · explicit CORS allowlist |
| **Observability** | `structlog` structured JSON logs · Sentry error capture |
| **Quality** | Pytest (88 tests) · `pip-audit` dependency scanning · GitHub Actions CI |
| **Delivery** | Multi-stage Docker image · Render Blueprint (Infrastructure-as-Code) |

---

## 🚀 Quickstart

### Prerequisites
- **Python 3.12+**
- **Node.js 20+**
- *(optional)* A Google Gemini API key for natural-language polish

### 1 · Backend

```bash
cd Backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

# Install pinned dependencies
pip install -r requirements.txt

# Configure environment (all values are optional — sane defaults apply)
cp .env.example .env

# Run the API (from the repository root so package imports resolve)
cd ..
uvicorn Backend.main:app --reload --port 8000
```

The API is now live at **http://localhost:8000**, with interactive docs at **http://localhost:8000/docs**.

### 2 · Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open **http://localhost:3000**.

### 3 · Try it

```bash
curl -X POST http://localhost:8000/api/intake \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Asha Devi",
    "age": 34,
    "gender": "female",
    "state": "Bihar",
    "district": "Patna",
    "annual_income": 90000,
    "occupation": "farmer",
    "social_category": "obc",
    "disability_status": "none",
    "family_size": 5,
    "has_bpl_card": true,
    "land_owned_acres": 1.5,
    "education_level": "secondary",
    "gov_id_available": {
      "aadhaar": true,
      "income_certificate": false,
      "caste_certificate": true,
      "ration_card": true
    }
  }'
```

---

## 📡 API Reference

Base URL: `/api`

### `POST /api/intake`
Submit a citizen profile → receive all eligible schemes, ranked, with match scores and missing documents.

**Response (abridged):**
```jsonc
{
  "request_id": "b3f1…",            // reuse this to fetch a draft
  "total_eligible_count": 3,
  "processing_status": "success",   // success | partial_success | error
  "eligible_schemes": [
    {
      "scheme_id": "pm-kisan-001",
      "scheme_name": "PM-KISAN Samman Nidhi",
      "scheme_category": "agriculture",
      "benefit_summary": "Income support of ₹6,000/year to landholding farmer families…",
      "benefit_value_estimate": "₹6,000/year",
      "eligibility_match_score": 0.97,
      "priority_rank": 1,
      "missing_documents": ["income_certificate"],
      "application_url": "https://pmkisan.gov.in/"
    }
  ]
}
```

### `GET /api/draft/{scheme_id}?request_id=…`
Generate a pre-filled application draft for one scheme, using the profile captured in the earlier intake call. Returns the draft text, required documents, and next steps.

### `GET /api/health`
Liveness probe. Returns `{"status": "ok", "agents_online": [...]}`.

> Every error returns a **consistent shape** — `{ processing_status, error_message, error_code }` — and raw tracebacks are **never** leaked to clients.

---

## 🏛️ Architecture

```
Yojana-Saathi/
├── Backend/                    # FastAPI service
│   ├── main.py                 # App factory, routes, error handlers
│   ├── config.py               # Typed settings (env-driven, no hardcoded secrets)
│   ├── agents/                 # The deterministic pipeline
│   │   ├── pipeline.py         #   orchestration for /api/intake
│   │   ├── intake_agent.py     #   normalize + sanitize
│   │   ├── eligibility_agent.py#   the rule engine (core of the system)
│   │   ├── ranking_agent.py    #   priority ordering
│   │   ├── docgap_agent.py     #   missing-document computation
│   │   └── drafter_agent.py    #   on-demand application drafts
│   ├── core/                   # logging, security (CORS/rate limit), caching, sanitization
│   ├── llm/gemini_client.py    # Language generation ONLY, with graceful fallback
│   ├── models/                 # Pydantic request/response/scheme models + enums
│   ├── data/schemes.json       # Curated dataset of 20 government schemes
│   ├── tests/                  # 88 unit + integration tests
│   └── Dockerfile              # Multi-stage, non-root, health-checked image
├── Frontend/                   # Next.js 16 app (landing, schemes, scheme detail)
├── .github/workflows/          # CI: pytest + dependency audit
└── render.yaml                 # One-click Render Blueprint
```

### Design principles
- **Deterministic where it matters.** Legal-entitlement decisions come from an auditable rule engine, never a model.
- **Graceful degradation.** Missing LLM key, LLM timeout, or API failure → deterministic fallback text, never a 500.
- **Secure by default.** Explicit CORS allowlist (a literal `*` is *rejected at startup*), per-IP rate limiting, input sanitization, no secrets in code, generic client-facing errors.
- **Observable.** Structured JSON logs with a per-request `request_id`; profiles are never logged. Sentry-ready.

---

## ⚙️ Configuration

All backend config is environment-driven (see [`Backend/.env.example`](Backend/.env.example)). Highlights:

| Variable | Default | Purpose |
|----------|---------|---------|
| `ENVIRONMENT` | `development` | `development` \| `production` |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS allowlist (**never `*`**) |
| `RATE_LIMIT` | `20/minute` | Per-IP request limit |
| `REDIS_URL` | *(unset)* | Optional Redis backend for rate limiting |
| `GEMINI_API_KEY` | *(unset)* | Optional — enables language polish |
| `LLM_ENABLED` | `true` | Master switch for LLM usage |
| `SENTRY_DSN` | *(unset)* | Optional error reporting |
| `LOG_LEVEL` / `LOG_JSON` | `INFO` / `true` | Structured logging controls |

---

## ✅ Testing & Quality

```bash
# Run the full suite (88 tests) from the repository root
python -m pytest Backend -q

# Audit dependencies for known vulnerabilities
pip-audit -r Backend/requirements.txt --strict
```

Both run automatically in **GitHub Actions** on every push and pull request that touches the backend. Dependencies are **pinned to exact versions** for reproducible builds.

---

## 🚢 Deployment

The backend ships as a **multi-stage, non-root, health-checked Docker image** and includes a **Render Blueprint** for one-click infrastructure-as-code deploys.

```bash
# Build & run locally
cd Backend
docker build -t yojanasaathi-backend .
docker run -p 8000:8000 --env-file .env yojanasaathi-backend
```

**Render:** point a new Blueprint at this repo — [`render.yaml`](render.yaml) provisions the web service, wires the `/api/health` check, and prompts for secrets (`GEMINI_API_KEY`, `SENTRY_DSN`, `REDIS_URL`) in the dashboard so nothing sensitive is committed.

The frontend is a standard Next.js app and deploys cleanly to Vercel or any Node host (`npm run build && npm run start`).

---

## 🗺️ Roadmap

- [ ] Expand the scheme dataset beyond the initial 20 (state-level coverage)
- [ ] Multilingual intake & output (Hindi + regional languages)
- [ ] Live intake form wired end-to-end to the backend in the frontend
- [ ] Authenticated citizen profiles with saved eligibility history
- [ ] Admin console for maintaining scheme rules without code changes
- [ ] Analytics on unclaimed-benefit gaps by region

---

## 🤝 Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR, and use the [YojanaSaathi Wiki](https://github.com/Yojana-Saathi/Yojana-Saathi/wiki) for deeper architecture and setup notes.

---

## ⚠️ Disclaimer

YojanaSaathi is an **assistive discovery tool**, not an official government service. Eligibility results are a well-reasoned indication based on the encoded rules and the information provided — the issuing authority's decision is final. Always verify with the official scheme portal before applying.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<div align="center">

**Built to put unclaimed welfare into the right hands.**

</div>
