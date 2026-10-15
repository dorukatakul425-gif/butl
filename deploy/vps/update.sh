#!/usr/bin/env bash
# Pulls the latest code from GitHub, applies new SQL, rebuilds and restarts the game.
#   sudo bash deploy/vps/update.sh
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$APP_DIR"
git pull --ff-only
bash deploy/vps/migrate.sh
docker compose -f /opt/butl-supabase/docker-compose.yml restart rest >/dev/null
bash deploy/vps/build.sh
systemctl restart butl
echo "Güncelleme tamam."
