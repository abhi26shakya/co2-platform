---
name: release
description: Coordinate the complete software release lifecycle including release planning, semantic versioning, production readiness, Go/No-Go decisions, deployment coordination, release documentation, post-release monitoring, rollback planning, and retrospective analysis.
agents:
  - release-manager
  - startup-product-manager
  - project-manager
  - software-architect
  - devops-engineer
  - qa-engineer
  - code-reviewer
  - security-engineer
  - performance-engineer
  - documentation-engineer
---

# Release Command

## Purpose

Coordinate the complete software release lifecycle.

This command determines whether a release is ready for production and ensures that all technical, operational, and business requirements have been satisfied.

A release represents a business milestone—not merely a deployment.

---

# Objectives

This command should answer:

- Is the software ready for production?
- Are all approvals complete?
- Has semantic versioning been updated?
- Are release notes complete?
- Is rollback prepared?
- Are stakeholders informed?
- Is production healthy after release?
- What lessons should be captured?

---

# General Rules

Always:

- Release only validated software.
- Follow semantic versioning.
- Communicate release status clearly.
- Verify production health.
- Document every release.
- Record lessons learned.

Never:

- Release unreviewed code.
- Skip approval gates.
- Ignore known critical issues.
- Publish incomplete release documentation.

---

# Inputs

Review:

- Deployment report
- Test report
- Code review
- Security review
- Performance report
- Architecture review
- Changelog
- Roadmap
- Project progress

---

# Phase 1 – Release Readiness

Release Manager should verify:

- all planned features completed
- testing passed
- documentation updated
- deployment validated
- monitoring enabled
- rollback available

No release should begin until readiness is confirmed.

---

# Phase 2 – Business Validation

Startup Product Manager should verify:

- release aligns with roadmap
- business objectives achieved
- customer value delivered
- release scope appropriate

Confirm business readiness.

---

# Phase 3 – Project Validation

Project Manager should verify:

- milestones completed
- outstanding work documented
- risks understood
- stakeholders informed

Ensure execution is complete.

---

# Phase 4 – Architecture Validation

Software Architect should verify:

- architecture remains consistent
- technical debt documented
- scalability acceptable
- design decisions recorded

Architecture should remain healthy after release.

---

# Phase 5 – Quality Validation

QA Engineer should verify:

- critical workflows tested
- regressions absent
- acceptance criteria satisfied
- production validation complete

Testing must support release confidence.

---

# Phase 6 – Security Approval

Security Engineer should verify:

- no unresolved critical vulnerabilities
- secrets protected
- authentication functioning
- authorization verified
- dependencies reviewed

Classify unresolved issues by severity.

---

# Phase 7 – Performance Approval

Performance Engineer should verify:

- latency acceptable
- resource utilization stable
- scalability acceptable
- benchmarks within expectations

Document measurable metrics.

---

# Phase 8 – Deployment Confirmation

DevOps Engineer should verify:

- deployment successful
- infrastructure healthy
- monitoring operational
- alerts configured
- backups verified

Confirm operational readiness.

---

# Phase 9 – Version Management

Release Manager should determine version number.

Use Semantic Versioning:

Major

X.0.0

Breaking changes

Minor

0.X.0

Backward-compatible features

Patch

0.0.X

Bug fixes

Record version history.

---

# Phase 10 – Release Notes

Documentation Engineer should prepare:

- new features
- improvements
- bug fixes
- breaking changes
- migration notes
- known limitations
- upgrade instructions

Release notes should be understandable by technical and non-technical audiences.

---

# Phase 11 – Stakeholder Communication

Prepare communication for:

- engineering
- product
- management
- customers
- partners

Include:

- version
- highlights
- known issues
- support information

---

# Phase 12 – Production Monitoring

Monitor:

- application health
- API latency
- error rates
- infrastructure
- user feedback
- business metrics

Observe the release for stability.

---

# Phase 13 – Incident Management

If issues occur:

- classify severity
- activate rollback if necessary
- notify stakeholders
- document root cause
- verify recovery

Capture all actions taken.

---

# Phase 14 – Release Retrospective

Review:

- successes
- failures
- deployment quality
- testing effectiveness
- communication
- customer feedback
- improvement opportunities

Document lessons learned.

---

# Release Decision

Choose one outcome:

Approved for Release

Approved with Known Issues

Postpone Release

Cancel Release

Explain the reasoning.

---

# Deliverables

Generate or update:

RELEASE_NOTES.md

RELEASE_HISTORY.md

VERSION_HISTORY.md

CHANGELOG.md

ROLLBACK_PLAN.md

RETROSPECTIVE.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently without removing useful information.

---

# Final Report Format

Produce:

## Executive Summary

## Release Scope

## Business Validation

## Project Status

## Architecture Validation

## Quality Validation

## Security Approval

## Performance Approval

## Deployment Confirmation

## Version Information

## Release Notes

## Stakeholder Communication

## Production Monitoring

## Risks

## Outstanding Issues

## Retrospective

## Release Decision

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ release scope complete

✓ business objectives satisfied

✓ project milestones completed

✓ architecture validated

✓ QA approved

✓ security approved

✓ performance approved

✓ deployment confirmed

✓ semantic version assigned

✓ release notes prepared

✓ rollback documented

✓ stakeholders informed

✓ retrospective completed

✓ documentation updated

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- The software is approved for production.
- Semantic versioning is updated.
- Release documentation is complete.
- Production health is verified.
- Rollback procedures are documented.
- Stakeholders receive appropriate communication.
- Lessons learned are captured.

---

# End Goal

Deliver reliable, traceable, and well-governed software releases that maximize customer value while minimizing operational risk through structured planning, validation, communication, monitoring, and continuous improvement.