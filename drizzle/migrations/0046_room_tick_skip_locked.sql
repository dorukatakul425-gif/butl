-- Many clients tick the same room; skip when it is already locked so ticks never queue up.
create or replace function public.room_tick(p_room bigint) returns void
language plpgsql security definer set search_path = public as $$
declare r public.rooms; age double precision; nxt smallint;
begin
  delete from public.room_players where room_id = p_room and last_seen < now() - interval '20 seconds';
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
