#!/usr/bin/env bash
# Print only migrations actually embedded in the checked-in bootstrap snapshot.
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
sed -n 's/^-- Source: \(.*\.sql\)$/\1/p' "$APP_DIR/supabase/migrations/20261015073400_cloud_bootstrap.sql"