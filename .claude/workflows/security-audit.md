---
name: security-audit
description: Comprehensive workflow for assessing, validating, and improving application security across architecture, infrastructure, APIs, authentication, data, AI systems, and operational practices before deployment or release.
version: 1.0
owner: security-engineer
---

# Security Audit Workflow

## Purpose

Perform a comprehensive security assessment of the entire system.

Identify vulnerabilities before they become production incidents.

Security should be integrated throughout the Software Development Lifecycle rather than performed only before release.

---

# When To Use

Use this workflow when:

- Building a new feature
- Preparing a release
- Performing a security assessment
- Migrating infrastructure
- Upgrading dependencies
- Integrating third-party services
- Deploying AI models
- Conducting compliance reviews

Do not use for:

- Small documentation changes
- UI-only cosmetic updates
- Minor content changes

---

# Objectives

Verify:

- Authentication
- Authorization
- Data Protection
- Infrastructure Security
- API Security
- Application Security
- Dependency Security
- AI Security
- Compliance
- Operational Security

---

# Workflow Overview

```
Project Scope
      │
      ▼
Threat Modeling
      │
      ▼
Architecture Review
      │
      ▼
Application Review
      │
      ▼
Infrastructure Review
      │
      ▼
Dependency Analysis
      │
      ▼
Security Testing
      │
      ▼
Risk Assessment
      │
      ▼
Remediation Planning
      │
      ▼
Security Approval
```

---

# Participating Agents

Leadership

- Project Manager

Architecture

- Software Architect

Engineering

- Backend Engineer
- Frontend Engineer
- Database Engineer
- API Engineer
- Data Engineer
- ML Engineer
- Climate AI Engineer
- Satellite Imagery Engineer

Infrastructure

- DevOps Engineer

Quality

- QA Engineer

Security

- Security Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Security Scope

Project Manager should define:

- systems under review
- business impact
- critical assets
- deployment environment
- compliance requirements

Deliverable:

Security Audit Scope

---

# Phase 2 — Threat Modeling

Security Engineer should identify:

- attack surfaces
- trust boundaries
- threat actors
- attack vectors
- abuse cases
- sensitive assets

Use a structured methodology such as STRIDE or a comparable threat-modeling approach.

Document every identified threat.

---

# Phase 3 — Architecture Security Review

Software Architect should evaluate:

- trust boundaries
- service communication
- privilege separation
- network segmentation
- architecture weaknesses
- resilience

Review architectural security assumptions.

---

# Phase 4 — Application Security Review

Backend Engineer should inspect:

- authentication
- authorization
- input validation
- output encoding
- session handling
- business logic

Frontend Engineer should inspect:

- client-side validation
- XSS protections
- CSRF protections
- secure storage
- browser security

API Engineer should inspect:

- authentication
- authorization
- rate limiting
- request validation
- response security
- API versioning

---

# Phase 5 — Database Security Review

Database Engineer should verify:

- encryption
- backups
- access controls
- least privilege
- audit logging
- data integrity

Sensitive data should be protected both at rest and in transit.

---

# Phase 6 — Infrastructure Security

DevOps Engineer should review:

- cloud configuration
- containers
- secrets management
- firewalls
- TLS configuration
- monitoring
- logging
- backup strategy

Validate infrastructure hardening.

---

# Phase 7 — Dependency Security

Review:

- third-party libraries
- package vulnerabilities
- license risks
- outdated dependencies
- supply-chain risks

Remove or upgrade vulnerable dependencies where practical.

---

# Phase 8 — AI & Data Security

If applicable

Data Engineer should review:

- data privacy
- pipeline permissions
- dataset integrity

ML Engineer should review:

- model integrity
- model storage
- inference endpoints
- model access

Climate AI Engineer should verify:

- scientific integrity
- workflow protection

Satellite Imagery Engineer should verify:

- imagery access
- GIS permissions
- data confidentiality

Skip if not applicable.

---

# Phase 9 — Security Testing

QA Engineer and Security Engineer should perform:

- authentication testing
- authorization testing
- input validation testing
- privilege escalation testing
- session management testing
- API abuse testing

Where appropriate, include automated scanning and manual verification.

---

# Phase 10 — Risk Assessment

For every finding record:

Title

Description

Affected Components

Likelihood

Impact

Severity

Mitigation

Owner

Target Resolution

Classify severity as:

Critical

High

Medium

Low

Informational

---

# Phase 11 — Remediation Planning

Prioritize fixes based on:

- exploitability
- business impact
- technical complexity
- production exposure

Create an actionable remediation roadmap.

---

# Phase 12 — Documentation

Documentation Engineer should update:

SECURITY_REPORT.md

THREAT_MODEL.md

RISK_REGISTER.md

DEPENDENCY_AUDIT.md

PROJECT_PROGRESS.md

CONTEXT.md

Synchronize security documentation with implementation.

---

# Phase 13 — Final Security Approval

Security Engineer should verify:

✓ critical vulnerabilities resolved

✓ high-risk findings addressed or accepted

✓ authentication secure

✓ authorization verified

✓ infrastructure hardened

✓ dependencies reviewed

✓ documentation complete

Possible Outcomes:

Approved

Approved with Accepted Risks

Changes Required

Rejected

---

# Security Checklist

Verify:

✓ authentication

✓ authorization

✓ encryption

✓ secrets management

✓ secure dependencies

✓ secure APIs

✓ infrastructure hardened

✓ logging enabled

✓ monitoring configured

✓ backups verified

✓ documentation updated

---

# Deliverables

Generate or update:

SECURITY_REPORT.md

THREAT_MODEL.md

RISK_REGISTER.md

DEPENDENCY_AUDIT.md

REMEDIATION_PLAN.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Security audit succeeds only if:

✓ threat model completed

✓ architecture reviewed

✓ application reviewed

✓ infrastructure reviewed

✓ dependencies evaluated

✓ AI systems reviewed if applicable

✓ risks prioritized

✓ remediation plan created

✓ documentation synchronized

✓ security approval granted

---

# Related Commands

Primary

- /security
- /audit
- /review

Supporting

- /test
- /benchmark
- /deploy
- /release

---

# Failure Handling

If the security audit cannot be completed:

- document unresolved findings
- classify every risk
- assign owners
- recommend mitigation
- schedule a follow-up review

Never approve production deployment with unresolved Critical vulnerabilities.

---

# End Goal

Create a repeatable, evidence-based security assessment process that identifies and prioritizes security risks early, validates the security posture of every major system, and ensures software is secure, resilient, and ready for production through coordinated review, testing, documentation, and remediation.