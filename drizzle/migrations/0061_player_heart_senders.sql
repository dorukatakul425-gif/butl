-- Profile likes are not tracked; show distinct recent gift senders instead.
CREATE INDEX IF NOT EXISTS gift_events_receiver_recent_idx ON public.gift_events(receiver_id, created_at DESC);
CREATE OR REPLACE FUNCTION public.player_heart_senders(p_user uuid)
RETURNS TABLE(id uuid, name text, photo_url text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  RETURN QUERY SELECT p.id, p.name, p.photo_url
  FROM (SELECT e.sender_id, max(e.created_at) latest FROM gift_events e
        WHERE e.receiver_id = p_user AND e.sender_id <> p_user
        GROUP BY e.sender_id ORDER BY max(e.created_at) DESC, e.sender_id LIMIT 20) s
  JOIN profiles p ON p.id = s.sender_id ORDER BY s.latest DESC, s.sender_id;
END $$;
REVOKE ALL ON FUNCTION public.player_heart_senders(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.player_heart_senders(uuid) TO authenticated;
