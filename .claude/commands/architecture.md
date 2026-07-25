---
name: architecture
description: Analyze, validate, and improve the software architecture of the project. Review system design, module boundaries, scalability, maintainability, dependency relationships, and produce architectural recommendations without modifying production code unless explicitly requested.
agents:
  - software-architect
  - project-manager
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - security-engineer
  - performance-engineer
  - devops-engineer
  - documentation-engineer
---

# Architecture Command

## Purpose

Perform a comprehensive architectural review of the repository.

Evaluate whether the existing architecture supports the current and future goals of the project.

Understand the architecture before recommending changes.

Unless explicitly requested, do not modify production code.

---

# Objectives

This command should answer:

- What architectural pattern is used?
- Is the architecture appropriate?
- Are responsibilities clearly separated?
- Are modules loosely coupled?
- Is the system scalable?
- Is it maintainable?
- What architectural risks exist?
- What improvements are recommended?

---

# General Rules

Always:

- Analyze before recommending.
- Respect existing design decisions.
- Preserve working systems.
- Support incremental improvements.
- Document every recommendation.

Never:

- Recommend rewrites without justification.
- Break backward compatibility without explanation.
- Ignore technical constraints.

---

# Architectural Discovery

Inspect:

- repository structure
- application layers
- modules
- packages
- services
- shared libraries
- infrastructure
- external integrations

Document relationships between components.

---

# System Architecture

Determine the architectural style.

Examples:

- Monolith
- Modular Monolith
- Microservices
- Serverless
- Event-Driven
- Layered Architecture
- Clean Architecture
- Hexagonal Architecture
- MVC
- MVVM

Explain why the current architecture works or where it falls short.

---

# Layer Analysis

Review:

Presentation Layer

Business Logic Layer

Application Layer

Infrastructure Layer

Persistence Layer

Data Layer

API Layer

AI Layer

Identify responsibilities for each layer.

---

# Dependency Analysis

Inspect dependencies between modules.

Evaluate:

- coupling
- cohesion
- circular dependencies
- dependency direction
- shared utilities

Recommend improvements.

---

# Module Analysis

For each major module evaluate:

- purpose
- ownership
- responsibilities
- dependencies
- complexity
- reusability

Identify oversized or overly complex modules.

---

# Backend Architecture

Evaluate:

- service boundaries
- controllers
- middleware
- domain logic
- validation
- authentication
- authorization

Ensure business logic is separated from infrastructure.

---

# Frontend Architecture

Review:

- routing
- layouts
- reusable components
- state management
- UI composition
- feature organization

Promote component reusability.

---

# Database Architecture

Review:

- schema organization
- normalization
- indexing
- migration strategy
- relationships

Recommend improvements where appropriate.

---

# API Architecture

Review:

- endpoint organization
- versioning
- consistency
- request validation
- response design

Document API boundaries.

---

# AI Architecture

Review:

- model organization
- inference pipelines
- training workflows
- feature pipelines
- experiment tracking

Ensure AI systems are modular.

---

# Climate AI Architecture

Review:

- environmental workflows
- emissions modeling
- climate datasets
- feature engineering
- scientific assumptions

Ensure reproducibility.

---

# Satellite Architecture

Review:

- imagery ingestion
- preprocessing
- GIS workflows
- feature extraction
- raster pipelines

Verify geospatial workflow separation.

---

# Security Architecture

Evaluate:

- authentication
- authorization
- secrets management
- trust boundaries
- attack surfaces

Identify architectural vulnerabilities.

---

# Performance Architecture

Review:

- caching
- concurrency
- asynchronous processing
- scalability
- bottlenecks

Recommend architectural optimizations.

---

# DevOps Architecture

Inspect:

- deployment topology
- CI/CD
- environments
- infrastructure
- monitoring
- logging

Assess operational readiness.

---

# Documentation Review

Verify:

- architecture documentation
- diagrams
- ADRs (Architecture Decision Records)
- module documentation

Identify missing documentation.

---

# Architectural Risks

Identify:

- single points of failure
- tight coupling
- scalability limits
- operational risks
- maintainability concerns

Rank risks by severity.

---

# Strengths

Highlight:

- modularity
- scalability
- maintainability
- reusable components
- clean boundaries
- good documentation

---

# Weaknesses

Highlight:

- code smells
- architectural debt
- duplicated responsibilities
- poor separation of concerns
- inconsistent patterns

---

# Recommendations

Separate recommendations into:

Immediate

Short-term

Medium-term

Long-term

Provide justification for every recommendation.

---

# Deliverables

Generate or update:

ARCHITECTURE_ANALYSIS.md

SYSTEM_OVERVIEW.md

MODULE_DEPENDENCIES.md

ARCHITECTURE_DECISIONS.md

ARCHITECTURE_DIAGRAM.md

TECHNICAL_DEBT.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge updates intelligently without removing existing useful information.

---

# Final Report Format

Produce:

## Executive Summary

## Current Architecture

## Repository Structure

## Architectural Style

## Layer Analysis

## Module Analysis

## Dependency Analysis

## Backend

## Frontend

## Database

## APIs

## AI Systems

## Climate AI

## Satellite Imagery

## Security

## Performance

## DevOps

## Risks

## Strengths

## Weaknesses

## Recommendations

## Migration Opportunities

## Suggested Next Steps

---

# Quality Checklist

Before finishing verify:

✓ architecture identified

✓ layers documented

✓ dependencies reviewed

✓ modules analyzed

✓ backend reviewed

✓ frontend reviewed

✓ database reviewed

✓ APIs reviewed

✓ AI systems reviewed

✓ security reviewed

✓ performance reviewed

✓ DevOps reviewed

✓ risks documented

✓ recommendations prioritized

✓ documentation updated

✓ context updated

✓ project progress updated

---

# Success Criteria

This command succeeds only if:

- The architecture is fully understood and documented.
- Module responsibilities are clearly defined.
- Dependency relationships are identified.
- Architectural risks are prioritized.
- Actionable recommendations are provided.
- Documentation reflects the current architecture.
- No production code is modified unless explicitly requested.

---

# End Goal

Create a complete architectural understanding of the project that enables future development, scaling, refactoring, and maintenance while preserving system stability and engineering best practices.