---
name: deploy
description: Deploy the application safely to the target environment by coordinating infrastructure, CI/CD, database migrations, environment validation, monitoring, rollback planning, and post-deployment verification while minimizing operational risk.
agents:
  - devops-engineer
  - release-manager
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - security-engineer
  - performance-engineer
  - qa-engineer
  - documentation-engineer
  - project-manager
---

# Deploy Command

## Purpose

Deploy the application safely to the requested environment.

This command coordinates deployment activities without introducing unnecessary risk.

Deployment should be repeatable, observable, and reversible.

---

# Objectives

Answer the following questions:

- Is the deployment environment ready?
- Are dependencies satisfied?
- Are migrations safe?
- Are rollback procedures available?
- Is monitoring enabled?
- Was deployment successful?
- Is the application healthy?

---

# General Rules

Always:

- Validate before deploying.
- Prefer automated deployment.
- Preserve existing data.
- Verify rollback procedures.
- Monitor after deployment.
- Document deployment results.

Never:

- Deploy untested code.
- Deploy without rollback capability.
- Ignore failed health checks.
- Skip production validation.

---

# Inputs

Review:

- Release candidate
- Deployment configuration
- Infrastructure configuration
- Environment variables
- CI/CD pipeline
- Migration scripts
- Test results
- Security review
- Performance review

---

# Deployment Target

Determine deployment target:

- Development
- Testing
- Staging
- Production

Adjust validation based on environment.

---

# Phase 1 – Deployment Readiness

Project Manager should verify:

- implementation complete
- review complete
- testing complete
- approvals obtained

Deployment should begin only after readiness is confirmed.

---

# Phase 2 – Infrastructure Validation

DevOps Engineer should verify:

- servers
- containers
- Kubernetes cluster
- cloud services
- networking
- storage
- DNS
- SSL certificates

Ensure infrastructure is operational.

---

# Phase 3 – Environment Validation

Verify:

- environment variables
- secrets
- configuration files
- API keys
- service endpoints

Never expose secrets in logs.

---

# Phase 4 – Database Deployment

Database Engineer should:

- validate migrations
- verify backups
- confirm rollback strategy
- check data integrity

Run migrations in a controlled manner.

---

# Phase 5 – Backend Deployment

Backend Engineer should verify:

- services start correctly
- APIs respond
- authentication functions
- background jobs operate

Validate service health.

---

# Phase 6 – Frontend Deployment

Frontend Engineer should verify:

- assets deployed
- routing works
- static files served
- caching configured
- responsive behavior maintained

Confirm UI availability.

---

# Phase 7 – Security Validation

Security Engineer should verify:

- HTTPS enabled
- secrets protected
- authentication operational
- authorization functioning
- security headers present

Identify deployment-related risks.

---

# Phase 8 – Performance Validation

Performance Engineer should verify:

- startup time
- API latency
- page load performance
- memory usage
- CPU usage
- cache effectiveness

Compare against previous benchmarks.

---

# Phase 9 – Health Checks

Execute:

- application health endpoint
- database connectivity
- API availability
- storage access
- third-party integrations
- background workers

All critical services should be operational.

---

# Phase 10 – Monitoring

Verify:

- logs
- metrics
- alerts
- dashboards
- tracing

Ensure observability is active.

---

# Phase 11 – Smoke Testing

QA Engineer should validate:

- login
- authentication
- dashboard
- critical workflows
- APIs
- user interface

Focus on high-priority user journeys.

---

# Phase 12 – Rollback Validation

Confirm:

- rollback procedure
- previous deployment available
- database rollback strategy
- recovery documentation

Rollback must be executable if required.

---

# Phase 13 – Documentation

Documentation Engineer should update:

- DEPLOYMENT_LOG.md
- DEPLOYMENT_GUIDE.md
- CHANGELOG.md
- PROJECT_PROGRESS.md
- CONTEXT.md

Record deployment details.

---

# Deployment Status

Classify deployment as:

Successful

Successful with Warnings

Failed

Rolled Back

Provide supporting evidence.

---

# Deliverables

Generate or update:

DEPLOYMENT_REPORT.md

DEPLOYMENT_LOG.md

DEPLOYMENT_GUIDE.md

HEALTH_CHECK_RESULTS.md

MONITORING_STATUS.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Final Report Format

Produce:

## Executive Summary

## Deployment Target

## Infrastructure Validation

## Environment Validation

## Database Deployment

## Backend Validation

## Frontend Validation

## Security Validation

## Performance Validation

## Health Checks

## Monitoring Status

## Smoke Testing

## Rollback Readiness

## Deployment Status

## Outstanding Issues

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ deployment target identified

✓ infrastructure validated

✓ environment configured

✓ migrations completed

✓ backend operational

✓ frontend operational

✓ security verified

✓ performance validated

✓ health checks passed

✓ monitoring active

✓ smoke testing completed

✓ rollback prepared

✓ documentation updated

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- Deployment completes successfully.
- Critical services are healthy.
- Monitoring is active.
- Rollback procedures are available.
- Documentation is updated.
- The application is operational in the target environment.

---

# End Goal

Execute reliable, repeatable, low-risk deployments that move validated software into the target environment while ensuring operational stability, observability, and rapid recovery if issues occur.