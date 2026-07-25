---
name: architecture-review
description: Comprehensive workflow for reviewing, validating, and evolving the software architecture before major implementation, ensuring scalability, maintainability, security, performance, and long-term sustainability.
version: 1.0
owner: software-architect
---

# Architecture Review Workflow

## Purpose

Evaluate and validate the project's architecture before implementing significant changes.

Ensure that new features, refactors, migrations, and infrastructure changes remain aligned with long-term architectural goals.

Architecture decisions should always be evidence-based and documented.

---

# When To Use

Use this workflow when:

- Designing a new system
- Implementing a major feature
- Refactoring core modules
- Introducing new technologies
- Scaling the application
- Changing APIs or databases
- Migrating infrastructure
- Integrating AI or ML systems

Do not use for:

- Small bug fixes
- Minor UI changes
- Documentation updates
- Configuration-only changes

---

# Objectives

Validate:

- System architecture
- Scalability
- Maintainability
- Reliability
- Security
- Performance
- Extensibility
- Technology choices
- Technical debt impact

---

# Workflow Overview

```
Architecture Request
        │
        ▼
Requirements Review
        │
        ▼
Current Architecture Analysis
        │
        ▼
Dependency Analysis
        │
        ▼
Design Evaluation
        │
        ▼
Risk Assessment
        │
        ▼
Architecture Decision
        │
        ▼
Documentation
        │
        ▼
Implementation Approval
```

---

# Participating Agents

Leadership

- Project Manager

Architecture

- Software Architect

Engineering

- Backend Engineer
- Frontend Engineer
- Database Engineer
- API Engineer

Infrastructure

- DevOps Engineer

Quality

- Security Engineer
- Performance Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Requirements Review

Project Manager should determine:

- business objective
- feature scope
- success criteria
- timeline
- stakeholders

Deliverable:

Architecture Review Request

---

# Phase 2 — Current Architecture Analysis

Software Architect should inspect:

- repository structure
- module organization
- service boundaries
- dependency graph
- existing design patterns
- scalability
- maintainability

Determine current architectural health.

---

# Phase 3 — Dependency Analysis

Review:

- internal dependencies
- external libraries
- third-party services
- infrastructure dependencies
- database relationships
- API dependencies

Identify coupling and potential bottlenecks.

---

# Phase 4 — Design Evaluation

Evaluate:

- modularity
- separation of concerns
- abstraction quality
- extensibility
- fault tolerance
- maintainability
- observability

Recommend improvements where necessary.

---

# Phase 5 — Backend Review

Backend Engineer should evaluate:

- service boundaries
- domain logic
- business rules
- background jobs
- authentication
- authorization

Ensure backend design remains clean.

---

# Phase 6 — Frontend Review

Frontend Engineer should review:

- component hierarchy
- routing
- state management
- reusable components
- accessibility
- responsive architecture

Reduce UI complexity.

---

# Phase 7 — Database Review

Database Engineer should evaluate:

- schema quality
- normalization
- indexing
- migrations
- scalability
- data integrity

Recommend schema improvements.

---

# Phase 8 — API Review

API Engineer should evaluate:

- endpoint design
- versioning
- request validation
- response consistency
- error handling
- backward compatibility

Ensure stable API contracts.

---

# Phase 9 — Infrastructure Review

DevOps Engineer should evaluate:

- deployment architecture
- containers
- cloud resources
- networking
- scalability
- monitoring
- disaster recovery

Assess operational readiness.

---

# Phase 10 — Security Review

Security Engineer should review:

- authentication
- authorization
- secrets management
- encryption
- dependency vulnerabilities
- OWASP risks

Critical findings must be resolved before approval.

---

# Phase 11 — Performance Review

Performance Engineer should evaluate:

- request latency
- throughput
- caching
- memory usage
- CPU utilization
- rendering performance
- database performance

Identify scalability risks.

---

# Phase 12 — Architecture Decision

Software Architect should document:

Decision

Alternatives Considered

Trade-offs

Risks

Expected Benefits

Long-Term Impact

Record all significant architectural decisions.

---

# Phase 13 — Documentation

Documentation Engineer should update:

ARCHITECTURE.md

ARCHITECTURE_DECISIONS.md

SYSTEM_OVERVIEW.md

MODULE_DEPENDENCIES.md

PROJECT_PROGRESS.md

CONTEXT.md

Maintain synchronization between implementation and documentation.

---

# Phase 14 — Final Approval

Code Reviewer should verify:

✓ architecture supports requirements

✓ design is maintainable

✓ security reviewed

✓ performance validated

✓ documentation complete

✓ risks accepted

Possible Outcomes:

Approved

Approved with Conditions

Changes Requested

Rejected

---

# Architecture Review Checklist

Validate:

✓ scalability

✓ maintainability

✓ modularity

✓ security

✓ observability

✓ performance

✓ resilience

✓ documentation

✓ dependency management

✓ technical debt impact

---

# Deliverables

Generate or update:

ARCHITECTURE_REVIEW.md

ARCHITECTURE_DECISIONS.md

SYSTEM_OVERVIEW.md

MODULE_DEPENDENCIES.md

RISK_REGISTER.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Architecture review succeeds only if:

✓ requirements are understood

✓ current architecture analyzed

✓ dependencies reviewed

✓ risks identified

✓ trade-offs documented

✓ security approved

✓ performance validated

✓ documentation synchronized

✓ implementation approved

---

# Related Commands

Primary

- /architecture
- /analyze
- /feature

Supporting

- /audit
- /review
- /security
- /optimize

---

# Failure Handling

If architecture approval cannot be granted:

- document blocking issues
- explain architectural risks
- recommend corrective actions
- identify affected components
- postpone implementation until approval

Never approve architecture with unresolved critical risks.

---

# End Goal

Create a scalable, maintainable, secure, and well-documented architecture that supports current requirements while remaining flexible enough to accommodate future growth, evolving business needs, and long-term technical sustainability.