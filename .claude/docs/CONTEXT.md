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
- Provide an interactive 3D map experience for exploring emissions,
  hotspots, and time-series trends. **Updated 2026-08-13**: this is now a
  single MapLibre GL engine driving both 2D and 3D (native globe
  projection) — CesiumJS was retired (see `KNOWN_ISSUES.md` KI-004) after
  it was found to reliably crash the browser tab on the deployed Vercel
  build; MapLibre's globe mode has since been verified crash-free on that
  same production deployment.
- Keep the ML integration boundary swappable — real model integration
  (OCO-3 + NO2/SO2 CNN) has landed behind the `Predictor` protocol; the
  boundary itself stays swappable for future model versions with zero
  backend/frontend changes required.

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
- MapLibre GL-based interactive maps (2D and 3D globe from one engine,
  post-Cesium-retirement): multi-gas layers, GIS drawing/export tools,
  timeline playback, compare-predictions modes, real-time alerts — all
  implemented in `frontend/src/features/maps`.
- Real ML inference (OCO-3 + NO2/SO2 CNN) behind the versioned `/predict`
  contract, alongside the original mock predictor for local dev/testing.

---

## Out of Scope (for now)

- Celery for heavy reports/preprocessing, S3 storage backend, plant
  auto-matching on upload (documented post-v1 backlog in root
  `CLAUDE.md`). **Updated 2026-08-13**: a real trained model and Google
  OAuth account linking have both since landed — no longer out of scope.

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

Current stage: Development, MVP feature-complete (~70% per
`AUDIT_REPORT.md`'s own estimate). Backend/ML have real, CI-gated test
coverage; frontend has 87 passing Vitest tests but no E2E suite yet.

Current priorities (updated 2026-08-13, see `NEXT_ACTIONS.md`):

1. Harden container/dependency security posture — non-root `USER` for
   `backend`/`ml-service` Dockerfiles (frontend already has this), plus
   CI dependency scanning (`pip-audit`/`npm audit`) and a Dependabot
   config. See `AUDIT_REPORT.md` findings I2/I3, both still open.
2. Wire `CO2_REDIS_URL` for the backend in `docker-compose.yml`'s `full`
   profile so the existing Redis container is actually used.
3. Add a CI coverage gate and a CD pipeline, once a backend/ml-service
   hosting target is chosen (larger effort, deliberately deferred).

Resolved since the previous version of this document: the frontend lint
pipeline (fixed), the frontend Docker image (was dev-mode, now a real
multi-stage build), and real ML model integration (OCO-3 + NO2/SO2 CNN,
landed).

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