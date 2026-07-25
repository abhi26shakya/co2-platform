---
name: git-workflow
description: Defines the standardized Git workflow, collaboration model, branching lifecycle, pull request process, merge strategy, release management, and repository governance for all projects using this framework.
version: 1.0
owner: project-manager
---

# Git Workflow

## Purpose

This document defines the standard Git workflow for every project built using this engineering framework.

A consistent workflow improves collaboration, reduces merge conflicts, simplifies releases, enables automation, and maintains a reliable project history.

Every contributor—including AI agents—must follow this workflow.

---

# Guiding Principles

The Git workflow should be:

- Predictable
- Repeatable
- Traceable
- Collaborative
- Automated
- Safe
- Reviewable

Git history should explain **why** changes happened, not just **what** changed.

---

# Repository Model

Every repository should have:

- one protected production branch
- one integration branch (optional)
- short-lived feature branches
- release branches
- hotfix branches

Long-lived feature branches should be avoided.

---

# Standard Workflow

```
Issue
   │
   ▼
Feature Branch
   │
   ▼
Implementation
   │
   ▼
Local Testing
   │
   ▼
Pull Request
   │
   ▼
Code Review
   │
   ▼
CI Validation
   │
   ▼
Merge
   │
   ▼
Deployment
```

---

# Branch Lifecycle

Typical lifecycle:

```
main
  │
  ├── feature/*
  │
  ├── bugfix/*
  │
  ├── release/*
  │
  └── hotfix/*
```

Branches should remain short-lived.

Delete merged branches whenever practical.

---

# Creating Work

Before starting work:

- synchronize with the latest main branch
- create a new branch
- define the scope
- avoid unrelated changes

Every branch should represent one logical objective.

---

# Development

During development:

- commit frequently
- keep commits focused
- test locally
- update documentation
- resolve conflicts early

Avoid accumulating large unreviewable changes.

---

# Synchronization

Regularly synchronize feature branches with the latest main branch.

Prefer:

- small integrations
- frequent updates

Avoid long-running divergence.

---

# Pull Requests

Every significant change should use a Pull Request.

A Pull Request should include:

- purpose
- implementation summary
- testing performed
- related issues
- screenshots (if applicable)
- migration notes (if applicable)

Small Pull Requests are preferred.

---

# Code Review

Every Pull Request should verify:

- correctness
- architecture
- security
- performance
- testing
- documentation

Constructive feedback improves the project.

---

# Continuous Integration

Before merging, verify:

- build passes
- tests pass
- linting passes
- formatting passes
- security checks pass
- dependency checks pass

CI failures block merging.

---

# Merge Strategy

Prefer one merge strategy for consistency across the repository.

Recommended:

- Squash Merge for feature work
- Merge Commit for releases
- Fast-forward only where appropriate

Avoid unnecessary merge complexity.

---

# Conflict Resolution

Resolve conflicts by:

- understanding both changes
- preserving intended behavior
- rerunning tests
- requesting review when uncertain

Never overwrite changes without understanding them.

---

# Releases

Release branches should:

- stabilize upcoming versions
- receive only release-related fixes
- remain short-lived
- merge back into the primary branch after release

Release preparation follows the Release Workflow.

---

# Hotfixes

Hotfixes should:

- originate from production
- remain minimal
- receive expedited review
- deploy immediately after validation
- merge back into all affected branches

Avoid unrelated improvements during hotfixes.

---

# Version Tags

Every production release should receive:

- semantic version
- release tag
- release notes

Tags should remain immutable.

Examples:

```
v1.0.0

v1.2.3

v2.0.0
```

---

# Rollback

Every deployment should support rollback.

Rollback procedures should include:

- previous release tag
- deployment instructions
- migration rollback
- verification steps

Rollback readiness should be verified before deployment.

---

# Repository Hygiene

Maintain:

- clean branch history
- deleted merged branches
- updated documentation
- accurate tags
- protected branches

Avoid stale development branches.

---

# Automation

Automate whenever practical:

- testing
- linting
- formatting
- dependency scanning
- releases
- deployments

Automation improves consistency.

---

# AI Contributions

AI-generated changes should:

- use feature branches
- pass CI
- undergo code review
- satisfy project standards

AI contributions follow the same workflow as human contributions.

---

# Git Workflow Checklist

Verify:

✓ correct branch

✓ focused implementation

✓ tests passing

✓ documentation updated

✓ pull request created

✓ review completed

✓ CI successful

✓ merge approved

✓ release tagged (if applicable)

---

# Success Criteria

The Git workflow succeeds when:

✓ history remains understandable

✓ merges are predictable

✓ releases remain stable

✓ collaboration is efficient

✓ automation operates reliably

✓ rollback remains possible

✓ production history is traceable

---

# Related Standards

- branching-strategy.md
- commit-conventions.md
- coding-standards.md
- code-review-checklist.md
- testing-standards.md

---

# Exceptions

Workflow exceptions require:

- documented justification
- project manager approval
- architectural review if technical risk exists

Exceptions should remain uncommon.

---

# End Goal

Create a disciplined Git workflow that enables safe collaboration, reliable automation, predictable releases, clean repository history, and high engineering quality while supporting both human developers and AI-assisted development throughout the software lifecycle.