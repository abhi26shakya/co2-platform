---
name: analyze
description: Perform a comprehensive repository analysis to understand the entire project before making any modifications. Analyze architecture, codebase, technologies, dependencies, AI components, infrastructure, documentation, technical debt, and produce detailed engineering reports.
agents:
  - project-manager
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - data-engineer
  - ml-engineer
  - research-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - security-engineer
  - performance-engineer
  - devops-engineer
  - documentation-engineer
---

# Analyze Command

## Purpose

Perform a complete engineering analysis of the repository before implementing any new features or making architectural decisions.

This command is read-first.

It should understand the project before proposing changes.

Never modify production code unless explicitly requested.

---

# Objectives

The analysis should answer:

- What does this project do?
- How is it organized?
- Which technologies are used?
- What are the major architectural components?
- How do components interact?
- What are the strengths?
- What are the weaknesses?
- What technical debt exists?
- What security issues exist?
- What performance bottlenecks exist?
- What documentation is missing?
- What should be built next?

---

# General Rules

Always:

- Read before editing.
- Understand before suggesting.
- Verify assumptions.
- Follow architectural boundaries.
- Preserve existing functionality.
- Document findings.
- Cite evidence from the repository whenever possible.

Never:

- Delete files.
- Rewrite architecture.
- Generate speculative conclusions.
- Ignore documentation.
- Skip hidden directories that may contain configuration.

---

# Repository Discovery

Inspect the complete repository.

Identify:

- folder structure
- source directories
- documentation
- configuration
- assets
- scripts
- infrastructure
- tests
- examples
- build outputs

Ignore generated artifacts unless they are required for understanding.

---

# Technology Stack Analysis

Identify all technologies used.

Examples include:

Programming Languages

- TypeScript
- JavaScript
- Python
- Go
- Rust
- Java
- C++
- Swift

Frontend

- React
- Next.js
- Vue
- Angular
- Svelte

Backend

- Node.js
- Express
- FastAPI
- Django
- Flask
- Spring Boot

Database

- PostgreSQL
- MySQL
- SQLite
- MongoDB
- Redis

AI

- PyTorch
- TensorFlow
- Scikit-learn
- HuggingFace

Cloud

- AWS
- Azure
- GCP
- Railway
- Vercel

Document versions whenever possible.

---

# Repository Structure

Generate a high-level tree.

Explain the purpose of each major folder.

Example:

src/
app/
api/
components/
models/
lib/
scripts/
docs/

Describe ownership and responsibilities.

---

# Architecture Review

Software Architect should determine:

- architecture style
- layering
- modularity
- coupling
- scalability
- dependency flow
- separation of concerns

Identify architectural strengths.

Identify architectural weaknesses.

---

# Backend Analysis

Backend Engineer should inspect:

- routes
- services
- controllers
- middleware
- validation
- authentication
- authorization
- integrations
- error handling

Identify missing best practices.

---

# Frontend Analysis

Frontend Engineer should inspect:

- pages
- layouts
- routing
- components
- state management
- styling
- responsiveness
- accessibility

Evaluate maintainability.

---

# Database Analysis

Database Engineer should inspect:

- schema
- migrations
- relationships
- indexes
- constraints
- normalization
- query performance

Recommend improvements.

---

# API Analysis

API Engineer should inspect:

- REST endpoints
- GraphQL schema
- versioning
- request validation
- response consistency
- documentation

Produce API inventory.

---

# Data Engineering Analysis

Inspect:

- ingestion
- preprocessing
- ETL
- validation
- feature engineering
- storage

Identify pipeline improvements.

---

# Machine Learning Analysis

Inspect:

- models
- training
- inference
- evaluation
- deployment
- monitoring

Identify production readiness.

---

# Research Analysis

Research Engineer should inspect:

- papers
- benchmarks
- reproducibility
- experiment tracking
- datasets

Document scientific methodology.

---

# Climate AI Analysis

Inspect:

- emissions estimation
- climate datasets
- environmental models
- carbon accounting
- environmental assumptions

Validate scientific integrity.

---

# Satellite Imagery Analysis

Inspect:

- raster processing
- GIS workflows
- imagery preprocessing
- cloud masking
- segmentation
- spectral indices

Document Earth observation workflow.

---

# Security Analysis

Security Engineer should review:

- authentication
- authorization
- secrets
- dependencies
- vulnerabilities
- OWASP risks

Prioritize findings by severity.

---

# Performance Analysis

Performance Engineer should inspect:

- CPU usage
- memory
- rendering
- API latency
- database performance
- caching
- bundle size

Recommend measurable improvements.

---

# DevOps Analysis

Inspect:

- Docker
- CI/CD
- deployment
- environments
- secrets
- infrastructure
- monitoring
- logging

Evaluate production readiness.

---

# Documentation Analysis

Documentation Engineer should inspect:

README

Architecture docs

API docs

Deployment docs

Environment setup

Contribution guide

Missing documentation

Rate documentation quality.

---

# Dependency Analysis

Inspect:

package.json

requirements.txt

Cargo.toml

pom.xml

go.mod

etc.

Identify:

- outdated packages
- duplicate libraries
- security issues
- unused dependencies

---

# Configuration Analysis

Inspect:

.env.example

tsconfig

eslint

prettier

docker-compose

github workflows

Build configuration

Document important settings.

---

# Testing Analysis

Inspect:

- unit tests
- integration tests
- E2E tests
- coverage
- testing frameworks

Report testing maturity.

---

# Code Quality

Evaluate:

- naming
- readability
- duplication
- complexity
- consistency

Estimate maintainability.

---

# Technical Debt

Document:

- shortcuts
- TODOs
- duplicated logic
- obsolete code
- dead code
- architectural debt

Rank by priority.

---

# Risks

Identify:

Technical risks

Security risks

Scalability risks

Operational risks

Business risks

Likelihood

Impact

Mitigation

---

# Strengths

Highlight:

- good architecture
- strong documentation
- testing
- modularity
- performance
- maintainability

---

# Weaknesses

Highlight:

- missing tests
- inconsistent patterns
- weak documentation
- scalability concerns
- security concerns

---

# Recommendations

Provide:

Immediate improvements

Short-term improvements

Medium-term improvements

Long-term improvements

Separate mandatory fixes from optional enhancements.

---

# Priority Matrix

Classify every recommendation.

Critical

High

Medium

Low

Explain reasoning.

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

DOCUMENTATION_STATUS.md

TECHNICAL_DEBT.md

PROJECT_PROGRESS.md

CONTEXT.md

Do not overwrite useful information.

Merge intelligently.

---

# Final Report Format

Produce:

## Executive Summary

## Repository Overview

## Folder Structure

## Technology Stack

## Architecture

## Backend

## Frontend

## Database

## APIs

## Data Engineering

## Machine Learning

## Climate AI

## Satellite Imagery

## Security

## Performance

## DevOps

## Documentation

## Testing

## Technical Debt

## Risks

## Recommendations

## Priority Matrix

## Suggested Next Steps

---

# Quality Checklist

Before finishing verify:

✓ repository fully explored

✓ architecture understood

✓ technologies identified

✓ backend analyzed

✓ frontend analyzed

✓ database reviewed

✓ APIs documented

✓ ML reviewed

✓ Climate AI reviewed

✓ satellite workflows reviewed

✓ security assessed

✓ performance assessed

✓ documentation reviewed

✓ technical debt documented

✓ recommendations prioritized

✓ reports generated

✓ context updated

✓ project progress updated

---

# Success Criteria

This command succeeds only if:

- A new engineer can understand the repository without manually exploring it.
- The architecture is clearly documented.
- Every major subsystem has been analyzed.
- Risks and technical debt are identified.
- Actionable recommendations are prioritized.
- Documentation is updated.
- No production code has been modified unless explicitly requested.

---

# End Goal

Create a comprehensive, evidence-based understanding of the entire repository that serves as the foundation for all future development, reviews, optimization, testing, and release activities. Every subsequent command should be able to rely on the outputs of `/analyze` instead of rediscovering the project structure.