---
name: security-standards
description: Defines the security principles, secure development practices, infrastructure protections, vulnerability management, and compliance requirements for all software built using this engineering framework.
version: 1.0
owner: security-engineer
---

# Security Standards

## Purpose

Security is a fundamental quality attribute of software.

These standards establish a security-first engineering culture by integrating security into architecture, development, testing, deployment, and operations.

Every contributor—including AI agents—shares responsibility for maintaining system security.

---

# Security Philosophy

Security should be:

- Designed into the system
- Continuously evaluated
- Automatically verified
- Regularly monitored
- Continuously improved

Security should never be treated as an optional feature.

---

# Guiding Principles

Every system should prioritize:

- Confidentiality
- Integrity
- Availability
- Least Privilege
- Defense in Depth
- Secure Defaults
- Zero Trust
- Auditability
- Resilience

---

# Secure Development Lifecycle

Security should be considered during:

- Requirements
- Architecture
- Implementation
- Testing
- Code Review
- Deployment
- Operations
- Maintenance

Security activities should occur throughout development—not only before release.

---

# Authentication

Authentication mechanisms should:

- verify identity securely
- use industry-standard protocols
- support multi-factor authentication where appropriate
- prevent credential reuse
- enforce session expiration

Never implement custom authentication unless absolutely necessary.

---

# Authorization

Authorization should:

- follow least privilege
- validate every request
- separate authentication from authorization
- deny access by default
- log authorization failures

Permissions should be explicit and regularly reviewed.

---

# Secrets Management

Secrets include:

- API keys
- tokens
- passwords
- certificates
- encryption keys

Secrets should:

- never be committed to source control
- be stored in secure secret managers
- rotate regularly
- have minimal access permissions

Environment variables are acceptable only when managed securely.

---

# Input Validation

Validate all external input.

Protect against:

- SQL Injection
- Command Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Path Traversal
- Deserialization attacks

Assume all external input is untrusted.

---

# Data Protection

Sensitive data should:

- be encrypted in transit
- be encrypted at rest where appropriate
- have restricted access
- be retained only as long as necessary
- be securely deleted when no longer required

Avoid storing unnecessary sensitive information.

---

# Encryption

Use modern, well-supported cryptographic algorithms.

Never:

- invent custom encryption
- use deprecated algorithms
- hardcode encryption keys

Key management should follow organizational policies.

---

# Dependency Security

Before introducing a dependency:

- verify maintenance status
- review license compatibility
- scan for vulnerabilities
- minimize unnecessary packages

Update dependencies regularly.

---

# API Security

APIs should:

- authenticate requests
- authorize operations
- validate inputs
- limit request rates
- return appropriate error responses
- avoid exposing internal implementation details

Public APIs should be versioned.

---

# Database Security

Databases should:

- enforce least privilege
- use parameterized queries
- encrypt sensitive fields
- enable backups
- audit privileged actions

Never construct SQL using string concatenation.

---

# Infrastructure Security

Infrastructure should:

- minimize exposed services
- restrict network access
- enforce secure defaults
- enable monitoring
- automate patching where practical

Infrastructure should be treated as code.

---

# Logging and Auditing

Security-relevant events should be logged.

Examples:

- authentication attempts
- authorization failures
- configuration changes
- administrative actions
- security alerts

Logs should never expose sensitive data.

---

# Error Handling

Error messages should:

- assist troubleshooting
- avoid revealing sensitive information
- remain consistent
- be logged appropriately

Users should not receive internal implementation details.

---

# Secure Configuration

Configuration should:

- use secure defaults
- disable unused services
- externalize environment-specific settings
- minimize attack surface

Review configuration regularly.

---

# AI System Security

AI systems should consider:

- training data integrity
- prompt injection
- model abuse
- inference security
- dataset validation
- model version control

AI outputs should never be blindly trusted.

---

# Vulnerability Management

Regularly:

- scan dependencies
- monitor advisories
- prioritize critical issues
- apply patches
- verify remediation

Track vulnerabilities until resolved.

---

# Incident Response

Every project should define procedures for:

- detection
- containment
- eradication
- recovery
- post-incident review

Lessons learned should improve future defenses.

---

# Compliance

Where applicable, comply with relevant organizational, legal, and industry requirements.

Compliance requirements should be documented and periodically reviewed.

---

# Security Testing

Security validation should include:

- static analysis
- dependency scanning
- secret detection
- authentication testing
- authorization testing
- penetration testing where appropriate

Security testing complements functional testing.

---

# Continuous Integration

CI pipelines should automatically perform:

- dependency scanning
- secret scanning
- static analysis
- security linting
- vulnerability reporting

Critical security failures should block merges.

---

# AI-Assisted Development

AI-generated code should:

- follow secure coding practices
- avoid insecure examples
- use approved libraries
- undergo manual security review

AI suggestions should never bypass security standards.

---

# Security Checklist

Verify:

✓ authentication implemented correctly

✓ authorization enforced

✓ secrets protected

✓ inputs validated

✓ sensitive data encrypted

✓ dependencies scanned

✓ logging secure

✓ CI security checks passing

✓ documentation updated

---

# Success Criteria

Security standards succeed when:

✓ vulnerabilities are prevented early

✓ systems resist common attacks

✓ secrets remain protected

✓ deployments are secure

✓ incidents are detected quickly

✓ security becomes part of everyday engineering

---

# Related Standards

- architecture-principles.md
- coding-standards.md
- testing-standards.md
- code-review-checklist.md
- dependency-policy.md
- performance-guidelines.md

---

# Exceptions

Security exceptions require:

- documented risk assessment
- mitigation plan
- approval from the Security Engineer
- scheduled review for removal

Exceptions should be temporary and closely monitored.

---

# End Goal

Build software that is secure by design, resilient against evolving threats, and continuously protected through disciplined engineering practices, automated verification, proactive monitoring, and a culture where every contributor shares responsibility for safeguarding systems, data, and users.