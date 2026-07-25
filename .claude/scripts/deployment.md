---
name: deployment
description: Generate reliable deployment automation, infrastructure scripts, rollback procedures, and production release workflows.
version: 1.0
owner: devops-engineer

agents:
  - devops-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - security-engineer
  - performance-engineer
  - documentation-engineer

commands:
  - deploy
  - release
  - review

workflows:
  - deployment
  - release-process

standards:
  - security-standards
  - performance-guidelines
  - documentation-standards

outputs:
  - DEPLOYMENT_PLAN.md
  - RELEASE_REPORT.md
  - ROLLBACK_PLAN.md
  - PROJECT_PROGRESS.md
---

# Deployment Script Prompt

## Mission

Generate deployment automation that is:

- repeatable
- reliable
- secure
- observable
- reversible

Deployment scripts should minimize manual intervention and reduce operational risk.

---

# Phase 1 — Analyze Project

Inspect:

- repository structure
- backend
- frontend
- database
- infrastructure
- cloud provider
- environment configuration

Determine deployment requirements.

---

# Phase 2 — Environment Preparation

Verify:

Development

Staging

Production

Check:

- environment variables
- secrets
- certificates
- networking
- storage
- DNS
- SSL/TLS

Fail early if required configuration is missing.

---

# Phase 3 — Build Process

Generate automation for:

- dependency installation
- compilation
- asset generation
- Docker image creation
- artifact packaging

Ensure builds are reproducible.

---

# Phase 4 — Database Deployment

Prepare automation for:

- backups
- migrations
- rollback
- seed data (when appropriate)
- schema validation

Never perform destructive changes without a rollback strategy.

---

# Phase 5 — Application Deployment

Generate deployment steps for:

Backend

↓

API

↓

ML Service

↓

Frontend

↓

Background Workers

↓

Scheduled Jobs

↓

Monitoring

Ensure services are started in the correct order.

---

# Phase 6 — Validation

Verify:

- application starts
- APIs respond
- database connectivity
- authentication
- background jobs
- health endpoints
- monitoring

Run smoke tests after deployment.

---

# Phase 7 — Rollback Automation

Generate rollback procedures.

Rollback should restore:

- application version
- database (when applicable)
- configuration
- infrastructure state

Document rollback triggers.

---

# Phase 8 — Monitoring

Enable monitoring for:

- response time
- CPU
- memory
- disk
- logs
- API latency
- database health

Compare metrics against deployment baselines.

---

# Phase 9 — Documentation

Generate:

- DEPLOYMENT_PLAN.md
- RELEASE_REPORT.md
- ROLLBACK_PLAN.md

Update:

PROJECT_PROGRESS.md

---

# Deliverables

Produce:

- deploy.sh (or platform equivalent)
- rollback.sh
- health-check.sh
- DEPLOYMENT_PLAN.md
- RELEASE_REPORT.md
- ROLLBACK_PLAN.md

---

# Principles

Always:

- validate before deploying
- automate repetitive tasks
- verify deployment success
- monitor after deployment
- maintain rollback capability

Never:

- deploy without validation
- overwrite secrets
- skip backups
- ignore failed health checks
- continue after critical failures

---

# Definition of Done

Deployment automation is complete only when:

- build succeeds
- deployment succeeds
- health checks pass
- monitoring is active
- rollback works
- documentation is updated