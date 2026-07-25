---
name: testing
description: Design, execute, and evaluate a comprehensive testing strategy for features, systems, and releases.
version: 1.0
owner: qa-engineer

agents:
  - qa-engineer
  - backend-engineer
  - frontend-engineer
  - api-engineer
  - database-engineer
  - performance-engineer
  - security-engineer
  - documentation-engineer

workflows:
  - testing
  - feature-development
  - code-review

commands:
  - test
  - review
  - optimize

standards:
  - testing-standards
  - coding-standards
  - security-standards
  - performance-guidelines
  - documentation-standards

outputs:
  - TEST_PLAN.md
  - TEST_REPORT.md
  - TEST_COVERAGE.md
  - REGRESSION_REPORT.md
  - BUG_REPORT.md
  - QUALITY_REPORT.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Testing Prompt

## Mission

Verify that the implementation satisfies all functional and non-functional requirements.

Testing should provide confidence that the software is production-ready.

Every important behavior should be validated before release.

---

# Phase 1 — Understand the Feature

Review:

- Feature Request
- Design Document
- Architecture Review
- Pull Request
- Acceptance Criteria

Determine:

- expected behavior
- edge cases
- failure scenarios
- business rules

Generate:

TEST_PLAN.md

---

# Phase 2 — Identify Test Scope

Classify testing into:

- Functional
- Integration
- End-to-End
- Performance
- Security
- Regression
- Accessibility
- Compatibility

Document which areas require testing.

---

# Phase 3 — Unit Testing

Verify:

- business logic
- helper functions
- validation
- utilities
- services

Ensure:

- deterministic tests
- isolated execution
- meaningful assertions

---

# Phase 4 — Integration Testing

Verify interactions between:

- backend services
- APIs
- databases
- authentication
- third-party services

Ensure data flows correctly across system boundaries.

---

# Phase 5 — End-to-End Testing

Validate complete user workflows.

Examples:

- user registration
- login
- CRUD operations
- payments
- uploads
- search
- reporting

Test the application from the user's perspective.

---

# Phase 6 — API Testing

Verify:

- endpoints
- request validation
- response schema
- authentication
- authorization
- pagination
- filtering
- error handling
- rate limiting

Test both success and failure cases.

---

# Phase 7 — Database Testing

Verify:

- schema integrity
- migrations
- rollback procedures
- indexes
- constraints
- transactions
- data consistency

Ensure migrations are repeatable and reversible.

---

# Phase 8 — Security Testing

Test for:

- authentication failures
- authorization bypass
- SQL injection
- XSS
- CSRF
- insecure input handling
- secret exposure
- dependency vulnerabilities

Document findings.

---

# Phase 9 — Performance Testing

Evaluate:

- response time
- database performance
- rendering speed
- memory usage
- CPU utilization
- bundle size
- caching effectiveness

Compare results against project targets.

---

# Phase 10 — Accessibility Testing

Verify:

- keyboard navigation
- semantic HTML
- ARIA usage
- color contrast
- focus management
- screen reader compatibility

Ensure compliance with accessibility standards where applicable.

---

# Phase 11 — Cross-Platform Compatibility

Verify support for:

- supported browsers
- supported operating systems
- mobile devices
- tablets
- desktop environments

Document unsupported environments.

---

# Phase 12 — Regression Testing

Confirm that new changes do not break existing functionality.

Focus on:

- core workflows
- authentication
- APIs
- database
- integrations
- previously fixed defects

Generate:

REGRESSION_REPORT.md

---

# Phase 13 — Coverage Analysis

Evaluate:

- unit test coverage
- integration coverage
- API coverage
- UI coverage
- critical path coverage

Identify gaps.

Generate:

TEST_COVERAGE.md

---

# Phase 14 — Quality Assessment

Evaluate overall software quality.

Consider:

- reliability
- maintainability
- stability
- usability
- security
- performance

Generate:

QUALITY_REPORT.md

---

# Phase 15 — Documentation

Update:

- TEST_PLAN.md
- TEST_REPORT.md
- TEST_COVERAGE.md
- REGRESSION_REPORT.md
- BUG_REPORT.md
- PROJECT_PROGRESS.md
- CONTEXT.md

Summarize:

- completed testing
- discovered issues
- remaining risks
- release recommendation

---

# Deliverables

Produce or update:

- TEST_PLAN.md
- TEST_REPORT.md
- TEST_COVERAGE.md
- REGRESSION_REPORT.md
- BUG_REPORT.md
- QUALITY_REPORT.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Testing Principles

Always:

- Test requirements, not implementation details.
- Cover normal, edge, and failure scenarios.
- Keep tests deterministic and repeatable.
- Prefer automated tests where practical.
- Verify regressions before completion.
- Document discovered defects.

Never:

- Skip testing because a feature appears simple.
- Ignore intermittent failures.
- Approve changes with failing critical tests.
- Remove tests to make builds pass.
- Leave uncovered critical paths.

---

# Release Recommendation

At the end of testing, provide one recommendation:

✅ Ready for Production

⚠️ Ready with Minor Issues

❌ Not Ready for Release

Support the recommendation with evidence from the testing results.

---

# Definition of Done

Testing is complete only when:

- Acceptance criteria are fully validated.
- Critical user workflows pass.
- Security testing is satisfactory.
- Performance meets project expectations.
- Regression testing passes.
- Test coverage is acceptable.
- Documentation is updated.
- Remaining risks are clearly documented.
- Project context is refreshed for future sessions.