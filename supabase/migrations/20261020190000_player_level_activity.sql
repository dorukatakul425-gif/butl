-- All-time profile rankings, using the same scores and tie order as Tops.
CREATE OR REPLACE FUNCTION public.player_level_activity(p_user uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  WITH gifts AS (
    SELECT e.sender_id id, sum(g.price)::bigint points
    FROM gift_events e JOIN gift_prices g ON g.gift_type = e.gift_type
    GROUP BY e.sender_id HAVING sum(g.price) > 0
  ), levels AS (
    SELECT g.*, row_number() OVER (ORDER BY g.points DESC, g.id) rank
    FROM gifts g JOIN profiles p ON p.id = g.id
  ), times AS (
    SELECT a.user_id id, sum(a.minutes)::bigint minutes
    FROM activity_minutes a GROUP BY a.user_id HAVING sum(a.minutes) > 0
  ), activity AS (
    SELECT t.*, row_number() OVER (ORDER BY t.minutes DESC, t.id) rank
    FROM times t JOIN profiles p ON p.id = t.id
  )
  SELECT jsonb_build_object('level', least(100, coalesce(l.points, 0) / 1400),
    'level_rank', coalesce(l.rank, 0), 'activity_minutes', coalesce(a.minutes, 0),
    'activity_rank', coalesce(a.rank, 0)) INTO result
  FROM profiles p LEFT JOIN levels l ON l.id = p.id LEFT JOIN activity a ON a.id = p.id
  WHERE p.id = p_user;
  RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.player_level_activity(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.player_level_activity(uuid) TO authenticated;
