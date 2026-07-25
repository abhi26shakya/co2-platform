---
name: pull-request
description: Standard Pull Request template for documenting implementation details, testing, architecture impact, and review readiness.
version: 1.0
owner: code-reviewer
status: Draft
---

# Pull Request

## PR Information

| Field | Value |
|--------|-------|
| Title | |
| Author | |
| Branch | |
| Target Branch | |
| Related Issue(s) | |
| Feature | |
| Reviewers | |

---

# Summary

Provide a concise overview of:

- what was implemented
- why the change was necessary
- expected outcome

Limit this section to a few paragraphs.

---

# Problem Statement

Describe the problem being solved.

Include:

- existing limitation
- business impact
- user impact
- technical motivation

---

# Solution

Describe the implemented solution.

Include:

- major architectural decisions
- implementation strategy
- important design choices
- trade-offs

---

# Scope of Changes

List the major modifications.

Examples:

- Backend
- Frontend
- API
- Database
- Infrastructure
- Documentation
- Tests

---

# Files Changed

Summarize important file groups.

Example:

```
frontend/
backend/
database/
api/
tests/
docs/
```

Avoid listing every individual file.

---

# Architecture Impact

Describe whether the architecture changed.

Examples:

- New module
- New service
- Refactoring
- No architectural impact

Reference the Design Document if applicable.

---

# Database Changes

If applicable:

- schema changes
- migrations
- indexes
- constraints
- rollback strategy

Otherwise:

```
No database changes.
```

---

# API Changes

If applicable:

- new endpoints
- modified endpoints
- removed endpoints
- request/response changes
- authentication changes
- versioning

Otherwise:

```
No API changes.
```

---

# Security Considerations

Describe:

- authentication
- authorization
- input validation
- secrets
- encryption
- dependency updates

State whether a security review is required.

---

# Performance Impact

Describe expected performance effects.

Examples:

- improved latency
- increased memory usage
- caching introduced
- database optimization

Include benchmark results if available.

---

# Testing

## Unit Tests

- [ ]

---

## Integration Tests

- [ ]

---

## End-to-End Tests

- [ ]

---

## Regression Tests

- [ ]

---

## Performance Testing

- [ ]

---

## Security Testing

- [ ]

---

# Manual Testing

Describe manual verification performed.

Include:

- environment
- test scenarios
- observed results

---

# Screenshots / Evidence

Include screenshots, logs, diagrams, or recordings when helpful.

---

# Deployment Notes

Describe:

- deployment sequence
- configuration changes
- feature flags
- migration order

---

# Rollback Plan

Explain how the change can be safely reverted.

Include:

- rollback steps
- migration rollback
- recovery strategy

---

# Documentation

Verify documentation updates.

- [ ] README
- [ ] API Documentation
- [ ] Architecture Documentation
- [ ] Database Documentation
- [ ] Release Notes
- [ ] Changelog

---

# Dependencies

List:

- new dependencies
- updated dependencies
- removed dependencies

State why each change was necessary.

---

# Risks

Identify:

- technical risks
- operational risks
- security risks
- migration risks

Include mitigation strategies.

---

# Known Limitations

Document any remaining issues or deferred work.

---

# AI-Assisted Development

Was AI used?

- [ ] Yes
- [ ] No

If yes, briefly describe:

- tools used
- areas assisted
- human review performed

---

# Review Checklist

Verify:

- [ ] Requirements implemented
- [ ] Architecture reviewed
- [ ] Coding standards followed
- [ ] Naming conventions followed
- [ ] Tests passing
- [ ] Security reviewed
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] CI passing
- [ ] No known critical issues

---

# Reviewer Checklist

Reviewers should verify:

- [ ] Correctness
- [ ] Architecture
- [ ] Security
- [ ] Performance
- [ ] Testing
- [ ] Documentation
- [ ] Maintainability
- [ ] Dependency policy compliance

---

# Related Documents

- Feature Request
- Design Document
- Architecture Review
- Testing Plan
- API Documentation
- Database Documentation
- Release Notes

---

# Approval

| Reviewer | Status | Comments |
|----------|--------|----------|
| Software Architect | | |
| QA Engineer | | |
| Security Engineer | | |
| Product Manager | | |

---

# Merge Decision

Choose one:

- [ ] Approved
- [ ] Approved with Changes
- [ ] Changes Requested
- [ ] Rejected

---

# Notes

Additional comments, follow-up tasks, or implementation details.