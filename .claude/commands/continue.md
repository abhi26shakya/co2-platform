---
name: continue
description: Restore the complete project context from repository state and project documentation, reconstruct recent work, identify unfinished tasks, determine current priorities, and generate an execution plan that allows development to continue seamlessly across Claude Code sessions.
agents:
  - project-manager
  - documentation-engineer
  - software-architect
  - startup-product-manager
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - data-engineer
  - ml-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - devops-engineer
  - security-engineer
  - performance-engineer
  - qa-engineer
  - code-reviewer
---

# Continue Command

## Purpose

Restore complete project context and determine exactly where development should resume.

This command enables seamless continuation across Claude Code sessions.

No implementation should begin until the current state has been reconstructed.

---

# Objectives

Answer the following questions:

- What project is this?
- What has already been completed?
- What is currently in progress?
- What is blocked?
- What remains to be done?
- What should happen next?
- Are there any important decisions to remember?

---

# General Rules

Always:

- Reconstruct context before coding.
- Trust repository evidence over assumptions.
- Read existing documentation first.
- Preserve historical decisions.
- Continue existing plans instead of creating new ones.

Never:

- Restart completed work.
- Ignore project memory.
- Duplicate documentation.
- Lose historical context.

---

# Inputs

Review:

PROJECT_PROGRESS.md

CONTEXT.md

ROADMAP.md

SPRINT_PLAN.md

CHANGELOG.md

README.md

ARCHITECTURE.md

TECHNICAL_DEBT.md

AUDIT_REPORT.md

FEATURE_BACKLOG.md

Recent commits

Repository structure

Current branch

---

# Phase 1 – Repository Overview

Project Manager should summarize:

- project purpose
- current maturity
- repository structure
- major systems
- active branch

Produce a concise project overview.

---

# Phase 2 – Progress Reconstruction

Review:

Completed work

Current work

Pending work

Blocked work

Deferred work

Cancelled work

Rebuild an accurate timeline.

---

# Phase 3 – Recent Decisions

Documentation Engineer should identify:

- architecture decisions
- product decisions
- technical trade-offs
- rejected approaches
- migration decisions

Summarize only the important decisions that affect future work.

---

# Phase 4 – Architecture Status

Software Architect should evaluate:

- current architecture
- recent architectural changes
- known limitations
- scalability concerns
- unfinished architectural work

---

# Phase 5 – Sprint Status

Project Manager should identify:

Sprint Goal

Completed Stories

Remaining Stories

Blocked Stories

Sprint Health

Velocity (if available)

---

# Phase 6 – Technical Debt

Review:

known issues

TODOs

refactoring opportunities

missing tests

documentation gaps

dependency upgrades

Prioritize remaining debt.

---

# Phase 7 – Agent Status

Determine outstanding work for:

Backend Engineer

Frontend Engineer

Database Engineer

API Engineer

Data Engineer

ML Engineer

Climate AI Engineer

Satellite Imagery Engineer

DevOps Engineer

Security Engineer

Performance Engineer

QA Engineer

Documentation Engineer

Only assign work that is genuinely pending.

---

# Phase 8 – Risk Review

Identify:

technical risks

security risks

performance risks

deployment risks

research risks

Summarize mitigation status.

---

# Phase 9 – Immediate Priorities

Identify:

Highest Priority

Second Priority

Third Priority

Explain why each task should be completed next.

---

# Phase 10 – Recommended Execution Plan

Produce a practical action plan for the next development session.

For each task include:

- objective
- owner
- dependencies
- estimated effort
- completion criteria

---

# Phase 11 – Documentation Synchronization

Documentation Engineer should verify:

PROJECT_PROGRESS.md

CONTEXT.md

ROADMAP.md

CHANGELOG.md

SPRINT_STATUS.md

Ensure documentation matches repository state.

---

# Deliverables

Generate or update:

PROJECT_PROGRESS.md

CONTEXT.md

SESSION_SUMMARY.md

NEXT_ACTIONS.md

SPRINT_STATUS.md

Merge intelligently without overwriting useful information.

---

# Final Report Format

Produce:

## Executive Summary

## Project Overview

## Current Status

## Completed Work

## Work In Progress

## Outstanding Tasks

## Recent Decisions

## Architecture Status

## Sprint Status

## Technical Debt

## Risks

## Immediate Priorities

## Recommended Execution Plan

## Documentation Status

## Next Session Checklist

---

# Quality Checklist

Before finishing verify:

✓ repository reviewed

✓ project progress reconstructed

✓ context restored

✓ architecture understood

✓ sprint status updated

✓ technical debt reviewed

✓ risks documented

✓ priorities identified

✓ execution plan created

✓ documentation synchronized

---

# Success Criteria

This command succeeds only if:

- The entire project context is reconstructed.
- No previously completed work is repeated.
- Current priorities are clear.
- Documentation matches repository state.
- The next Claude Code session can begin immediately without additional investigation.

---

# End Goal

Restore the project's complete working context so development can continue seamlessly across sessions with minimal overhead, preserved institutional knowledge, clear priorities, and an actionable execution plan.