---
name: architecture
description: Analyze the entire software project, understand the architecture, identify risks, and produce a complete technical blueprint before implementation.
version: 1.0
owner: software-architect

agents:
  - project-manager
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - security-engineer
  - performance-engineer
  - qa-engineer
  - documentation-engineer

workflows:
  - project-analysis
  - architecture-review

commands:
  - analyze
  - architecture
  - roadmap

standards:
  - architecture-principles
  - coding-standards
  - security-standards
  - performance-guidelines
  - documentation-standards

outputs:
  - PROJECT_ANALYSIS.md
  - PROJECT_ARCHITECTURE.md
  - TECH_STACK.md
  - API_ANALYSIS.md
  - DATABASE_ANALYSIS.md
  - SECURITY_ANALYSIS.md
  - PERFORMANCE_ANALYSIS.md
  - TESTING_ANALYSIS.md
  - TECHNICAL_DEBT.md
  - RISK_REGISTER.md
  - ROADMAP.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Architecture Analysis Prompt

## Mission

Your objective is to become the project's lead software architect before writing or modifying any code.

Do not implement features until the repository has been completely analyzed.

Base every conclusion on evidence from the repository rather than assumptions.

---

# Phase 1 — Repository Discovery

Inspect the entire repository.

Identify:

- directory structure
- modules
- services
- packages
- build configuration
- deployment configuration
- infrastructure
- documentation
- CI/CD

Summarize the repository organization.

---

# Phase 2 — Technology Stack

Determine:

- programming languages
- frameworks
- frontend stack
- backend stack
- database
- ORM
- package manager
- testing framework
- deployment platform
- cloud services
- infrastructure

Generate **TECH_STACK.md**.

---

# Phase 3 — Architecture Analysis

Map the system.

Document:

- architectural style
- application layers
- module boundaries
- dependency graph
- service interactions
- request lifecycle
- state management
- event flow
- data flow

Generate **PROJECT_ARCHITECTURE.md**.

---

# Phase 4 — Backend Review

Inspect:

- services
- controllers
- middleware
- validation
- business logic
- dependency injection
- logging
- configuration
- background jobs

Identify strengths and weaknesses.

---

# Phase 5 — Frontend Review

Analyze:

- routing
- layouts
- reusable components
- state management
- forms
- API integration
- responsive design
- accessibility

---

# Phase 6 — Database Review

Inspect:

- schema
- migrations
- relationships
- indexes
- constraints
- query patterns

Generate **DATABASE_ANALYSIS.md**.

---

# Phase 7 — API Review

Inspect:

- REST or GraphQL design
- endpoint consistency
- authentication
- authorization
- validation
- versioning
- error handling
- pagination
- rate limiting

Generate **API_ANALYSIS.md**.

---

# Phase 8 — Security Review

Review:

- authentication
- authorization
- secrets management
- encryption
- dependency vulnerabilities
- OWASP Top 10 risks
- permissions
- audit logging

Generate **SECURITY_ANALYSIS.md**.

Classify findings:

- Critical
- High
- Medium
- Low

---

# Phase 9 — Performance Review

Review:

- bundle size
- API latency
- database efficiency
- caching
- memory usage
- CPU usage
- rendering performance

Generate **PERFORMANCE_ANALYSIS.md**.

---

# Phase 10 — Testing Review

Review:

- unit tests
- integration tests
- end-to-end tests
- coverage
- CI testing

Generate **TESTING_ANALYSIS.md**.

---

# Phase 11 — Technical Debt

Identify:

- duplicated code
- dead code
- large files
- architecture violations
- tight coupling
- outdated dependencies

Generate **TECHNICAL_DEBT.md**.

Rank every issue:

- Critical
- High
- Medium
- Low

---

# Phase 12 — Risks

Document:

- technical risks
- scalability risks
- deployment risks
- operational risks
- security risks

Generate **RISK_REGISTER.md**.

---

# Phase 13 — Recommendations

Prioritize improvements for:

- architecture
- security
- performance
- testing
- maintainability
- developer experience
- documentation

Classify:

- Immediate
- Short-term
- Long-term

---

# Phase 14 — Roadmap

Produce a phased implementation roadmap.

Example:

Phase 1 — Foundation

Phase 2 — Core Features

Phase 3 — Infrastructure

Phase 4 — Optimization

Phase 5 — Production Readiness

Generate **ROADMAP.md**.

---

# Deliverables

Produce or update:

- PROJECT_ANALYSIS.md
- PROJECT_ARCHITECTURE.md
- TECH_STACK.md
- DATABASE_ANALYSIS.md
- API_ANALYSIS.md
- SECURITY_ANALYSIS.md
- PERFORMANCE_ANALYSIS.md
- TESTING_ANALYSIS.md
- TECHNICAL_DEBT.md
- RISK_REGISTER.md
- ROADMAP.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Rules

- Never implement code during analysis.
- Base every conclusion on repository evidence.
- Follow project standards and workflows.
- Identify assumptions explicitly.
- Highlight risks before recommendations.
- Prefer maintainability over unnecessary complexity.

---

# Success Criteria

The prompt is complete when:

- The repository structure is fully understood.
- The architecture is documented.
- The technology stack is identified.
- APIs and database are analyzed.
- Security and performance reviews are completed.
- Technical debt is documented.
- Risks are prioritized.
- A phased roadmap is produced.
- Project context is updated for future sessions.