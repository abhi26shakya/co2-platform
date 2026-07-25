---
name: code-review
description: Perform a comprehensive engineering review of code changes before approval or merge.
version: 1.0
owner: code-reviewer

agents:
  - code-reviewer
  - software-architect
  - security-engineer
  - performance-engineer
  - qa-engineer
  - documentation-engineer

workflows:
  - code-review
  - testing
  - security-audit

commands:
  - review
  - audit
  - test
  - optimize

standards:
  - coding-standards
  - architecture-principles
  - security-standards
  - testing-standards
  - performance-guidelines
  - documentation-standards
  - code-review-checklist

outputs:
  - CODE_REVIEW.md
  - SECURITY_REVIEW.md
  - PERFORMANCE_REVIEW.md
  - TEST_COVERAGE.md
  - PROJECT_PROGRESS.md
---

# Code Review Prompt

## Mission

Perform a senior-level engineering review of the proposed code changes.

Review the implementation as if it will be deployed to production immediately.

Do not rewrite the code unless requested.

Focus on identifying risks, weaknesses, and improvement opportunities.

---

# Phase 1 — Understand the Change

Review:

- Feature Request
- Design Document
- Pull Request
- Architecture Review
- Testing Plan

Determine:

- business objective
- affected components
- implementation scope
- expected behavior

---

# Phase 2 — Correctness Review

Verify:

- implementation satisfies requirements
- acceptance criteria met
- edge cases handled
- failure scenarios considered
- no obvious logic errors

Document missing functionality.

---

# Phase 3 — Architecture Review

Evaluate:

- separation of concerns
- modularity
- abstraction
- dependency management
- consistency with project architecture
- SOLID principles

Identify architectural violations.

---

# Phase 4 — Code Quality Review

Review:

- readability
- maintainability
- naming
- duplication
- complexity
- unnecessary abstraction
- dead code

Recommend simplifications where appropriate.

---

# Phase 5 — Security Review

Inspect for:

- authentication
- authorization
- input validation
- SQL injection
- XSS
- CSRF
- command injection
- insecure secrets
- insecure dependencies
- sensitive logging

Classify findings:

- Critical
- High
- Medium
- Low

Generate:

SECURITY_REVIEW.md

---

# Phase 6 — Performance Review

Review:

- database queries
- API efficiency
- rendering
- caching
- bundle size
- memory usage
- unnecessary allocations
- loops
- network requests

Generate:

PERFORMANCE_REVIEW.md

---

# Phase 7 — Testing Review

Verify:

- unit tests
- integration tests
- end-to-end tests
- regression coverage

Identify:

- missing tests
- weak assertions
- flaky tests

Generate:

TEST_COVERAGE.md

---

# Phase 8 — Documentation Review

Ensure documentation is updated.

Review:

- README
- API Documentation
- Architecture
- Release Notes
- Changelog

Document missing updates.

---

# Phase 9 — Dependency Review

Review:

- newly added packages
- version upgrades
- deprecated libraries
- license concerns
- maintenance status

Highlight unnecessary dependencies.

---

# Phase 10 — Risk Assessment

Identify:

- production risks
- operational risks
- scalability risks
- migration risks
- deployment risks

Rank each risk:

- Critical
- High
- Medium
- Low

---

# Phase 11 — Review Summary

Categorize findings:

## Must Fix

Blocking issues that must be resolved before merge.

---

## Should Fix

Important improvements that should be completed before release.

---

## Nice to Have

Optional improvements that increase maintainability or developer experience.

---

## Positive Observations

Highlight strengths of the implementation.

---

# Deliverables

Produce or update:

- CODE_REVIEW.md
- SECURITY_REVIEW.md
- PERFORMANCE_REVIEW.md
- TEST_COVERAGE.md
- PROJECT_PROGRESS.md

---

# Review Principles

Always:

- Review objectively.
- Explain the reasoning behind each finding.
- Prioritize high-impact issues.
- Prefer simple, maintainable solutions.
- Reference project standards when making recommendations.

Never:

- Approve insecure code.
- Ignore architectural violations.
- Recommend unnecessary complexity.
- Block changes for stylistic preferences alone.
- Rewrite the implementation unless explicitly requested.

---

# Approval Criteria

Approve only when:

- Requirements are fully implemented.
- Architecture is respected.
- Security review passes.
- Performance is acceptable.
- Tests are sufficient and passing.
- Documentation is complete.
- No unresolved Critical or High severity issues remain.

If approval is not appropriate, clearly explain why and list the actions required before the code should be merged.