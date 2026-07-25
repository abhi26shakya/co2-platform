---
name: branching-strategy
description: Defines the standard branching model, branch lifecycle, protection rules, merge policies, release management, and versioning strategy for all repositories using this framework.
version: 1.0
owner: software-architect
---

# Branching Strategy

## Purpose

This document defines the standard branching strategy used across all projects built with this engineering framework.

A consistent branching model enables predictable collaboration, safer releases, cleaner Git history, simpler automation, and easier maintenance.

Every contributor—including AI agents—must follow this strategy.

---

# Objectives

The branching strategy should:

- isolate work
- reduce merge conflicts
- simplify releases
- enable continuous integration
- support rollback
- improve traceability
- protect production stability

---

# Branch Hierarchy

```
main
 │
 ├── release/*
 │
 ├── hotfix/*
 │
 ├── feature/*
 │
 ├── bugfix/*
 │
 ├── refactor/*
 │
 ├── docs/*
 │
 └── experiment/*
```

Each branch type has a clearly defined purpose.

---

# Main Branch

Purpose:

- production-ready code
- protected
- deployable at any time
- tagged releases

Rules:

- direct commits prohibited
- requires Pull Request
- requires review approval
- requires passing CI
- requires successful testing

Only stable code belongs here.

---

# Feature Branches

Purpose:

Develop new functionality.

Naming:

```
feature/user-authentication

feature/co2-prediction

feature/dashboard-redesign
```

Source:

```
main
```

Merge Target:

```
main
```

Delete after merge.

---

# Bugfix Branches

Purpose:

Resolve non-critical defects.

Naming:

```
bugfix/login-timeout

bugfix/report-generation

bugfix/api-validation
```

Source:

```
main
```

Merge Target:

```
main
```

Keep bug fixes focused on a single issue.

---

# Refactor Branches

Purpose:

Improve internal code quality without changing behavior.

Naming:

```
refactor/database-layer

refactor/api-routing

refactor/cache-system
```

Source:

```
main
```

Merge Target:

```
main
```

No feature additions should occur in refactor branches.

---

# Documentation Branches

Purpose:

Documentation improvements only.

Naming:

```
docs/api-guide

docs/architecture

docs/getting-started
```

Source:

```
main
```

Merge Target:

```
main
```

Avoid mixing documentation with unrelated code changes.

---

# Release Branches

Purpose:

Prepare an upcoming release.

Naming:

```
release/v1.4.0

release/v2.0.0
```

Source:

```
main
```

Activities:

- final testing
- documentation
- version updates
- release notes
- critical bug fixes

Merge back into:

- main

Delete after release.

---

# Hotfix Branches

Purpose:

Resolve production-critical issues.

Naming:

```
hotfix/security-patch

hotfix/payment-outage

hotfix/auth-failure
```

Source:

```
main
```

Merge back into:

- main

Deploy immediately after validation.

---

# Experimental Branches

Purpose:

Research or prototypes.

Naming:

```
experiment/new-ml-model

experiment/vector-search

experiment/ui-concept
```

These branches are temporary.

Experimental work should not reach production without review.

---

# Branch Naming Rules

Branch names should:

- use lowercase
- separate words using hyphens
- remain concise
- describe the objective

Examples:

```
feature/project-export

bugfix/token-refresh

release/v1.5.0
```

Avoid:

```
feature/new

test

fix1

temp

mybranch
```

---

# Branch Protection

Protect:

- main

Require:

✓ Pull Request

✓ passing CI

✓ review approval

✓ conversation resolution

✓ successful tests

✓ signed commits (optional)

Never bypass protection rules without documented approval.

---

# Merge Policy

Preferred merge strategy:

Feature

→ Squash Merge

Release

→ Merge Commit

Hotfix

→ Merge Commit

Avoid inconsistent merge strategies.

---

# Branch Lifetime

Recommended durations:

Feature

1–7 days

Bugfix

1–3 days

Refactor

1–5 days

Release

Less than 1 week

Hotfix

Hours to 1 day

Short-lived branches reduce merge conflicts.

---

# Synchronization

Long-running branches should regularly synchronize with:

```
main
```

Resolve conflicts early.

Avoid large integration efforts near completion.

---

# Version Mapping

Example:

```
main
↓

v2.1.0

release/v2.2.0

↓

v2.2.0

↓

main
```

Every production release should receive a semantic version tag.

---

# Deployment Mapping

Development

↓

Feature Branch

↓

Testing

↓

Main

↓

Production

Release branches may be introduced for larger releases.

---

# AI Development

AI-generated work should:

- use feature branches
- remain focused
- pass CI
- undergo review
- follow naming conventions

AI agents should never commit directly to protected branches.

---

# Branch Cleanup

After merge:

- delete merged branches
- remove stale branches
- archive abandoned experiments
- update documentation if needed

Keep the repository clean.

---

# Branching Checklist

Verify:

✓ correct branch type

✓ correct naming

✓ branch synchronized

✓ focused changes

✓ CI passing

✓ review completed

✓ merged correctly

✓ branch deleted

---

# Success Criteria

The branching strategy succeeds when:

✓ production remains stable

✓ merge conflicts are minimized

✓ releases remain predictable

✓ branch purpose is immediately obvious

✓ Git history stays clean

✓ collaboration scales effectively

---

# Related Standards

- git-workflow.md
- commit-conventions.md
- coding-standards.md
- code-review-checklist.md

---

# Exceptions

Branching exceptions require:

- documented justification
- project manager approval
- software architect approval for high-risk changes

Exceptions should remain rare.

---

# End Goal

Create a disciplined branching model that supports rapid development, safe collaboration, predictable releases, clean repository history, and reliable production deployments through short-lived branches, clear ownership, strong protection policies, and consistent engineering practices.