-- Full schema + seed for butulkam (exported from Lovable Cloud)

--
-- PostgreSQL database dump
--

\restrict pgbGQlLPgyAxT1HAMw2nE455J1I0ZN2rOgTRpDa8bA5huWHqsYih37O04dO2huy

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: _do_spin(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public._do_spin(p_room bigint) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare r public.rooms; t smallint;
begin
  select * into r from public.rooms where id = p_room for update;
  if r.phase <> 'offer' or r.spinner is null then return false; end if;
  select seat into t from public.room_players
   where room_id = p_room and seat % 2 <> r.spinner % 2 order by random() limit 1;
  if t is null then
    update public.rooms set phase_at = now() where id = p_room;
    return false;
  end if;
  update public.rooms set phase='spin', target=t, decisions='{}'::jsonb, round=round+1, phase_at=now() where id = p_room;
  return true;
end $$;


--
-- Name: _finish_choice(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public._finish_choice(p_room bigint) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare r public.rooms; d jsonb;
begin
  select * into r from public.rooms where id = p_room for update;
  if r.phase <> 'choose' then return; end if;
  d := jsonb_build_object(r.spinner::text, 'refuse', r.target::text, 'refuse') || r.decisions;
  if d->>r.spinner::text = 'kiss' and d->>r.target::text = 'kiss' then
    update public.profiles set kisses = kisses + 1
     where id in (select user_id from public.room_players where room_id = p_room and seat in (r.spinner, r.target));
  end if;
  update public.rooms set phase='result', decisions=d, phase_at=now() where id = p_room;
end $$;


--
-- Name: _has_pair(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public._has_pair(p_room bigint) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (select 1 from public.room_players where room_id = p_room and seat % 2 = 1)
     and exists (select 1 from public.room_players where room_id = p_room and seat % 2 = 0)
$$;


--
-- Name: _log_table_visit(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public._log_table_visit() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.table_history(user_id, room_id) values (new.user_id, new.room_id)
  on conflict (user_id, room_id) do update set visited_at = now();
  return new;
end $$;


--
-- Name: _next_seat(bigint, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public._next_seat(p_room bigint, p_after integer) RETURNS smallint
    LANGUAGE sql STABLE
    AS $$
  select seat from public.room_players where room_id = p_room
  order by (seat - p_after + 11) % 12 limit 1
$$;


--
-- Name: ack_achievement(text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.ack_achievement(p_id text, p_level integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM my_achievements() m WHERE m.achievement_id = p_id AND m.level = p_level) THEN RAISE EXCEPTION 'not_completed'; END IF;
  INSERT INTO achievement_acks(user_id, achievement_id, level) VALUES (auth.uid(), p_id, p_level) ON CONFLICT DO NOTHING;
END $$;


--
-- Name: buy_bottle(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.buy_bottle(p_bottle text) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare rid bigint; me public.profiles; b public.bottle_prices;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  select * into b from public.bottle_prices where bottle = p_bottle;
  if not found then raise exception 'not for sale'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if b.vip_only and (me.vip_until is null or me.vip_until < now()) then raise exception 'vip required'; end if;
  if me.gold < b.price then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - b.price where id = me.id;
  update public.rooms set bottle = p_bottle where id = rid;
  return me.gold - b.price;
end $$;


--
-- Name: buy_decor(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.buy_decor(p_item text) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare me public.profiles; pr int;
begin
  select * into me from public.profiles where id = auth.uid() for update;
  if not found then raise exception 'not signed in'; end if;
  if p_item = any(me.owned_items) then return me.gold; end if;
  select price into pr from public.decor_prices where item = p_item;
  if pr is null then raise exception 'not for sale'; end if;
  if me.gold < pr then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - pr, owned_items = array_append(owned_items, p_item) where id = me.id;
  return me.gold - pr;
end $$;


--
-- Name: buy_gold(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.buy_gold(p_real integer) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE uid uuid := auth.uid(); pk record; got integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO pk FROM gold_packages WHERE real = p_real;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  got := pk.gold + pk.bonus;
  UPDATE profiles SET dat = dat - pk.real, gold = gold + got WHERE id = uid AND dat >= pk.real;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  RETURN got;
END $$;


--
-- Name: buy_tokens(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.buy_tokens(p_gold integer) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare me public.profiles; tp public.token_prices;
begin
  select * into tp from public.token_prices where gold = p_gold;
  if not found then raise exception 'not for sale'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if not found then raise exception 'not signed in'; end if;
  if me.gold < tp.gold then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - tp.gold, tokens = tokens + tp.tokens where id = me.id;
  return me.tokens + tp.tokens;
end $$;


--
-- Name: buy_vip(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.buy_vip(p_option text) RETURNS timestamp with time zone
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE uid uuid := auth.uid(); pk record; till timestamptz;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO pk FROM vip_packages WHERE id = p_option;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  UPDATE profiles SET dat = dat - pk.price,
    vip_until = greatest(coalesce(vip_until, now()), now()) + make_interval(days => pk.days)
  WHERE id = uid AND dat >= pk.price RETURNING vip_until INTO till;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  RETURN till;
END $$;


--
-- Name: change_table(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.change_table(p_room bigint DEFAULT NULL::bigint) RETURNS TABLE(room_id bigint, seat smallint)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
     order by random() limit 1 for update skip locked;
    if rid is null then insert into public.rooms default values returning id into rid; end if;
  end if;
  select g.s into s from generate_series(0,11) g(s)
   where g.s % 2 = parity and not exists (select 1 from public.room_players p where p.room_id = rid and p.seat = g.s)
   order by random() limit 1;
  if s is null then raise exception 'Masa dolu'; end if;
  delete from public.room_players where user_id = me.id;
  insert into public.room_players(room_id, seat, user_id) values (rid, s, me.id);
  update public.rooms set spinner = coalesce(spinner, s), phase_at = case when spinner is null then now() else phase_at end where id = rid;
  return query select rid, s;
end $$;


--
-- Name: claim_daily_bonus(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.claim_daily_bonus() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE uid uuid := auth.uid(); p record; today date := (now() AT TIME ZONE 'utc')::date; d integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT daily_bonus_day, daily_bonus_on INTO p FROM profiles WHERE id = uid FOR UPDATE;
  IF NOT FOUND OR p.daily_bonus_on = today THEN RETURN NULL; END IF;
  d := CASE WHEN p.daily_bonus_on = today - 1 THEN LEAST(p.daily_bonus_day + 1, 5) ELSE 1 END;
  UPDATE profiles SET daily_bonus_day = d, daily_bonus_on = today, gold = gold + d WHERE id = uid;
  RETURN jsonb_build_object('id', uid::text || ':' || today::text, 'day', d, 'gold_diff', d);
END $$;


--
-- Name: decide(boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decide(p_kiss boolean) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare rid bigint; s smallint; r public.rooms;
begin
  select room_id, seat into rid, s from public.room_players where user_id = auth.uid();
  select * into r from public.rooms where id = rid for update;
  if r.phase <> 'choose' or s not in (r.spinner, r.target) or r.decisions ? s::text then return; end if;
  update public.rooms set decisions = decisions || jsonb_build_object(s::text, case when p_kiss then 'kiss' else 'refuse' end) where id = rid;
  select * into r from public.rooms where id = rid;
  if r.decisions ? r.spinner::text and r.decisions ? r.target::text then perform public._finish_choice(rid); end if;
end $$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare uname text := lower(coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)));
begin
  insert into public.profiles (id, username, name, male, age)
  values (new.id, uname, coalesce(nullif(new.raw_user_meta_data->>'name',''), uname),
          coalesce((new.raw_user_meta_data->>'male')::boolean, true),
          nullif(new.raw_user_meta_data->>'age','')::int);
  return new;
end $$;


--
-- Name: heartbeat(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.heartbeat() RETURNS void
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  update public.room_players set last_seen = now() where user_id = auth.uid();
$$;


--
-- Name: join_room(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.join_room() RETURNS TABLE(room_id bigint, seat smallint)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare me public.profiles; rid bigint; s smallint; parity int;
begin
  select * into me from public.profiles where id = auth.uid();
  if not found then raise exception 'not signed in'; end if;
  select rp.room_id, rp.seat into rid, s from public.room_players rp where rp.user_id = me.id;
  if rid is not null then
    update public.room_players set last_seen = now() where user_id = me.id;
    return query select rid, s; return;
  end if;
  parity := case when me.male then 1 else 0 end;
  delete from public.room_players where last_seen < now() - interval '45 seconds';
  select r.id into rid from public.rooms r
   where (select count(*) from public.room_players p where p.room_id = r.id and p.seat % 2 = parity) < 6
   order by (select count(*) from public.room_players p where p.room_id = r.id) desc, r.id limit 1
   for update skip locked;
  if rid is null then insert into public.rooms default values returning id into rid; end if;
  select g.s into s from generate_series(0,11) g(s)
   where g.s % 2 = parity and not exists (select 1 from public.room_players p where p.room_id = rid and p.seat = g.s)
   order by random() limit 1;
  insert into public.room_players(room_id, seat, user_id) values (rid, s, me.id);
  update public.rooms set spinner = coalesce(spinner, s), phase_at = case when spinner is null then now() else phase_at end where id = rid;
  return query select rid, s;
end $$;


--
-- Name: leave_room(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.leave_room() RETURNS void
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  delete from public.room_players where user_id = auth.uid();
$$;


--
-- Name: list_tables(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.list_tables() RETURNS TABLE(room_id bigint, men integer, women integer, bottle text, is_current boolean)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  with cur as (select public.my_room() as id),
  cand as (
    select c.id as room_id, -1 as grp, now() as ord from cur c where c.id is not null
    union all
    select h.room_id, 0, h.visited_at from public.table_history h where h.user_id = auth.uid()
    union all
    select p.room_id, 1, max(p.joined_at) from public.room_players p group by p.room_id
  ),
  best as (select c.room_id, min(c.grp) grp, max(c.ord) ord from cand c group by c.room_id)
  select b.room_id,
    (select count(*)::int from public.room_players p where p.room_id = b.room_id and p.seat % 2 = 1),
    (select count(*)::int from public.room_players p where p.room_id = b.room_id and p.seat % 2 = 0),
    coalesce((select r.bottle from public.rooms r where r.id = b.room_id), 'standart'),
    b.grp = -1
  from best b order by b.grp, b.ord desc limit 20
$$;


--
-- Name: my_achievements(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.my_achievements() RETURNS TABLE(achievement_id text, level integer, acknowledged_at timestamp with time zone)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE uid uuid := auth.uid(); v record;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  FOR v IN
    SELECT 'celebrity' a, (SELECT kisses FROM profiles WHERE id = uid)::bigint n, ARRAY[20,80,250,750,1500] t
    UNION ALL SELECT 'heartofgold', (SELECT count(*) FROM gift_events WHERE sender_id = uid), ARRAY[25,1000,15000,125000,500000]
    UNION ALL SELECT 'courtesies', (SELECT count(*) FROM gift_events WHERE receiver_id = uid), ARRAY[50,2000,30000,250000,1000000]
    UNION ALL SELECT 'pantomime', (SELECT count(*) FROM gesture_events WHERE sender_id = uid), ARRAY[25,1000,15000,125000,500000]
    UNION ALL SELECT 'guru', (SELECT (now()::date - created_at::date) FROM profiles WHERE id = uid)::bigint, ARRAY[30,90,365]
  LOOP
    FOR i IN 1..array_length(v.t, 1) LOOP
      EXIT WHEN coalesce(v.n, 0) < v.t[i];
      achievement_id := v.a; level := i - 1;
      SELECT k.acknowledged_at INTO acknowledged_at FROM achievement_acks k WHERE k.user_id = uid AND k.achievement_id = v.a AND k.level = i - 1;
      RETURN NEXT;
    END LOOP;
  END LOOP;
END $$;


--
-- Name: my_room(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.my_room() RETURNS bigint
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select room_id from public.room_players where user_id = auth.uid()
$$;


--
-- Name: play_music(text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.play_music(p_service text, p_item jsonb) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare rid bigint; me public.profiles; pr int;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  pr := case p_service when 'cz' then 5 when 'yt' then 9 else null end;
  if pr is null then raise exception 'unknown service'; end if;
  if coalesce((p_item->>'duration')::numeric, 0) <= 0 or coalesce(p_item->>'song_id','') = '' then raise exception 'bad item'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if me.gold < pr then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - pr where id = me.id;
  update public.rooms set music = jsonb_build_object(
    'service', p_service,
    'item', jsonb_build_object('artist', left(coalesce(p_item->>'artist',''),200), 'title', left(coalesce(p_item->>'title',''),200),
       'duration', (p_item->>'duration')::numeric, 'song_id', left(p_item->>'song_id',100), 'provider', p_service,
       'url', left(coalesce(p_item->>'url',''),500), 'icon', left(coalesce(p_item->>'icon',''),500)),
    'sender', me.id, 'started_at', now(), 'key', (extract(epoch from clock_timestamp())*1000)::bigint)
   where id = rid;
  return me.gold - pr;
end $$;


--
-- Name: room_tick(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.room_tick(p_room bigint) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare r public.rooms; age double precision; nxt smallint;
begin
  delete from public.room_players where room_id = p_room and last_seen < now() - interval '20 seconds';
  select * into r from public.rooms where id = p_room for update;
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


--
-- Name: send_chat(text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.send_chat(p_text text, p_receiver uuid DEFAULT NULL::uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare rid bigint;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  insert into public.chat_messages(room_id, user_id, receiver_id, text) values (rid, auth.uid(), p_receiver, left(trim(p_text), 300));
end $$;


--
-- Name: send_gesture(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.send_gesture(p_gesture text) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare rid bigint; g public.gesture_prices; me public.profiles;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  select * into g from public.gesture_prices where gesture = p_gesture;
  if not found then raise exception 'unknown gesture'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if g.vip_only and (me.vip_until is null or me.vip_until < now()) then raise exception 'vip required'; end if;
  if me.kisses < g.kisses_required then raise exception 'kisses required'; end if;
  if me.tokens < g.price then raise exception 'insufficient tokens'; end if;
  update public.profiles set tokens = tokens - g.price where id = me.id;
  insert into public.gesture_events(room_id, sender_id, gesture) values (rid, me.id, p_gesture);
  return me.tokens - g.price;
end $$;


--
-- Name: send_gift(text, uuid[], integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.send_gift(p_gift text, p_receivers uuid[], p_seed integer DEFAULT 0) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
  return me.gold - total;
end $$;


--
-- Name: server_now(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.server_now() RETURNS timestamp with time zone
    LANGUAGE sql STABLE
    AS $$ select now() $$;


--
-- Name: set_decor(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_decor(p_frame text, p_stone text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare me public.profiles;
begin
  select * into me from public.profiles where id = auth.uid();
  if not found then raise exception 'not signed in'; end if;
  if coalesce(p_frame,'') <> '' and not (p_frame = any(me.owned_items)) then raise exception 'not owned'; end if;
  if coalesce(p_stone,'') <> '' and not (p_stone = any(me.owned_items)) then raise exception 'not owned'; end if;
  update public.profiles set frame = coalesce(p_frame,''), stone = coalesce(p_stone,'') where id = me.id;
end $$;


--
-- Name: spin_bottle(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.spin_bottle() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare rid bigint; s smallint; r public.rooms;
begin
  select room_id, seat into rid, s from public.room_players where user_id = auth.uid();
  if rid is null or not public._has_pair(rid) then return false; end if;
  select * into r from public.rooms where id = rid;
  if r.phase <> 'offer' or r.spinner <> s then return false; end if;
  return public._do_spin(rid);
end $$;


--
-- Name: top_players(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.top_players(p_section text, p_period text DEFAULT ''::text) RETURNS TABLE(id uuid, name text, photo_url text, male boolean, score bigint, rank bigint)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE since timestamptz := CASE p_period WHEN 'daily' THEN date_trunc('day', now()) WHEN 'weekly' THEN date_trunc('week', now()) WHEN 'monthly' THEN date_trunc('month', now()) ELSE NULL END;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF p_section = 'total_kisses' AND coalesce(p_period,'') = '' THEN
    RETURN QUERY WITH r AS (SELECT p.id, p.name, p.photo_url, p.male, p.kisses::bigint AS score,
      row_number() OVER (ORDER BY p.kisses DESC, p.id) AS rank FROM profiles p)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSIF p_section = 'gestures' THEN
    RETURN QUERY WITH c AS (SELECT sender_id, count(*)::bigint n FROM gesture_events WHERE since IS NULL OR created_at >= since GROUP BY sender_id),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.sender_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSE
    RAISE EXCEPTION 'unsupported';
  END IF;
END $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievement_acks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievement_acks (
    user_id uuid NOT NULL,
    achievement_id text NOT NULL,
    level integer NOT NULL,
    acknowledged_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bottle_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bottle_prices (
    bottle text NOT NULL,
    price integer NOT NULL,
    vip_only boolean DEFAULT false NOT NULL
);


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id bigint NOT NULL,
    room_id bigint NOT NULL,
    user_id uuid NOT NULL,
    receiver_id uuid,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chat_messages_text_check CHECK (((char_length(text) >= 1) AND (char_length(text) <= 300)))
);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.chat_messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.chat_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: decor_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.decor_prices (
    item text NOT NULL,
    price integer NOT NULL,
    CONSTRAINT decor_prices_price_check CHECK ((price > 0))
);


--
-- Name: gesture_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gesture_events (
    id bigint NOT NULL,
    room_id bigint NOT NULL,
    sender_id uuid NOT NULL,
    gesture text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: gesture_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.gesture_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.gesture_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: gesture_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gesture_prices (
    gesture text NOT NULL,
    price integer NOT NULL,
    kisses_required integer DEFAULT 0 NOT NULL,
    vip_only boolean DEFAULT false NOT NULL
);


--
-- Name: gift_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gift_events (
    id bigint NOT NULL,
    room_id bigint NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    gift_type text NOT NULL,
    seed integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: gift_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.gift_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.gift_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: gift_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gift_prices (
    gift_type text NOT NULL,
    price integer NOT NULL,
    kisses_required integer DEFAULT 0 NOT NULL,
    vip_only boolean DEFAULT false NOT NULL,
    CONSTRAINT gift_prices_price_check CHECK ((price >= 0))
);


--
-- Name: gold_packages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gold_packages (
    "real" integer NOT NULL,
    gold integer NOT NULL,
    bonus integer DEFAULT 0 NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    player_no bigint NOT NULL,
    username text NOT NULL,
    name text NOT NULL,
    male boolean DEFAULT true NOT NULL,
    age integer,
    city text,
    photo_url text,
    frame text DEFAULT ''::text NOT NULL,
    stone text DEFAULT ''::text NOT NULL,
    kisses integer DEFAULT 0 NOT NULL,
    gold integer DEFAULT 10000 NOT NULL,
    vip_until timestamp with time zone,
    welcome_gold boolean DEFAULT true NOT NULL,
    owned_items text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    tokens integer DEFAULT 50 NOT NULL,
    daily_bonus_day integer DEFAULT 0 NOT NULL,
    daily_bonus_on date,
    dat integer DEFAULT 10000 NOT NULL,
    CONSTRAINT profiles_age_check CHECK (((age >= 14) AND (age <= 99)))
);


--
-- Name: profiles_player_no_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.profiles ALTER COLUMN player_no ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profiles_player_no_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: room_players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room_players (
    room_id bigint NOT NULL,
    seat smallint NOT NULL,
    user_id uuid NOT NULL,
    last_seen timestamp with time zone DEFAULT now() NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT room_players_seat_check CHECK (((seat >= 0) AND (seat <= 11)))
);

ALTER TABLE ONLY public.room_players REPLICA IDENTITY FULL;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id bigint NOT NULL,
    phase text DEFAULT 'offer'::text NOT NULL,
    spinner smallint,
    target smallint,
    decisions jsonb DEFAULT '{}'::jsonb NOT NULL,
    round integer DEFAULT 0 NOT NULL,
    phase_at timestamp with time zone DEFAULT now() NOT NULL,
    music jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    bottle text DEFAULT 'standart'::text NOT NULL,
    CONSTRAINT rooms_phase_check CHECK ((phase = ANY (ARRAY['offer'::text, 'spin'::text, 'choose'::text, 'result'::text, 'return'::text])))
);


--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.rooms ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: table_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.table_history (
    user_id uuid NOT NULL,
    room_id bigint NOT NULL,
    visited_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: token_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_prices (
    gold integer NOT NULL,
    tokens integer NOT NULL
);


--
-- Name: vip_packages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vip_packages (
    id text NOT NULL,
    price integer NOT NULL,
    days integer NOT NULL
);


--
-- Data for Name: achievement_acks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievement_acks (user_id, achievement_id, level, acknowledged_at) FROM stdin;
50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	celebrity	0	2026-10-14 22:57:18.316709+00
\.


--
-- Data for Name: bottle_prices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bottle_prices (bottle, price, vip_only) FROM stdin;
autumn	5	f
baby	5	f
champagnebot	5	f
cognac	5	f
cola	5	f
jackdaniels	5	f
ketchup	5	f
lemonade	5	f
martinibot	5	f
milkbot	5	f
nybottle	3	f
pirate	5	f
ship	5	f
skeleton	5	f
skewer	5	f
spring	5	f
sprite	5	f
standart	5	f
summer	5	f
vipbottle	5	t
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_messages (id, room_id, user_id, receiver_id, text, created_at) FROM stdin;
1	1	7013a180-9bf9-4664-975a-3fd505ca4631	\N	selam	2026-10-14 17:24:03.268478+00
2	1	e53f257b-8f57-45f1-9df7-9961af45de26	\N	Herkese merhabalar!	2026-10-14 17:32:06.694577+00
3	1	e53f257b-8f57-45f1-9df7-9961af45de26	\N	salam	2026-10-14 17:32:13.333274+00
4	1	70313b59-2732-42e2-9773-6d263cbcc7d1	\N	J	2026-10-14 17:41:38.442148+00
5	1	e53f257b-8f57-45f1-9df7-9961af45de26	\N	k	2026-10-14 17:41:44.376046+00
6	1	70313b59-2732-42e2-9773-6d263cbcc7d1	\N	M	2026-10-14 17:43:02.643367+00
7	1	70313b59-2732-42e2-9773-6d263cbcc7d1	\N	N	2026-10-14 17:44:15.269067+00
8	1	4783e631-5b51-4740-ae0b-5eaba7668635	\N	Herkese merhabalar!	2026-10-14 17:50:53.084753+00
9	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	sensen	2026-10-14 21:27:25.156979+00
10	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	\N	Herkese merhabalar!Həə	2026-10-14 21:27:35.442496+00
11	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	he cix dala qayt tezden gir gorm neter isdyr	2026-10-14 21:27:50.850645+00
12	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	\N	Putulka fırlanmır	2026-10-14 21:27:55.384258+00
13	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	o yigilajax hele	2026-10-14 21:28:02.247346+00
14	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	gorsenrem burda?	2026-10-14 21:28:11.260615+00
15	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	donmurku?	2026-10-14 21:28:28.37549+00
16	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	\N	Yenə donur hədiyyələr	2026-10-14 21:28:46.206169+00
17	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	sebrli ol duzelejey	2026-10-14 21:29:02.020281+00
18	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	mahni qos gorm	2026-10-14 21:29:05.745194+00
19	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	butulka deyisdi?	2026-10-14 21:29:22.23901+00
20	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	sebrli ol yigiram hele	2026-10-14 21:30:16.870846+00
21	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	b	2026-10-14 21:41:15.676618+00
22	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	h	2026-10-14 21:42:38.05255+00
23	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	o	2026-10-14 21:42:53.986742+00
24	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	j	2026-10-14 22:17:53.62225+00
25	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	h	2026-10-14 22:27:57.507677+00
26	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	ghh	2026-10-14 22:37:26.384162+00
27	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	h	2026-10-14 23:02:29.984096+00
28	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	salam	2026-10-14 23:06:39.607782+00
29	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	\N	necesen	2026-10-14 23:06:43.543739+00
\.


--
-- Data for Name: decor_prices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.decor_prices (item, price) FROM stdin;
turbodecor	500
tourismdecor	500
heartsdecor	500
kissesdecor	500
theatredecor	500
cinemadecor	500
eastdecor	500
westdecor	500
lovedecor	500
hatreddecor	500
chipsdecor	500
cardsdecor	500
nightdecor	500
daydecor	500
discodecor	500
rockdecor	500
fruitjellydecor	500
carameldecor	500
naturedecor	500
stonedecor	500
violetdecor	500
greendecor	500
egyptdecor	500
romedecor	500
venusdecor	500
marsdecor	500
icedecor	500
lavadecor	500
angel	500
demon	500
\.


--
-- Data for Name: gesture_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gesture_events (id, room_id, sender_id, gesture, created_at) FROM stdin;
1	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:37:57.815542+00
2	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:37:58.681921+00
3	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:37:59.083602+00
4	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:37:59.399121+00
5	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:37:59.629269+00
6	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:01.867592+00
7	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:02.372287+00
8	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:02.863688+00
9	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:03.285513+00
10	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:03.694182+00
11	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:04.070442+00
12	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:04.468064+00
13	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:04.836723+00
14	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:05.23959+00
15	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:05.623004+00
16	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:05.948171+00
17	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:06.300904+00
18	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:06.694099+00
19	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:07.081055+00
20	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:07.45811+00
21	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:07.853571+00
22	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:08.230304+00
23	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:08.59679+00
24	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:08.946606+00
25	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:09.318522+00
26	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:09.910966+00
27	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:11.276093+00
28	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:11.670508+00
29	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:12.0475+00
30	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:12.905222+00
31	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:13.317195+00
32	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:13.669484+00
33	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:14.035404+00
34	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:14.421159+00
35	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:14.819294+00
36	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:15.16617+00
37	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:15.567608+00
38	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:15.94738+00
39	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:16.314129+00
40	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:16.662642+00
41	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:17.069683+00
42	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:17.42485+00
43	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:20.218915+00
44	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:20.597502+00
45	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:20.950785+00
46	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:21.289863+00
47	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:21.673552+00
48	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:22.037138+00
49	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:23.259451+00
50	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:38:23.896969+00
51	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:59:37.349619+00
52	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:59:37.894433+00
53	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 22:59:39.123246+00
54	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	nohearts	2026-10-14 23:01:51.706454+00
\.


--
-- Data for Name: gesture_prices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gesture_prices (gesture, price, kisses_required, vip_only) FROM stdin;
agree	1	175	f
airkissges	3	0	f
angelges	3	20100	f
anger	1	1700	f
applause	1	28100	f
artistges	3	0	f
bandit	2	31100	f
barmanges	2	0	f
bayanistges	2	17700	f
beback	1	6900	f
beerges	3	0	f
binocularsges	2	0	f
bla	2	14100	f
bouqetges	3	0	f
bragging	2	90300	f
braggingvip	1	0	t
bunchofmoney	10	226300	f
bye	1	50	f
camouflageges	3	0	f
cannotspeak	2	16500	f
chocolateges	2	0	f
contempt	1	11700	f
cool	3	15300	f
crackerges	3	0	f
crazy	1	0	f
cry	1	385	f
dance	2	8100	f
defenderges	3	0	f
devil	3	21500	f
dikaprio	1	0	t
disagree	1	225	f
disco	3	0	f
dj	2	34500	f
dragonges	3	0	f
driving	2	148300	f
drunk	2	0	f
elvisges	2	0	f
explode	3	65100	f
facepalm	3	42500	f
famousges	3	0	f
fearful	2	81100	f
fk	5	209100	f
gentleman	2	135100	f
gratitude	1	2400	f
grinning	1	1100	f
grunt	1	18900	f
guitaristges	2	0	f
handround	2	10500	f
happy	1	70	f
heartface	3	52300	f
heartges	2	0	f
hello	1	30	f
jediges	3	0	f
jewelerges	3	0	f
jugglerges	3	0	f
kiss	3	3300	f
laugh	1	280	f
little	1	650	f
lookthroughges	2	0	f
loveges	2	25500	f
michael	3	0	f
mimistges	3	0	f
monkey	3	192700	f
muerteges	3	0	f
music	2	47100	f
nohearts	1	10	f
nurseges	3	0	f
ok	1	500	f
orangutanges	1	0	f
parrot	3	162300	f
party	2	38300	f
rap	3	0	f
rich	5	72700	f
rock	2	23300	f
sad	1	125	f
scream	2	111100	f
selfie	1	0	t
shy	1	800	f
sleepges	2	0	f
smoking	2	177100	f
snowballges	2	0	f
sparklerges	3	0	f
star	2	100300	f
stereoglassesges	2	0	f
strictges	2	0	f
sun	3	0	f
thumbdown	1	5700	f
thumbup	1	4500	f
tongue	1	1400	f
vomiting	3	12900	f
wall	2	122700	f
watermelonges	2	0	f
wink	1	9300	f
yawn	2	58300	f
\.


--
-- Data for Name: gift_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gift_events (id, room_id, sender_id, receiver_id, gift_type, seed, created_at) FROM stdin;
1	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	185716	2026-10-14 17:41:18.73973+00
2	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	122792	2026-10-14 17:41:21.378603+00
3	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	164564	2026-10-14 17:41:21.568609+00
4	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	129846	2026-10-14 17:41:23.243514+00
5	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	174380	2026-10-14 17:41:24.998819+00
6	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	195529	2026-10-14 17:41:25.470682+00
7	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	136282	2026-10-14 17:41:25.873977+00
8	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	78107	2026-10-14 17:41:26.279578+00
9	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	38088	2026-10-14 17:41:26.641297+00
10	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	176709	2026-10-14 17:41:27.031624+00
11	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	86909	2026-10-14 17:41:27.453115+00
12	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	105800	2026-10-14 17:43:36.24062+00
13	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	107272	2026-10-14 17:43:36.622457+00
14	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	227970	2026-10-14 17:43:36.975579+00
15	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	176851	2026-10-14 17:43:37.761187+00
16	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	222929	2026-10-14 17:43:37.951571+00
17	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	154241	2026-10-14 17:43:38.669817+00
18	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	168550	2026-10-14 17:43:38.986394+00
19	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	18353	2026-10-14 17:43:39.302916+00
20	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	223831	2026-10-14 17:43:39.618187+00
21	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	32078	2026-10-14 17:43:40.015973+00
22	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	8895	2026-10-14 17:43:40.451467+00
23	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	111508	2026-10-14 17:43:40.880385+00
24	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	95555	2026-10-14 17:43:41.145256+00
25	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	crown3	60625	2026-10-14 17:43:42.116122+00
26	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	crown3	67351	2026-10-14 17:43:48.194117+00
27	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	87529	2026-10-14 17:43:57.619065+00
28	1	e53f257b-8f57-45f1-9df7-9961af45de26	70313b59-2732-42e2-9773-6d263cbcc7d1	air_kiss	3782	2026-10-14 17:43:58.183947+00
29	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	141765	2026-10-14 21:28:14.010193+00
30	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	89890	2026-10-14 21:28:14.111447+00
31	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	105726	2026-10-14 21:28:14.618646+00
32	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	60697	2026-10-14 21:28:14.652236+00
33	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	170761	2026-10-14 21:28:14.771971+00
34	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	171447	2026-10-14 21:28:14.905075+00
35	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	208028	2026-10-14 21:28:15.037254+00
36	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	123724	2026-10-14 21:28:15.128329+00
37	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	206439	2026-10-14 21:28:15.261543+00
38	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	132848	2026-10-14 21:28:15.374447+00
39	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	128645	2026-10-14 21:28:15.518598+00
40	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	28739	2026-10-14 21:28:15.646692+00
41	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	106577	2026-10-14 21:28:15.77109+00
42	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	160713	2026-10-14 21:28:15.900163+00
43	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	22792	2026-10-14 21:28:15.995727+00
44	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	174034	2026-10-14 21:28:16.124414+00
45	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	41910	2026-10-14 21:28:16.245603+00
46	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	85541	2026-10-14 21:28:16.368915+00
47	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	232626	2026-10-14 21:28:16.390542+00
48	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	3168	2026-10-14 21:28:16.491896+00
49	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	122267	2026-10-14 21:28:16.537003+00
50	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	61680	2026-10-14 21:28:17.646579+00
51	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	70831	2026-10-14 21:28:17.831727+00
52	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	212488	2026-10-14 21:28:17.902695+00
53	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	144500	2026-10-14 21:28:18.067498+00
54	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	80691	2026-10-14 21:28:19.487046+00
55	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	31641	2026-10-14 21:28:19.765563+00
56	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	tomato	36672	2026-10-14 21:28:20.882231+00
57	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	tomato	74233	2026-10-14 21:28:21.039222+00
58	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	179813	2026-10-14 21:28:21.445737+00
59	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	50428	2026-10-14 21:28:21.553141+00
60	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	140519	2026-10-14 21:28:21.686877+00
61	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	178202	2026-10-14 21:28:21.814944+00
62	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	125329	2026-10-14 21:28:21.924142+00
63	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	20553	2026-10-14 21:28:22.055905+00
64	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	24096	2026-10-14 21:28:22.173784+00
65	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	157806	2026-10-14 21:28:22.300611+00
66	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	112135	2026-10-14 21:28:22.428165+00
67	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	196733	2026-10-14 21:28:22.542137+00
68	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	193112	2026-10-14 21:28:22.6666+00
69	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	137576	2026-10-14 21:28:22.793504+00
70	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	72858	2026-10-14 21:28:22.943292+00
71	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	107894	2026-10-14 21:28:23.041069+00
72	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	229640	2026-10-14 21:28:23.169763+00
73	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	194022	2026-10-14 21:28:23.304347+00
74	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	129806	2026-10-14 21:28:23.416603+00
75	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	124667	2026-10-14 21:28:23.549184+00
76	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	166547	2026-10-14 21:28:23.670553+00
77	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	163203	2026-10-14 21:28:23.813241+00
78	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	tomato	196288	2026-10-14 21:28:24.15281+00
79	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	tomato	149642	2026-10-14 21:28:24.343562+00
80	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	98057	2026-10-14 21:28:40.908391+00
81	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	88229	2026-10-14 21:28:41.070596+00
82	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	21209	2026-10-14 21:28:41.781719+00
84	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	36318	2026-10-14 21:28:42.696786+00
86	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	53189	2026-10-14 21:28:42.921854+00
88	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	cactus	62081	2026-10-14 21:28:44.481807+00
90	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	cactus	48646	2026-10-14 21:28:44.721938+00
92	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	156160	2026-10-14 21:28:45.960764+00
94	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	8117	2026-10-14 21:28:46.190999+00
95	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	26060	2026-10-14 21:28:46.30332+00
97	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	133500	2026-10-14 21:28:46.544255+00
99	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	196873	2026-10-14 21:28:46.780335+00
83	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	132828	2026-10-14 21:28:42.564098+00
85	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	76149	2026-10-14 21:28:42.803473+00
87	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	156028	2026-10-14 21:28:43.601428+00
89	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	cactus	170318	2026-10-14 21:28:44.602633+00
91	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	cactus	191960	2026-10-14 21:28:44.841932+00
93	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	10634	2026-10-14 21:28:46.057079+00
96	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	98161	2026-10-14 21:28:46.409538+00
98	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	54490	2026-10-14 21:28:46.675655+00
100	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	157304	2026-10-14 21:33:58.385834+00
101	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	168768	2026-10-14 21:33:58.507235+00
102	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	228136	2026-10-14 21:33:58.630339+00
103	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	188912	2026-10-14 21:33:58.740929+00
104	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	39679	2026-10-14 21:33:58.907576+00
105	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	27592	2026-10-14 21:33:59.020908+00
106	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	36829	2026-10-14 21:33:59.148585+00
107	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	212114	2026-10-14 21:33:59.269783+00
108	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	144123	2026-10-14 21:34:00.975662+00
109	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	208298	2026-10-14 21:34:01.152536+00
110	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	129738	2026-10-14 21:34:02.266828+00
111	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	154588	2026-10-14 21:34:02.383044+00
112	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	176852	2026-10-14 21:34:02.511389+00
113	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	41094	2026-10-14 21:34:02.628551+00
114	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	138067	2026-10-14 21:34:02.748856+00
115	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	126639	2026-10-14 21:34:02.94509+00
116	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	171041	2026-10-14 21:34:02.998139+00
117	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	88071	2026-10-14 21:34:03.118806+00
118	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	135733	2026-10-14 21:34:03.264058+00
119	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	137811	2026-10-14 21:34:03.368037+00
120	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	200777	2026-10-14 21:34:03.495643+00
121	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	101120	2026-10-14 21:34:03.637364+00
122	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	189564	2026-10-14 21:34:03.739752+00
123	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	202215	2026-10-14 21:34:07.52715+00
124	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	200821	2026-10-14 21:34:07.653322+00
125	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	187461	2026-10-14 21:34:07.770323+00
126	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	52274	2026-10-14 21:34:07.894323+00
127	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	220637	2026-10-14 21:34:08.013525+00
128	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	15084	2026-10-14 21:34:08.140495+00
129	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	161929	2026-10-14 21:34:08.28125+00
130	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	214454	2026-10-14 21:34:08.381714+00
131	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	21003	2026-10-14 21:34:08.507436+00
132	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	68805	2026-10-14 21:34:08.631827+00
133	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	139938	2026-10-14 21:34:08.751932+00
134	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	117399	2026-10-14 21:34:08.884197+00
135	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	29713	2026-10-14 21:34:09.007527+00
136	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	175575	2026-10-14 21:34:09.13656+00
137	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	150908	2026-10-14 21:34:09.266007+00
138	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	136631	2026-10-14 21:34:09.378926+00
139	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	179396	2026-10-14 21:34:09.502503+00
140	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	183309	2026-10-14 21:34:09.621436+00
141	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	60455	2026-10-14 21:34:09.880903+00
142	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	206137	2026-10-14 21:34:09.928838+00
143	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	102430	2026-10-14 21:34:09.999426+00
144	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	54550	2026-10-14 21:34:10.120985+00
145	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	173454	2026-10-14 21:34:10.246814+00
146	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	202045	2026-10-14 21:34:10.365319+00
147	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	231792	2026-10-14 21:34:10.509322+00
148	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	whiskey	61063	2026-10-14 21:34:10.626683+00
149	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	133738	2026-10-14 21:34:32.46547+00
150	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	21004	2026-10-14 21:34:56.377102+00
151	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	147874	2026-10-14 21:34:57.920101+00
152	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	36835	2026-10-14 21:34:58.052057+00
153	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	126857	2026-10-14 21:34:58.213122+00
154	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	230981	2026-10-14 21:34:58.284884+00
155	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	74172	2026-10-14 21:34:58.400467+00
156	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	227763	2026-10-14 21:34:58.523178+00
157	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	66599	2026-10-14 21:34:58.658525+00
158	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	64461	2026-10-14 21:34:58.784769+00
159	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	124195	2026-10-14 21:34:59.473694+00
160	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear7	95424	2026-10-14 21:35:00.483744+00
161	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear7	109569	2026-10-14 21:35:00.605199+00
162	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear7	9662	2026-10-14 21:35:00.743436+00
163	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear7	190877	2026-10-14 21:35:00.862855+00
164	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear7	66377	2026-10-14 21:35:00.964275+00
165	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear7	172983	2026-10-14 21:35:01.087776+00
166	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear1	69555	2026-10-14 21:35:02.061273+00
167	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear1	144600	2026-10-14 21:35:02.170283+00
168	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear1	63073	2026-10-14 21:35:02.282643+00
169	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear1	48103	2026-10-14 21:35:02.417979+00
170	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear1	83920	2026-10-14 21:35:02.525916+00
171	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	icecream	211449	2026-10-14 21:35:04.267309+00
172	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	icecream	76054	2026-10-14 21:35:04.374055+00
173	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	icecream	186014	2026-10-14 21:35:04.516993+00
175	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	icecream	201116	2026-10-14 21:35:04.777696+00
177	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	icecream	150039	2026-10-14 21:35:04.993311+00
174	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	icecream	219138	2026-10-14 21:35:04.624749+00
176	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	icecream	118255	2026-10-14 21:35:04.869709+00
178	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	200076	2026-10-14 21:35:38.253365+00
179	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	201367	2026-10-14 21:35:38.880432+00
180	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	59804	2026-10-14 21:35:39.00028+00
181	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	149969	2026-10-14 21:35:39.111089+00
182	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	137804	2026-10-14 21:35:39.23451+00
183	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	45850	2026-10-14 21:35:39.365724+00
184	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	156149	2026-10-14 21:37:10.470845+00
185	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	172437	2026-10-14 21:37:10.510178+00
186	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	65328	2026-10-14 21:37:10.61329+00
187	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	26051	2026-10-14 21:37:10.726237+00
188	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	55137	2026-10-14 21:37:10.883111+00
189	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	47340	2026-10-14 21:37:10.994745+00
190	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	201667	2026-10-14 21:37:11.212937+00
191	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	23612	2026-10-14 21:37:11.325402+00
192	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	12030	2026-10-14 21:37:11.445521+00
193	1	1f25ba4c-8cea-49b8-8e86-5d14cef9511e	88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	crown2	141165	2026-10-14 21:37:11.606102+00
194	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	192856	2026-10-14 21:41:10.094103+00
195	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	183602	2026-10-14 21:41:26.523701+00
196	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	199649	2026-10-14 21:41:35.811978+00
197	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	47324	2026-10-14 21:41:36.266336+00
198	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	75796	2026-10-14 21:41:36.38628+00
199	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	2252	2026-10-14 21:41:36.5114+00
200	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	45668	2026-10-14 21:41:36.629964+00
201	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	120293	2026-10-14 21:41:36.750496+00
202	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	48568	2026-10-14 21:41:36.862231+00
203	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	63844	2026-10-14 21:41:36.999696+00
204	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	188258	2026-10-14 21:41:37.159392+00
205	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	49696	2026-10-14 21:41:37.302646+00
206	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	97021	2026-10-14 21:41:37.442005+00
207	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	229343	2026-10-14 21:41:37.591634+00
208	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	43409	2026-10-14 21:41:37.792873+00
209	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	146438	2026-10-14 21:41:37.92474+00
210	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	83408	2026-10-14 21:41:38.040401+00
211	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	175857	2026-10-14 21:41:38.203149+00
212	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	225765	2026-10-14 21:41:38.34663+00
213	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	116266	2026-10-14 21:41:38.500175+00
214	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	85183	2026-10-14 21:41:38.656945+00
215	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	174495	2026-10-14 21:41:38.793194+00
216	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	38820	2026-10-14 21:41:38.970069+00
217	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	137623	2026-10-14 21:41:39.088444+00
218	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	185842	2026-10-14 21:41:39.240245+00
219	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	119977	2026-10-14 21:41:39.389595+00
220	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	87124	2026-10-14 21:41:39.544724+00
221	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	100194	2026-10-14 21:41:39.690242+00
222	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	38961	2026-10-14 21:41:39.843253+00
223	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	189108	2026-10-14 21:41:39.988331+00
224	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	50998	2026-10-14 21:41:40.141588+00
225	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	112609	2026-10-14 21:41:40.29046+00
226	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	88199	2026-10-14 21:41:40.441178+00
227	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	77823	2026-10-14 21:41:40.602848+00
228	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	37775	2026-10-14 21:41:40.740256+00
229	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	11625	2026-10-14 21:41:40.97868+00
230	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	110300	2026-10-14 21:41:41.719629+00
231	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	151835	2026-10-14 21:41:41.842098+00
232	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	162039	2026-10-14 21:41:41.969422+00
233	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	232542	2026-10-14 21:41:42.102934+00
234	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	96919	2026-10-14 21:41:42.219037+00
235	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	83536	2026-10-14 21:41:42.487437+00
236	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	79359	2026-10-14 21:41:42.616221+00
237	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	203786	2026-10-14 21:41:42.64201+00
238	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	119162	2026-10-14 21:41:42.778932+00
239	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	118739	2026-10-14 21:41:43.148419+00
240	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	184263	2026-10-14 21:41:43.150925+00
241	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	33933	2026-10-14 21:41:43.253344+00
242	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	113843	2026-10-14 21:41:43.397197+00
243	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	180798	2026-10-14 21:41:43.54153+00
244	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	177441	2026-10-14 21:41:43.680016+00
245	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	124513	2026-10-14 21:41:43.834359+00
246	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	92724	2026-10-14 21:41:43.99366+00
247	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	72148	2026-10-14 21:41:44.162391+00
248	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	207193	2026-10-14 21:41:44.278944+00
249	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	137928	2026-10-14 21:41:44.433955+00
250	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	63922	2026-10-14 21:41:44.583553+00
251	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	116962	2026-10-14 21:41:44.733798+00
252	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown4	121276	2026-10-14 21:41:44.891972+00
253	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	37071	2026-10-14 21:42:32.145683+00
254	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	139686	2026-10-14 21:42:32.293186+00
255	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	157782	2026-10-14 21:42:32.359448+00
256	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	19686	2026-10-14 21:42:32.4418+00
257	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	41789	2026-10-14 21:42:32.544655+00
260	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	179958	2026-10-14 21:42:32.906005+00
263	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	133132	2026-10-14 21:42:33.275844+00
266	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	107406	2026-10-14 21:42:33.648153+00
258	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	154317	2026-10-14 21:42:32.65507+00
261	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	179976	2026-10-14 21:42:33.031956+00
264	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	9810	2026-10-14 21:42:33.408904+00
259	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	142759	2026-10-14 21:42:32.781552+00
262	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	231383	2026-10-14 21:42:33.147866+00
265	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	148739	2026-10-14 21:42:33.523755+00
267	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	55818	2026-10-14 21:45:22.783235+00
268	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	166400	2026-10-14 21:45:22.829446+00
269	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	132494	2026-10-14 21:45:22.968383+00
270	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	207724	2026-10-14 21:45:23.067436+00
271	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	164295	2026-10-14 21:45:23.187564+00
272	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	40775	2026-10-14 21:52:47.04993+00
273	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	196030	2026-10-14 21:52:47.180416+00
274	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	175527	2026-10-14 21:52:47.197087+00
275	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	17521	2026-10-14 21:52:47.305272+00
276	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	49793	2026-10-14 21:52:47.426081+00
277	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	119496	2026-10-14 21:52:47.546174+00
278	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	116737	2026-10-14 21:52:47.673475+00
279	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	230562	2026-10-14 21:52:47.781871+00
280	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	158030	2026-10-14 21:52:47.920495+00
281	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	223301	2026-10-14 21:52:48.028348+00
282	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	76192	2026-10-14 21:52:48.166481+00
283	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	101461	2026-10-14 21:52:49.820537+00
284	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	159893	2026-10-14 21:52:49.956797+00
285	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	100298	2026-10-14 21:52:50.071278+00
286	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	90975	2026-10-14 21:52:50.184739+00
287	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	132331	2026-10-14 21:52:50.311923+00
288	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	23278	2026-10-14 21:52:50.424358+00
289	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	90193	2026-10-14 21:52:50.551472+00
290	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	36737	2026-10-14 21:52:50.674093+00
291	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	224917	2026-10-14 21:52:50.809412+00
292	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	101074	2026-10-14 21:52:50.921485+00
293	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	70716	2026-10-14 21:52:51.061583+00
294	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	62238	2026-10-14 21:52:51.167397+00
295	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	60257	2026-10-14 21:52:52.102286+00
296	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	149851	2026-10-14 21:52:52.223578+00
297	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	122791	2026-10-14 21:52:52.343158+00
298	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	212910	2026-10-14 21:52:52.464435+00
299	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	79712	2026-10-14 21:52:52.591927+00
300	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	70812	2026-10-14 21:52:52.711994+00
301	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	42408	2026-10-14 21:52:52.833238+00
302	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	202469	2026-10-14 21:52:53.281742+00
303	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	92205	2026-10-14 21:52:53.403319+00
304	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	171269	2026-10-14 21:52:53.52702+00
305	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	215782	2026-10-14 21:52:53.654134+00
306	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	69748	2026-10-14 21:52:53.770096+00
307	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	120907	2026-10-14 21:52:53.895186+00
308	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	165579	2026-10-14 21:52:54.421369+00
309	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	65197	2026-10-14 21:52:54.535101+00
310	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	105436	2026-10-14 21:52:54.675603+00
311	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	181651	2026-10-14 21:52:54.782841+00
312	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	102231	2026-10-14 21:52:54.899598+00
313	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	84568	2026-10-14 21:52:55.021237+00
314	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	strawberry	129724	2026-10-14 21:52:55.637661+00
315	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	strawberry	134958	2026-10-14 21:52:55.750112+00
316	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	strawberry	208761	2026-10-14 21:52:55.868811+00
317	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	strawberry	198355	2026-10-14 21:52:55.987822+00
318	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	strawberry	196942	2026-10-14 21:52:56.11841+00
319	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	4793	2026-10-14 21:52:56.805947+00
320	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	184382	2026-10-14 21:52:56.921496+00
321	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	182560	2026-10-14 21:52:57.034757+00
322	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	flower	73492	2026-10-14 21:52:57.166372+00
323	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	35296	2026-10-14 21:52:59.028259+00
324	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	101847	2026-10-14 21:52:59.194415+00
325	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	36310	2026-10-14 21:53:00.896639+00
326	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	53837	2026-10-14 21:53:01.028289+00
327	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	33103	2026-10-14 21:53:09.280047+00
328	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	158479	2026-10-14 21:53:17.622484+00
329	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	99260	2026-10-14 21:53:17.738692+00
330	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	227697	2026-10-14 21:53:17.851676+00
331	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	139982	2026-10-14 21:53:17.982364+00
332	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	130563	2026-10-14 21:53:18.109859+00
333	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	170549	2026-10-14 21:53:18.210862+00
334	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	107026	2026-10-14 21:53:18.372199+00
335	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	60215	2026-10-14 21:53:18.506553+00
336	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	78556	2026-10-14 21:53:18.668568+00
337	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	211587	2026-10-14 21:53:18.812118+00
338	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	81614	2026-10-14 21:53:18.959407+00
339	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	184033	2026-10-14 21:53:19.121303+00
340	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	33317	2026-10-14 21:53:19.264767+00
341	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	78998	2026-10-14 21:53:19.440258+00
342	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	50446	2026-10-14 21:53:19.562498+00
343	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	22593	2026-10-14 21:53:19.710184+00
344	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	131303	2026-10-14 21:53:19.868248+00
345	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	170187	2026-10-14 21:53:20.023336+00
348	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	146074	2026-10-14 21:53:30.864338+00
351	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	19047	2026-10-14 21:53:31.221292+00
354	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	167844	2026-10-14 21:53:31.590922+00
357	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	168503	2026-10-14 21:53:40.71854+00
360	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	153752	2026-10-14 21:53:41.071406+00
363	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	159513	2026-10-14 21:53:41.538956+00
366	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	57703	2026-10-14 21:53:41.967974+00
369	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	229381	2026-10-14 21:53:53.005542+00
372	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	161929	2026-10-14 21:53:53.394308+00
375	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	122015	2026-10-14 21:53:53.728138+00
378	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	101698	2026-10-14 21:53:54.121924+00
381	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	2469	2026-10-14 21:53:54.487018+00
346	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	190819	2026-10-14 21:53:20.1634+00
349	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	55397	2026-10-14 21:53:30.980259+00
352	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	21872	2026-10-14 21:53:31.34185+00
355	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	244	2026-10-14 21:53:40.599134+00
358	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	198097	2026-10-14 21:53:40.841516+00
361	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	47224	2026-10-14 21:53:41.231929+00
364	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	203301	2026-10-14 21:53:41.681+00
367	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	34805	2026-10-14 21:53:42.120119+00
370	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	152650	2026-10-14 21:53:53.127289+00
373	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	91950	2026-10-14 21:53:53.490116+00
376	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	188558	2026-10-14 21:53:53.855013+00
379	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	151002	2026-10-14 21:53:54.228713+00
382	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	69002	2026-10-14 21:53:54.611544+00
347	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	90733	2026-10-14 21:53:20.308523+00
350	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	227189	2026-10-14 21:53:31.099749+00
353	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown3	26119	2026-10-14 21:53:31.460861+00
356	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	132622	2026-10-14 21:53:40.699148+00
359	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	100332	2026-10-14 21:53:40.969866+00
362	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	66437	2026-10-14 21:53:41.366846+00
365	1	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	125547	2026-10-14 21:53:41.830996+00
368	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	164984	2026-10-14 21:53:52.886285+00
371	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	72434	2026-10-14 21:53:53.250188+00
374	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	55495	2026-10-14 21:53:53.619584+00
377	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	43424	2026-10-14 21:53:53.988222+00
380	1	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	tomato	185997	2026-10-14 21:53:54.353795+00
383	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	57690	2026-10-14 22:19:12.870297+00
384	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	45784	2026-10-14 22:19:12.964192+00
385	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	179632	2026-10-14 22:19:13.084003+00
386	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	41521	2026-10-14 22:19:13.209145+00
387	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	139639	2026-10-14 22:19:13.331067+00
388	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	4715	2026-10-14 22:19:13.449021+00
389	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	109810	2026-10-14 22:19:13.571109+00
390	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	34129	2026-10-14 22:19:13.694377+00
391	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	26295	2026-10-14 22:19:13.822801+00
392	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	40249	2026-10-14 22:19:13.943277+00
393	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	208119	2026-10-14 22:19:14.066557+00
394	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	92489	2026-10-14 22:19:14.187832+00
395	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	228801	2026-10-14 22:19:14.317039+00
396	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	198312	2026-10-14 22:19:14.437756+00
397	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	108373	2026-10-14 22:19:14.564877+00
398	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	195378	2026-10-14 22:19:14.687193+00
399	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	224332	2026-10-14 22:19:14.810017+00
400	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	54378	2026-10-14 22:19:14.934984+00
401	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	168350	2026-10-14 22:19:15.062819+00
402	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	233047	2026-10-14 22:19:15.183402+00
403	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	100668	2026-10-14 22:19:15.304752+00
404	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	181178	2026-10-14 22:19:15.430967+00
405	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	212808	2026-10-14 22:19:15.556957+00
406	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	148685	2026-10-14 22:19:15.679619+00
407	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	194237	2026-10-14 22:19:15.803162+00
408	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	122839	2026-10-14 22:19:15.927837+00
409	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	53741	2026-10-14 22:19:16.058093+00
410	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	42727	2026-10-14 22:19:16.178866+00
411	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	161584	2026-10-14 22:19:16.308781+00
412	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	121457	2026-10-14 22:19:17.48881+00
413	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	52410	2026-10-14 22:19:17.643026+00
414	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	51509	2026-10-14 22:19:23.901685+00
415	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	38621	2026-10-14 22:19:24.04758+00
416	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	40979	2026-10-14 22:19:27.719515+00
417	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	62207	2026-10-14 22:19:27.869524+00
418	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	128080	2026-10-14 22:19:28.638397+00
419	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	123718	2026-10-14 22:19:28.787038+00
420	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	212903	2026-10-14 22:19:29.675164+00
421	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	34504	2026-10-14 22:19:30.26952+00
422	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	144647	2026-10-14 22:19:30.387492+00
423	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	112802	2026-10-14 22:19:30.509869+00
424	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	159377	2026-10-14 22:19:30.63101+00
425	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	187669	2026-10-14 22:19:30.750715+00
426	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	49381	2026-10-14 22:19:30.871637+00
427	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	11768	2026-10-14 22:19:30.998393+00
428	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	air_kiss	42555	2026-10-14 22:19:31.121549+00
429	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	224098	2026-10-14 22:19:32.216903+00
430	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	105829	2026-10-14 22:19:32.335586+00
431	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	146950	2026-10-14 22:19:32.453094+00
432	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	231085	2026-10-14 22:19:32.580501+00
433	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	157102	2026-10-14 22:19:32.704921+00
434	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	91317	2026-10-14 22:19:32.840959+00
435	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	154472	2026-10-14 22:19:32.951905+00
436	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	193804	2026-10-14 22:19:33.078547+00
437	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	crown4	55141	2026-10-14 22:19:33.196736+00
438	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	30745	2026-10-14 22:19:33.735336+00
439	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	bear7	527	2026-10-14 22:19:35.21493+00
440	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	121257	2026-10-14 22:19:40.336228+00
441	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	201038	2026-10-14 22:19:40.4354+00
442	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	206768	2026-10-14 22:19:40.553733+00
443	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	90215	2026-10-14 22:19:40.680762+00
444	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	108527	2026-10-14 22:19:40.796164+00
445	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	114368	2026-10-14 22:19:40.917559+00
446	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	740	2026-10-14 22:19:41.052892+00
447	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	178078	2026-10-14 22:19:41.205937+00
448	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	crown3	217469	2026-10-14 22:19:41.352262+00
449	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	92361	2026-10-14 22:19:50.291521+00
450	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	182016	2026-10-14 22:19:50.400771+00
451	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	44295	2026-10-14 22:19:50.527847+00
452	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	78559	2026-10-14 22:19:50.646469+00
457	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	76166	2026-10-14 22:19:51.321148+00
463	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	138739	2026-10-14 22:19:52.216282+00
464	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ears2	189312	2026-10-14 22:21:04.571251+00
471	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ushanka	32713	2026-10-14 22:26:25.494089+00
472	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ushanka	208521	2026-10-14 22:26:31.40155+00
476	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ushanka	130911	2026-10-14 22:26:31.886073+00
453	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	213134	2026-10-14 22:19:50.766863+00
459	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	44617	2026-10-14 22:19:51.617938+00
468	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	icecream	167543	2026-10-14 22:26:17.373402+00
474	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ushanka	11818	2026-10-14 22:26:31.644626+00
454	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	63945	2026-10-14 22:19:50.88645+00
460	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	42709	2026-10-14 22:19:51.77195+00
466	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ears1	176137	2026-10-14 22:24:17.366473+00
469	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ears2	36125	2026-10-14 22:26:18.629876+00
455	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	66899	2026-10-14 22:19:51.012851+00
461	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	75564	2026-10-14 22:19:51.914949+00
467	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	frog	5217	2026-10-14 22:26:16.752789+00
473	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ushanka	178204	2026-10-14 22:26:31.516974+00
477	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ushanka	203954	2026-10-14 22:26:32.009404+00
456	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	135801	2026-10-14 22:19:51.171587+00
462	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	178036	2026-10-14 22:19:52.065158+00
465	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ears2	122520	2026-10-14 22:21:04.682462+00
470	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ears2	119653	2026-10-14 22:26:18.754416+00
475	2	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	ushanka	167355	2026-10-14 22:26:31.761659+00
458	2	0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	air_kiss	162175	2026-10-14 22:19:51.469078+00
478	1	1775fa19-25af-4e9e-b000-345ddb8267d0	e44980b9-445b-443d-b068-b9780eed1e84	air_kiss	9985	2026-10-14 23:11:08.459134+00
479	1	1775fa19-25af-4e9e-b000-345ddb8267d0	e44980b9-445b-443d-b068-b9780eed1e84	air_kiss	169012	2026-10-14 23:11:08.624518+00
480	1	1775fa19-25af-4e9e-b000-345ddb8267d0	e44980b9-445b-443d-b068-b9780eed1e84	air_kiss	102294	2026-10-14 23:11:09.976253+00
481	1	1775fa19-25af-4e9e-b000-345ddb8267d0	e44980b9-445b-443d-b068-b9780eed1e84	air_kiss	180575	2026-10-14 23:11:10.088792+00
482	1	1775fa19-25af-4e9e-b000-345ddb8267d0	e44980b9-445b-443d-b068-b9780eed1e84	air_kiss	134973	2026-10-14 23:11:10.214618+00
483	1	1775fa19-25af-4e9e-b000-345ddb8267d0	e44980b9-445b-443d-b068-b9780eed1e84	air_kiss	118133	2026-10-14 23:11:10.338597+00
484	1	1775fa19-25af-4e9e-b000-345ddb8267d0	e44980b9-445b-443d-b068-b9780eed1e84	air_kiss	87919	2026-10-14 23:11:10.45509+00
485	1	1775fa19-25af-4e9e-b000-345ddb8267d0	e44980b9-445b-443d-b068-b9780eed1e84	air_kiss	147861	2026-10-14 23:11:10.591508+00
486	1	1775fa19-25af-4e9e-b000-345ddb8267d0	e44980b9-445b-443d-b068-b9780eed1e84	air_kiss	182713	2026-10-14 23:11:10.699582+00
487	1	1775fa19-25af-4e9e-b000-345ddb8267d0	ae580d26-190e-4ed2-8f85-cbdb8765f8f0	crown1	6568	2026-10-14 23:11:46.763831+00
\.


--
-- Data for Name: gift_prices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gift_prices (gift_type, price, kisses_required, vip_only) FROM stdin;
crown1	3	0	f
crown2	3	0	f
crown3	3	0	f
crown4	3	0	f
partyhat	2	0	f
birthdaycake	1	0	f
air_kiss	1	0	f
gem	1	0	f
strawberry	1	0	f
tomato	1	0	f
frog	2	0	f
flower	1	0	f
sweet	1	0	f
bear4	1	0	f
bear1	1	0	f
bear7	1	0	f
bouquet	1	0	f
bouquet2	1	0	f
rose	1	0	f
cactus	1	0	f
icecream	1	0	f
cake	1	0	f
milk	1	0	f
wine	1	0	f
whiskey	1	0	f
tea	1	0	f
vodka	3	0	f
coffee	1	0	f
champagne	1	0	f
beer	1	0	f
martini	1	0	f
juice	1	0	f
love	2	0	f
teddybear	1	0	f
healthdrink	1	0	f
nurse	2	0	f
cowboy	2	0	f
bezkoz	2	0	f
slug	2	0	f
ears1	2	0	f
ears2	2	0	f
ears3	2	0	f
ears4	2	0	f
ears5	2	0	f
ears6	2	0	f
ears7	2	0	f
ears8	2	0	f
ears9a	2	0	f
bow1	2	0	f
bow2	2	0	f
bow3	2	0	f
bow4	2	0	f
flagaz	1	0	f
baseballaz	2	0	f
flagam	1	0	f
baseballam	2	0	f
mobile	2	0	f
ushanka	2	20	f
romcola	1	40	f
clown	2	80	f
mineralka	1	150	f
strawhat	2	250	f
bloodymary	1	350	f
weddingring1	1	550	f
weddingring2	1	550	f
weddingring3	1	550	f
weddingring4	1	550	f
latte	1	750	f
sombrero	2	950	f
mojito	1	1150	f
viking	2	1450	f
tarhun	1	1750	f
cappy	2	2150	f
bluelagoon	1	2550	f
pirat	2	3050	f
b52	2	3550	f
kotelok	2	4150	f
daiquiri	1	4750	f
pilotka	2	5350	f
sexonthebeach	2	5950	f
cylinder	2	6550	f
pinacolada	1	7150	f
rasta	2	7750	f
oscar	1	8350	f
nipple	1	8950	f
cocoscocktail	1	9550	f
surprizebox	1	10150	f
napoleon	2	10750	f
poison	1	11350	f
musketeer	2	11950	f
rassol	1	12550	f
sultan	2	13150	f
microphone	1	13750	f
voodoo	1	14350	f
jam	1	14950	f
pepper	1	15550	f
colander	2	16150	f
genielamp	1	16750	f
vanilla	1	17350	f
cherry	1	17950	f
sparta	2	18550	f
pearl	1	19150	f
cylinderw	2	19750	f
icecrown	2	20350	f
hookah	1	21050	f
indianhat	2	21850	f
bosscap	2	22750	f
cognacglass	1	23750	f
dollar	1	24850	f
matreshka	1	26050	f
universal	1	27350	f
easterrabbit	1	28750	f
tequilashot	1	30250	f
candy	1	31850	f
knight	2	33550	f
orchid	1	35350	f
lifestyle	1	37250	f
honeybarrel	1	39250	f
candyheartcup	1	41350	f
hamburger	1	43550	f
clutch	1	45850	f
friedpotatoes	1	48250	f
vipring	1	0	t
vipgold	3	0	t
viproses	1	0	t
viplegbox	1	0	t
vipkalash	1	0	t
vipcock	2	0	t
vipcrown	3	0	t
viphorseshoe	1	0	t
vipchampagne	1	0	t
blackrose	1	0	t
blackcrown	3	0	t
blackring	1	0	t
\.


--
-- Data for Name: gold_packages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gold_packages ("real", gold, bonus) FROM stdin;
10	10	0
50	50	0
100	100	10
200	200	40
500	500	150
1000	1000	350
5000	5000	1750
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, player_no, username, name, male, age, city, photo_url, frame, stone, kisses, gold, vip_until, welcome_gold, owned_items, created_at, tokens, daily_bonus_day, daily_bonus_on, dat) FROM stdin;
1d97bfdd-89d5-4648-8640-408fa1f35870	22	dattest3980	Dat Test	t	25	\N	\N			0	10011	2026-10-21 23:12:55.952934+00	t	{}	2026-10-14 23:12:26.860158+00	50	1	2026-10-14	9870
0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	13	rhim	Rəhimə	f	23	\N	\N	turbodecor	turbodecor	20	9152	\N	t	{turbodecor}	2026-10-14 21:27:07.048617+00	50	0	\N	10000
cb74bad6-4231-45fa-bee0-d456ec952783	23	dattest6720	Dat Test	t	25	\N	\N			0	10011	2026-10-21 23:13:54.97839+00	t	{}	2026-10-14 23:13:25.770388+00	50	1	2026-10-14	9870
50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	12	sako2001	sisvshahsbs	t	29	\N	https://uvkhovoqahnciqvqziot.supabase.co/storage/v1/object/sign/avatars/50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5/1792019000850.jpeg?token=eyJraWQiOiJlMDJiNjQyMS1mYWMwLTRhODMtOGRhNi0yZTNmZDlkYTQwYWUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhdmF0YXJzLzUwYjQzMmI4LTVjYzktNGI0YS05ZTUwLWMxYzYxYWU0ZTFlNS8xNzkyMDE5MDAwODUwLmpwZWciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkyMDE5MDAyLCJleHAiOjE4MjM1NTUwMDJ9.Y2_1UTBt5_pYQQlKSLMNzEeTPIKcEdg8r2juMe8bvdsYw-pPgzIiINaF7LfLpl72oRl5PaOQr1wC5NVFF3B-VA	hatreddecor	hatreddecor	20	7790	\N	t	{chipsdecor,cardsdecor,hatreddecor}	2026-10-14 21:14:24.723751+00	449	1	2026-10-14	10000
88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	15	tb9049	tb9049	f	25	\N	\N			0	10000	\N	t	{}	2026-10-14 21:36:08.047475+00	50	0	\N	10000
e44980b9-445b-443d-b068-b9780eed1e84	20	dattest8147	Dat Test	t	25	\N	\N			0	10001	\N	t	{}	2026-10-14 23:10:17.441811+00	50	1	2026-10-14	10000
759769de-8ccc-410d-842b-7b953b0e07cc	16	verify2dfe075688	Kontrol Erkek	t	25	\N	\N			0	10000	\N	t	{}	2026-10-14 21:56:02.064249+00	50	0	\N	10000
1f25ba4c-8cea-49b8-8e86-5d14cef9511e	14	ta9049	ta9049	t	25	\N	\N			0	9970	\N	t	{}	2026-10-14 21:36:07.770866+00	50	0	\N	10000
1775fa19-25af-4e9e-b000-345ddb8267d0	19	sjshshshsbsb	sjahshahsb	f	28	\N	\N			0	18141	2026-12-20 23:15:10.817326+00	t	{}	2026-10-14 23:07:32.179316+00	50	2	2026-10-15	3050
7013a180-9bf9-4664-975a-3fd505ca4631	1	test932	test932	t	\N	\N	\N			0	10000	\N	t	{}	2026-10-14 17:24:02.27706+00	50	0	\N	10000
f5577962-c1ef-499c-a8f8-01c41558c126	2	admin	ADMIN	t	25	\N	\N			0	10000	\N	t	{}	2026-10-14 17:25:42.715327+00	50	0	\N	10000
c0a877bb-4021-4870-8555-9cd4377360a6	3	pw14747	pw14747	t	25	\N	\N			0	10000	\N	t	{}	2026-10-14 17:28:06.932102+00	50	0	\N	10000
d9c87dc2-b6a1-48da-82d0-4cbad13ccc57	5	pw66076	pw66076	t	25	\N	\N			0	10000	\N	t	{}	2026-10-14 17:33:58.388707+00	50	0	\N	10000
aa13f5d6-dd94-4a17-990a-e6852d278ff4	6	pw89617	pw89617	t	25	\N	\N			0	10000	\N	t	{}	2026-10-14 17:34:55.721357+00	50	0	\N	10000
4db96fee-a8d0-49fa-8cbc-e7c18fe7975c	7	pw10811	pw10811	t	25	\N	\N			0	10000	\N	t	{}	2026-10-14 17:35:52.294546+00	50	0	\N	10000
96c266bd-6b59-4441-96ec-e6f3bfb5f0a6	8	pw27492	pw27492	t	25	\N	\N			0	10000	\N	t	{}	2026-10-14 17:36:25.122667+00	50	0	\N	10000
70313b59-2732-42e2-9773-6d263cbcc7d1	9	admin1234	Admakaja	f	19	\N	\N			0	10000	\N	t	{}	2026-10-14 17:40:54.530523+00	50	0	\N	10000
e53f257b-8f57-45f1-9df7-9961af45de26	4	admin89	adminn	t	25	\N	\N			0	10000	\N	t	{}	2026-10-14 17:31:44.898021+00	50	0	\N	10000
3e9b010b-c259-40f9-8385-70f5c2c54e78	10	bal35cbe5fe1a	bal35cbe5fe1a	t	25	\N	\N			0	10000	\N	t	{}	2026-10-14 17:49:07.998746+00	50	0	\N	10000
4783e631-5b51-4740-ae0b-5eaba7668635	11	admin123	adminnn	t	26	\N	\N	turbodecor	turbodecor	0	9500	\N	t	{turbodecor}	2026-10-14 17:50:27.503064+00	50	0	\N	10000
ed4e680d-df0d-4b21-b49c-76ce179fdde8	18	verifybeb548e04e	Kontrol Kadın	f	25	\N	\N			5	10000	\N	t	{}	2026-10-14 21:57:19.308286+00	50	0	\N	10000
ae580d26-190e-4ed2-8f85-cbdb8765f8f0	21	dattest7473	Dat Test	t	25	\N	\N			0	10011	2026-10-21 23:11:45.44642+00	t	{}	2026-10-14 23:11:16.590666+00	50	1	2026-10-14	9870
5048bd54-fa0c-47cb-b86c-b0f7b20b7226	17	verifya0906b9c1e	Kontrol Erkek	t	25	\N	\N			5	9975	\N	t	{}	2026-10-14 21:57:09.353702+00	50	0	\N	10000
\.


--
-- Data for Name: room_players; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.room_players (room_id, seat, user_id, last_seen, joined_at) FROM stdin;
1	8	1775fa19-25af-4e9e-b000-345ddb8267d0	2026-10-15 04:37:46.435546+00	2026-10-14 23:15:04.441291+00
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rooms (id, phase, spinner, target, decisions, round, phase_at, music, created_at, bottle) FROM stdin;
2	offer	\N	\N	{}	29	2026-10-14 22:37:40.356905+00	{"key": 1792017418978, "item": {"url": "https://www.youtube.com/watch?v=Q_wWkc3O4ug", "icon": "https://i.ytimg.com/vi/Q_wWkc3O4ug/mqdefault.jpg", "title": "İntizar & Hasan Yılmaz - Düzelir Be Kanka (Official Video)", "artist": "", "song_id": "Q_wWkc3O4ug", "duration": 246, "provider": "yt"}, "sender": "50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5", "service": "yt", "started_at": "2026-10-14T22:36:58.972784+00:00"}	2026-10-14 17:36:10.293638+00	baby
1	offer	\N	\N	{}	17	2026-10-14 23:15:05.103642+00	{"key": 1792018694998, "item": {"url": "https://cdn-s.ciliz.com/music-preview/dp/5.mp3", "icon": "", "title": "Малыш и Карлсон (из м/ф Малыш и Карлосон) remix Dj Max Korovaev", "artist": "Dj Max Korovaev & IN OUT", "song_id": "dp/5", "duration": 222, "provider": "cz"}, "sender": "50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5", "service": "cz", "started_at": "2026-10-14T22:58:14.995194+00:00"}	2026-10-14 17:24:03.108533+00	cognac
\.


--
-- Data for Name: table_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.table_history (user_id, room_id, visited_at) FROM stdin;
d9c87dc2-b6a1-48da-82d0-4cbad13ccc57	1	2026-10-14 17:34:02.696096+00
aa13f5d6-dd94-4a17-990a-e6852d278ff4	1	2026-10-14 17:35:00.040337+00
4db96fee-a8d0-49fa-8cbc-e7c18fe7975c	1	2026-10-14 17:35:56.586269+00
4db96fee-a8d0-49fa-8cbc-e7c18fe7975c	2	2026-10-14 17:36:10.293638+00
96c266bd-6b59-4441-96ec-e6f3bfb5f0a6	2	2026-10-14 17:36:29.417132+00
96c266bd-6b59-4441-96ec-e6f3bfb5f0a6	1	2026-10-14 17:36:43.059747+00
e53f257b-8f57-45f1-9df7-9961af45de26	1	2026-10-14 17:43:11.638846+00
70313b59-2732-42e2-9773-6d263cbcc7d1	1	2026-10-14 17:43:22.44156+00
3e9b010b-c259-40f9-8385-70f5c2c54e78	1	2026-10-14 17:49:09.036109+00
4783e631-5b51-4740-ae0b-5eaba7668635	1	2026-10-14 17:50:35.063682+00
50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	1	2026-10-14 23:03:29.616492+00
e44980b9-445b-443d-b068-b9780eed1e84	1	2026-10-14 23:10:25.844076+00
ae580d26-190e-4ed2-8f85-cbdb8765f8f0	1	2026-10-14 23:11:21.845522+00
1d97bfdd-89d5-4648-8640-408fa1f35870	1	2026-10-14 23:12:32.255119+00
cb74bad6-4231-45fa-bee0-d456ec952783	1	2026-10-14 23:13:31.456706+00
1775fa19-25af-4e9e-b000-345ddb8267d0	1	2026-10-14 23:15:04.441291+00
88bcc5d0-2f6d-4f50-b170-828a0cfac3e6	1	2026-10-14 21:36:21.834406+00
1f25ba4c-8cea-49b8-8e86-5d14cef9511e	1	2026-10-14 21:36:25.894393+00
759769de-8ccc-410d-842b-7b953b0e07cc	1	2026-10-14 21:56:03.909742+00
ed4e680d-df0d-4b21-b49c-76ce179fdde8	2	2026-10-14 22:05:16.270331+00
5048bd54-fa0c-47cb-b86c-b0f7b20b7226	1	2026-10-14 22:10:00.269457+00
ed4e680d-df0d-4b21-b49c-76ce179fdde8	1	2026-10-14 22:10:31.354268+00
5048bd54-fa0c-47cb-b86c-b0f7b20b7226	2	2026-10-14 22:13:38.399336+00
0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	1	2026-10-14 22:15:23.812336+00
0cae473a-a52c-4ce0-88bf-cf3b1303b1c6	2	2026-10-14 22:17:09.125457+00
50b432b8-5cc9-4b4a-9e50-c1c61ae4e1e5	2	2026-10-14 22:37:39.731867+00
\.


--
-- Data for Name: token_prices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_prices (gold, tokens) FROM stdin;
180	450
30	75
10	25
5	10
2	3
\.


--
-- Data for Name: vip_packages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vip_packages (id, price, days) FROM stdin;
vip7	120	7
vip30	390	30
\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 29, true);


--
-- Name: gesture_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gesture_events_id_seq', 54, true);


--
-- Name: gift_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gift_events_id_seq', 487, true);


--
-- Name: profiles_player_no_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.profiles_player_no_seq', 23, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rooms_id_seq', 2, true);


--
-- Name: achievement_acks achievement_acks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievement_acks
    ADD CONSTRAINT achievement_acks_pkey PRIMARY KEY (user_id, achievement_id, level);


--
-- Name: bottle_prices bottle_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bottle_prices
    ADD CONSTRAINT bottle_prices_pkey PRIMARY KEY (bottle);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: decor_prices decor_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decor_prices
    ADD CONSTRAINT decor_prices_pkey PRIMARY KEY (item);


--
-- Name: gesture_events gesture_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gesture_events
    ADD CONSTRAINT gesture_events_pkey PRIMARY KEY (id);


--
-- Name: gesture_prices gesture_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gesture_prices
    ADD CONSTRAINT gesture_prices_pkey PRIMARY KEY (gesture);


--
-- Name: gift_events gift_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_events
    ADD CONSTRAINT gift_events_pkey PRIMARY KEY (id);


--
-- Name: gift_prices gift_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_prices
    ADD CONSTRAINT gift_prices_pkey PRIMARY KEY (gift_type);


--
-- Name: gold_packages gold_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gold_packages
    ADD CONSTRAINT gold_packages_pkey PRIMARY KEY ("real");


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_player_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_player_no_key UNIQUE (player_no);


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: room_players room_players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_players
    ADD CONSTRAINT room_players_pkey PRIMARY KEY (room_id, seat);


--
-- Name: room_players room_players_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_players
    ADD CONSTRAINT room_players_user_id_key UNIQUE (user_id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: table_history table_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.table_history
    ADD CONSTRAINT table_history_pkey PRIMARY KEY (user_id, room_id);


--
-- Name: token_prices token_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_prices
    ADD CONSTRAINT token_prices_pkey PRIMARY KEY (gold);


--
-- Name: vip_packages vip_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vip_packages
    ADD CONSTRAINT vip_packages_pkey PRIMARY KEY (id);


--
-- Name: gesture_events_sender_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gesture_events_sender_idx ON public.gesture_events USING btree (sender_id, created_at);


--
-- Name: gift_events_receiver_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gift_events_receiver_idx ON public.gift_events USING btree (receiver_id);


--
-- Name: gift_events_sender_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gift_events_sender_idx ON public.gift_events USING btree (sender_id);


--
-- Name: room_players room_players_history; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER room_players_history AFTER INSERT ON public.room_players FOR EACH ROW EXECUTE FUNCTION public._log_table_visit();


--
-- Name: achievement_acks achievement_acks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievement_acks
    ADD CONSTRAINT achievement_acks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: chat_messages chat_messages_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: gesture_events gesture_events_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gesture_events
    ADD CONSTRAINT gesture_events_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: gesture_events gesture_events_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gesture_events
    ADD CONSTRAINT gesture_events_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: gift_events gift_events_gift_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_events
    ADD CONSTRAINT gift_events_gift_type_fkey FOREIGN KEY (gift_type) REFERENCES public.gift_prices(gift_type);


--
-- Name: gift_events gift_events_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_events
    ADD CONSTRAINT gift_events_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: gift_events gift_events_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_events
    ADD CONSTRAINT gift_events_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: gift_events gift_events_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_events
    ADD CONSTRAINT gift_events_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: room_players room_players_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_players
    ADD CONSTRAINT room_players_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: room_players room_players_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_players
    ADD CONSTRAINT room_players_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: table_history table_history_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.table_history
    ADD CONSTRAINT table_history_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: table_history table_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.table_history
    ADD CONSTRAINT table_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: achievement_acks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.achievement_acks ENABLE ROW LEVEL SECURITY;

--
-- Name: bottle_prices bottle prices read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "bottle prices read" ON public.bottle_prices FOR SELECT USING (true);


--
-- Name: bottle_prices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bottle_prices ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_messages chat read own room; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "chat read own room" ON public.chat_messages FOR SELECT TO authenticated USING ((room_id = public.my_room()));


--
-- Name: chat_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: decor_prices decor prices read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "decor prices read" ON public.decor_prices FOR SELECT USING (true);


--
-- Name: decor_prices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.decor_prices ENABLE ROW LEVEL SECURITY;

--
-- Name: gesture_prices gesture prices read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "gesture prices read" ON public.gesture_prices FOR SELECT USING (true);


--
-- Name: gesture_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gesture_events ENABLE ROW LEVEL SECURITY;

--
-- Name: gesture_prices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gesture_prices ENABLE ROW LEVEL SECURITY;

--
-- Name: gesture_events gestures read own room; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "gestures read own room" ON public.gesture_events FOR SELECT TO authenticated USING ((room_id = public.my_room()));


--
-- Name: gift_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gift_events ENABLE ROW LEVEL SECURITY;

--
-- Name: gift_prices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gift_prices ENABLE ROW LEVEL SECURITY;

--
-- Name: gift_events gifts read own room; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "gifts read own room" ON public.gift_events FOR SELECT TO authenticated USING ((room_id = public.my_room()));


--
-- Name: gold_packages gold packages read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "gold packages read" ON public.gold_packages FOR SELECT USING (true);


--
-- Name: gold_packages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gold_packages ENABLE ROW LEVEL SECURITY;

--
-- Name: achievement_acks own acks read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "own acks read" ON public.achievement_acks FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: table_history own history read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "own history read" ON public.table_history FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: profiles own profile update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: room_players players read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "players read" ON public.room_players FOR SELECT TO authenticated USING (true);


--
-- Name: gift_prices prices read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "prices read" ON public.gift_prices FOR SELECT USING (true);


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles readable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "profiles readable" ON public.profiles FOR SELECT USING (true);


--
-- Name: room_players; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;

--
-- Name: rooms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

--
-- Name: rooms rooms read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "rooms read" ON public.rooms FOR SELECT TO authenticated USING (true);


--
-- Name: table_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.table_history ENABLE ROW LEVEL SECURITY;

--
-- Name: token_prices token prices read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "token prices read" ON public.token_prices FOR SELECT USING (true);


--
-- Name: token_prices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.token_prices ENABLE ROW LEVEL SECURITY;

--
-- Name: vip_packages vip packages read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "vip packages read" ON public.vip_packages FOR SELECT USING (true);


--
-- Name: vip_packages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.vip_packages ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict pgbGQlLPgyAxT1HAMw2nE455J1I0ZN2rOgTRpDa8bA5huWHqsYih37O04dO2huy


--
-- PostgreSQL database dump
--

\restrict NFd49ilxMaMfKf0mb7BmHT4mBDdlFmgW7rPIs7plz8Zgub0jepQhNHOBzyf7MC4

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: bottle_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('autumn', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('baby', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('champagnebot', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('cognac', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('cola', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('jackdaniels', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('ketchup', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('lemonade', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('martinibot', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('milkbot', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('nybottle', 3, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('pirate', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('ship', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('skeleton', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('skewer', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('spring', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('sprite', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('standart', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('summer', 5, false);
INSERT INTO public.bottle_prices (bottle, price, vip_only) VALUES ('vipbottle', 5, true);


--
-- Data for Name: decor_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.decor_prices (item, price) VALUES ('turbodecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('tourismdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('heartsdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('kissesdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('theatredecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('cinemadecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('eastdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('westdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('lovedecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('hatreddecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('chipsdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('cardsdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('nightdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('daydecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('discodecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('rockdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('fruitjellydecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('carameldecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('naturedecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('stonedecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('violetdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('greendecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('egyptdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('romedecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('venusdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('marsdecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('icedecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('lavadecor', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('angel', 500);
INSERT INTO public.decor_prices (item, price) VALUES ('demon', 500);


--
-- Data for Name: gesture_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('agree', 1, 175, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('airkissges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('angelges', 3, 20100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('anger', 1, 1700, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('applause', 1, 28100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('artistges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('bandit', 2, 31100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('barmanges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('bayanistges', 2, 17700, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('beback', 1, 6900, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('beerges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('binocularsges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('bla', 2, 14100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('bouqetges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('bragging', 2, 90300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('braggingvip', 1, 0, true);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('bunchofmoney', 10, 226300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('bye', 1, 50, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('camouflageges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('cannotspeak', 2, 16500, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('chocolateges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('contempt', 1, 11700, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('cool', 3, 15300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('crackerges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('crazy', 1, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('cry', 1, 385, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('dance', 2, 8100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('defenderges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('devil', 3, 21500, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('dikaprio', 1, 0, true);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('disagree', 1, 225, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('disco', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('dj', 2, 34500, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('dragonges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('driving', 2, 148300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('drunk', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('elvisges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('explode', 3, 65100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('facepalm', 3, 42500, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('famousges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('fearful', 2, 81100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('fk', 5, 209100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('gentleman', 2, 135100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('gratitude', 1, 2400, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('grinning', 1, 1100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('grunt', 1, 18900, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('guitaristges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('handround', 2, 10500, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('happy', 1, 70, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('heartface', 3, 52300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('heartges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('hello', 1, 30, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('jediges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('jewelerges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('jugglerges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('kiss', 3, 3300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('laugh', 1, 280, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('little', 1, 650, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('lookthroughges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('loveges', 2, 25500, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('michael', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('mimistges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('monkey', 3, 192700, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('muerteges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('music', 2, 47100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('nohearts', 1, 10, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('nurseges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('ok', 1, 500, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('orangutanges', 1, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('parrot', 3, 162300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('party', 2, 38300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('rap', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('rich', 5, 72700, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('rock', 2, 23300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('sad', 1, 125, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('scream', 2, 111100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('selfie', 1, 0, true);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('shy', 1, 800, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('sleepges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('smoking', 2, 177100, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('snowballges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('sparklerges', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('star', 2, 100300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('stereoglassesges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('strictges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('sun', 3, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('thumbdown', 1, 5700, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('thumbup', 1, 4500, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('tongue', 1, 1400, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('vomiting', 3, 12900, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('wall', 2, 122700, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('watermelonges', 2, 0, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('wink', 1, 9300, false);
INSERT INTO public.gesture_prices (gesture, price, kisses_required, vip_only) VALUES ('yawn', 2, 58300, false);


--
-- Data for Name: gift_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('crown1', 3, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('crown2', 3, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('crown3', 3, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('crown4', 3, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('partyhat', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('birthdaycake', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('air_kiss', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('gem', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('strawberry', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('tomato', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('frog', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('flower', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('sweet', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bear4', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bear1', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bear7', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bouquet', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bouquet2', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('rose', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('cactus', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('icecream', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('cake', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('milk', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('wine', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('whiskey', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('tea', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('vodka', 3, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('coffee', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('champagne', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('beer', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('martini', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('juice', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('love', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('teddybear', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('healthdrink', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('nurse', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('cowboy', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bezkoz', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('slug', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ears1', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ears2', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ears3', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ears4', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ears5', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ears6', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ears7', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ears8', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ears9a', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bow1', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bow2', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bow3', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bow4', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('flagaz', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('baseballaz', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('flagam', 1, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('baseballam', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('mobile', 2, 0, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('ushanka', 2, 20, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('romcola', 1, 40, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('clown', 2, 80, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('mineralka', 1, 150, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('strawhat', 2, 250, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bloodymary', 1, 350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('weddingring1', 1, 550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('weddingring2', 1, 550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('weddingring3', 1, 550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('weddingring4', 1, 550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('latte', 1, 750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('sombrero', 2, 950, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('mojito', 1, 1150, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('viking', 2, 1450, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('tarhun', 1, 1750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('cappy', 2, 2150, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bluelagoon', 1, 2550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('pirat', 2, 3050, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('b52', 2, 3550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('kotelok', 2, 4150, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('daiquiri', 1, 4750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('pilotka', 2, 5350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('sexonthebeach', 2, 5950, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('cylinder', 2, 6550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('pinacolada', 1, 7150, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('rasta', 2, 7750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('oscar', 1, 8350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('nipple', 1, 8950, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('cocoscocktail', 1, 9550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('surprizebox', 1, 10150, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('napoleon', 2, 10750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('poison', 1, 11350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('musketeer', 2, 11950, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('rassol', 1, 12550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('sultan', 2, 13150, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('microphone', 1, 13750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('voodoo', 1, 14350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('jam', 1, 14950, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('pepper', 1, 15550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('colander', 2, 16150, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('genielamp', 1, 16750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('vanilla', 1, 17350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('cherry', 1, 17950, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('sparta', 2, 18550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('pearl', 1, 19150, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('cylinderw', 2, 19750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('icecrown', 2, 20350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('hookah', 1, 21050, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('indianhat', 2, 21850, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('bosscap', 2, 22750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('cognacglass', 1, 23750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('dollar', 1, 24850, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('matreshka', 1, 26050, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('universal', 1, 27350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('easterrabbit', 1, 28750, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('tequilashot', 1, 30250, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('candy', 1, 31850, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('knight', 2, 33550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('orchid', 1, 35350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('lifestyle', 1, 37250, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('honeybarrel', 1, 39250, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('candyheartcup', 1, 41350, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('hamburger', 1, 43550, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('clutch', 1, 45850, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('friedpotatoes', 1, 48250, false);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('vipring', 1, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('vipgold', 3, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('viproses', 1, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('viplegbox', 1, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('vipkalash', 1, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('vipcock', 2, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('vipcrown', 3, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('viphorseshoe', 1, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('vipchampagne', 1, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('blackrose', 1, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('blackcrown', 3, 0, true);
INSERT INTO public.gift_prices (gift_type, price, kisses_required, vip_only) VALUES ('blackring', 1, 0, true);


--
-- Data for Name: gold_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.gold_packages ("real", gold, bonus) VALUES (10, 10, 0);
INSERT INTO public.gold_packages ("real", gold, bonus) VALUES (50, 50, 0);
INSERT INTO public.gold_packages ("real", gold, bonus) VALUES (100, 100, 10);
INSERT INTO public.gold_packages ("real", gold, bonus) VALUES (200, 200, 40);
INSERT INTO public.gold_packages ("real", gold, bonus) VALUES (500, 500, 150);
INSERT INTO public.gold_packages ("real", gold, bonus) VALUES (1000, 1000, 350);
INSERT INTO public.gold_packages ("real", gold, bonus) VALUES (5000, 5000, 1750);


--
-- Data for Name: token_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.token_prices (gold, tokens) VALUES (180, 450);
INSERT INTO public.token_prices (gold, tokens) VALUES (30, 75);
INSERT INTO public.token_prices (gold, tokens) VALUES (10, 25);
INSERT INTO public.token_prices (gold, tokens) VALUES (5, 10);
INSERT INTO public.token_prices (gold, tokens) VALUES (2, 3);


--
-- Data for Name: vip_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vip_packages (id, price, days) VALUES ('vip7', 120, 7);
INSERT INTO public.vip_packages (id, price, days) VALUES ('vip30', 390, 30);


--
-- PostgreSQL database dump complete
--

\unrestrict NFd49ilxMaMfKf0mb7BmHT4mBDdlFmgW7rPIs7plz8Zgub0jepQhNHOBzyf7MC4


-- Grants for the Data API
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant all on all tables in schema public to service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;

-- New-user profile trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Avatars bucket (private) + policies
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', false) on conflict (id) do nothing;
drop policy if exists "avatar read" on storage.objects;
create policy "avatar read" on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists "avatar write own" on storage.objects;
create policy "avatar write own" on storage.objects for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatar update own" on storage.objects;
create policy "avatar update own" on storage.objects for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
