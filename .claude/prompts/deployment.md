---
name: deployment
description: Plan, validate, execute, and monitor production deployments while ensuring reliability, security, rollback readiness, and minimal downtime.
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
  - qa-engineer
  - documentation-engineer

workflows:
  - deployment
  - release-process
  - testing
  - security-audit

commands:
  - deploy
  - release
  - test
  - review

standards:
  - security-standards
  - performance-guidelines
  - testing-standards
  - documentation-standards
  - architecture-principles

outputs:
  - DEPLOYMENT_PLAN.md
  - DEPLOYMENT_REPORT.md
  - ROLLBACK_PLAN.md
  - RELEASE_CHECKLIST.md
  - INFRASTRUCTURE_STATUS.md
  - POST_DEPLOYMENT_REPORT.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Deployment Prompt

## Mission

Deploy software safely, predictably, and with minimal operational risk.

Every deployment must be:

- repeatable
- automated where practical
- observable
- reversible
- secure
- well documented

Production deployments should never rely on manual guesswork.

---

# Phase 1 — Understand the Release

Review:

- Feature Specifications
- Architecture Review
- Testing Report
- Security Review
- Release Notes
- Changelog

Determine:

- deployment scope
- affected services
- infrastructure impact
- database impact
- rollback requirements

Generate:

DEPLOYMENT_PLAN.md

---

# Phase 2 — Environment Validation

Verify:

Development

Staging

Production

Ensure:

- environment variables
- secrets
- configuration
- certificates
- DNS
- storage
- networking

All environments should be consistent where appropriate.

---

# Phase 3 — Infrastructure Readiness

Review:

- servers
- containers
- Kubernetes (if applicable)
- databases
- object storage
- CDN
- cache
- message queues
- monitoring
- logging

Generate:

INFRASTRUCTURE_STATUS.md

---

# Phase 4 — CI/CD Validation

Verify pipeline stages:

- linting
- formatting
- unit tests
- integration tests
- security scans
- dependency scans
- build
- packaging
- deployment

Deployment should not proceed if mandatory pipeline checks fail.

---

# Phase 5 — Database Deployment

Review:

- migrations
- rollback scripts
- backups
- schema compatibility
- data migrations

Ensure migrations are:

- tested
- reversible
- documented

Protect production data during deployment.

---

# Phase 6 — Deployment Strategy

Select the appropriate deployment approach.

Examples:

- Rolling Deployment
- Blue-Green Deployment
- Canary Deployment
- Recreate Deployment
- Feature Flags
- Progressive Rollout

Document why the chosen strategy fits the release.

---

# Phase 7 — Security Validation

Verify:

- secrets management
- HTTPS/TLS
- firewall configuration
- IAM permissions
- API keys
- certificates
- environment isolation

No sensitive information should be exposed during deployment.

---

# Phase 8 — Execute Deployment

Deploy in a controlled sequence.

Recommended order:

1. Infrastructure
2. Database
3. Backend
4. APIs
5. Frontend
6. Background Workers
7. Scheduled Jobs
8. Monitoring

Track every deployment step.

---

# Phase 9 — Post-Deployment Verification

Verify:

- application startup
- API health
- database connectivity
- authentication
- authorization
- background jobs
- scheduled tasks
- integrations

Run smoke tests immediately after deployment.

Generate:

POST_DEPLOYMENT_REPORT.md

---

# Phase 10 — Monitoring

Monitor:

- response times
- error rates
- CPU
- memory
- network
- logs
- database performance
- cache health

Compare metrics with pre-deployment baselines.

---

# Phase 11 — Rollback Planning

Prepare rollback procedures before deployment.

Generate:

ROLLBACK_PLAN.md

Document:

- rollback trigger conditions
- rollback steps
- database rollback
- recovery verification
- communication plan

Rollback should be tested whenever practical.

---

# Phase 12 — Documentation

Update:

- Deployment Plan
- Release Notes
- Changelog
- Operations Guide

Generate:

DEPLOYMENT_REPORT.md

Summarize:

- deployment steps
- issues encountered
- resolutions
- validation results

---

# Deliverables

Produce or update:

- DEPLOYMENT_PLAN.md
- DEPLOYMENT_REPORT.md
- ROLLBACK_PLAN.md
- RELEASE_CHECKLIST.md
- INFRASTRUCTURE_STATUS.md
- POST_DEPLOYMENT_REPORT.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Deployment Principles

Always:

- Validate before deploying.
- Automate repeatable tasks.
- Back up critical data before changes.
- Monitor immediately after deployment.
- Keep rollback procedures ready.
- Record every deployment.

Never:

- Deploy without successful testing.
- Deploy directly to production without validation.
- Skip backups for database changes.
- Ignore monitoring alerts.
- Leave deployment steps undocumented.
- Continue a deployment when critical validation fails.

---

# Release Readiness Checklist

Before deployment verify:

- All tests pass.
- Security review completed.
- Performance review completed.
- Database migrations validated.
- Rollback plan exists.
- Monitoring is operational.
- Documentation updated.
- Release notes completed.

Generate:

RELEASE_CHECKLIST.md

---

# Deployment Recommendation

At the end of the deployment review, provide one recommendation:

✅ Ready for Production

⚠️ Ready with Monitoring

❌ Deployment Blocked

Support the recommendation with evidence from the deployment validation.

---

# Definition of Done

Deployment is complete only when:

- Infrastructure is validated.
- CI/CD pipeline succeeds.
- Database migrations complete successfully.
- Application is healthy after deployment.
- Monitoring confirms expected behavior.
- Rollback plan is documented and ready.
- Documentation is updated.
- Project progress and context have been refreshed.