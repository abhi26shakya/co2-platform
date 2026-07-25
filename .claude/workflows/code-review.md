---
name: code-review
description: Comprehensive workflow for reviewing source code to ensure correctness, maintainability, architectural consistency, security, performance, testing, documentation, and production readiness before merge or release.
version: 1.0
owner: code-reviewer
---

# Code Review Workflow

## Purpose

Perform a comprehensive engineering review of all code changes before they are merged into the main codebase.

The review should verify correctness, maintainability, architecture, security, performance, testing, documentation, and deployment readiness.

Every significant change should be reviewed before approval.

---

# When To Use

Use this workflow when:

- Completing a new feature
- Fixing a bug
- Refactoring code
- Upgrading dependencies
- Migrating systems
- Preparing a release
- Reviewing pull requests

Do not use for:

- Initial project analysis
- Sprint planning
- Documentation-only reviews

---

# Objectives

Ensure that every code change is:

- Correct
- Maintainable
- Secure
- Performant
- Well-tested
- Properly documented
- Consistent with project standards

---

# Workflow Overview

```
Code Changes
      │
      ▼
Requirement Review
      │
      ▼
Architecture Review
      │
      ▼
Implementation Review
      │
      ▼
Security Review
      │
      ▼
Performance Review
      │
      ▼
Testing Review
      │
      ▼
Documentation Review
      │
      ▼
Approval Decision
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

Quality

- QA Engineer
- Security Engineer
- Performance Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Requirements Validation

Project Manager should verify:

- feature requirements satisfied
- acceptance criteria met
- roadmap alignment
- scope boundaries respected

Reject changes that solve the wrong problem.

---

# Phase 2 — Architecture Review

Software Architect should evaluate:

- architectural consistency
- module boundaries
- dependency management
- design patterns
- scalability
- technical debt introduced

No architectural regressions should be introduced.

---

# Phase 3 — Implementation Review

Relevant engineers should review:

Backend

- business logic
- validation
- authentication
- authorization
- error handling
- logging

Frontend

- UI consistency
- accessibility
- responsiveness
- state management

Database

- schema quality
- migrations
- indexes
- constraints

API

- endpoint design
- versioning
- validation
- backward compatibility

Ensure implementation follows established standards.

---

# Phase 4 — Code Quality Review

Code Reviewer should inspect:

- readability
- naming
- modularity
- duplication
- complexity
- maintainability
- consistency

Recommend simplifications where appropriate.

---

# Phase 5 — Security Review

Security Engineer should evaluate:

- authentication
- authorization
- input validation
- secrets management
- dependency vulnerabilities
- OWASP compliance

Critical vulnerabilities block approval.

---

# Phase 6 — Performance Review

Performance Engineer should inspect:

- unnecessary queries
- algorithmic complexity
- memory usage
- caching opportunities
- rendering performance
- network efficiency

Document measurable concerns.

---

# Phase 7 — Testing Review

QA Engineer should verify:

- unit tests
- integration tests
- end-to-end tests
- regression tests
- edge cases

Review test coverage and quality.

---

# Phase 8 — Documentation Review

Documentation Engineer should update or verify:

README.md

API.md

ARCHITECTURE.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Documentation should accurately reflect implementation.

---

# Phase 9 — Deployment Readiness

DevOps Engineer should verify:

- build succeeds
- CI/CD passes
- environment configuration
- migrations
- rollback strategy
- monitoring updates

Changes should be deployable.

---

# Phase 10 — Final Decision

Code Reviewer should determine one of:

Approved

Approved with Minor Changes

Changes Requested

Rejected

Every rejection should include clear, actionable feedback.

---

# Review Checklist

Verify:

✓ requirements satisfied

✓ architecture preserved

✓ code readable

✓ duplication minimized

✓ security reviewed

✓ performance acceptable

✓ tests passing

✓ documentation updated

✓ deployment ready

✓ no critical blockers remain

---

# Deliverables

Generate or update:

CODE_REVIEW.md

REVIEW_SUMMARY.md

SECURITY_REVIEW.md

PERFORMANCE_REVIEW.md

TEST_COVERAGE.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Code review succeeds only if:

✓ implementation is correct

✓ architecture remains clean

✓ security approved

✓ performance validated

✓ tests pass

✓ documentation synchronized

✓ deployment readiness confirmed

✓ approval recorded

---

# Related Commands

Primary

- /review
- /test
- /deploy

Supporting

- /security
- /optimize
- /document
- /release

---

# Failure Handling

If approval cannot be granted:

- document blocking issues
- classify severity
- assign owners
- recommend corrective actions
- require re-review after fixes

Never approve code with unresolved critical issues.

---

# End Goal

Ensure that every code change entering the codebase meets the project's standards for quality, architecture, security, performance, testing, documentation, and maintainability, resulting in reliable, production-ready software.