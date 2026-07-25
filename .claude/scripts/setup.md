---
name: setup
description: Generate and validate a complete project setup process for local development, CI, and production environments.
version: 1.0
owner: devops-engineer

agents:
  - devops-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - documentation-engineer

commands:
  - analyze
  - document
  - deploy

workflows:
  - deployment
  - project-analysis

outputs:
  - SETUP_GUIDE.md
  - ENVIRONMENT.md
  - DEPENDENCIES.md
  - PROJECT_PROGRESS.md
---

# Setup Script Prompt

## Mission

Generate everything required to bootstrap a fresh copy of the project.

The setup process should be:

- repeatable
- automated
- documented
- cross-platform whenever practical

A new developer should be able to clone the repository and begin development with minimal manual effort.

---

# Phase 1 — Analyze Repository

Inspect:

- folder structure
- package managers
- backend
- frontend
- database
- ML services
- infrastructure
- environment files

Determine project dependencies.

---

# Phase 2 — Dependency Installation

Identify:

Programming Languages

Package Managers

SDKs

CLIs

System Packages

Database Dependencies

ML Dependencies

Document installation order.

---

# Phase 3 — Environment Configuration

Generate required:

- .env.example
- configuration files
- API keys list
- secrets documentation

Never expose real secrets.

---

# Phase 4 — Database Initialization

Prepare:

- database creation
- migrations
- seed data
- indexes
- permissions

---

# Phase 5 — Service Startup

Determine startup order.

Example:

Database

↓

Backend

↓

ML Service

↓

Frontend

Verify service connectivity.

---

# Phase 6 — Validation

Confirm:

- dependencies installed
- services running
- API reachable
- frontend loads
- database connected

---

# Phase 7 — Documentation

Generate:

- SETUP_GUIDE.md
- ENVIRONMENT.md
- DEPENDENCIES.md

Update:

PROJECT_PROGRESS.md

---

# Deliverables

Produce:

- setup.sh (or platform equivalent)
- SETUP_GUIDE.md
- ENVIRONMENT.md
- DEPENDENCIES.md

---

# Principles

Always:

- automate repetitive steps
- verify installations
- document every dependency
- support clean installs
- fail with meaningful errors

Never:

- hardcode secrets
- assume software is pre-installed
- skip validation
- modify unrelated files

---

# Definition of Done

Setup is complete only when:

- a fresh machine can run the project successfully
- dependencies are documented
- environment variables are configured
- services start successfully
- validation passes
- setup documentation is complete