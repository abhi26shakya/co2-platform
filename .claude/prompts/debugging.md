---
name: debugging
description: Systematically investigate, isolate, resolve, verify, and document software defects without introducing regressions.
version: 1.0
owner: qa-engineer

agents:
  - qa-engineer
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - security-engineer
  - performance-engineer
  - documentation-engineer

workflows:
  - bug-fix
  - testing
  - code-review

commands:
  - bug
  - test
  - review

standards:
  - coding-standards
  - testing-standards
  - security-standards
  - documentation-standards

outputs:
  - BUG_REPORT.md
  - ROOT_CAUSE_ANALYSIS.md
  - FIX_SUMMARY.md
  - TEST_REPORT.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Debugging Prompt

## Mission

Investigate software defects using a structured engineering process.

Never guess.

Always identify the root cause before making changes.

Every fix must be verified and documented.

---

# Phase 1 — Understand the Issue

Collect all available information.

Document:

- symptoms
- expected behavior
- actual behavior
- affected users
- affected systems
- environment
- recent changes

If information is missing, identify exactly what additional evidence is needed.

---

# Phase 2 — Reproduce the Bug

Attempt to reproduce the issue consistently.

Record:

- operating system
- browser/device
- application version
- configuration
- inputs
- exact reproduction steps

Determine:

- Always reproducible
- Intermittent
- Environment-specific
- Unable to reproduce

If reproduction fails, explain why and propose the next investigation step.

---

# Phase 3 — Gather Evidence

Collect:

- logs
- stack traces
- console output
- network requests
- API responses
- database state
- screenshots
- monitoring metrics

Use evidence rather than assumptions.

---

# Phase 4 — Isolate the Problem

Narrow the issue to the smallest possible scope.

Determine whether the defect originates in:

- frontend
- backend
- API
- database
- infrastructure
- authentication
- configuration
- third-party dependency

Eliminate unrelated components systematically.

---

# Phase 5 — Root Cause Analysis

Identify the underlying cause.

Consider:

- logic errors
- race conditions
- incorrect assumptions
- configuration issues
- invalid data
- dependency updates
- resource exhaustion
- deployment mistakes

Generate:

ROOT_CAUSE_ANALYSIS.md

Explain why the issue occurred—not just where it occurred.

---

# Phase 6 — Design the Fix

Choose the smallest change that completely resolves the root cause.

Avoid:

- temporary hacks
- duplicate logic
- unnecessary refactoring
- unrelated modifications

Ensure the fix aligns with project architecture and coding standards.

---

# Phase 7 — Implement the Fix

Apply the approved solution.

Keep changes:

- minimal
- readable
- maintainable
- well-tested

Update comments or documentation only when necessary.

---

# Phase 8 — Verify the Fix

Confirm:

- original issue resolved
- expected behavior restored
- no regressions introduced

Run:

- unit tests
- integration tests
- end-to-end tests
- regression tests

Generate:

TEST_REPORT.md

---

# Phase 9 — Security & Performance Review

Verify the fix does not introduce:

Security Issues

- authentication flaws
- authorization bypass
- injection vulnerabilities
- information leakage

Performance Issues

- slower queries
- memory leaks
- excessive rendering
- unnecessary network requests

---

# Phase 10 — Documentation

Update:

- BUG_REPORT.md
- FIX_SUMMARY.md
- PROJECT_PROGRESS.md
- CONTEXT.md

Document:

- root cause
- implemented fix
- validation performed
- lessons learned
- remaining risks

---

# Deliverables

Produce or update:

- BUG_REPORT.md
- ROOT_CAUSE_ANALYSIS.md
- FIX_SUMMARY.md
- TEST_REPORT.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Debugging Principles

Always:

- Reproduce before fixing.
- Gather evidence before conclusions.
- Fix root causes instead of symptoms.
- Keep changes minimal.
- Validate every fix with tests.
- Document findings for future reference.

Never:

- Guess.
- Hide errors.
- Ignore failing tests.
- Change unrelated code.
- Mark a bug as fixed without verification.

---

# Escalation Guidance

If the issue cannot be resolved after reasonable investigation:

1. Summarize findings.
2. List attempted approaches.
3. Identify remaining unknowns.
4. Recommend additional diagnostics or experiments.
5. Clearly state what evidence is still needed.

---

# Definition of Done

The debugging process is complete only when:

- The bug is reproducible or its absence is justified.
- The root cause is identified.
- The fix resolves the issue.
- No regressions are detected.
- Security and performance remain acceptable.
- Documentation is updated.
- Project progress and context are refreshed for future sessions.