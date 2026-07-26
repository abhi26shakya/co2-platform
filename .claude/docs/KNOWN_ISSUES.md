# Known Issues

## Purpose

This document tracks known issues, limitations, technical debt, unresolved problems, and accepted constraints within the project.

Its purpose is to provide transparency about the current state of the system and help developers understand existing challenges before making changes.

This document should always represent the latest known issues affecting the project.

---

# Issue Classification

Issues are categorized as:

## Bug

Unexpected behavior that violates requirements.

---

## Limitation

A known constraint or missing capability.

---

## Technical Debt

A temporary engineering compromise requiring future improvement.

---

## Enhancement

A desired improvement that is not currently implemented.

---

# Severity Levels

## Critical

Issues that:

- Break core functionality.
- Cause data loss.
- Create major security risks.
- Prevent deployment.

---

## High

Issues that:

- Affect important workflows.
- Reduce reliability.
- Impact many users.

---

## Medium

Issues that:

- Affect some functionality.
- Have available workarounds.

---

## Low

Issues that:

- Have minimal impact.
- Affect convenience or maintainability.

---

# Issue Template

---

## Issue ID

ISSUE-001

---

## Title

Short descriptive name.

Example:

Slow Dashboard Loading With Large Datasets

---

## Type

Choose:

- Bug
- Limitation
- Technical Debt
- Enhancement

---

## Severity

- Critical
- High
- Medium
- Low

---

## Status

- Open
- Investigating
- Planned
- In Progress
- Resolved
- Won't Fix

---

## Date Identified

YYYY-MM-DD

---

## Description

Describe:

- What is happening?
- Where does it occur?
- Why is it important?

---

## Expected Behavior

Describe what should happen.

---

## Current Behavior

Describe what currently happens.

---

## Impact

Explain the effect on:

- Users
- Developers
- Performance
- Reliability
- Security

---

## Affected Components

Examples:

- Frontend
- Backend
- Database
- API
- ML Pipeline
- Infrastructure

---

## Workaround

Describe any temporary solution.

If none:

> None

---

## Root Cause

Explain the underlying reason.

---

## Proposed Solution

Describe possible fixes or improvements.

---

## Priority

- Critical
- High
- Medium
- Low

---

## Related Tasks

Reference:

- pending-work.md
- roadmap.md
- GitHub issues

---

## Related Documentation

Reference:

- ARCHITECTURE.md
- SECURITY.md
- PERFORMANCE.md
- DECISIONS.md

---

# Active Issues

Maintain current unresolved issues here.

---

# Critical Issues

Issues requiring immediate attention.

## KI-004 — 3D map mode (Cesium) crashes the browser tab on the deployed Vercel build

**Classification**: Bug
**Discovered**: 2026-07-27, reported by the user hitting `co2-platform-nine.vercel.app/maps`
(a real "This page couldn't load" Chrome renderer-crash screen, not an app
error boundary).
**Description**: Navigating to `/maps` in 3D mode (the previous default),
or toggling from 2D to 3D, reliably crashes the tab within ~2-3 seconds —
reproduced consistently against the deployed site. 2D (MapLibre) mode
works correctly on the same deployment (real basemap tiles, controls,
live data all render fine). Ruled out so far:
- Not a data-volume issue — the mock API fallback (prod has no live
  backend behind this Vercel deployment) returns only 4 plants / 2
  hotspots, fewer than local/seeded data.
- Not a CSP/security-header issue — no `next.config.ts` headers or
  `vercel.json` exist that would block Cesium's workers/WASM.
- Not (apparently) a code-level regression from tonight's camera/zoom
  hardening — that exact Cesium code was extensively stress-tested
  against a local `next dev` server the same session with zero crashes,
  including the same camera.changed/setView paths.
**Impact**: Anyone visiting the deployed site's Maps section in 3D mode
loses their browser tab. This was the default mode, so it very likely hit
every first-time visitor.
**Root cause**: Not yet identified. Suspected production-build-specific
(minification/chunking/timing) interaction with Cesium's global `<script>`
loading, or a GPU/renderer crash specific to the deployment's runtime —
neither confirmed. Following leads require access this session didn't
have: `chrome://gpu` / `chrome://crashes` on the affected browser (blocked
for browser-automation tools), and an Incognito-window repro to rule out
interfering extensions.
**Stopgap applied**: Changed `getSavedMapMode()`'s fallback in
`frontend/src/features/maps/store/map-store.ts` from `"3d"` to `"2d"`, so
new visitors (no `emissia-map-mode` in localStorage yet) land on the
working 2D mode instead of crashing. This does **not** fix 3D itself —
toggling to 3D manually still crashes — and does not help visitors who
already have `"3d"` persisted in localStorage from a prior visit.
**Resolution Plan**: Unscheduled — needs the browser-side diagnostics
above (chrome://gpu/crashes, Incognito repro) before a real root-cause fix
can be attempted.

---

# High Priority Issues

Issues affecting important functionality.

---

# Medium Priority Issues

Issues with acceptable workarounds.

---

# Low Priority Issues

Minor issues and improvements.

---

# Technical Debt Register

Track accumulated technical debt.

For each item include:

## Debt Item: `emission-map.tsx` is a 1045-line monolithic component

**Status: Resolved (2026-07-26)** — Map Section Redesign Milestone 1.
`frontend/src/app/(protected)/maps/page.tsx` and the old
`frontend/src/features/maps/components/map/emission-map.tsx` were split into
`features/maps/components/{map-canvas,map-controls,layer-panel,search,
gis-tools,timeline,comparison,facility-inspector,alerts,export-share}/`,
new hooks (`use-drawing.ts`, `use-map-export.ts`), a `map-ui-store.ts` for
left-rail/drawer UI state, and pure GIS geometry helpers in
`gis-tools/lib/geo-math.ts` (unit-tested — the exact gap this item called
out). `page.tsx` is now composition-only. See `PROJECT_PROGRESS.md` for the
full breakdown.

Description: All map rendering modes, GIS drawing/export tools, timeline
playback, compare-predictions sub-modes, and real-time alerts logic live
inline in one component (`frontend/src/features/maps/components/map/
emission-map.tsx`) rather than as separable, independently testable units.

Reason Introduced: Rapid feature iteration across several commits
(multi-gas layers → GIS tools → export/sharing → timeline → compare
predictions/alerts), each adding to the same file.

Impact: Cannot unit-test GeoJSON export or compare-predictions logic
without either mocking the whole CesiumJS global or extracting pure
functions first. Increases regression risk for future changes.

Estimated Effort: Medium (extract export/GeoJSON-generation and
compare-mode logic into pure functions/hooks, then test those directly).

Priority: Medium — not urgent, but compounds with every new map feature.

Planned Resolution: Unscheduled. Candidate for a future `/refactor` pass
once broader test coverage (this session's work) is in place to catch
regressions during extraction.

## Debt Item: Legacy `leaflet` / `react-leaflet` dependencies

**Status: Resolved (2026-07-26)** — Map Section Redesign Milestone 2.
`leaflet`, `react-leaflet`, and `@types/leaflet` were removed from
`frontend/package.json` (`npm uninstall`) as part of adding the MapLibre GL
2D map mode — the dead 2D dependency was replaced with an actually-wired-up
one. See `PROJECT_PROGRESS.md` M-005.

Description: Both packages remain in `frontend/package.json` but zero
files under `src/` reference them (confirmed via grep) since the
CesiumJS migration.

Reason Introduced: CesiumJS migration (commit `5a69579`) replaced Leaflet
without removing the now-unused dependencies.

Impact: Unnecessary bundle/install size only; no functional risk.

Estimated Effort: Trivial (`npm uninstall leaflet react-leaflet
@types/leaflet` + confirm build).

Priority: Low.

Planned Resolution: Unscheduled cleanup task.

## Debt Item: `frontend/src/types/report.ts`'s `ReportOut` doesn't match the real backend schema

Status: Active — discovered 2026-07-26 during Map Section Redesign
Milestone 5, not introduced by it.

Description: `types/report.ts` carries a comment claiming it "mirrors
backend/app/schemas/report.py + model.py," but the real backend
`ReportOut` (`backend/app/schemas/report.py`) only has `id`, `title`,
`format`, `params`, `created_at`, `url`. The frontend type instead
declares ~20 additional fields the API never returns — `dataset_name`,
`satellite_source`, `confidence_score`, `estimated_co2`,
`detected_facilities`, `hotspots`, `is_favorite`, `comments`, `versions`,
etc. Anything in `features/reports/` (or elsewhere) typed against this
interface can compile cleanly while reading `undefined` at runtime for
every one of those extra fields.

Reason Introduced: Unknown — likely written against an earlier, richer
mocked/imagined API contract before the real `/reports` endpoint was
implemented more simply, and never reconciled afterward.

Impact: Silent runtime mismatch, not a type error — any reports-feature
UI relying on the extra fields (favorites, comments, versions, confidence
score, etc.) is likely rendering `undefined`/blank rather than throwing,
which makes the bug easy to miss without checking against real API
responses. The map export feature (Milestone 5) worked around this by
declaring its own minimal, correctly-typed `CreatedReport` interface
locally in `use-map-export.ts` rather than trusting the shared type.

Estimated Effort: Medium — requires auditing every consumer of `ReportOut`
across `features/reports/` to see which fields are actually rendered vs.
assumed, then correcting the type and any UI that was relying on
non-existent fields (may reveal additional reports-feature bugs once
fixed).

Priority: Medium — not urgent (nothing crashes), but actively misleading
for anyone extending the reports feature, and a likely source of "why is
this always blank" bugs.

Planned Resolution: Unscheduled. Candidate for a future `/bug` or
`/refactor` pass on the reports feature specifically.

Related Components: Frontend (`features/reports/`, `types/report.ts`)

---

# Known Limitations

Document accepted limitations.

Examples:

- Unsupported platforms
- Scaling limitations
- Missing integrations
- External dependency constraints

---

# Resolved Issues

Keep historical records of resolved issues.

For each resolved issue record:

- Resolution date
- Solution implemented
- Related feature or release

Do not delete resolved issues.

## KI-001 — `next lint` broken on Next.js 16 / ESLint 9 (RESOLVED)

**Resolution date**: 2026-07-26
**Original description**: `npm run lint` (→ `next lint`) failed with
`Invalid project directory provided`; calling `eslint .` directly also
crashed with `TypeError: Converting circular structure to JSON`.
**Root causes** (two distinct bugs):
1. `eslint.config.mjs` used `FlatCompat.extends("next/core-web-vitals",
   "next/typescript")` — the legacy eslintrc-compatibility shim. The
   installed `eslint-config-next@16.2.10` already ships native flat-config
   arrays (`eslint-config-next/core-web-vitals`, `/typescript`); feeding
   an already-flat array through the legacy-config translator crashed
   during validation-error formatting.
2. Next.js 16 removed the `next lint` CLI command entirely (confirmed via
   `next --help` — not present in the command list), so the `lint` script
   invoking it could never have worked on this Next version.
**Solution implemented**: Rewrote `frontend/eslint.config.mjs` to import
`eslint-config-next/core-web-vitals` and `/typescript` directly instead
of via `FlatCompat`. Changed the `lint` script in `package.json` from
`next lint` to `eslint .`.
**Related**: Exposed 95 real pre-existing lint findings, tracked as
KI-002.

## KI-002 — Frontend lint exposed 95 pre-existing findings (RESOLVED)

**Resolution date**: 2026-07-27
**Original description**: `npm run lint` executed (after KI-001) and
correctly exited 1 with 60 errors / 35 warnings: 43
`@typescript-eslint/no-explicit-any`, 33 `@typescript-eslint/no-unused-vars`,
11 `react-hooks/set-state-in-effect`, 2 `react-hooks/refs`, 2
`react-hooks/immutability`, 2 `prefer-const`, 1
`react-hooks/exhaustive-deps`, 1 `next/no-img-element`. By the time this
was picked up the count had drifted to 55 errors / 23 warnings from other
work in between.
**Solution implemented**:
- `react-hooks/set-state-in-effect` (the "genuine bugs" per the original
  note): converted mount-only localStorage-init effects to lazy `useState`
  initializers (`settings-provider.tsx`, `(protected)/settings/page.tsx`,
  `(protected)/shared-links/page.tsx`); converted effects that adjust
  state in response to a prop/context changing (`user`, Settings Context,
  `shareId`, `isOpen`) to React's documented render-time-adjust pattern
  (track the previous key in state, compare, update inline) instead of an
  effect + `useEffect` dep array (see React's "You Might Not Need an
  Effect" guide). One case (`share-modal.tsx`) genuinely needs to stay an
  effect because it calls
  `Math.random()` for a new share ID, which React's purity rules forbid
  during render — kept as an effect with a *correctly targeted*
  `eslint-disable-next-line` (the original disable comment was on the
  wrong line and silently did nothing, which is why it was flagged as
  "unused" while the violation still fired). Also converted a
  `(protected)/processing/page.tsx` effect that derived `activeStage`/
  `activeStep`/`completedSteps`/`logs` purely from `progress` into plain
  render-time derivation (`useMemo` for the wall-clock-flavored log list),
  and replaced two boolean "have I already triggered X" effect guards with
  `useRef` instead of `useState` (mutating a ref doesn't re-render, so it
  was never state in the first place).
- `@typescript-eslint/no-explicit-any`: replaced with real types
  (`ReportOut`, `RecentUpload`, `TimeseriesPoint`/`DistributionBucket`,
  a new `SelectedFacility` type for the map store's polymorphic
  selection) everywhere a real type existed. `emission-map.tsx`'s ~20
  Cesium-related `any`s are a deliberate exception: Cesium is loaded as a
  global `<script>` tag (see main CLAUDE.md), not the npm package, so
  there's no TS surface for it; a file-level disable with a comment
  documents why (adding the `cesium` package as a devDependency purely
  for its ~80MB of `.d.ts` files, or hand-rolling a partial declaration
  file for the large surface used, were both judged worse than an honest
  `any`).
- Everything else (unused vars/imports, `prefer-const`,
  `next/no-img-element` on a genuinely external/decorative QR image) was
  a direct fix.
**Verification**: `npm run lint` / `tsc --noEmit` / `vitest run` (83/83)
/ `next build` all clean. Also verified live in a browser (not just
statically) — settings page (profile/AI-preferences/appearance tabs,
including an actual theme switch), the processing page's derived
progress/stage/log rendering, the shared-links empty state, and the full
`ShareModal` → `/share/[id]` round trip (not-found path and the
config-found + view-increment path) — no new console errors in any of
them.
**Related**: Backend/ml-service CI failures found in the same pass,
tracked as KI-003.

## KI-003 — Backend/ml-service CI failures, pre-existing and unrelated to KI-002 (RESOLVED)

**Resolution date**: 2026-07-27
**Original description**: All three CI jobs (`backend`, `ml-service`,
`frontend`) were failing on `main`, confirmed pre-existing by checking the
CI run immediately prior to the change that surfaced this (i.e. not
caused by that change):
- `ml-service`: `pytest -q` failed to even collect `tests/test_predict.py`
  — `starlette.testclient` requires `httpx`, which wasn't installed
  (`ml-service/requirements.txt` never listed it, and the CI step only
  ever did `pip install -r requirements.txt pytest ruff`).
- `backend`: `ruff check .` failed on two files under `scripts/` (a
  standalone CLI script, not imported by the app or its tests) —
  `scripts/load_co2.py:41` line too long (106 > 100), and
  `scripts/upload_seed_image.py:1` unsorted imports.
- Separately (not a CI failure, but hit while reproducing `backend`
  locally): `rasterio` has no prebuilt wheel for macOS arm64, forcing a
  from-source build that needs system GDAL headers not present on a
  fresh machine. Not itself a bug — arm64 dev machines need either
  `brew install gdal` or to build/run the backend in Docker (which uses
  `python:3.12-slim`, has prebuilt wheels) — but worth knowing before
  assuming a local `pip install -r requirements-dev.txt` failure means
  something is broken.
**Solution implemented**: Added `httpx` to the ml-service CI install line
in `.github/workflows/ci.yml`. Fixed the two `scripts/` files directly
(shortened the string, let `ruff --fix` sort the import).
**Verification**: Confirmed against the *exact pinned* `ruff==0.11.10`
(matching `requirements-dev.txt`/CI, not whatever newer version might be
on a dev machine globally — a newer ruff surfaced an unrelated `UP042`
finding elsewhere that CI's pinned version doesn't have, which would have
been a false lead). `ml-service`'s `ruff check .` + `pytest -q` (2 passed)
verified inside a `python:3.12-slim` container to match what CI actually
runs, since the host's Python 3.14/arm64 hits the `rasterio` wheel issue
above.

---

# Issue Management Process

When a new issue is discovered:

1. Confirm the issue.
2. Classify the issue type.
3. Assign severity.
4. Identify affected components.
5. Create a resolution plan.
6. Update status as progress occurs.
7. Document the final resolution.

---

# Issue Review

Review issues regularly:

- During sprint planning.
- Before releases.
- During architecture reviews.

Remove outdated assumptions but preserve historical context.

---

# Related Documentation

- PROJECT_PROGRESS.md
- ROADMAP.md
- RISK_REGISTER.md
- SECURITY.md
- PERFORMANCE.md
- ARCHITECTURE.md
- logs/bugs.md

---

# Maintenance Guidelines

Update this document whenever:

- A new issue is discovered.
- An issue status changes.
- A limitation is removed.
- Technical debt is added or resolved.
- A workaround changes.
- A major risk is identified.

This document should always provide an accurate view of the current challenges and limitations of the project.