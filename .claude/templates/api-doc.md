---
name: api-doc
description: Standard template for documenting REST, GraphQL, or internal APIs used within the engineering framework.
version: 1.0
owner: api-engineer
status: Draft
---

# API Documentation

## Document Information

| Field | Value |
|--------|-------|
| API Name | |
| Version | |
| Owner | |
| Base URL | |
| Status | Draft / Active / Deprecated |
| Last Updated | |

---

# Overview

Provide a high-level description of the API.

Include:

- purpose
- business context
- intended consumers
- supported functionality

---

# Architecture Context

Describe where this API fits within the system.

Include:

- producer
- consumers
- dependencies
- upstream systems
- downstream systems

Reference the Architecture Document if available.

---

# Base URL

Example:

```
https://api.example.com/v1
```

---

# Authentication

Specify authentication method.

Examples:

- OAuth 2.0
- JWT
- API Key
- Session Authentication
- Internal Service Authentication

Document required headers.

Example:

```
Authorization: Bearer <token>
```

---

# Authorization

Describe:

- required roles
- permissions
- scopes
- access restrictions

---

# Versioning

Document:

Current Version

Supported Versions

Deprecation Policy

Migration Guidance

---

# Rate Limiting

Specify:

- requests per minute
- burst limits
- throttling behavior
- retry guidance

Example:

```
100 requests/minute
```

---

# Request Headers

| Header | Required | Description |
|----------|----------|-------------|
| Authorization | Yes | |
| Content-Type | Yes | |
| Accept | Optional | |

---

# Response Headers

Document important response headers.

Examples:

- Request ID
- Rate Limit
- Pagination
- Cache Control

---

# Endpoints

---

## Endpoint

### Summary

Short description.

---

### Method

```
GET
```

---

### URL

```
/resource/{id}
```

---

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| | | | |

---

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| | | | |

---

### Request Body

Describe request schema.

Example:

```json
{
  "field": "value"
}
```

---

### Successful Response

Status Code

```
200 OK
```

Example:

```json
{
  "id": "",
  "name": ""
}
```

---

### Error Responses

| Status | Description |
|----------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

### Validation Rules

Document:

- required fields
- value constraints
- formats
- limits
- defaults

---

### Notes

Additional implementation details.

---

# Error Handling

Describe the standard error format.

Example:

```json
{
  "error": {
    "code": "",
    "message": "",
    "details": []
  }
}
```

Document common error codes.

---

# Pagination

If applicable, describe:

- page size
- cursors
- offsets
- sorting
- filtering

---

# Sorting

Document supported sort fields.

Example:

```
created_at

updated_at

name
```

---

# Filtering

Document supported filters.

Example:

```
status

created_after

owner_id
```

---

# Webhooks (If Applicable)

Document:

- event types
- payload format
- retries
- verification

---

# Idempotency

Document whether requests support idempotency.

Include:

- supported methods
- idempotency keys
- retry behavior

---

# Security Considerations

Document:

- authentication
- authorization
- encryption
- rate limiting
- input validation
- audit logging

---

# Performance Expectations

Document expected:

- latency
- throughput
- payload size
- caching strategy

---

# Caching

Describe:

- cache headers
- expiration
- invalidation
- CDN usage

---

# Monitoring

Describe:

- logs
- metrics
- tracing
- health checks
- alerts

---

# Dependencies

Internal

- Services
- Databases

External

- APIs
- Third-party providers

---

# Testing

Document API verification.

Include:

- unit testing
- integration testing
- contract testing
- load testing
- security testing

---

# SDK Support

List available SDKs.

Examples:

- JavaScript
- Python
- Java
- Swift

---

# Deprecation Policy

Document:

- deprecation notice period
- migration timeline
- replacement APIs
- support window

---

# Changelog

| Version | Date | Changes |
|----------|------|----------|
| | | |

---

# Related Documents

- Feature Request
- Design Document
- Architecture Review
- Database Documentation
- Testing Plan
- Release Notes

---

# Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| API Engineer | | | |
| Software Architect | | | |
| Security Engineer | | | |

---

# Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | | Initial Draft |

---

# Appendix

Include:

- OpenAPI Specification
- Sequence Diagrams
- Sample Requests
- Sample Responses
- Postman Collection
- Additional References