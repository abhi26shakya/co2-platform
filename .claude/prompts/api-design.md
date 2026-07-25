---
name: api-design
description: Design production-ready APIs that follow project architecture, REST/GraphQL best practices, security standards, and long-term maintainability.
version: 1.0
owner: api-engineer

agents:
  - api-engineer
  - software-architect
  - backend-engineer
  - database-engineer
  - security-engineer
  - documentation-engineer
  - qa-engineer

workflows:
  - architecture-review
  - feature-development
  - documentation

commands:
  - architecture
  - feature
  - document
  - review

standards:
  - architecture-principles
  - coding-standards
  - security-standards
  - documentation-standards
  - performance-guidelines

outputs:
  - API_SPEC.md
  - API_DOCUMENTATION.md
  - API_EXAMPLES.md
  - API_CHANGELOG.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# API Design Prompt

## Mission

Design production-ready APIs before implementation.

The API should be:

- consistent
- intuitive
- secure
- scalable
- versioned
- backward compatible
- easy to document
- easy to test

Design first.

Implement later.

---

# Phase 1 — Understand the Feature

Review:

- Feature Request
- Design Document
- Architecture Review
- Database Design

Determine:

- business requirements
- consumers
- expected workflows
- constraints

---

# Phase 2 — Resource Modeling

Identify the primary resources.

For every resource define:

- purpose
- ownership
- lifecycle
- relationships

Prefer resource-oriented APIs.

Avoid action-oriented endpoints when possible.

---

# Phase 3 — Endpoint Design

For every endpoint specify:

- HTTP method
- URL
- description
- authentication
- authorization
- request body
- response body
- status codes

Ensure naming consistency.

Example:

GET /users

POST /users

GET /users/{id}

PATCH /users/{id}

DELETE /users/{id}

---

# Phase 4 — Request Design

Define:

- required fields
- optional fields
- defaults
- validation rules
- field constraints
- supported formats

Reject invalid requests with meaningful errors.

---

# Phase 5 — Response Design

Responses should be:

- predictable
- minimal
- strongly typed
- consistent

Define:

- success schema
- error schema
- pagination
- metadata

Never expose internal implementation details.

---

# Phase 6 — Authentication

Specify authentication strategy.

Examples:

- JWT
- OAuth2
- API Keys
- Session Authentication
- Internal Service Authentication

Document required headers.

---

# Phase 7 — Authorization

Define:

- roles
- permissions
- scopes
- ownership rules
- administrative access

Apply least-privilege principles.

---

# Phase 8 — Validation & Error Handling

Design validation for:

- body
- query parameters
- path parameters
- headers

Standardize error responses.

Include:

- error code
- message
- details
- request ID

---

# Phase 9 — Pagination, Filtering & Sorting

Where applicable define:

Pagination

Filtering

Searching

Sorting

Cursor vs Offset pagination

Choose the simplest approach that scales.

---

# Phase 10 — Versioning

Define:

- current version
- compatibility strategy
- deprecation policy
- migration guidance

Avoid breaking existing consumers.

---

# Phase 11 — Performance

Optimize:

- payload size
- network usage
- query efficiency
- caching
- compression
- rate limiting

Document expected latency targets.

---

# Phase 12 — Security

Review:

- authentication
- authorization
- input validation
- injection risks
- rate limiting
- sensitive data exposure
- audit logging

Ensure compliance with project security standards.

---

# Phase 13 — Testing Strategy

Define tests for:

- successful requests
- validation failures
- authorization failures
- authentication failures
- edge cases
- pagination
- filtering
- error handling

---

# Phase 14 — Documentation

Generate:

API_SPEC.md

API_DOCUMENTATION.md

API_EXAMPLES.md

Include:

- endpoint summaries
- request examples
- response examples
- authentication guide
- common errors

---

# Phase 15 — Review

Verify the API is:

- consistent
- RESTful (or GraphQL best practices)
- secure
- scalable
- maintainable
- backward compatible
- fully documented

Update:

PROJECT_PROGRESS.md

Update:

CONTEXT.md

---

# Deliverables

Produce or update:

- API_SPEC.md
- API_DOCUMENTATION.md
- API_EXAMPLES.md
- API_CHANGELOG.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# API Design Principles

Always:

- Design before implementing.
- Keep endpoints predictable.
- Use standard HTTP semantics.
- Return consistent response structures.
- Validate all inputs.
- Minimize payload size.
- Document every endpoint.
- Preserve backward compatibility whenever possible.

Never:

- Expose internal database models directly.
- Leak sensitive information.
- Use inconsistent naming.
- Introduce unnecessary endpoints.
- Break existing clients without a migration strategy.

---

# Definition of Done

The API design is complete only when:

- All resources are identified.
- Endpoints are fully specified.
- Authentication and authorization are defined.
- Validation and error handling are standardized.
- Versioning strategy is documented.
- Performance and security considerations are addressed.
- Documentation and examples are complete.
- Project progress and context are updated.