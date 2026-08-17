#!/bin/sh
# Render's dockerCommand override doesn't invoke a shell (verified live:
# a multi-word command with && gets word-split into literal argv tokens,
# not shell-interpreted) - so multi-step startup logic (migrate, then
# serve) needs an actual script file, not a compound command string.
set -e
alembic upgrade head
# TEMPORARY - one-shot data load for the 21->30 plant sync, see
# co2-emission-estimation memory workflow-sync-to-platform. Revert this
# line right after the next deploy confirms it ran (external DB
# connections to Render Postgres don't work, so this start.sh detour is
# the only free-tier way to run a one-off script against the live DB).
python -m scripts.load_co2
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
