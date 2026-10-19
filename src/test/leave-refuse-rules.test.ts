// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const spinnerUser = '00000000-0000-0000-0000-0000000000b1';
const targetUser = '00000000-0000-0000-0000-0000000000c1';
let db: PGlite;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    CREATE TABLE profiles(id uuid PRIMARY KEY, kisses integer NOT NULL DEFAULT 0);
    CREATE TABLE rooms(id bigint PRIMARY KEY, phase text NOT NULL DEFAULT 'offer',
      spinner smallint, target smallint, decisions jsonb NOT NULL DEFAULT '{}',
      phase_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE room_players(room_id bigint NOT NULL, user_id uuid NOT NULL, seat smallint NOT NULL,
      kisses integer NOT NULL DEFAULT 0, last_seen timestamptz NOT NULL DEFAULT now());
    CREATE TABLE kiss_events(user_id uuid NOT NULL);
    CREATE FUNCTION public._has_pair(bigint) RETURNS boolean LANGUAGE sql STABLE AS $$ SELECT true $$;
    CREATE FUNCTION public._next_seat(bigint, integer) RETURNS smallint LANGUAGE sql STABLE AS $$ SELECT 0::smallint $$;
    CREATE FUNCTION public._do_spin(bigint) RETURNS void LANGUAGE plpgsql AS $$ BEGIN END $$;
    INSERT INTO profiles VALUES ('${spinnerUser}', 0), ('${targetUser}', 0);
    INSERT INTO rooms(id, phase, spinner, target) VALUES (1, 'choose', 0, 1), (2, 'choose', 0, 1), (3, 'offer', null, null);
    INSERT INTO room_players(room_id, user_id, seat) VALUES (1, '${spinnerUser}', 0), (1, '${targetUser}', 1),
      (2, '${spinnerUser}', 0), (2, '${targetUser}', 1);
    INSERT INTO room_players(room_id, user_id, seat, last_seen) VALUES
      (3, '${spinnerUser}', 0, now() - interval '30 seconds'), (3, '${targetUser}', 1, now());`);
  await db.exec(readFileSync(new URL('../../drizzle/migrations/0051_leave_and_refuse_rules.sql', import.meta.url), 'utf8'));
}, 30000);

afterAll(async () => { await db?.close(); });

describe('Ciliz parity: refuse arrows and seat cleanup', () => {
  it('shows no red arrow when a player stays silent (no auto-refuse on timeout)', async () => {
    await db.query(`SELECT public._finish_choice(1)`);
    const { rows } = await db.query(`SELECT phase, decisions FROM rooms WHERE id = 1`);
    expect(rows[0].phase).toBe('result');
    expect(rows[0].decisions).toEqual({});
  });

  it('keeps only the real decisions: one kiss, silent target gets no arrow and no kiss is credited', async () => {
    await db.query(`UPDATE rooms SET decisions = '{"0":"kiss"}' WHERE id = 2`);
    await db.query(`SELECT public._finish_choice(2)`);
    const { rows } = await db.query(`SELECT decisions FROM rooms WHERE id = 2`);
    expect(rows[0].decisions).toEqual({ 0: 'kiss' });
    const kisses = await db.query(`SELECT kisses FROM profiles ORDER BY id`);
    expect(kisses.rows.map(r => r.kisses)).toEqual([0, 0]);
  });

  it('frees the seat of a player gone for more than 10 seconds so someone else can take it', async () => {
    await db.query(`SELECT public.room_tick(3)`);
    const { rows } = await db.query(`SELECT user_id FROM room_players WHERE room_id = 3 ORDER BY seat`);
    expect(rows).toEqual([{ user_id: targetUser }]);
  });
});
