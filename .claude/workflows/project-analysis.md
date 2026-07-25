---
name: project-analysis
description: Comprehensive repository discovery and analysis workflow that reconstructs project architecture, technology stack, business context, dependencies, risks, technical debt, and implementation status before any engineering work begins.
version: 1.0
owner: project-manager
---

# Project Analysis Workflow

## Purpose

Understand an existing project before making any modifications.

This workflow reconstructs the complete state of the repository by coordinating architecture, engineering, security, infrastructure, AI, documentation, and product analysis.

No implementation should begin before analysis is complete.

---

# When To Use

Use this workflow when:

- Starting work on an unfamiliar repository
- Joining an existing project
- Beginning a new Claude Code session
- Inheriting a legacy codebase
- Preparing for a major feature
- Performing technical due diligence

Do not use for:

- Small feature implementation
- Bug fixes
- Hotfixes
- Minor documentation updates

---

# Objectives

Understand:

- What the project does
- Why it exists
- How it works
- Current implementation status
- Technology stack
- Architecture
- Dependencies
- Risks
- Technical debt
- Immediate priorities

---

# Workflow Overview

```
Repository
      │
      ▼
Repository Discovery
      │
      ▼
Technology Analysis
      │
      ▼
Architecture Analysis
      │
      ▼
Engineering Analysis
      │
      ▼
Infrastructure Analysis
      │
      ▼
Security Analysis
      │
      ▼
Performance Analysis
      │
      ▼
Documentation Analysis
      │
      ▼
Executive Summary
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

AI

- Data Engineer
- ML Engineer
- Climate AI Engineer
- Satellite Imagery Engineer

Operations

- DevOps Engineer

Quality

- Security Engineer
- Performance Engineer
- QA Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Repository Discovery

Project Manager should identify:

- project purpose
- repository layout
- active modules
- completed modules
- project maturity
- active branch
- recent activity

Deliver a high-level repository summary.

---

# Phase 2 — Technology Analysis

Identify:

Programming Languages

Frameworks

Libraries

Build Systems

Package Managers

Cloud Services

Databases

Development Tools

AI Frameworks

Infrastructure

Document every major technology.

---

# Phase 3 — Architecture Analysis

Software Architect should review:

- system architecture
- module boundaries
- dependency graph
- scalability
- maintainability
- design patterns
- technical debt

Create an architectural overview.

---

# Phase 4 — Backend Analysis

Backend Engineer should inspect:

- services
- controllers
- business logic
- middleware
- authentication
- authorization
- integrations

Document backend responsibilities.

---

# Phase 5 — Frontend Analysis

Frontend Engineer should inspect:

- application structure
- routing
- UI components
- state management
- API integration
- responsiveness
- accessibility

Summarize frontend architecture.

---

# Phase 6 — Database Analysis

Database Engineer should review:

- schema
- migrations
- indexes
- relationships
- constraints
- scalability

Identify database risks.

---

# Phase 7 — API Analysis

API Engineer should inspect:

- endpoints
- versioning
- authentication
- contracts
- documentation
- error handling

Produce an API inventory.

---

# Phase 8 — AI & Data Analysis

If applicable

Data Engineer

Review:

- pipelines
- ETL
- preprocessing

ML Engineer

Review:

- models
- inference
- training
- evaluation

Climate AI Engineer

Review:

- emissions workflows
- prediction pipelines

Satellite Imagery Engineer

Review:

- imagery ingestion
- GIS processing
- raster pipelines

Skip if not applicable.

---

# Phase 9 — Infrastructure Analysis

DevOps Engineer should inspect:

- CI/CD
- deployment
- containers
- cloud services
- monitoring
- logging
- backups

Assess deployment readiness.

---

# Phase 10 — Security Analysis

Security Engineer should review:

- authentication
- authorization
- secrets
- dependencies
- OWASP risks
- infrastructure

Identify critical risks.

---

# Phase 11 — Performance Analysis

Performance Engineer should inspect:

- bottlenecks
- database performance
- frontend performance
- backend performance
- memory
- caching

Recommend optimization opportunities.

---

# Phase 12 — Documentation Analysis

Documentation Engineer should inspect:

README.md

Architecture docs

API docs

Deployment docs

Project Progress

Context

Identify documentation gaps.

---

# Phase 13 — Code Quality Analysis

Code Reviewer should evaluate:

- maintainability
- duplication
- consistency
- complexity
- naming
- standards compliance

Highlight major improvement opportunities.

---

# Phase 14 — Executive Summary

Project Manager should summarize:

Project Purpose

Architecture

Technology Stack

Major Components

Current Status

Technical Debt

Security Risks

Performance Risks

Recommended Priorities

---

# Deliverables

Generate or update:

PROJECT_ANALYSIS.md

ARCHITECTURE_ANALYSIS.md

TECH_STACK.md

API_INVENTORY.md

DATABASE_ANALYSIS.md

SECURITY_ANALYSIS.md

PERFORMANCE_ANALYSIS.md

TECHNICAL_DEBT.md

PROJECT_PROGRESS.md

CONTEXT.md

---

# Success Criteria

Analysis succeeds only if:

✓ Repository understood

✓ Architecture documented

✓ Technology stack identified

✓ Backend analyzed

✓ Frontend analyzed

✓ Database analyzed

✓ APIs documented

✓ AI analyzed (if applicable)

✓ Infrastructure reviewed

✓ Security reviewed

✓ Performance reviewed

✓ Documentation evaluated

✓ Technical debt identified

✓ Executive summary completed

---

# Related Commands

Primary

- /analyze
- /architecture
- /continue

Supporting

- /audit
- /roadmap
- /next

---

# Failure Handling

If repository analysis cannot be completed:

- Record missing information.
- Identify blocked areas.
- Explain assumptions.
- Recommend additional investigation.

Do not fabricate repository details.

---

# End Goal

Provide a complete understanding of the project so every subsequent engineering decision is based on repository evidence, architectural knowledge, and documented project context rather than assumptions.