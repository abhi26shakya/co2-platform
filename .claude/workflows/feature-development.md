---
name: feature-development
description: End-to-end workflow for planning, designing, implementing, validating, documenting, reviewing, and delivering a production-ready feature through coordinated collaboration among all engineering agents.
version: 1.0
owner: project-manager
---

# Feature Development Workflow

## Purpose

Provide a standardized, repeatable, and production-grade workflow for implementing new features while ensuring architectural consistency, security, quality, performance, maintainability, and complete documentation.

This workflow coordinates every engineering discipline involved in feature development.

---

# When To Use

Use this workflow whenever:

- A new feature is requested.
- A major enhancement is planned.
- An MVP feature is implemented.
- A roadmap milestone begins.
- A customer request becomes approved.
- A research prototype becomes production code.

Do not use this workflow for:

- Small bug fixes
- Emergency hotfixes
- Dependency upgrades
- Documentation-only changes

Dedicated workflows exist for those cases.

---

# Primary Objectives

Every feature should satisfy the following objectives:

- Solve a real user problem.
- Align with the product roadmap.
- Fit the existing architecture.
- Maintain code quality.
- Preserve system security.
- Meet performance expectations.
- Include automated testing.
- Update all relevant documentation.
- Be deployment-ready.

---

# Workflow Overview

```
Feature Request
        │
        ▼
Product Validation
        │
        ▼
Planning
        │
        ▼
Architecture
        │
        ▼
Implementation
        │
        ▼
Testing
        │
        ▼
Security Review
        │
        ▼
Performance Review
        │
        ▼
Documentation
        │
        ▼
Code Review
        │
        ▼
Deployment Ready
```

---

# Participating Agents

Primary

- Startup Product Manager
- Project Manager
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

# Phase 1 — Feature Intake

Responsible

Startup Product Manager

Objectives

Understand:

- business problem
- target users
- expected outcome
- business value
- success metrics

Deliverables

- feature summary
- business goals
- acceptance goals

Decision Gate

Should this feature exist?

---

# Phase 2 — Product Validation

Validate:

- roadmap alignment
- customer impact
- business priority
- estimated ROI
- implementation complexity

Possible Outcomes

- Approved
- Deferred
- Rejected

---

# Phase 3 — Project Planning

Project Manager should define:

- scope
- milestones
- dependencies
- risks
- ownership
- timeline

Deliverables

FEATURE_SPEC.md

IMPLEMENTATION_PLAN.md

TASK_BREAKDOWN.md

---

# Phase 4 — Architecture Review

Software Architect should determine:

- required modules
- reusable components
- architecture changes
- dependency graph
- scalability impact
- technical constraints

Questions

Can existing systems support this feature?

Can existing services be reused?

Does architecture remain clean?

Deliverables

ARCHITECTURE_DECISION.md

---

# Phase 5 — Technical Design

Design:

Backend

Frontend

Database

API

Infrastructure

AI Systems

Data Pipelines

Every subsystem should have a documented implementation strategy before coding begins.

---

# Phase 6 — Backend Development

Backend Engineer

Responsible for

- business logic
- services
- validation
- authentication
- authorization
- logging
- error handling
- integrations

Deliverables

Production-ready backend implementation.

---

# Phase 7 — Frontend Development

Frontend Engineer

Responsible for

- UI
- UX
- responsive layouts
- accessibility
- state management
- API integration
- error handling
- loading states

Deliverables

Production-ready interface.

---

# Phase 8 — Database Development

Database Engineer

Responsible for

- schema
- migrations
- indexes
- constraints
- optimization
- integrity

Deliverables

Migration scripts

Schema updates

---

# Phase 9 — API Development

API Engineer

Responsible for

- REST
- GraphQL
- validation
- versioning
- documentation
- contracts

Deliverables

Updated API

OpenAPI documentation

---

# Phase 10 — Data & AI

If required

Data Engineer

- ingestion
- preprocessing
- ETL

ML Engineer

- model updates
- inference
- evaluation

Climate AI Engineer

- climate workflows

Satellite Imagery Engineer

- imagery processing

Skip if unnecessary.

---

# Phase 11 — Security Review

Security Engineer

Review

- authentication
- authorization
- secrets
- OWASP
- dependencies
- input validation

Critical issues must be resolved before continuing.

---

# Phase 12 — Performance Review

Performance Engineer

Review

- latency
- rendering
- queries
- memory
- caching
- bundle size

Optimize only verified bottlenecks.

---

# Phase 13 — Testing

QA Engineer

Execute

- unit tests
- integration tests
- end-to-end tests
- regression tests
- accessibility tests

Acceptance Criteria

All required tests pass.

---

# Phase 14 — Documentation

Documentation Engineer

Update

README.md

API.md

ARCHITECTURE.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Feature documentation should match implementation.

---

# Phase 15 — Code Review

Code Reviewer

Verify

- maintainability
- correctness
- architecture
- documentation
- testing
- security

Possible Outcomes

Approved

Changes Requested

Rejected

---

# Phase 16 — Deployment Readiness

DevOps Engineer

Validate

- CI/CD
- environment variables
- migrations
- infrastructure
- rollback strategy
- monitoring

Feature should be deployable without manual intervention.

---

# Success Criteria

A feature is complete only if:

✓ Business objective achieved

✓ Architecture approved

✓ Backend completed

✓ Frontend completed

✓ Database updated

✓ APIs documented

✓ Security approved

✓ Performance validated

✓ Tests passing

✓ Documentation synchronized

✓ Code review approved

✓ Deployment ready

---

# Outputs

Generate or update

FEATURE_SPEC.md

IMPLEMENTATION_PLAN.md

TASK_BREAKDOWN.md

TEST_REPORT.md

SECURITY_REPORT.md

PERFORMANCE_REPORT.md

API.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

---

# Related Commands

Primary

- /feature
- /review
- /test
- /deploy

Supporting

- /security
- /optimize
- /document
- /benchmark
- /release

---

# Failure Handling

If any critical stage fails:

Stop the workflow.

Record:

- failure reason
- affected subsystem
- recommended fix
- blocking dependencies

Resume only after blockers are resolved.

---

# End Goal

Deliver a production-ready feature that is architecturally sound, fully tested, secure, performant, well documented, and aligned with the product roadmap through coordinated collaboration among specialized engineering agents.