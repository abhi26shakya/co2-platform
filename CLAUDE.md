# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Emissia — a platform that predicts industrial CO₂ emissions from satellite imagery.
Monorepo with three independently deployable services:

    Next.js frontend ──> FastAPI backend ──> ML service (isolated)
                              │
                    PostgreSQL · Redis · local/S3 storage

The ML service is currently a **mock** behind a stable versioned contract (see
"ML integration boundary" below) — there is no real model wired in yet.

## Commands

### Local dev (host, hot reload — the normal workflow)

```bash
# infra + ML service in Docker
docker compose up -d postgres redis ml-service

# backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
alembic upgrade head          # create tables
python -m scripts.seed        # demo user demo@emissia.dev / demopass123, model row, 7 plants
uvicorn app.main:app --reload --port 8000

# frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Full stack in Docker instead: `docker compose --profile full up --build`.
Frontend :3000, backend :8000 (docs at `/docs`), ml-service :8001 (docs at `/docs`).

### Tests / lint / typecheck

```bash
cd backend && pytest                 # unit + API tests (needs CO2_TEST_DATABASE_URL or sqlite fallback)
cd backend && pytest tests/test_predictions.py -k some_test   # single test
cd backend && ruff check .           # lint (line-length 100, rules E,F,I,UP,B)
cd backend && mypy app               # optional typecheck (strict=false)

cd ml-service && pytest              # contract tests for /predict
cd ml-service && ruff check .

cd frontend && npm run lint          # eslint . — currently reports pre-existing findings, see .claude/docs/KNOWN_ISSUES.md KI-002
cd frontend && npm run typecheck     # tsc --noEmit
cd frontend && npm run test          # vitest run
cd frontend && npm run build
```

CI (`.github/workflows/ci.yml`) runs these three jobs (backend/ml-service/frontend)
independently on every push/PR to `main`. Match that before considering work done.

### DB migrations

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Architecture

### The ML integration boundary (the most important seam in this repo)

- The ML service owns inference only. Contract: `POST /predict` returning
  `PredictionResultV1` — a versioned Pydantic schema **duplicated deliberately**
  in `backend/app/schemas/prediction.py` and `ml-service/app/schemas.py`. Keep
  both in sync when the contract changes; never mutate V1 in place — add a V2
  in both files and version the endpoint if the model's output shape changes
  (e.g. per-pixel heatmaps, uncertainty bands).
- The backend consumes inference through an `InferenceClient` protocol
  (`backend/app/services/inference/base.py`): `MockInferenceClient`
  (in-process, no ML service needed) or `HTTPInferenceClient`, selected by
  `CO2_INFERENCE_BACKEND` (`mock` | `http`) via `factory.py`.
- Swapping in a real model touches **only** `ml-service/app/inference/` (see
  the checklist docstring in `ml-service/app/inference/mock.py` and
  `docs/ml-integration.md`): implement the `Predictor` protocol, point
  `PREDICTOR` in `ml-service/app/main.py` at it, move deps from
  `requirements-model.txt` into `requirements.txt`, then flip
  `CO2_INFERENCE_BACKEND=http` on the backend. Nothing in the backend or
  frontend needs to change — they only ever speak the versioned contract.

### Backend layering (Clean Architecture, `backend/app/`)

    api/v1/*        routers — HTTP only, no business logic
      -> services/   business logic, inference adapter selection
        -> repositories/   SQLAlchemy queries
          -> models/        ORM (users, satellite_images, uploads, predictions,
                             models, inference_logs, reports, refresh_tokens, plants)
    schemas/         Pydantic — the API contract, independent of ORM models

Storage is behind a `StorageBackend` protocol (`app/storage/`):
`LocalStorageBackend` today, `S3StorageBackend` planned — same interface,
`get_url()` already shaped for presigned URLs later.

Auth: Argon2id password hashing, short-lived JWT access tokens (30 min) +
opaque refresh tokens (14 days) stored only as SHA-256 hashes with rotation
on every refresh (a stolen/reused refresh token gets revoked on first
legitimate reuse). Login returns identical errors for unknown email vs wrong
password. `CurrentUser` dependency (`app/api/deps.py` / `app/core/deps.py`)
guards protected routes. Rate limiting via slowapi + settings-driven storage
(`CO2_RATE_LIMIT_STORAGE`: `memory://` locally, redis in prod so limits hold
across workers).

Config: all settings load from env vars prefixed `CO2_` (`app/core/config.py`,
pydantic-settings). Copy `.env.example` → `.env` to get started.

### Frontend (`frontend/src/`, Next.js App Router)

- Route groups: `(public)` (marketing + `(auth)` login/signup),
  `(protected)` (the app shell: dashboard, upload, datasets, maps,
  processing, analytics, reports, ai, shared-links, settings).
- Feature-folder structure under `src/features/<feature>/{components,hooks,store}`
  mirrors the route groups — look there first, not just in `app/`.
- React Query owns all server state; `zustand` is used only for local/UI
  state that needs to survive across components (e.g. `features/maps/store`).
- `src/services/api-client.ts` attaches the bearer token and does a
  single-flight refresh-and-retry on 401; tokens live in localStorage via
  `src/lib/auth-tokens.ts`.
- Next.js rewrites bake `BACKEND_URL` (from `.env.local`) at build time —
  relevant when changing where the backend is hosted.
- **Maps**: `features/maps/components/map-canvas/maplibre-map.tsx` drives a
  single **MapLibre GL** engine for both 2D and 3D — 3D is MapLibre's globe
  projection (`map.setProjection({type: "globe"})`), not a separate renderer.
  CesiumJS was retired (see KI-004 in `.claude/docs/KNOWN_ISSUES.md`) and the
  `leaflet`/`react-leaflet` npm packages are legacy/unused. Entering 3D mode
  applies a violet-toned `map.setSky()` atmosphere (`GLOBE_SKY` in that file)
  and eases the camera to a planetary-view zoom/pitch so the globe and its
  atmosphere are actually visible — reapplied after every basemap swap since
  `setStyle()` resets it.
- Design tokens live in `globals.css`: a dark-first "orbital observation"
  palette. The amber→magenta plume gradient (`--color-plume-low/high`) is the
  canonical treatment for emission-intensity data (map hotspots, upload
  progress, chart series tied to real values). A separate violet/magenta/blue
  "voyager" trio (`--color-voyager-violet/magenta/blue`) is the general UI
  chrome language (nav active-states, glow accents, the homepage hero globe) —
  introduced for a Dribbble-inspired ("Voyager2") redesign; unlike the plume
  gradient it is *not* data-exclusive. `--color-sensor`/`--color-halo` remain
  for status/accent use (success, confidence, secondary accent) alongside
  both. Fonts are loaded via `next/font/google` in `app/layout.tsx`: Space
  Grotesk (`--font-display`, UI chrome), Inter (`--font-sans`, body), IBM
  Plex Mono (`--font-mono`, data readouts), and Fraunces (`--font-serif`,
  reserved for large italic hero headlines only — see `.headline-serif-italic`
  in `globals.css`). The homepage hero's glowing dot-globe is a real WebGL
  scene (`components/marketing/particle-globe.tsx`, three.js +
  `@react-three/fiber`), mounted client-only via
  `components/marketing/particle-globe-loader.tsx` since `next/dynamic`'s
  `ssr:false` isn't allowed directly inside a Server Component page.

### ML service (`ml-service/app/`)

Minimal FastAPI app: `main.py` wires a `PREDICTOR` (currently `inference/mock.py`)
behind `POST /predict`; `inference/base.py` defines the `Predictor` protocol
new models must implement.

## Notes for future work

- `docs/architecture.md` and `docs/ml-integration.md` contain the fuller
  design-decision writeups per build stage — worth checking before large
  changes, but verify claims against code where feasible, since the docs
  are not always kept current with fast-moving frontend work.
- Post-v1 backlog (from architecture doc, not yet done): Celery for heavy
  reports/preprocessing, S3 storage backend, Google OAuth, before/after scene
  comparison, plant auto-matching on upload, Redis-backed rate limits in compose.
