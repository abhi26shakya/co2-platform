# Project Progress

## Purpose

This document tracks the current implementation progress of the project.

It provides a real-time overview of completed work, ongoing tasks, blockers, milestones, technical progress, and current priorities.

This document should always represent the current state of development.

---

# Project Status

## Current Phase

Development (backend/ML services are test-covered and CI-gated; frontend
just gained its first test suite this session).

---

## Current Version

Version: 0.1.0 (frontend), unversioned backend/ml-service (pre-1.0)

---

## Overall Progress

MVP feature surface (auth, upload, mock predictions, reports, analytics,
interactive maps) is functionally complete. Real ML model integration and
production-hardening (S3, Celery, prod rate-limit backend) remain.

```
███████░░░ ~70%
```

---

## Last Updated

Date: 2026-08-13

---

# Current Focus

- Map Section redesign, Milestone 5 (real PDF/PNG map export) complete —
  see M-008. Required no backend changes: `GET /map/plants`/`GET /map/hotspots`
  and `POST /reports` already existed and worked (an earlier claim in this
  session that the map endpoints were missing was wrong and corrected —
  see M-008 for the full story). GeoTIFF stays simulated by design.
- Frontend CI now runs `npm run test` (Vitest) alongside lint/typecheck/build.

---

# Completed Work

### M-001 — Core platform (backend/ML)

Auth (Argon2id + JWT + rotating refresh tokens), image upload, mock
inference contract, predictions, reports, analytics, dashboard — all
implemented, tested (pytest), and CI-gated in `backend/` and `ml-service/`.

### M-002 — CesiumJS map experience (frontend)

3D globe migration off leaflet, multi-gas visualization, GIS drawing/
measurement tools, timeline playback, compare-predictions modes,
real-time alerts, export/sharing system. Implemented but untested until
M-003.

### M-003 — Frontend test infrastructure (this session)

Vitest + React Testing Library added. Initial coverage: `map-store`
(camera/basemap/gas-layer state + localStorage persistence), `use-geo`
(`usePlants`/`useHotspots`/`useAnalytics`), `usePredict`,
`useRunPrediction` (incl. query-invalidation behavior). 23 tests, all
passing. CI's `frontend` job now runs `npm run test`.

### M-004 — Map Section redesign, Milestone 1: layout/UX restructure (this session)

Resolved the `emission-map.tsx` monolithic-component tech debt (see
`KNOWN_ISSUES.md`). `maps/page.tsx` (was 1242 lines) and `emission-map.tsx`
(was 1045 lines) decomposed into `features/maps/components/{map-canvas,
map-controls,layer-panel,search,gis-tools,timeline,comparison,
facility-inspector,alerts,export-share}/`, new hooks (`use-drawing.ts`,
`use-map-export.ts`), a `map-ui-store.ts` for left-rail/drawer UI state, and
pure GIS geometry helpers (`gis-tools/lib/geo-math.ts`, unit-tested).
Layout changed from a permanent 6-card left rail + bottom detail grid to a
collapsible icon rail (one flyout panel at a time), a full-bleed map
canvas, a slim timeline bar, and an on-demand facility-inspector drawer.
Mock plant enrichment (fabricated sector/company/gas data — no such fields
exist on the backend `PlantOut` schema yet) isolated into
`features/maps/lib/enrich-plants.ts` with a placeholder comment rather than
left inline. All `alert()` calls replaced with inline status text. 35 new
tests added (geo-math, map-ui-store, use-drawing, use-map-export), all
passing; typecheck/lint/build clean; manually verified in-browser (panel
toggling, search, GIS drawing tools, timeline, facility drawer, export,
share dialog — no new console errors).

Deferred to later milestones: a 2D MapLibre GL mode toggleable against the
existing Cesium 3D globe, backend-integrated export/share (currently
client-only simulation), and a glassmorphism visual pass.

### M-005 — Map Section redesign, Milestone 2: MapLibre GL 2D mode (this session)

Added a real 2D map mode (MapLibre GL JS) toggleable against the existing
CesiumJS 3D globe via a new `ModeToggle` control, replacing the dead
`leaflet`/`react-leaflet` dependencies (removed — see `KNOWN_ISSUES.md`)
with an actually-used one. New engine component
`features/maps/components/map-canvas/maplibre-map.tsx` mirrors
`emission-map.tsx`'s exact prop contract so `maps/page.tsx` swaps engines
by choosing which dynamic import to render, no branching duplicated.
`map-store.ts` gained a persisted `mapMode: "2d" | "3d"` field.

To avoid drift between the two engines, shared pure logic was factored out
of `emission-map.tsx` into new modules both engines import: gas-plume
color/offset math (`features/maps/lib/gas-plume.ts`), raster basemap tile
URLs (`features/maps/lib/basemap-tiles.ts`), and mode-aware catalogs for
basemaps and visualization modes (`basemap-catalog.ts`,
`visualization-mode-catalog.ts` — "Terrain 3D" and "3D Extruded Columns"
have no 2D equivalent, so `BasemapSelector`/`VisualizationModeSelector`
filter them out when `mapMode === "2d"`, falling back to a supported mode
without mutating the user's stored 3D preference). GIS drawing tools
(polygon/rectangle/circle/polyline/distance/area/picker) were reimplemented
for MapLibre's click/mousemove events but call the same `geo-math.ts`
builders as the Cesium engine, plus a new `haversineDistanceM` helper for
2D lng/lat-based distance (Cesium's `Cartesian3.distance` has no
equivalent in a flat lng/lat frame).

12 new tests added (haversine, basemap/visualization-mode catalogs,
`mapMode` store coverage), 70/70 passing; typecheck/lint/build clean.
Manually verified in-browser: 2D/3D toggle, basemap switching in both
modes, GIS rectangle drawing with live + final measurement in 2D, facility
alert click → camera fly-to → inspector drawer in 2D, and re-verified the
existing 3D mode still works with no regression — no new console errors.

Deferred to later milestones: backend-integrated export/share, a
glassmorphism visual pass, and further GIS-tool hardening.

### M-006 — Map Section redesign, Milestone 3: GIS tools/export hardening (this session)

Frontend-only hardening pass, scoped down from the original "real
backend-integrated export" plan after finding the backend's `/reports`
endpoint has no viewport/gas/basemap parameters — it generates an
account-wide emission summary, a different feature from the map's
client-side export panel. Building a viewport-scoped backend export
endpoint was deferred as its own (larger, cross-cutting) piece of work.

Fixed four concrete gaps found during review:

- **Degenerate polygons**: both engines let a "polygon"/"area" drawing
  complete via double-click with only 2 points, producing an invalid
  GeoJSON Polygon. Added `hasMinimumPoints`/`pointsRemaining` to
  `geo-math.ts` (polygon/area need ≥3 points, polyline/distance need ≥2);
  both engines now show a live hint ("Add at least N more point(s)...")
  instead of silently completing a broken shape.
- **Share link ignored the real camera**: `triggerMapShare` hardcoded
  `lat=22.50&lon=79.50&zoom=9` regardless of where the user had actually
  panned/zoomed, and omitted `mapMode`. Extracted a pure
  `features/maps/lib/share-link.ts#buildShareLink` that reads the actual
  `map-store` camera plus `mapMode`, `basemap`, and active gases.
- **QR code auto-fired a third-party request**: `share-dialog.tsx` loaded
  an `api.qrserver.com` image embedding the full share link the instant
  the dialog opened, with no user action. Now gated behind an explicit
  "Generate QR Code" button, with a disclosure line once generated.
- **Simulated export formats looked real**: `use-map-export.ts`'s
  `tiff`/`pdf` formats produce hardcoded placeholder content, unlike the
  other four formats which reflect real map state. `export-menu.tsx` now
  shows a "Simulated" badge on those two buttons only.

9 new tests added (`hasMinimumPoints`/`pointsRemaining`, `buildShareLink`),
83/83 passing; typecheck/lint/build clean (no new lint debt — one
`useEffect`-based state reset was rewritten as an in-render state
adjustment to avoid introducing a new `react-hooks/set-state-in-effect`
warning). Manually verified in-browser: polygon/area correctly refuses to
complete with 2 points and completes normally with 3+; share dialog
reflects actual camera position and `mode`; QR image only loads after the
explicit click; export menu shows "Simulated" only on GeoTIFF/PDF;
re-verified 2D/3D toggle still works with no regression — no new console
errors.

### M-007 — Map Section redesign, Milestone 4: glassmorphism visual pass (this session)

Visual-only pass applying the site's existing theme-aware glass system
(`.glass`/`.glass-strong` in `globals.css`, already used on the homepage
and app shell) to the map feature's UI chrome, replacing ad hoc
`bg-ground-900/NN border-ground-700/NN` surface treatments. No behavior,
state, or test changes.

- Side rail + flyout panels (search, layers, gas, GIS tools, export) →
  `.glass`.
- Floating canvas overlays (compass, mouse-coordinate readout, camera
  controls, 2D/3D mode toggle, layer-toggle overlay, intensity legend) →
  `.glass-strong` for legibility over busy map imagery.
- Facility-inspector drawer and share dialog (modal-like) → `.glass-strong`;
  timeline bar and comparison panel → `.glass`.
- Deliberately left untouched: alert-severity colors in `alerts-badge.tsx`,
  the collapsed alerts pill's red border, and the fullscreen-error notice's
  red border — these are semantic status colors, not generic chrome, same
  category as the plume-gradient exclusion already documented in
  `CLAUDE.md`.

Typecheck/lint/test/build all clean (83/83 tests, no new lint debt).
Manually verified both themes (light and dark, toggled via
Settings → Appearance) and both map modes render the glass surfaces
correctly with good contrast — confirmed light mode looks like an
intentionally designed second theme, not an inverted dark mode.

Two pre-existing issues (not introduced by this visual-only pass) were
found during manual verification. The MapLibre one was fixed as a small
follow-up in this same branch: `gas-heatmap`'s `heatmap-opacity` paint
property was set to a per-feature data expression (`["get", "opacity"]`),
which MapLibre's style spec doesn't support for that property (unlike
`heatmap-weight`/`heatmap-radius`, which do allow data-driven expressions)
— it threw a console error and the 2D heatmap mode's opacity was
effectively unstyled. Fixed by folding each gas layer's opacity into
`heatmap-weight` instead (`["*", ["get", "intensity"], ["get", "opacity"]]`)
and giving `heatmap-opacity` a constant value. The second issue, a
pre-existing root-layout theme hydration warning already noted in earlier
sessions, remains out of scope here.

Deferred: real backend-integrated viewport export, glassmorphism visual
pass.

### M-008 — Map Section redesign, Milestone 5: real PDF/PNG map export (this session)

Made two of the map's six export formats genuinely real, no backend
changes needed:

- **PNG**: was a fixed 640×480 canvas with drawn text, not a map
  screenshot. Now captures the actual live map canvas
  (`document.querySelector('[data-map-viewport] canvas')`, a stable
  attribute added to both `emission-map.tsx` and `maplibre-map.tsx`'s
  wrapper divs) via `canvas.toBlob()`. Both engines now set
  `preserveDrawingBuffer: true` on their WebGL context (Cesium:
  `contextOptions.webgl`; MapLibre: `canvasContextAttributes` — the
  top-level `preserveDrawingBuffer` option was removed/moved in this
  MapLibre version) since WebGL clears its drawing buffer after each frame
  otherwise, which would make the capture blank.
- **PDF**: was a hardcoded placeholder blob. Now calls the real,
  already-working `POST /reports` (`backend/app/services/reports.py`,
  reportlab-based) and downloads the returned file. Added a minimal local
  `CreatedReport` type in `use-map-export.ts` matching the backend's
  actual schema — `frontend/src/types/report.ts`'s existing `ReportOut` is
  a much larger, mismatched shape (`dataset_name`, `confidence_score`,
  `hotspots`, etc.) that the real endpoint never returns; reusing it would
  have been misleading. `export-menu.tsx` no longer shows "Simulated" on
  PDF. `use-map-export.ts`'s `triggerExport` now handles png/pdf as real
  async operations and records a "Failed" history entry (styled red, was
  previously always green) if either fails, instead of only ever
  succeeding.
- GeoJSON/CSV/JSON were already real (built from the working `/map/plants`
  and `/map/hotspots` data) — unchanged. GeoTIFF is unchanged, still
  simulated, per the user's explicit decision (no suitable raster data
  source or dependency for real viewport-clipped rasterization).

**Correction to an earlier claim in this same session**: `/map/plants` and
`/map/hotspots` were briefly believed to be missing backend routes. They
are not — both exist in `backend/app/api/v1/analytics.py`
(`AnalyticsService.plants()`/`.hotspots()`), fully implemented and
user-scoped. The mistake came from grepping for a `map.py` filename that
doesn't exist; the routes are simply defined inside `analytics.py`. No
prerequisite backend work was actually needed.

**A real, pre-existing issue surfaced during manual verification, out of
scope to fix here**: `frontend/src/services/api-client.ts` has an
app-wide mock-data fallback (`getMockData`) that silently serves fake
data whenever a real request fails (network error or non-2xx status) for
several known paths, including `POST /reports`. In this session's sandbox
(no Python/GDAL toolchain available to run the real backend — see below),
the real `POST /reports` call returned 500, and the mock fallback
transparently substituted a fake report object whose hardcoded `url` is
`"/profile_pic.jpg"` — so the "successful" PDF export in this environment
actually downloaded a JPEG mislabeled `.pdf`. The map-export code itself
is correct and did make the real network call (confirmed via captured
network request: `POST /api/v1/reports → 500`); the masking happens one
layer up, in the shared API client, and affects every feature that hits a
mocked path, not just this one. Worth a dedicated look in a future
session — silently serving unrelated mock data on a 500 makes real
backend failures very hard to notice anywhere in the app.

**Also discovered, not acted on**: `backend/requirements.txt` already
lists `rasterio==1.4.3` (used by `backend/app/services/imaging.py` and
the ML service), contradicting this session's earlier assumption that
real GeoTIFF export would need "a new geospatial dependency." It's an
existing dependency — just not installable in this particular sandbox
(missing system `gdal-config`). This doesn't change the decision to skip
real GeoTIFF this milestone, but it means a future GeoTIFF milestone would
extend existing tooling rather than adding something new.

Verification: frontend typecheck/lint/test/build all clean (83/83 tests,
no new lint debt, no test changes needed for this milestone). Backend
`pytest` could not be run in this sandbox (no Python environment, and
`pip install -r requirements-dev.txt` fails locally on the missing GDAL
system library that `rasterio` needs to build) — no backend files were
changed, so this is a low-risk gap, not a regression risk. Manually
verified via a live frontend dev server + browser automation: PNG export
downloads a real screenshot in both 2D (1864×1340 RGBA, confirmed via
`file`) and 3D modes (both recorded "Successful"); PDF export's real
network call was confirmed via captured network request, but its
apparent "success" in this sandbox is the mock-fallback artifact
described above, not a genuine verified success — real success/failure
against an actual running backend was not verified end-to-end.

Reference:

- completed-features.md
- CHANGELOG.md

### M-009 — Production-readiness audit fixes, real ML integration, and the Voyager2 site redesign (2026-07-27 to 2026-08-13)

Consolidated summary of everything since M-008 (see `git log --oneline` for
the full commit list; this collapses ~15 merged PRs into one entry rather
than one per commit):

- **Audit-driven hardening** (`AUDIT_REPORT.md`, 2026-07-27): fixed the
  Reports management UI writing ~15 fields the backend schema doesn't have
  (KI-005 — favorites/comments/versions/share were UI-only illusions,
  stripped down to what `ReportOut` actually supports); removed a dead-code
  duplicate auth-dependency stack (`app/api/deps.py` +
  `app/repositories/user.py`); added a startup guard that refuses to boot
  outside development if `CO2_JWT_SECRET_KEY` is still the insecure
  default; rewrote `frontend/Dockerfile` as a real multi-stage build
  (`next build` → `next start`, non-root `nextjs` user) — **KNOWN_ISSUES.md
  still shows KI-006 as open/Critical for this; that's now stale, the fix
  is confirmed live in the Dockerfile.**
- **Real ML model integration**: OCO-3 + NO2/SO2 CNN wired in behind the
  existing `Predictor` protocol, replacing the mock-only inference path
  for real satellite data.
- **Settings and Dashboard rebuilds**: Settings went end-to-end real
  (profile, 2FA, OAuth, sessions, preferences — see KI-007/008/009/010 for
  the small residual gaps); dashboard UI passed through several rounds of
  polish (quick actions, upload flow, general UX).
- **CI/deploy fixes**: cleared ruff lint failures breaking `main`; fixed a
  mock-fallback regression that broke login/signup on the deployed
  (Vercel) site.
- **The Voyager2 redesign** (this repo's largest recent frontend change):
  CesiumJS was retired outright and MapLibre GL (already the 2D engine)
  now drives both 2D and 3D via its native globe projection — this
  resolved KI-004 (the Vercel-deployment 3D-map crash) as a side effect,
  since there's no Cesium runtime left to crash; verified directly against
  the production Vercel deployment, not just local dev. Site-wide dark
  "orbital observation" + light "ink on paper" theming was built out
  across the homepage (a WebGL particle globe hero, three.js +
  react-three-fiber), the app sidebar/navbar, and the maps page
  (sky/atmosphere/starfield polish on the MapLibre globe). Both themes are
  now genuinely designed, not one theme with inverted tokens.

Verification: typecheck/lint/build clean throughout; production Vercel
deployment spot-checked for the KI-004 regression risk specifically, since
that was the one prior production-affecting bug.

Reference: `CHANGELOG.md`, `KNOWN_ISSUES.md` KI-004/005/006.

---

# Current Work

Track active development.

---

## Task Template

### Task ID

TASK-001

---

### Title

---

### Description

---

### Owner

---

### Status

- Not Started
- In Progress
- Blocked
- Testing
- Completed

---

### Progress

Example:

```
██████░░░░ 60%
```

---

### Expected Completion

---

### Dependencies

---

### Notes

---

# Upcoming Work

List the next planned activities.

Priority order:

## Immediate

Tasks required next.

---

## Short Term

Tasks planned soon.

---

## Long Term

Future planned work.

---

# Development Metrics

Track project health.

---

## Code Metrics

Examples:

- Lines of code
- Number of modules
- Number of services
- Test coverage

---

## Feature Metrics

Examples:

- Total features
- Completed features
- Remaining features

---

## Quality Metrics

Examples:

- Bugs discovered
- Bugs resolved
- Test success rate
- Security issues

---

# Milestone Progress

Track major milestones.

| Milestone | Status | Progress |
|---|---|---|
| Foundation | Completed | 100% |
| Core Features | In Progress | 50% |
| Testing | Planned | 0% |

---

# Component Progress

Track progress by system component.

---

## Frontend

Status:

Progress:

Completed:

Remaining:

---

## Backend

Status:

Progress:

Completed:

Remaining:

---

## Database

Status:

Progress:

Completed:

Remaining:

---

## Machine Learning

Status:

Progress:

Completed:

Remaining:

---

## Infrastructure

Status:

Progress:

Completed:

Remaining:

---

# Current Blockers

### B-001 (RESOLVED 2026-07-26)

`next lint` no longer works as a tool — fixed by rewriting
`eslint.config.mjs` to import `eslint-config-next`'s native flat config
directly (instead of via the legacy `FlatCompat` shim) and pointing the
`lint` script at `eslint .` instead of the now-removed `next lint`
command. See KNOWN_ISSUES.md KI-001 (resolved).

### B-002

### Description

Now that lint actually runs, it correctly fails: 60 errors / 35 warnings
across the codebase (mostly `@typescript-eslint/no-explicit-any` and
unused vars, plus some real-looking `react-hooks/set-state-in-effect`
and `react-hooks/refs` bugs). See KNOWN_ISSUES.md KI-002.

### Impact

`frontend` CI's `lint` step will fail on every push until these are
addressed.

### Owner

Unassigned — flagged for `frontend-engineer`.

### Resolution Plan

Unscheduled — dedicated cleanup pass, candidate for `/refactor` or
`/cleanup`. Deliberately not bundled into the KI-001 tooling fix.

---

# Risks

Track active risks.

Examples:

- Technical limitations
- Resource constraints
- External dependencies
- Schedule risks

Reference:

RISK_REGISTER.md

---

# Recent Changes

Summarize recent development activity.

Examples:

- New features
- Refactoring
- Architecture changes
- Bug fixes

Reference:

CHANGELOG.md

---

# Testing Status

## Unit Tests

Status: Backend (pytest, 9 files/704 lines) and ml-service (pytest)
passing and CI-gated. Frontend now has Vitest coverage for
`features/maps` store + hooks (23 tests passing) — first frontend tests
in the repo.

Coverage: Backend/ML — core routes and the inference contract.
Frontend — map state store and prediction/geo query hooks. Not yet
covered: the 1045-line `emission-map.tsx` component itself (GIS export,
timeline, compare-predictions, alerts logic all live inline there — hard
to unit test without first extracting pure functions; flagged as
follow-up in TECH_DEBT.md).

---

## Integration Tests

Status: Backend has route-level integration tests via `TestClient` +
real Postgres in CI. No frontend integration/E2E tests exist yet.

---

## End-to-End Tests

Status: None. No Playwright/Cypress installed.

---

# Deployment Status

Current environment:

- Development
- Staging
- Production

Deployment status:

Infrastructure status:

Monitoring status:

---

# Documentation Status

| Document | Status |
|---|---|
| Architecture | Complete (root `docs/architecture.md`) |
| API Reference | Pending (`.claude/docs/API_REFERENCE.md` still a template) |
| Database | Pending |
| Deployment | Pending |
| Testing | Updated this session (`.claude/docs/TESTING.md`) |

---

# Next Recommended Actions

Superseded 2026-08-13 (all four items above are now done: lint pipeline
fixed and cleared, `emission-map.tsx` no longer exists post-Cesium
retirement, and real ML integration landed in M-009). Current list, per
`.claude/docs/NEXT_ACTIONS.md` (generated by `/next` this session):

1. Harden container/dependency security posture: non-root `USER` in
   `backend/Dockerfile` and `ml-service/Dockerfile` (frontend already has
   this), plus `pip-audit`/`npm audit` CI steps and a Dependabot config —
   see `AUDIT_REPORT.md` findings I2/I3, both still open and verified so
   this session.
2. Wire `CO2_REDIS_URL` for the backend service in `docker-compose.yml`'s
   `full` profile so the existing Redis container is actually used (B3,
   still open).
3. Sync `CONTEXT.md`/`KNOWN_ISSUES.md` to current repo state — both still
   describe CesiumJS as the 3D map engine and KI-006 as unresolved; both
   are stale as of this session's verification.
4. Add a CI coverage gate and a CD pipeline once a backend/ml-service
   hosting target is chosen (frontend already deploys via Vercel) — larger
   effort, deliberately deferred behind #1-2 above.

---

# Progress Update Rules

Update this document when:

- A milestone is completed.
- A major feature changes status.
- A blocker appears or is resolved.
- A deployment occurs.
- A major technical decision is made.
- Project priorities change.

Avoid updating for:

- Small code changes.
- Individual commits.
- Temporary experiments.

---

# Related Documentation

- CONTEXT.md
- PROJECT_ANALYSIS.md
- ROADMAP.md
- MVP_PLAN.md
- USER_STORIES.md
- CHANGELOG.md
- RELEASE_HISTORY.md

---

# Goal

This document should provide an accurate snapshot of the project's current state.

A developer or AI agent should be able to read this file and immediately understand:

- What is completed.
- What is being built.
- What is blocked.
- What should happen next.
- How close the project is to its goals.