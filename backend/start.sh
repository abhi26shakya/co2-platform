#!/bin/sh
# Render's dockerCommand override doesn't invoke a shell (verified live:
# a multi-word command with && gets word-split into literal argv tokens,
# not shell-interpreted) - so multi-step startup logic (migrate, then
# serve) needs an actual script file, not a compound command string.
set -e
alembic upgrade head
# TEMPORARY: external connections to the DB fail (verified: SSL handshake
# closed unexpectedly, reproduced from two independent networks against
# two independent fresh Postgres instances) but the backend's own internal
# connection works fine (these migrations just proved it) - run the data
# load from here once, then revert this line. See NEXT_STEPS or PR history
# for the load_co2.py facility-data-sync work this completes.
python -m scripts.load_co2 || true
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
