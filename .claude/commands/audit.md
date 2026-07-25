---
name: audit
description: Perform a comprehensive engineering audit of the repository to evaluate architecture, code quality, maintainability, security, performance, testing, documentation, infrastructure, AI systems, technical debt, and overall project health while producing prioritized recommendations for improvement.
agents:
  - project-manager
  - software-architect
  - code-reviewer
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - security-engineer
  - performance-engineer
  - devops-engineer
  - data-engineer
  - ml-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - qa-engineer
  - documentation-engineer
---

# Audit Command

## Purpose

Perform a complete engineering audit of the repository.

Assess the current health of the project.

Identify strengths, weaknesses, risks, and opportunities for improvement.

This command evaluates the project.

It does not implement changes.

---

# Objectives

Answer the following questions:

- What is the overall health of the project?
- Which systems require attention?
- What technical debt exists?
- What risks exist?
- What should be prioritized next?
- Is the project production-ready?
- How maintainable is the codebase?

---

# General Rules

Always:

- Base conclusions on repository evidence.
- Review every major subsystem.
- Prioritize objective findings.
- Explain recommendations.
- Preserve historical context.

Never:

- Make assumptions without evidence.
- Recommend unnecessary work.
- Ignore architectural constraints.
- Overlook documentation.

---

# Inputs

Review:

- source code
- repository structure
- architecture
- APIs
- database
- deployment
- documentation
- tests
- roadmap
- changelog
- project progress
- benchmark reports
- security reports

---

# Phase 1 – Executive Summary

Project Manager should summarize:

- current maturity
- completed milestones
- active work
- blocked work
- major risks
- project trajectory

Provide a concise health overview.

---

# Phase 2 – Architecture Audit

Software Architect should evaluate:

- modularity
- scalability
- dependency structure
- separation of concerns
- architectural consistency
- design patterns
- technical debt

Assign an architecture health score.

---

# Phase 3 – Code Quality Audit

Code Reviewer should inspect:

- readability
- duplication
- maintainability
- naming
- complexity
- consistency
- code smells

Document improvement opportunities.

---

# Phase 4 – Backend Audit

Backend Engineer should evaluate:

- services
- validation
- authentication
- authorization
- business logic
- logging
- error handling

Assess backend maintainability.

---

# Phase 5 – Frontend Audit

Frontend Engineer should evaluate:

- component organization
- responsiveness
- accessibility
- routing
- state management
- UI consistency

Identify usability concerns.

---

# Phase 6 – Database Audit

Database Engineer should evaluate:

- schema quality
- indexing
- normalization
- migrations
- integrity
- scalability

Document database risks.

---

# Phase 7 – API Audit

API Engineer should inspect:

- endpoint consistency
- documentation
- authentication
- versioning
- validation
- error handling

Review API maturity.

---

# Phase 8 – Security Audit

Security Engineer should evaluate:

- authentication
- authorization
- secrets management
- dependency security
- infrastructure security
- OWASP risks

Assign risk levels:

Critical

High

Medium

Low

---

# Phase 9 – Performance Audit

Performance Engineer should inspect:

- latency
- throughput
- memory
- CPU
- caching
- rendering
- database performance

Highlight bottlenecks.

---

# Phase 10 – DevOps Audit

DevOps Engineer should evaluate:

- CI/CD
- deployment
- monitoring
- observability
- backups
- rollback strategy
- infrastructure

Assess operational maturity.

---

# Phase 11 – AI & Data Audit

If applicable:

Data Engineer should evaluate:

- pipelines
- preprocessing
- ETL quality

ML Engineer should review:

- models
- evaluation
- deployment
- reproducibility

Climate AI Engineer should assess:

- scientific validity
- emissions workflows

Satellite Imagery Engineer should assess:

- GIS workflows
- raster processing
- imagery pipeline

Skip if not applicable.

---

# Phase 12 – Testing Audit

QA Engineer should evaluate:

- unit testing
- integration testing
- end-to-end testing
- regression testing
- coverage
- automation

Assess confidence level.

---

# Phase 13 – Documentation Audit

Documentation Engineer should inspect:

- README
- architecture docs
- API docs
- deployment docs
- changelog
- project progress
- context

Identify documentation gaps.

---

# Phase 14 – Technical Debt

Summarize:

- duplicated code
- outdated dependencies
- missing tests
- documentation gaps
- architectural shortcuts
- deprecated features

Prioritize by impact.

---

# Health Scorecard

Assign scores (0–10):

Architecture

Code Quality

Backend

Frontend

Database

API

Security

Performance

Testing

Documentation

DevOps

AI Systems (if applicable)

Overall Project Health

Explain each score.

---

# Risk Register

For every major risk document:

- description
- impact
- likelihood
- mitigation
- owner
- priority

---

# Recommendations

Organize into:

Immediate

Short-Term

Medium-Term

Long-Term

Prioritize by business value and engineering impact.

---

# Deliverables

Generate or update:

AUDIT_REPORT.md

PROJECT_HEALTH.md

RISK_REGISTER.md

TECHNICAL_DEBT.md

IMPROVEMENT_PLAN.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Final Report Format

Produce:

## Executive Summary

## Overall Health Score

## Architecture Audit

## Code Quality Audit

## Backend Audit

## Frontend Audit

## Database Audit

## API Audit

## Security Audit

## Performance Audit

## DevOps Audit

## AI & Data Audit

## Testing Audit

## Documentation Audit

## Technical Debt

## Risk Register

## Improvement Roadmap

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ architecture audited

✓ code quality audited

✓ backend audited

✓ frontend audited

✓ database audited

✓ APIs audited

✓ security audited

✓ performance audited

✓ DevOps audited

✓ AI audited if applicable

✓ testing audited

✓ documentation audited

✓ technical debt documented

✓ risks prioritized

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- Every major subsystem has been evaluated.
- A health score has been assigned.
- Technical debt is documented.
- Risks are prioritized.
- Improvements are actionable.
- Documentation reflects the audit results.

---

# End Goal

Provide a comprehensive engineering assessment of the repository that enables informed technical decisions, prioritizes improvements, reduces long-term risk, and guides the project toward a scalable, maintainable, and production-ready future.