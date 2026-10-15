CREATE INDEX IF NOT EXISTS gesture_events_sender_idx ON public.gesture_events (sender_id, created_at);
CREATE INDEX IF NOT EXISTS gift_events_sender_idx ON public.gift_events (sender_id);
CREATE INDEX IF NOT EXISTS gift_events_receiver_idx ON public.gift_events (receiver_id);

-- TopDialog: total_kisses (lifetime counter) and gestures (event log, so periods are real).
CREATE OR REPLACE FUNCTION public.top_players(p_section text, p_period text DEFAULT '')
RETURNS TABLE(id uuid, name text, photo_url text, male boolean, score bigint, rank bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
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
REVOKE ALL ON FUNCTION public.top_players(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.top_players(text, text) TO authenticated;

CREATE TABLE public.achievement_acks (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  level integer NOT NULL,
  acknowledged_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id, level)
);
GRANT SELECT ON public.achievement_acks TO authenticated;
GRANT ALL ON public.achievement_acks TO service_role;
ALTER TABLE public.achievement_acks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own acks read" ON public.achievement_acks FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Levels from trusted counters and the original thresholds (assets.json counters).
CREATE OR REPLACE FUNCTION public.my_achievements()
RETURNS TABLE(achievement_id text, level integer, acknowledged_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
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
REVOKE ALL ON FUNCTION public.my_achievements() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.my_achievements() TO authenticated;

CREATE OR REPLACE FUNCTION public.ack_achievement(p_id text, p_level integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM my_achievements() m WHERE m.achievement_id = p_id AND m.level = p_level) THEN RAISE EXCEPTION 'not_completed'; END IF;
  INSERT INTO achievement_acks(user_id, achievement_id, level) VALUES (auth.uid(), p_id, p_level) ON CONFLICT DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.ack_achievement(text, integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.ack_achievement(text, integer) TO authenticated;