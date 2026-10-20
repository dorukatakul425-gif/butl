-- Telegram Puanlar: "Səviyyə liderləri" (level) and "Aktivlik liderləri" (minutes in game).
-- Level points = hearts spent on gifts; 1400 points = 1 level (max 100) — computed in the client from the points.

-- Minutes in game, one row per player per UTC day; only activity_ping writes it.
CREATE TABLE IF NOT EXISTS public.activity_minutes (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day date NOT NULL,
  minutes integer NOT NULL DEFAULT 0,
  last_ping timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day)
);
GRANT ALL ON public.activity_minutes TO service_role;
ALTER TABLE public.activity_minutes ENABLE ROW LEVEL SECURITY;

-- Called once a minute by a seated player; at most one minute per 55 seconds is counted.
CREATE OR REPLACE FUNCTION public.activity_ping() RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); last timestamptz; today date := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM room_players WHERE user_id = uid) THEN RETURN 0; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('activity:' || uid::text));
  SELECT max(last_ping) INTO last FROM activity_minutes WHERE user_id = uid AND day >= today - 1;
  IF last IS NOT NULL AND now() - last < interval '55 seconds' THEN RETURN 0; END IF;
  INSERT INTO activity_minutes(user_id, day, minutes, last_ping) VALUES (uid, today, 1, now())
    ON CONFLICT (user_id, day) DO UPDATE SET minutes = activity_minutes.minutes + 1, last_ping = now();
  RETURN 1;
END $$;
REVOKE ALL ON FUNCTION public.activity_ping() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.activity_ping() TO authenticated;

-- Same row shape as top_players. Viewer is always returned; rank 0 means "not ranked yet".
CREATE OR REPLACE FUNCTION public.top_players_extra(p_section text, p_period text DEFAULT '')
RETURNS TABLE(id uuid, name text, photo_url text, male boolean, score bigint, rank bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE since timestamptz := CASE p_period WHEN 'daily' THEN date_trunc('day', now()) WHEN 'weekly' THEN date_trunc('week', now()) WHEN 'monthly' THEN date_trunc('month', now()) ELSE NULL END;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF p_section = 'glv' THEN
    RETURN QUERY WITH c AS (SELECT e.sender_id AS user_id, sum(g.price)::bigint n FROM gift_events e JOIN gift_prices g ON g.gift_type = e.gift_type
        WHERE since IS NULL OR e.created_at >= since GROUP BY e.sender_id HAVING sum(g.price) > 0),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.user_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid()
      UNION ALL SELECT p.id, p.name, p.photo_url, p.male, 0::bigint, 0::bigint FROM profiles p WHERE p.id = auth.uid() AND NOT EXISTS (SELECT 1 FROM r WHERE r.id = auth.uid())
      ORDER BY 6;
  ELSIF p_section = 'activity' THEN
    RETURN QUERY WITH c AS (SELECT a.user_id, sum(a.minutes)::bigint n FROM activity_minutes a
        WHERE since IS NULL OR a.day >= (since AT TIME ZONE 'UTC')::date GROUP BY a.user_id HAVING sum(a.minutes) > 0),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.user_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid()
      UNION ALL SELECT p.id, p.name, p.photo_url, p.male, 0::bigint, 0::bigint FROM profiles p WHERE p.id = auth.uid() AND NOT EXISTS (SELECT 1 FROM r WHERE r.id = auth.uid())
      ORDER BY 6;
  ELSE
    RAISE EXCEPTION 'unsupported';
  END IF;
END $$;
REVOKE ALL ON FUNCTION public.top_players_extra(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.top_players_extra(text, text) TO authenticated;
