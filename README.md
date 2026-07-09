<div align="center">

# 🪔 YojanaSaathi

### *Your companion for finding the government welfare you're actually entitled to.*

An AI-assisted eligibility engine that turns a single citizen profile into a ranked list of the exact Indian government schemes a person qualifies for — with the missing documents, benefit value, and a pre-filled application draft for each one.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://yojanasaathi.in)
[![Wiki](https://img.shields.io/badge/Project-Wiki-blue?style=for-the-badge&logo=github)](https://github.com/Yojana-Saathi/Yojana-Saathi/wiki)
[![Discussions](https://img.shields.io/badge/Discussions-Active-blueviolet?style=for-the-badge&logo=github)](https://github.com/Yojana-Saathi/Yojana-Saathi/discussions)

[![Backend CI](https://github.com/Yojana-Saathi/Yojana-Saathi/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Yojana-Saathi/Yojana-Saathi/actions/workflows/backend-ci.yml)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.110-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![Security Policy](https://img.shields.io/badge/Security-Policy-brightgreen.svg)](SECURITY.md)
[![Code of Conduct](https://img.shields.io/badge/Code_of-Conduct-blue.svg)](CODE_OF_CONDUCT.md)
[![GitHub issues](https://img.shields.io/github/issues/Yojana-Saathi/Yojana-Saathi)](https://github.com/Yojana-Saathi/Yojana-Saathi/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/Yojana-Saathi/Yojana-Saathi)](https://github.com/Yojana-Saathi/Yojana-Saathi/commits/main)
[![GitHub contributors](https://img.shields.io/github/contributors/Yojana-Saathi/Yojana-Saathi)](https://github.com/Yojana-Saathi/Yojana-Saathi/graphs/contributors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)

[**Problem**](#-the-problem) · [**How it works**](#-how-it-works) · [**Screenshots**](#-screenshots--demo) · [**Quickstart**](#-quickstart) · [**API**](#-api-reference) · [**Architecture**](#-architecture) · [**Wiki**](https://github.com/Yojana-Saathi/Yojana-Saathi/wiki) · [**Discussions**](https://github.com/Yojana-Saathi/Yojana-Saathi/discussions) · [**Contribute**](CONTRIBUTING.md) · [**Deploy**](#-deployment)

</div>

---

## 🎯 The Problem

India runs **thousands of central and state welfare schemes** — income support, scholarships, pensions, housing, health cover, disability benefits. The money is allocated. The problem is *discovery and access*:

- A citizen has no single place to ask *"which of these am I eligible for?"*
- Eligibility rules are buried in PDFs and legalese across dozens of departments.
- Even when someone finds a scheme, they don't know **which documents they're missing** or **how to apply**.

The result is billions in benefits going unclaimed by exactly the people they were designed for.

**YojanaSaathi collapses that entire journey into one secure application.** A citizen signs up, inputs their profile, and receives a personalized dashboard showing exactly what they qualify for, complete with missing document detection, OCR-assisted document validation, and pre-filled application drafts.

---

## ✨ How It Works

### The Citizen User Journey
YojanaSaathi guides users through a seamless, privacy-centric flow to match and apply for welfare schemes:

1. **Authentication** (`/login`): Secure sign-up/sign-in backed by Supabase Auth with Row-Level Security.
2. **Onboarding Intake** (`/register`): A multi-step profile wizard collecting demographic, location, and economic indicators.
3. **Citizen Dashboard** (`/dashboard`): A centralized hub displaying eligible schemes with match scores, Missing Document checklists, and application statuses.
4. **Document Vault** (`/documents`): Secure file upload area. When documents (Aadhaar, Income Certificate, etc.) are uploaded, YojanaSaathi triggers OCR parameter extraction so users can verify their verified attributes and update their active profiles.
5. **Scheme Details & Drafts** (`/scheme-details`): Detailed criteria matching, Q&A scheme exploration assistant (`/chat`), and on-demand drafting of custom pre-filled application letters.
6. **Application Tracking** (`/dashboard`): Keep tabs on application lifecycle stages from `matched` through `applied` and `approved`.

### The Deterministic Engine Pipeline
Behind the scenes, when profile indicators or schemes change, an internal pipeline is run. Every stage is deterministic and fully auditable:

| # | Agent | Responsibility |
|---|-------|----------------|
| 1 | **Intake** | Validates and normalizes the profile; strips HTML/script from free-text fields. |
| 2 | **Eligibility** | A pure **rule engine** matches the profile against each scheme's rules and assigns an honest 0–1 confidence score (lower near boundary conditions). |
| 3 | **Ranking** | Orders eligible schemes by estimated benefit value × match confidence, with deterministic tie-breaking. |
| 4 | **DocGap** | Computes exactly which required documents the citizen is still missing. |
| 5 | **Drafter** | On demand, produces a pre-filled application draft for a chosen scheme. |
| 6 | **Document** | Coordinates OCR processing (OCRSpace) and secure vault metadata validation. |

> ### 🔒 The LLM never decides eligibility.
> This is the core design principle. An LLM is **never** asked *"is this person eligible?"* — that judgment touches real legal entitlements and must be reproducible and auditable. Gemini is used **only** to make benefit summaries and application drafts read more naturally, and **every** LLM call has a timeout, a fallback model, and graceful degradation to deterministic template text on any failure. The system runs fully correctly with **no API key at all.**

---

## 🖼️ Screenshots & Demo

> [!NOTE]
> *UI screenshots of the dashboard, multi-step intake form, and scheme detail page will be placed here. Refer to the issues list or contact the maintainers to provide updated visual assets.*

| Onboarding Intake | User Dashboard | Scheme Details |
|---|---|---|
| *[Intake Form Placeholder]* | *[Dashboard Overview Placeholder]* | *[Scheme Details Placeholder]* |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend API** | Python 3.12 · FastAPI · Pydantic v2 · Uvicorn · PyJWT |
| **Frontend Web** | Next.js 16.2 · React 19.2 · TypeScript 5 · Tailwind CSS 4 |
| **Database & Auth** | Supabase (PostgreSQL, Row-Level Security, GoTrue Auth, Storage Buckets) |
| **Edge Compute** | Deno-based Supabase Edge Functions |
| **AI & OCR** | Google Gemini (`google-genai` for summaries/drafts) · OCRSpace (Document OCR) |
| **Resilience** | SlowAPI rate limiting (Redis or in-memory) · explicit CORS allowlist |
| **Observability** | `structlog` structured JSON logs · Sentry error capture |
| **Quality** | Pytest (119 tests) · `pip-audit` dependency scanning · GitHub Actions CI |
| **Delivery** | Multi-stage Docker image · Render Blueprint (Infrastructure-as-Code) |

---

## 🚀 Quickstart

### Prerequisites
- **Python 3.12+**
- **Node.js 20+**
- **Supabase CLI** (optional, for local DB development)
- *(optional)* A Google Gemini API key and OCRSpace API key

### 1 · Backend

```bash
cd Backend

# Create and activate a virtual environment
python -m venv .venv
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install pinned dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase keys and API credentials

# Run the API (from the repository root so package imports resolve)
cd ..
uvicorn Backend.main:app --reload --port 8000
```

The API is now live at **http://localhost:8000**, with interactive OpenAPI docs at **http://localhost:8000/docs**.

### 2 · Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** to interact with the application.

### 3 · Try the Engine API directly

```bash
curl -X POST http://localhost:8000/api/intake \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
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

### Authenticated Citizen Endpoints (Bearer JWT Required)

#### `POST /api/intake`
Submit a citizen profile → saves to user profile history and runs the matching pipeline to return ranked eligible schemes.

#### `GET /api/draft/{scheme_id}?request_id=…`
Generate a pre-filled application draft letter for a scheme, using the profile cached in the intake call.

#### `POST /api/documents/upload`
Upload a document to the private storage bucket. Expects `multipart/form-data` containing `doc_type` and `file`. Triggers OCR parameter extraction and returns pending status with confidence scores.

#### `POST /api/documents/{doc_id}/confirm`
Verify/update OCR-extracted parameters. Merges confirmed data and inserts a new current profile with the updated values.

#### `GET /api/documents`
List user's uploaded documents with short-lived signed URLs (300s TTL).

#### `GET /api/notifications`
Fetch user's notifications.

#### `POST /api/notifications/{notification_id}/read`
Mark a specific user notification as read.

### Public Browse Endpoints (No Auth Required)

#### `GET /api/schemes/search?q=…`
Search active schemes using full-text trigram queries.

#### `GET /api/health`
Liveness probe. Returns `{"status": "ok", "agents_online": [...]}`.

### Admin Endpoints (JWT + Admin Role Required)

#### `POST /api/admin/schemes`
Insert or update scheme definitions and eligibility rule sets.

### Internal Callback Endpoints (`X-Internal-Secret` Header Required)

#### `POST /api/internal/match-profile`
Recalculates eligibility matches for a user profile change.

#### `POST /api/internal/match-scheme`
Recalculates matches for all candidate profiles when a scheme's rules change.

---

## 🏛️ Architecture

```
Yojana-Saathi/
├── Backend/                    # FastAPI service
│   ├── main.py                 # App factory, routes, error handlers
│   ├── config.py               # Typed settings (env-driven)
│   ├── agents/                 # Deterministic agents pipeline
│   │   ├── pipeline.py         #   Orchestration for matching
│   │   ├── intake_agent.py     #   Input validation + HTML sanitization
│   │   ├── eligibility_agent.py#   Rule engine (core)
│   │   ├── ranking_agent.py    #   Order schemes by value & confidence
│   │   ├── docgap_agent.py     #   Missing document checks
│   │   ├── drafter_agent.py    #   Application draft generator
│   │   └── document_agent.py   #   OCRSpace processing client
│   ├── core/                   # CORS, rate limiting, logging, auth middleware
│   ├── llm/gemini_client.py    # Language generation falls back gracefully to template
│   ├── models/                 # Pydantic schema declarations
│   ├── data/schemes.json       # Seed scheme data definitions
│   └── tests/                  # 119 pytest unit & integration tests
├── frontend/                   # Next.js 16 app
│   ├── app/                    # Routing pages (App Router)
│   │   ├── chat/               #   Scheme exploration chat
│   │   ├── dashboard/          #   Citizen dashboard (matches, checklist)
│   │   ├── documents/          #   Document vault (uploads, OCR confirm)
│   │   ├── login/              #   Supabase auth login
│   │   ├── register/           #   Onboarding profile wizard
│   │   ├── schemes/            #   Public browse schemes
│   │   ├── scheme-details/     #   Detailed match cards & drafts
│   │   ├── settings/           #   User preferences & toggles
│   │   └── profile/            #   Citizen demographics details
│   └── public/                 # Branding assets
├── supabase/                   # Database migrations & Edge Functions
│   ├── migrations/             #   SQL migrations (Tables, RLS, TSV indexes, triggers)
│   └── functions/              #   Deno Edge Functions
│       ├── on-profile-change/  #     Profile update trigger (calls backend match-profile)
│       └── on-scheme-change/   #     Scheme update trigger (calls backend match-scheme)
├── .github/workflows/          # CI workflows (pytest, security audit)
└── render.yaml                 # Render backend deployment blueprint
```

### Design Principles
- **Deterministic where it matters.** Legal-entitlement decisions come from an auditable rule engine, never a model.
- **Graceful degradation.** Missing LLM key, LLM timeout, or API failure → deterministic fallback text, never a 500.
- **Secure by default.** Explicit CORS allowlist (a literal `*` is *rejected at startup*), per-IP rate limiting, input sanitization, no secrets in code, generic client-facing errors.
- **Observable.** Structured JSON logs with a per-request `request_id`; profiles are never logged. Sentry-ready.

---

## ⚙️ Configuration

All configuration is environment-driven.

### Backend Configurations (see `Backend/.env.example`)

| Variable | Default | Purpose |
|----------|---------|---------|
| `ENVIRONMENT` | `development` | `development` \| `production` |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS allowlist (**never `*`**) |
| `RATE_LIMIT` | `20/minute` | Per-IP request limit |
| `REDIS_URL` | *(unset)* | Optional Redis backend for rate limiting |
| `GEMINI_API_KEY` | *(unset)* | Optional — enables language polish |
| `llm_enabled` | `true` | Master switch for LLM usage |
| `SENTRY_DSN` | *(unset)* | Optional error reporting |
| `LOG_LEVEL` / `LOG_JSON` | `INFO` / `true` | Structured logging controls |
| `SUPABASE_URL` | *(required)* | Supabase project API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | *(required)* | Service role key for admin-level DB access |
| `SUPABASE_JWT_SECRET` | *(required)* | Decodes client JWTs on protected routes |
| `OCR_SPACE_API_KEY` | *(unset)* | API key for OCR Space provider |
| `INTERNAL_API_SECRET` | *(required)* | Shared secret validating Edge Function webhooks |

### Frontend Configurations (see `frontend/.env`)

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |
| `NEXT_PUBLIC_SUPABASE_URL` | *(required)* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(required)* | Supabase anon key |

---

## ✅ Testing & Quality

```bash
# Run the full suite (119 tests) from the repository root using the venv python
Backend\.venv\Scripts\python.exe -m pytest Backend -q

# Audit dependencies for known vulnerabilities
pip-audit -r Backend/requirements.txt --strict
```

Both run automatically in **GitHub Actions** on every push and pull request that touches the backend. Dependencies are **pinned to exact versions** for reproducible builds.

---

## 🚢 Deployment

The backend ships as a **multi-stage, non-root, health-checked Docker image** and includes a **Render Blueprint** for one-click infrastructure-as-code deploys.

```bash
# Build & run backend locally via Docker
cd Backend
docker build -t yojanasaathi-backend .
docker run -p 8000:8000 --env-file .env yojanasaathi-backend
```

**Render:** Point a new Blueprint at this repo — [`render.yaml`](render.yaml) provisions the web service, wires the `/api/health` check, and prompts for secrets.

The frontend is a standard Next.js app and deploys cleanly to Vercel or any Node host (`npm run build && npm run start`).

---

## 🗺️ Roadmap

- [ ] Expand the scheme dataset beyond the initial 20 to achieve broader central and state-level coverage
- [ ] Multilingual intake & output (Hindi + regional languages)
- [ ] Admin console UI for managing schemes and rules dynamically (currently API only)
- [ ] Analytics dashboard showing benefit distribution and unclaimed benefit gaps by region
- [ ] Automated verification via direct API integrations (DigiLocker / Central Sandbox integrations)

---

## 🤝 Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

- Check issues labeled [good first issue](https://github.com/Yojana-Saathi/Yojana-Saathi/issues?q=is:open+is:issue+label:%22good+first+issue%22).
- Read the [YojanaSaathi Wiki](https://github.com/Yojana-Saathi/Yojana-Saathi/wiki) for deeper architecture and setup notes.
- Use [GitHub Discussions](https://github.com/Yojana-Saathi/Yojana-Saathi/discussions) to talk with maintainers and pitch features.

### Maintainers & Core Team
- **Prem Rajesh Sargara** ([@PREMRAJESH](https://github.com/PREMRAJESH)) - Backend, agent architecture, API orchestration, deployment, and CI/CD
- **Dvij Joshi** ([@Dvij-Joshi](https://github.com/Dvij-Joshi)) - Frontend, UI, auth, dashboard, chat, and document vault

---

## ⚠️ Disclaimer & Privacy

YojanaSaathi is an **assistive discovery tool**, not an official government service. Eligibility results are a well-reasoned indication based on the encoded rules and the information provided — the issuing authority's decision is final. Always verify with the official scheme portal before applying.

### Data Privacy & Security
YojanaSaathi is designed around strict data-handling and privacy-first principles:
- **Demographics Ownership:** Citizen profiles and document uploads are private, protected by Postgres Row-Level Security policies ensuring only the authenticated owner can access them.
- **Short-Lived Signed Access:** Document attachments in the vault are stored in a private bucket; the API only generates transient (300s TTL) signed URLs for frontend display.
- **Zero PII Logging:** The backend employs structured logging that strictly avoids printing personal identifiers (PII), demographics, uploaded documents, or session tokens.
- Consult the [SECURITY.md](SECURITY.md) file for more information or to report any security vulnerabilities.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<div align="center">

**Built to put unclaimed welfare into the right hands.**

</div>
