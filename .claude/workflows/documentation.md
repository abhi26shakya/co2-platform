---
name: documentation
description: Comprehensive workflow for creating, reviewing, maintaining, synchronizing, and versioning all project documentation to ensure engineering knowledge remains accurate, discoverable, and aligned with the evolving codebase.
version: 1.0
owner: documentation-engineer
---

# Documentation Workflow

## Purpose

Maintain complete, accurate, and up-to-date documentation across the entire project lifecycle.

Documentation should evolve alongside the codebase and serve as the single source of truth for developers, stakeholders, and AI agents.

No significant engineering change should be considered complete until its documentation is updated.

---

# When To Use

Use this workflow when:

- Implementing new features
- Refactoring code
- Updating APIs
- Modifying architecture
- Releasing new versions
- Completing sprint work
- Updating infrastructure
- Migrating systems
- Conducting engineering audits

Do not use for:

- Temporary notes
- Personal TODOs
- Experimental work that has not been accepted

---

# Objectives

Ensure documentation is:

- Accurate
- Complete
- Consistent
- Discoverable
- Versioned
- Reviewable
- Maintainable

Documentation should explain both *what* the system does and *why* engineering decisions were made.

---

# Workflow Overview

```
Engineering Change
          │
          ▼
Identify Documentation Impact
          │
          ▼
Update Technical Documentation
          │
          ▼
Update User Documentation
          │
          ▼
Architecture Synchronization
          │
          ▼
API Synchronization
          │
          ▼
Review & Validation
          │
          ▼
Version Documentation
          │
          ▼
Documentation Approved
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
- Data Engineer
- ML Engineer
- Climate AI Engineer
- Satellite Imagery Engineer

Infrastructure

- DevOps Engineer

Quality

- QA Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Documentation Impact Assessment

Documentation Engineer should identify:

- affected components
- modified features
- architectural changes
- API changes
- configuration changes
- deployment changes
- user-facing behavior

Determine every document requiring updates.

---

# Phase 2 — Technical Documentation

Update:

Architecture

System Design

Database Design

Data Flow

Infrastructure

Configuration

Engineering Standards

Implementation Notes

Focus on internal engineering knowledge.

---

# Phase 3 — API Documentation

API Engineer should update:

- endpoints
- request schemas
- response schemas
- authentication
- rate limits
- error responses
- examples
- version history

API documentation should always match implementation.

---

# Phase 4 — User Documentation

Update:

README.md

Installation Guide

Quick Start Guide

Configuration Guide

Usage Guide

FAQ

Troubleshooting

Migration Guide

Ensure documentation supports new users.

---

# Phase 5 — Architecture Synchronization

Software Architect should verify:

- diagrams
- module relationships
- dependency graphs
- workflows
- architectural decisions

Remove outdated architecture descriptions.

---

# Phase 6 — Operational Documentation

DevOps Engineer should update:

Deployment Guide

Infrastructure Guide

Environment Variables

Monitoring

Logging

Backup Procedures

Disaster Recovery

Runbooks

Operational documentation should support production maintenance.

---

# Phase 7 — Project Documentation

Project Manager should update:

ROADMAP.md

SPRINT_PLAN.md

PROJECT_PROGRESS.md

CHANGELOG.md

RELEASE_NOTES.md

NEXT_ACTIONS.md

Keep planning artifacts synchronized.

---

# Phase 8 — Knowledge Validation

Code Reviewer and Documentation Engineer should verify:

- documentation accuracy
- consistency
- completeness
- broken references
- obsolete information
- formatting

Every documented statement should reflect the current implementation.

---

# Phase 9 — Version Control

Record:

- document version
- update date
- major changes
- related implementation
- contributors

Maintain documentation history alongside code history.

---

# Phase 10 — AI Context Synchronization

Update AI-specific documentation:

CONTEXT.md

SESSION_SUMMARY.md

PROJECT_ANALYSIS.md

ENGINEERING_DECISIONS.md

ARCHITECTURE_DECISIONS.md

Ensure AI agents have current project knowledge.

---

# Documentation Standards

Documentation should be:

- concise
- technically accurate
- easy to navigate
- searchable
- version-controlled
- implementation-driven

Avoid duplicating information across documents where possible; instead, reference the authoritative source.

---

# Deliverables

Generate or update:

README.md

ARCHITECTURE.md

API.md

DATABASE.md

DEPLOYMENT.md

CHANGELOG.md

RELEASE_NOTES.md

ROADMAP.md

SPRINT_PLAN.md

PROJECT_PROGRESS.md

CONTEXT.md

ENGINEERING_DECISIONS.md

ARCHITECTURE_DECISIONS.md

Merge intelligently with existing documentation.

---

# Documentation Checklist

Verify:

✓ README updated

✓ APIs documented

✓ architecture synchronized

✓ deployment guide updated

✓ configuration documented

✓ changelog updated

✓ roadmap synchronized

✓ AI context updated

✓ no obsolete documentation remains

✓ references validated

---

# Success Criteria

Documentation succeeds only if:

✓ all affected documents updated

✓ implementation matches documentation

✓ architecture synchronized

✓ APIs documented

✓ operational guides updated

✓ planning documents synchronized

✓ AI context refreshed

✓ review completed

---

# Related Commands

Primary

- /document

Supporting

- /feature
- /review
- /deploy
- /release
- /audit

---

# Failure Handling

If documentation cannot be completed:

- identify missing information
- record unresolved documentation gaps
- assign ownership
- block release if critical operational or API documentation is missing

Never consider engineering work complete if essential documentation is outdated or inaccurate.

---

# End Goal

Maintain a living documentation system that accurately reflects the software at every stage of development, enabling engineers, stakeholders, operators, and AI agents to understand, maintain, extend, and safely operate the project through complete, synchronized, and continuously evolving documentation.