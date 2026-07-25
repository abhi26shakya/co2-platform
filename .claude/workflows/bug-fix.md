---
name: bug-fix
description: Comprehensive workflow for triaging, reproducing, analyzing, fixing, validating, documenting, and closing software defects while minimizing regressions and maintaining production stability.
version: 1.0
owner: project-manager
---

# Bug Fix Workflow

## Purpose

Provide a standardized workflow for managing software defects from initial discovery through final verification and closure.

Every bug should be reproducible, understood, fixed, tested, documented, and verified before closure.

---

# When To Use

Use this workflow when:

- A software bug is reported
- A production incident occurs
- A regression is discovered
- A security vulnerability requires remediation
- A failed test reveals an implementation defect
- Monitoring detects abnormal behavior

Do not use for:

- New features
- Planned refactoring
- Performance optimization without defects
- Documentation-only updates

---

# Objectives

Ensure every bug is:

- Correctly identified
- Reproducible
- Root-caused
- Properly fixed
- Thoroughly tested
- Fully documented
- Safely deployed

---

# Workflow Overview

```
Bug Report
      │
      ▼
Bug Triage
      │
      ▼
Reproduction
      │
      ▼
Root Cause Analysis
      │
      ▼
Impact Assessment
      │
      ▼
Fix Planning
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
Deployment
      │
      ▼
Verification
      │
      ▼
Bug Closed
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
- Security Engineer
- Performance Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Bug Intake

Project Manager should record:

- bug title
- description
- reporter
- affected version
- environment
- reproduction information
- screenshots or logs
- business impact

Assign a tracking ID.

---

# Phase 2 — Triage

Classify:

Severity

- Critical
- High
- Medium
- Low

Priority

- Immediate
- Current Sprint
- Next Sprint
- Backlog

Determine ownership.

---

# Phase 3 — Reproduction

Responsible engineer should:

- reproduce the issue
- verify expected behavior
- document reproduction steps
- identify affected components

If the bug cannot be reproduced:

- document findings
- request additional information
- avoid speculative fixes

---

# Phase 4 — Root Cause Analysis

Software Architect and relevant engineers should determine:

- underlying cause
- triggering conditions
- affected modules
- dependency involvement
- historical context

Document evidence supporting the conclusion.

---

# Phase 5 — Impact Assessment

Evaluate:

- user impact
- production impact
- security implications
- performance implications
- affected services
- data integrity
- compatibility

Estimate business risk.

---

# Phase 6 — Fix Planning

Select the appropriate strategy:

- configuration change
- code fix
- migration
- rollback
- hotfix
- architectural correction

Identify dependencies before implementation.

---

# Phase 7 — Implementation

Relevant engineers implement the fix.

Backend Engineer

- business logic
- validation
- services

Frontend Engineer

- UI
- state
- interactions

Database Engineer

- schema
- queries
- migrations

API Engineer

- contracts
- validation
- responses

Follow existing coding standards.

---

# Phase 8 — Security & Performance Review

Security Engineer should verify:

- no new vulnerabilities
- permissions unchanged
- secure validation maintained

Performance Engineer should verify:

- no measurable regressions
- resource usage acceptable
- response time preserved

---

# Phase 9 — Testing

QA Engineer should execute:

- reproduction verification
- unit tests
- integration tests
- regression tests
- end-to-end tests

Verify the original defect is resolved.

---

# Phase 10 — Code Review

Code Reviewer should evaluate:

- correctness
- maintainability
- architectural consistency
- documentation
- testing quality

Require changes if standards are not met.

---

# Phase 11 — Deployment

DevOps Engineer should verify:

- deployment readiness
- migrations
- rollback strategy
- monitoring
- logging

Deploy according to release policies.

---

# Phase 12 — Post-Deployment Verification

Confirm:

- bug resolved
- monitoring healthy
- no regressions
- no new incidents
- user validation completed (if applicable)

Continue monitoring for recurrence.

---

# Phase 13 — Documentation

Documentation Engineer should update:

BUG_REPORT.md

ROOT_CAUSE_ANALYSIS.md

FIX_SUMMARY.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Record lessons learned.

---

# Bug Classification

Functional Bug

UI Bug

Performance Bug

Security Bug

Infrastructure Bug

Data Bug

Integration Bug

Regression

Configuration Issue

Compatibility Issue

---

# Deliverables

Generate or update:

BUG_REPORT.md

ROOT_CAUSE_ANALYSIS.md

FIX_SUMMARY.md

TEST_REPORT.md

REGRESSION_REPORT.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Bug resolution succeeds only if:

✓ bug reproduced

✓ root cause identified

✓ impact assessed

✓ fix implemented

✓ security validated

✓ performance validated

✓ regression testing passed

✓ deployment verified

✓ documentation synchronized

✓ issue closed

---

# Related Commands

Primary

- /bug
- /test
- /review

Supporting

- /security
- /deploy
- /release
- /audit

---

# Failure Handling

If the bug cannot be resolved:

- document current findings
- preserve reproduction evidence
- identify blockers
- recommend next investigation steps
- assign follow-up ownership

Never close an unresolved bug without documenting the rationale and associated risks.

---

# End Goal

Deliver a disciplined, repeatable defect management process that rapidly identifies, diagnoses, resolves, validates, and documents software defects while minimizing regressions, maintaining system stability, and continuously improving product quality through structured engineering collaboration.