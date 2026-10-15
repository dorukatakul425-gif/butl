#!/usr/bin/env bash
# Builds the game as a standalone Node server into .output/ (Lovable keeps its own Cloudflare build).
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$APP_DIR"
[[ -f .env.production.local ]] || { echo ".env.production.local yok: önce install.sh çalıştırın."; exit 1; }
# Lovable's .env points to Lovable Cloud; production build must use the VPS values.
set -a; source .env.production.local; set +a
bun install --frozen-lockfile || bun install
rm -rf .output
NITRO_PRESET=node-server ./node_modules/.bin/vite build
test -f .output/server/index.mjs || { echo "Derleme çıktısı bulunamadı."; exit 1; }
echo "Derleme tamam: .output/server/index.mjs"
