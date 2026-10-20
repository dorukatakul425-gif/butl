#!/usr/bin/env bash
# Own TURN relay for WebRTC audio on restrictive mobile networks.
set -euo pipefail
[[ $EUID -eq 0 ]] || { echo "Run with sudo"; exit 1; }
CONF=/etc/butl/butl.env
source "$CONF"
[[ -n "${DOMAIN:-}" ]] || { echo "Missing game domain"; exit 1; }
mkdir -p /etc/butl
python3 - "$CONF" "$DOMAIN" <<'PY'
import pathlib,secrets,sys
p=pathlib.Path(sys.argv[1]); lines=p.read_text().splitlines()
values=dict(line.split('=',1) for line in lines if '=' in line and not line.startswith('#'))
secret=values.get('TURN_SECRET','').strip().strip('\"\x27') or secrets.token_hex(32)
urls=f'turn:{sys.argv[2]}:3478?transport=udp,turn:{sys.argv[2]}:3478?transport=tcp'
lines=[l for l in lines if not l.startswith(('TURN_SECRET=','TURN_URLS='))]
p.write_text('\n'.join(lines)+f'\nTURN_SECRET={secret}\nTURN_URLS={urls}\n');p.chmod(0o600)
config=pathlib.Path('/etc/butl/turnserver.conf')
config.write_text(f'''listening-port=3478
fingerprint
use-auth-secret
static-auth-secret={secret}
realm={sys.argv[2]}
min-port=49160
max-port=49260
no-cli
no-tls
no-dtls
no-multicast-peers
no-loopback-peers
denied-peer-ip=10.0.0.0-10.255.255.255
denied-peer-ip=172.16.0.0-172.31.255.255
denied-peer-ip=192.168.0.0-192.168.255.255
denied-peer-ip=169.254.0.0-169.254.255.255
user-quota=20
total-quota=500
no-software-attribute
''');config.chmod(0o600)
PY
docker pull coturn/coturn:4.6.3 >/dev/null
docker rm -f butl-turn >/dev/null 2>&1 || true
docker run -d --name butl-turn --restart unless-stopped --network host \
  --user 0:0 -v /etc/butl/turnserver.conf:/etc/coturn/turnserver.conf:ro \
  coturn/coturn:4.6.3 -c /etc/coturn/turnserver.conf >/dev/null
if command -v ufw >/dev/null && ufw status | grep -q 'Status: active'; then
  ufw allow 3478/udp >/dev/null
  ufw allow 3478/tcp >/dev/null
  ufw allow 49160:49260/udp >/dev/null
fi
echo "Voice relay configured."