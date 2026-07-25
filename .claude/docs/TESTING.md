# Testing Strategy

## Purpose

This document defines the testing strategy, standards, processes, and quality requirements for the project.

It describes the testing philosophy, test types, automation strategy, coverage expectations, environments, tools, and quality gates.

This document serves as the primary testing reference for developers, QA engineers, and AI agents.

Update this document whenever testing practices or tools change.

---

# Testing Philosophy

The project follows these principles:

- Quality is built during development, not after development.
- Automated tests should cover critical functionality.
- Tests should be reliable and maintainable.
- Failures should be investigated immediately.
- Testing should validate user outcomes, not only implementation details.
- Every major feature should include appropriate tests.

---

# Testing Objectives

The testing strategy aims to ensure:

- Functional correctness
- System reliability
- Security
- Performance
- Maintainability
- Regression prevention
- Production confidence

---

# Test Pyramid

The project follows the testing pyramid:

```
              End-to-End Tests
                    ▲
                   / \
                  /   \
          Integration Tests
                ▲
               / \
              /   \
          Unit Tests
```

Priority:

1. Unit Tests
2. Integration Tests
3. End-to-End Tests

The majority of tests should exist at lower levels for speed and reliability.

---

# Testing Levels

---

# 1. Unit Testing

## Purpose

Validate individual components, functions, classes, and modules independently.

---

## Scope

Examples:

- Utility functions
- Business logic
- Data transformations
- Model functions
- Validation logic

---

## Requirements

- Critical logic must have unit tests.
- Tests should be isolated.
- External dependencies should be mocked.
- Tests should run quickly.

---

## Coverage Target

Define project target:

Example:

Minimum:

70%

Critical modules:

90%+

---

# 2. Integration Testing

## Purpose

Verify that multiple components work correctly together.

---

## Scope

Examples:

- API + Database
- Backend + ML service
- Authentication flow
- External service integrations

---

## Requirements

Tests should verify:

- Data flow
- Communication
- Error handling
- Authentication
- Transactions

---

# 3. End-to-End Testing

## Purpose

Validate complete user workflows.

---

## Scope

Examples:

- User registration
- Login
- Main application workflow
- Report generation
- Data processing workflow

---

## Requirements

E2E tests should represent real user behavior.

---

# API Testing

If applicable.

Test:

- Endpoint availability
- Request validation
- Authentication
- Authorization
- Response formats
- Error handling
- Rate limiting

---

# Database Testing

Test:

- Schema correctness
- Migrations
- Relationships
- Constraints
- Transactions
- Query performance

---

# Frontend Testing

Tooling: Vitest + React Testing Library + jsdom, configured in
`frontend/vitest.config.ts` (path alias `@/*` mirrors `tsconfig.json`,
setup file at `frontend/src/test/setup.ts` loads jest-dom matchers).
Run via `npm run test` (`vitest run`), wired into the `frontend` CI job.

Current coverage (added 2026-07-26, `features/maps`):

- `store/map-store.test.ts` — zustand store defaults, camera/basemap/gas
  mutations, and localStorage persistence/hydration.
- `hooks/use-geo.test.tsx`, `use-predict.test.tsx`,
  `use-run-prediction.test.tsx` — React Query hooks, with `@/services/
  api-client` mocked via `vi.mock` so no real network calls happen.

Not yet covered: the map's UI component tree (`emission-map.tsx`, 1045
lines) — GIS export, timeline, compare-predictions, and alerts logic all
live inline in that component rather than as extractable pure functions.
Testing it directly would need either component-level tests (mocking the
global `window.Cesium` script) or extracting the export/GeoJSON logic
into testable pure functions first. See TECH_DEBT.md.

Test:

- Components
- User interactions
- Forms
- Navigation
- Responsive behavior
- Accessibility

---

# Machine Learning Testing

If applicable.

## Data Validation

Verify:

- Dataset quality
- Missing values
- Data formats
- Distribution changes

---

## Model Testing

Evaluate:

- Accuracy
- Precision
- Recall
- F1 score
- Error analysis
- Generalization

---

## Model Regression Testing

Ensure:

- New models do not reduce performance.
- Predictions remain consistent.
- Data pipelines remain stable.

---

# Performance Testing

Evaluate:

- Response time
- Throughput
- Memory usage
- CPU usage
- Database performance
- Large-scale processing

---

# Security Testing

Test:

- Authentication
- Authorization
- Input validation
- Injection protection
- Data protection
- Dependency vulnerabilities

Reference:

SECURITY.md

---

# Test Environments

Document testing environments.

---

## Local Environment

Purpose:

Developer testing

---

## CI Environment

Purpose:

Automated validation

Includes:

- Unit tests
- Integration tests
- Linting
- Build verification

---

## Staging Environment

Purpose:

Production-like testing

Includes:

- Full workflow testing
- Performance testing
- Release validation

---

# Automation Strategy

Automate:

- Unit tests
- Integration tests
- Regression tests
- Build verification
- Security checks

Manual testing should focus on:

- User experience
- Exploratory testing
- Visual verification

---

# Continuous Integration

Every pull request should verify:

- Tests pass
- Code builds
- Linting passes
- Security checks pass

Failed checks should block merging.

---

# Test Data Management

Document:

- Test datasets
- Mock data
- Fixtures
- Data generation
- Cleanup strategy

Ensure:

- No production data is used incorrectly.
- Sensitive data is protected.

---

# Bug Testing Process

When a bug is discovered:

1. Reproduce the issue.
2. Create a failing test.
3. Fix the implementation.
4. Verify the test passes.
5. Add regression coverage.

Reference:

logs/bugs.md

---

# Test Reporting

Track:

- Test results
- Coverage
- Failed tests
- Performance benchmarks
- Security findings

---

# Quality Gates

A feature is ready when:

- Unit tests pass.
- Integration tests pass.
- Critical workflows pass.
- Security review completed.
- Performance requirements satisfied.
- Documentation updated.

---

# Testing Tools

Document project testing tools.

Examples:

Frontend:

- Jest
- React Testing Library
- Playwright

Backend:

- PyTest
- Postman
- Testcontainers

Database:

- Migration testing tools

CI/CD:

- GitHub Actions

---

# Known Testing Limitations

Document current limitations.

Examples:

- Missing automation
- Limited test coverage
- External dependency testing challenges

Reference:

KNOWN_ISSUES.md

---

# Related Documentation

- ARCHITECTURE.md
- API_REFERENCE.md
- DATABASE.md
- SECURITY.md
- PERFORMANCE.md
- DEPLOYMENT.md
- PROJECT_PROGRESS.md

---

# Maintenance Guidelines

Update this document whenever:

- Testing tools change.
- New test types are introduced.
- Coverage requirements change.
- CI/CD process changes.
- Quality standards evolve.

This document should always represent the current testing strategy and quality expectations of the project.