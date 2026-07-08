# Emissia — Satellite CO₂ Emission Intelligence Platform

Predicting industrial CO₂ emissions from satellite imagery using machine learning.
Monorepo: Next.js frontend · FastAPI backend · isolated ML inference service.

**Status: v1.0 — all 14 build stages complete and verified.** Landing page,
auth (JWT + refresh rotation + rate limiting), GeoTIFF upload pipeline,
persisted predictions with inference logs, interactive hotspot map,
analytics + CSV export, PDF reports, model registry, image viewer.
The ML service is a mock behind a stable contract — see *Integrating the
real ML model* below.

## Quick start (local development)

Prerequisites: Docker, Node 20+, Python 3.12+

```bash
# 1. Infra + ML service in Docker
docker compose up -d postgres redis ml-service

# 2. Backend (host, hot reload)
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
alembic upgrade head          # create tables
python -m scripts.seed        # demo user (demo@emissia.dev / demopass123), model row, 7 plants
uvicorn app.main:app --reload --port 8000

# 3. Frontend (host, hot reload)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 — the status pill performs a live health check
through frontend → backend → ML service.

Full stack in Docker instead: `docker compose --profile full up --build`

## Services

| Service    | Port | Stack                          |
|------------|------|--------------------------------|
| frontend   | 3000 | Next.js 15, React 19, Tailwind 4 |
| backend    | 8000 | FastAPI, SQLAlchemy 2 (async)  |
| ml-service | 8001 | FastAPI (mock predictor)       |
| postgres   | 5432 | PostgreSQL 16                  |
| redis      | 6379 | Redis 7                        |

API docs: http://localhost:8000/docs and http://localhost:8001/docs

## Integrating the real ML model

The entire integration surface is one file:
`ml-service/app/inference/mock.py` — see the checklist in its docstring.
Implement the `Predictor` protocol, point `PREDICTOR` in `ml-service/app/main.py`
at your class, add model deps to `requirements-model.txt`. The backend and
frontend require **zero changes** because they speak only the versioned
contract in `backend/app/schemas/prediction.py` (`PredictionResultV1`).

## Tests

```bash
cd backend && pytest        # backend unit + API tests
cd ml-service && pytest     # contract tests for /predict
cd frontend && npm run typecheck && npm run lint
```

## Repository layout

See `docs/architecture.md` for the full architecture and design decisions.
