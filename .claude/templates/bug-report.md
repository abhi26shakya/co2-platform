---
name: bug-report
description: Standard template for documenting, investigating, tracking, and resolving software defects.
version: 1.0
owner: qa-engineer
status: Open
---

# Bug Report

## Report Information

| Field | Value |
|--------|-------|
| Bug ID | |
| Title | |
| Reported By | |
| Assigned To | |
| Date Reported | |
| Status | Open / In Progress / Fixed / Verified / Closed / Reopened |
| Severity | Critical / High / Medium / Low |
| Priority | P0 / P1 / P2 / P3 |
| Environment | Development / Staging / Production |

---

# Executive Summary

Provide a concise description of:

- the issue
- affected functionality
- business impact
- current status

---

# Problem Description

Describe the defect clearly.

Include:

- expected behavior
- actual behavior
- affected users
- affected systems

---

# Environment

Document the environment where the issue occurs.

Examples:

Application Version

Operating System

Browser

Database Version

API Version

Cloud Environment

Device (if applicable)

---

# Preconditions

List any required conditions before reproducing the issue.

Examples:

- authenticated user
- existing dataset
- feature enabled
- specific configuration

---

# Steps to Reproduce

1.
2.
3.
4.

The steps should reliably reproduce the issue.

---

# Expected Result

Describe the correct system behavior.

---

# Actual Result

Describe what actually happens.

Include screenshots, logs, or error messages when available.

---

# Frequency

Choose one:

- Always
- Frequently
- Sometimes
- Rarely
- Unable to Reproduce

---

# Impact Assessment

## User Impact

Describe how users are affected.

---

## Business Impact

Describe operational or business consequences.

---

## Technical Impact

Describe technical consequences.

Examples:

- data corruption
- crashes
- performance degradation
- security risk

---

# Affected Components

Examples:

- Frontend
- Backend
- Database
- API
- Infrastructure
- Authentication
- AI / ML Pipeline

---

# Root Cause Analysis

Document the identified root cause.

If unknown:

```
Under Investigation
```

Include:

- contributing factors
- underlying issue
- affected modules

---

# Evidence

Attach or reference:

- screenshots
- logs
- stack traces
- recordings
- monitoring data

---

# Workaround

If available, describe any temporary workaround.

If none:

```
No known workaround.
```

---

# Proposed Fix

Summarize the planned solution.

Avoid implementation-specific details if the investigation is ongoing.

---

# Regression Risk

Assess the likelihood of introducing regressions.

Choose one:

- Low
- Medium
- High

Document affected areas.

---

# Related Issues

Reference:

- Feature Request
- Pull Request
- Previous Bugs
- Support Tickets
- Incidents

---

# Testing Plan

Verify the fix using:

- [ ] Unit Tests
- [ ] Integration Tests
- [ ] End-to-End Tests
- [ ] Regression Tests
- [ ] Performance Tests
- [ ] Security Tests

---

# Verification

QA should verify:

- [ ] Bug reproduced before fix
- [ ] Fix implemented
- [ ] Expected behavior confirmed
- [ ] Regression testing completed
- [ ] No new issues introduced

---

# Resolution

Document:

- implemented solution
- affected files
- deployment version
- deployment date

---

# Closure Criteria

The issue may be closed when:

- [ ] Root cause identified
- [ ] Fix merged
- [ ] Tests passing
- [ ] QA verified
- [ ] Documentation updated
- [ ] No outstanding blockers

---

# Timeline

| Date | Event | Owner |
|------|-------|-------|
| | Reported | |
| | Investigation Started | |
| | Root Cause Identified | |
| | Fix Implemented | |
| | QA Verification | |
| | Closed | |

---

# Lessons Learned

Document:

- preventive measures
- process improvements
- monitoring improvements
- testing improvements

---

# Related Documents

- Pull Request
- Testing Plan
- Architecture Review
- Release Notes
- Changelog

---

# Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| QA Engineer | | | |
| Engineering Lead | | | |
| Product Manager | | | |

---

# Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | | Initial Draft |

---

# Notes

Include any additional observations, references, or follow-up actions related to this defect.