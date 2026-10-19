-- Ciliz rules: a red refuse arrow only appears when the player actively refuses
-- (server game_refuse). A player who stays silent gets no arrow, so timed-out
-- choices stay absent from decisions instead of defaulting to 'refuse'.
create or replace function public._finish_choice(p_room bigint) returns void
language plpgsql security definer set search_path = public as $$
declare r public.rooms; d jsonb;
begin
  select * into r from public.rooms where id = p_room for update;
  if r.phase <> 'choose' then return; end if;
  d := r.decisions;
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

-- Ciliz drops a player from the table the moment their socket closes. Our
-- keepalive runs every 5s, so two missed beats (10s) mean the app is gone:
-- free the seat fast so someone else can take it and the turn moves on.
create or replace function public.room_tick(p_room bigint) returns void
language plpgsql security definer set search_path = public as $$
declare r public.rooms; age double precision; nxt smallint;
begin
  delete from public.room_players where room_id = p_room and last_seen < now() - interval '10 seconds';
  select * into r from public.rooms where id = p_room for update skip locked;
  -- Another player is already advancing this room: skip instead of queueing on the lock.
  if not found then return; end if;
  if not public._has_pair(p_room) then
    if r.phase <> 'offer' or r.spinner is not null then
      update public.rooms set phase='offer', spinner=null, target=null, decisions='{}'::jsonb, phase_at=now() where id = p_room;
    end if;
    return;
  end if;
  if r.spinner is null or not exists (select 1 from public.room_players where room_id=p_room and seat=r.spinner)
     or (r.phase in ('spin','choose','result') and (r.target is null or not exists (select 1 from public.room_players where room_id=p_room and seat=r.target))) then
    nxt := public._next_seat(p_room, coalesce(r.spinner, 0));
    update public.rooms set phase='offer', spinner=nxt, target=null, decisions='{}'::jsonb, phase_at=now() where id = p_room;
    return;
  end if;
  age := extract(epoch from now() - r.phase_at);
  if r.phase = 'offer' then
    if age >= 9 then perform public._do_spin(p_room); end if;
  elsif r.phase = 'spin' and age >= 6 then
    update public.rooms set phase='choose', phase_at=now() where id = p_room;
  elsif r.phase = 'choose' and age >= 9 then
    perform public._finish_choice(p_room);
  elsif r.phase = 'result' and age >= 2 then
    update public.rooms set phase='return', phase_at=now() where id = p_room;
  elsif r.phase = 'return' and age >= 1 then
    nxt := case when exists (select 1 from public.room_players where room_id=p_room and seat=r.target) then r.target
                else public._next_seat(p_room, coalesce(r.target, 0)) end;
    update public.rooms set phase='offer', spinner=nxt, target=null, decisions='{}'::jsonb, phase_at=now() where id = p_room;
  end if;
end $$;
