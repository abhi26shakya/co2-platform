---
name: code-review-checklist
description: Defines the standardized code review process, evaluation criteria, approval requirements, and quality checklist for all code changes across the engineering framework.
version: 1.0
owner: code-reviewer
---

# Code Review Checklist

## Purpose

Code review is the primary quality gate before software becomes part of the production codebase.

Its purpose is to improve software quality, reduce defects, share knowledge, enforce engineering standards, and ensure long-term maintainability.

Every meaningful change should undergo review before merging.

---

# Review Philosophy

A review should:

- Improve the software
- Improve the engineer
- Reduce project risk
- Preserve architectural integrity
- Encourage constructive discussion

Reviews should focus on the code—not the individual.

---

# Review Principles

Every review should be:

- Respectful
- Objective
- Thorough
- Evidence-based
- Actionable
- Consistent

Comments should explain **why** something should change rather than simply stating that it should.

---

# Review Scope

Review all modified files, including:

- Source code
- Configuration
- Infrastructure
- Database migrations
- Tests
- Documentation
- Build scripts
- CI/CD workflows

No file should be exempt from review.

---

# Architecture Review

Verify:

- module boundaries remain clear
- responsibilities are well separated
- dependencies follow architecture principles
- abstractions are appropriate
- no unnecessary coupling
- design aligns with project architecture

Questions:

- Does this fit the existing architecture?
- Is a simpler design possible?
- Will this scale?

---

# Correctness Review

Verify:

- requirements implemented correctly
- expected behavior achieved
- edge cases handled
- failure paths considered
- error handling appropriate
- logic complete

Questions:

- Can this fail unexpectedly?
- Are assumptions documented?
- Does the implementation match the specification?

---

# Readability Review

Verify:

- code is easy to understand
- naming is meaningful
- structure is logical
- functions remain focused
- duplication minimized

Questions:

- Could another engineer understand this quickly?
- Is intent immediately obvious?

---

# Maintainability Review

Verify:

- minimal complexity
- reusable components
- clear abstractions
- unnecessary code removed
- future changes remain manageable

Avoid creating technical debt.

---

# Security Review

Verify:

- authentication correct
- authorization enforced
- inputs validated
- secrets protected
- sensitive data handled safely
- dependencies acceptable

Questions:

- Can this introduce a vulnerability?
- Are secure defaults maintained?

---

# Performance Review

Verify:

- efficient algorithms
- database queries optimized
- caching appropriate
- memory usage acceptable
- unnecessary work eliminated

Avoid premature optimization.

---

# API Review

Verify:

- request validation
- response consistency
- backward compatibility
- proper status codes
- clear contracts
- versioning considered

Public APIs should evolve carefully.

---

# Database Review

Verify:

- schema integrity
- migrations reversible
- indexes appropriate
- constraints correct
- transaction safety maintained

Data integrity takes priority.

---

# Testing Review

Verify:

- unit tests added
- integration tests updated
- regression tests included
- edge cases covered
- failures reproducible

Every defect fix should include regression protection where practical.

---

# Documentation Review

Verify:

- documentation updated
- API docs synchronized
- architecture reflects implementation
- changelog updated when necessary
- comments remain accurate

Documentation should evolve with the code.

---

# AI-Generated Code Review

AI-generated code should receive the same scrutiny as human-written code.

Verify:

- correctness
- unnecessary complexity
- hallucinated APIs
- duplicated logic
- maintainability
- compliance with project standards

Never approve AI-generated code solely because it compiles.

---

# Dependency Review

Verify:

- new dependencies justified
- licenses acceptable
- versions supported
- vulnerabilities evaluated
- alternatives considered

Avoid unnecessary dependencies.

---

# Logging & Observability Review

Verify:

- meaningful logs
- sensitive information excluded
- metrics preserved
- tracing maintained
- health checks updated if required

Systems should remain observable after changes.

---

# Pull Request Quality

Every Pull Request should include:

- clear title
- concise description
- implementation summary
- testing performed
- related issues
- migration notes (if applicable)

Large Pull Requests should be split whenever practical.

---

# Approval Criteria

Approve only when:

✓ implementation correct

✓ architecture preserved

✓ security acceptable

✓ performance acceptable

✓ tests passing

✓ documentation updated

✓ review comments resolved

✓ CI successful

---

# Request Changes

Request changes when:

- defects exist
- requirements incomplete
- architecture violated
- security concerns remain
- tests missing
- documentation outdated
- maintainability significantly reduced

Explain the reasoning behind every requested change.

---

# Post-Review

After approval:

- ensure CI passes
- merge using approved strategy
- delete merged branch
- update project documentation if necessary

---

# Reviewer Checklist

Verify:

✓ requirements satisfied

✓ architecture maintained

✓ code readable

✓ naming consistent

✓ tests complete

✓ documentation updated

✓ security reviewed

✓ performance reviewed

✓ dependencies justified

✓ CI successful

---

# Success Criteria

A review succeeds when:

✓ production quality improves

✓ defects are prevented

✓ architecture remains consistent

✓ maintainability increases

✓ engineers learn from feedback

✓ software quality continuously improves

---

# Related Standards

- coding-standards.md
- naming-conventions.md
- architecture-principles.md
- testing-standards.md
- security-standards.md
- documentation-standards.md

---

# Exceptions

Emergency changes may receive expedited review, but they should undergo a full retrospective review after deployment.

Review exceptions require documented justification and approval from the Project Manager.

---

# End Goal

Create a disciplined, consistent, and collaborative review culture that ensures every code change is technically correct, architecturally sound, secure, maintainable, well-tested, and fully documented before becoming part of the production codebase.