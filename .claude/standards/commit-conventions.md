---
name: commit-conventions
description: Defines standardized commit message conventions, semantic versioning rules, changelog generation guidelines, and AI-assisted commit practices for all repositories using this framework.
version: 1.0
owner: project-manager
---

# Commit Conventions

## Purpose

Commit messages are part of the project's documentation.

Every commit should clearly communicate **what changed**, **why it changed**, and **its impact**.

Consistent commit messages improve:

- readability
- debugging
- code reviews
- release automation
- changelog generation
- repository history

These conventions apply to both human and AI contributors.

---

# Guiding Principles

Every commit should be:

- Small
- Atomic
- Focused
- Descriptive
- Reviewable
- Reversible

One commit should represent one logical change.

---

# Commit Format

```
<type>(<scope>): <short summary>

<optional body>

<optional footer>
```

Example:

```text
feat(auth): add JWT refresh token support

Implement refresh token rotation with automatic expiration
to improve authentication security.

Closes #42
```

---

# Commit Types

## feat

A new feature.

Example:

```text
feat(api): add CO₂ prediction endpoint
```

---

## fix

Bug fix.

Example:

```text
fix(auth): resolve session timeout issue
```

---

## refactor

Internal code improvement without changing behavior.

Example:

```text
refactor(database): simplify repository layer
```

---

## perf

Performance improvement.

Example:

```text
perf(api): reduce response latency using caching
```

---

## docs

Documentation changes only.

Example:

```text
docs(readme): update installation guide
```

---

## test

Tests only.

Example:

```text
test(api): add integration tests for emissions endpoint
```

---

## build

Build system changes.

Example:

```text
build(ci): update GitHub Actions workflow
```

---

## ci

Continuous Integration changes.

Example:

```text
ci: enable dependency vulnerability scanning
```

---

## style

Formatting or style changes only.

No functional behavior changes.

Example:

```text
style(frontend): apply prettier formatting
```

---

## chore

Routine maintenance.

Examples:

```text
chore: update dependencies

chore: remove unused assets
```

---

## revert

Revert a previous commit.

Example:

```text
revert: revert caching implementation
```

---

# Scope

Scopes identify the affected area.

Examples:

```text
auth

api

frontend

backend

database

deployment

security

ml

satellite

docs

ci

config

performance
```

Choose the smallest meaningful scope.

---

# Summary Line

The summary should:

- use the imperative mood
- begin with a verb
- stay under 72 characters
- avoid unnecessary punctuation
- describe the primary change

Good:

```text
add user authentication

improve cache performance

fix token validation
```

Avoid:

```text
fixed bug

changes

update

misc work
```

---

# Commit Body

Include a body when additional context is helpful.

Explain:

- why
- design decisions
- trade-offs
- limitations
- migration notes

Do not repeat the summary.

---

# Footer

Optional footer may include:

```text
Closes #25

Fixes #18

Refs #42
```

For breaking changes:

```text
BREAKING CHANGE:

Authentication API now requires OAuth2 tokens.
```

---

# Semantic Versioning

Commit types influence releases.

| Commit Type | Version Impact |
|--------------|----------------|
| feat | Minor |
| fix | Patch |
| perf | Patch |
| refactor | None |
| docs | None |
| style | None |
| test | None |
| chore | None |
| build | None |
| ci | None |
| BREAKING CHANGE | Major |

---

# Good Examples

```text
feat(auth): implement OAuth login
```

```text
fix(database): prevent duplicate migrations
```

```text
perf(api): cache satellite imagery metadata
```

```text
docs(architecture): update system diagram
```

```text
refactor(backend): simplify validation pipeline
```

---

# Poor Examples

```text
update
```

```text
changes
```

```text
fix stuff
```

```text
new commit
```

```text
final version
```

Avoid vague commit messages.

---

# AI-Assisted Commits

AI-generated commits should:

- follow the same format
- remain focused
- avoid unrelated changes
- accurately summarize implementation

AI should never generate misleading commit messages.

---

# Commit Frequency

Prefer:

- small commits
- logical milestones
- frequent integration

Avoid:

- massive commits
- unrelated changes
- "end of day" commits containing many independent modifications

---

# History Quality

Git history should read like an engineering narrative.

A reviewer should understand project evolution by reading commit messages alone.

---

# Commit Checklist

Verify:

✓ correct commit type

✓ meaningful scope

✓ concise summary

✓ optional body when needed

✓ issue references included

✓ no unrelated changes

✓ follows semantic versioning

---

# Success Criteria

Commit conventions succeed when:

✓ history is readable

✓ releases are automated

✓ changelogs are accurate

✓ debugging is easier

✓ collaboration improves

✓ commits remain searchable

---

# Related Standards

- git-workflow.md
- branching-strategy.md
- coding-standards.md
- documentation-standards.md

---

# Exceptions

Exceptions require documented justification.

Temporary or emergency commits should be squashed before merging whenever practical.

---

# End Goal

Create a clean, consistent, and meaningful Git history that supports engineering collaboration, automated releases, semantic versioning, changelog generation, AI-assisted development, and long-term project maintainability through standardized, descriptive, and focused commit messages.