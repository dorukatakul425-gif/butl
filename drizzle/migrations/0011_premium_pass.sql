ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_until timestamptz;
CREATE TABLE public.premium_packages (id text PRIMARY KEY, price integer NOT NULL, days integer NOT NULL);
GRANT SELECT ON public.premium_packages TO anon, authenticated;
GRANT ALL ON public.premium_packages TO service_role;
ALTER TABLE public.premium_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "premium packages read" ON public.premium_packages FOR SELECT USING (true);
CREATE OR REPLACE FUNCTION public.buy_premium(p_option text DEFAULT 'pass30')
 RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE uid uuid := auth.uid(); pk record; till timestamptz;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO pk FROM premium_packages WHERE id = p_option;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  UPDATE profiles SET dat = dat - pk.price,
    premium_until = greatest(coalesce(premium_until, now()), now()) + make_interval(days => pk.days)
  WHERE id = uid AND dat >= pk.price RETURNING premium_until INTO till;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  RETURN till;
END $$;
REVOKE EXECUTE ON FUNCTION public.buy_premium(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.buy_premium(text) TO authenticated;