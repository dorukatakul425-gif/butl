-- Authenticated music replacement: other users wait 60s; current sender is exempt.
CREATE OR REPLACE FUNCTION public.play_music(p_service text, p_item jsonb) RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
declare rid bigint; me public.profiles; pr int; current_music jsonb; remaining int;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  perform pg_advisory_xact_lock(741, (rid % 2147483647)::int);
  select music into current_music from public.rooms where id=rid;
  if current_music is not null and current_music->>'sender' is distinct from auth.uid()::text then
    remaining := ceil(extract(epoch from (current_music->>'started_at')::timestamptz + interval '60 seconds' - clock_timestamp()));
    if remaining > 0 then raise exception 'Yeni musiqi üçün % saniyə gözlə.',remaining; end if;
  end if;
  if not exists(select 1 from room_players where room_id=rid and user_id=auth.uid()) then raise exception 'not seated'; end if;
  pr := case p_service when 'cz' then 5 when 'yt' then 9 else null end;
  if pr is null then raise exception 'unknown service'; end if;
  if (coalesce((p_item->>'duration')::numeric, 0) <= 0 OR (p_item->>'duration')::numeric > 86400) or coalesce(p_item->>'song_id','') = '' then raise exception 'bad item'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if me.gold < pr then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - pr where id = me.id;
  insert into public.dj_events(user_id, points) values (me.id, pr);
  update public.rooms set music = jsonb_build_object(
    'service', p_service,
    'item', jsonb_build_object('artist', left(coalesce(p_item->>'artist',''),200), 'title', left(coalesce(p_item->>'title',''),200),
       'duration', (p_item->>'duration')::numeric, 'song_id', left(p_item->>'song_id',100), 'provider', p_service,
       'url', left(coalesce(p_item->>'url',''),500), 'icon', left(coalesce(p_item->>'icon',''),500)),
    'sender', me.id, 'started_at', clock_timestamp(), 'key', (extract(epoch from clock_timestamp())*1000)::bigint)
   where id = rid;
  return me.gold - pr;
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
  return me.gold - total;
end $$;

CREATE OR REPLACE FUNCTION public._music_gift_point() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE m jsonb; owner_id uuid; duration numeric; started timestamptz;
BEGIN
 SELECT music INTO m FROM rooms WHERE id=NEW.room_id;
 IF m IS NULL OR coalesce(m->>'sender','')='' THEN RETURN NEW; END IF;
 BEGIN
  duration := (m->'item'->>'duration')::numeric; started := (m->>'started_at')::timestamptz;
 EXCEPTION WHEN OTHERS THEN RETURN NEW; END;
 IF duration IS NULL OR duration <= 0 OR duration > 86400 THEN RETURN NEW; END IF;
 IF NEW.created_at >= started AND NEW.created_at < started + make_interval(secs=>duration::double precision) THEN
  owner_id := (m->>'sender')::uuid;
  INSERT INTO dj_events(user_id,points,created_at) VALUES(owner_id,1,NEW.created_at);
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public._music_gift_point() FROM public,anon,authenticated;
CREATE TRIGGER music_gift_point AFTER INSERT ON public.gift_events FOR EACH ROW EXECUTE FUNCTION public._music_gift_point();
CREATE TRIGGER music_premium_gift_point AFTER INSERT ON public.premium_gift_events FOR EACH ROW EXECUTE FUNCTION public._music_gift_point();
REVOKE ALL ON FUNCTION public.play_music(text,jsonb),public.send_gift(text,uuid[],int) FROM public,anon;
GRANT EXECUTE ON FUNCTION public.play_music(text,jsonb),public.send_gift(text,uuid[],int) TO authenticated;
