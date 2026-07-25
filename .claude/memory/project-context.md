# Project Context

## Purpose

This document serves as the primary long-term memory for the project.

It provides the essential context required for Claude Code and human contributors to understand the project before making architectural, implementation, or product decisions.

This file should always reflect the current state of the project.

---

# Project Overview

## Project Name

CO₂ Platform

---

## Vision

Build an intelligent platform that uses satellite imagery, geospatial data, and artificial intelligence to estimate, analyze, visualize, and monitor carbon dioxide (CO₂) emissions from industrial facilities.

The platform should provide reliable, scalable, and explainable emission estimates while supporting researchers, organizations, policymakers, and environmental monitoring initiatives.

---

## Primary Objectives

The project aims to:

- Estimate industrial CO₂ emissions from satellite imagery.
- Process large-scale geospatial datasets efficiently.
- Train and deploy machine learning models for emission prediction.
- Provide interactive visualizations and dashboards.
- Generate reports and analytical insights.
- Support future research and experimentation.
- Maintain a modular and scalable architecture.

---

# Current Development Stage

Current status should always be updated.

Suggested values:

- Planning
- Architecture Design
- Active Development
- Feature Complete
- Testing
- Production
- Maintenance

Current Status:

> Architecture Design

---

# Core Features

The platform is expected to include:

- Satellite imagery ingestion
- Geospatial preprocessing
- CO₂ estimation engine
- Machine learning pipeline
- Interactive maps
- Analytics dashboard
- User authentication
- Report generation
- Data export
- Monitoring and logging

---

# Technology Stack

Update this section whenever technologies change.

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

---

## Backend

- Python
- FastAPI

---

## Machine Learning

- PyTorch
- Scikit-learn
- XGBoost (if applicable)

---

## Geospatial

- Rasterio
- GeoPandas
- GDAL
- Shapely

---

## Database

- PostgreSQL
- PostGIS

---

## Infrastructure

- Docker
- GitHub Actions
- Railway / Cloud Platform
- Object Storage (future)

---

# Repository Structure

High-level project organization.

Example:

```text
frontend/
backend/
ml/
data/
docs/
.claude/
```

Update this section whenever the repository structure changes.

---

# System Architecture

The project follows a modular architecture.

Major components:

1. Data Ingestion
2. Data Processing
3. Machine Learning
4. API Layer
5. Frontend
6. Database
7. Deployment
8. Monitoring

Each component should evolve independently while maintaining well-defined interfaces.

---

# Engineering Principles

Development should prioritize:

- correctness
- modularity
- scalability
- maintainability
- security
- performance
- documentation
- reproducibility

Every feature should be:

- tested
- documented
- reviewed
- production-ready

---

# Coding Standards

Follow the standards defined in:

- `.claude/standards/`
- `.claude/workflows/`
- `.claude/commands/`

Avoid introducing project-specific conventions that conflict with established standards.

---

# Development Workflow

General workflow:

Idea

↓

Specification

↓

Architecture

↓

Implementation

↓

Testing

↓

Review

↓

Documentation

↓

Deployment

↓

Memory Update

Every completed task should update the relevant memory files.

---

# Project Priorities

Priority order:

1. Correctness
2. Reliability
3. Security
4. Maintainability
5. Performance
6. Developer Experience
7. Feature Velocity

When trade-offs are required, higher priorities take precedence.

---

# Assumptions

Current assumptions include:

- Satellite imagery is the primary input source.
- CO₂ estimation models will improve iteratively.
- AI models should remain explainable where practical.
- Large datasets require efficient preprocessing.
- The platform should support future cloud deployment.

Review assumptions periodically as the project evolves.

---

# Success Criteria

The project will be considered successful if it:

- produces reliable emission estimates
- scales to large datasets
- maintains clean architecture
- supports future research
- provides an intuitive user experience
- remains easy to maintain and extend

---

# Related Memory Files

This document works together with:

- session-summary.md
- architecture-decisions.md
- pending-work.md
- completed-features.md
- project-history.md
- known-limitations.md
- lessons-learned.md
- future-ideas.md

---

# Maintenance Rules

Update this document when:

- project goals change
- architecture changes
- technology stack changes
- repository structure changes
- development stage changes
- engineering priorities change

Do not use this file for temporary notes or session-specific information.

Long-term project knowledge belongs here.