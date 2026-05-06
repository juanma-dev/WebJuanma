#!/usr/bin/env bash
# ============================================================
# Pull the latest images from ghcr.io and roll the stack.
# Run on the server as a user that's in the `docker` group.
#
# Usage:
#   bash /opt/webjuanma/deploy.sh
#
# Or pin to a specific tag (handy for rollbacks):
#   TAG=sha-abc1234 bash /opt/webjuanma/deploy.sh
# ============================================================
set -euo pipefail

STACK_DIR=${STACK_DIR:-/opt/webjuanma}

cd "$STACK_DIR"

echo "==> Pulling images"
docker compose --profile tunnel pull

echo "==> Applying stack"
docker compose --profile tunnel up -d --remove-orphans

echo "==> Pruning dangling images older than 72h"
docker image prune -af --filter "until=72h" >/dev/null

echo "==> Done. Status:"
docker compose ps
