---
name: database
description: Design and evolve production-ready database schemas, migrations, indexing strategies, and data models while maintaining scalability, integrity, and performance.
version: 1.0
owner: database-engineer

agents:
  - database-engineer
  - software-architect
  - backend-engineer
  - api-engineer
  - security-engineer
  - performance-engineer
  - documentation-engineer

workflows:
  - architecture-review
  - feature-development
  - documentation

commands:
  - architecture
  - feature
  - migrate
  - review

standards:
  - architecture-principles
  - coding-standards
  - security-standards
  - performance-guidelines
  - documentation-standards

outputs:
  - DATABASE_DESIGN.md
  - DATABASE_SCHEMA.md
  - MIGRATION_PLAN.md
  - DATA_DICTIONARY.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Database Design Prompt

## Mission

Design a production-ready database that is:

- scalable
- maintainable
- secure
- performant
- normalized where appropriate
- easy to migrate
- resilient to future growth

Database design should support current requirements while allowing future evolution.

Design first.

Implement later.

---

# Phase 1 — Understand Requirements

Review:

- Feature Request
- Design Document
- Architecture Review
- API Design

Determine:

- business entities
- relationships
- expected workloads
- reporting needs
- scalability requirements

---

# Phase 2 — Domain Modeling

Identify:

- entities
- aggregates
- ownership
- lifecycle
- relationships

For every entity define:

- purpose
- responsibilities
- dependencies

Avoid modeling implementation details.

---

# Phase 3 — Schema Design

Design:

- tables
- columns
- data types
- defaults
- constraints
- nullable fields

Choose data types carefully.

Avoid unnecessary complexity.

Generate:

DATABASE_SCHEMA.md

---

# Phase 4 — Relationships

Define:

- One-to-One
- One-to-Many
- Many-to-Many

Specify:

- foreign keys
- cascading rules
- referential integrity

Maintain consistency.

---

# Phase 5 — Normalization

Evaluate:

- First Normal Form
- Second Normal Form
- Third Normal Form

Document intentional denormalization when justified by performance or business needs.

---

# Phase 6 — Indexing Strategy

Design indexes for:

- primary keys
- foreign keys
- frequently filtered columns
- sorting
- joins
- unique constraints

Avoid unnecessary indexes.

Document expected query patterns.

---

# Phase 7 — Migration Strategy

Plan:

- schema changes
- migration order
- rollback strategy
- backward compatibility

Every migration should be:

- repeatable
- reversible
- documented

Generate:

MIGRATION_PLAN.md

---

# Phase 8 — Data Integrity

Ensure:

- constraints
- transactions
- uniqueness
- validation
- consistency

Prevent invalid data whenever possible.

---

# Phase 9 — Security

Review:

- database roles
- least privilege
- encryption at rest
- encryption in transit
- secret management
- audit logging
- sensitive data storage

Never expose confidential data unnecessarily.

---

# Phase 10 — Performance

Evaluate:

- query performance
- indexing effectiveness
- joins
- pagination
- partitioning
- connection pooling
- caching opportunities

Estimate expected workload.

---

# Phase 11 — Scalability

Plan for:

- vertical scaling
- horizontal scaling
- replication
- partitioning
- archival
- data retention

Document future scaling strategies.

---

# Phase 12 — Backup & Recovery

Define:

- backup frequency
- retention period
- restore procedure
- Recovery Point Objective (RPO)
- Recovery Time Objective (RTO)

Ensure recovery procedures are documented and testable.

---

# Phase 13 — Testing Strategy

Define validation for:

- migrations
- rollback
- constraints
- transactions
- indexes
- data integrity
- performance

Plan repeatable database tests.

---

# Phase 14 — Documentation

Generate:

DATABASE_DESIGN.md

DATABASE_SCHEMA.md

DATA_DICTIONARY.md

Document:

- entities
- relationships
- constraints
- indexes
- migration history
- operational notes

---

# Phase 15 — Review

Verify that the design is:

- normalized where appropriate
- performant
- secure
- maintainable
- scalable
- migration-safe
- fully documented

Update:

PROJECT_PROGRESS.md

Update:

CONTEXT.md

---

# Deliverables

Produce or update:

- DATABASE_DESIGN.md
- DATABASE_SCHEMA.md
- MIGRATION_PLAN.md
- DATA_DICTIONARY.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Database Design Principles

Always:

- Model the business domain before tables.
- Use clear, consistent naming.
- Enforce data integrity with constraints.
- Design indexes based on query patterns.
- Keep migrations reversible.
- Document every schema change.
- Plan for future growth without premature optimization.

Never:

- Store duplicate data without justification.
- Expose sensitive information unnecessarily.
- Create indexes without a measurable need.
- Make destructive schema changes without rollback planning.
- Ignore migration compatibility.

---

# Definition of Done

The database design is complete only when:

- Business entities are modeled.
- Schema is documented.
- Relationships are defined.
- Constraints enforce integrity.
- Indexes support expected queries.
- Migration and rollback plans exist.
- Security and performance have been reviewed.
- Documentation is complete.
- Project progress and context are updated.