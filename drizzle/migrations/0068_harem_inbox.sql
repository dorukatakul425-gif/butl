-- Durable, recipient-scoped original HaremPurchase inbox; no gift-heart awards.
ALTER TABLE public.profile_notifications ADD COLUMN IF NOT EXISTS payload jsonb;
ALTER TABLE public.profile_notifications ADD COLUMN IF NOT EXISTS read_at timestamptz;
CREATE INDEX IF NOT EXISTS profile_notifications_unread_idx
  ON public.profile_notifications(user_id, id) WHERE read_at IS NULL;

CREATE OR REPLACE FUNCTION public.acknowledge_harem_notice(p_id bigint) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  UPDATE public.profile_notifications SET read_at = coalesce(read_at, now())
    WHERE id = p_id AND user_id = auth.uid() AND payload->>'type' = 'harem_purchase';
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_notice'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.acknowledge_harem_notice(bigint) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.acknowledge_harem_notice(bigint) TO authenticated;

CREATE OR REPLACE FUNCTION public.harem_purchase(p_target uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid(); t profiles; buyer profiles; previous profiles;
  cost integer; g integer; new_owner uuid; event jsonb;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  -- Deterministic lock order serializes wallet/target mutations, including reciprocal buys.
  PERFORM id FROM profiles WHERE id IN (uid, p_target) ORDER BY id FOR UPDATE;
  SELECT * INTO t FROM profiles WHERE id = p_target;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_user'; END IF;
  SELECT * INTO buyer FROM profiles WHERE id = uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_user'; END IF;
  IF t.harem_owner = uid THEN RAISE EXCEPTION 'already_owner'; END IF;
  IF p_target = uid AND t.harem_owner IS NULL THEN RAISE EXCEPTION 'no_owner'; END IF;
  cost := t.harem_value + 1;
  UPDATE profiles SET gold = gold - cost WHERE id = uid AND gold >= cost RETURNING gold INTO g;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_enough_gold'; END IF;
  new_owner := CASE WHEN p_target = uid THEN NULL ELSE uid END;
  UPDATE profiles SET harem_value = cost, harem_owner = new_owner WHERE id = p_target;
  SELECT * INTO previous FROM profiles WHERE id = coalesce(t.harem_owner, p_target);
  event := jsonb_build_object(
    'type', 'harem_purchase', 'price', cost,
    'target', jsonb_build_object('id', t.id, 'name', t.name, 'male', t.male, 'photoUrl', t.photo_url),
    'newOwner', jsonb_build_object('id', buyer.id, 'name', buyer.name, 'male', buyer.male, 'photoUrl', buyer.photo_url),
    'oldOwner', jsonb_build_object('id', previous.id, 'name', previous.name, 'male', previous.male, 'photoUrl', previous.photo_url));
  IF p_target <> uid THEN
    INSERT INTO profile_notifications(user_id, actor_id, kind, body, payload)
    VALUES (p_target, uid, 'harem_admired',
      coalesce(buyer.name, '') || CASE WHEN t.harem_owner IS NULL
        THEN ' səni valeh etməyə başladı'
        ELSE ' səni digər istifadəçidən (' || coalesce(previous.name, '') || ') oğurladı' END, event);
  END IF;
  IF t.harem_owner IS NOT NULL AND t.harem_owner <> uid THEN
    INSERT INTO profile_notifications(user_id, actor_id, kind, body, payload)
    VALUES (t.harem_owner, uid, CASE WHEN p_target = uid THEN 'harem_rejected' ELSE 'harem_stolen' END,
      CASE WHEN p_target = uid THEN coalesce(t.name, '') || ' səni tərk etdi'
        ELSE coalesce(buyer.name, '') || ' digər istifadəçini (' || coalesce(t.name, '') || ') səndən oğurladı' END, event);
  END IF;
  RETURN jsonb_build_object('price', cost, 'gold', g);
END $$;
REVOKE ALL ON FUNCTION public.harem_purchase(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.harem_purchase(uuid) TO authenticated;