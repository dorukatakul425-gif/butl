-- Real game table rules (Telegram client 1.6.393):
-- 1. Admins join a full 12-seat table as a spectator (seat -1, no gameplay).
-- 2. list_tables hides empty tables (except the viewer's current table and
--    tables with an active kickout countdown for the viewer).
-- 3. A full table answers with the 'table_full' error; the client opens the
--    original "Boş yer yoxdur" popup.
-- 4. buy_bottle posts a structured 'bottle' info line to the table chat
--    (old -> new bottle), broadcast to everyone over realtime.
-- 5. Gifts credit the receiver the per-gift kiss/heart rewards from
--    gift_prices (real game: gift.kiss raises the receiver's kiss counters,
--    gift.gold pays hearts); defaults stay 0 until configured.

alter table public.room_players drop constraint if exists room_players_seat_check;
alter table public.room_players add constraint room_players_seat_check check (seat between -1 and 11);

alter table public.chat_messages drop constraint if exists chat_messages_kind_check;
alter table public.chat_messages add constraint chat_messages_kind_check
  check (kind in ('chat','admin_chat','ban','disabled_ban','music','newcomer','birthday','bottle'));

alter table public.gift_prices add column if not exists kisses int not null default 0;
alter table public.gift_prices add column if not exists hearts int not null default 0;

-- Spectators never become spinner/target and never spin or decide: seat -1
-- matches no parity seat, _next_seat only walks 0..11, spin_bottle requires
-- spinner = seat and decide requires seat in (spinner, target).
create or replace function public.change_table(p_room bigint default null) returns table(room_id bigint, seat smallint)
language plpgsql security definer set search_path = public as $$
declare me public.profiles; cur bigint; rid bigint; s smallint; parity int;
begin
  select * into me from public.profiles where id = auth.uid();
  if not found then raise exception 'not signed in'; end if;
  parity := case when me.male then 1 else 0 end;
  select rp.room_id into cur from public.room_players rp where rp.user_id = me.id;
  if p_room is not null then
    if p_room = cur then raise exception 'Zaten bu masadasın'; end if;
    select r.id into rid from public.rooms r where r.id = p_room for update;
    if rid is null then raise exception 'Masa bulunamadı'; end if;
  else
    select r.id into rid from public.rooms r
     where r.id is distinct from cur
       and (select count(*) from public.room_players p where p.room_id = r.id and p.seat % 2 = parity) < 6
     order by (select count(*) from public.room_players p where p.room_id = r.id) desc, r.id limit 1
     for update skip locked;
    if rid is null then insert into public.rooms default values returning id into rid; end if;
  end if;
  select g.s into s from generate_series(0,11) g(s)
   where g.s % 2 = parity and not exists (select 1 from public.room_players p where p.room_id = rid and p.seat = g.s)
   order by random() limit 1;
  if s is null then
    -- Admin spectator: a full table stays watchable (original goto_view_table).
    if public.has_role(me.id, 'admin') then
      delete from public.room_players where user_id = me.id;
      insert into public.room_players(room_id, seat, user_id) values (rid, -1, me.id);
      return query select rid, (-1)::smallint; return;
    end if;
    raise exception 'table_full';
  end if;
  delete from public.room_players where user_id = me.id;
  insert into public.room_players(room_id, seat, user_id) values (rid, s, me.id);
  update public.rooms set spinner = coalesce(spinner, s), phase_at = case when spinner is null then now() else phase_at end where id = rid;
  return query select rid, s;
end $$;

drop function if exists public.list_tables();
create function public.list_tables()
 returns table(room_id bigint, men integer, women integer, bottle text, is_current boolean,
               blocked_until timestamptz, kicker_id uuid, kicker_name text, kicker_photo text, kicker_male boolean)
 language sql stable security definer set search_path to 'public'
as $$
  with cur as (select public.my_room() as id),
  cand as (
    select c.id as room_id, -1 as grp, now() as ord from cur c where c.id is not null
    union all
    select h.room_id, 0, h.visited_at from public.table_history h where h.user_id = auth.uid()
    union all
    select p.room_id, 1, max(p.joined_at) from public.room_players p group by p.room_id
  ),
  best as (select c.room_id, min(c.grp) grp, max(c.ord) ord from cand c group by c.room_id),
  counted as (
    select b.room_id, b.grp, b.ord,
      (select count(*)::int from public.room_players p where p.room_id = b.room_id and p.seat % 2 = 1) as men,
      (select count(*)::int from public.room_players p where p.room_id = b.room_id and p.seat % 2 = 0) as women
    from best b
  )
  select c.room_id, c.men, c.women,
    coalesce((select r.bottle from public.rooms r where r.id = c.room_id), 'standart'),
    c.grp = -1,
    kt.blocked_until,
    kp.id,
    kp.name,
    kp.photo_url,
    kp.male
  from counted c
  left join public.kickout_targets kt
    on kt.room_id = c.room_id and kt.user_id = auth.uid() and kt.blocked_until > now()
  left join public.profiles kp on kp.id = kt.kicked_by
  -- Empty tables stay hidden; the current table and an active kickout countdown remain visible.
  where c.men + c.women > 0 or c.grp = -1 or kt.blocked_until is not null
  order by c.grp, c.ord desc limit 20
$$;
grant execute on function public.list_tables() to authenticated;

create or replace function public.buy_bottle(p_bottle text)
 returns integer language plpgsql security definer set search_path to 'public'
as $$
declare rid bigint; me public.profiles; b public.bottle_prices; old_bottle text;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  select * into b from public.bottle_prices where bottle = p_bottle;
  if not found then raise exception 'not for sale'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if b.vip_only and (me.vip_until is null or me.vip_until < now()) then raise exception 'vip required'; end if;
  if me.gold < b.price then raise exception 'insufficient gold'; end if;
  select r.bottle into old_bottle from public.rooms r where r.id = rid;
  update public.profiles set gold = gold - b.price where id = me.id;
  update public.rooms set bottle = p_bottle where id = rid;
  -- Original ChatPresenter.changeBottle: structured info line with old -> new bottle.
  insert into public.chat_messages(room_id, user_id, text, kind, payload)
  values (rid, me.id, coalesce(old_bottle, 'standart') || '>' || p_bottle, 'bottle',
          jsonb_build_object('old', coalesce(old_bottle, 'standart'), 'new', p_bottle));
  return me.gold - b.price;
end $$;

create or replace function public.send_gift(p_gift text, p_receivers uuid[], p_seed int default 0) RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
declare rid bigint; g public.gift_prices; me public.profiles; n int; total int;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  select * into g from public.gift_prices where gift_type = p_gift;
  if not found then raise exception 'unknown gift'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if g.vip_only and (me.vip_until is null or me.vip_until < now()) then raise exception 'vip required'; end if;
  if me.kisses < g.kisses_required then raise exception 'kisses required'; end if;
  select count(*) into n from public.room_players where room_id = rid and user_id = any(p_receivers) and user_id <> me.id;
  if n = 0 then raise exception 'no receivers'; end if;
  total := g.price * n;
  if me.gold < total then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - total where id = me.id;
  insert into public.gift_events(room_id, sender_id, receiver_id, gift_type, seed)
    select rid, me.id, user_id, p_gift, p_seed from public.room_players where room_id = rid and user_id = any(p_receivers) and user_id <> me.id;
  -- Real game: the receiver gets the gift's kiss reward (table + total counters)
  -- and, when the gift carries hearts, the heart payout.
  if g.kisses > 0 then
    update public.profiles set kisses = kisses + g.kisses
     where id in (select user_id from public.room_players where room_id = rid and user_id = any(p_receivers) and user_id <> me.id);
    update public.room_players set kisses = kisses + g.kisses
     where room_id = rid and user_id = any(p_receivers) and user_id <> me.id;
  end if;
  if g.hearts > 0 then
    update public.profiles set gold = gold + g.hearts
     where id in (select user_id from public.room_players where room_id = rid and user_id = any(p_receivers) and user_id <> me.id);
  end if;
  insert into public.dj_events(user_id, points)
    select rp.user_id, 1 from public.room_players rp
     join public.rooms r on r.id = rp.room_id
    where rp.room_id = rid and rp.user_id = any(p_receivers) and rp.user_id <> me.id
      and r.music is not null and r.music->>'sender' = rp.user_id::text
      and now() - (r.music->>'started_at')::timestamptz < make_interval(secs => coalesce((r.music->'item'->>'duration')::numeric, 0));
  return me.gold - total;
end $$;
