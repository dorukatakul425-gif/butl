ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS freeze_kiss_ranking boolean NOT NULL DEFAULT false;
CREATE OR REPLACE FUNCTION public.set_kiss_ranking_frozen(p_frozen boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  UPDATE profiles SET freeze_kiss_ranking = p_frozen WHERE id = auth.uid();
END $$;
REVOKE ALL ON FUNCTION public.set_kiss_ranking_frozen(boolean) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.set_kiss_ranking_frozen(boolean) TO authenticated;
CREATE OR REPLACE FUNCTION public.top_players(p_section text, p_period text DEFAULT '')
RETURNS TABLE(id uuid, name text, photo_url text, male boolean, score bigint, rank bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE since timestamptz := CASE p_period WHEN 'daily' THEN date_trunc('day', now()) WHEN 'weekly' THEN date_trunc('week', now()) WHEN 'monthly' THEN date_trunc('month', now()) ELSE NULL END;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF p_section = 'total_kisses' AND since IS NULL THEN
    RETURN QUERY WITH r AS (SELECT p.id, p.name, p.photo_url, p.male, p.kisses::bigint AS score,
      row_number() OVER (ORDER BY p.kisses DESC, p.id) AS rank FROM profiles p WHERE NOT p.freeze_kiss_ranking)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSIF p_section = 'total_kisses' THEN
    RETURN QUERY WITH c AS (SELECT user_id, count(*)::bigint n FROM kiss_events WHERE created_at >= since GROUP BY user_id),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.user_id WHERE NOT p.freeze_kiss_ranking)
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
