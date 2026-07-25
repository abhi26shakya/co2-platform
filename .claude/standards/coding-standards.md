---
name: coding-standards
description: Defines universal engineering standards, coding principles, quality requirements, and best practices that govern all software development within the project regardless of language, framework, or technology stack.
version: 1.0
owner: software-architect
---

# Coding Standards

## Purpose

This document establishes the universal engineering standards that apply to every source file, service, library, script, infrastructure component, AI workflow, and automation within the project.

These standards exist to ensure that software remains understandable, maintainable, secure, scalable, and reliable throughout its lifecycle.

All contributors—including AI agents—must follow these standards.

---

# Core Engineering Principles

Every implementation should prioritize:

- Correctness
- Simplicity
- Readability
- Maintainability
- Testability
- Security
- Performance
- Scalability
- Reliability
- Consistency

When trade-offs are required, document the reasoning.

---

# General Rules

Always:

- write readable code
- favor clarity over cleverness
- keep functions focused
- keep modules cohesive
- minimize duplication
- remove dead code
- prefer composition over inheritance
- document non-obvious decisions
- preserve backward compatibility unless intentionally changed

Never:

- introduce unnecessary complexity
- commit commented-out code
- ignore compiler or linter warnings
- bypass quality checks
- hardcode secrets
- merge code that is not understood

---

# Code Organization

Projects should be organized into logical modules.

Each module should have:

- one clear responsibility
- minimal coupling
- well-defined interfaces
- predictable structure

Large files should be decomposed into smaller components.

---

# Function Design

Functions should:

- perform one responsibility
- have descriptive names
- minimize side effects
- return predictable results
- validate inputs
- handle errors appropriately

Avoid deeply nested control flow.

Prefer early returns when they improve readability.

---

# Class Design

Classes should:

- represent one concept
- expose minimal public interfaces
- hide implementation details
- depend on abstractions where practical
- remain small and cohesive

Avoid "god classes" that accumulate unrelated responsibilities.

---

# Error Handling

Errors should:

- be handled explicitly
- provide actionable context
- preserve original causes where appropriate
- avoid silent failures

Never suppress exceptions without documenting the rationale.

---

# Logging

Log:

- significant state changes
- failures
- retries
- startup and shutdown events
- security-relevant events

Do not log:

- passwords
- API keys
- tokens
- sensitive personal information
- confidential business data

Logs should support troubleshooting without exposing sensitive information.

---

# Configuration

Configuration should be externalized.

Use:

- environment variables
- configuration files
- secret managers

Never embed environment-specific values directly in source code.

---

# Security

Every implementation should follow secure-by-default principles.

Validate:

- inputs
- outputs
- permissions
- authentication
- authorization

Apply the principle of least privilege wherever possible.

---

# Performance

Optimize only after identifying measurable bottlenecks.

Prefer:

- efficient algorithms
- appropriate data structures
- caching where justified
- lazy loading where beneficial

Do not sacrifice maintainability for negligible performance gains.

---

# Testing

Every meaningful change should include appropriate tests.

Recommended testing layers:

- unit tests
- integration tests
- end-to-end tests
- regression tests

Tests should be deterministic, isolated, and maintainable.

---

# Documentation

Update documentation whenever:

- APIs change
- architecture changes
- configuration changes
- deployment changes
- public behavior changes

Documentation is part of the implementation—not an optional task.

---

# Code Reviews

Every significant change should undergo review.

Reviews should verify:

- correctness
- architecture
- readability
- security
- testing
- documentation
- performance

Feedback should focus on improving the code rather than criticizing contributors.

---

# AI-Assisted Development

AI-generated code must be reviewed using the same standards as human-written code.

AI assistance should:

- accelerate development
- improve consistency
- reduce repetitive work

It should never replace engineering judgment or validation.

---

# Definition of Done

A change is complete only when:

- implementation finished
- tests passing
- documentation updated
- security reviewed
- performance acceptable
- review approved
- standards followed

---

# Compliance

These standards apply to:

- Backend
- Frontend
- Infrastructure
- AI
- APIs
- Databases
- Automation
- Scripts
- Internal tools

Exceptions require documented architectural approval.

---

# End Goal

Create a codebase that remains understandable, maintainable, secure, scalable, and reliable for years by enforcing consistent engineering practices across every contributor, project, and AI-assisted development workflow.