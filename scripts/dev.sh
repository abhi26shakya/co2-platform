#!/usr/bin/env bash
# One-command local dev: infra in Docker, apps on the host for fast reload.
set -e
docker compose up -d postgres redis ml-service
(cd backend && uvicorn app.main:app --reload --port 8000) &
(cd frontend && npm run dev) &
wait
