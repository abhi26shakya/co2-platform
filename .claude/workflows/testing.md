---
name: testing
description: End-to-end workflow for planning, executing, validating, and approving software testing across unit, integration, end-to-end, performance, security, accessibility, regression, and release validation to ensure production readiness.
version: 1.0
owner: qa-engineer
---

# Testing Workflow

## Purpose

Ensure every software change is thoroughly validated before deployment.

Testing should verify correctness, stability, reliability, security, performance, compatibility, and overall product quality.

No feature should reach production without passing the required quality gates.

---

# When To Use

Use this workflow when:

- Completing a feature
- Fixing a bug
- Refactoring code
- Upgrading dependencies
- Migrating systems
- Preparing a deployment
- Preparing a release

Do not use for:

- Initial project analysis
- Sprint planning
- Documentation-only changes

---

# Objectives

Verify:

- Functional correctness
- System stability
- Regression safety
- Performance
- Security
- Accessibility
- Compatibility
- Production readiness

---

# Workflow Overview

```
Implementation Complete
          │
          ▼
Test Planning
          │
          ▼
Environment Preparation
          │
          ▼
Unit Testing
          │
          ▼
Integration Testing
          │
          ▼
End-to-End Testing
          │
          ▼
Performance Testing
          │
          ▼
Security Testing
          │
          ▼
Regression Testing
          │
          ▼
Release Validation
          │
          ▼
QA Approval
```

---

# Participating Agents

Leadership

- Project Manager

Engineering

- Backend Engineer
- Frontend Engineer
- Database Engineer
- API Engineer

Quality

- QA Engineer
- Security Engineer
- Performance Engineer

Operations

- DevOps Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Test Planning

QA Engineer should define:

- testing scope
- environments
- acceptance criteria
- test strategy
- automation requirements
- release criteria

Deliverable:

TEST_PLAN.md

---

# Phase 2 — Environment Preparation

DevOps Engineer should verify:

- build environment
- test environment
- staging environment
- databases
- environment variables
- mock services
- CI configuration

Testing should occur in reproducible environments.

---

# Phase 3 — Unit Testing

Relevant engineers should verify:

Backend

- business logic
- validation
- utilities
- services

Frontend

- components
- hooks
- state management
- utilities

Database

- queries
- repositories

API

- request validation
- response handling

Unit tests should isolate individual components.

---

# Phase 4 — Integration Testing

Validate interactions between:

- backend and database
- frontend and backend
- APIs and services
- authentication systems
- third-party integrations
- messaging systems

Confirm correct system integration.

---

# Phase 5 — End-to-End Testing

QA Engineer should validate:

- complete user journeys
- authentication flows
- feature workflows
- navigation
- error handling
- edge cases

Simulate real user behavior.

---

# Phase 6 — Performance Testing

Performance Engineer should evaluate:

- response time
- throughput
- concurrency
- memory usage
- CPU usage
- database performance
- frontend rendering

Compare against performance budgets.

---

# Phase 7 — Security Testing

Security Engineer should verify:

- authentication
- authorization
- input validation
- session management
- dependency vulnerabilities
- OWASP Top 10
- secrets protection

Critical vulnerabilities block release.

---

# Phase 8 — Accessibility Testing

Frontend Engineer and QA Engineer should validate:

- keyboard navigation
- screen reader compatibility
- color contrast
- semantic HTML
- focus management
- responsive behavior

Follow WCAG guidelines where applicable.

---

# Phase 9 — Regression Testing

QA Engineer should verify:

- previously completed features
- critical workflows
- integrations
- historical bugs
- reusable components

Ensure new changes do not break existing functionality.

---

# Phase 10 — Compatibility Testing

Validate:

- supported browsers
- operating systems
- mobile devices
- desktop devices
- API versions

Document unsupported environments.

---

# Phase 11 — Defect Management

For every issue record:

- description
- severity
- priority
- reproduction steps
- affected components
- owner
- expected resolution

Categorize:

Critical

High

Medium

Low

---

# Phase 12 — Release Validation

Project Manager and QA Engineer should confirm:

✓ acceptance criteria satisfied

✓ critical bugs resolved

✓ test coverage acceptable

✓ performance acceptable

✓ security approved

✓ documentation updated

System is ready for deployment.

---

# Phase 13 — Documentation

Documentation Engineer should update:

TEST_PLAN.md

TEST_REPORT.md

TEST_COVERAGE.md

BUG_REPORT.md

PROJECT_PROGRESS.md

CONTEXT.md

Synchronize testing documentation with implementation.

---

# Testing Checklist

Verify:

✓ unit tests passed

✓ integration tests passed

✓ end-to-end tests passed

✓ regression tests passed

✓ accessibility validated

✓ performance acceptable

✓ security approved

✓ compatibility verified

✓ documentation updated

✓ release readiness confirmed

---

# Deliverables

Generate or update:

TEST_PLAN.md

TEST_REPORT.md

TEST_COVERAGE.md

REGRESSION_REPORT.md

BUG_REPORT.md

QUALITY_REPORT.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Testing succeeds only if:

✓ all required tests pass

✓ no unresolved critical defects remain

✓ regression risk acceptable

✓ performance budgets satisfied

✓ security approved

✓ accessibility validated

✓ compatibility confirmed

✓ documentation synchronized

✓ QA approval granted

---

# Related Commands

Primary

- /test
- /review
- /deploy

Supporting

- /benchmark
- /security
- /bug
- /release

---

# Failure Handling

If testing cannot be completed:

- document failed tests
- classify defects
- assign owners
- recommend corrective actions
- repeat testing after fixes

Never approve deployment with unresolved critical defects.

---

# End Goal

Deliver thoroughly tested, reliable, secure, performant, and production-ready software through a structured quality assurance process that validates every significant change before deployment while maintaining comprehensive testing documentation and measurable quality standards.