---
name: dependency-upgrade
description: Comprehensive workflow for evaluating, planning, upgrading, validating, and documenting dependencies including libraries, frameworks, SDKs, runtimes, infrastructure components, databases, operating systems, and AI models while minimizing compatibility risks and maintaining production stability.
version: 1.0
owner: devops-engineer
---

# Dependency Upgrade Workflow

## Purpose

Maintain a secure, stable, and modern software stack by safely upgrading project dependencies through a structured engineering process.

Every dependency upgrade should improve the project without introducing regressions, compatibility issues, or production instability.

---

# When To Use

Use this workflow when:

- Updating project libraries
- Upgrading frameworks
- Updating SDKs
- Updating programming language versions
- Updating package managers
- Upgrading databases
- Updating infrastructure
- Updating AI/ML frameworks
- Applying security patches
- Removing deprecated packages

Do not use for:

- Feature development
- Bug fixes
- Architecture redesign
- Documentation-only changes

---

# Objectives

Ensure upgrades are:

- Secure
- Compatible
- Tested
- Reversible
- Well Documented
- Production Ready

---

# Workflow Overview

```
Dependency Inventory
          │
          ▼
Version Analysis
          │
          ▼
Compatibility Review
          │
          ▼
Security Assessment
          │
          ▼
Upgrade Planning
          │
          ▼
Implementation
          │
          ▼
Validation
          │
          ▼
Regression Testing
          │
          ▼
Rollback Verification
          │
          ▼
Documentation
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

# Phase 1 — Dependency Inventory

DevOps Engineer should identify:

- application libraries
- frameworks
- SDKs
- runtimes
- operating system packages
- container images
- infrastructure dependencies
- AI models
- external services

Create a complete dependency inventory.

---

# Phase 2 — Version Analysis

Review:

- current version
- latest stable version
- release notes
- support status
- end-of-life dates
- deprecated APIs

Determine whether an upgrade is necessary.

---

# Phase 3 — Compatibility Analysis

Software Architect and relevant engineers should evaluate:

- API changes
- breaking changes
- configuration changes
- database compatibility
- deployment impact
- infrastructure compatibility

Identify migration requirements before implementation.

---

# Phase 4 — Security Assessment

Security Engineer should review:

- known vulnerabilities
- CVEs
- supply chain risks
- package integrity
- package signing
- license compatibility

Critical vulnerabilities should be prioritized immediately.

---

# Phase 5 — Upgrade Planning

Define:

- upgrade order
- implementation strategy
- migration steps
- testing plan
- rollback plan
- deployment strategy

Prefer incremental upgrades whenever practical.

---

# Phase 6 — Implementation

Relevant engineers upgrade affected systems.

Backend Engineer

- backend libraries
- frameworks

Frontend Engineer

- UI frameworks
- frontend tooling

Database Engineer

- database engines
- drivers

API Engineer

- API SDKs
- client libraries

ML Engineer

- ML frameworks
- inference libraries

DevOps Engineer

- containers
- infrastructure
- CI/CD
- runtimes

Upgrade one logical component at a time.

---

# Phase 7 — Validation

Verify:

- successful builds
- dependency resolution
- application startup
- configuration loading
- runtime stability

Resolve conflicts before continuing.

---

# Phase 8 — Regression Testing

QA Engineer should execute:

- unit tests
- integration tests
- end-to-end tests
- regression tests
- smoke tests

Performance Engineer should verify:

- no measurable regressions

Security Engineer should verify:

- no new vulnerabilities introduced

---

# Phase 9 — Rollback Verification

DevOps Engineer should ensure:

- rollback scripts exist
- backups completed
- previous versions recoverable
- rollback tested where practical

Rollback procedures should be documented before production deployment.

---

# Phase 10 — Documentation

Documentation Engineer should update:

DEPENDENCY_AUDIT.md

UPGRADE_REPORT.md

MIGRATION_GUIDE.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Document every significant dependency change.

---

# Upgrade Checklist

Verify:

✓ inventory complete

✓ compatibility reviewed

✓ release notes evaluated

✓ security approved

✓ upgrades implemented

✓ builds successful

✓ tests passed

✓ rollback prepared

✓ documentation updated

---

# Deliverables

Generate or update:

DEPENDENCY_AUDIT.md

UPGRADE_PLAN.md

UPGRADE_REPORT.md

COMPATIBILITY_REPORT.md

ROLLBACK_PLAN.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Dependency upgrades succeed only if:

✓ dependencies updated

✓ compatibility maintained

✓ security improved

✓ tests passed

✓ performance maintained

✓ rollback available

✓ documentation synchronized

✓ production readiness confirmed

---

# Related Commands

Primary

- /migrate
- /audit

Supporting

- /review
- /test
- /security
- /deploy
- /release

---

# Failure Handling

If an upgrade cannot be completed:

- document blocking issues
- identify incompatible dependencies
- revert to the last stable version
- recommend future upgrade paths
- postpone high-risk upgrades until prerequisites are met

Never deploy dependency upgrades without a validated rollback strategy.

---

# End Goal

Maintain a modern, secure, and reliable technology stack through disciplined dependency management that minimizes operational risk, preserves compatibility, strengthens security, and ensures every upgrade is validated, reversible, and fully documented.