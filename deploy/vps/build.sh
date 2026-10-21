#!/usr/bin/env bash
# Builds the game as a standalone Node server into .output/ (Lovable keeps its own Cloudflare build).
# Builds in a separate copy and swaps the result in at the end, so the live game keeps
# serving players during the whole build (no "page not found" while updating).
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$APP_DIR"
[[ -f .env.production.local ]] || { echo ".env.production.local yok: önce install.sh çalıştırın."; exit 1; }
BUILD_DIR="${APP_DIR}-build"
mkdir -p "$BUILD_DIR"
rsync -a --delete --exclude '.output*' --exclude '.git' "$APP_DIR/" "$BUILD_DIR/"
cd "$BUILD_DIR"
# Lovable's .env points to Lovable Cloud; production build must use the VPS values.
set -a; source .env.production.local; set +a
bun install --frozen-lockfile || bun install
rm -rf .output
NITRO_PRESET=node-server ./node_modules/.bin/vite build
test -f .output/server/index.mjs || { echo "Derleme çıktısı bulunamadı."; exit 1; }
rm -rf "$APP_DIR/.output-previous"
[[ -d "$APP_DIR/.output" ]] && mv "$APP_DIR/.output" "$APP_DIR/.output-previous"
mv "$BUILD_DIR/.output" "$APP_DIR/.output"
echo "Derleme tamam: .output/server/index.mjs"
