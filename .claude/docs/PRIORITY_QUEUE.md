# Priority Queue

Ranked candidate tasks from the 2026-08-13 `/next` analysis. Re-rank when
material changes land (new audit, resolved issues, new bugs). #1 is the
active recommendation — see `NEXT_ACTIONS.md` for its full execution plan.

| # | Task | Category | Business Value | Engineering Value | Effort | Risk | Dependencies | Agents |
|---|---|---|---|---|---|---|---|---|
| 1 | Harden container/dependency security (non-root `backend`/`ml-service` Dockerfiles, CI `pip-audit`/`npm audit`, Dependabot) | Security | Medium — reduces real breach/CVE exposure before any prod backend deploy | High — closes 2 audit "High" findings (I2, I3) | Small-Medium | Low | None | devops-engineer, security-engineer |
| 2 | Wire `CO2_REDIS_URL` in `docker-compose.yml`'s `full` profile (B3) | DevOps | Low today (no live backend deployed), High once one is | Low-Medium — makes rate limiting prod-parity instead of silently no-op | Trivial | Low | None | devops-engineer |
| 3 | Sync stale docs (`KNOWN_ISSUES.md` remaining gaps, `AUDIT_REPORT.md` findings table, `ROADMAP.md` still-template sections) | Documentation | Low direct, Medium indirect (future `/next` runs and onboarding rely on these being accurate) | Medium — this session found 3 stale/contradictory docs already | Small | None | None | documentation-engineer |
| 4 | Fix KI-010 (Settings preference race condition) — route appearance/AI and notification writes through one merge-at-send-time mutation, or make `PUT /settings/preferences` a real PATCH | Bug | Low — narrow timing window, self-correcting, no data loss | Medium — real correctness bug, not just cosmetic | Medium | Low | None | backend-engineer, frontend-engineer |
| 5 | Add CI coverage gate + CD pipeline (I4, I6) | DevOps | Medium — repeatable deploys, catches coverage regressions | Medium-High | Medium-Large | Medium | **Blocked**: needs a backend/ml-service hosting decision first | devops-engineer, software-architect |
| 6 | Add error tracking/observability (Sentry or equivalent) + structured logging (I7) | Observability | Medium — currently blind to production errors beyond `/health` | Medium | Medium | Low | Benefits from #5's hosting decision but not strictly blocked | devops-engineer, backend-engineer |
| 7 | Add dedicated tests for `GET /api/v1/models`, `dashboard.py`, `health.py` (B5) | Testing | Low | Low-Medium — closes a thin-coverage gap on low-risk routes | Small | None | None | qa-engineer, backend-engineer |
| 8 | Add `LICENSE` file (I8) | Compliance | Low (matters if/when open-sourced or externally distributed) | Trivial | Trivial | None | Needs a license choice from the project owner | — |
| 9 | Frontend E2E test suite (Playwright/Cypress) — `PROJECT_PROGRESS.md` notes none exist | Testing | Medium — the map/prediction critical path has no end-to-end safety net | High — biggest remaining test-coverage gap | Large | Low | None | qa-engineer, frontend-engineer |
| 10 | Celery scheduler (unblocks KI-007 weekly-summary email, plus post-v1 backlog items) | Feature/Infra | Medium — a real, currently-inert user-facing preference | Medium-High — new infra component | Large | Medium | None, but a bigger architectural addition than anything above | backend-engineer, software-architect |

## Notes

- Rows 1-4 are all independently startable now (no unmade decisions
  blocking them) — a natural order for back-to-back sessions.
- Row 5 (CD) is the first item that needs a human decision (hosting
  platform for backend/ml-service) before engineering work can start;
  flag this to the project owner rather than guessing.
- Feature work (row 10, and anything not listed here) intentionally ranks
  below the security/infra items per the decision framework — the MVP
  feature surface is complete (~70% per `AUDIT_REPORT.md`), so the
  highest-value work right now is closing production-readiness gaps, not
  adding scope.
