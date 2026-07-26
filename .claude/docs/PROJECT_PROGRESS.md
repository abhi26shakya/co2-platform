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

Date: 2026-07-26

---

# Current Focus

- Map Section redesign, Milestone 3 (GIS tools/export hardening) complete
  — see M-006. Real backend-integrated export was explicitly deferred: the
  backend's `/reports` endpoint is an account-wide summary feature with no
  viewport/gas/basemap parameters, a separate concern from the map's
  client-side export panel.
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

Deferred: real backend-integrated viewport export, glassmorphism visual
pass.

Reference:

- completed-features.md
- CHANGELOG.md

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

1. Clean up the 95 lint findings now surfaced by the fixed pipeline
   (B-002) — prioritize the `react-hooks/set-state-in-effect` and
   `react-hooks/refs` findings, which look like real bugs.
2. Extend frontend test coverage to Compare Predictions / Real-time
   Alerts logic (newest, least-tested code in `emission-map.tsx`).
3. Set up Redis-backed rate limiting in docker-compose for prod parity.
4. Choose a model/dataset to begin real ML integration (replacing the
   mock predictor).

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