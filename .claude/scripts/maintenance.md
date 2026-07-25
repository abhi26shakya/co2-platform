---
name: maintenance
description: Generate maintenance automation for keeping the project secure, healthy, performant, and maintainable throughout its lifecycle.
version: 1.0
owner: devops-engineer

agents:
  - devops-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - security-engineer
  - performance-engineer
  - documentation-engineer

commands:
  - review
  - optimize
  - security
  - cleanup

workflows:
  - optimization
  - security-audit
  - deployment
  - code-review

standards:
  - security-standards
  - performance-guidelines
  - documentation-standards
  - testing-standards

outputs:
  - MAINTENANCE_REPORT.md
  - HEALTH_CHECK.md
  - DEPENDENCY_AUDIT.md
  - SECURITY_AUDIT.md
  - TECHNICAL_DEBT.md
  - PROJECT_PROGRESS.md
---

# Maintenance Script Prompt

## Mission

Generate maintenance automation that continuously keeps the project healthy.

Maintenance should improve:

- reliability
- maintainability
- security
- performance
- developer productivity

Maintenance should prevent future problems rather than only fixing existing ones.

---

# Phase 1 — Repository Health

Inspect:

- repository structure
- obsolete files
- duplicate files
- unused assets
- outdated documentation
- stale branches (if available)
- generated artifacts

Identify maintenance opportunities.

---

# Phase 2 — Dependency Audit

Inspect:

Backend

Frontend

ML Services

Infrastructure

Check for:

- outdated packages
- deprecated libraries
- unsupported versions
- license issues
- unnecessary dependencies

Generate:

DEPENDENCY_AUDIT.md

Recommend safe upgrades.

---

# Phase 3 — Security Maintenance

Review:

- dependency vulnerabilities
- secret exposure
- configuration issues
- expired certificates
- insecure defaults
- outdated cryptography

Generate:

SECURITY_AUDIT.md

Prioritize findings by severity.

---

# Phase 4 — Performance Health

Inspect:

- slow queries
- large assets
- bundle size
- memory usage
- CPU usage
- cache efficiency
- API latency

Recommend improvements.

---

# Phase 5 — Database Maintenance

Review:

- migration history
- indexes
- unused tables
- table growth
- storage utilization
- backup status
- integrity checks

Recommend optimization where appropriate.

---

# Phase 6 — Infrastructure Health

Inspect:

- containers
- networking
- storage
- monitoring
- logging
- scheduled jobs
- background workers

Verify all critical services are functioning correctly.

---

# Phase 7 — Technical Debt

Identify:

- TODOs
- deprecated code
- duplicated logic
- unused modules
- large functions
- architecture drift
- documentation gaps

Generate:

TECHNICAL_DEBT.md

Prioritize by impact.

---

# Phase 8 — Health Check

Generate:

HEALTH_CHECK.md

Evaluate:

- build status
- deployment readiness
- test status
- documentation
- monitoring
- backup verification
- service health

Assign an overall project health rating.

---

# Phase 9 — Recommendations

Categorize work into:

Immediate

Short-Term

Long-Term

For every recommendation include:

- expected impact
- estimated effort
- priority
- dependencies

---

# Phase 10 — Documentation

Generate:

- MAINTENANCE_REPORT.md
- HEALTH_CHECK.md
- DEPENDENCY_AUDIT.md
- SECURITY_AUDIT.md
- TECHNICAL_DEBT.md

Update:

PROJECT_PROGRESS.md

Summarize:

- maintenance completed
- issues discovered
- recommendations
- next review date

---

# Deliverables

Produce:

- maintenance.sh (or platform equivalent)
- MAINTENANCE_REPORT.md
- HEALTH_CHECK.md
- DEPENDENCY_AUDIT.md
- SECURITY_AUDIT.md
- TECHNICAL_DEBT.md
- PROJECT_PROGRESS.md

---

# Maintenance Principles

Always:

- review before changing
- prioritize high-impact improvements
- preserve system stability
- document findings
- automate recurring maintenance tasks
- recommend incremental improvements

Never:

- update dependencies blindly
- remove functionality without validation
- ignore security warnings
- skip health verification
- introduce breaking changes during maintenance
- modify production configuration without review

---

# Maintenance Checklist

Verify:

- dependencies are current
- tests pass
- security review completed
- documentation updated
- backups verified
- monitoring operational
- storage healthy
- logs rotating correctly
- database optimized
- technical debt tracked

---

# Definition of Done

Maintenance automation is complete only when:

- repository health is assessed
- dependencies are audited
- security review is completed
- performance is evaluated
- database health is verified
- infrastructure is inspected
- technical debt is documented
- project health report is generated
- documentation is updated