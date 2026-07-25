---
name: next
description: Analyze the complete project state and recommend the highest-priority next engineering task by evaluating roadmap progress, sprint status, technical debt, bugs, architecture, risks, dependencies, and overall project health.
agents:
  - startup-product-manager
  - project-manager
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - data-engineer
  - ml-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - security-engineer
  - performance-engineer
  - devops-engineer
  - qa-engineer
  - documentation-engineer
  - code-reviewer
---

# Next Command

## Purpose

Determine the single highest-value engineering task that should be completed next.

Prioritize work using repository evidence instead of assumptions.

This command guides execution.

It does not implement changes.

---

# Objectives

Answer the following questions:

- What is the most important task?
- Why should it be done now?
- What blocks it?
- What depends on it?
- Which agents are required?
- What is the expected impact?
- What should happen after it?

---

# General Rules

Always:

- Use repository evidence.
- Respect roadmap priorities.
- Consider business value.
- Consider technical dependencies.
- Minimize project risk.
- Explain every recommendation.

Never:

- Recommend arbitrary work.
- Ignore blockers.
- Ignore unfinished milestones.
- Suggest unnecessary refactoring.

---

# Inputs

Review:

PROJECT_PROGRESS.md

CONTEXT.md

ROADMAP.md

SPRINT_PLAN.md

SPRINT_STATUS.md

FEATURE_BACKLOG.md

BUG_REPORT.md

AUDIT_REPORT.md

TECHNICAL_DEBT.md

CHANGELOG.md

ARCHITECTURE.md

README.md

Repository structure

Recent commits

Current branch

---

# Phase 1 – Project Status

Project Manager should summarize:

- completed milestones
- active sprint
- work in progress
- blocked work
- remaining roadmap

Provide a concise snapshot.

---

# Phase 2 – Business Priority

Startup Product Manager should evaluate:

- customer value
- business impact
- roadmap alignment
- MVP importance
- strategic importance

Rank opportunities.

---

# Phase 3 – Architecture Dependencies

Software Architect should identify:

- prerequisite work
- dependency chains
- architectural blockers
- scalability considerations

Ensure recommendations follow architectural order.

---

# Phase 4 – Engineering Review

Relevant engineers should identify:

Backend

Frontend

Database

API

Data

ML

Climate AI

Satellite

DevOps

Outstanding implementation work only.

Ignore completed work.

---

# Phase 5 – Quality Review

QA Engineer should identify:

- failing tests
- missing coverage
- regression risks
- release blockers

Prioritize quality-critical work.

---

# Phase 6 – Security & Performance

Security Engineer should identify:

- critical vulnerabilities
- missing security work

Performance Engineer should identify:

- major bottlenecks
- optimization blockers

Escalate only significant findings.

---

# Phase 7 – Documentation Review

Documentation Engineer should identify:

- outdated documentation
- missing documentation
- synchronization issues

Documentation should not block critical engineering work unless required.

---

# Phase 8 – Technical Debt

Review:

high-priority debt

architectural debt

dependency upgrades

code smells

TODOs

missing tests

Rank by engineering impact.

---

# Phase 9 – Candidate Tasks

Generate a ranked list.

For each candidate include:

Title

Description

Business Value

Engineering Value

Estimated Effort

Risk

Dependencies

Required Agents

Expected Outcome

Rank at least five candidate tasks.

---

# Phase 10 – Priority Decision

Select exactly ONE task.

Explain:

Why now?

Why not the others?

Expected project impact.

This becomes the recommended next action.

---

# Phase 11 – Execution Plan

Produce:

Objective

Deliverables

Acceptance Criteria

Dependencies

Implementation Order

Testing Requirements

Documentation Updates

Estimated Complexity

Potential Risks

Completion Checklist

---

# Phase 12 – After Completion

Recommend:

Immediate Next Task

Following Task

Future Milestone

Show how today's work advances the roadmap.

---

# Deliverables

Generate or update:

NEXT_ACTIONS.md

PROJECT_PROGRESS.md

CONTEXT.md

SESSION_PLAN.md

PRIORITY_QUEUE.md

Merge intelligently without overwriting historical information.

---

# Final Report Format

Produce:

## Executive Summary

## Current Project Status

## Roadmap Progress

## Sprint Progress

## Outstanding Work

## Candidate Tasks

## Recommended Next Task

## Why This Task

## Execution Plan

## Required Agents

## Dependencies

## Risks

## Acceptance Criteria

## Deliverables

## What Comes Next

---

# Decision Framework

Prioritize work using:

1. Critical blockers
2. Security issues
3. Production bugs
4. Roadmap dependencies
5. High-value features
6. Technical debt
7. Performance improvements
8. Documentation improvements

Explain how the recommendation was selected.

---

# Quality Checklist

Before finishing verify:

✓ roadmap reviewed

✓ sprint reviewed

✓ project progress reviewed

✓ architecture reviewed

✓ technical debt reviewed

✓ blockers identified

✓ dependencies mapped

✓ candidate tasks ranked

✓ single recommendation selected

✓ execution plan created

✓ documentation updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- Exactly one highest-priority task is recommended.
- The recommendation is supported by repository evidence.
- Dependencies are identified.
- Execution is clearly planned.
- Documentation reflects the latest state.
- The next development session can begin immediately.

---

# End Goal

Act as the project's engineering decision engine by continuously identifying the highest-value next action, explaining why it matters, coordinating the required specialists, and ensuring every development session contributes to the project's long-term roadmap in the most efficient and strategically valuable way.