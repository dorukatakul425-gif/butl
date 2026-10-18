-- Full top ratings: all five sections from the Telegram build (1.6.393) become real.
-- total_kisses: every received kiss (bottle + gifts). dj_score: hearts spent on music,
-- plus one point per gift received while your own song plays. price: last admiration
-- price. harem_price: hearts spent admiring others. gestures: tokens spent on gestures.
-- Periods (daily/weekly/monthly) apply to kisses, DJ and gestures; price and harem_price
-- are absolute-only, exactly like the original dialog (no period selector there).

CREATE TABLE public.kiss_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX kiss_events_user_idx ON public.kiss_events (user_id, created_at);
GRANT SELECT ON public.kiss_events TO authenticated;
GRANT ALL ON public.kiss_events TO service_role;
ALTER TABLE public.kiss_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY kiss_events_read ON public.kiss_events FOR SELECT TO authenticated USING (true);

CREATE TABLE public.dj_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  points integer NOT NULL CHECK (points > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX dj_events_user_idx ON public.dj_events (user_id, created_at);
GRANT SELECT ON public.dj_events TO authenticated;
GRANT ALL ON public.dj_events TO service_role;
ALTER TABLE public.dj_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY dj_events_read ON public.dj_events FOR SELECT TO authenticated USING (true);

-- Admiration notices: the previous admirer is told at once when someone else admires
-- the same person (or the person rejects them), like the original "harem" alerts.
CREATE TABLE public.profile_notifications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  kind text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX profile_notifications_user_idx ON public.profile_notifications (user_id, created_at);
GRANT SELECT ON public.profile_notifications TO authenticated;
GRANT ALL ON public.profile_notifications TO service_role;
ALTER TABLE public.profile_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY profile_notifications_own ON public.profile_notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_notifications;

-- Bottle kisses are logged so daily/weekly/monthly kiss ratings are real.
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
    insert into public.kiss_events(user_id)
     select user_id from public.room_players where room_id = p_room and seat in (r.spinner, r.target);
  end if;
  update public.rooms set phase='result', decisions=d, phase_at=now() where id = p_room;
end $$;

-- DJ points: every heart spent on a song counts (dlg:top:help:dj_score).
CREATE OR REPLACE FUNCTION public.play_music(p_service text, p_item jsonb) RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  insert into public.dj_events(user_id, points) values (me.id, pr);
  update public.rooms set music = jsonb_build_object(
    'service', p_service,
    'item', jsonb_build_object('artist', left(coalesce(p_item->>'artist',''),200), 'title', left(coalesce(p_item->>'title',''),200),
       'duration', (p_item->>'duration')::numeric, 'song_id', left(p_item->>'song_id',100), 'provider', p_service,
       'url', left(coalesce(p_item->>'url',''),500), 'icon', left(coalesce(p_item->>'icon',''),500)),
    'sender', me.id, 'started_at', now(), 'key', (extract(epoch from clock_timestamp())*1000)::bigint)
   where id = rid;
  return me.gold - pr;
end $$;

-- DJ points: a gift received while your song is playing counts as one point.
CREATE OR REPLACE FUNCTION public.send_gift(p_gift text, p_receivers uuid[], p_seed int default 0) RETURNS int
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
  insert into public.dj_events(user_id, points)
    select rp.user_id, 1 from public.room_players rp
     join public.rooms r on r.id = rp.room_id
    where rp.room_id = rid and rp.user_id = any(p_receivers) and rp.user_id <> me.id
      and r.music is not null and r.music->>'sender' = rp.user_id::text
      and now() - (r.music->>'started_at')::timestamptz < make_interval(secs => coalesce((r.music->'item'->>'duration')::numeric, 0));
  return me.gold - total;
end $$;

-- Admiration: the previous admirer is notified when someone else admires the same
-- person, and when the person rejects them.
CREATE OR REPLACE FUNCTION public.harem_purchase(p_target uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); t profiles; cost int; g int; prev uuid; tname text; aname text;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO t FROM profiles WHERE id = p_target FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_user'; END IF;
  IF t.harem_owner = uid THEN RAISE EXCEPTION 'already_owner'; END IF;
  IF p_target = uid AND t.harem_owner IS NULL THEN RAISE EXCEPTION 'no_owner'; END IF;
  cost := t.harem_value + 1;
  prev := t.harem_owner;
  UPDATE profiles SET gold = gold - cost WHERE id = uid AND gold >= cost RETURNING gold INTO g;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_enough_gold'; END IF;
  UPDATE profiles SET harem_value = cost, harem_owner = CASE WHEN p_target = uid THEN NULL ELSE uid END WHERE id = p_target;
  IF prev IS NOT NULL AND prev <> uid THEN
    SELECT name INTO aname FROM profiles WHERE id = uid;
    IF p_target = uid THEN
      INSERT INTO profile_notifications(user_id, actor_id, kind, body)
      VALUES (prev, uid, 'harem_rejected', coalesce(aname, 'Oyuncu') || ' seni geri çevirdi');
    ELSE
      SELECT name INTO tname FROM profiles WHERE id = p_target;
      INSERT INTO profile_notifications(user_id, actor_id, kind, body)
      VALUES (prev, uid, 'harem_stolen', coalesce(aname, 'Oyuncu') || ', hayran olduğun ' || coalesce(tname, 'oyuncuyu') || ' senden aldı');
    END IF;
  END IF;
  RETURN jsonb_build_object('price', cost, 'gold', g);
END $$;
REVOKE ALL ON FUNCTION public.harem_purchase(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.harem_purchase(uuid) TO authenticated;

-- All five rating sections, with real periods where the original dialog offers them.
CREATE OR REPLACE FUNCTION public.top_players(p_section text, p_period text DEFAULT '')
RETURNS TABLE(id uuid, name text, photo_url text, male boolean, score bigint, rank bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE since timestamptz := CASE p_period WHEN 'daily' THEN date_trunc('day', now()) WHEN 'weekly' THEN date_trunc('week', now()) WHEN 'monthly' THEN date_trunc('month', now()) ELSE NULL END;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF p_section = 'total_kisses' AND since IS NULL THEN
    RETURN QUERY WITH r AS (SELECT p.id, p.name, p.photo_url, p.male, p.kisses::bigint AS score,
      row_number() OVER (ORDER BY p.kisses DESC, p.id) AS rank FROM profiles p)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSIF p_section = 'total_kisses' THEN
    RETURN QUERY WITH c AS (SELECT user_id, count(*)::bigint n FROM kiss_events WHERE created_at >= since GROUP BY user_id),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.user_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSIF p_section = 'dj_score' THEN
    RETURN QUERY WITH c AS (SELECT user_id, sum(points)::bigint n FROM dj_events WHERE since IS NULL OR created_at >= since GROUP BY user_id),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.user_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSIF p_section = 'price' THEN
    RETURN QUERY WITH r AS (SELECT p.id, p.name, p.photo_url, p.male, p.harem_value::bigint AS score,
      row_number() OVER (ORDER BY p.harem_value DESC, p.id) AS rank FROM profiles p WHERE p.harem_value > 0)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSIF p_section = 'harem_price' THEN
    RETURN QUERY WITH c AS (SELECT harem_owner AS user_id, sum(harem_value)::bigint n FROM profiles WHERE harem_owner IS NOT NULL GROUP BY harem_owner),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.user_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSIF p_section = 'gestures' THEN
    RETURN QUERY WITH c AS (SELECT sender_id, count(*)::bigint n FROM gesture_events WHERE since IS NULL OR created_at >= since GROUP BY sender_id),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.sender_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSE
    RAISE EXCEPTION 'unsupported';
  END IF;
END $$;
REVOKE ALL ON FUNCTION public.top_players(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.top_players(text, text) TO authenticated;

-- Profile popup: the DJ stat and rank are real now.
CREATE OR REPLACE FUNCTION public.user_profile_stats(p_user uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE k bigint; kr bigint; g bigint; gr bigint; pr int; prr bigint; hp bigint; hpr bigint; dj bigint; djr bigint; o profiles; own uuid; st text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT kisses, harem_value, harem_owner, bio INTO k, pr, own, st FROM profiles WHERE id = p_user;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT count(*) + 1 INTO kr FROM profiles WHERE kisses > k;
  SELECT count(*) INTO g FROM gesture_events WHERE sender_id = p_user;
  SELECT count(*) + 1 INTO gr FROM (SELECT sender_id FROM gesture_events GROUP BY sender_id HAVING count(*) > g) s;
  SELECT count(*) + 1 INTO prr FROM profiles WHERE harem_value > pr;
  SELECT coalesce(sum(harem_value), 0) INTO hp FROM profiles WHERE harem_owner = p_user;
  SELECT count(*) + 1 INTO hpr FROM (SELECT harem_owner FROM profiles WHERE harem_owner IS NOT NULL GROUP BY harem_owner HAVING sum(harem_value) > hp) s;
  SELECT coalesce(sum(points), 0) INTO dj FROM dj_events WHERE user_id = p_user;
  SELECT count(*) + 1 INTO djr FROM (SELECT user_id FROM dj_events GROUP BY user_id HAVING sum(points) > dj) s;
  IF own IS NOT NULL THEN SELECT * INTO o FROM profiles WHERE id = own; END IF;
  RETURN jsonb_build_object(
    'total_kisses', k, 'total_kisses_rank', CASE WHEN k > 0 THEN kr END,
    'gestures', g, 'gestures_rank', CASE WHEN g > 0 THEN gr END,
    'dj_score', dj, 'dj_score_rank', CASE WHEN dj > 0 THEN djr END,
    'price', pr, 'price_rank', CASE WHEN pr > 0 THEN prr END,
    'league', coalesce((SELECT level FROM league_players WHERE user_id = p_user), 0),
    'harem_price', hp, 'harem_price_rank', CASE WHEN hp > 0 THEN hpr END,
    'status', st,
    'owner', CASE WHEN o.id IS NULL THEN NULL ELSE jsonb_build_object('id', o.id, 'name', o.name, 'male', o.male, 'photo_url', o.photo_url) END);
END $$;
REVOKE ALL ON FUNCTION public.user_profile_stats(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.user_profile_stats(uuid) TO authenticated;

-- Live kick/save prices (the archive has no numbers): 30 hearts when the free use is
-- on cooldown, free use once a day, twice as fast for VIP (12 hours).
UPDATE public.kickout_config SET paid_price = 30, free_cooldown_seconds = 86400 WHERE id;
