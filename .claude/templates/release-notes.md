---
name: release-notes
description: Standard template for documenting software releases, including new features, bug fixes, breaking changes, migrations, deployment information, and known issues.
version: 1.0
owner: release-manager
status: Draft
---

# Release Notes

## Release Information

| Field | Value |
|--------|-------|
| Release Version | |
| Release Name | |
| Release Date | |
| Release Type | Major / Minor / Patch / Hotfix |
| Release Manager | |
| Deployment Environment | Production / Staging |
| Status | Planned / Released / Rolled Back |

---

# Executive Summary

Provide a concise overview of the release.

Include:

- overall purpose
- major improvements
- expected business impact
- deployment summary

---

# Highlights

Summarize the most important changes.

Examples:

- New features
- Major improvements
- Critical fixes
- Performance enhancements

---

# New Features

For each feature include:

## Feature Name

### Description

Brief explanation.

### Benefits

Explain user value.

### Related Documents

- Feature Request
- Design Document
- Pull Request

---

# Improvements

Document improvements that are not entirely new features.

Examples:

- UI improvements
- API improvements
- Developer experience
- Reliability improvements

---

# Bug Fixes

| Bug ID | Description | Severity | Status |
|---------|-------------|----------|--------|
| | | | |

Reference related Bug Reports where applicable.

---

# Performance Improvements

Document measurable improvements.

Examples:

- API latency reduced
- Faster page loads
- Reduced memory usage
- Optimized database queries

Include benchmark comparisons if available.

---

# Security Updates

Document:

- vulnerabilities fixed
- dependency updates
- authentication improvements
- authorization changes
- encryption updates

Mention CVE identifiers if applicable.

---

# Breaking Changes

Clearly describe incompatible changes.

For each breaking change include:

- affected components
- migration instructions
- expected impact

If none:

```
No breaking changes.
```

---

# Database Changes

Document:

- schema updates
- migrations
- indexes
- constraints
- rollback strategy

If none:

```
No database changes.
```

---

# API Changes

Document:

- new endpoints
- deprecated endpoints
- removed endpoints
- version changes
- request/response updates

If none:

```
No API changes.
```

---

# Infrastructure Changes

Examples:

- deployment architecture
- Kubernetes
- Docker
- CI/CD
- cloud resources
- monitoring

---

# Dependency Updates

| Dependency | Previous Version | New Version | Reason |
|------------|------------------|-------------|--------|
| | | | |

---

# Migration Guide

If users or developers must perform migration steps, describe them clearly.

Example:

1. Update configuration.
2. Run database migrations.
3. Restart services.
4. Verify health checks.

If not applicable:

```
No migration required.
```

---

# Deployment Notes

Describe:

- deployment sequence
- feature flags
- rollout strategy
- verification steps

---

# Rollback Procedure

Document:

- rollback trigger
- rollback steps
- verification after rollback
- recovery plan

---

# Known Issues

Document remaining limitations.

| Issue | Impact | Workaround |
|------|--------|------------|
| | | |

If none:

```
No known issues.
```

---

# Compatibility

Specify supported versions.

Examples:

- Operating Systems
- Browsers
- Database Versions
- API Versions
- SDK Versions

---

# Upgrade Checklist

Verify:

- [ ] Configuration updated
- [ ] Database migrations completed
- [ ] Dependencies updated
- [ ] Health checks passed
- [ ] Monitoring verified
- [ ] Documentation updated

---

# Validation

Confirm:

- [ ] Deployment successful
- [ ] Smoke tests passed
- [ ] Regression tests passed
- [ ] Monitoring healthy
- [ ] Rollback tested (if applicable)

---

# Related Documents

- Changelog
- Pull Request
- Testing Plan
- Deployment Report
- Bug Reports
- Architecture Review

---

# Contributors

Recognize contributors to this release.

| Name | Role | Contribution |
|------|------|-------------|
| | | |

---

# Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| Release Manager | | | |
| Engineering Lead | | | |
| Product Manager | | | |

---

# Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | | Initial Draft |

---

# Appendix

Include:

- benchmark reports
- deployment logs
- migration scripts
- architecture diagrams
- additional references