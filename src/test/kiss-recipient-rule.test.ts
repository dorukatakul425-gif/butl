// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const a = '00000000-0000-0000-0000-000000000001';
const b = '00000000-0000-0000-0000-000000000002';
let db: PGlite;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    CREATE TABLE profiles(id uuid PRIMARY KEY, kisses integer NOT NULL DEFAULT 0);
    CREATE TABLE rooms(id bigint PRIMARY KEY, phase text NOT NULL DEFAULT 'choose', spinner smallint, target smallint,
      decisions jsonb NOT NULL DEFAULT '{}', phase_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE room_players(room_id bigint, user_id uuid, seat smallint, kisses integer NOT NULL DEFAULT 0);
    CREATE TABLE kiss_events(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, user_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
    INSERT INTO profiles VALUES ('${a}', 0), ('${b}', 0);
    INSERT INTO rooms(id, spinner, target) VALUES (1, 1, 2);
    INSERT INTO room_players VALUES (1, '${a}', 1, 0), (1, '${b}', 2, 0);`);
  await db.exec(readFileSync(new URL('../../drizzle/migrations/0041_kiss_recipient_rule.sql', import.meta.url), 'utf8'));
}, 30000);

beforeEach(async () => {
  await db.exec(`UPDATE profiles SET kisses = 0; UPDATE room_players SET kisses = 0; TRUNCATE kiss_events;
    UPDATE rooms SET phase = 'choose', decisions = '{}', phase_at = now() WHERE id = 1;`);
});

afterAll(async () => { await db?.close(); });

async function finish(decisions: Record<string, 'kiss' | 'refuse'>) {
  await db.query(`UPDATE rooms SET decisions = $1::jsonb WHERE id = 1`, [JSON.stringify(decisions)]);
  await db.query(`SELECT public._finish_choice(1)`);
}
async function counters() {
  const p = await db.query<{ id: string; kisses: number }>(`SELECT id, kisses FROM profiles ORDER BY id`);
  const t = await db.query<{ user_id: string; kisses: number }>(`SELECT user_id, kisses FROM room_players ORDER BY user_id`);
  const e = await db.query<{ user_id: string }>(`SELECT user_id FROM kiss_events ORDER BY user_id`);
  return { p: p.rows, t: t.rows, e: e.rows };
}

describe('kiss recipient rule', () => {
  it('raises only the kissed player when the kiss is one-sided', async () => {
    await finish({ '1': 'kiss', '2': 'refuse' });
    const { p, t, e } = await counters();
    expect(p).toEqual([{ id: a, kisses: 0 }, { id: b, kisses: 1 }]);
    expect(t).toEqual([{ user_id: a, kisses: 0 }, { user_id: b, kisses: 1 }]);
    expect(e).toEqual([{ user_id: b }]);
  });

  it('raises both players on a mutual kiss', async () => {
    await finish({ '1': 'kiss', '2': 'kiss' });
    const { p, e } = await counters();
    expect(p).toEqual([{ id: a, kisses: 1 }, { id: b, kisses: 1 }]);
    expect(e).toEqual([{ user_id: a }, { user_id: b }]);
  });

  it('raises nobody when both refuse', async () => {
    await finish({ '1': 'refuse', '2': 'refuse' });
    const { p, e } = await counters();
    expect(p).toEqual([{ id: a, kisses: 0 }, { id: b, kisses: 0 }]);
    expect(e).toEqual([]);
  });

  it('counts the kissed player even when the spinner never decided', async () => {
    await finish({ '2': 'kiss' });
    const { p } = await counters();
    expect(p).toEqual([{ id: a, kisses: 1 }, { id: b, kisses: 0 }]);
  });
});
