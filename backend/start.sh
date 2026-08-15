#!/bin/sh
# Render's dockerCommand override doesn't invoke a shell (verified live:
# a multi-word command with && gets word-split into literal argv tokens,
# not shell-interpreted) - so multi-step startup logic (migrate, then
# serve) needs an actual script file, not a compound command string.
set -e
alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
