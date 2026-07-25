---
name: deployment
description: Comprehensive workflow for preparing, validating, deploying, monitoring, verifying, and documenting software deployments across development, staging, and production environments while ensuring reliability, security, observability, and rollback readiness.
version: 1.0
owner: devops-engineer
---

# Deployment Workflow

## Purpose

Deploy software safely, consistently, and predictably across all environments.

Every deployment should be automated where practical, validated before release, continuously monitored after deployment, and immediately recoverable through a tested rollback strategy.

Deployment is an engineering process—not simply copying code to production.

---

# When To Use

Use this workflow when:

- Deploying a new feature
- Releasing a new version
- Deploying infrastructure changes
- Updating APIs
- Deploying AI models
- Performing database migrations
- Rolling out configuration updates
- Promoting staging to production

Do not use for:

- Sprint planning
- Feature implementation
- Documentation-only updates
- Architecture reviews

---

# Objectives

Ensure deployments are:

- Safe
- Repeatable
- Observable
- Recoverable
- Secure
- Automated
- Fully Documented

---

# Workflow Overview

```
Deployment Request
          │
          ▼
Deployment Planning
          │
          ▼
Build Verification
          │
          ▼
Environment Validation
          │
          ▼
Deployment Preparation
          │
          ▼
Deployment Execution
          │
          ▼
Health Verification
          │
          ▼
Monitoring
          │
          ▼
Rollback (if required)
          │
          ▼
Deployment Complete
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

# Phase 1 — Deployment Planning

Project Manager should define:

- deployment scope
- target environment
- release window
- expected downtime
- rollback owner
- deployment owner
- communication plan

Confirm deployment readiness before proceeding.

---

# Phase 2 — Build Verification

DevOps Engineer should verify:

- successful build
- dependency installation
- reproducible builds
- artifact generation
- artifact integrity
- version tagging

Only validated build artifacts should be deployed.

---

# Phase 3 — Environment Validation

Verify target environment:

Development

Testing

Staging

Production

Validate:

- environment variables
- secrets
- certificates
- infrastructure availability
- storage
- networking
- database connectivity
- external services

Configuration should match deployment requirements.

---

# Phase 4 — Database Preparation

Database Engineer should verify:

- migrations
- backups
- rollback scripts
- schema compatibility
- data integrity

Backups should be completed before destructive changes.

---

# Phase 5 — Security Validation

Security Engineer should confirm:

- secrets managed securely
- certificates valid
- access controls configured
- security scans passed
- compliance requirements satisfied

Critical security findings block deployment.

---

# Phase 6 — Deployment Execution

DevOps Engineer should execute deployment using the approved strategy.

Possible strategies include:

- Rolling Deployment
- Blue-Green Deployment
- Canary Deployment
- Recreate Deployment

Select the strategy that best balances availability, risk, and operational complexity.

---

# Phase 7 — Health Verification

Verify:

Application startup

API availability

Database connectivity

Authentication

Background jobs

Queues

Scheduled tasks

Infrastructure health

No critical service should remain unhealthy after deployment.

---

# Phase 8 — Monitoring

Monitor:

- error rates
- response times
- CPU usage
- memory usage
- disk utilization
- database performance
- API latency
- application logs
- infrastructure alerts

Compare metrics against pre-deployment baselines where available.

---

# Phase 9 — Rollback Decision

If deployment health degrades:

Evaluate:

- severity
- user impact
- recovery time
- mitigation options

Rollback immediately if:

- critical functionality fails
- severe regressions occur
- data integrity is at risk
- security risks emerge

Rollback should restore the previous stable state.

---

# Phase 10 — Post-Deployment Validation

QA Engineer should verify:

- acceptance criteria
- critical user journeys
- integrations
- production functionality
- regression status

Project Manager should confirm business acceptance.

---

# Phase 11 — Documentation

Documentation Engineer should update:

DEPLOYMENT_REPORT.md

DEPLOYMENT_HISTORY.md

CHANGELOG.md

RELEASE_NOTES.md

PROJECT_PROGRESS.md

CONTEXT.md

Record deployment outcomes, issues, and lessons learned.

---

# Deployment Checklist

Verify:

✓ build successful

✓ artifacts validated

✓ environment prepared

✓ database backed up

✓ migrations verified

✓ security approved

✓ deployment completed

✓ health checks passed

✓ monitoring active

✓ rollback available

✓ documentation updated

---

# Deliverables

Generate or update:

DEPLOYMENT_PLAN.md

DEPLOYMENT_REPORT.md

DEPLOYMENT_HISTORY.md

HEALTH_CHECK_RESULTS.md

ROLLBACK_REPORT.md

CHANGELOG.md

RELEASE_NOTES.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Deployment succeeds only if:

✓ deployment completed successfully

✓ application healthy

✓ services operational

✓ monitoring active

✓ performance acceptable

✓ security maintained

✓ rollback verified

✓ documentation synchronized

✓ business validation completed

---

# Related Commands

Primary

- /deploy

Supporting

- /release
- /test
- /review
- /security
- /benchmark

---

# Failure Handling

If deployment cannot be completed:

- stop further rollout
- preserve deployment logs
- execute rollback if required
- notify stakeholders
- document the incident
- investigate root cause before retrying

Never continue a deployment that threatens system stability or data integrity.

---

# End Goal

Deliver software safely and consistently through a disciplined deployment process that validates every release, minimizes operational risk, ensures rapid recovery from failures, maintains production stability, and provides complete traceability through monitoring, documentation, and standardized deployment practices.