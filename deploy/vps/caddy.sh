#!/usr/bin/env bash
# Publishes the built static files (/assets, /images, favicon...) to a directory Caddy can read
# and (re)writes the Caddyfile. Caddy serves those files itself, so images, CSS and JS load even
# if the Node server cannot read its own public folder. Run after every build (install/update do).
#   sudo bash deploy/vps/caddy.sh
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CONF=/etc/butl/butl.env
STATIC_DIR=/var/www/butl
APP_PORT="${APP_PORT:-3000}"
KONG_PORT="${KONG_PORT:-8000}"
[[ $EUID -eq 0 ]] || { echo "root olarak çalıştırın (sudo)."; exit 1; }
[[ -f "$CONF" ]] || { echo "$CONF yok: önce install.sh çalıştırın."; exit 1; }
# shellcheck disable=SC1090
source "$CONF"
[[ -n "${DOMAIN:-}" ]] || { echo "DOMAIN $CONF içinde yok."; exit 1; }
[[ -d "$APP_DIR/.output/public" ]] || { echo "$APP_DIR/.output/public yok: önce build.sh çalıştırın."; exit 1; }

# New hashed files are added before old ones are removed, so open pages keep working during updates.
mkdir -p "$STATIC_DIR"
cp -a "$APP_DIR/.output/public/." "$STATIC_DIR/"
find "$STATIC_DIR/assets" -type f -mtime +7 -delete 2>/dev/null || true
chmod -R a+rX "$STATIC_DIR"

GLOBAL_EMAIL=""
[[ -n "${ADMIN_EMAIL:-}" ]] && GLOBAL_EMAIL="email $ADMIN_EMAIL"

cat > /etc/caddy/Caddyfile <<EOF
{
  $GLOBAL_EMAIL
}
$DOMAIN {
  encode zstd gzip

  @api path /auth/v1/* /rest/v1/* /realtime/v1/* /storage/v1/* /graphql/v1/*
  handle @api {
    reverse_proxy 127.0.0.1:$KONG_PORT
  }

  # Built files (hashed JS/CSS/images, /images, favicon, robots) straight from disk.
  @static {
    not path /
    file {
      root $STATIC_DIR
    }
  }
  handle @static {
    root * $STATIC_DIR
    header /assets/* Cache-Control "public, max-age=31536000, immutable"
    file_server
  }

  # Pages, server functions -> Node game server.
  handle {
    reverse_proxy 127.0.0.1:$APP_PORT
  }
}
EOF
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null
systemctl enable caddy >/dev/null 2>&1 || true
systemctl reload caddy || systemctl restart caddy
echo "Caddy ve statik dosyalar hazır: $STATIC_DIR"
