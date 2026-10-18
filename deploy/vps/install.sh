#!/usr/bin/env bash
# Butl — VPS installer (Ubuntu 22.04 / 24.04, run as root).
#   sudo bash deploy/vps/install.sh oyun.example.com admin@example.com
# Installs: Docker, self-hosted Supabase (Postgres + Auth + REST + Realtime WebSocket + Storage),
# Node 22 + Bun, builds the game as a Node server, systemd service, Caddy (automatic HTTPS).
set -euo pipefail

DOMAIN="${1:-}"; EMAIL="${2:-}"
if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Kullanım: sudo bash deploy/vps/install.sh <domain> <eposta>"; exit 1
fi
[[ $EUID -eq 0 ]] || { echo "root olarak çalıştırın (sudo)."; exit 1; }

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SB_DIR=/opt/butl-supabase
CONF=/etc/butl/butl.env
APP_PORT=3000
KONG_PORT=8000
log() { echo -e "\n\033[1;32m==> $*\033[0m"; }

log "Sistem paketleri"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl git gnupg openssl unzip debian-keyring debian-archive-keyring apt-transport-https ufw

if ! command -v docker >/dev/null; then
  log "Docker kuruluyor"
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker

if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 22 ]]; then
  log "Node.js 22 kuruluyor"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
if ! command -v bun >/dev/null; then
  log "Bun kuruluyor"
  curl -fsSL https://bun.sh/install | bash
  ln -sf /root/.bun/bin/bun /usr/local/bin/bun
fi

if ! command -v caddy >/dev/null; then
  log "Caddy kuruluyor"
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y && apt-get install -y caddy
fi

# ---------- Secrets (generated once, reused on re-run) ----------
mkdir -p /etc/butl && chmod 700 /etc/butl
if [[ ! -f "$CONF" ]]; then
  log "Gizli anahtarlar üretiliyor ($CONF)"
  {
    node "$APP_DIR/deploy/vps/gen-keys.mjs"
    echo "POSTGRES_PASSWORD=$(openssl rand -hex 24)"
    echo "DASHBOARD_PASSWORD=$(openssl rand -hex 16)"
    echo "SECRET_KEY_BASE=$(openssl rand -hex 32)"
    echo "REALTIME_DB_ENC_KEY=$(openssl rand -hex 8)"
    echo "VAULT_ENC_KEY=$(openssl rand -hex 16)"
    echo "PG_META_CRYPTO_KEY=$(openssl rand -hex 16)"
    echo "LOGFLARE_PUBLIC_ACCESS_TOKEN=$(openssl rand -hex 24)"
    echo "LOGFLARE_PRIVATE_ACCESS_TOKEN=$(openssl rand -hex 24)"
  } > "$CONF"
  chmod 600 "$CONF"
fi
# shellcheck disable=SC1090
source "$CONF"
sed -i "/^DOMAIN=/d;/^ADMIN_EMAIL=/d" "$CONF"; echo "DOMAIN=$DOMAIN" >> "$CONF"; echo "ADMIN_EMAIL=$EMAIL" >> "$CONF"

# ---------- Self-hosted Supabase ----------
if [[ ! -f "$SB_DIR/docker-compose.yml" ]]; then
  log "Supabase indiriliyor"
  rm -rf /tmp/supabase-src
  git clone --depth 1 https://github.com/supabase/supabase /tmp/supabase-src
  mkdir -p "$SB_DIR"
  cp -rf /tmp/supabase-src/docker/. "$SB_DIR/"
  cp "$SB_DIR/.env.example" "$SB_DIR/.env"
  rm -rf /tmp/supabase-src
  # Publish every container port on localhost only (Docker bypasses ufw). Caddy is the only public entry.
  sed -i -E 's#^(\s*- )("?)(\$\{[A-Z_]*PORT)#\1\2127.0.0.1:\3#' "$SB_DIR/docker-compose.yml"
fi

setenv() { # setenv KEY VALUE -> replace or append in Supabase .env
  local k="$1" v="$2"
  if grep -q "^$k=" "$SB_DIR/.env"; then
    sed -i "s|^$k=.*|$k=$(printf '%s' "$v" | sed 's/[&|]/\\&/g')|" "$SB_DIR/.env"
  else echo "$k=$v" >> "$SB_DIR/.env"; fi
}
log "Supabase ayarları"
setenv POSTGRES_PASSWORD "$POSTGRES_PASSWORD"
setenv JWT_SECRET "$JWT_SECRET"
setenv ANON_KEY "$ANON_KEY"
setenv SERVICE_ROLE_KEY "$SERVICE_ROLE_KEY"
setenv DASHBOARD_USERNAME admin
setenv DASHBOARD_PASSWORD "$DASHBOARD_PASSWORD"
setenv SECRET_KEY_BASE "$SECRET_KEY_BASE"
setenv REALTIME_DB_ENC_KEY "$REALTIME_DB_ENC_KEY"
setenv VAULT_ENC_KEY "$VAULT_ENC_KEY"
setenv PG_META_CRYPTO_KEY "$PG_META_CRYPTO_KEY"
setenv LOGFLARE_PUBLIC_ACCESS_TOKEN "$LOGFLARE_PUBLIC_ACCESS_TOKEN"
setenv LOGFLARE_PRIVATE_ACCESS_TOKEN "$LOGFLARE_PRIVATE_ACCESS_TOKEN"
setenv KONG_HTTP_PORT "$KONG_PORT"
setenv API_GW_HTTP_PORT "$KONG_PORT"
setenv SITE_URL "https://$DOMAIN"
setenv API_EXTERNAL_URL "https://$DOMAIN"
setenv SUPABASE_PUBLIC_URL "https://$DOMAIN"
setenv ADDITIONAL_REDIRECT_URLS "https://$DOMAIN/**"
setenv DISABLE_SIGNUP false
setenv ENABLE_EMAIL_SIGNUP true
setenv ENABLE_EMAIL_AUTOCONFIRM true   # username login uses internal addresses; no mail is sent
setenv ENABLE_ANONYMOUS_USERS false
setenv ENABLE_PHONE_SIGNUP false
setenv POOLER_TENANT_ID butl

log "Supabase başlatılıyor"
cd "$SB_DIR"
docker compose pull -q
docker compose up -d

dbq() { docker compose -f "$SB_DIR/docker-compose.yml" exec -T db psql -U supabase_admin -d postgres -v ON_ERROR_STOP=1 "$@"; }
log "Veritabanı ve depolama bekleniyor"
for i in $(seq 1 90); do
  if dbq -tAc "select to_regclass('storage.buckets') is not null and to_regclass('auth.users') is not null" 2>/dev/null | grep -q t; then break; fi
  sleep 3; [[ $i -eq 90 ]] && { echo "Supabase hazır olmadı: docker compose -f $SB_DIR/docker-compose.yml logs"; exit 1; }
done

log "Oyun veritabanı kuruluyor"
dbq -c "create table if not exists public._vps_migrations(name text primary key, applied_at timestamptz default now()); revoke all on public._vps_migrations from anon, authenticated;"
if [[ "$(dbq -tAc "select to_regclass('public.rooms') is null")" == "t" ]]; then
  dbq -c "insert into storage.buckets(id, name, public) values ('avatars','avatars',false) on conflict (id) do nothing;"
  dbq < "$APP_DIR/supabase/migrations/20261015073400_cloud_bootstrap.sql"
  # Record only the migrations embedded in this bootstrap snapshot.
  while IFS= read -r n; do
    dbq -c "insert into public._vps_migrations(name) values ('$n') on conflict do nothing;"
  done < <(bash "$APP_DIR/deploy/vps/bootstrap-migrations.sh")
  dbq -c "insert into public._vps_migrations(name) values ('0000_cloud_bootstrap.sql') on conflict do nothing;"
  echo "Şema kuruldu."
else
  echo "Şema zaten var, yeni migration'lar uygulanıyor."
fi
bash "$APP_DIR/deploy/vps/migrate.sh"
docker compose restart rest realtime >/dev/null

# ---------- Build the game ----------
log "Oyun derleniyor"
cat > "$APP_DIR/.env.production.local" <<EOF
VITE_SUPABASE_URL=https://$DOMAIN
VITE_SUPABASE_PUBLISHABLE_KEY=$ANON_KEY
VITE_SUPABASE_ANON_KEY=$ANON_KEY
VITE_SUPABASE_PROJECT_ID=selfhosted
EOF
bash "$APP_DIR/deploy/vps/build.sh"

cat > /etc/systemd/system/butl.service <<EOF
[Unit]
Description=Butl game (Node server)
After=network.target docker.service

[Service]
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PORT=$APP_PORT
Environment=HOST=127.0.0.1
Environment=SUPABASE_URL=http://127.0.0.1:$KONG_PORT
Environment=SUPABASE_PUBLISHABLE_KEY=$ANON_KEY
Environment=SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
ExecStart=/usr/bin/node $APP_DIR/.output/server/index.mjs
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
chmod 600 /etc/systemd/system/butl.service
systemctl daemon-reload
systemctl enable --now butl
systemctl restart butl

# ---------- HTTPS reverse proxy (WebSocket included) + static files ----------
log "Caddy (HTTPS) ayarlanıyor"
APP_PORT=$APP_PORT KONG_PORT=$KONG_PORT bash "$APP_DIR/deploy/vps/caddy.sh"

log "Güvenlik duvarı"
ufw allow OpenSSH >/dev/null; ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null

log "Kontrol"
sleep 3
curl -fsS -o /dev/null -w "Oyun sunucusu: %{http_code}\n" "http://127.0.0.1:$APP_PORT/auth" || echo "Oyun sunucusu yanıt vermedi: journalctl -u butl -n 50"
curl -fsS -o /dev/null -w "Auth servisi:  %{http_code}\n" -H "apikey: $ANON_KEY" "http://127.0.0.1:$KONG_PORT/auth/v1/health" || echo "Auth yanıt vermedi"
curl -fsS -o /dev/null -w "Veri servisi:  %{http_code}\n" -H "apikey: $ANON_KEY" "http://127.0.0.1:$KONG_PORT/rest/v1/gift_prices?select=gift_type&limit=1" || echo "REST yanıt vermedi"

echo -e "\n\033[1;32mKurulum bitti:\033[0m https://$DOMAIN"
echo "Gizli anahtarlar: $CONF (yedekleyin, paylaşmayın)."
echo "Yönetim paneli (yalnız SSH tüneliyle): ssh -L 8000:127.0.0.1:8000 root@SUNUCU  -> http://localhost:8000  (admin / DASHBOARD_PASSWORD)"
