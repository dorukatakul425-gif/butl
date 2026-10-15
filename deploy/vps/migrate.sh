#!/usr/bin/env bash
# Applies drizzle/migrations/*.sql files not yet recorded in public._vps_migrations (each once, in order).
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SB_DIR=/opt/butl-supabase
dbq() { docker compose -f "$SB_DIR/docker-compose.yml" exec -T db psql -U supabase_admin -d postgres -v ON_ERROR_STOP=1 "$@"; }
for f in $(ls "$APP_DIR"/drizzle/migrations/*.sql | sort); do
  n="$(basename "$f")"
  if [[ "$(dbq -tAc "select count(*) from public._vps_migrations where name='$n'")" == "0" ]]; then
    echo "Uygulanıyor: $n"
    { echo "begin;"; cat "$f"; echo; echo "insert into public._vps_migrations(name) values ('$n');"; echo "commit;"; } | dbq
  fi
done
echo "Migration'lar güncel."
