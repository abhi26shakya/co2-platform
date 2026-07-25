# Decision Log

## Purpose

This log maintains a chronological record of significant technical, architectural, product, and operational decisions made throughout the project.

Unlike design documents, this file records **what was decided, when it was decided, why it was decided, and the expected impact**. It provides historical context for future contributors and helps explain how the project evolved over time.

Every significant decision should be appended to this file. Previous entries should never be modified except to correct factual errors.

---

# Decision Entry Template

## Decision Information

**Decision ID:** DEC-YYYY-001

**Date:**

**Category:**

- Architecture
- Backend
- Frontend
- Database
- Infrastructure
- Security
- Machine Learning
- Research
- Product
- DevOps
- Documentation
- Other

**Status:**

- Proposed
- Approved
- Implemented
- Superseded
- Rejected

---

## Decision

Provide a concise description of the decision.

Example:

> Use FastAPI instead of Flask for backend services.

---

## Context

Describe the problem, requirement, or situation that required this decision.

Include any important constraints or assumptions.

---

## Alternatives Considered

List other options that were evaluated.

Example:

- Flask
- Django
- Express.js
- Spring Boot

---

## Rationale

Explain why the chosen option was selected.

Consider:

- Simplicity
- Performance
- Scalability
- Maintainability
- Team familiarity
- Ecosystem support
- Cost
- Risk

---

## Expected Impact

Describe the expected benefits.

Examples:

- Better scalability
- Easier maintenance
- Faster development
- Improved reliability
- Lower operational complexity

---

## Trade-offs

Document any known disadvantages.

Examples:

- Increased learning curve
- Additional infrastructure
- Higher implementation effort
- Reduced flexibility

---

## Related Components

List affected areas.

Example:

- backend/
- frontend/
- database/
- ml-service/
- docker-compose.yml

---

## References

Reference supporting documents where applicable.

Examples:

- specs/
- docs/
- memory/
- research papers
- design documents

---

## Follow-up Actions

List any work required because of this decision.

Examples:

- Refactor authentication
- Update API documentation
- Create migration
- Benchmark performance

---

# Decision Guidelines

A new entry should be created when:

- A new framework or library is adopted.
- The system architecture changes.
- A database technology changes.
- An API contract changes.
- A deployment strategy changes.
- A major security decision is made.
- A machine learning approach changes.
- A product direction changes.
- An important technical trade-off is accepted.

Do **not** create entries for routine implementation details or small code changes.

---

# Decision Lifecycle

```text
Problem Identified
        │
        ▼
 Alternatives Evaluated
        │
        ▼
 Decision Approved
        │
        ▼
 Implementation
        │
        ▼
 Validation
        │
        ▼
 (Optional)
 Superseded by a New Decision
```

---

# Best Practices

- Record decisions as soon as they are made.
- Keep entries objective and factual.
- Explain *why*, not only *what*.
- Document trade-offs honestly.
- Link to relevant specifications and documentation.
- Never delete historical decisions; create a new entry if a decision changes.

This file should become the project's permanent decision history and provide future contributors with the context behind major engineering choices.

---

# Decision Entries

## Decision Information

**Decision ID:** DEC-2026-001

**Date:** 2026-07-26

**Category:** Frontend, Documentation

**Status:** Implemented

### Decision

Scope initial frontend test coverage to `features/maps/store` (zustand)
and its three React Query hooks (`use-geo`, `use-predict`,
`use-run-prediction`), rather than the `emission-map.tsx` component
itself or a broader test-everything pass.

### Context

`/next` identified frontend test coverage (0%) as the highest-priority
gap. `emission-map.tsx` (1045 lines) contains the GIS export, timeline,
and compare-predictions logic, but inline and coupled to CesiumJS's
global script-tag load — not independently testable without either a
Cesium stub or extracting pure functions first, both of which are
refactors beyond "add tests."

### Rationale

Following the project's stated principle to avoid unnecessary scope
expansion: cover the parts that are already pure/isolated (store, hooks)
now, and treat extracting testable logic out of `emission-map.tsx` as a
separate, explicitly-scoped follow-up (logged in KNOWN_ISSUES.md).

### Impact

23 passing tests added; CI now runs them. The map component's export/
timeline/compare-mode logic remains untested until a future extraction
pass.

---

## Decision Information

**Decision ID:** DEC-2026-002

**Date:** 2026-07-26

**Category:** DevOps, Frontend

**Status:** Implemented

### Decision

Do not fix the discovered `next lint` / ESLint 9 incompatibility
(KNOWN_ISSUES.md KI-001) as part of this session; log it and leave CI's
existing `lint` step untouched.

### Context

While adding `npm run test` to the `frontend` CI job, discovered that
`npm run lint` already fails outright on `main` (reproduced via
`git stash`), independent of any change made this session. Attempting a
direct `eslint .` invocation surfaced a deeper circular-structure error
in `eslint-config-next`'s flat-config compatibility shim.

### Rationale

Fixing an ESLint/Next version-compatibility issue is a distinct task
from adding test infrastructure, with its own risk (could require an
ESLint or `eslint-config-next` version bump, or restructuring the lint
config) and shouldn't be bundled into an unrelated change.

### Impact

CI's `frontend` job may not currently reach `typecheck`/`test`/`build`
in practice, since Actions steps stop the job on first failure. Flagged
as `Next Recommended Actions` #1 in PROJECT_PROGRESS.md.