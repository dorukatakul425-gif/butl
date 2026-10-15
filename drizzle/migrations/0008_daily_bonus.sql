ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_bonus_day integer NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_bonus_on date;

-- DailyBonusPresenter: server sends gold_daily {day, gold_diff}; days 1..5 award 1..5 hearts.
CREATE OR REPLACE FUNCTION public.claim_daily_bonus()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); p record; today date := (now() AT TIME ZONE 'utc')::date; d integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT daily_bonus_day, daily_bonus_on INTO p FROM profiles WHERE id = uid FOR UPDATE;
  IF NOT FOUND OR p.daily_bonus_on = today THEN RETURN NULL; END IF;
  d := CASE WHEN p.daily_bonus_on = today - 1 THEN LEAST(p.daily_bonus_day + 1, 5) ELSE 1 END;
  UPDATE profiles SET daily_bonus_day = d, daily_bonus_on = today, gold = gold + d WHERE id = uid;
  RETURN jsonb_build_object('id', uid::text || ':' || today::text, 'day', d, 'gold_diff', d);
END $$;
REVOKE ALL ON FUNCTION public.claim_daily_bonus() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.claim_daily_bonus() TO authenticated;