#!/bin/sh
# See backend/start.sh's comment - Render's dockerCommand override doesn't
# invoke a shell, so multi-step startup logic needs an actual script file.
set -e
mkdir -p weights
if [ -f /etc/secrets/detector3.pt.b64 ]; then
  base64 -d /etc/secrets/detector3.pt.b64 > weights/detector3.pt
fi
exec uvicorn app.main:app --host 0.0.0.0 --port 8001
