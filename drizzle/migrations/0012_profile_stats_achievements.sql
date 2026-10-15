CREATE OR REPLACE FUNCTION public.user_achievements(p_user uuid)
 RETURNS TABLE(achievement_id text, level integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  FOR v IN
    SELECT 'celebrity' a, (SELECT kisses FROM profiles WHERE id = p_user)::bigint n, ARRAY[20,80,250,750,1500] t
    UNION ALL SELECT 'heartofgold', (SELECT count(*) FROM gift_events WHERE sender_id = p_user), ARRAY[25,1000,15000,125000,500000]
    UNION ALL SELECT 'courtesies', (SELECT count(*) FROM gift_events WHERE receiver_id = p_user), ARRAY[50,2000,30000,250000,1000000]
    UNION ALL SELECT 'pantomime', (SELECT count(*) FROM gesture_events WHERE sender_id = p_user), ARRAY[25,1000,15000,125000,500000]
    UNION ALL SELECT 'guru', (SELECT (now()::date - created_at::date) FROM profiles WHERE id = p_user)::bigint, ARRAY[30,90,365]
  LOOP
    FOR i IN 1..array_length(v.t, 1) LOOP
      EXIT WHEN coalesce(v.n, 0) < v.t[i];
      achievement_id := v.a; level := i - 1;
      RETURN NEXT;
    END LOOP;
  END LOOP;
END $function$;

CREATE OR REPLACE FUNCTION public.user_profile_stats(p_user uuid)
 RETURNS jsonb
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE k bigint; kr bigint; g bigint; gr bigint;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT kisses INTO k FROM profiles WHERE id = p_user;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT count(*) + 1 INTO kr FROM profiles WHERE kisses > k;
  SELECT count(*) INTO g FROM gesture_events WHERE sender_id = p_user;
  SELECT count(*) + 1 INTO gr FROM (SELECT sender_id FROM gesture_events GROUP BY sender_id HAVING count(*) > g) s;
  RETURN jsonb_build_object(
    'total_kisses', k, 'total_kisses_rank', CASE WHEN k > 0 THEN kr END,
    'gestures', g, 'gestures_rank', CASE WHEN g > 0 THEN gr END,
    'dj_score', 0, 'price', 0, 'harem_price', 0);
END $function$;

REVOKE ALL ON FUNCTION public.user_achievements(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.user_profile_stats(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.user_achievements(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_profile_stats(uuid) TO authenticated;