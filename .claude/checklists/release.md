# Release Checklist

## Purpose

This checklist verifies that a software release is complete, stable, documented, and ready for distribution.

A release should only occur after all engineering, testing, security, and deployment requirements have been satisfied.

---

# 1. Release Planning

- [ ] Release scope finalized.
- [ ] Release version determined.
- [ ] Release schedule confirmed.
- [ ] Stakeholders informed.
- [ ] Outstanding blockers reviewed.
- [ ] Release approval obtained.

---

# 2. Feature Verification

- [ ] Planned features completed.
- [ ] Deferred features documented.
- [ ] Acceptance criteria satisfied.
- [ ] No unfinished production features included.
- [ ] Feature flags reviewed.
- [ ] Experimental functionality disabled or documented.

---

# 3. Version Management

- [ ] Version number updated.
- [ ] Version consistent across the project.
- [ ] Git tag prepared.
- [ ] Release branch verified if applicable.
- [ ] Build metadata updated.

---

# 4. Testing Verification

- [ ] Unit tests passed.
- [ ] Integration tests passed.
- [ ] Regression tests passed.
- [ ] Performance testing completed.
- [ ] Security testing completed.
- [ ] User acceptance testing completed if required.

---

# 5. Documentation

- [ ] Release notes prepared.
- [ ] Changelog updated.
- [ ] API documentation updated.
- [ ] Deployment documentation updated.
- [ ] User documentation updated.
- [ ] Known limitations documented.

---

# 6. Security Review

- [ ] No unresolved critical vulnerabilities.
- [ ] Security review approved.
- [ ] Secrets verified.
- [ ] Dependencies reviewed.
- [ ] Compliance requirements satisfied.

---

# 7. Deployment Readiness

- [ ] Deployment checklist completed.
- [ ] Infrastructure verified.
- [ ] Environment configuration reviewed.
- [ ] Database migrations validated.
- [ ] Rollback strategy approved.

---

# 8. Monitoring

- [ ] Monitoring configured.
- [ ] Alerts configured.
- [ ] Error tracking enabled.
- [ ] Dashboards updated.
- [ ] Logging verified.

---

# 9. Backup & Recovery

- [ ] Backups completed.
- [ ] Backup restoration verified.
- [ ] Rollback procedure tested.
- [ ] Previous stable release available.

---

# 10. Communication

- [ ] Release announcement prepared.
- [ ] Internal teams informed.
- [ ] External users informed if applicable.
- [ ] Support documentation updated.
- [ ] Known issues communicated.

---

# 11. Post-Release Validation

Immediately after release verify:

- [ ] Application is operational.
- [ ] Health checks passing.
- [ ] Critical user flows functioning.
- [ ] APIs responding correctly.
- [ ] Monitoring healthy.
- [ ] No critical production errors.
- [ ] Performance within expected limits.

---

# 12. Release Completion

After successful validation:

- [ ] Release tagged.
- [ ] Release archived.
- [ ] Documentation finalized.
- [ ] Project history updated.
- [ ] Completed features recorded.
- [ ] Session summary updated.
- [ ] Stakeholders notified of successful release.

---

# Final Approval

Approve the release only if:

- All planned work is complete.
- Testing is successful.
- Security requirements are satisfied.
- Documentation is complete.
- Deployment readiness is confirmed.
- Rollback capability is available.
- Monitoring is operational.
- No critical risks remain.

---

# Release Completion Criteria

A release is considered complete only when:

- Production deployment succeeds.
- Post-release validation passes.
- Monitoring confirms healthy operation.
- Documentation is published.
- Historical records are updated.
- Release is formally approved.