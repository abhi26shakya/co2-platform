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

- Map Section redesign, Milestone 1 (layout/UX restructure) complete — see
  M-004. Next up: Milestone 2 (MapLibre GL 2D mode + 2D/3D toggle).
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