-- ureyimsen entrance effect: everyone at the table reads the gift level of players who sit down.
CREATE OR REPLACE FUNCTION public.gift_levels(p_ids uuid[]) RETURNS TABLE(id uuid, points bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  RETURN QUERY SELECT u.uid, public.gift_points_of(u.uid)
    FROM (SELECT DISTINCT x AS uid FROM unnest(p_ids[1:12]) AS x) u;
END $$;
REVOKE ALL ON FUNCTION public.gift_levels(uuid[]) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.gift_levels(uuid[]) TO authenticated;
