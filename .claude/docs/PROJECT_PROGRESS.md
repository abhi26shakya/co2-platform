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

- Closing the frontend test-coverage gap identified by `/next`: the map
  feature (zustand store + prediction/geo hooks) had zero tests despite
  being the most actively-changed, most complex part of the codebase.
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

### B-001

### Description

`next lint` fails outright (`Invalid project directory provided`) on
Next.js 16 with ESLint 9 + `eslint-config-next`'s flat-config compat
layer (circular structure error when calling `eslint .` directly too).
Confirmed pre-existing on `main` before this session's changes.

### Impact

The `frontend` CI job's lint step has likely been failing on every push;
because GitHub Actions steps run sequentially and stop the job on
failure, `typecheck`, the new `test` step, and `build` may never actually
execute in CI until this is fixed.

### Owner

Unassigned — flagged for `frontend-engineer` / `devops-engineer`.

### Resolution Plan

Not fixed in this session (out of scope for test-infra work). Needs
either an ESLint config downgrade/fix or migrating off `next lint` to a
direct `eslint.config.mjs` invocation compatible with ESLint 9's flat
config. See KNOWN_ISSUES.md.

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

1. Fix the frontend lint pipeline (B-001) — it's currently masking whether
   CI even reaches the new test/build steps.
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