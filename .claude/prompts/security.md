---
name: security
description: Perform comprehensive security analysis, threat modeling, vulnerability assessment, and remediation planning for production-ready software.
version: 1.0
owner: security-engineer

agents:
  - security-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - api-engineer
  - database-engineer
  - performance-engineer
  - qa-engineer
  - documentation-engineer

workflows:
  - security-audit
  - code-review
  - architecture-review
  - feature-development

commands:
  - security
  - audit
  - review
  - optimize

standards:
  - security-standards
  - coding-standards
  - architecture-principles
  - documentation-standards

outputs:
  - SECURITY_REPORT.md
  - THREAT_MODEL.md
  - VULNERABILITY_REPORT.md
  - REMEDIATION_PLAN.md
  - SECURITY_CHECKLIST.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Security Prompt

## Mission

Evaluate the application using a security-first engineering approach.

Identify vulnerabilities before deployment.

Recommend practical mitigations that align with the project architecture.

Security should be integrated throughout the development lifecycle—not treated as a final checklist.

---

# Phase 1 — Understand the System

Review:

- Feature Request
- Design Document
- Architecture Review
- API Design
- Database Design
- Pull Request

Determine:

- assets
- trust boundaries
- user roles
- sensitive data
- attack surface

Generate:

THREAT_MODEL.md

---

# Phase 2 — Threat Modeling

Identify potential threats using a structured methodology (such as STRIDE or an equivalent).

Consider:

- spoofing
- tampering
- repudiation
- information disclosure
- denial of service
- privilege escalation

Rank each threat:

- Critical
- High
- Medium
- Low

Document possible attack paths.

---

# Phase 3 — Authentication Review

Evaluate:

- login flow
- password handling
- MFA support
- session management
- token lifecycle
- password reset flow
- account recovery

Verify authentication follows project security standards.

---

# Phase 4 — Authorization Review

Verify:

- role-based access control
- resource ownership
- administrative permissions
- least privilege
- privilege escalation prevention

Ensure unauthorized users cannot access protected resources.

---

# Phase 5 — Input Validation

Review all external inputs.

Inspect:

- request bodies
- query parameters
- path parameters
- headers
- uploaded files

Verify:

- sanitization
- validation
- encoding
- size limits
- type validation

---

# Phase 6 — OWASP Top Risks

Review for common application security risks, including:

- injection vulnerabilities
- broken authentication
- broken access control
- cryptographic weaknesses
- security misconfiguration
- cross-site scripting (XSS)
- insecure deserialization
- software and dependency vulnerabilities
- insufficient logging and monitoring
- server-side request forgery (SSRF)

Document all findings.

---

# Phase 7 — API Security

Review:

- authentication
- authorization
- rate limiting
- request validation
- response validation
- CORS configuration
- error handling

Ensure APIs expose only necessary information.

---

# Phase 8 — Database Security

Review:

- SQL injection prevention
- ORM usage
- parameterized queries
- database permissions
- encryption
- backups
- audit logging
- data retention

Verify least-privilege database access.

---

# Phase 9 — Secrets Management

Inspect:

- API keys
- tokens
- passwords
- certificates
- encryption keys
- environment variables

Verify:

- secrets are never hardcoded
- secrets are rotated appropriately
- secret storage follows project policy

---

# Phase 10 — Dependency Security

Review:

- third-party libraries
- package versions
- known vulnerabilities
- abandoned dependencies
- license concerns

Recommend upgrades where appropriate.

---

# Phase 11 — Infrastructure & Deployment Security

Evaluate:

- HTTPS configuration
- TLS settings
- reverse proxy configuration
- container security
- CI/CD pipeline security
- cloud permissions
- firewall configuration
- logging and monitoring

Document deployment risks.

---

# Phase 12 — Security Testing

Recommend or execute:

- static analysis
- dependency scanning
- secret scanning
- authentication testing
- authorization testing
- penetration testing
- fuzz testing
- security regression testing

Summarize results.

---

# Phase 13 — Remediation Planning

For every finding document:

- description
- affected component
- severity
- impact
- likelihood
- recommended mitigation
- implementation priority

Generate:

REMEDIATION_PLAN.md

---

# Phase 14 — Documentation

Generate:

- SECURITY_REPORT.md
- THREAT_MODEL.md
- VULNERABILITY_REPORT.md
- REMEDIATION_PLAN.md
- SECURITY_CHECKLIST.md

Summarize:

- identified risks
- mitigations
- remaining concerns
- deployment readiness

---

# Phase 15 — Final Security Review

Determine whether the application is:

- Secure for Production
- Secure with Minor Risks
- Not Ready for Production

Explain the decision using evidence from the review.

Update:

PROJECT_PROGRESS.md

Update:

CONTEXT.md

---

# Deliverables

Produce or update:

- SECURITY_REPORT.md
- THREAT_MODEL.md
- VULNERABILITY_REPORT.md
- REMEDIATION_PLAN.md
- SECURITY_CHECKLIST.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Security Principles

Always:

- Apply defense in depth.
- Validate all external input.
- Follow least-privilege principles.
- Encrypt sensitive data appropriately.
- Protect secrets.
- Keep dependencies updated.
- Log security-relevant events.
- Prioritize remediation by risk.

Never:

- Store secrets in source code.
- Trust client-side validation alone.
- Expose internal implementation details.
- Ignore critical vulnerabilities.
- Disable security controls for convenience.
- Approve production deployment with unresolved Critical issues.

---

# Definition of Done

The security review is complete only when:

- Threat modeling has been completed.
- Authentication and authorization have been reviewed.
- Input validation has been verified.
- Common application security risks have been assessed.
- API and database security have been evaluated.
- Secrets management has been reviewed.
- Dependency and infrastructure security have been assessed.
- A remediation plan exists for identified issues.
- Documentation is complete.
- Project progress and context have been updated.