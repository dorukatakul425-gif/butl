#!/usr/bin/env bash
# Pulls the latest code from GitHub, applies new SQL, rebuilds and restarts the game.
#   sudo bash deploy/vps/update.sh
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$APP_DIR"
git pull --ff-only
bash deploy/vps/migrate.sh
docker compose -f /opt/butl-supabase/docker-compose.yml restart rest >/dev/null
bash deploy/vps/voice-turn.sh
bash deploy/vps/build.sh
systemctl restart butl
# WebSocket hub (env file /etc/butl-ws.env holds DATABASE_URL + JWT_SECRET).
(cd ws-hub && npm install --omit=dev --no-audit --no-fund >/dev/null)
install -m 644 deploy/vps/butl-ws.service /etc/systemd/system/butl-ws.service
systemctl daemon-reload
systemctl enable butl-ws >/dev/null 2>&1 || true
systemctl restart butl-ws
# Oyun servisi de butl.env'i okusun (TELEGRAM_BOT_TOKEN vb. sunucu fonksiyonlarına ulaşsın).
mkdir -p /etc/systemd/system/butl.service.d
printf '[Service]\nEnvironmentFile=/etc/butl/butl.env\n' > /etc/systemd/system/butl.service.d/telegram.conf
# Telegram botu: servis dosyasını tazele ve çalıştır (token /etc/butl/butl.env içinde).
install -m 644 deploy/vps/butl-bot.service /etc/systemd/system/butl-bot.service
python3 deploy/vps/configure-bot-backend.py
systemctl daemon-reload
systemctl enable --now butl-bot >/dev/null 2>&1 || true
systemctl restart butl-bot || true
bash deploy/vps/caddy.sh
sleep 2
S=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: $(. /etc/butl/butl.env; echo "$DOMAIN")" http://127.0.0.1:3000/auth || true)
echo "Oyun sunucusu: $S"
echo "Güncelleme tamam."
