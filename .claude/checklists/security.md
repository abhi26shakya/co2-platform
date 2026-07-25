# Security Checklist

## Purpose

This checklist verifies that security requirements have been reviewed and satisfied before a feature, service, or release is approved.

Security should be considered throughout development, not only before deployment.

---

# 1. Authentication

- [ ] Authentication is required where appropriate.
- [ ] Authentication mechanisms follow project standards.
- [ ] Session handling is secure.
- [ ] Token expiration is configured correctly.
- [ ] Invalid credentials are handled safely.
- [ ] Authentication failures are logged appropriately.

---

# 2. Authorization

- [ ] Authorization is enforced for protected resources.
- [ ] User permissions are verified.
- [ ] Role-based access control is correctly implemented.
- [ ] Privilege escalation paths have been reviewed.
- [ ] Administrative endpoints are protected.

---

# 3. Input Validation

- [ ] All external inputs are validated.
- [ ] Input length restrictions are enforced.
- [ ] Input format is validated.
- [ ] Unexpected values are rejected.
- [ ] File uploads are validated if applicable.
- [ ] Error messages do not expose sensitive details.

---

# 4. Sensitive Data

- [ ] Secrets are never hardcoded.
- [ ] Environment variables are used for sensitive configuration.
- [ ] Passwords are never stored in plain text.
- [ ] Sensitive data is encrypted where required.
- [ ] Personal or confidential data is handled appropriately.
- [ ] Logs do not expose sensitive information.

---

# 5. API Security

If applicable.

- [ ] API authentication verified.
- [ ] Authorization verified.
- [ ] Rate limiting considered.
- [ ] Request validation implemented.
- [ ] Response validation performed.
- [ ] Sensitive endpoints protected.

---

# 6. Database Security

If applicable.

- [ ] Parameterized queries or ORM protections are used.
- [ ] SQL injection risks reviewed.
- [ ] Database permissions follow least privilege.
- [ ] Sensitive fields are protected.
- [ ] Database backups are secured.

---

# 7. Dependency Security

- [ ] Dependencies are from trusted sources.
- [ ] Unused dependencies removed.
- [ ] Known vulnerabilities reviewed.
- [ ] Dependency versions are supported.
- [ ] License compatibility reviewed if required.

---

# 8. Infrastructure Security

- [ ] Environment configuration reviewed.
- [ ] Secrets management verified.
- [ ] TLS/HTTPS enabled where required.
- [ ] Network exposure minimized.
- [ ] Security headers configured where applicable.
- [ ] Access permissions reviewed.

---

# 9. Logging and Monitoring

- [ ] Security-relevant events are logged.
- [ ] Authentication failures are logged.
- [ ] Critical errors are monitored.
- [ ] Audit logs are retained as required.
- [ ] Sensitive information is excluded from logs.

---

# 10. Common Security Risks

Review for common issues including:

- [ ] Injection vulnerabilities.
- [ ] Broken authentication.
- [ ] Broken access control.
- [ ] Security misconfiguration.
- [ ] Cryptographic weaknesses.
- [ ] Insecure file handling.
- [ ] Server-side request forgery (SSRF), where applicable.
- [ ] Cross-site scripting (XSS), where applicable.
- [ ] Cross-site request forgery (CSRF), where applicable.

---

# 11. Security Testing

- [ ] Authentication tested.
- [ ] Authorization tested.
- [ ] Input validation tested.
- [ ] Error handling tested.
- [ ] Negative test cases executed.
- [ ] High-risk components reviewed.

---

# 12. Compliance

If applicable.

- [ ] Project security standards followed.
- [ ] Documentation updated.
- [ ] Security assumptions documented.
- [ ] Known risks recorded.
- [ ] Security exceptions approved.

---

# Final Security Review

Before approving:

- [ ] No critical vulnerabilities identified.
- [ ] No secrets committed.
- [ ] Security documentation updated.
- [ ] Security testing completed.
- [ ] Residual risks documented and accepted where necessary.

---

# Completion Criteria

Security review is complete only when:

- Authentication and authorization are verified.
- Sensitive data is protected.
- Input validation is implemented.
- Dependencies have been reviewed.
- Infrastructure security is appropriate.
- Security testing has been completed.
- No unresolved critical security issues remain.