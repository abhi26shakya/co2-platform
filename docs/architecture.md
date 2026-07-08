# Architecture

Three deployable services + infrastructure:

    Next.js frontend ──> FastAPI backend ──> ML service (isolated)
                              │
                    PostgreSQL · Redis · Storage

## The ML integration boundary

- The ML service owns inference only. Contract: `POST /predict` returning
  `PredictionResultV1` (versioned Pydantic schema, duplicated deliberately in
  `backend/app/schemas/prediction.py` and `ml-service/app/schemas.py`).
- The backend consumes inference through the `InferenceClient` protocol
  (`backend/app/services/inference/`): `MockInferenceClient` (in-process, no
  ML service needed) or `HTTPInferenceClient`, selected by
  `CO2_INFERENCE_BACKEND` env var.
- Replacing the mock with the real CNN/U-Net touches only
  `ml-service/app/inference/` — see the checklist in `mock.py`.

## Backend layering (Clean Architecture)

    api/v1 (routers, HTTP only)
      -> services (business logic, inference adapter)
        -> repositories (SQLAlchemy queries)
          -> models (ORM)         schemas (Pydantic, API contract)

Storage goes through the `StorageBackend` protocol (`app/storage/`):
`LocalStorageBackend` now, `S3StorageBackend` later — same interface,
`get_url()` already designed for presigned URLs.

## Database (planned tables)

users · satellite_images · uploads · predictions · models ·
inference_logs · reports · refresh_tokens
Hotspots stored as JSONB — the structure will evolve with the model.

## Frontend

- App Router route groups: `(marketing)` `(auth)` `(dashboard)`
- React Query owns all server state; no global store.
- Leaflet + leaflet.heat for maps/heatmaps (no API key).
- Design tokens in `globals.css`: dark-first "orbital observation" palette.
  The amber→magenta plume gradient is reserved exclusively for
  emission-intensity data — UI chrome never uses it.

## Build stages

1. ✅ Architecture plan
2. ✅ Design decisions
3. ✅ Folder structure
4. ✅ Frontend scaffold
5. ✅ Backend scaffold
6. ✅ Docker + CI
7. ✅ Database models + Alembic migration (9 tables, verified on Postgres 16)
8. ✅ Authentication (Argon2id, JWT access, rotating refresh tokens)
9. ✅ Dashboard (auth pages, app shell, live stats)
10. ✅ Upload module (validation, GeoTIFF metadata + previews, progress UI)
11. ✅ Prediction persistence + inference logs + datasets page
12. ✅ Analytics (timeseries, distribution, CSV export) + interactive map
13. ✅ Report generation (PDF via reportlab + CSV) + model management page
14. ✅ Hardening (rate limiting, logging, security headers, image viewer) + landing page

## Authentication design (stage 8)

- Argon2id password hashing (argon2-cffi).
- Short-lived JWT access tokens (30 min) + opaque refresh tokens (14 days).
- Refresh tokens stored only as SHA-256 hashes; rotation on every refresh —
  a used token is revoked, so a stolen refresh token dies on first legitimate use.
- Login returns identical errors for unknown email vs wrong password
  (no account enumeration).
- `CurrentUser` dependency guards protected routes; `/predictions` now requires auth.
- Rate limiting (slowapi + Redis) arrives in the security-hardening pass.

## Frontend auth + dashboard (stage 9)

- Tokens in localStorage via `lib/auth-tokens.ts`; `lib/api-client.ts` attaches
  the bearer header and performs a single-flight refresh-and-retry on 401.
- Route groups: `(auth)` for login/signup, `(dashboard)` for the app shell
  (sidebar layout). `/dashboard` renders live aggregates from `GET /dashboard`.
- Deployment note: Next.js rewrites bake `BACKEND_URL` at build time.

## Upload pipeline (stage 10)

- Content type decided by magic-byte sniffing, never the client header;
  spoofed extensions are rejected (tested).
- GeoTIFFs: rasterio extracts width/height/CRS/band info, reprojects bounds to
  WGS84 (feeds prediction `bounds` + map placement), and renders a
  percentile-stretched PNG preview (browsers can't display TIFF).
- Storage keys are unguessable (`images/{user}/{uuid}/name`); dev file serving
  via `GET /files/{key}` is replaced by S3 presigned URLs in production.
- Frontend uses XHR (fetch has no upload progress events); progress bar uses
  the plume gradient - the one place chrome shows it, since it tracks data
  entering the system.
- Every upload writes an audit row (`uploads`) with pending/completed/failed.

## Prediction persistence (stage 11)

- `POST /predictions {image_id}`: ownership check -> ML request built from the
  image row (storage URL, WGS84 bounds, metadata) -> result persisted with a
  link to the model registry row matching the returned model_version.
- Every inference writes an append-only `inference_logs` row (status, latency,
  error) - success AND failure - so monitoring reflects real error rates.
- Failed inference persists a `failed` prediction + 502 to the client.
- Datasets page: search, pagination, per-image run/download/delete with
  two-step delete confirm; results shown inline (plume gradient = data only).

## Map + analytics (stage 12)

- `GET /map/plants` (registry) and `GET /map/hotspots` (user's prediction
  hotspots flattened from JSONB, capped at the 500 most recent predictions).
- Map: Leaflet on the CARTO dark basemap, client-only via next/dynamic
  (Leaflet needs `window`). Plants render in sensor green; hotspots as circles
  colored by interpolating the plume gradient with intensity - color IS the
  data. Layer toggles + legend.
- `GET /analytics`: monthly timeseries (date_trunc), 8-bucket histogram
  (width_bucket, max folded into last bucket), source counts, summary stats -
  all aggregation in SQL.
- `GET /analytics/export`: CSV download (auth via fetch-blob on the client).

## Reports + model registry (stage 13)

- PDF: reportlab + matplotlib (pure pip - no pango/cairo system deps, keeps
  the Docker image slim). Light-themed by design: reports are print artifacts.
  Contains summary table, monthly trend + distribution charts, and the 15 most
  recent predictions. Empty-data reports render gracefully.
- Reports are stored assets (storage backend + `reports` table) with
  list/download/delete - not regenerated on every view.
- `GET /models`: registry, active first. The Model page shows metrics
  (accuracy/precision/recall/F1 - null until the real model registers them),
  live inference-service status, and the integration pointer.
- Generation is synchronous; move to Celery if reports grow heavy.

## Hardening + landing page (stage 14)

- Rate limiting: slowapi on signup/login/refresh, fully settings-driven
  (CO2_AUTH_RATE_LIMIT, default 30/minute; CO2_RATE_LIMIT_STORAGE -> redis in
  prod so limits hold across workers). Verified live: 5 passes then 429s.
- Structured request logging (one line per request: method/path/status/ms),
  global exception guard (clean JSON 500s, tracebacks only in logs), and
  security headers (nosniff, DENY framing, strict referrer).
- Image viewer: zoom (wheel/keys/buttons) + pan modal from dataset thumbnails.
  Before/after comparison slider is documented future work.
- Landing page: orbital SVG hero (no WebGL), scroll reveals via framer-motion
  honoring prefers-reduced-motion, features grid, research motivation, CTAs.

## Post-v1 backlog

Celery for heavy reports/preprocessing · S3 storage backend · Google OAuth ·
before/after scene comparison · plant auto-matching on upload (nearest plant
within scene bounds) · Redis-backed rate limits in compose.
