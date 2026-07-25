---
name: architecture-review
description: Standard template for reviewing and approving the architecture of a proposed feature, system, or major technical change.
version: 1.0
owner: software-architect
status: Draft
---

# Architecture Review

## Document Information

| Field | Value |
|--------|-------|
| Feature / Project | |
| Design Document | |
| Author | |
| Reviewer(s) | |
| Review Date | |
| Status | Draft / In Review / Approved / Rejected |

---

# Executive Summary

Provide a concise summary of:

- proposed solution
- review outcome
- major findings
- overall recommendation

---

# Review Scope

Describe what was reviewed.

Examples:

- System architecture
- Backend
- Frontend
- APIs
- Database
- Infrastructure
- AI/ML components
- Deployment architecture

---

# Architecture Overview

Summarize the proposed architecture.

Include:

- major components
- responsibilities
- interactions
- boundaries

Reference the Design Document where appropriate.

---

# Requirements Alignment

Verify the design satisfies the documented requirements.

## Functional Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| | ✅ / ⚠️ / ❌ | |

---

## Non-Functional Requirements

Evaluate:

- Performance
- Scalability
- Reliability
- Security
- Maintainability
- Accessibility
- Compliance

---

# Architectural Principles Compliance

Evaluate compliance with:

- Separation of Concerns
- Modularity
- Loose Coupling
- High Cohesion
- SOLID Principles
- Dependency Inversion
- Layered Architecture
- Reusability
- Simplicity

| Principle | Status | Notes |
|-----------|--------|-------|
| | ✅ / ⚠️ / ❌ | |

---

# Component Review

## Frontend

Evaluate:

- responsibilities
- maintainability
- scalability
- state management
- routing
- accessibility

Comments:

---

## Backend

Evaluate:

- services
- business logic
- validation
- error handling
- observability

Comments:

---

## Database

Evaluate:

- schema
- indexing
- normalization
- migrations
- integrity

Comments:

---

## APIs

Evaluate:

- REST/GraphQL design
- contracts
- versioning
- authentication
- authorization
- validation

Comments:

---

## Infrastructure

Evaluate:

- deployment
- networking
- scalability
- monitoring
- backup strategy

Comments:

---

## AI / ML (If Applicable)

Evaluate:

- model architecture
- inference pipeline
- reproducibility
- monitoring
- fallback strategy

Comments:

---

# Dependency Analysis

Review:

- internal dependencies
- external dependencies
- third-party services
- vendor lock-in risks
- package health

Document concerns.

---

# Security Review

Evaluate:

- authentication
- authorization
- encryption
- secrets management
- input validation
- audit logging
- least privilege

Risk Level:

Low / Medium / High

---

# Performance Review

Evaluate:

- latency
- throughput
- caching
- query efficiency
- resource usage
- scalability

Document bottlenecks.

---

# Reliability Review

Review:

- retries
- timeouts
- circuit breakers
- graceful degradation
- recovery strategy
- fault isolation

---

# Observability Review

Evaluate:

- logging
- metrics
- tracing
- dashboards
- health checks
- alerting

---

# Maintainability Review

Evaluate:

- readability
- modularity
- documentation
- technical debt
- extensibility

---

# Technical Debt Assessment

Identify:

- intentional debt
- unavoidable compromises
- future improvements

Include mitigation plans.

---

# Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| | Low / Medium / High | Low / Medium / High | |

---

# Alternatives Considered

For each alternative include:

- description
- advantages
- disadvantages
- reason not selected

---

# Recommendations

List recommended improvements before implementation.

Priority:

- Critical
- High
- Medium
- Low

---

# Approval Checklist

Verify:

- [ ] Requirements satisfied
- [ ] Architecture documented
- [ ] Security reviewed
- [ ] Performance acceptable
- [ ] Scalability validated
- [ ] Testing strategy defined
- [ ] Documentation complete
- [ ] Risks acceptable

---

# Decision

Choose one:

- [ ] Approved
- [ ] Approved with Conditions
- [ ] Revisions Required
- [ ] Rejected

---

# Required Actions

List follow-up work before implementation.

---

# Related Documents

- Feature Request
- Design Document
- Testing Plan
- API Documentation
- Database Documentation
- Security Review
- Sprint Plan

---

# Reviewer Comments

## Software Architect

Comments:

---

## Security Engineer

Comments:

---

## Performance Engineer

Comments:

---

## QA Engineer

Comments:

---

## Product Manager

Comments:

---

# Final Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| Software Architect | | | |
| Engineering Lead | | | |
| Product Manager | | | |

---

# Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | | Initial Draft |

---

# Notes

Additional observations, references, or architectural decisions not captured elsewhere.