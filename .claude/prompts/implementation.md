---
name: implementation
description: Implement approved features by following project architecture, engineering standards, testing requirements, security practices, and documentation workflows.
version: 1.0
owner: project-manager

agents:
  - project-manager
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - security-engineer
  - performance-engineer
  - qa-engineer
  - documentation-engineer
  - code-reviewer

workflows:
  - feature-development
  - code-review
  - testing
  - documentation

commands:
  - feature
  - review
  - test
  - document
  - optimize

standards:
  - architecture-principles
  - coding-standards
  - naming-conventions
  - security-standards
  - testing-standards
  - documentation-standards
  - performance-guidelines

outputs:
  - FEATURE_SPEC.md
  - IMPLEMENTATION_PLAN.md
  - TASK_BREAKDOWN.md
  - TEST_REPORT.md
  - CODE_REVIEW.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Implementation Prompt

## Mission

Implement the requested feature according to the approved architecture.

Prioritize:

- correctness
- maintainability
- readability
- security
- performance
- scalability

Do not sacrifice architecture quality for short-term speed.

---

# Phase 1 — Understand the Task

Before writing code:

Review:

- Feature Request
- Design Document
- Architecture Review
- Sprint Plan
- Project Architecture

Identify:

- feature goals
- affected modules
- dependencies
- acceptance criteria
- constraints

Do not begin implementation until the scope is fully understood.

---

# Phase 2 — Create an Implementation Plan

Break the work into small tasks.

For every task define:

- objective
- owner
- dependencies
- expected output

Generate:

IMPLEMENTATION_PLAN.md

Generate:

TASK_BREAKDOWN.md

---

# Phase 3 — Architecture Validation

Verify the implementation follows:

- project architecture
- module boundaries
- separation of concerns
- dependency rules
- naming conventions

If architecture conflicts exist:

Stop.

Recommend architectural improvements before implementation.

---

# Phase 4 — Backend Implementation

When backend work is required:

Implement:

- business logic
- services
- controllers
- middleware
- validation
- configuration
- logging
- error handling

Ensure:

- reusable code
- small functions
- clear interfaces

---

# Phase 5 — Frontend Implementation

When frontend work is required:

Implement:

- reusable components
- routing
- responsive layouts
- accessibility
- forms
- API integration
- loading states
- error states

Avoid duplicated UI logic.

---

# Phase 6 — Database Changes

If required:

Implement:

- migrations
- schema updates
- indexes
- constraints
- seed data

Verify rollback strategy.

Never perform destructive schema changes without migration planning.

---

# Phase 7 — API Development

When APIs change:

Implement:

- endpoints
- validation
- authentication
- authorization
- pagination
- filtering
- versioning
- error responses

Maintain backward compatibility whenever possible.

---

# Phase 8 — Security

Review every change for:

- input validation
- authorization
- secrets
- encryption
- dependency safety
- injection attacks
- XSS
- CSRF

Never introduce known security risks.

---

# Phase 9 — Performance

Optimize:

- queries
- rendering
- bundle size
- caching
- memory usage
- unnecessary re-renders
- network requests

Measure improvements when practical.

---

# Phase 10 — Testing

Create or update:

- unit tests
- integration tests
- end-to-end tests
- regression tests

Verify:

- existing functionality still works
- new feature satisfies requirements

Generate:

TEST_REPORT.md

---

# Phase 11 — Documentation

Update:

- API documentation
- architecture documentation
- README
- changelog
- release notes (if required)

Document all public changes.

---

# Phase 12 — Code Review

Self-review implementation.

Check:

- readability
- duplication
- maintainability
- security
- performance
- testing
- documentation

Generate:

CODE_REVIEW.md

---

# Phase 13 — Progress Tracking

Update:

PROJECT_PROGRESS.md

Include:

- completed work
- pending work
- blockers
- risks
- next steps

Update:

CONTEXT.md

Summarize enough context for another Claude session to continue without re-analysis.

---

# Deliverables

Produce or update:

- FEATURE_SPEC.md
- IMPLEMENTATION_PLAN.md
- TASK_BREAKDOWN.md
- TEST_REPORT.md
- CODE_REVIEW.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Implementation Rules

Always:

- Understand before coding.
- Reuse existing patterns.
- Prefer simple solutions.
- Follow project standards.
- Keep modules cohesive.
- Keep functions focused.
- Write readable code.
- Add meaningful comments only when necessary.
- Keep documentation synchronized with implementation.

Never:

- Skip testing.
- Skip validation.
- Ignore architecture.
- Duplicate logic.
- Break backward compatibility without justification.
- Introduce unnecessary dependencies.
- Leave TODOs without explanation.

---

# Definition of Done

Implementation is complete only when:

- All acceptance criteria are satisfied.
- Architecture remains consistent.
- Coding standards are followed.
- Security review passes.
- Performance remains acceptable.
- Tests pass.
- Documentation is updated.
- Code review is completed.
- Project progress is updated.
- CONTEXT.md is refreshed for future sessions.