---
name: release-process
description: Comprehensive workflow for planning, approving, versioning, coordinating, deploying, validating, communicating, and documenting software releases across all environments while ensuring quality, traceability, stakeholder alignment, and production stability.
version: 1.0
owner: release-manager
---

# Release Process Workflow

## Purpose

Coordinate the complete lifecycle of a software release from planning through post-release review.

A release represents the delivery of business value—not merely deployed code. Every release should be predictable, traceable, reversible, measurable, and fully documented.

---

# When To Use

Use this workflow when:

- Releasing a new version
- Delivering a milestone
- Shipping an MVP
- Launching a major feature
- Performing scheduled production releases
- Coordinating multi-team deployments

Do not use for:

- Individual feature development
- Small bug fixes
- Internal experiments
- Documentation-only updates

---

# Objectives

Ensure every release is:

- Planned
- Approved
- Versioned
- Tested
- Deployable
- Recoverable
- Communicated
- Documented
- Measurable

---

# Workflow Overview

```
Release Planning
        │
        ▼
Scope Validation
        │
        ▼
Version Management
        │
        ▼
Release Readiness
        │
        ▼
Approval
        │
        ▼
Deployment
        │
        ▼
Production Validation
        │
        ▼
Stakeholder Communication
        │
        ▼
Post Release Review
        │
        ▼
Release Closed
```

---

# Participating Agents

Leadership

- Startup Product Manager
- Project Manager
- Release Manager

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
- Security Engineer
- Performance Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Release Planning

Release Manager should define:

- release objective
- release scope
- target version
- release window
- participating teams
- deployment strategy
- rollback owner
- communication plan

Confirm release goals before execution.

---

# Phase 2 — Scope Validation

Project Manager should verify:

- completed features
- approved bug fixes
- deferred work
- known limitations
- technical debt accepted
- release backlog

Only approved work enters the release.

---

# Phase 3 — Version Management

Assign:

- semantic version
- release tag
- milestone identifier
- release branch
- build identifier

Record all version metadata.

---

# Phase 4 — Release Readiness

Verify:

✓ all features complete

✓ testing passed

✓ code review approved

✓ security approved

✓ benchmarks acceptable

✓ deployment plan ready

✓ rollback prepared

✓ documentation updated

No release should proceed with unresolved critical blockers.

---

# Phase 5 — Approval

Obtain approval from:

Project Manager

Release Manager

QA Engineer

Security Engineer

DevOps Engineer

Possible outcomes:

Approved

Approved with Accepted Risks

Changes Required

Release Blocked

Every accepted risk should be documented.

---

# Phase 6 — Production Deployment

Execute the Deployment Workflow.

Deployment should follow:

deployment.md

Monitor deployment continuously.

---

# Phase 7 — Production Validation

QA Engineer should verify:

- application health
- business workflows
- integrations
- APIs
- databases
- authentication
- production monitoring

Confirm customer-facing functionality.

---

# Phase 8 — Stakeholder Communication

Documentation Engineer and Release Manager should publish:

Release Notes

Known Issues

Upgrade Instructions

Migration Notes

Operational Changes

Customer Impact

Notify relevant stakeholders.

---

# Phase 9 — Release Metrics

Collect:

Deployment Duration

Incident Count

Rollback Count

Production Errors

Performance Metrics

Availability

Adoption Metrics

Document measurable outcomes.

---

# Phase 10 — Post Release Review

Conduct a retrospective covering:

What went well

Issues encountered

Unexpected risks

Lessons learned

Future improvements

Create action items for continuous improvement.

---

# Phase 11 — Documentation

Documentation Engineer should update:

RELEASE_NOTES.md

CHANGELOG.md

VERSION_HISTORY.md

PROJECT_PROGRESS.md

CONTEXT.md

ROADMAP.md

Synchronize all release documentation.

---

# Release Checklist

Verify:

✓ version assigned

✓ scope approved

✓ tests passed

✓ security approved

✓ deployment completed

✓ production validated

✓ monitoring healthy

✓ release notes published

✓ documentation updated

✓ retrospective completed

---

# Deliverables

Generate or update:

RELEASE_PLAN.md

RELEASE_NOTES.md

CHANGELOG.md

VERSION_HISTORY.md

RELEASE_REPORT.md

POST_RELEASE_REVIEW.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Release succeeds only if:

✓ release objectives achieved

✓ production stable

✓ no unresolved critical issues

✓ stakeholders informed

✓ documentation synchronized

✓ monitoring healthy

✓ rollback capability preserved

✓ retrospective completed

---

# Related Commands

Primary

- /release

Supporting

- /deploy
- /review
- /test
- /security
- /document

---

# Failure Handling

If the release cannot be completed:

- halt the release
- document blocking issues
- execute rollback if required
- notify stakeholders
- schedule corrective actions
- reschedule the release after blockers are resolved

Never release software that fails critical quality, security, or operational readiness checks.

---

# End Goal

Deliver software releases through a disciplined, repeatable, and transparent release management process that aligns engineering execution with business objectives, ensures production stability, minimizes operational risk, enables rapid recovery, and provides complete traceability through standardized planning, approvals, deployment, validation, communication, and documentation.