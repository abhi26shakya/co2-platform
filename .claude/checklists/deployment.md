# Deployment Checklist

## Purpose

This checklist verifies that the application is ready for deployment and that the deployment process is safe, repeatable, and reversible.

Complete every applicable item before deploying to staging or production.

---

# 1. Build Verification

- [ ] Project builds successfully.
- [ ] All dependencies are installed correctly.
- [ ] Build artifacts generated successfully.
- [ ] No build warnings that could affect production.
- [ ] Version number updated if required.
- [ ] Release artifacts verified.

---

# 2. Environment Configuration

- [ ] Environment variables configured.
- [ ] Secrets available.
- [ ] Configuration reviewed.
- [ ] Development configuration not used in production.
- [ ] API endpoints configured correctly.
- [ ] Feature flags reviewed.

---

# 3. Infrastructure

- [ ] Deployment target verified.
- [ ] Required services are available.
- [ ] Storage configured.
- [ ] Networking configured.
- [ ] DNS configuration verified.
- [ ] TLS/SSL certificates valid.

---

# 4. Database

If applicable.

- [ ] Database backup completed.
- [ ] Migration scripts reviewed.
- [ ] Rollback migration available.
- [ ] Schema validated.
- [ ] Database connectivity verified.
- [ ] Seed data reviewed if applicable.

---

# 5. Application Readiness

- [ ] Application starts successfully.
- [ ] Health check endpoint responds.
- [ ] Configuration loaded correctly.
- [ ] Logging operational.
- [ ] Background jobs configured.
- [ ] Scheduled tasks verified.

---

# 6. Security

- [ ] Secrets not committed.
- [ ] HTTPS enabled.
- [ ] Authentication verified.
- [ ] Authorization verified.
- [ ] Security headers configured.
- [ ] Sensitive data protected.

---

# 7. Testing Verification

- [ ] Unit tests passed.
- [ ] Integration tests passed.
- [ ] Regression tests passed.
- [ ] Manual testing completed.
- [ ] Critical workflows verified.
- [ ] No unresolved critical defects.

---

# 8. Performance

- [ ] Performance baseline reviewed.
- [ ] Resource utilization acceptable.
- [ ] Database performance verified.
- [ ] Large datasets tested where applicable.
- [ ] Caching configured if required.

---

# 9. Monitoring

- [ ] Monitoring enabled.
- [ ] Logging enabled.
- [ ] Metrics collection configured.
- [ ] Alerts configured.
- [ ] Error reporting enabled.
- [ ] Dashboard updated if required.

---

# 10. Rollback

- [ ] Rollback procedure documented.
- [ ] Previous release available.
- [ ] Database rollback verified.
- [ ] Deployment artifacts archived.
- [ ] Recovery procedure documented.

---

# 11. Post-Deployment Verification

After deployment verify:

- [ ] Application accessible.
- [ ] Health checks passing.
- [ ] APIs responding correctly.
- [ ] Authentication functioning.
- [ ] Database functioning correctly.
- [ ] Monitoring reports healthy status.
- [ ] No critical errors in logs.
- [ ] Performance within expected range.

---

# 12. Documentation

- [ ] Deployment guide updated.
- [ ] Release notes updated.
- [ ] Configuration changes documented.
- [ ] Known issues documented.
- [ ] Changelog updated if applicable.

---

# Final Approval

Before production deployment:

- [ ] Technical review completed.
- [ ] Security review completed.
- [ ] Testing completed.
- [ ] Rollback plan approved.
- [ ] Stakeholders notified if required.
- [ ] Deployment approved.

---

# Deployment Completion Criteria

Deployment is considered successful only when:

- Build succeeds.
- Infrastructure is healthy.
- Database migration succeeds.
- Application starts correctly.
- Health checks pass.
- Monitoring reports normal operation.
- No critical issues remain.
- Rollback capability is confirmed.