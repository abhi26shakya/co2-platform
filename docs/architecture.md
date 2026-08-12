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
- React Query owns all server state; zustand covers local/UI state that
  needs to persist across components (e.g. the map camera/layer store).
- MapLibre GL JS (`maplibre-map.tsx`) for maps/heatmaps, driving both the flat
  (mercator) and 3D/globe (`map.setProjection({type: "globe"})`) views from
  one WebGL engine — not `react-leaflet`, and no longer a separate CesiumJS
  engine (retired 2026-08-12; see KI-004 in `.claude/docs/KNOWN_ISSUES.md`
  for why). Basemap imagery comes from CARTO/ArcGIS/OSM tile providers (no
  API key). Facility plumes render as MapLibre GeoJSON layers (heatmap,
  circle markers, contour rings, fill-extrusion columns, or an
  interval-animated pulse) colored by the plume gradient; camera state syncs
  with the zustand map store.
- Design tokens in `globals.css`: dark-first "orbital observation" palette.
  The amber→magenta plume gradient is the canonical treatment for
  emission-intensity data (map hotspots, upload progress, data-tied chart
  series). A separate violet/magenta/blue "voyager" trio
  (`--color-voyager-violet/magenta/blue`, added stage 16) is the general UI
  chrome language instead — nav/sidebar active-states, glow accents, the
  homepage hero globe — and is not data-exclusive the way the plume gradient
  is. Fonts load via `next/font/google` in `app/layout.tsx`: Space Grotesk
  (`--font-display`), Inter (`--font-sans`), IBM Plex Mono (`--font-mono`),
  and Fraunces (`--font-serif`, italic hero headlines only).

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
- Map: MapLibre GL JS on the CARTO dark basemap, client-only (touches
  `window`/DOM APIs directly — see the Frontend section above). Mercator
  (flat) and globe (3D) are the same engine, switched via
  `map.setProjection`. Plants render as point features in sensor green;
  hotspots/plumes as GeoJSON layers colored by interpolating the plume
  gradient with intensity - color IS the data. Layer toggles + legend.
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

## Settings rebuild (stage 15)

The Settings section (`frontend/src/features/settings/`, backend
`app/api/v1/settings.py` + extended `app/api/v1/auth.py`) went from
almost entirely non-functional (localStorage-only or `setTimeout`-faked)
to fully backed by real endpoints:

- Profile fields (organization/job title/country/bio) and avatar upload
  reuse the same `StorageBackend` protocol as satellite images
  (`app/services/settings.py`) - S3 migration covers avatars for free.
- Password change revokes all other sessions; account deletion is a soft
  delete (`is_active=False`, anonymized, row kept for FK integrity with
  predictions/uploads/reports) - see `app/services/settings.py`.
- Real per-device session list/revoke: `RefreshToken` gained device
  metadata columns, and access tokens now carry a `sid` claim
  (`app/core/security.py`) tying them to the refresh-token row that
  issued them, so "this device" can be identified without asking the
  client to resend its refresh token.
- Real TOTP 2FA (`app/services/security2fa.py`): setup/QR/backup codes,
  enforced at login via a short-lived `mfa` token distinct from access
  tokens (rejected by every protected route).
- Real Google OAuth account linking (`app/services/oauth.py`) - this is
  account *linking* for an already-authenticated user, not "Sign in with
  Google"; the platform's only sign-up path remains email/password.
- Appearance/AI/notification preferences persist server-side
  (`user_preferences` table, `app/repositories/preferences.py`) instead
  of `localStorage`-only, with `SettingsProvider` now hydrating from the
  API and using `localStorage` only as an instant-paint cache.
- Real SMTP email delivery (`app/services/email.py` +
  `app/services/notifications.py`), hooked into prediction/upload/report
  completion, gated per-user by preference, best-effort/non-blocking
  (never fails the request that triggered it).

Known follow-ups from this stage are tracked in
`.claude/docs/KNOWN_ISSUES.md` (KI-007, KI-008, KI-009): weekly-summary
email has no scheduler behind it yet, GitHub/ORCID account linking is
intentionally out of scope, and avatar storage's S3 migration is already
covered by the existing `StorageBackend` abstraction.

## Voyager2 redesign (stage 16)

Frontend-only visual redesign toward a Dribbble reference ("Voyager2 -
Explore Places 3d Globe"): a dark canvas, a glowing dot/particle 3D globe,
italic serif headlines, and a minimal top nav. Rolled out in phases:

- **Tokens + homepage hero**: real fonts wired via `next/font/google`
  (previously the `--font-*` CSS vars were referenced everywhere but never
  actually loaded, silently falling back to system fonts); new
  violet/magenta/blue "voyager" chrome trio alongside the existing plume/
  sensor/halo tokens (see Frontend section above). Homepage hero's old
  CSS/SVG `OrbitField` backdrop replaced by `components/marketing/
  particle-globe.tsx` - a real three.js/`@react-three/fiber` dot-matrix
  globe with continent-biased density, slow rotation, and a limb glow,
  mounted client-only via `particle-globe-loader.tsx`.
- **App shell reskin**: `components/layout/sidebar.tsx` kept its structure
  (left sidebar, collapse/focus-mode, mobile drawer) but active nav items
  now get a violet→magenta gradient accent bar instead of a flat gray
  highlight, and the logo sits in the same glowing icon-box treatment as
  the public navbar.
- **Maps globe polish**: `maplibre-map.tsx` gained sky/atmosphere styling
  (`GLOBE_SKY`, applied via `map.setSky()` whenever globe/3D projection is
  active) and a CSS starfield (`.map-starfield`, visible through the
  canvas's `alpha:true` context beyond the globe's silhouette) plus a
  blurred glow-halo layer under gas markers/pulse dots. Also fixed a real
  gap found during QA: the default camera zoom (5) and reset-camera zoom
  (3) were both too close-in for the globe's curvature/atmosphere to ever
  be visible, so entering 3D now also eases the camera out to zoom ~0.5.
- **Token rollout**: audited all remaining pages for non-token colors; only
  `analytics/page.tsx` (hardcoded hex chart colors, a redundant
  `resolvedTheme`-driven light/dark ternary now unnecessary since the CSS
  vars already resolve per-theme) and `docs/page.tsx` (Tailwind default
  `emerald`/`blue` badge colors instead of `sensor`/`halo`) needed changes.

Known limitation: MapLibre GL's globe projection did not visibly render
true spherical curvature during QA (the star/space boundary appeared as a
straight line rather than an arc at low zoom) - the sky/atmosphere/
starfield styling is confirmed active (`map.getSky()`), but whether the
underlying globe camera is rendering a true sphere in this MapLibre
version needs closer investigation if a more dramatic 3D globe look is
wanted later.

## Post-v1 backlog

Celery for heavy reports/preprocessing (would also unblock the
weekly-summary email digest, KI-007) · S3 storage backend · before/after
scene comparison · plant auto-matching on upload (nearest plant within
scene bounds) · Redis-backed rate limits in compose · GitHub/ORCID account
linking (KI-008).
