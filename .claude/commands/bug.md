---
name: bug
description: Investigate, reproduce, prioritize, fix, validate, document, and close software defects using a structured engineering workflow that emphasizes root-cause analysis, regression prevention, and production stability.
agents:
  - project-manager
  - qa-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - security-engineer
  - performance-engineer
  - documentation-engineer
  - code-reviewer
---

# Bug Command

## Purpose

Investigate and resolve software defects using a structured engineering workflow.

Focus on identifying the root cause rather than treating symptoms.

Every bug fix should reduce future maintenance effort.

---

# Objectives

Answer the following questions:

- What is the bug?
- Can it be reproduced?
- What is the root cause?
- Which components are affected?
- What is the safest fix?
- Does the fix introduce regressions?
- Is documentation updated?
- Can the issue be closed?

---

# General Rules

Always:

- Reproduce before fixing.
- Identify the root cause.
- Prefer minimal, maintainable fixes.
- Verify the solution.
- Add or update tests.
- Document the resolution.

Never:

- Guess the cause.
- Apply temporary hacks without documenting them.
- Ignore related edge cases.
- Close issues without validation.

---

# Inputs

Review:

- Bug report
- Error logs
- Stack traces
- Screenshots
- User reports
- Test failures
- Monitoring alerts
- Recent commits
- Related documentation

---

# Phase 1 – Bug Intake

Project Manager should capture:

- summary
- severity
- priority
- affected users
- affected environments
- reported by
- business impact

Assign an initial severity:

Critical

High

Medium

Low

Enhancement

---

# Phase 2 – Reproduction

QA Engineer should determine:

- exact reproduction steps
- expected behavior
- actual behavior
- reproducibility
- affected platforms
- affected browsers/devices if applicable

If the issue cannot be reproduced:

- gather more evidence
- identify missing information
- avoid speculative fixes

---

# Phase 3 – Root Cause Analysis

Software Architect should identify:

- architectural causes
- dependency issues
- design flaws
- module interactions
- historical context

Focus on why the defect occurred.

---

# Phase 4 – Component Analysis

Determine affected areas:

Backend

Frontend

Database

API

Infrastructure

Authentication

Authorization

Caching

AI workflows

Satellite processing

Data pipelines

Document every affected subsystem.

---

# Phase 5 – Implementation

Relevant engineering agents should:

Backend Engineer

- fix business logic
- improve validation
- update services

Frontend Engineer

- correct UI behavior
- improve state handling
- resolve rendering issues

Database Engineer

- repair schema problems
- validate migrations
- optimize queries

API Engineer

- correct API behavior
- maintain compatibility

Implement the smallest safe fix.

---

# Phase 6 – Security Review

Security Engineer should verify:

- no vulnerabilities introduced
- authentication unaffected
- authorization preserved
- input validation complete

Escalate security-related defects immediately.

---

# Phase 7 – Performance Review

Performance Engineer should verify:

- performance unchanged or improved
- no unnecessary resource usage
- no latency regressions

Measure before and after when possible.

---

# Phase 8 – Testing

QA Engineer should execute:

- unit tests
- integration tests
- regression tests
- edge-case testing
- reproduction verification

Add new automated tests whenever practical.

---

# Phase 9 – Code Review

Code Reviewer should inspect:

- maintainability
- readability
- architectural compliance
- duplication
- technical debt

Confirm the fix is appropriate.

---

# Phase 10 – Documentation

Documentation Engineer should update:

BUG_REPORT.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

API documentation if affected

Architecture documentation if affected

---

# Root Cause Summary

Document:

Problem

Root Cause

Affected Components

Fix Applied

Tests Added

Lessons Learned

Preventive Actions

---

# Severity Matrix

Critical

- production outage
- data loss
- security breach

High

- major feature unavailable
- widespread failures

Medium

- limited functionality affected

Low

- cosmetic issue
- minor inconvenience

Enhancement

- behavior improvement

---

# Deliverables

Generate or update:

BUG_REPORT.md

ROOT_CAUSE_ANALYSIS.md

FIX_SUMMARY.md

TEST_REPORT.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Final Report Format

Produce:

## Executive Summary

## Bug Description

## Severity

## Business Impact

## Reproduction Steps

## Root Cause Analysis

## Affected Components

## Implementation Summary

## Security Review

## Performance Review

## Testing Results

## Regression Assessment

## Documentation Updates

## Lessons Learned

## Preventive Actions

## Closure Recommendation

---

# Quality Checklist

Before finishing verify:

✓ bug reproduced

✓ root cause identified

✓ minimal fix implemented

✓ architecture respected

✓ security reviewed

✓ performance reviewed

✓ regression testing completed

✓ automated tests updated

✓ documentation synchronized

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- The bug is reproducible or clearly understood.
- The root cause is identified.
- The fix resolves the issue.
- No regressions are introduced.
- Documentation reflects the resolution.
- Preventive actions are recorded.

---

# End Goal

Resolve software defects in a repeatable, evidence-based manner that restores correct behavior, improves long-term maintainability, and reduces the likelihood of similar issues recurring.