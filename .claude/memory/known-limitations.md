# Known Limitations

## Purpose

This document records the current technical limitations, constraints, accepted trade-offs, and known issues within the project.

Its purpose is to ensure that contributors understand the boundaries of the current system before implementing new features or making architectural decisions.

A limitation is not necessarily a bug.

Some limitations are intentional, while others exist due to technical, operational, or resource constraints.

---

# What Should Be Recorded

Document limitations related to:

- Architecture
- Performance
- Scalability
- Security
- Machine Learning
- Satellite Data
- APIs
- Database
- Infrastructure
- Deployment
- User Experience
- External Services

Do not record temporary development tasks.

Those belong in:

- pending-work.md

---

# Limitation Template

---

## Limitation ID

LIMIT-001

---

### Title

Short descriptive name.

Example:

Real-Time Satellite Imagery Not Supported

---

### Status

Choose one:

- Active
- Planned
- Mitigated
- Resolved

---

### Category

Examples:

- Architecture
- Backend
- Frontend
- Machine Learning
- Database
- Infrastructure
- Deployment
- Security
- Performance
- External Dependency

---

### Description

Describe the limitation.

Explain:

- what is limited
- where it occurs
- why it exists

---

### Root Cause

Describe the primary reason.

Examples:

- technical constraint
- external API
- resource limitation
- architectural decision
- research limitation

---

### Impact

Describe how the limitation affects:

- users
- developers
- performance
- scalability
- reliability

---

### Current Workaround

If applicable, describe the temporary solution.

If none:

> None

---

### Possible Future Solution

Describe potential improvements.

Reference:

future-ideas.md

when appropriate.

---

### Related Components

Examples:

- API
- Frontend
- Backend
- Database
- ML Pipeline
- Deployment

---

### Related Architecture Decisions

Reference ADRs when applicable.

---

### Related Tasks

Reference:

pending-work.md

if work is planned.

---

### Notes

Optional implementation notes.

---

# Active Limitations

Maintain all active limitations here.

Organize by priority.

---

## High Impact

Critical constraints that significantly affect the project.

---

## Medium Impact

Limitations that reduce functionality but have acceptable workarounds.

---

## Low Impact

Minor limitations with little operational impact.

---

# External Dependencies

Document external limitations such as:

- satellite providers
- third-party APIs
- cloud providers
- licensing restrictions
- rate limits
- dataset availability

These limitations are outside direct project control.

---

# Technical Debt

Record accepted technical debt.

For each item include:

- reason
- impact
- expected resolution
- priority

Avoid mixing technical debt with temporary bugs.

---

# Scalability Constraints

Document current scalability boundaries.

Examples:

- maximum dataset size
- processing throughput
- concurrent users
- storage capacity
- model inference limits

Update whenever benchmarks change.

---

# Security Constraints

Record known security limitations.

Examples:

- authentication assumptions
- infrastructure limitations
- dependency risks
- compliance gaps

Do not expose sensitive information.

Only document the limitation itself.

---

# Relationship with Other Memory Files

This document answers:

**What are the current technical limitations?**

Related files answer:

- project-context.md → What is the project?
- architecture-decisions.md → Why were decisions made?
- pending-work.md → What work remains?
- future-ideas.md → What improvements are planned?
- lessons-learned.md → What knowledge has been gained?

---

# Update Rules

Update this document whenever:

- a new limitation is discovered
- a limitation changes
- a workaround is identified
- a limitation is resolved
- scalability limits change
- infrastructure constraints change

When a limitation is fully resolved:

1. Mark it as **Resolved**.
2. Record the resolution date.
3. Reference the related completed feature.

Do not delete historical entries.

---

# Best Practices

Always:

- describe the limitation clearly
- explain its impact
- identify the root cause
- document workarounds
- reference related tasks
- update status over time

Never:

- use this file as a bug tracker
- record temporary debugging notes
- hide important constraints
- remove historical records

Historical context is valuable.

---

# Goal

This document should provide a complete understanding of the project's current technical boundaries.

A contributor should be be able to read this file and immediately understand:

- what limitations currently exist
- why they exist
- how they affect the project
- whether workarounds are available
- what future improvements may remove them