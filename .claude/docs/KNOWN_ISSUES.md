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

## KI-001 — `next lint` broken on Next.js 16 / ESLint 9

**Classification**: Bug
**Discovered**: 2026-07-26, while wiring `npm run test` into frontend CI.
**Description**: `npm run lint` (→ `next lint`) fails immediately with
`Invalid project directory provided, no such directory: .../frontend/lint`.
Calling `eslint .` directly (bypassing `next lint`) also fails, with
`TypeError: Converting circular structure to JSON` inside
`eslint-config-next`'s FlatCompat shim — an incompatibility between
ESLint 9's flat config and the installed `eslint-config-next` version.
**Confirmed pre-existing**: reproduced on a clean `git stash` of `main`
before any changes in this session, so it is not a regression from the
new test infrastructure.
**Impact**: The `frontend` CI job's `lint` step runs before `typecheck`,
`test`, and `build`; since GitHub Actions stops a job on the first
failing step, those later steps — including the new Vitest step — may
not actually be executing in CI on `main` today. Needs verification
against actual Actions run history.
**Resolution Plan**: Not fixed in this session (separate scope from
frontend test infra). Needs either an `eslint-config-next` / ESLint
version alignment, or migrating the lint step to invoke
`eslint.config.mjs` directly with a config compatible with ESLint 9.

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