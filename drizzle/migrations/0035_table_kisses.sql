-- Original game.kisses: per-table kiss counter shown on the seat photo's top-right.
-- It lives on room_players, so it resets when the player leaves the table and is
-- restored from the server on rejoin — exactly like the original game_join payload.
ALTER TABLE public.room_players ADD COLUMN IF NOT EXISTS kisses integer NOT NULL DEFAULT 0;

-- Mutual bottle kiss raises the table counter for both players (recipient rule:
-- the original increments the counter of the player being kissed; on a mutual
-- kiss both are recipients).
CREATE OR REPLACE FUNCTION public._finish_choice(p_room bigint) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
declare r public.rooms; d jsonb;
begin
  select * into r from public.rooms where id = p_room for update;
  if r.phase <> 'choose' then return; end if;
  d := jsonb_build_object(r.spinner::text, 'refuse', r.target::text, 'refuse') || r.decisions;
  if d->>r.spinner::text = 'kiss' and d->>r.target::text = 'kiss' then
    update public.profiles set kisses = kisses + 1
     where id in (select user_id from public.room_players where room_id = p_room and seat in (r.spinner, r.target));
    update public.room_players set kisses = kisses + 1
     where room_id = p_room and seat in (r.spinner, r.target);
    insert into public.kiss_events(user_id)
     select user_id from public.room_players where room_id = p_room and seat in (r.spinner, r.target);
  end if;
  update public.rooms set phase='result', decisions=d, phase_at=now() where id = p_room;
end $$;
