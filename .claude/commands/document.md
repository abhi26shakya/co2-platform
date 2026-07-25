---
name: document
description: Generate, synchronize, validate, and maintain all project documentation including architecture, APIs, database schema, deployment, testing, AI workflows, developer guides, changelogs, and project memory to ensure documentation always reflects the current state of the codebase.
agents:
  - documentation-engineer
  - project-manager
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - data-engineer
  - ml-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - devops-engineer
  - qa-engineer
  - code-reviewer
---

# Document Command

## Purpose

Maintain complete, accurate, and synchronized project documentation.

Documentation should evolve with the software—not after it.

This command keeps project knowledge organized and discoverable.

---

# Objectives

Answer the following questions:

- Is every major system documented?
- Does documentation match the implementation?
- What documentation is missing?
- What documentation is outdated?
- Are onboarding guides complete?
- Are architecture decisions recorded?
- Is project memory preserved?

---

# General Rules

Always:

- Update documentation with every meaningful change.
- Prefer clarity over completeness when they conflict.
- Preserve historical decisions.
- Keep documentation organized.
- Remove obsolete documentation only when superseded.

Never:

- Leave documentation inconsistent with the code.
- Duplicate information unnecessarily.
- Remove valuable historical context.
- Document speculative functionality as implemented.

---

# Inputs

Review:

- repository structure
- source code
- architecture
- APIs
- database
- deployment
- tests
- roadmap
- project progress
- changelog
- context

---

# Phase 1 – Documentation Audit

Documentation Engineer should identify:

- missing documents
- outdated documents
- duplicate documents
- inconsistent information
- undocumented systems

Produce a documentation gap analysis.

---

# Phase 2 – Project Overview

Update:

README.md

Verify:

- project purpose
- features
- installation
- usage
- prerequisites
- quick start
- directory structure

README should provide a complete entry point.

---

# Phase 3 – Architecture Documentation

Software Architect should update:

ARCHITECTURE.md

Include:

- system overview
- component diagram
- layers
- design principles
- dependency flow
- major decisions
- scalability considerations

---

# Phase 4 – Backend Documentation

Backend Engineer should document:

- services
- business logic
- authentication
- authorization
- middleware
- validation
- background jobs

---

# Phase 5 – Frontend Documentation

Frontend Engineer should document:

- pages
- components
- routing
- state management
- styling
- accessibility
- responsive behavior

---

# Phase 6 – Database Documentation

Database Engineer should update:

DATABASE.md

Document:

- schema
- tables
- relationships
- indexes
- migrations
- constraints
- data flow

---

# Phase 7 – API Documentation

API Engineer should update:

API.md

Document:

- endpoints
- authentication
- request schema
- response schema
- error codes
- examples
- versioning

---

# Phase 8 – AI Documentation

If applicable:

Data Engineer should document:

- data pipelines
- ETL
- preprocessing

ML Engineer should document:

- models
- datasets
- training
- evaluation
- deployment

Climate AI Engineer should document:

- emissions models
- climate workflows
- scientific assumptions

Satellite Imagery Engineer should document:

- imagery sources
- GIS pipeline
- raster processing
- feature extraction

Skip if not applicable.

---

# Phase 9 – Infrastructure Documentation

DevOps Engineer should update:

DEPLOYMENT_GUIDE.md

Include:

- environments
- infrastructure
- CI/CD
- monitoring
- backups
- rollback
- secrets management

---

# Phase 10 – Testing Documentation

QA Engineer should document:

- testing strategy
- test structure
- regression process
- coverage expectations
- testing tools

---

# Phase 11 – Decision Log

Project Manager should update:

DECISIONS.md

Record:

- architectural decisions
- product decisions
- technical trade-offs
- rejected alternatives
- rationale

Maintain chronological order.

---

# Phase 12 – Project Memory

Update:

PROJECT_PROGRESS.md

Include:

- completed work
- current work
- blockers
- remaining tasks
- next priorities

Update:

CONTEXT.md

Include:

- latest repository state
- active branch
- recent decisions
- pending work
- known issues

These files enable seamless continuation.

---

# Phase 13 – Changelog

Update:

CHANGELOG.md

Include:

Added

Changed

Fixed

Removed

Deprecated

Security

Follow semantic versioning where applicable.

---

# Phase 14 – Documentation Validation

Code Reviewer should verify:

- accuracy
- consistency
- completeness
- readability
- organization

Ensure documentation matches implementation.

---

# Documentation Standards

Documentation should be:

- accurate
- concise
- version-aware
- searchable
- maintainable
- actionable

Use examples where appropriate.

---

# Deliverables

Generate or update:

README.md

ARCHITECTURE.md

API.md

DATABASE.md

DEPLOYMENT_GUIDE.md

TESTING.md

AI_DOCUMENTATION.md

CHANGELOG.md

DECISIONS.md

PROJECT_PROGRESS.md

CONTEXT.md

DOCUMENTATION_AUDIT.md

Merge intelligently with existing documentation.

---

# Final Report Format

Produce:

## Executive Summary

## Documentation Audit

## Project Overview

## Architecture Documentation

## Backend Documentation

## Frontend Documentation

## Database Documentation

## API Documentation

## AI Documentation

## Infrastructure Documentation

## Testing Documentation

## Decision Log

## Project Memory

## Changelog Updates

## Outstanding Documentation

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ README updated

✓ architecture documented

✓ backend documented

✓ frontend documented

✓ database documented

✓ APIs documented

✓ AI documented if applicable

✓ deployment documented

✓ testing documented

✓ changelog updated

✓ project progress updated

✓ context updated

✓ documentation validated

---

# Success Criteria

This command succeeds only if:

- Documentation accurately reflects the current codebase.
- Missing documentation has been identified or created.
- Project memory is preserved.
- New contributors can understand the project.
- Technical decisions are recorded.
- Documentation remains synchronized with implementation.

---

# End Goal

Maintain a comprehensive, living documentation system that serves as the authoritative knowledge base for the project, enabling effective collaboration, onboarding, maintenance, and long-term evolution.