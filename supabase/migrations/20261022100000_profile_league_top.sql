-- TOP uses the current league promotion band; no client-controlled badge.
CREATE OR REPLACE FUNCTION public.profile_league_top(p_user uuid) RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result boolean;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT coalesce(bool_or(ranked.pos <= c.move_up AND ranked.score > 0), false) INTO result
  FROM (
    SELECT m.user_id, m.score, row_number() OVER (PARTITION BY m.round_id ORDER BY m.score DESC, m.joined_at, m.user_id) AS pos
    FROM public.league_members m JOIN public.league_rounds r ON r.id = m.round_id
    WHERE r.state = 'running' AND r.finish_at > now()
  ) ranked CROSS JOIN public.league_config c
  WHERE ranked.user_id = p_user AND public._league_participates(p_user);
  RETURN coalesce(result, false);
END $$;
REVOKE ALL ON FUNCTION public.profile_league_top(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.profile_league_top(uuid) TO authenticated;
NOTIFY pgrst, 'reload schema';
