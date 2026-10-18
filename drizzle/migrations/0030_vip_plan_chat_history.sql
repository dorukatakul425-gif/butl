-- VIP: remember which plan (vip7/vip30) was bought last so the bank shows its countdown.
-- Buying again stacks onto the remaining time; once vip_until passes every VIP check fails.
alter table public.profiles add column if not exists vip_plan text;

CREATE OR REPLACE FUNCTION public.buy_vip(p_option text)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); pk record; till timestamptz;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO pk FROM vip_packages WHERE id = p_option;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  UPDATE profiles SET dat = dat - pk.price, vip_plan = p_option,
    vip_until = greatest(coalesce(vip_until, now()), now()) + make_interval(days => pk.days)
  WHERE id = uid AND dat >= pk.price RETURNING vip_until INTO till;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  RETURN till;
END $$;
REVOKE ALL ON FUNCTION public.buy_vip(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.buy_vip(text) TO authenticated;

-- Table chat history: messages stay readable for 24 hours (page reloads keep them).
create index if not exists chat_messages_room_created_idx on public.chat_messages (room_id, created_at desc);
