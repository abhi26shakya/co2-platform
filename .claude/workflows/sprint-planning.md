---
name: sprint-planning
description: End-to-end workflow for planning, organizing, prioritizing, and managing an Agile sprint by converting roadmap objectives into executable engineering tasks with clear ownership, dependencies, risk management, and measurable outcomes.
version: 1.0
owner: project-manager
---

# Sprint Planning Workflow

## Purpose

Plan a complete engineering sprint that delivers measurable progress toward the product roadmap while balancing business priorities, technical debt, engineering capacity, quality, and project risk.

This workflow coordinates product, architecture, engineering, QA, DevOps, and documentation teams before implementation begins.

---

# When To Use

Use this workflow when:

- Starting a new sprint
- Beginning a milestone
- Planning an MVP
- Preparing a major release
- Replanning after significant scope changes
- Recovering from delayed work

Do not use for:

- Individual feature implementation
- Small bug fixes
- Hotfixes
- Code reviews

Dedicated workflows exist for those activities.

---

# Objectives

Define:

- Sprint Goal
- Sprint Scope
- Business Value
- Engineering Priorities
- Task Ownership
- Dependencies
- Risks
- Success Metrics

Every sprint should have a clear and measurable objective.

---

# Workflow Overview

```
Roadmap
      │
      ▼
Backlog Review
      │
      ▼
Prioritization
      │
      ▼
Architecture Review
      │
      ▼
Task Breakdown
      │
      ▼
Capacity Planning
      │
      ▼
Risk Assessment
      │
      ▼
Sprint Approval
      │
      ▼
Sprint Ready
```

---

# Participating Agents

Leadership

- Startup Product Manager
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

Operations

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

# Phase 1 — Roadmap Review

Startup Product Manager should review:

- product vision
- roadmap
- customer priorities
- business goals
- milestone deadlines

Determine the highest-value objectives for this sprint.

---

# Phase 2 — Backlog Refinement

Project Manager should review:

- feature backlog
- bug backlog
- technical debt
- documentation tasks
- infrastructure work
- research tasks

Remove:

- duplicates
- obsolete items
- low-priority work

Deliver a refined backlog.

---

# Phase 3 — Prioritization

Rank work using:

- Business Value
- Customer Impact
- Engineering Effort
- Technical Risk
- Dependencies
- Strategic Importance

Suggested frameworks:

- RICE
- MoSCoW
- WSJF

Document prioritization rationale.

---

# Phase 4 — Architecture Validation

Software Architect should verify:

- architectural readiness
- reusable components
- dependency order
- scalability implications
- required refactoring

Identify prerequisite work.

---

# Phase 5 — Task Breakdown

Break every selected feature into:

- objective
- deliverables
- owner
- dependencies
- estimated effort
- acceptance criteria

Tasks should be independently testable.

---

# Phase 6 — Engineering Planning

Assign work to:

Backend Engineer

Frontend Engineer

Database Engineer

API Engineer

Data Engineer

ML Engineer

Climate AI Engineer

Satellite Imagery Engineer

DevOps Engineer

Avoid overlapping ownership.

---

# Phase 7 — Capacity Planning

Project Manager should evaluate:

- engineering availability
- workload balance
- estimated effort
- sprint duration
- delivery confidence

Adjust sprint scope if capacity is exceeded.

---

# Phase 8 — Quality Planning

QA Engineer should define:

- testing strategy
- regression scope
- automation requirements
- acceptance validation
- release criteria

Quality planning begins before implementation.

---

# Phase 9 — Security & Performance Planning

Security Engineer should identify:

- security-sensitive work
- required reviews
- compliance considerations

Performance Engineer should identify:

- benchmark requirements
- optimization goals
- expected performance budgets

---

# Phase 10 — Risk Assessment

Identify:

Technical Risks

Product Risks

Infrastructure Risks

Schedule Risks

Security Risks

Performance Risks

For every risk include:

- likelihood
- impact
- mitigation
- owner

---

# Phase 11 — Sprint Metrics

Define:

Sprint Goal

Expected Velocity

Completion Rate

Bug Target

Coverage Target

Documentation Target

Performance Goals

Security Goals

Metrics should be measurable.

---

# Phase 12 — Sprint Approval

Project Manager should confirm:

✓ scope realistic

✓ priorities validated

✓ dependencies resolved

✓ risks documented

✓ ownership assigned

✓ acceptance criteria defined

Possible Outcomes:

Approved

Approved with Changes

Needs Replanning

---

# Phase 13 — Documentation

Documentation Engineer should update:

SPRINT_PLAN.md

SPRINT_BACKLOG.md

SPRINT_STATUS.md

PROJECT_PROGRESS.md

CONTEXT.md

Synchronize all planning documentation.

---

# Deliverables

Generate or update:

SPRINT_PLAN.md

SPRINT_BACKLOG.md

SPRINT_STATUS.md

SPRINT_METRICS.md

RISK_REGISTER.md

TASK_ASSIGNMENTS.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Sprint planning succeeds only if:

✓ sprint goal defined

✓ backlog refined

✓ priorities established

✓ architecture validated

✓ ownership assigned

✓ dependencies identified

✓ capacity confirmed

✓ risks documented

✓ QA planned

✓ security planned

✓ performance planned

✓ documentation synchronized

---

# Related Commands

Primary

- /sprint
- /roadmap
- /next

Supporting

- /feature
- /review
- /test
- /deploy

---

# Failure Handling

If sprint planning cannot be completed:

- document blockers
- identify missing requirements
- reduce sprint scope
- resolve critical dependencies
- repeat planning after issues are addressed

Never begin a sprint with undefined priorities or ownership.

---

# End Goal

Deliver a realistic, well-prioritized, and fully documented sprint plan that aligns engineering execution with product strategy, balances available capacity, minimizes delivery risk, and prepares the team to build high-quality software efficiently and predictably.