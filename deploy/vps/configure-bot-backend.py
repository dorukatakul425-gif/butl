#!/usr/bin/env python3
"""Give the bot the existing server-only database config; never print values."""
import os
import shlex
import subprocess
from pathlib import Path

raw = subprocess.check_output(['systemctl', 'show', 'butl', '--property=Environment', '--value'], text=True)
values = dict(item.split('=', 1) for item in shlex.split(raw) if '=' in item)
required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
if not all(values.get(name) for name in required):
    raise SystemExit('Bot backend configuration is missing.')
path = Path('/etc/butl/bot-backend.env')
fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
os.fchmod(fd, 0o600)
with os.fdopen(fd, 'w') as file:
    for name in required:
        file.write(name + '=' + shlex.quote(values[name]) + '\n')
print('Bot backend configuration installed.')