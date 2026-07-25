# Known Issues

## Purpose

This document tracks known issues, limitations, technical debt, unresolved problems, and accepted constraints within the project.

Its purpose is to provide transparency about the current state of the system and help developers understand existing challenges before making changes.

This document should always represent the latest known issues affecting the project.

---

# Issue Classification

Issues are categorized as:

## Bug

Unexpected behavior that violates requirements.

---

## Limitation

A known constraint or missing capability.

---

## Technical Debt

A temporary engineering compromise requiring future improvement.

---

## Enhancement

A desired improvement that is not currently implemented.

---

# Severity Levels

## Critical

Issues that:

- Break core functionality.
- Cause data loss.
- Create major security risks.
- Prevent deployment.

---

## High

Issues that:

- Affect important workflows.
- Reduce reliability.
- Impact many users.

---

## Medium

Issues that:

- Affect some functionality.
- Have available workarounds.

---

## Low

Issues that:

- Have minimal impact.
- Affect convenience or maintainability.

---

# Issue Template

---

## Issue ID

ISSUE-001

---

## Title

Short descriptive name.

Example:

Slow Dashboard Loading With Large Datasets

---

## Type

Choose:

- Bug
- Limitation
- Technical Debt
- Enhancement

---

## Severity

- Critical
- High
- Medium
- Low

---

## Status

- Open
- Investigating
- Planned
- In Progress
- Resolved
- Won't Fix

---

## Date Identified

YYYY-MM-DD

---

## Description

Describe:

- What is happening?
- Where does it occur?
- Why is it important?

---

## Expected Behavior

Describe what should happen.

---

## Current Behavior

Describe what currently happens.

---

## Impact

Explain the effect on:

- Users
- Developers
- Performance
- Reliability
- Security

---

## Affected Components

Examples:

- Frontend
- Backend
- Database
- API
- ML Pipeline
- Infrastructure

---

## Workaround

Describe any temporary solution.

If none:

> None

---

## Root Cause

Explain the underlying reason.

---

## Proposed Solution

Describe possible fixes or improvements.

---

## Priority

- Critical
- High
- Medium
- Low

---

## Related Tasks

Reference:

- pending-work.md
- roadmap.md
- GitHub issues

---

## Related Documentation

Reference:

- ARCHITECTURE.md
- SECURITY.md
- PERFORMANCE.md
- DECISIONS.md

---

# Active Issues

Maintain current unresolved issues here.

---

# Critical Issues

Issues requiring immediate attention.

---

# High Priority Issues

Issues affecting important functionality.

---

# Medium Priority Issues

Issues with acceptable workarounds.

---

# Low Priority Issues

Minor issues and improvements.

---

# Technical Debt Register

Track accumulated technical debt.

For each item include:

## Debt Item

Description:

Reason Introduced:

Impact:

Estimated Effort:

Priority:

Planned Resolution:

---

# Known Limitations

Document accepted limitations.

Examples:

- Unsupported platforms
- Scaling limitations
- Missing integrations
- External dependency constraints

---

# Resolved Issues

Keep historical records of resolved issues.

For each resolved issue record:

- Resolution date
- Solution implemented
- Related feature or release

Do not delete resolved issues.

---

# Issue Management Process

When a new issue is discovered:

1. Confirm the issue.
2. Classify the issue type.
3. Assign severity.
4. Identify affected components.
5. Create a resolution plan.
6. Update status as progress occurs.
7. Document the final resolution.

---

# Issue Review

Review issues regularly:

- During sprint planning.
- Before releases.
- During architecture reviews.

Remove outdated assumptions but preserve historical context.

---

# Related Documentation

- PROJECT_PROGRESS.md
- ROADMAP.md
- RISK_REGISTER.md
- SECURITY.md
- PERFORMANCE.md
- ARCHITECTURE.md
- logs/bugs.md

---

# Maintenance Guidelines

Update this document whenever:

- A new issue is discovered.
- An issue status changes.
- A limitation is removed.
- Technical debt is added or resolved.
- A workaround changes.
- A major risk is identified.

This document should always provide an accurate view of the current challenges and limitations of the project.