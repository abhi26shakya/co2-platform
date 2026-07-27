# Audit Report — 2026-07-27

## Purpose

Full-repository functionality and production-readiness audit of the co2-platform monorepo (frontend, backend, ml-service). Analysis only — no code was modified. This report cross-checks existing `.claude/docs/` documentation against actual code state and adds newly-discovered findings.

---

## Executive Summary

The project is a working MVP, not yet production-ready. Auth, upload, mock prediction, reports (backend), analytics, and the map experience are genuinely implemented and tested — this is not a prototype full of stubs. The gaps are concentrated in three places: (1) a frontend Reports management UI that was built against an imagined, richer API contract that the real backend never implements, so most of its interactive features (favorites, comments, version history, sharing) mutate fields the backend silently ignores; (2) infrastructure that is dev-only masquerading as deployable (the frontend Docker image runs `next dev`, no image scanning, no CD, containers run as root); and (3) an unresolved deployment issue (KI-004) that crashes the Vercel-hosted site's 3D map for real users, currently believed to be network/platform-level rather than app code. Backend and ML-service code quality is solid — no stub endpoints, consistent migrations, real test coverage on the primary paths. The single most user-visible problem is the fake Reports UI; the single most production-blocking infra problem is the dev-mode Docker image.

**Verdict: MVP feature-complete (~70%, matching the project's own estimate), not production-ready.** Estimated 2-3 focused sprints to reach a genuinely deployable state (fix Reports UI honesty, harden Docker/CI, resolve or route around KI-004, wire Redis rate limiting).

---

## Overall Health Scorecard (0–10)

| Area | Score | Rationale |
|---|---|---|
| Architecture | 8 | Clean layering (routers→services→repositories), well-documented ML integration boundary, storage/inference behind protocols. |
| Code Quality | 7 | Backend/ML clean; frontend has one dead-code auth-dependency fork and a Reports feature built against a fictional contract. |
| Backend | 8 | All 8 routers fully wired, no stubs, consistent migrations, decent test coverage on core paths. |
| Frontend | 6 | Maps feature is strong and well-tested; Reports management feature is largely non-functional against the real API. |
| Database | 8 | Migrations match models, reasonable schema, no orphaned tables found. |
| API | 7 | Versioned contract for ML boundary is a genuine strength; `ReportOut` schema drift between frontend/backend is the main flaw. |
| Security | 6 | No exposed secrets, CORS properly scoped, Argon2id+JWT+rotation is solid — but weak default JWT secret, root-user containers, no dependency scanning. |
| Performance | — | Not directly benchmarked this pass; no obvious red flags found (see Phase 9 notes). |
| Testing | 6 | Backend/ML CI-gated and real; frontend has 83 passing Vitest tests but zero E2E, and the Reports feature (its biggest UI surface) is untested. |
| Documentation | 7 | Unusually good discipline (KNOWN_ISSUES/TECH_DEBT/PROJECT_PROGRESS are live and detailed) — but several `.claude/docs/*` files (ROADMAP, RISK_REGISTER, API_REFERENCE, DATABASE, DEPLOYMENT) are still unfilled templates. |
| DevOps | 4 | CI runs tests only — no image scan, no CD, no coverage gate, dev-mode Docker image, no LICENSE, no observability/error-tracking. |
| **Overall** | **6.5/10** | Solid engineering core; production-readiness work is concentrated and well-understood, not diffuse. |

---

## Findings by Subsystem

### Backend (`backend/app/`)

Verified: all 8 routers (auth, analytics, dashboard, health, images, models, predictions, reports) are fully wired to real services/repositories — no stub handlers, no `NotImplementedError`, no hardcoded response bodies. Auth surface (signup/login/refresh/logout/me/update-me) matches the documented backlog exactly — no partial/broken OAuth or password-reset code lying around half-built. Migrations are consistent with models.

**New findings:**

| # | Finding | File | Severity |
|---|---|---|---|
| B1 | Dead-code duplicate of the entire auth-dependency stack: `app/api/deps.py` + `app/repositories/user.py` (singular) are unused everywhere — the live code uses `app/core/deps.py` + `app/repositories/users.py` (plural). Subtly different signatures (`create()` takes `expires_at` vs `ttl_days`) make this a trap for future edits. | `backend/app/api/deps.py`, `backend/app/repositories/user.py`, `backend/app/repositories/refresh_token.py` | High |
| B2 | Weak JWT secret default (`"change-me-in-production"`) with no startup check that it was overridden. Not exploitable today (no live deployed backend), but a live footgun the moment one is deployed. | `backend/app/core/config.py:24` | High |
| B3 | `redis` service runs in `docker-compose.yml --profile full` but the backend never sets `CO2_REDIS_URL`, so `rate_limit_storage` silently stays `memory://` even in the "full" profile. The container is present but nothing points at it. | `docker-compose.yml` | Medium |
| B4 | `reportlab`, `matplotlib`, `slowapi` are each listed twice in `requirements.txt` (harmless, pip dedupes, but signals unreviewed diffs). | `backend/requirements.txt` | Low |
| B5 | Thin/no direct test coverage on `GET /api/v1/models`, `dashboard.py`, `health.py` (small, low-risk, but untested). | `backend/tests/` | Low |

### ML Service (`ml-service/app/`)

Matches documented mock-only status exactly. `PREDICTOR` wiring in `main.py`, `Predictor` protocol, and the versioned `PredictionResultV1` contract are all as described in CLAUDE.md. The only "placeholder" string found is the deliberate `"U-Net (placeholder)"` architecture-name metadata (`mock.py:44`) — intentional, not a bug. No new findings beyond what's already tracked.

### Frontend (`frontend/src/`)

Maps feature (`features/maps/`) is the strongest part of the frontend: real 2D/3D engines, GIS tools, real PNG/PDF export, 83 passing tests, extensively manually verified per PROJECT_PROGRESS.md. The **Reports management page is the weakest part** — built against a richer imagined API contract (documented as the `ReportOut` type-mismatch tech debt) that, on inspection, goes deeper than a display-only type mismatch:

| # | Finding | File | Severity |
|---|---|---|---|
| F1 | **Reports UI writes ~15 fields the backend schema doesn't have** (`dataset_name`, `satellite_source`, `confidence_score`, `estimated_co2`, `detected_facilities`, `comments`, `versions`, `is_favorite`, `is_archived`, `shares_count`, etc.) via `createReport.mutate`/`updateReport.mutate`. Real backend `ReportOut` only has `id, title, format, params, created_at, url`. Favorites, comments, version history/restore, and archive are UI-only illusions — they either silently no-op against the real API or 422. This is a materially bigger problem than the already-tracked display-type mismatch: the entire reports *management* surface, not just some display fields, is non-functional against the real backend. | `frontend/src/app/(protected)/reports/page.tsx` (lines 129, 160, 185, 205, 222, 229, 239, 251, 275) | Critical |
| F2 | Custom Report Builder's progress bar is a fully simulated `setInterval`/`setTimeout` animation with canned stage text; submitted `confidence_score`/`estimated_co2` are hardcoded values keyed off matching a specific filename (`sasan.tif`), not derived from any real analysis. | `reports/page.tsx:105-147` | High |
| F3 | "Share" for reports is entirely fake — `generateShareLink` builds a hardcoded URL string template, never calls a real share-link API (the maps feature has a real share-link builder; reports does not). | `reports/page.tsx:270` | High |
| F4 | `alert()` (5 call sites) and `prompt()` (1 call site) block the render thread in the reports page — the same anti-pattern the maps feature already eliminated (M-004), but the fix wasn't applied here. | `reports/page.tsx:237,565,668,676,693,1196` | Medium |
| F5 | Settings page has one genuinely-disabled, clearly-labeled "Coming Soon" model option — legitimate roadmap placeholder, not a bug, but worth tracking as a known stub. | `frontend/src/app/(protected)/settings/page.tsx:1031,737` | Low |

Positive finding: the "AI" route (`(protected)/ai/page.tsx`) is **not** a placeholder — it's a real model-registry page wired to `useModels()`/`useSystemStatus()` showing live metrics and ML-service status. No `console.log`/`console.warn` left in `src/`. No dead/no-op button handlers found elsewhere (spot-checked, not exhaustive — package.json dependency audit and full per-route test-coverage mapping were not completed this pass, flagged as follow-up).

### Infrastructure / DevOps / Security

**No exposed secrets found** — `.env.example` files contain only placeholder/dev values; grep for API-key patterns across tracked files returned nothing. CORS is properly scoped (not wildcarded). `docker-compose.yml`'s `full` profile has correct healthchecks/`depends_on` wiring.

| # | Finding | File | Severity |
|---|---|---|---|
| I1 | `frontend/Dockerfile` runs `CMD ["npm", "run", "dev"]` — the Next.js **dev server**, not a production build. No multi-stage build; `COPY . .` copies the whole repo into the runner stage. This image is not deployable as-is. | `frontend/Dockerfile:11` | Critical |
| I2 | No container (backend, ml-service, frontend) sets a non-root `USER` — all three run as root. | `*/Dockerfile` | High |
| I3 | No dependency/image security scanning in CI — no `pip-audit`, `npm audit`, Dependabot config, or Trivy/image-scan step anywhere. | `.github/workflows/ci.yml` | High |
| I4 | CI has no build/deploy (CD) job — three test-only jobs, no image publish, no deployment automation. | `.github/workflows/ci.yml` | High |
| I5 | `docker-compose.yml` hardcodes `CO2_JWT_SECRET_KEY: dev-only-secret-change-in-prod` and a plaintext `co2password` directly in the compose file rather than sourcing from `.env` — self-documented as dev-only, but nothing technically prevents copy-pasting this file into a prod context. | `docker-compose.yml` | Medium |
| I6 | No CI coverage threshold enforced anywhere (pytest/vitest just need to pass, no `--cov` gate). | `.github/workflows/ci.yml` | Medium |
| I7 | No error-tracking/observability integration (no Sentry or equivalent; only basic `/health` endpoints exist, no structured logging/APM). | repo-wide | Medium |
| I8 | No `LICENSE` file at repo root. | root | Low |

---

## Consolidated Feature Completeness Table

| Feature | Location | Status | Problem | Required Action | Priority |
|---|---|---|---|---|---|
| Auth (signup/login/refresh/logout) | `backend/app/api/v1/auth.py` | Fully Functional | None found | — | — |
| Image upload | `backend/app/api/v1/images.py` | Fully Functional | None found | — | — |
| Mock prediction pipeline | `ml-service/`, `backend/app/services/inference/` | Fully Functional (by design, mock) | None — matches documented contract | Real model swap is tracked backlog | Medium (backlog) |
| Analytics / dashboard | `backend/app/api/v1/analytics.py`, `dashboard.py` | Fully Functional | Thin test coverage | Add `test_dashboard.py`/`test_health.py` | Low |
| Maps (2D/3D, GIS tools, export, alerts) | `frontend/src/features/maps/` | Fully Functional | Minor: GeoTIFF export simulated by design | None — documented decision | — |
| Reports (generation, PDF/download) | `backend/app/services/reports.py` | Fully Functional | None found | — | — |
| Reports management UI (favorites/comments/versions/share) | `frontend/src/app/(protected)/reports/page.tsx` | **Not Functional / Placeholder** | Writes fields the backend schema doesn't have; share link is fake; progress bar is simulated | Rebuild against real `ReportOut` contract or extend backend schema to match, whichever is cheaper; remove fake share/comment/version UI or implement it server-side | **Critical** |
| AI / model registry page | `frontend/src/app/(protected)/ai/page.tsx` | Fully Functional | None found | — | — |
| Settings | `frontend/src/app/(protected)/settings/page.tsx` | Fully Functional | One clearly-labeled "Coming Soon" model option | None — legitimate placeholder | — |
| 3D map on Vercel deployment | prod (`co2-platform-nine.vercel.app/maps`) | **Broken (KI-004)** | Crashes browser tab; narrowed to network/Vercel-platform issue, not app code | Investigate Vercel deployment logs, test from different network | Critical (already tracked) |
| Redis-backed rate limiting | `docker-compose.yml` | Not Wired | Redis container runs but backend never points at it | Set `CO2_REDIS_URL` env var for backend service in `full` profile | Medium |
| Production Docker image (frontend) | `frontend/Dockerfile` | **Not Functional for prod** | Runs dev server | Rewrite as multi-stage build ending in `next start` | Critical |
| CI security scanning | `.github/workflows/ci.yml` | Missing | No dependency/image scanning | Add `pip-audit`, `npm audit`, Dependabot | High |
| CD / deployment automation | `.github/workflows/ci.yml` | Missing | Tests only, no deploy job | Add build-and-push + deploy job once target infra is chosen | High |

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation | Priority |
|---|---|---|---|---|
| Reports management UI silently fails or 422s against real backend in production | Users lose trust; "favorite"/"comment"/"share" appear to work then vanish on reload | High (will happen the first time a real backend is live) | F1–F3 fixes above | Critical |
| Frontend Docker image can't actually serve production traffic | Any container-based deploy attempt fails or serves an unoptimized dev bundle | High if Docker deploy path is ever used (currently Vercel is used instead) | I1 fix | Critical |
| JWT secret left at default in a real deployment | Full auth bypass / token forgery | Low today (no live backend deployed), rises to High the moment one is | B2 fix + startup assertion that `CO2_JWT_SECRET_KEY` isn't the default | High |
| 3D map crashes deployed site (KI-004) | First-time visitors lose their browser tab | Confirmed happening today | Already tracked, unresolved; stopgap (2D default) applied | Critical (existing) |
| No dependency/image scanning | Known-vulnerable packages ship undetected | Medium | I3 fix | High |
| Dead-code auth repository fork (B1) | Future edit to the wrong `UserRepository`/`get_current_user` silently does nothing | Medium | Delete dead files | Medium |
| No CD pipeline | Deployment stays manual, error-prone, unrepeatable | Medium | I4 fix once target platform decided | High |

---

## Improvement Roadmap

### Phase 1 — Critical functionality fixes
1. **Fix or scope down the Reports management UI (F1–F3).** Either extend the backend `ReportOut`/report model to genuinely support favorites/comments/versions/sharing, or strip those UI affordances down to what the real API supports. *Files: `backend/app/schemas/report.py`, `backend/app/models/`, `frontend/src/app/(protected)/reports/page.tsx`, `frontend/src/types/report.ts`.* Complexity: Medium–Large. Priority: Critical.
2. **Rewrite `frontend/Dockerfile` as a real multi-stage production build** (`next build` → `next start`, non-root user, `.dockerignore` to avoid `COPY . .` pulling in the whole repo). Complexity: Small. Priority: Critical.
3. **Continue KI-004 investigation** per its existing resolution plan (Vercel deployment logs, different-network test) — already tracked, just needs the next investigative step. Priority: Critical.

### Phase 2 — Core feature completion
4. Delete dead-code auth-dependency fork (B1) — `app/api/deps.py`, `app/repositories/user.py`, `app/repositories/refresh_token.py`. Complexity: Small. Priority: High.
5. Wire `CO2_REDIS_URL` for the backend service in `docker-compose.yml`'s `full` profile so the existing Redis container is actually used (B3). Complexity: Small. Priority: Medium.
6. Add non-root `USER` directives to all three Dockerfiles (I2). Complexity: Small. Priority: High.
7. Enforce a non-default JWT secret at startup (raise/refuse to boot if `jwt_secret_key == "change-me-in-production"` outside explicit dev mode) (B2). Complexity: Small. Priority: High.

### Phase 3 — UX improvements
8. Replace `alert()`/`prompt()` in `reports/page.tsx` with inline UI state, matching the pattern already applied to the maps feature (F4). Complexity: Small. Priority: Medium.
9. Add dedicated tests for `GET /api/v1/models`, `dashboard.py`, `health.py` (B5). Complexity: Small. Priority: Low.

### Phase 4 — Performance optimization
10. No performance red flags found this pass; recommend a dedicated `/benchmark` or `/optimize` pass once Phase 1–2 land, focused on map rendering (largest client bundle) and report-generation latency.

### Phase 5 — Production readiness
11. Add CI dependency/image scanning (`pip-audit`, `npm audit`, Dependabot config) (I3). Complexity: Small. Priority: High.
12. Add a CD pipeline (build → push → deploy) once a target hosting platform for the backend/ml-service is chosen — frontend already deploys via Vercel (I4). Complexity: Medium. Priority: High.
13. Add error tracking/observability (Sentry or equivalent) and structured logging (I7). Complexity: Medium. Priority: Medium.
14. Add a `LICENSE` file (I8). Complexity: Trivial. Priority: Low.
15. Fill in the still-template `.claude/docs/` files that matter for onboarding: `API_REFERENCE.md`, `DATABASE.md`, `DEPLOYMENT.md`, `RISK_REGISTER.md`, `ROADMAP.md` (all confirmed unfilled templates during this audit). Complexity: Medium. Priority: Medium.

---

## Recommended Next Steps (immediate)

1. Decide: fix the Reports backend contract, or cut the fake UI down to match reality — this is the single biggest gap between what the app appears to do and what it actually does.
2. Fix `frontend/Dockerfile` — small effort, unblocks any container-based deploy path.
3. Delete the dead-code auth fork (B1) — small effort, removes a real future-bug trap.
4. Keep KI-004 moving per its existing plan; it's the only issue actively affecting real users today.

Everything above is analysis only. No code was changed as part of this audit.
