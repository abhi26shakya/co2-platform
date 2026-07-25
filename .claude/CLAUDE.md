# AI Software Engineering Framework

Version: 1.0

---

# Purpose

This repository uses a structured AI Software Engineering Framework designed to build production-quality software through specialized agents, reusable commands, standardized workflows, and persistent project documentation.

The framework is intended to support long-term software development rather than one-off code generation.

Every decision should prioritize maintainability, scalability, readability, correctness, and long-term project health.

---

# Primary Objectives

The framework should always attempt to:

- Understand before modifying.
- Plan before implementing.
- Review before finalizing.
- Test before considering work complete.
- Document every significant change.
- Maintain architectural consistency.
- Minimize technical debt.
- Prefer simple solutions over unnecessary complexity.
- Preserve existing functionality.
- Keep the project production-ready.

---

# Engineering Principles

Always follow these principles.

## Correctness First

Never sacrifice correctness for speed.

Always understand the existing implementation before making changes.

If assumptions must be made, clearly state them.

---

## Incremental Development

Large changes should be divided into smaller milestones.

Every feature should be independently reviewable.

Avoid large, monolithic code changes whenever possible.

---

## Architecture First

Every implementation must fit within the existing architecture.

If architecture improvements are necessary:

- explain them
- justify them
- implement them carefully

Avoid introducing unnecessary complexity.

---

## Code Quality

Generated code should be:

- readable
- modular
- reusable
- well structured
- strongly typed where appropriate
- properly documented
- easy to maintain

Avoid duplicate logic.

Prefer composition over duplication.

---

# Documentation Policy

Every meaningful development task should update documentation when necessary.

Possible documents include:

- PROJECT_PROGRESS.md
- CONTEXT.md
- CHANGELOG.md
- ROADMAP.md
- ARCHITECTURE.md
- API_REFERENCE.md

Documentation should always remain synchronized with implementation.

---

# Testing Policy

Every new feature should include an appropriate validation strategy.

Depending on the project this may include:

- unit tests
- integration tests
- end-to-end tests
- manual verification

Never assume code works without verification.

---

# Security Policy

Never introduce:

- exposed secrets
- insecure authentication
- unsafe API usage
- SQL injection risks
- XSS vulnerabilities
- unsafe file handling
- unnecessary permissions

Prefer secure defaults.

---

# Performance Policy

Always consider:

- algorithm complexity
- memory usage
- unnecessary rendering
- database efficiency
- API latency
- bundle size

Optimize only when justified.

Avoid premature optimization.

---

# Documentation Before Completion

A task is not considered complete until:

- implementation is finished
- validation is completed
- documentation is updated
- known limitations are recorded

---

# Agent Collaboration

Each agent owns a specific responsibility.

Agents should not duplicate responsibilities.

When another specialist is better suited for a task, delegate conceptually rather than expanding scope.

The Project Manager coordinates all agents.

---

# Command Philosophy

Commands should represent reusable engineering workflows rather than single prompts.

Commands should:

- follow standardized processes
- produce deterministic outputs
- update documentation when appropriate
- preserve project consistency

---

# Project Memory

The framework should preserve long-term context through documentation.

Whenever appropriate, update:

- PROJECT_PROGRESS.md
- CONTEXT.md
- DECISIONS.md
- TECH_DEBT.md

Future sessions should be able to continue development without requiring previous conversation history.

---

# Development Workflow

Every significant feature should follow this lifecycle:

1. Understand the problem.
2. Analyze the current implementation.
3. Create an implementation plan.
4. Review architectural impact.
5. Implement incrementally.
6. Validate correctness.
7. Review code quality.
8. Update documentation.
9. Record project progress.
10. Recommend the next logical task.

---

# Default Behavior

Unless explicitly instructed otherwise:

- do not make destructive changes
- do not remove existing functionality
- preserve backward compatibility whenever reasonable
- prefer minimal, focused modifications
- explain major architectural decisions
- maintain clean commit-sized changes

---

# End Goal

This framework exists to function as a reusable AI Software Engineering Operating System capable of assisting with the complete lifecycle of professional software projects, from analysis and planning through implementation, testing, documentation, optimization, deployment, and long-term maintenance.