# Project Context

## Purpose

This document provides a high-level understanding of the project, including its vision, objectives, scope, stakeholders, and current state.

It is intended to give developers and AI agents the necessary context before working on the codebase.

This document should be read before reviewing architecture, implementation details, or specifications.

---

# Project Overview

## Project Name

Emissia (co2-platform)

## Summary

Emissia predicts industrial CO2 emissions from satellite imagery. It is a
three-service monorepo: a Next.js frontend, a FastAPI backend, and an
isolated ML inference service, backed by PostgreSQL, Redis, and local/S3
storage. It exists to make facility-level emissions estimation accessible
from Earth-observation data (Sentinel-5P today) without requiring the user
to run their own model pipeline.

---

# Vision

A production deployment where a real trained model (CNN/U-Net, per
`docs/ml-integration.md`) sits behind the existing `Predictor` protocol,
serving facility-level CO2 estimates with quantified confidence, while the
frontend's map/GIS/reporting experience (already built) becomes the
primary way researchers and operators explore that data. Success is a
system where swapping in a new model version never requires touching the
backend or frontend — the versioned `PredictionResultV1` contract is the
seam that makes that possible.

---

# Objectives

Primary objectives:

- Estimate CO2 emissions per facility from satellite imagery via a stable,
  versioned inference contract.
- Provide an interactive 3D (CesiumJS) map experience for exploring
  emissions, hotspots, and time-series trends.
- Keep the ML integration boundary swappable — the mock predictor today,
  a real model later, with zero backend/frontend changes required.

Secondary objectives:

- Export/reporting workflows (PNG, GeoJSON, CSV, PDF).
- Multi-gas visualization (CO2, CH4, NO2, SO2, CO) and real-time alerts.

---

# Target Users

Identify the primary users.

Examples:

- End users
- Administrators
- Researchers
- Developers
- Organizations

Describe:

- Needs
- Goals
- Pain points

---

# Problem Statement

Describe the problem being solved.

Include:

- Current challenges
- Existing limitations
- Why current solutions are insufficient

---

# Scope

## In Scope

- JWT auth (access + rotating refresh tokens), dashboard, image upload,
  predictions, reports, analytics — all implemented in `backend/`.
- CesiumJS-based interactive maps: multi-gas layers, GIS drawing/export
  tools, timeline playback, compare-predictions modes, real-time alerts —
  all implemented in `frontend/src/features/maps`.
- A mock ML predictor behind a versioned `/predict` contract.

---

## Out of Scope (for now)

- A real trained model (currently mocked, see `docs/ml-integration.md`).
- Celery for heavy reports/preprocessing, S3 storage backend, Google
  OAuth, plant auto-matching on upload (documented post-v1 backlog in
  root `CLAUDE.md`).

---

# Success Criteria

Examples:

- Reliable production deployment
- High availability
- Fast response times
- Positive user adoption
- Scalable architecture

---

# Project Status

Current stage: Development (backend/ML have real test coverage; frontend
feature work has outpaced its test coverage until this session).

Current priorities:

1. Frontend test coverage for the map/prediction critical path (in
   progress — see PROJECT_PROGRESS.md).
2. Fix the frontend lint pipeline (`next lint` / ESLint 9 flat-config
   incompatibility — currently broken on `main`, see KNOWN_ISSUES.md).
3. Real ML model integration (longer-term, needs a chosen model/dataset).

---

# Stakeholders

List key stakeholders.

Examples:

- Product Owner
- Engineering Team
- Researchers
- Users
- Operations Team

---

# High-Level Architecture

Summarize the major components.

Example:

- Frontend
- Backend
- Database
- Machine Learning Service
- External APIs
- Infrastructure

Detailed architecture belongs in `ARCHITECTURE.md`.

---

# Technology Stack

Document the primary technologies.

Examples:

Frontend

- Next.js
- React
- TypeScript

Backend

- FastAPI
- Python

Database

- PostgreSQL

Machine Learning

- PyTorch
- TensorFlow

Infrastructure

- Docker
- GitHub Actions

---

# Related Documentation

Primary references:

- PROJECT_ANALYSIS.md
- ARCHITECTURE.md
- DATABASE.md
- API_REFERENCE.md
- ROADMAP.md

---

# Maintenance Guidelines

Update this document when:

- Project goals change.
- Scope changes.
- Vision changes.
- Major architectural direction changes.
- Stakeholders change.

This document should always provide an accurate high-level understanding of the project.