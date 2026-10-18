// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const a = '00000000-0000-0000-0000-000000000001';
const b = '00000000-0000-0000-0000-000000000002';
const c = '00000000-0000-0000-0000-000000000003';
let db: PGlite;
const as = (id: string) => db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]);
/** Rows visible to `id` under the chat RLS policy expression. */
async function visible(id: string) {
  await as(id);
  return (await db.query<{ text: string }>(`SELECT text FROM chat_messages WHERE room_id = my_room() AND (NOT is_private OR user_id = auth.uid() OR receiver_id = auth.uid()) ORDER BY id`)).rows.map(r => r.text);
}
const kinds = async () => (await db.query<{ kind: string; actor_id: string; target_id: string }>('SELECT kind, actor_id, target_id FROM kickout_events ORDER BY id')).rows;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE TABLE profiles(id uuid PRIMARY KEY,gold integer NOT NULL,vip_until timestamptz);
    CREATE TABLE rooms(id bigint PRIMARY KEY);
    CREATE TABLE room_players(room_id bigint REFERENCES rooms(id),user_id uuid PRIMARY KEY REFERENCES profiles(id));
    CREATE FUNCTION my_room() RETURNS bigint LANGUAGE sql AS $$ SELECT room_id FROM room_players WHERE user_id = auth.uid() $$;
    CREATE TABLE chat_messages(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, room_id bigint, user_id uuid, receiver_id uuid, text text, created_at timestamptz DEFAULT now());
    ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "chat read own room" ON chat_messages FOR SELECT TO authenticated USING (room_id = my_room());
    CREATE FUNCTION send_chat(p_text text, p_receiver uuid DEFAULT NULL) RETURNS void LANGUAGE sql AS $$ SELECT 1 $$;
    CREATE PUBLICATION supabase_realtime;`);
  await db.exec(readFileSync(new URL('../../supabase/migrations/20261018160000_kickout.sql', import.meta.url), 'utf8'));
  await db.exec(readFileSync(new URL('../../supabase/migrations/20261019150000_private_chat_kickout_events.sql', import.meta.url), 'utf8'));
}, 30000);
beforeEach(async () => {
  await db.exec(`TRUNCATE room_players,kickout_targets,kickout_usage,kickout_events,chat_messages,profiles,rooms CASCADE;
    UPDATE kickout_config SET paid_price=30,free_cooldown_seconds=86400;
    INSERT INTO rooms VALUES(1);
    INSERT INTO profiles VALUES('${a}',50,now()+interval '1 day'),('${b}',50,null),('${c}',50,null);
    INSERT INTO room_players VALUES(1,'${a}'),(1,'${b}'),(1,'${c}');`);
  await as(a);
});
afterAll(async () => { await db?.close(); });

describe('private chat from the profile popup', () => {
  it('is visible only to the sender and the receiver', async () => {
    await db.query('SELECT send_chat($1,$2,true)', ['gizli', b]);
    await db.query('SELECT send_chat($1,null,false)', ['herkese']);
    expect(await visible(a)).toEqual(['gizli', 'herkese']);
    expect(await visible(b)).toEqual(['gizli', 'herkese']);
    expect(await visible(c)).toEqual(['herkese']);
  });
  it('needs another player at the table as receiver', async () => {
    await expect(db.query('SELECT send_chat($1,null,true)', ['x'])).rejects.toThrow('private_needs_receiver');
    await expect(db.query('SELECT send_chat($1,$2,true)', ['x', a])).rejects.toThrow('private_needs_receiver');
  });
});

describe('kick / save / kicked table events', () => {
  it('records a kick by the kicker and a save by the saver', async () => {
    await db.query('SELECT kickout_action($1,$2,0)', [b, 'kick']);
    await as(b); await db.query('SELECT kickout_action($1,$2,0)', [b, 'save']);
    expect(await kinds()).toEqual([{ kind: 'kick', actor_id: a, target_id: b }, { kind: 'save', actor_id: b, target_id: b }]);
  });
  it('records kicked when the 30 seconds run out and the player is removed', async () => {
    await db.query('SELECT kickout_action($1,$2,0)', [b, 'kick']);
    await db.exec("UPDATE kickout_targets SET kick_at = now() - interval '1 second'");
    await db.query('SELECT kickout_refresh()');
    expect((await kinds()).map(k => k.kind)).toEqual(['kick', 'kicked']);
    expect((await db.query('SELECT 1 FROM room_players WHERE user_id=$1', [b])).rows).toHaveLength(0);
  });
});
