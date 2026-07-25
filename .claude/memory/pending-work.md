# Pending Work

## Purpose

This document tracks all outstanding work required to move the project forward.

It serves as the project's active engineering backlog and helps Claude Code and human contributors identify the highest-priority tasks, dependencies, blockers, and implementation status.

Unlike `session-summary.md`, which only reflects the most recent development session, this document maintains the complete list of unfinished work across the entire project.

---

# Work Status

Each task should use one of the following statuses.

| Status | Meaning |
|----------|---------|
| Not Started | Work has not begun |
| In Progress | Actively being developed |
| Blocked | Waiting on dependencies or external input |
| Under Review | Awaiting review or testing |
| Ready for Testing | Implementation complete, testing pending |
| Completed | Finished (move to completed-features.md) |

---

# Priority Levels

Tasks should always be ordered by priority.

Priority definitions:

## Critical

Must be completed before other work can continue.

Examples:

- Security vulnerabilities
- Production failures
- Data loss risks

---

## High

Core functionality required for the next milestone.

---

## Medium

Important improvements that are not blocking progress.

---

## Low

Nice-to-have enhancements and cleanup tasks.

---

# Task Template

---

## Task ID

TASK-001

---

### Title

Short descriptive name.

---

### Priority

Critical / High / Medium / Low

---

### Status

Choose from:

- Not Started
- In Progress
- Blocked
- Under Review
- Ready for Testing

---

### Description

Describe the work to be completed.

Explain:

- objective
- expected outcome
- scope

---

### Motivation

Why is this task important?

What problem does it solve?

---

### Dependencies

List prerequisites.

Examples:

- another task
- architecture approval
- dataset availability
- external API
- deployment

If none:

> None

---

### Related Specifications

Reference associated specification files.

Example:

specs/active/003-api.md

---

### Estimated Effort

Examples:

- Small
- Medium
- Large
- Extra Large

Or estimate in engineering days.

---

### Owner

Examples:

- Backend Engineer
- Frontend Engineer
- DevOps Engineer
- ML Engineer

---

### Success Criteria

Define what completion looks like.

Example:

- API implemented
- Tests pass
- Documentation updated
- Deployment verified

---

### Notes

Additional implementation details.

---

# Active Backlog

Organize tasks under the following sections.

## Critical Priority

Add all critical tasks here.

---

## High Priority

Tasks required for the next milestone.

---

## Medium Priority

Important improvements.

---

## Low Priority

Future enhancements.

---

# Blocked Work

List blocked tasks separately.

For each blocked task include:

- blocker
- dependency
- expected resolution
- impact

---

# Upcoming Milestones

Example:

## Milestone 1

- Data ingestion
- Database
- API

---

## Milestone 2

- ML pipeline
- Dashboard
- Authentication

---

## Milestone 3

- Deployment
- Monitoring
- Optimization

Keep milestones aligned with project goals.

---

# Recently Started

Track tasks that have recently entered development.

Example:

| Task | Started | Owner |
|------|----------|-------|
| TASK-005 | YYYY-MM-DD | Backend Engineer |

---

# Ready to Start

List tasks with:

- no blockers
- approved specification
- available dependencies

These should be considered the default next tasks.

---

# Review Queue

Tasks waiting for:

- testing
- code review
- documentation
- deployment

Review tasks regularly.

---

# Update Rules

Update this document whenever:

- a new task is created
- task priority changes
- task status changes
- dependencies change
- blockers appear
- work is completed

Completed work should be moved to:

`completed-features.md`

Do not leave completed tasks in this file.

---

# Relationship with Other Memory Files

This file answers:

**What still needs to be done?**

Related files answer:

- `project-context.md` → What is the project?
- `session-summary.md` → What happened recently?
- `completed-features.md` → What has been finished?
- `project-history.md` → What milestones have been reached?
- `future-ideas.md` → What may be built later?

---

# Goal

This document should always provide an accurate, prioritized, and actionable view of the remaining work.

At any point, Claude Code should be able to read this file and immediately determine:

- what should be worked on next
- what is blocked
- what is most important
- what resources are required
- what defines successful completion