ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dat integer NOT NULL DEFAULT 10000;

CREATE TABLE public.gold_packages (real integer PRIMARY KEY, gold integer NOT NULL, bonus integer NOT NULL DEFAULT 0);
GRANT SELECT ON public.gold_packages TO anon, authenticated;
GRANT ALL ON public.gold_packages TO service_role;
ALTER TABLE public.gold_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gold packages read" ON public.gold_packages FOR SELECT USING (true);
INSERT INTO public.gold_packages(real, gold, bonus) VALUES (10,10,0),(50,50,0),(100,100,10),(200,200,40),(500,500,150),(1000,1000,350),(5000,5000,1750);

CREATE TABLE public.vip_packages (id text PRIMARY KEY, price integer NOT NULL, days integer NOT NULL);
GRANT SELECT ON public.vip_packages TO anon, authenticated;
GRANT ALL ON public.vip_packages TO service_role;
ALTER TABLE public.vip_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vip packages read" ON public.vip_packages FOR SELECT USING (true);
INSERT INTO public.vip_packages(id, price, days) VALUES ('vip7',120,7),('vip30',390,30);

CREATE OR REPLACE FUNCTION public.buy_gold(p_real integer)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); pk record; got integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO pk FROM gold_packages WHERE real = p_real;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  got := pk.gold + pk.bonus;
  UPDATE profiles SET dat = dat - pk.real, gold = gold + got WHERE id = uid AND dat >= pk.real;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  RETURN got;
END $$;
REVOKE ALL ON FUNCTION public.buy_gold(integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.buy_gold(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.buy_vip(p_option text)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); pk record; till timestamptz;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO pk FROM vip_packages WHERE id = p_option;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  UPDATE profiles SET dat = dat - pk.price,
    vip_until = greatest(coalesce(vip_until, now()), now()) + make_interval(days => pk.days)
  WHERE id = uid AND dat >= pk.price RETURNING vip_until INTO till;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  RETURN till;
END $$;
REVOKE ALL ON FUNCTION public.buy_vip(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.buy_vip(text) TO authenticated;