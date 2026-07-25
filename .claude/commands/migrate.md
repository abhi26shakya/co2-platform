---
name: migrate
description: Plan, validate, execute, verify, and document safe migrations across databases, APIs, frameworks, infrastructure, cloud platforms, AI models, storage systems, and application architecture while minimizing downtime, preserving data integrity, and ensuring rollback capability.
agents:
  - project-manager
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - data-engineer
  - ml-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - devops-engineer
  - security-engineer
  - performance-engineer
  - qa-engineer
  - documentation-engineer
  - code-reviewer
---

# Migrate Command

## Purpose

Safely migrate systems, technologies, data, and infrastructure while preserving functionality, data integrity, security, and availability.

Migration should be planned, validated, reversible, and thoroughly documented.

---

# Objectives

Answer the following questions:

- What is being migrated?
- Why is the migration necessary?
- What systems are affected?
- What risks exist?
- Can the migration be rolled back?
- Has the migration been validated?
- Is production ready?

---

# General Rules

Always:

- Create a migration plan before implementation.
- Validate dependencies.
- Backup critical data.
- Test migrations in a non-production environment first.
- Prepare rollback procedures.
- Document every migration.

Never:

- Execute irreversible migrations without approval.
- Remove compatibility prematurely.
- Ignore backward compatibility when required.
- Skip verification after migration.

---

# Inputs

Review:

- architecture
- deployment configuration
- infrastructure
- database schema
- API contracts
- dependency manifests
- roadmap
- project documentation
- previous migrations

---

# Supported Migration Types

Support migrations involving:

- database schema
- data transformation
- API versioning
- framework upgrades
- dependency upgrades
- cloud migration
- infrastructure migration
- container migration
- storage migration
- authentication systems
- AI models
- ML pipelines
- satellite processing workflows

Determine migration scope before execution.

---

# Phase 1 – Migration Assessment

Project Manager should identify:

- migration objective
- business justification
- affected users
- affected systems
- migration window
- downtime requirements

Produce a migration summary.

---

# Phase 2 – Architecture Review

Software Architect should evaluate:

- architectural impact
- compatibility
- dependencies
- integration risks
- scalability

Recommend the safest migration strategy.

---

# Phase 3 – Database Migration

Database Engineer should:

- review schema changes
- validate migrations
- backup data
- verify constraints
- verify indexes
- test rollback
- validate integrity

Never risk production data without backups.

---

# Phase 4 – Backend Migration

Backend Engineer should review:

- business logic
- service compatibility
- feature flags
- configuration
- dependency injection
- version compatibility

Maintain compatibility wherever practical.

---

# Phase 5 – Frontend Migration

Frontend Engineer should verify:

- routing
- UI compatibility
- browser compatibility
- dependency upgrades
- state management
- build configuration

Prevent user-facing regressions.

---

# Phase 6 – API Migration

API Engineer should verify:

- versioning
- deprecation strategy
- backward compatibility
- request validation
- response contracts
- client compatibility

Prefer phased API migrations.

---

# Phase 7 – Data & AI Migration

Data Engineer should verify:

- ETL compatibility
- data transformation
- schema evolution
- validation

ML Engineer should verify:

- model migration
- checkpoint compatibility
- inference consistency
- deployment strategy

Climate AI Engineer should verify:

- scientific validity maintained

Satellite Imagery Engineer should verify:

- imagery pipeline compatibility
- GIS data integrity

Skip if not applicable.

---

# Phase 8 – Infrastructure Migration

DevOps Engineer should verify:

- infrastructure compatibility
- CI/CD updates
- containers
- networking
- storage
- monitoring
- backups

Migration should remain observable.

---

# Phase 9 – Security Review

Security Engineer should verify:

- permissions preserved
- secrets protected
- encryption maintained
- authentication unaffected
- authorization preserved

Migration must not weaken security.

---

# Phase 10 – Performance Validation

Performance Engineer should verify:

- startup time
- latency
- throughput
- memory usage
- resource utilization

Compare before and after migration.

---

# Phase 11 – Testing

QA Engineer should execute:

- migration validation
- unit tests
- integration tests
- regression tests
- end-to-end tests

Confirm migration correctness.

---

# Phase 12 – Rollback Validation

Verify:

- rollback scripts
- backups
- recovery procedures
- rollback testing
- data recovery

Rollback should be executable without ambiguity.

---

# Phase 13 – Documentation

Documentation Engineer should update:

MIGRATION_PLAN.md

MIGRATION_REPORT.md

COMPATIBILITY_GUIDE.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Record migration rationale and outcomes.

---

# Migration Strategies

Select the appropriate strategy:

- Big Bang
- Rolling Migration
- Blue-Green
- Canary
- Parallel Run
- Feature Flag
- Incremental

Explain why the chosen strategy is appropriate.

---

# Risk Assessment

Evaluate:

- data loss
- downtime
- compatibility
- security
- performance
- operational complexity

Assign:

Critical

High

Medium

Low

---

# Deliverables

Generate or update:

MIGRATION_PLAN.md

MIGRATION_REPORT.md

ROLLBACK_PLAN.md

COMPATIBILITY_GUIDE.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Final Report Format

Produce:

## Executive Summary

## Migration Scope

## Business Justification

## Architecture Review

## Database Migration

## Backend Migration

## Frontend Migration

## API Migration

## Data & AI Migration

## Infrastructure Migration

## Security Review

## Performance Validation

## Testing Results

## Rollback Validation

## Risks

## Migration Outcome

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ migration scope defined

✓ architecture reviewed

✓ database validated

✓ backend validated

✓ frontend validated

✓ APIs validated

✓ AI validated if applicable

✓ infrastructure validated

✓ security preserved

✓ performance validated

✓ testing completed

✓ rollback verified

✓ documentation updated

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- Migration completes successfully.
- Data integrity is preserved.
- Compatibility requirements are satisfied.
- Rollback procedures are verified.
- Performance remains acceptable.
- Documentation accurately reflects the migration.

---

# End Goal

Execute safe, repeatable, and well-documented migrations that modernize the system while preserving reliability, compatibility, security, and maintainability through careful planning, validation, testing, and rollback preparedness.