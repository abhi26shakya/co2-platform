---
name: security
description: Perform a comprehensive security assessment of the application, infrastructure, APIs, databases, AI systems, cloud resources, dependencies, and deployment configuration. Identify vulnerabilities, recommend mitigations, validate security controls, and document overall security posture.
agents:
  - security-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - devops-engineer
  - ml-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - qa-engineer
  - documentation-engineer
  - code-reviewer
---

# Security Command

## Purpose

Perform a comprehensive security audit of the entire system.

Identify vulnerabilities before they become incidents.

Protect confidentiality, integrity, and availability throughout the software lifecycle.

---

# Objectives

Answer the following questions:

- What security risks exist?
- Are authentication and authorization implemented correctly?
- Are secrets protected?
- Are APIs secure?
- Is infrastructure hardened?
- Are AI systems secure?
- Are dependencies vulnerable?
- Is the application production-ready from a security perspective?

---

# General Rules

Always:

- Verify before trusting.
- Apply least privilege.
- Validate all inputs.
- Secure sensitive data.
- Document findings.
- Prioritize remediation by risk.

Never:

- Assume components are secure.
- Ignore low-level warnings without justification.
- Expose secrets.
- Disable security controls for convenience.

---

# Inputs

Review:

- source code
- infrastructure
- deployment configuration
- environment variables
- dependency manifests
- authentication logic
- authorization policies
- API documentation
- database schema
- monitoring configuration

---

# Phase 1 – Threat Modeling

Security Engineer should identify:

- attack surface
- trust boundaries
- sensitive assets
- attacker capabilities
- high-value targets

Document realistic threat scenarios.

---

# Phase 2 – Authentication Review

Verify:

- login flow
- password handling
- MFA support
- session management
- token lifecycle
- refresh tokens
- logout behavior

Authentication must be secure and consistent.

---

# Phase 3 – Authorization Review

Review:

- role-based access
- permissions
- object-level authorization
- API authorization
- administrative functions

Ensure users cannot access unauthorized resources.

---

# Phase 4 – Input Validation

Inspect:

- form validation
- API validation
- file uploads
- serialization
- deserialization
- command execution
- SQL queries

Prevent:

- SQL Injection
- NoSQL Injection
- Command Injection
- XSS
- CSRF
- SSRF

---

# Phase 5 – API Security

API Engineer should verify:

- authentication
- authorization
- rate limiting
- request validation
- response filtering
- versioning
- CORS configuration

Ensure APIs expose only intended functionality.

---

# Phase 6 – Database Security

Database Engineer should review:

- encryption
- backups
- credentials
- permissions
- auditing
- connection security
- migration safety

Protect sensitive data at rest and in transit.

---

# Phase 7 – Infrastructure Security

DevOps Engineer should verify:

- HTTPS
- TLS configuration
- firewall rules
- network segmentation
- cloud IAM
- container security
- Kubernetes security
- storage permissions

Confirm production infrastructure follows security best practices.

---

# Phase 8 – Dependency Security

Review:

- outdated packages
- known CVEs
- supply chain risks
- license issues

Recommend upgrades based on risk.

---

# Phase 9 – AI Security

If applicable:

ML Engineer should review:

- model integrity
- model poisoning risks
- prompt injection exposure
- inference security
- model access control

Climate AI Engineer should verify:

- scientific integrity maintained

Satellite Imagery Engineer should verify:

- geospatial pipeline security
- external imagery sources
- dataset integrity

Skip if AI components are unaffected.

---

# Phase 10 – Secrets Management

Verify:

- API keys
- database credentials
- cloud credentials
- encryption keys
- certificates

Ensure:

- secrets never committed
- secure secret storage
- key rotation strategy

---

# Phase 11 – Logging & Monitoring

Verify:

- audit logs
- authentication logs
- failed login monitoring
- anomaly detection
- security alerts
- incident logging

Ensure sensitive data is never logged.

---

# Phase 12 – Penetration Review

Simulate common attack vectors:

- authentication bypass
- privilege escalation
- injection attacks
- insecure direct object reference
- session hijacking
- file upload abuse

Document findings.

---

# Phase 13 – Security Testing

QA Engineer should validate:

- security regression tests
- authentication flows
- authorization enforcement
- negative test cases

Security testing should complement functional testing.

---

# Phase 14 – Documentation

Documentation Engineer should update:

SECURITY_REPORT.md

RISK_REGISTER.md

THREAT_MODEL.md

SECURITY_CHECKLIST.md

PROJECT_PROGRESS.md

CONTEXT.md

---

# Risk Classification

Classify findings as:

Critical

High

Medium

Low

Informational

Include:

- impact
- likelihood
- remediation
- priority

---

# Security Standards

Evaluate compliance with:

- OWASP Top 10
- Secure Coding Best Practices
- Principle of Least Privilege
- Defense in Depth
- Zero Trust concepts (where applicable)

---

# Deliverables

Generate or update:

SECURITY_REPORT.md

THREAT_MODEL.md

RISK_REGISTER.md

SECURITY_CHECKLIST.md

DEPENDENCY_AUDIT.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently.

---

# Final Report Format

Produce:

## Executive Summary

## Threat Model

## Authentication Review

## Authorization Review

## Input Validation

## API Security

## Database Security

## Infrastructure Security

## Dependency Audit

## AI Security

## Secrets Management

## Logging & Monitoring

## Penetration Review

## Security Testing

## Risk Register

## Remediation Plan

## Overall Security Assessment

---

# Quality Checklist

Before finishing verify:

✓ threat model completed

✓ authentication reviewed

✓ authorization reviewed

✓ input validation reviewed

✓ APIs reviewed

✓ database reviewed

✓ infrastructure reviewed

✓ dependencies audited

✓ AI reviewed if applicable

✓ secrets protected

✓ logging reviewed

✓ penetration review completed

✓ documentation updated

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- Major attack surfaces have been evaluated.
- Critical vulnerabilities are identified or ruled out.
- Security controls are documented.
- Risks are prioritized.
- A clear remediation plan is produced.
- Documentation accurately reflects the security posture.

---

# End Goal

Establish a repeatable, evidence-based security assessment process that strengthens the application's resilience, reduces risk, protects sensitive data, and supports secure, production-ready software throughout its lifecycle.