---
name: documentation
description: Create, maintain, and improve comprehensive technical documentation for architecture, APIs, development, deployment, operations, and maintenance.
version: 1.0
owner: documentation-engineer

agents:
  - documentation-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - api-engineer
  - database-engineer
  - devops-engineer
  - qa-engineer

workflows:
  - documentation
  - architecture-review
  - feature-development
  - release-process

commands:
  - document
  - review
  - feature
  - release

standards:
  - documentation-standards
  - architecture-principles
  - coding-standards
  - testing-standards

outputs:
  - README.md
  - ARCHITECTURE.md
  - API_DOCUMENTATION.md
  - DEVELOPER_GUIDE.md
  - OPERATIONS_GUIDE.md
  - TROUBLESHOOTING.md
  - CHANGELOG.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Documentation Prompt

## Mission

Produce documentation that enables developers, operators, contributors, and stakeholders to understand, build, maintain, and extend the project.

Documentation should evolve with the codebase.

Every significant engineering decision should be recorded.

---

# Phase 1 — Understand the Project

Review:

- Architecture Review
- Feature Specifications
- Database Design
- API Design
- Testing Reports
- Release Notes

Identify:

- project goals
- system architecture
- intended users
- deployment targets
- operational requirements

---

# Phase 2 — Project Overview

Create or update:

README.md

Include:

- project purpose
- key features
- technology stack
- architecture summary
- prerequisites
- installation
- quick start
- project structure
- common commands
- contribution guide
- license
- acknowledgements

README should help a new developer get started quickly.

---

# Phase 3 — Architecture Documentation

Generate:

ARCHITECTURE.md

Document:

- high-level architecture
- major components
- module responsibilities
- service interactions
- data flow
- dependency graph
- design principles
- architectural decisions

Include diagrams where appropriate.

---

# Phase 4 — API Documentation

Generate:

API_DOCUMENTATION.md

Document:

- endpoints
- authentication
- request examples
- response examples
- status codes
- error responses
- pagination
- filtering
- rate limiting
- versioning

Ensure examples are accurate and consistent.

---

# Phase 5 — Developer Guide

Generate:

DEVELOPER_GUIDE.md

Include:

- local setup
- development workflow
- project conventions
- coding standards
- testing workflow
- debugging guidance
- branching strategy
- pull request process

Help new contributors become productive quickly.

---

# Phase 6 — Operations Guide

Generate:

OPERATIONS_GUIDE.md

Document:

- deployment process
- environment variables
- infrastructure overview
- monitoring
- logging
- backup procedures
- recovery process
- scaling guidance
- maintenance tasks

Support reliable production operations.

---

# Phase 7 — Troubleshooting Guide

Generate:

TROUBLESHOOTING.md

Include:

- common errors
- likely causes
- diagnostic steps
- resolutions
- known limitations
- FAQs

Prioritize issues encountered most frequently.

---

# Phase 8 — Change Documentation

Update:

CHANGELOG.md

Document:

- new features
- bug fixes
- performance improvements
- security updates
- breaking changes
- migrations
- deprecated functionality

Follow semantic versioning and changelog conventions.

---

# Phase 9 — Decision Records

Document important engineering decisions.

For each decision include:

- context
- problem
- alternatives considered
- chosen solution
- rationale
- trade-offs
- consequences

Preserve architectural knowledge for future contributors.

---

# Phase 10 — Examples & Tutorials

Provide practical examples for:

- installation
- configuration
- API usage
- common workflows
- deployment
- troubleshooting

Ensure examples are complete and executable where possible.

---

# Phase 11 — Documentation Quality Review

Verify documentation is:

- accurate
- complete
- up-to-date
- technically correct
- internally consistent
- easy to navigate

Remove outdated or duplicated information.

---

# Phase 12 — Maintenance Plan

Recommend how documentation should be maintained.

Define:

- update responsibilities
- review frequency
- versioning strategy
- ownership
- documentation standards

Encourage documentation updates as part of every feature and release.

---

# Deliverables

Produce or update:

- README.md
- ARCHITECTURE.md
- API_DOCUMENTATION.md
- DEVELOPER_GUIDE.md
- OPERATIONS_GUIDE.md
- TROUBLESHOOTING.md
- CHANGELOG.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Documentation Principles

Always:

- Keep documentation synchronized with the codebase.
- Write for the intended audience.
- Use clear, concise language.
- Include examples where they improve understanding.
- Record significant architectural decisions.
- Remove outdated information promptly.

Never:

- Duplicate information unnecessarily.
- Leave placeholder sections without explanation.
- Document behavior that no longer exists.
- Assume readers know project-specific context.
- Let documentation fall behind implementation.

---

# Documentation Checklist

Before completion, verify:

- README is current.
- Architecture documentation reflects the implementation.
- APIs are fully documented.
- Developer setup instructions work.
- Operations procedures are complete.
- Troubleshooting guidance is actionable.
- Changelog is updated.
- Decision records are complete.
- Project progress and context have been refreshed.

---

# Definition of Done

Documentation is complete only when:

- New developers can set up the project using the documentation alone.
- APIs and architecture are accurately described.
- Operational procedures are documented.
- Common issues have troubleshooting guidance.
- Recent changes are reflected in the changelog.
- Documentation passes a quality review.
- Project progress and context are updated.