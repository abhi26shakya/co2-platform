---
name: database-doc
description: Standard template for documenting database architecture, schema design, migrations, security, performance, and operational procedures.
version: 1.0
owner: database-engineer
status: Draft
---

# Database Documentation

## Document Information

| Field | Value |
|--------|-------|
| Database Name | |
| Version | |
| Owner | |
| Database Engine | |
| Environment | Development / Staging / Production |
| Status | Draft / Active / Deprecated |
| Last Updated | |

---

# Overview

Provide a high-level overview of the database.

Include:

- purpose
- business domain
- primary responsibilities
- systems using the database

---

# Architecture Context

Describe where this database fits within the overall system.

Include:

- producers
- consumers
- dependent services
- external integrations

Reference the Architecture Document if applicable.

---

# Database Technology

Document:

- Database engine
- Version
- Storage engine
- ORM / Query Builder
- Connection pooling
- Replication strategy

Example:

```
PostgreSQL 17

Prisma ORM

PgBouncer
```

---

# Schema Overview

Provide a summary of the schema.

Include:

- major entities
- relationships
- modules
- logical grouping

---

# Entity Relationship Diagram (ERD)

Insert:

- ER Diagram
- UML Diagram
- Relationship visualization

Reference external diagrams when appropriate.

---

# Tables

For every table include:

---

## Table Name

### Purpose

Describe why the table exists.

---

### Columns

| Column | Type | Nullable | Default | Description |
|---------|------|----------|----------|-------------|
| | | | | |

---

### Primary Key

Document the primary key.

---

### Foreign Keys

List all foreign keys.

| Column | References | On Delete | On Update |
|---------|------------|-----------|-----------|
| | | | |

---

### Indexes

| Index | Columns | Unique | Purpose |
|--------|---------|--------|---------|
| | | Yes / No | |

---

### Constraints

Examples:

- UNIQUE
- CHECK
- NOT NULL
- FOREIGN KEY

---

### Relationships

Describe:

- One-to-One
- One-to-Many
- Many-to-Many

---

# Views

Document database views.

Include:

- purpose
- dependencies
- refresh strategy

---

# Stored Procedures / Functions

For each procedure include:

- purpose
- inputs
- outputs
- dependencies
- execution frequency

---

# Triggers

Document:

- trigger name
- event
- timing
- purpose

---

# Migrations

Describe migration strategy.

Include:

- migration tool
- naming convention
- rollback strategy
- deployment order

Example:

```
202607260001_create_users_table.sql
```

---

# Seed Data

Document:

- initial data
- test data
- development fixtures
- production seed policy

---

# Data Lifecycle

Describe:

- creation
- updates
- archival
- retention
- deletion

Include retention periods where applicable.

---

# Backup Strategy

Document:

- backup frequency
- storage location
- retention period
- encryption
- verification process

---

# Recovery Strategy

Document:

- restore procedure
- Recovery Point Objective (RPO)
- Recovery Time Objective (RTO)
- disaster recovery process

---

# Performance Considerations

Evaluate:

- indexing strategy
- query optimization
- partitioning
- replication
- caching
- connection pooling

Document expected workloads.

---

# Query Optimization

List important queries.

For each include:

- purpose
- execution frequency
- optimization notes

---

# Security

Document:

## Authentication

Database authentication method.

---

## Authorization

Roles and privileges.

---

## Encryption

Data at rest

Data in transit

---

## Secrets Management

Credential storage strategy.

---

## Auditing

Logging

Change tracking

Compliance requirements

---

# Data Integrity

Describe:

- constraints
- validation
- transactional guarantees
- consistency model

---

# Scalability

Document:

- vertical scaling
- horizontal scaling
- sharding
- partitioning
- replication

---

# Monitoring

Monitor:

- slow queries
- storage usage
- replication lag
- connections
- locks
- deadlocks
- CPU
- memory

---

# Maintenance

Document recurring maintenance tasks.

Examples:

- VACUUM
- ANALYZE
- Index rebuild
- Statistics update
- Cleanup jobs

---

# Dependencies

Internal

- Backend services
- APIs
- Workers

External

- Data providers
- ETL pipelines
- Third-party systems

---

# Testing

Database validation should include:

- schema validation
- migration testing
- rollback testing
- performance testing
- integrity testing
- backup restoration testing

---

# Known Limitations

Document:

- technical debt
- unsupported features
- operational constraints

---

# Future Improvements

List planned enhancements.

Examples:

- partitioning
- new indexes
- schema normalization
- replication improvements

---

# Related Documents

- Feature Request
- Design Document
- Architecture Review
- API Documentation
- Testing Plan
- Release Notes

---

# Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| Database Engineer | | | |
| Software Architect | | | |
| Engineering Lead | | | |

---

# Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | | Initial Draft |

---

# Appendix

Include:

- ER diagrams
- Migration history
- Sample queries
- Benchmark results
- Data dictionary
- Reference links