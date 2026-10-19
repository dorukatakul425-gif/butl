-- Original game.kisses recipient rule: a kiss raises the KISSED player's counter
-- even when the other side refuses. Spinner kisses -> target +1; target kisses
-- back -> spinner +1; mutual kiss -> both +1. Refusing never blocks a received kiss.
CREATE OR REPLACE FUNCTION public._finish_choice(p_room bigint) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
declare r public.rooms; d jsonb;
begin
  select * into r from public.rooms where id = p_room for update;
  if r.phase <> 'choose' then return; end if;
  d := jsonb_build_object(r.spinner::text, 'refuse', r.target::text, 'refuse') || r.decisions;
  if d->>r.spinner::text = 'kiss' then
    update public.profiles set kisses = kisses + 1
     where id in (select user_id from public.room_players where room_id = p_room and seat = r.target);
    update public.room_players set kisses = kisses + 1
     where room_id = p_room and seat = r.target;
    insert into public.kiss_events(user_id)
     select user_id from public.room_players where room_id = p_room and seat = r.target;
  end if;
  if d->>r.target::text = 'kiss' then
    update public.profiles set kisses = kisses + 1
     where id in (select user_id from public.room_players where room_id = p_room and seat = r.spinner);
    update public.room_players set kisses = kisses + 1
     where room_id = p_room and seat = r.spinner;
    insert into public.kiss_events(user_id)
     select user_id from public.room_players where room_id = p_room and seat = r.spinner;
  end if;
  update public.rooms set phase='result', decisions=d, phase_at=now() where id = p_room;
end $$;
