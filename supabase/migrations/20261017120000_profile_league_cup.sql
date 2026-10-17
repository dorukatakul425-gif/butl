-- Profile popup league cup (original formatUser): user_profile_stats now returns the
-- player's league level so the popup can show leagues[level].image once total_kisses >= 100.
-- Also lifts every player to at least 100 received kisses so league entry can be tested.
-- Idempotent: safe on Lovable Cloud and on the VPS database.

UPDATE public.profiles SET kisses = 100 WHERE coalesce(kisses, 0) < 100;

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
    'league', coalesce((SELECT level FROM league_players WHERE user_id = p_user), 0),
    'harem_price', hp, 'harem_price_rank', CASE WHEN hp > 0 THEN hpr END,
    'owner', CASE WHEN o.id IS NULL THEN NULL ELSE jsonb_build_object('id', o.id, 'name', o.name, 'male', o.male, 'photo_url', o.photo_url) END);
END $$;
REVOKE ALL ON FUNCTION public.user_profile_stats(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.user_profile_stats(uuid) TO authenticated;
