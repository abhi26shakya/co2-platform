---
name: refactoring
description: Comprehensive workflow for identifying, planning, implementing, validating, and documenting code refactoring to improve maintainability, readability, scalability, and architectural quality without changing externally observable behavior.
version: 1.0
owner: software-architect
---

# Refactoring Workflow

## Purpose

Improve the internal quality of the codebase while preserving existing functionality.

Refactoring should reduce technical debt, improve maintainability, simplify architecture, and prepare the system for future development without introducing regressions.

---

# When To Use

Use this workflow when:

- Technical debt becomes significant
- Code duplication increases
- Architecture becomes difficult to maintain
- Large features require structural improvements
- Performance improvements require redesign
- Preparing for long-term scalability
- Code reviews identify maintainability concerns

Do not use for:

- New feature implementation
- Bug fixing
- Emergency hotfixes
- Documentation-only changes

---

# Objectives

Improve:

- Maintainability
- Readability
- Modularity
- Testability
- Scalability
- Reusability
- Architectural Consistency

External behavior should remain unchanged.

---

# Workflow Overview

```
Technical Debt
        │
        ▼
Code Analysis
        │
        ▼
Refactoring Planning
        │
        ▼
Architecture Review
        │
        ▼
Implementation
        │
        ▼
Testing
        │
        ▼
Code Review
        │
        ▼
Documentation
        │
        ▼
Refactoring Complete
```

---

# Participating Agents

Leadership

- Project Manager

Architecture

- Software Architect

Engineering

- Backend Engineer
- Frontend Engineer
- Database Engineer
- API Engineer
- Data Engineer
- ML Engineer
- Climate AI Engineer
- Satellite Imagery Engineer

Infrastructure

- DevOps Engineer

Quality

- QA Engineer
- Performance Engineer
- Security Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Refactoring Assessment

Software Architect should identify:

- technical debt
- duplicated logic
- oversized modules
- poor abstractions
- architectural violations
- maintainability concerns

Prioritize opportunities based on long-term value.

---

# Phase 2 — Code Analysis

Review:

- dependencies
- coupling
- cohesion
- complexity
- code smells
- ownership
- module boundaries

Measure current code quality before making changes.

---

# Phase 3 — Refactoring Strategy

Determine:

- scope
- expected improvements
- implementation sequence
- migration approach
- rollback strategy

Document why each refactoring is necessary.

---

# Phase 4 — Architecture Validation

Software Architect should verify:

- architectural consistency
- reusable abstractions
- dependency direction
- layering
- scalability impact

Avoid introducing unnecessary complexity.

---

# Phase 5 — Implementation

Relevant engineers perform the refactoring.

Backend Engineer

- services
- business logic
- domain models

Frontend Engineer

- components
- hooks
- state management

Database Engineer

- repositories
- query organization

API Engineer

- controllers
- routing
- contracts

Maintain existing external behavior.

---

# Phase 6 — Quality Validation

Code Reviewer should evaluate:

- readability
- simplicity
- consistency
- modularity
- duplication removal

Ensure coding standards are maintained.

---

# Phase 7 — Performance & Security Validation

Performance Engineer should verify:

- no measurable regressions
- resource usage maintained
- performance budgets respected

Security Engineer should verify:

- no security regressions
- permissions unchanged
- validation preserved

---

# Phase 8 — Testing

QA Engineer should execute:

- unit tests
- integration tests
- regression tests
- end-to-end tests

Confirm behavior remains unchanged.

---

# Phase 9 — Documentation

Documentation Engineer should update:

REFACTORING_PLAN.md

CODE_QUALITY_REPORT.md

ARCHITECTURE.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Document all structural improvements.

---

# Refactoring Opportunities

Examples include:

- Duplicate code elimination
- Function extraction
- Class decomposition
- Module reorganization
- Dependency inversion
- Interface simplification
- Dead code removal
- Naming improvements
- Architectural cleanup
- Design pattern improvements

---

# Deliverables

Generate or update:

REFACTORING_PLAN.md

CODE_QUALITY_REPORT.md

ARCHITECTURE_DECISIONS.md

TECHNICAL_DEBT.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Refactoring succeeds only if:

✓ technical debt reduced

✓ duplication minimized

✓ architecture improved

✓ maintainability increased

✓ functionality unchanged

✓ tests passed

✓ performance maintained

✓ security maintained

✓ documentation synchronized

---

# Related Commands

Primary

- /refactor
- /review

Supporting

- /test
- /architecture
- /optimize
- /audit

---

# Failure Handling

If refactoring cannot be completed:

- document unfinished work
- identify blocking dependencies
- preserve system stability
- recommend incremental follow-up tasks
- postpone high-risk structural changes

Never merge refactoring that changes intended functionality unless explicitly approved.

---

# End Goal

Create a cleaner, simpler, and more maintainable codebase by systematically reducing technical debt, improving architecture, increasing code quality, and preserving existing behavior through disciplined engineering practices, comprehensive validation, and complete documentation.