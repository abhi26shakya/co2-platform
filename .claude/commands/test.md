---
name: test
description: Execute a comprehensive software validation workflow to verify correctness, reliability, regression safety, security, performance, API compatibility, database integrity, AI model behavior, and production readiness before deployment.
agents:
  - qa-engineer
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - ml-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - security-engineer
  - performance-engineer
  - documentation-engineer
  - project-manager
---

# Test Command

## Purpose

Validate the correctness, reliability, and production readiness of the software.

This command verifies behavior rather than implementation.

Do not modify production code unless explicitly requested.

---

# Objectives

This command should answer:

- Does the software work correctly?
- Do all acceptance criteria pass?
- Are regressions introduced?
- Are APIs functioning?
- Is the database consistent?
- Are AI models behaving correctly?
- Is the application performant?
- Is it ready for deployment?

---

# General Rules

Always:

- Test before deployment.
- Verify expected behavior.
- Validate edge cases.
- Test error handling.
- Document every failure.
- Produce reproducible results.

Never:

- Skip failed tests.
- Ignore flaky behavior.
- Hide failures.
- Assume functionality without evidence.

---

# Inputs

Review:

- Feature implementation
- Acceptance criteria
- User stories
- API specifications
- Database schema
- Test suites
- Documentation
- Previous bug reports

---

# Test Strategy

Develop a testing plan covering:

- Unit testing
- Integration testing
- End-to-end testing
- Regression testing
- API testing
- Database testing
- Security testing
- Performance testing
- Accessibility testing
- AI validation

---

# Phase 1 – Acceptance Validation

Project Manager should verify:

- feature scope
- acceptance criteria
- expected outcomes

Every acceptance criterion must be validated.

---

# Phase 2 – Unit Testing

QA Engineer should verify:

- functions
- classes
- utilities
- services
- helper modules

Aim for meaningful coverage rather than arbitrary percentages.

---

# Phase 3 – Integration Testing

Verify interactions between:

- frontend and backend
- backend and database
- backend and APIs
- AI services
- authentication services
- caching layers

Ensure systems work together correctly.

---

# Phase 4 – End-to-End Testing

Validate complete user workflows.

Examples:

- user registration
- login
- dashboard
- CRUD operations
- payments
- AI inference
- satellite workflows

Test real-world scenarios.

---

# Phase 5 – Backend Validation

Backend Engineer should verify:

- business logic
- validation
- authentication
- authorization
- error handling
- logging
- background jobs

---

# Phase 6 – Frontend Validation

Frontend Engineer should verify:

- rendering
- responsiveness
- accessibility
- navigation
- forms
- loading states
- error states

Ensure a consistent user experience.

---

# Phase 7 – Database Validation

Database Engineer should verify:

- migrations
- constraints
- indexes
- transactions
- rollback safety
- referential integrity

Validate data consistency.

---

# Phase 8 – API Validation

API Engineer should verify:

- endpoints
- request validation
- response formats
- status codes
- authentication
- authorization
- backward compatibility

Ensure API contracts remain stable.

---

# Phase 9 – AI Validation

If applicable:

ML Engineer should verify:

- inference accuracy
- model loading
- prediction latency
- evaluation metrics

Climate AI Engineer should verify:

- emissions calculations
- environmental assumptions
- scientific consistency

Satellite Imagery Engineer should verify:

- raster processing
- imagery quality
- GIS workflows
- feature extraction

Skip these phases if AI functionality is unaffected.

---

# Phase 10 – Security Testing

Security Engineer should verify:

- authentication
- authorization
- session management
- input validation
- injection resistance
- dependency vulnerabilities

Document findings by severity.

---

# Phase 11 – Performance Testing

Performance Engineer should verify:

- API latency
- rendering speed
- memory usage
- CPU utilization
- database performance
- caching effectiveness

Record measurable benchmarks.

---

# Phase 12 – Accessibility Testing

Validate:

- keyboard navigation
- screen reader compatibility
- color contrast
- focus indicators
- responsive layouts

Aim for WCAG compliance where applicable.

---

# Phase 13 – Regression Testing

Verify that existing functionality remains unaffected.

Focus on:

- critical user flows
- shared components
- authentication
- APIs
- database operations

Regression failures take priority.

---

# Phase 14 – Documentation Validation

Documentation Engineer should verify:

- test documentation
- updated APIs
- user guides
- deployment instructions
- changelog
- project progress

Documentation should match actual behavior.

---

# Defect Classification

Classify every issue as:

Critical

High

Medium

Low

Enhancement

Document:

- reproduction steps
- expected behavior
- observed behavior
- environment
- severity

---

# Test Summary

Summarize:

- total tests
- passed
- failed
- skipped
- blocked
- flaky tests

Provide an overall health assessment.

---

# Deployment Readiness

Recommend one of:

Ready for Deployment

Ready with Minor Issues

Not Ready

Blocked

Explain the recommendation.

---

# Deliverables

Generate or update:

TEST_REPORT.md

TEST_PLAN.md

TEST_COVERAGE.md

BUG_REPORT.md

PERFORMANCE_RESULTS.md

SECURITY_RESULTS.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Final Report Format

Produce:

## Executive Summary

## Testing Strategy

## Acceptance Validation

## Unit Testing

## Integration Testing

## End-to-End Testing

## Backend Validation

## Frontend Validation

## Database Validation

## API Validation

## AI Validation

## Security Testing

## Performance Testing

## Accessibility Testing

## Regression Testing

## Documentation Validation

## Defects

## Deployment Readiness

## Suggested Next Steps

---

# Quality Checklist

Before finishing verify:

✓ acceptance criteria validated

✓ unit tests executed

✓ integration tests executed

✓ end-to-end tests executed

✓ backend validated

✓ frontend validated

✓ database validated

✓ APIs validated

✓ AI validated if applicable

✓ security testing completed

✓ performance testing completed

✓ accessibility reviewed

✓ regression testing completed

✓ documentation updated

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- All critical user workflows have been validated.
- Acceptance criteria are satisfied.
- Regression testing passes.
- Security and performance testing are completed.
- Documentation reflects tested behavior.
- A clear deployment readiness recommendation is produced.

---

# End Goal

Provide a complete validation of the software so stakeholders can make an informed deployment decision with confidence, supported by reproducible test evidence, documented results, and clear recommendations.