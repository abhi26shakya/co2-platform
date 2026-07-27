# Technical Debt Documentation

## Purpose

This document tracks technical debt accumulated throughout the project's lifecycle.

Technical debt represents decisions, shortcuts, temporary solutions, or outdated implementations that increase future maintenance effort.

The goal is not to eliminate all technical debt, but to manage it intentionally and resolve high-impact items before they become major problems.

This document serves as a reference for developers, architects, and AI agents when planning improvements.

---

# Technical Debt Principles

The project follows these principles:

- Track debt explicitly.
- Understand why debt exists.
- Prioritize debt based on impact.
- Resolve high-risk debt early.
- Avoid unnecessary complexity.
- Balance delivery speed with long-term maintainability.

---

# Debt Classification

Technical debt is categorized as:

---

## Code Debt

Examples:

- Complex code
- Duplicate logic
- Poor structure
- Missing refactoring

---

## Architecture Debt

Examples:

- Poor component boundaries
- Tight coupling
- Temporary architecture decisions
- Scaling limitations

---

## Documentation Debt

Examples:

- Missing documentation
- Outdated guides
- Unclear decisions

---

## Testing Debt

Examples:

- Missing tests
- Low coverage
- Manual-only validation

---

## Infrastructure Debt

Examples:

- Manual deployment steps
- Missing automation
- Outdated infrastructure

---

## Security Debt

Examples:

- Missing security controls
- Outdated dependencies
- Weak configurations

---

## Data Debt

Examples:

- Poor schema decisions
- Missing validation
- Data quality problems

---

# Debt Severity

## Critical

Requires immediate attention.

Examples:

- Security vulnerabilities
- Data integrity risks
- Blocking architecture limitations

---

## High

Should be addressed soon.

Examples:

- Major maintainability issues
- Important missing tests
- Performance bottlenecks

---

## Medium

Should be planned.

Examples:

- Refactoring opportunities
- Documentation gaps

---

## Low

Can be addressed opportunistically.

Examples:

- Minor cleanup
- Code style improvements

---

# Technical Debt Entry Template

---

## Debt ID

TD-001

---

## Title

Short description.

Example:

Replace Manual Deployment Process

---

## Category

Choose:

- Code
- Architecture
- Documentation
- Testing
- Infrastructure
- Security
- Data

---

## Date Introduced

YYYY-MM-DD

---

## Status

- Identified
- Accepted
- Planned
- In Progress
- Resolved
- Won't Fix

---

## Description

Describe the technical debt.

Include:

- Current situation
- Why it exists
- Affected areas

---

## Original Decision

Explain why this approach was chosen.

Examples:

- Faster MVP delivery
- Limited resources
- Experimental phase
- Temporary workaround

---

## Impact

Describe consequences.

Examples:

- Increased maintenance effort
- Slower development
- Higher risk
- Reduced scalability

---

## Affected Components

Examples:

- Frontend
- Backend
- Database
- Infrastructure
- ML Pipeline

---

## Priority

- Critical
- High
- Medium
- Low

---

## Estimated Effort

Estimate:

- Small
- Medium
- Large
- Extra Large

---

## Proposed Solution

Describe the ideal future state.

---

## Resolution Plan

Steps:

1. 
2. 
3. 

---

## Related Documentation

References:

- ARCHITECTURE.md
- DECISIONS.md
- KNOWN_ISSUES.md
- ROADMAP.md

---

# Active Technical Debt

Maintain unresolved debt items here.

---

# Critical Debt

Items requiring immediate action.

See KNOWN_ISSUES.md KI-005 (Reports management UI writes fields the
backend doesn't have) and KI-006 (`frontend/Dockerfile` is dev-mode only)
— both discovered 2026-07-27, full functionality audit
(`AUDIT_REPORT.md`).

---

# High Priority Debt

Items affecting development speed, security, or reliability.

## Debt Item: Dead-code duplicate of the entire auth-dependency stack (backend)

**Discovered**: 2026-07-27, full functionality audit.
**Description**: `backend/app/api/deps.py` (defines
`get_current_user`/`CurrentUser` using `app/repositories/user.py`,
singular) and `app/repositories/refresh_token.py` (singular) are never
imported anywhere in `app/` or `tests/` — confirmed via grep. Every real
router imports the parallel, actually-used `app/core/deps.py` +
`app/repositories/users.py`/`refresh_tokens.py` (plural) instead. The
dead versions have near-identical logic to the live ones but subtly
different signatures (`create()` takes `expires_at` in the dead version
vs `ttl_days` in the live one).
**Impact**: ~130 lines of dead code that's a real trap for anyone who
greps `UserRepository` and edits the wrong file, believing they've fixed
something.
**Estimated Effort**: Small (delete the dead files, confirm nothing
imports them, run tests).
**Priority**: High.

## Debt Item: Weak default JWT secret with no startup guard

**Discovered**: 2026-07-27, full functionality audit.
**Description**: `backend/app/core/config.py:24` defaults
`jwt_secret_key` to the literal string `"change-me-in-production"`, and
nothing checks at startup whether it was actually overridden.
**Impact**: Not exploitable today (no backend is currently deployed
behind the live Vercel frontend), but a live footgun the moment one is —
tokens would be forgeable with a publicly-known default.
**Estimated Effort**: Small (raise/refuse to boot if the default is
still set outside an explicit dev-mode flag).
**Priority**: High.

## Debt Item: No CI dependency/image security scanning

**Discovered**: 2026-07-27, full functionality audit.
**Description**: `.github/workflows/ci.yml` runs tests only — no
`pip-audit`, `npm audit`, Dependabot config, or image-scan step (e.g.
Trivy) exists anywhere in the repo.
**Impact**: Known-vulnerable dependencies could ship undetected.
**Estimated Effort**: Small–Medium.
**Priority**: High.

## Debt Item: No CD / deployment automation

**Discovered**: 2026-07-27, full functionality audit.
**Description**: CI has three test-only jobs (backend/ml-service/
frontend); no build-and-push-image job, no deploy job for backend/
ml-service (frontend deploys via Vercel, separately from this repo's CI).
**Impact**: Backend/ml-service deployment stays manual and unrepeatable.
**Estimated Effort**: Medium (depends on choosing a target host).
**Priority**: High.

---

# Medium Priority Debt

Items requiring planned improvement.

## Debt Item: Redis container present in `docker-compose.yml` but never wired to the backend

**Discovered**: 2026-07-27, full functionality audit.
**Description**: `docker-compose.yml`'s `full` profile runs a `redis`
service, but the `backend` service's `environment:` block never sets
`CO2_REDIS_URL`, so `rate_limit_storage` silently stays `memory://`
(the `config.py` default) even under the "full" profile. The container
runs but nothing points at it.
**Impact**: Rate limits don't actually hold across workers even in the
profile meant to demonstrate prod-like behavior; contradicts the
documented intent (see main CLAUDE.md's "Redis-backed rate limits in
compose" backlog item — this shows the container exists but the wiring
was never finished).
**Estimated Effort**: Small (set the env var, verify with `docker compose
--profile full up`).
**Priority**: Medium.

## Debt Item: All three Dockerfiles run as root; no coverage gate in CI; no observability/error-tracking

**Discovered**: 2026-07-27, full functionality audit.
**Description**: No Dockerfile (backend/ml-service/frontend) sets a
non-root `USER`. `pytest`/`npm run test` in CI only assert "tests pass" —
no `--cov` flag or minimum coverage threshold anywhere. No Sentry (or
equivalent) integration; only basic `/health` endpoints exist, no
structured logging/APM.
**Impact**: Standard hardening/observability gaps, not urgent individually
but compound as the app moves toward real deployment.
**Estimated Effort**: Small (non-root users) to Medium (observability).
**Priority**: Medium.

---

# Low Priority Debt

Minor improvements.

## Debt Item: Miscellaneous small findings from the 2026-07-27 audit

- `backend/requirements.txt` lists `reportlab`, `matplotlib`, `slowapi`
  each twice (harmless, pip dedupes, signals unreviewed diffs).
- Thin/no direct test coverage on `GET /api/v1/models`, `dashboard.py`,
  `health.py`.
- No `LICENSE` file at repo root.
- Several `.claude/docs/` files are still unfilled templates:
  `ROADMAP.md`, `RISK_REGISTER.md`, `API_REFERENCE.md`, `DATABASE.md`,
  `DEPLOYMENT.md`.

**Priority**: Low.

---

# Resolved Technical Debt

Keep historical records.

For each resolved item include:

- Resolution date
- Solution implemented
- Impact after resolution

Do not delete resolved debt.

---

# Technical Debt Review Process

Review technical debt:

- During sprint planning.
- Before major releases.
- During architecture reviews.
- After incidents.
- During refactoring cycles.

---

# Debt Prioritization

Prioritize based on:

## Business Impact

Does it affect users?

## Engineering Impact

Does it slow development?

## Risk

Can it cause failures?

## Cost

How difficult is resolution?

---

# Debt Prevention

Prevent unnecessary debt by:

- Writing maintainable code.
- Following standards.
- Reviewing architecture decisions.
- Maintaining documentation.
- Adding automated tests.
- Performing regular refactoring.

---

# Technical Debt Metrics

Track:

- Number of debt items.
- Debt by category.
- Average resolution time.
- Critical unresolved debt.
- Debt introduced vs resolved.

---

# Related Documentation

- PROJECT_ANALYSIS.md
- ARCHITECTURE.md
- DECISIONS.md
- KNOWN_ISSUES.md
- ROADMAP.md
- PROJECT_PROGRESS.md

---

# Maintenance Guidelines

Update this document whenever:

- A shortcut is introduced.
- A temporary solution becomes permanent.
- Architecture changes create debt.
- Refactoring is completed.
- Debt priority changes.

This document should provide a transparent view of the project's maintainability challenges and guide future engineering improvements.