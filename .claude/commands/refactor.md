---
name: refactor
description: Improve the internal structure of the codebase without changing external behavior by reducing technical debt, increasing maintainability, simplifying architecture, improving readability, and enforcing engineering best practices.
agents:
  - software-architect
  - project-manager
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - security-engineer
  - performance-engineer
  - qa-engineer
  - documentation-engineer
  - code-reviewer
---

# Refactor Command

## Purpose

Improve the quality of the codebase without changing observable behavior.

Refactoring should increase maintainability while preserving functionality.

---

# Objectives

Answer the following questions:

- Why should this code be refactored?
- Which parts of the codebase need improvement?
- Which design principles are violated?
- How can complexity be reduced?
- Can duplication be eliminated?
- Will maintainability improve?
- Will architecture become cleaner?

---

# General Rules

Always:

- Preserve behavior.
- Refactor incrementally.
- Prefer small changes.
- Maintain test coverage.
- Respect architecture.
- Improve readability.

Never:

- Introduce new functionality.
- Change public behavior.
- Remove tests.
- Break backward compatibility without explicit approval.

---

# Inputs

Review:

- Source code
- Architecture documentation
- Technical debt log
- Code review findings
- Test reports
- Performance reports
- Bug history

---

# Phase 1 – Refactoring Analysis

Software Architect should identify:

- code smells
- architectural violations
- excessive coupling
- poor cohesion
- duplicated logic
- large modules
- unnecessary abstractions

Document why refactoring is necessary.

---

# Phase 2 – Complexity Analysis

Measure:

- cyclomatic complexity
- nesting depth
- function size
- class size
- dependency count
- module coupling

Highlight the highest-risk areas.

---

# Phase 3 – Code Organization

Review:

- folder structure
- module boundaries
- separation of concerns
- naming consistency
- file organization

Recommend structural improvements.

---

# Phase 4 – Backend Refactoring

Backend Engineer should:

- simplify business logic
- extract reusable services
- remove duplicated code
- improve validation
- improve error handling
- improve logging

---

# Phase 5 – Frontend Refactoring

Frontend Engineer should:

- simplify components
- reduce prop drilling
- improve state management
- extract reusable UI
- remove duplicate logic
- improve accessibility structure

---

# Phase 6 – Database Review

Database Engineer should evaluate:

- query duplication
- schema organization
- migration quality
- indexing strategy
- unnecessary complexity

Refactor only when behavior remains unchanged.

---

# Phase 7 – API Refactoring

API Engineer should review:

- endpoint consistency
- shared middleware
- request validation
- response formatting
- reusable utilities

Preserve API compatibility.

---

# Phase 8 – Security Review

Security Engineer should verify:

- secure coding maintained
- authentication preserved
- authorization unchanged
- validation retained

Ensure refactoring does not weaken security.

---

# Phase 9 – Performance Review

Performance Engineer should verify:

- no performance regressions
- unnecessary allocations removed
- improved efficiency where possible

Performance improvements are welcome but not the primary objective.

---

# Phase 10 – Testing

QA Engineer should execute:

- unit tests
- integration tests
- regression tests

Behavior must remain identical.

---

# Phase 11 – Documentation

Documentation Engineer should update:

REFACTORING_LOG.md

TECHNICAL_DEBT.md

ARCHITECTURE.md

PROJECT_PROGRESS.md

CONTEXT.md

---

# Code Review

Code Reviewer should evaluate:

- readability
- maintainability
- architectural compliance
- consistency
- simplicity
- documentation

Approve only if behavior remains unchanged.

---

# Refactoring Principles

Prefer:

- composition over duplication
- small focused functions
- meaningful names
- dependency inversion
- single responsibility
- explicit interfaces

Avoid:

- premature abstraction
- unnecessary design patterns
- speculative generalization
- over-engineering

---

# Deliverables

Generate or update:

REFACTORING_PLAN.md

REFACTORING_LOG.md

TECHNICAL_DEBT.md

CODE_QUALITY_REPORT.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently.

---

# Final Report Format

Produce:

## Executive Summary

## Motivation

## Code Smells Identified

## Complexity Analysis

## Architectural Improvements

## Backend Refactoring

## Frontend Refactoring

## Database Review

## API Review

## Security Review

## Performance Review

## Testing Results

## Documentation Updates

## Remaining Technical Debt

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ behavior unchanged

✓ architecture improved

✓ duplication reduced

✓ complexity reduced

✓ naming improved

✓ tests passed

✓ security preserved

✓ documentation updated

✓ technical debt updated

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- External behavior is unchanged.
- Maintainability improves.
- Technical debt decreases.
- Complexity is reduced.
- Tests continue to pass.
- Documentation accurately reflects the refactoring.

---

# End Goal

Continuously improve the internal quality of the software by making it cleaner, simpler, easier to understand, and easier to evolve while preserving existing functionality and architectural integrity.