---
name: review
description: Perform a comprehensive engineering review of implemented changes to ensure code quality, architectural compliance, security, performance, testing, maintainability, documentation, and production readiness before merge or release.
agents:
  - code-reviewer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - security-engineer
  - performance-engineer
  - qa-engineer
  - documentation-engineer
  - project-manager
---

# Review Command

## Purpose

Conduct a complete engineering review of newly implemented work before approving it for merge or release.

This command validates engineering quality.

It does not implement features.

---

# Objectives

Answer the following questions:

- Does the implementation satisfy the requirements?
- Is the code maintainable?
- Does it follow the architecture?
- Is it secure?
- Is it performant?
- Are tests sufficient?
- Is documentation complete?
- Is the implementation production-ready?

---

# General Rules

Always:

- Review objectively.
- Base findings on evidence.
- Explain every recommendation.
- Respect existing architectural decisions.
- Focus on maintainability.

Never:

- Reject code because of personal preference.
- Rewrite working code unnecessarily.
- Ignore documentation.
- Ignore edge cases.

---

# Inputs

Review:

- Feature implementation
- Pull requests
- Changed files
- Tests
- Documentation
- Architecture documents
- API specifications
- Database migrations

Understand the implementation before reviewing it.

---

# Phase 1 – Requirements Validation

Project Manager should verify:

- feature scope
- acceptance criteria
- completed tasks
- unresolved work

Confirm the implementation satisfies the agreed objectives.

---

# Phase 2 – Architecture Review

Software Architect should inspect:

- architectural boundaries
- dependency direction
- separation of concerns
- modularity
- scalability

Reject architectural violations.

---

# Phase 3 – Backend Review

Backend Engineer should review:

- business logic
- validation
- authentication
- authorization
- error handling
- service organization
- logging

Recommend simplifications where appropriate.

---

# Phase 4 – Frontend Review

Frontend Engineer should review:

- component organization
- state management
- responsiveness
- accessibility
- user experience
- API integration

Promote reusable UI components.

---

# Phase 5 – Database Review

Database Engineer should inspect:

- schema changes
- migrations
- indexing
- constraints
- relationships
- query efficiency

Identify unnecessary complexity.

---

# Phase 6 – API Review

API Engineer should verify:

- endpoint consistency
- versioning
- request validation
- response structure
- error responses
- documentation

Ensure API contracts remain stable.

---

# Phase 7 – Security Review

Security Engineer should inspect:

- authentication
- authorization
- secret handling
- injection risks
- dependency vulnerabilities
- OWASP Top 10 issues
- secure defaults

Assign severity levels:

Critical

High

Medium

Low

---

# Phase 8 – Performance Review

Performance Engineer should evaluate:

- CPU usage
- memory allocation
- rendering efficiency
- database queries
- API latency
- bundle size
- caching

Recommend measurable improvements.

---

# Phase 9 – Testing Review

QA Engineer should verify:

- unit tests
- integration tests
- regression tests
- edge-case coverage
- acceptance criteria
- test reliability

Identify gaps in test coverage.

---

# Phase 10 – Documentation Review

Documentation Engineer should verify updates to:

- README
- API documentation
- Architecture documentation
- CHANGELOG.md
- PROJECT_PROGRESS.md
- CONTEXT.md
- Technical documentation

Documentation should accurately reflect implementation.

---

# Phase 11 – Code Quality Review

Code Reviewer should inspect:

- readability
- naming
- complexity
- duplication
- maintainability
- abstraction
- consistency

Suggest improvements that increase long-term quality.

---

# Technical Debt

Identify:

- TODOs
- duplicated code
- temporary fixes
- obsolete patterns
- missing abstractions

Rank by priority.

---

# Risk Assessment

Evaluate:

- architectural risks
- security risks
- operational risks
- scalability risks
- maintainability risks

Estimate:

- likelihood
- impact
- mitigation strategy

---

# Review Classification

Every finding should be classified as:

Critical

Must Fix

Should Fix

Suggestion

Question

Positive Feedback

Provide rationale for every classification.

---

# Merge Recommendation

The Code Reviewer should choose one outcome:

Approve

Approve with Minor Suggestions

Request Changes

Reject

Explain the reasoning clearly.

---

# Deliverables

Generate or update:

CODE_REVIEW.md

SECURITY_REVIEW.md

PERFORMANCE_REVIEW.md

TEST_COVERAGE.md

TECHNICAL_DEBT.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently without overwriting valuable information.

---

# Final Report Format

Produce:

## Executive Summary

## Requirements Validation

## Architecture Review

## Backend Review

## Frontend Review

## Database Review

## API Review

## Security Review

## Performance Review

## Testing Review

## Documentation Review

## Code Quality

## Technical Debt

## Risks

## Findings by Severity

## Merge Recommendation

## Suggested Next Steps

---

# Quality Checklist

Before finishing verify:

✓ requirements satisfied

✓ architecture respected

✓ backend reviewed

✓ frontend reviewed

✓ database reviewed

✓ APIs reviewed

✓ security assessed

✓ performance assessed

✓ testing validated

✓ documentation reviewed

✓ technical debt documented

✓ risks documented

✓ merge recommendation provided

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- The implementation has been independently reviewed.
- Architectural compliance is confirmed.
- Security and performance risks are identified.
- Documentation is synchronized.
- Testing coverage is adequate.
- Technical debt is documented.
- A clear merge recommendation is produced.

---

# End Goal

Provide a comprehensive, objective, and evidence-based engineering review that ensures only high-quality, maintainable, secure, well-tested, and production-ready software progresses toward deployment.