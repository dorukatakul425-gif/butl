// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';

it('marks only embedded migrations, leaving kick/save and later features for the migration runner', () => {
  const script = fileURLToPath(new URL('../../deploy/vps/bootstrap-migrations.sh', import.meta.url));
  const names = execFileSync('bash', [script], { encoding: 'utf8' }).trim().split('\n');
  expect(names).toContain('0000_butl_game_schema.sql');
  expect(names).toContain('0015_statuses.sql');
  expect(names).toHaveLength(16);
  expect(names).not.toContain('0016_voice_rooms.sql');
  expect(names).not.toContain('0028_kickout.sql');
});