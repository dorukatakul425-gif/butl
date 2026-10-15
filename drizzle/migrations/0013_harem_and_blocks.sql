ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS harem_owner uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS harem_value integer NOT NULL DEFAULT 0;

CREATE TABLE public.user_blocks (
  blocker uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker, blocked)
);
GRANT SELECT ON public.user_blocks TO authenticated;
GRANT ALL ON public.user_blocks TO service_role;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own blocks read" ON public.user_blocks FOR SELECT TO authenticated USING (blocker = auth.uid());
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_blocks;

CREATE OR REPLACE FUNCTION public.block_user(p_user uuid, p_block boolean DEFAULT true)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF p_user = auth.uid() THEN RETURN; END IF;
  IF p_block THEN INSERT INTO user_blocks(blocker, blocked) VALUES (auth.uid(), p_user) ON CONFLICT DO NOTHING;
  ELSE DELETE FROM user_blocks WHERE blocker = auth.uid() AND blocked = p_user; END IF;
END $$;
REVOKE ALL ON FUNCTION public.block_user(uuid, boolean) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.block_user(uuid, boolean) TO authenticated;

-- Original formatHarem: the purchase costs current price + 1, which becomes the new price.
CREATE OR REPLACE FUNCTION public.harem_purchase(p_target uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); t profiles; cost int; g int;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO t FROM profiles WHERE id = p_target FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_user'; END IF;
  IF t.harem_owner = uid THEN RAISE EXCEPTION 'already_owner'; END IF;
  IF p_target = uid AND t.harem_owner IS NULL THEN RAISE EXCEPTION 'no_owner'; END IF;
  cost := t.harem_value + 1;
  UPDATE profiles SET gold = gold - cost WHERE id = uid AND gold >= cost RETURNING gold INTO g;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_enough_gold'; END IF;
  UPDATE profiles SET harem_value = cost, harem_owner = CASE WHEN p_target = uid THEN NULL ELSE uid END WHERE id = p_target;
  RETURN jsonb_build_object('price', cost, 'gold', g);
END $$;
REVOKE ALL ON FUNCTION public.harem_purchase(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.harem_purchase(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.user_profile_stats(p_user uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE k bigint; kr bigint; g bigint; gr bigint; pr int; prr bigint; hp bigint; hpr bigint; o profiles; own uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT kisses, harem_value, harem_owner INTO k, pr, own FROM profiles WHERE id = p_user;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT count(*) + 1 INTO kr FROM profiles WHERE kisses > k;
  SELECT count(*) INTO g FROM gesture_events WHERE sender_id = p_user;
  SELECT count(*) + 1 INTO gr FROM (SELECT sender_id FROM gesture_events GROUP BY sender_id HAVING count(*) > g) s;
  SELECT count(*) + 1 INTO prr FROM profiles WHERE harem_value > pr;
  SELECT coalesce(sum(harem_value), 0) INTO hp FROM profiles WHERE harem_owner = p_user;
  SELECT count(*) + 1 INTO hpr FROM (SELECT harem_owner FROM profiles WHERE harem_owner IS NOT NULL GROUP BY harem_owner HAVING sum(harem_value) > hp) s;
  IF own IS NOT NULL THEN SELECT * INTO o FROM profiles WHERE id = own; END IF;
  RETURN jsonb_build_object(
    'total_kisses', k, 'total_kisses_rank', CASE WHEN k > 0 THEN kr END,
    'gestures', g, 'gestures_rank', CASE WHEN g > 0 THEN gr END,
    'dj_score', 0, 'price', pr, 'price_rank', CASE WHEN pr > 0 THEN prr END,
    'harem_price', hp, 'harem_price_rank', CASE WHEN hp > 0 THEN hpr END,
    'owner', CASE WHEN o.id IS NULL THEN NULL ELSE jsonb_build_object('id', o.id, 'name', o.name, 'male', o.male, 'photo_url', o.photo_url) END);
END $$;