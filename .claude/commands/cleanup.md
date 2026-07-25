---
name: cleanup
description: Clean, organize, and simplify the repository by removing obsolete code, unused files, duplicate logic, temporary artifacts, stale documentation, outdated dependencies, and accumulated technical debt while preserving application behavior and project history.
agents:
  - project-manager
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - devops-engineer
  - documentation-engineer
  - security-engineer
  - qa-engineer
  - code-reviewer
---

# Cleanup Command

## Purpose

Improve repository health by removing unnecessary artifacts, simplifying the codebase, and reducing technical debt without changing application behavior.

Cleanup improves maintainability and developer productivity.

---

# Objectives

Answer the following questions:

- What is no longer needed?
- Which files are obsolete?
- Which dependencies are unused?
- Which code is duplicated?
- Which documentation is outdated?
- What technical debt can be safely removed?
- Does cleanup preserve behavior?

---

# General Rules

Always:

- Preserve application behavior.
- Remove only verified unused artifacts.
- Prefer incremental cleanup.
- Validate before deletion.
- Update documentation after cleanup.
- Keep version history intact.

Never:

- Delete code without understanding its purpose.
- Remove active feature flags unless approved.
- Delete documentation that still has historical value.
- Remove dependencies without verifying usage.

---

# Inputs

Review:

- repository structure
- source code
- dependency manifests
- build configuration
- documentation
- changelog
- technical debt log
- test reports

---

# Phase 1 – Repository Audit

Project Manager should identify:

- obsolete work
- abandoned features
- stale branches (if visible)
- unfinished experiments
- duplicated efforts

Produce a cleanup candidate list.

---

# Phase 2 – Code Cleanup

Software Architect should identify:

- dead code
- duplicate implementations
- unused abstractions
- unnecessary wrappers
- obsolete interfaces
- deprecated patterns

Recommend safe removal.

---

# Phase 3 – Backend Cleanup

Backend Engineer should review:

- unused services
- unused utilities
- dead endpoints
- unnecessary middleware
- obsolete configuration
- commented-out code

Remove only verified unused items.

---

# Phase 4 – Frontend Cleanup

Frontend Engineer should review:

- unused components
- unused hooks
- unused styles
- unused routes
- duplicated UI
- obsolete assets

Simplify project structure.

---

# Phase 5 – Database Cleanup

Database Engineer should evaluate:

- unused tables
- deprecated columns
- obsolete migrations
- unused indexes
- temporary tables

Never remove production data without explicit approval.

---

# Phase 6 – API Cleanup

API Engineer should inspect:

- deprecated endpoints
- unused serializers
- obsolete DTOs
- legacy response formats
- unused middleware

Preserve API compatibility unless migration is planned.

---

# Phase 7 – Dependency Cleanup

Review:

- unused packages
- duplicate packages
- outdated libraries
- deprecated dependencies
- unnecessary development tools

Recommend safe upgrades or removal.

---

# Phase 8 – Infrastructure Cleanup

DevOps Engineer should review:

- unused Docker files
- obsolete CI workflows
- unused scripts
- deprecated deployment configs
- old environment templates

Keep deployment reproducible.

---

# Phase 9 – Documentation Cleanup

Documentation Engineer should review:

- outdated guides
- duplicate documents
- obsolete architecture notes
- stale examples
- broken internal references

Update rather than delete when possible.

---

# Phase 10 – Security Validation

Security Engineer should verify:

- cleanup removes no security controls
- secrets remain protected
- configuration remains secure

Ensure cleanup does not reduce security.

---

# Phase 11 – Testing

QA Engineer should execute:

- unit tests
- integration tests
- regression tests
- smoke tests

Behavior must remain unchanged.

---

# Phase 12 – Code Review

Code Reviewer should verify:

- repository simpler
- maintainability improved
- behavior preserved
- cleanup justified
- documentation synchronized

Approve only evidence-based cleanup.

---

# Cleanup Categories

Safe candidates include:

- dead code
- unused imports
- duplicate utilities
- commented-out code
- temporary files
- generated artifacts
- obsolete assets
- stale documentation
- unused dependencies

Exercise caution with:

- migrations
- public APIs
- production configuration
- historical documentation

---

# Deliverables

Generate or update:

CLEANUP_REPORT.md

TECHNICAL_DEBT.md

DEPENDENCY_AUDIT.md

DOCUMENTATION_AUDIT.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Final Report Format

Produce:

## Executive Summary

## Repository Audit

## Code Cleanup

## Backend Cleanup

## Frontend Cleanup

## Database Cleanup

## API Cleanup

## Dependency Cleanup

## Infrastructure Cleanup

## Documentation Cleanup

## Security Validation

## Testing Results

## Technical Debt Removed

## Remaining Technical Debt

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ dead code removed

✓ duplicate code reduced

✓ unused dependencies identified

✓ obsolete documentation updated

✓ infrastructure cleaned

✓ security preserved

✓ tests passed

✓ behavior unchanged

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- Repository complexity decreases.
- Technical debt is reduced.
- Application behavior is unchanged.
- Documentation remains accurate.
- Tests continue to pass.
- Cleanup is fully documented.

---

# End Goal

Maintain a clean, organized, and sustainable repository by continuously removing obsolete artifacts, reducing technical debt, simplifying the codebase, and improving long-term maintainability without affecting application behavior.