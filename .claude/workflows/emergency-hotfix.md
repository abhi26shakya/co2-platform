---
name: emergency-hotfix
description: Comprehensive workflow for responding to critical production incidents through rapid triage, diagnosis, mitigation, implementation, validation, deployment, communication, and post-incident analysis while minimizing downtime and operational risk.
version: 1.0
owner: release-manager
---

# Emergency Hotfix Workflow

## Purpose

Restore production stability as quickly and safely as possible during critical incidents.

Emergency hotfixes prioritize restoring service while maintaining engineering discipline through controlled validation, communication, documentation, and post-incident learning.

Emergency changes should remain exceptional rather than routine.

---

# When To Use

Use this workflow when:

- Production service is unavailable
- Critical production bug discovered
- Security vulnerability requires immediate remediation
- Data integrity is at risk
- Major customer-facing functionality fails
- Critical infrastructure failure occurs

Do not use for:

- Planned releases
- Feature development
- Routine bug fixes
- Refactoring
- Performance improvements without production impact

---

# Objectives

Restore:

- Service Availability
- Data Integrity
- System Stability
- Security
- Customer Experience

Then determine the root cause and prevent recurrence.

---

# Workflow Overview

```
Production Incident
          │
          ▼
Incident Triage
          │
          ▼
Severity Assessment
          │
          ▼
Immediate Mitigation
          │
          ▼
Root Cause Investigation
          │
          ▼
Hotfix Implementation
          │
          ▼
Emergency Validation
          │
          ▼
Approval
          │
          ▼
Production Deployment
          │
          ▼
Monitoring
          │
          ▼
Post-Incident Review
          │
          ▼
Preventive Actions
```

---

# Participating Agents

Leadership

- Project Manager
- Startup Product Manager
- Release Manager

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
- Security Engineer
- Performance Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Severity Levels

## Severity 1 — Critical

Examples:

- Complete production outage
- Data corruption
- Active security compromise
- Authentication unavailable
- Payment failures
- Core API unavailable

Response:

Immediate

---

## Severity 2 — High

Examples:

- Major feature unavailable
- Significant performance degradation
- Large user impact

Response:

Highest priority.

---

## Severity 3 — Medium

Examples:

- Limited functionality affected
- Workaround available

Response:

Current sprint.

---

## Severity 4 — Low

Examples:

- Cosmetic issue
- Minor inconvenience

Response:

Normal bug workflow.

---

# Phase 1 — Incident Triage

Project Manager should record:

- incident ID
- detection time
- reporter
- affected systems
- business impact
- current status
- severity

Open an incident record immediately.

---

# Phase 2 — Initial Mitigation

DevOps Engineer should determine whether service can be restored quickly using:

- rollback
- feature flag
- configuration change
- traffic routing
- service restart
- scaling
- failover

Restore service before implementing risky code changes whenever practical.

---

# Phase 3 — Root Cause Investigation

Software Architect and relevant engineers should determine:

- triggering event
- affected components
- failure mechanism
- contributing factors
- historical occurrences

Avoid speculative fixes.

---

# Phase 4 — Hotfix Planning

Determine:

- smallest safe fix
- deployment strategy
- rollback strategy
- testing scope
- communication plan

Prefer minimal code changes.

---

# Phase 5 — Hotfix Implementation

Relevant engineers implement the fix.

Focus on:

- correctness
- simplicity
- minimal scope
- production safety

Avoid unrelated refactoring.

---

# Phase 6 — Emergency Validation

QA Engineer should verify:

- incident resolved
- critical workflows operational
- no immediate regressions
- deployment readiness

Testing should focus on high-risk functionality while remaining proportional to the urgency.

---

# Phase 7 — Expedited Review

Code Reviewer should evaluate:

- correctness
- risk
- maintainability
- rollback feasibility

Security Engineer should verify:

- no new vulnerabilities introduced

Performance Engineer should verify:

- no significant regressions

Use an expedited review process without bypassing critical quality gates.

---

# Phase 8 — Emergency Deployment

DevOps Engineer should:

- deploy hotfix
- verify deployment
- monitor logs
- monitor infrastructure
- monitor application health

Deploy only the approved hotfix.

---

# Phase 9 — Production Monitoring

Observe:

- application health
- error rate
- response time
- infrastructure metrics
- customer reports
- business metrics

Continue enhanced monitoring until stability is confirmed.

---

# Phase 10 — Communication

Release Manager should communicate:

- incident status
- customer impact
- mitigation
- expected resolution
- deployment status
- recovery confirmation

Maintain regular stakeholder updates.

---

# Phase 11 — Post-Incident Review

Conduct a retrospective covering:

Timeline

Root Cause

Detection

Response

Recovery

Communication

Lessons Learned

Preventive Actions

Focus on systemic improvements rather than assigning blame.

---

# Phase 12 — Documentation

Documentation Engineer should update:

INCIDENT_REPORT.md

ROOT_CAUSE_ANALYSIS.md

HOTFIX_REPORT.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Document the complete incident lifecycle.

---

# Preventive Actions

Identify opportunities to improve:

- monitoring
- alerting
- testing
- architecture
- deployment
- documentation
- automation
- engineering process

Create follow-up work items for long-term improvements.

---

# Emergency Checklist

Verify:

✓ incident classified

✓ mitigation attempted

✓ root cause identified

✓ hotfix implemented

✓ emergency tests passed

✓ review completed

✓ deployment successful

✓ monitoring healthy

✓ stakeholders informed

✓ documentation updated

✓ preventive actions recorded

---

# Deliverables

Generate or update:

INCIDENT_REPORT.md

ROOT_CAUSE_ANALYSIS.md

HOTFIX_REPORT.md

TIMELINE.md

POST_INCIDENT_REVIEW.md

ACTION_ITEMS.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Emergency response succeeds only if:

✓ production restored

✓ users minimally impacted

✓ hotfix validated

✓ monitoring healthy

✓ rollback available

✓ stakeholders informed

✓ root cause documented

✓ preventive actions created

✓ documentation synchronized

---

# Related Commands

Primary

- /bug
- /deploy
- /release

Supporting

- /review
- /test
- /security
- /audit

---

# Failure Handling

If the incident cannot be resolved:

- maintain mitigation
- escalate to engineering leadership
- preserve forensic evidence
- continue investigation
- communicate status regularly
- prepare alternative recovery strategies

Never introduce unvalidated changes that increase production risk.

---

# End Goal

Restore production service rapidly through a disciplined emergency response process that minimizes customer impact, preserves system integrity, validates every critical change, communicates transparently with stakeholders, documents the complete incident lifecycle, and converts every incident into actionable improvements that strengthen the reliability and resilience of future releases.