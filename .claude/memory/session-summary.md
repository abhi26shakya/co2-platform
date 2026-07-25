# Session Summary

## Purpose

This document records the outcome of the most recent development session.

It provides enough information for Claude Code or another developer to immediately resume work without re-analyzing the repository.

This file should represent the **current working state** of the project and should be updated at the end of every significant development session.

---

# Session Information

## Date

YYYY-MM-DD

---

## Session ID

Provide a unique identifier if needed.

Example:

Session-001

---

## Participants

Examples:

- Claude Code
- Developer
- Team Members

---

# Session Goal

Describe the primary objective of this development session.

Examples:

- Implement a new feature
- Fix production bugs
- Refactor architecture
- Improve performance
- Write documentation
- Design a new module

---

# Work Completed

Summarize everything completed during this session.

For each completed task include:

- description
- affected components
- related specifications
- testing status

Example:

### Completed

- Designed satellite ingestion module
- Implemented authentication API
- Added database migration
- Updated deployment workflow

---

# Files Modified

List important files modified during the session.

Example:

Frontend

- app/dashboard/page.tsx
- components/map/Map.tsx

Backend

- api/routes/emissions.py
- services/model_service.py

Infrastructure

- docker-compose.yml

Documentation

- docs/API.md
- docs/Architecture.md

---

# Decisions Made

Record important decisions made during the session.

Include:

- decision
- rationale
- impact

Avoid repeating long architectural discussions.

Reference `architecture-decisions.md` when appropriate.

---

# Current Project Status

Select the current project stage.

Possible values:

- Planning
- Architecture Design
- Active Development
- Testing
- Deployment
- Maintenance

Current Status:

> Active Development

---

# Outstanding Work

Describe work that was started but not completed.

For each item include:

- current progress
- blockers
- dependencies
- next step

---

# Known Issues

Document any issues discovered during the session.

Include:

- bugs
- technical debt
- unexpected behavior
- failed experiments

Reference `known-limitations.md` if the issue is long-term.

---

# Testing Summary

Summarize testing performed.

Examples:

- Unit Tests
- Integration Tests
- Manual Testing
- API Testing
- Performance Testing

Record:

- tests executed
- results
- failures
- coverage (if available)

---

# Risks

Identify risks introduced or discovered.

Examples:

- architecture risks
- deployment risks
- performance concerns
- security concerns
- dependency risks

Include mitigation plans where appropriate.

---

# Next Recommended Tasks

Prioritize the next actions.

Example:

## High Priority

- Complete ML inference pipeline
- Finish authentication middleware

## Medium Priority

- Improve dashboard UI
- Optimize database queries

## Low Priority

- Update documentation
- Refactor utilities

---

# Blockers

Record anything preventing further progress.

Examples:

- waiting for design approval
- missing dataset
- unresolved bug
- external dependency
- infrastructure issue

If no blockers exist, explicitly state:

> None

---

# Related Specifications

Reference specifications worked on during this session.

Examples:

- specs/active/001-data-pipeline.md
- specs/active/002-co2-estimation.md

---

# Memory Updates

List memory files that should also be updated.

Possible files:

- project-history.md
- completed-features.md
- architecture-decisions.md
- pending-work.md
- lessons-learned.md

---

# Session Metrics

Optionally record:

- Features completed
- Bugs fixed
- Files modified
- Tests added
- Documentation updated
- Pull Requests created

These metrics help track long-term project progress.

---

# Handover Notes

Provide a concise summary for the next development session.

Include:

- current state
- immediate priorities
- important context
- recommended starting point

The next developer or Claude session should be able to continue from this section without additional explanation.

---

# Update Rules

Update this document:

- at the end of every significant session
- after completing a milestone
- before switching major tasks
- before ending a long Claude conversation

Replace outdated session information with the latest session.

Historical information belongs in:

- project-history.md
- completed-features.md
- architecture-decisions.md

This document should always represent the **most recent development session**.