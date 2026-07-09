# YojanaSaathi — Frontend Documentation

> A Next.js web application that serves as the interface for the YojanaSaathi government welfare scheme eligibility engine. It features an interactive intake wizard, a real-time eligibility dashboard, an on-demand application letter generator, and a secure document vault.

This document details **everything** in the `Frontend/` folder: the architecture, pages, components, client integration, styling, and how to run it.

---

## Table of Contents

1. [Design Philosophy & Aesthetics](#1-design-philosophy--aesthetics)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Folder & File Map](#3-folder--file-map)
4. [The End-to-End Application Flow](#4-the-end-to-end-application-flow)
5. [Page Specifications in Detail](#5-page-specifications-in-detail)
6. [API Client & TypeScript Types](#6-api-client--typescript-types)
7. [Design System & Styling System](#7-design-system--styling-system)
8. [Configuration & Environment](#8-configuration--environment)
9. [Privacy & Security Model](#9-privacy--security-model)
10. [Running & Deploying](#10-running--deploying)

---

## 1. Design Philosophy & Aesthetics

Three design principles guide every interface decision in this frontend:

### 1.1 Premium Visual Aesthetics
The application uses a curated, premium color palette designed to impress at first glance:
- **Navy (`#1B2B4B`)**: Serves as the primary brand color, offering a highly professional, trustworthy look.
- **Orange (`#F5842B`)**: Serves as the vibrant accent color, highlighting actions and eligibility indicators.
- **Modern Typography**: Integrated using the Google Fonts **Inter** font family to replace generic default system fonts.
- **Visual Texture**: Employs decorative vector gradients, dotted path backgrounds (`dotted-path`), and stylized lotus icons representing structural alignment.

### 1.2 Micro-Animations & Fluidity
Interactions feel responsive and alive:
- **Floating Icons**: Graphic elements in the hero section float with individual bounce durations (`3s`, `3.5s`, `4s`, `4.5s`) and delays.
- **Pulsing States**: Live indicators (e.g., "Online · Deterministic rules engine") and loading skeletons pulse smoothly to reflect real-time status.
- **Hover Micro-movements**: Buttons translate slightly on hover, and eligible scheme cards lift vertically to encourage user interaction.

### 1.3 Strict Owner-Privacy & Secure Auth
The application handles sensitive citizen details with persistent storage in Supabase PostgreSQL, secured by Row-Level Security (RLS) policies. Access is strictly authenticated via JWT access tokens. Users only view and modify their own accounts, profiles, and documents, preventing cross-tenant leakage.

---

## 2. High-Level Architecture

```
                          [Next.js App Router]
                                   │
                                   ▼
        ┌────────────────────────────────────────────────────────┐
        │ /register -> 3-Step Wizard Intake Form                 │
        │   1. Sign Up (creates Supabase Auth user)              │
        │   2. Profile (writes to Supabase `citizen_profiles`)   │
        │   3. Documents (saves to Supabase `documents` table)   │
        └────────────────────────────────────────────────────────┘
                                   │
                           Triggers Edge Function
                                   │
                                   ▼
                       Intake matching on FastAPI
                                   │
                                   ▼
        ┌────────────────────────────────────────────────────────┐
        │ /dashboard -> Tabbed Display                           │
        │   - Eligible Schemes (from matched notifications)      │
        │   - Application Tracking (`applications` table)       │
        │   - Notifications tray (alerts matched in db)          │
        └────────────────────────────────────────────────────────┘
             │                                        │
       Click Card                               Click Upload
             │                                        │
             ▼                                        ▼
  ┌───────────────────────────┐            ┌─────────────────────┐
  │ /scheme-details?id=…      │            │ /documents          │
  │   - GET /api/draft        │            │   - upload vault    │
  │   - copy draft to clip    │            └─────────────────────┘
  └───────────────────────────┘
```

- **Framework**: Next.js 16.2.10 (App Router) + React 19.2.4.
- **Language**: TypeScript 5.
- **Styling**: TailwindCSS v4 + PostCSS inline-theme setup.
- **State management**: React Component State (`useState`, `useEffect`) bridged with browser-level `sessionStorage`.

---

## 3. Folder & File Map

```
Frontend/
├── app/                        # Next.js App Router
│   ├── chat/                   # AI Assistant conversational portal
│   │   └── page.tsx            # conversational layout (mocked backend connection)
│   │
│   ├── components/             # Reusable global layout elements
│   │   ├── Footer.tsx          # Global footer containing Gov links & connect details
│   │   └── Navbar.tsx          # Sticky responsive navigation bar
│   │
│   ├── dashboard/              # Match metrics, Tabbed list of schemes & missing docs
│   │   └── page.tsx            # Reads sessionStorage; renders progress/scores
│   │
│   ├── documents/              # Vault containing missing & uploaded documents
│   │   └── page.tsx            # Drag & drop upload simulator with 1.5s delay
│   │
│   ├── lib/                    # Shared API Client logic
│   │   ├── api-client.ts       # fetch wrappers for /intake, /draft, and /health
│   │   └── api-types.ts        # TS types and canonical drop-down option lists
│   │
│   ├── login/                  # User Sign-In credentials interface
│   │   └── page.tsx            # Login credentials form page
│   │
│   ├── profile/                # Profile configuration settings
│   │   └── page.tsx            # View and edit profile details, mocks activity logs
│   │
│   ├── register/               # Three-step intake wizard form
│   │   └── page.tsx            # Parses fields and submits payload to API
│   │
│   ├── scheme-details/         # Detailed view of a matched welfare scheme
│   │   └── page.tsx            # Fetches application draft on-demand; handles clipboard
│   │
│   ├── schemes/                # Public static directory of welfare schemes
│   │   └── page.tsx            # Filterable list (state, age, income range selectors)
│   │
│   ├── settings/               # System and privacy configurations
│   │   └── page.tsx            # Notification toggles, theme, language mock controls
│   │
│   ├── favicon.ico             # App icon
│   ├── globals.css             # Tailwind v4 directives, color themes, CSS classes
│   └── layout.tsx              # Root wrapper: Metadata, CDN fonts, and layout body
│
├── public/                     # Static files (images, vectors)
├── package.json                # Pinned dependencies & running scripts
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config
├── postcss.config.mjs          # PostCSS configuration
├── eslint.config.mjs           # ESlint config
└── README.md                   # Quickstart instructions
```

---

## 4. The End-to-End Application Flow

### 4.1 Home Page Landing (`app/page.tsx`)
1. User lands on the homepage which describes the platform, lists stats (4,700+ Schemes, 10L+ Profiles, 95% Accuracy), and details common user pain points.
2. User clicks **Check Eligibility Now** which directs them to signup/register.

### 4.2 Registration & Onboarding (`app/register/page.tsx`)
1. **Step 0 (Account)**: User enters their email and password. This calls Supabase Auth `signUp()`, registering their account.
2. **Step 1 (Profile)**: User fills out demographic, geographic, and economic fields. Upon submission, a record is inserted into the `citizen_profiles` table with `is_current = true`.
3. **Step 2 (Documents Check)**: User ticks checkboxes representing documents they already own. This self-attestation initializes their local onboarding context but **does not** create any `verified` document records in the database.
4. **FastAPI Webhook Trigger**: The database insert triggers a Deno Edge Function (`on-profile-change`), which calls FastAPI to evaluate matches asynchronously. Results are saved in the `notifications` table.
5. User is redirected to `/dashboard`.

### 4.3 Dashboard Overview (`app/dashboard/page.tsx`)
1. Renders user's matched schemes loaded from the `notifications` table, filtered by user ID.
2. **Applications Tracker**: Renders the user's applied schemes by reading from the `applications` table, providing progress states (applied, pending, verified).
3. **Notification Center**: Lists recent matching alerts and system updates, ensuring users see newly qualified schemes instantly.

### 4.4 Scheme Detail & Applications (`app/scheme-details/page.tsx`)
1. Renders scheme criteria, benefits, and required/missing documents.
2. **Draft Generation**: Fetches a polished application letter from `/api/draft/{scheme_id}` passing the user's Supabase JWT access token.
3. **Track Application**: Clicking **Apply Now** registers the application in the Supabase `applications` table, linking their profile and preventing duplicate applications.

### 4.5 Document Vault (`app/documents/page.tsx`)
1. Displays actual user documents stored in the Supabase `document-vault` storage bucket.
2. **Direct File Upload**: Uploading a document sends a POST request to `/api/documents/upload` containing the binary file and document type.
3. **OCR Processing**: The backend parses the document contents using OCR, extracts data (e.g., annual income figures), and returns a pending verification status.
4. **Confirm OCR Data**: The user reviews the extracted information and clicks **Confirm**, writing the updated fields to `/api/documents/{id}/confirm`.

---

## 5. Page Specifications in Detail

### 5.1 Intake Form Wizard — `app/register/page.tsx`
- **Demographics validation**:
  - `Age` restricts input ranges `0-120`.
  - `Family Size` restricts input ranges `1-50`.
  - `Indian States` selection uses a static `INDIAN_STATES` array containing 31 options.
- **Conversion mapping**:
  ```typescript
  const profile: CitizenProfile = {
    full_name: form.full_name.trim(),
    age: parseInt(form.age, 10),
    gender: form.gender,
    state: form.state.trim(),
    district: form.district.trim(),
    annual_income: parseFloat(form.annual_income) || 0,
    occupation: form.occupation,
    social_category: form.social_category,
    disability_status: form.disability_status || "none",
    family_size: parseInt(form.family_size, 10) || 1,
    has_bpl_card: form.has_bpl_card,
    land_owned_acres: parseFloat(form.land_owned_acres) || 0,
    education_level: form.education_level,
    gov_id_available: form.gov_id_available,
  };
  ```

### 5.2 Interactive Dashboard — `app/dashboard/page.tsx`
- **Category Badge Mapping**: Renders custom Tailwind styles for categories:
  - `agriculture` -> green badge (`bg-green-100 text-green-700`), icon: `🌾`
  - `health` -> red badge (`bg-red-100 text-red-700`), icon: `🏥`
  - `pension` -> yellow badge (`bg-yellow-100 text-yellow-700`), icon: `👴`
  - `education` -> purple badge (`bg-purple-100 text-purple-700`), icon: `🎓`
  - `housing` -> blue badge (`bg-blue-100 text-blue-700`), icon: `🏠`
  - `disability` -> pink badge (`bg-pink-100 text-pink-700`), icon: `♿`
  - `women_child` -> rose badge (`bg-rose-100 text-rose-700`), icon: `👩`
  - `other` -> slate badge (`bg-slate-100 text-slate-600`), icon: `📋`
- **AI Polish Failure Notice**: Renders a warning notification banner if `processing_status === "partial_success"` indicating that the AI language polish timed out or degraded gracefully to template text without affecting eligibility computations.

### 5.3 AI Assistant Portal — `app/chat/page.tsx`
- A conversational portal featuring suggested questions (`"Which schemes am I eligible for as a farmer?"`, `"What documents do I need for PM-KISAN?"`, etc.).
- Simulates an AI response typing indicator (`1.2s` delay) which maps markdown-style bold indicators and bullet points into styling paragraphs. Shows a green pulse dot indicating active connection.

### 5.4 Document Vault Vault — `app/documents/page.tsx`
- Simulates file uploads of `.pdf`, `.jpg`, `.jpeg`, and `.png` files.
- Extracts missing documents dynamically across eligible schemes, mapping them using the icon configurations from `api-types.ts`:
  - `aadhaar` -> `🪪`
  - `income_certificate` -> `📄`
  - `caste_certificate` -> `📋`
  - `ration_card` -> `🧾`

### 5.5 Public Scheme Directory — `app/schemes/page.tsx`
- Renders a public browsable scheme catalog.
- Connects to the search API endpoint (`GET /api/schemes/search?q=...`) to support real-time database-driven query matching using PostgreSQL Full-Text Search (FTS).
- Provides client-side filters for categories, age, state restrictions, and income caps.

---

## 6. API Client & TypeScript Types

### 6.1 TypeScript models — `app/lib/api-types.ts`
Enforces consistency with the backend Pydantic models:
- **`CitizenProfile`**: Holds name, age, gender, state, district, annual income, occupation, social category, disability status, family size, BPL card status, land owned, education level, and document boolean map.
- **`IntakeResponse`**: Holds `request_id`, `eligible_schemes` array, `total_eligible_count`, `processing_status`, and `error_message`.
- **`DraftResponse`**: Holds `scheme_id`, `drafted_application_text`, `required_documents`, and `next_steps`.

The file contains option configurations (`GENDER_OPTIONS`, `OCCUPATION_OPTIONS`, `SOCIAL_CATEGORY_OPTIONS`, `DISABILITY_STATUS_OPTIONS`, `EDUCATION_LEVEL_OPTIONS`, `SCHEME_CATEGORY_OPTIONS`, `GOV_ID_KEYS`, and `GOV_ID_LABELS`) that populate dropdown select elements safely.

### 6.2 HTTP Client wrappers — `app/lib/api-client.ts`
- **Base URL configuration**: Resolves API url via the environment variable `process.env.NEXT_PUBLIC_API_URL` falling back to `http://localhost:8000` for local execution.
- **Fetch wrappers**:
  - `submitIntake(profile)`: sends a POST request with the profile. Catches non-200 responses, extracting `error_message` from backend error JSON payload.
  - `fetchDraft(schemeId, requestId)`: sends a GET request to `/api/draft/{scheme_id}?request_id=...`. Catches `404` errors specifically, returning a clear session-expiration explanation (30 min TTL).
  - `checkHealth()`: queries `/api/health` to confirm backend liveness.

---

## 7. Design System & Styling System

### 7.1 TailwindCSS v4 Theme Variables
Defined inline under `@theme inline` in [globals.css](file:///d:/Yojana-Saathi/Frontend/app/globals.css):
- **Navy shades**:
  - `--color-navy`: `#1B2B4B`
  - `--color-navy-50`: `#f0f4fb`
  - `--color-navy-800`: `#1e335a`
  - `--color-navy-900`: `#1B2B4B`
- **Orange shades**:
  - `--color-orange`: `#F5842B`
  - `--color-orange-50`: `#fff6ef`
  - `--color-orange-100`: `#FDE7D6`
  - `--color-orange-500`: `#F5842B`
  - `--color-orange-600`: `#e07119`
- **Shadow**:
  - `--shadow-soft`: `0 4px 20px rgba(0, 0, 0, 0.05)`

### 7.2 Custom utility classes
- `.dotted-path`: Creates a background radial dot grid used for visual texture.
- `.hero-bg`: Attaches a top-right decorative SVG overlay representing curves and branding blocks.
- `.hide-scrollbar`: Hides scrollbar display for Webkit/MS browsers while maintaining horizontal scroll capabilities.
- `.range-slider`: Custom styles for input range sliders.

---

## 8. Configuration & Environment

- **Next.js Configurations**: Custom typescript config (`tsconfig.json`) and PostCSS configurations (`postcss.config.mjs`) are loaded on runtime.
- **Dependencies**: Pin core dependencies strictly in `package.json`:
  - `next`: `16.2.10`
  - `react`: `19.2.4`
  - `react-dom`: `19.2.4`
  - `@tailwindcss/postcss`: `^4`
  - `tailwindcss`: `^4`
  - `typescript`: `^5`

### Environment Variables
For local execution, the frontend expects a `.env` or system variables setup containing:
- `NEXT_PUBLIC_API_URL`: Points to the API service URL (e.g. `http://localhost:8000`).
- `NEXT_PUBLIC_SUPABASE_URL`: The Supabase project endpoint URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The Supabase public client anonymous key.

---

## 9. Privacy & Security Model

The frontend is built to guarantee maximum data protection:
1. **Supabase Row-Level Security (RLS)**: Enforced directly at the database level. Every select, insert, update, or delete request checks the user's authenticated Supabase user ID, guaranteeing that no user can access another's profile, documents, notifications, or applications.
2. **JWT Authorization**: Requests made to FastAPI Document Vault and admin routes carry a Bearer JWT access token, validated server-side.
3. **Cross-Site Scripting (XSS) Mitigation**: The React framework automatically escapes values. Free-text profile fields are recursively stripped of HTML and script tags on the backend.
4. **Secure Sign-Out**: Logging out invokes Supabase `auth.signOut()`, purging all session tokens and local browser caches instantly.

---

## 10. Running & Deploying

### Local Development

1. Install Node dependencies:
   ```bash
   cd D:/Yojana-Saathi/Frontend
   npm install
   ```
2. Run the Next.js dev server:
   ```bash
   npm run dev
   ```
   The development page will be available at <http://localhost:3000>.

### Production Build

1. Build the production application bundle:
   ```bash
   npm run build
   ```
2. Start the production build locally:
   ```bash
   npm run start
   ```

### Deployment
The frontend deploys as a static or SSR Next.js application:
- **Vercel**: Simply connect the repository; the platform auto-detects settings and provisions the NextJS page.
- **Environment**: Set `NEXT_PUBLIC_API_URL` to your deployed backend domain (e.g., `https://yojanasaathi-backend.onrender.com`).
