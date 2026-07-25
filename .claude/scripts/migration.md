---
name: migration
description: Generate safe, reversible, and production-ready database and infrastructure migration automation.
version: 1.0
owner: database-engineer

agents:
  - database-engineer
  - devops-engineer
  - software-architect
  - backend-engineer
  - security-engineer
  - qa-engineer
  - documentation-engineer

commands:
  - migrate
  - review
  - test

workflows:
  - deployment
  - feature-development
  - architecture-review

standards:
  - architecture-principles
  - security-standards
  - testing-standards
  - documentation-standards

outputs:
  - MIGRATION_PLAN.md
  - MIGRATION_REPORT.md
  - ROLLBACK_PLAN.md
  - SCHEMA_CHANGELOG.md
  - PROJECT_PROGRESS.md
---

# Migration Script Prompt

## Mission

Generate safe, repeatable, and reversible migrations.

Every migration should preserve data integrity, minimize downtime, and support rollback whenever practical.

Never treat migrations as simple schema edits.

---

# Phase 1 — Analyze Current State

Inspect:

- current schema
- migration history
- existing indexes
- constraints
- foreign keys
- seed data
- application compatibility

Determine what will change.

---

# Phase 2 — Plan Migration

Classify migration type:

- schema change
- data migration
- index update
- constraint modification
- configuration change
- infrastructure migration

Estimate:

- downtime
- execution time
- affected records
- compatibility risks

Generate:

MIGRATION_PLAN.md

---

# Phase 3 — Compatibility Check

Verify:

- backward compatibility
- forward compatibility
- API compatibility
- application compatibility
- deployment sequence

Prefer expanding before removing existing structures.

---

# Phase 4 — Backup Strategy

Generate automation for:

- full backup
- incremental backup
- verification
- recovery validation

Backups must be completed before any destructive operation.

---

# Phase 5 — Migration Execution

Generate migration scripts that:

- are idempotent where practical
- validate prerequisites
- fail safely
- log progress
- preserve transactional integrity

Avoid partial migrations.

---

# Phase 6 — Data Validation

Verify:

- record counts
- constraints
- foreign keys
- indexes
- checksums (where appropriate)
- application queries

Confirm no data loss occurred.

---

# Phase 7 — Rollback Plan

Generate rollback automation.

Rollback should restore:

- schema
- data
- indexes
- configuration

Generate:

ROLLBACK_PLAN.md

Clearly define rollback trigger conditions.

---

# Phase 8 — Testing

Run or recommend:

- migration tests
- rollback tests
- integration tests
- performance validation
- application compatibility tests

Ensure production readiness before deployment.

---

# Phase 9 — Documentation

Generate:

- MIGRATION_PLAN.md
- MIGRATION_REPORT.md
- ROLLBACK_PLAN.md
- SCHEMA_CHANGELOG.md

Document:

- changes made
- affected objects
- execution order
- validation performed
- rollback procedure

Update:

PROJECT_PROGRESS.md

---

# Deliverables

Produce:

- migration.sql (or framework equivalent)
- rollback.sql
- backup script
- validation script
- MIGRATION_PLAN.md
- MIGRATION_REPORT.md
- ROLLBACK_PLAN.md
- SCHEMA_CHANGELOG.md

---

# Migration Principles

Always:

- validate before migrating
- back up data first
- preserve data integrity
- make migrations reversible
- test on non-production environments first
- document every schema change

Never:

- modify production data without backup
- perform irreversible operations without approval
- skip validation
- ignore compatibility concerns
- leave migrations undocumented

---

# Definition of Done

Migration automation is complete only when:

- migration plan exists
- backups are verified
- migration executes successfully
- validation passes
- rollback procedure is tested
- schema changelog is updated
- documentation is complete