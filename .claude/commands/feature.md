---
name: feature
description: Plan, design, implement, validate, document, and prepare a new feature for release by coordinating all relevant engineering, product, AI, and quality assurance agents while preserving architectural integrity and production readiness.
agents:
  - startup-product-manager
  - project-manager
  - software-architect
  - ux-designer
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - data-engineer
  - ml-engineer
  - research-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - security-engineer
  - performance-engineer
  - qa-engineer
  - documentation-engineer
  - code-reviewer
---

# Feature Command

## Purpose

Implement a complete feature using a structured, end-to-end engineering workflow.

Every feature should move through discovery, planning, architecture, implementation, testing, review, and documentation before being considered complete.

This command coordinates the entire software development lifecycle.

---

# Objectives

This command should answer:

- Why is this feature needed?
- Who benefits from it?
- How does it fit into the roadmap?
- What architectural changes are required?
- Which agents are involved?
- How should it be implemented?
- How will it be tested?
- What documentation must be updated?
- Is it production-ready?

---

# General Rules

Always:

- Understand the feature before implementation.
- Respect the existing architecture.
- Prefer incremental development.
- Reuse existing components where possible.
- Preserve backward compatibility unless explicitly requested.
- Update documentation alongside code.

Never:

- Implement without understanding requirements.
- Duplicate functionality.
- Introduce architectural violations.
- Skip testing or review.

---

# Phase 1 – Feature Discovery

Startup Product Manager should:

- define the user problem
- identify target users
- explain business value
- define success metrics
- determine MVP scope
- write user stories
- establish acceptance criteria

Deliver:

- feature summary
- user stories
- acceptance criteria
- measurable outcomes

---

# Phase 2 – Project Planning

Project Manager should:

- estimate effort
- identify dependencies
- assign responsibilities
- define milestones
- identify risks
- update sprint plan

Deliver:

- implementation plan
- task breakdown
- timeline
- dependency map

---

# Phase 3 – Architecture Review

Software Architect should:

- review architectural impact
- identify affected modules
- evaluate scalability
- recommend design patterns
- validate separation of concerns
- identify reusable components

Deliver:

- architectural proposal
- module impact analysis
- dependency changes

---

# Phase 4 – UX Design

UX Designer should:

- define user flow
- update wireframes if needed
- specify interactions
- verify accessibility
- validate responsive behavior

Deliver:

- UX specification
- interaction flow
- accessibility considerations

---

# Phase 5 – Backend Implementation

Backend Engineer should:

- implement business logic
- update services
- add validation
- handle errors
- integrate APIs
- write backend tests

Deliver:

- backend implementation
- service updates
- test coverage

---

# Phase 6 – Frontend Implementation

Frontend Engineer should:

- implement UI
- integrate APIs
- manage state
- handle loading/errors
- ensure responsiveness
- follow design system

Deliver:

- UI components
- frontend logic
- responsive layouts

---

# Phase 7 – Database Changes

If required, Database Engineer should:

- design schema changes
- create migrations
- update indexes
- validate integrity
- document changes

Deliver:

- migrations
- schema updates

---

# Phase 8 – API Updates

API Engineer should:

- update API contracts
- validate request/response formats
- version APIs if required
- update API documentation

Deliver:

- updated API specification

---

# Phase 9 – Data & AI

If applicable:

Data Engineer:

- update pipelines
- validate preprocessing
- update feature engineering

ML Engineer:

- train/update models
- evaluate performance
- document metrics

Research Engineer:

- validate methodology
- benchmark results

Climate AI Engineer:

- validate environmental assumptions
- update climate workflows

Satellite Imagery Engineer:

- update geospatial workflows
- validate imagery processing

Skip these phases if the feature does not affect AI or geospatial functionality.

---

# Phase 10 – Security Review

Security Engineer should:

- review authentication
- validate authorization
- inspect input validation
- identify vulnerabilities
- verify secret handling

Deliver:

- security findings
- mitigation recommendations

---

# Phase 11 – Performance Review

Performance Engineer should:

- profile affected components
- identify bottlenecks
- recommend optimizations
- verify scalability

Deliver:

- performance assessment

---

# Phase 12 – Testing

QA Engineer should:

- execute unit tests
- execute integration tests
- execute regression tests
- verify acceptance criteria
- validate edge cases

Deliver:

- QA report
- test results
- unresolved issues

---

# Phase 13 – Documentation

Documentation Engineer should update:

- PROJECT_PROGRESS.md
- CONTEXT.md
- CHANGELOG.md
- API documentation
- architecture documentation
- user documentation
- technical documentation

Keep documentation synchronized with implementation.

---

# Phase 14 – Code Review

Code Reviewer should:

- review maintainability
- verify architectural compliance
- assess code quality
- verify documentation
- validate testing
- identify technical debt

Deliver:

- review summary
- approval or requested changes

---

# Completion Criteria

A feature is complete only if:

✓ acceptance criteria satisfied

✓ implementation complete

✓ architecture respected

✓ tests pass

✓ documentation updated

✓ security reviewed

✓ performance acceptable

✓ code reviewed

✓ technical debt documented

✓ project progress updated

✓ context updated

---

# Deliverables

Generate or update:

FEATURE_SPEC.md

IMPLEMENTATION_PLAN.md

TASK_BREAKDOWN.md

API_DOCUMENTATION.md

DATABASE_CHANGES.md

TEST_REPORT.md

SECURITY_REPORT.md

PERFORMANCE_REPORT.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge updates intelligently.

---

# Final Report Format

Produce:

## Executive Summary

## Feature Overview

## User Stories

## Acceptance Criteria

## Architecture Impact

## Backend Changes

## Frontend Changes

## Database Changes

## API Changes

## AI/Data Changes

## Security Review

## Performance Review

## Testing Results

## Documentation Updates

## Risks

## Outstanding Work

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ user problem understood

✓ feature prioritized

✓ architecture validated

✓ implementation complete

✓ UX reviewed

✓ backend reviewed

✓ frontend reviewed

✓ database updated if needed

✓ APIs updated if needed

✓ AI workflows updated if needed

✓ security approved

✓ performance validated

✓ QA passed

✓ documentation synchronized

✓ code reviewed

✓ context updated

✓ project progress updated

---

# Success Criteria

This command succeeds only if:

- The feature solves the intended user problem.
- Acceptance criteria are met.
- The implementation follows architectural standards.
- Security, performance, and testing have been completed.
- Documentation reflects the new functionality.
- The feature is ready for review and eventual release.

---

# End Goal

Deliver high-quality, production-ready features through a repeatable, evidence-based workflow that integrates product thinking, architecture, engineering, AI, testing, documentation, and governance while maintaining the long-term health of the codebase.