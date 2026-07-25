---
name: documentation-standards
description: Defines the documentation principles, structure, quality requirements, review process, and maintenance practices for all software projects built using this engineering framework.
version: 1.0
owner: documentation-engineer
---

# Documentation Standards

## Purpose

Documentation is an integral part of software engineering.

Well-maintained documentation improves collaboration, accelerates onboarding, preserves architectural knowledge, supports maintenance, and enables long-term project sustainability.

Documentation should evolve alongside the software—not after it.

---

# Documentation Philosophy

Documentation should be:

- Accurate
- Complete
- Concise
- Maintainable
- Discoverable
- Versioned
- Continuously updated

Documentation should answer both **what** the system does and **why** it was designed that way.

---

# Guiding Principles

Documentation should:

- explain intent
- remain synchronized with implementation
- avoid duplication
- prioritize clarity
- support future contributors
- document decisions rather than assumptions

If documentation becomes outdated, it loses value.

---

# Documentation Hierarchy

Project documentation should generally include:

```
README.md

ROADMAP.md

ARCHITECTURE.md

API.md

DATABASE.md

DEPLOYMENT.md

SECURITY.md

CONTRIBUTING.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md
```

Additional documents may be added when justified.

---

# README

Every repository should include a comprehensive README.

It should contain:

- project overview
- purpose
- architecture summary
- installation
- configuration
- usage
- development workflow
- testing
- deployment
- contribution guidelines
- license

The README should be sufficient for a new contributor to get started.

---

# Architecture Documentation

Architecture documentation should describe:

- system overview
- module boundaries
- design decisions
- technology choices
- dependencies
- scalability considerations
- security considerations

Focus on explaining *why* decisions were made.

---

# API Documentation

API documentation should include:

- endpoints
- request formats
- response formats
- authentication
- authorization
- validation rules
- error responses
- examples
- version information

Public APIs should remain fully documented.

---

# Database Documentation

Document:

- schema
- relationships
- migrations
- constraints
- indexes
- ownership
- data lifecycle

Schema changes should update documentation.

---

# Deployment Documentation

Deployment guides should include:

- prerequisites
- environments
- build steps
- deployment process
- rollback procedures
- monitoring
- troubleshooting

Deployment instructions should be reproducible.

---

# Security Documentation

Document:

- authentication model
- authorization model
- secrets management
- encryption
- compliance requirements
- security assumptions
- incident response process

Avoid exposing confidential implementation details.

---

# Architecture Decision Records (ADRs)

Major architectural decisions should be documented.

Each ADR should include:

- decision
- context
- alternatives considered
- rationale
- consequences
- date
- status

Architectural knowledge should not exist only in discussions.

---

# Code Comments

Comments should explain:

- intent
- reasoning
- non-obvious behavior
- important constraints

Avoid comments that simply restate the code.

Example:

Good:

```text
Retry is limited to prevent duplicate payment processing.
```

Poor:

```text
Increment counter.
```

Code should remain readable without excessive comments.

---

# Diagrams

Use diagrams when they improve understanding.

Examples:

- system architecture
- data flow
- sequence diagrams
- deployment architecture
- infrastructure topology

Diagrams should remain synchronized with implementation.

---

# Changelog

Maintain a changelog describing:

- features
- fixes
- improvements
- breaking changes
- release versions

Entries should correspond with released software.

---

# Project Progress

Track:

- completed work
- current work
- remaining work
- risks
- milestones
- blockers

Progress documentation supports planning and project continuity.

---

# Context Documentation

Maintain context documents describing:

- current architecture
- project status
- assumptions
- pending decisions
- future priorities

Context enables efficient continuation across development sessions.

---

# Documentation Reviews

Documentation should be reviewed for:

- accuracy
- completeness
- clarity
- consistency
- formatting
- technical correctness

Documentation reviews should be part of the normal review process.

---

# Versioning

Documentation should evolve with software versions.

Significant documentation updates should accompany:

- major releases
- architectural changes
- API changes
- database changes
- deployment changes

Version history should remain traceable.

---

# AI-Generated Documentation

AI-generated documentation should:

- be technically verified
- avoid fabricated information
- accurately reflect implementation
- follow project terminology
- undergo human review

AI assists documentation but does not replace engineering judgment.

---

# Documentation Ownership

Every significant document should identify:

- owner
- purpose
- version
- last major update (optional)
- related documents

Ownership improves long-term maintenance.

---

# Documentation Checklist

Verify:

✓ documentation accurate

✓ implementation synchronized

✓ architecture updated

✓ API documented

✓ deployment documented

✓ changelog updated

✓ diagrams current

✓ terminology consistent

✓ review completed

---

# Success Criteria

Documentation succeeds when:

✓ new contributors onboard quickly

✓ architectural decisions are preserved

✓ implementation is understandable

✓ releases are well documented

✓ maintenance becomes easier

✓ AI agents have reliable project context

---

# Related Standards

- coding-standards.md
- architecture-principles.md
- testing-standards.md
- code-review-checklist.md
- commit-conventions.md

---

# Exceptions

Documentation exceptions require documented justification.

Temporary omissions should be tracked and resolved before the next release whenever practical.

---

# End Goal

Create comprehensive, accurate, and maintainable documentation that preserves engineering knowledge, supports collaboration, accelerates onboarding, enables AI-assisted development, and ensures every important architectural decision, workflow, interface, and operational procedure remains understandable throughout the project's lifetime.