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

---

# High Priority Issues

Issues affecting important functionality.

## KI-002 — Frontend lint now runs but exposes 95 pre-existing findings

**Classification**: Bug / Technical Debt
**Discovered**: 2026-07-26, immediately after fixing KI-001 (see Resolved
Issues) — the lint tool had never successfully run before, so these
findings were invisible until now.
**Description**: `npm run lint` now executes and correctly exits 1 with
60 errors / 35 warnings: 43 `@typescript-eslint/no-explicit-any`, 33
`@typescript-eslint/no-unused-vars`, 11 `react-hooks/set-state-in-effect`,
2 `react-hooks/refs` (accessing `.current` during render in
`image-viewer.tsx`), 2 `react-hooks/immutability`, 2 `prefer-const`, 1
`react-hooks/exhaustive-deps`, 1 `next/no-img-element`.
**Impact**: `frontend` CI's `lint` step will now correctly fail until
these are addressed — this is expected/correct behavior of a working
lint pipeline, not a new regression. The `react-hooks/set-state-in-effect`
and `react-hooks/refs` findings (`settings-provider.tsx`,
`image-viewer.tsx`) look like genuine bugs (cascading renders, stale ref
reads during render) rather than style nits and should be prioritized
over the `any`/unused-var cleanup.
**Resolution Plan**: Unscheduled — needs a dedicated cleanup pass
(candidate for `/refactor` or `/cleanup`). Not fixed in this session by
explicit user decision, to keep the lint-tooling fix (KI-001) isolated
from a much larger codebase cleanup.

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