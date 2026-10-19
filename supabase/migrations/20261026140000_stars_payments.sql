-- Telegram Stars ile kalp satışı: paketler Ciliz Telegram sürümüyle birebir aynı.
CREATE TABLE public.star_packages (stars integer PRIMARY KEY, gold integer NOT NULL, bonus integer NOT NULL DEFAULT 0);
GRANT SELECT ON public.star_packages TO anon, authenticated;
GRANT ALL ON public.star_packages TO service_role;
ALTER TABLE public.star_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "star packages read" ON public.star_packages FOR SELECT USING (true);
INSERT INTO public.star_packages(stars, gold, bonus) VALUES
  (50,50,0),(250,250,0),(500,500,0),(1000,1000,200),(2500,2500,625),(5000,5000,2000);

-- Ödenen faturalar: aynı charge_id iki kez yazılamaz (Telegram tekrar gönderse bile kalp iki kez eklenmez).
CREATE TABLE public.stars_purchases (
  charge_id text PRIMARY KEY,
  telegram_id bigint NOT NULL,
  stars integer NOT NULL,
  gold integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.stars_purchases TO service_role;
ALTER TABLE public.stars_purchases ENABLE ROW LEVEL SECURITY;

-- Bot, successful_payment alınca bunu çağırır. Döndürdüğü sayı: eklenen kalp (tekrarda 0).
CREATE OR REPLACE FUNCTION public.credit_stars_purchase(p_telegram_id bigint, p_stars integer, p_charge_id text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pk record; got integer; uid uuid;
BEGIN
  SELECT * INTO pk FROM star_packages WHERE stars = p_stars;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  SELECT id INTO uid FROM profiles WHERE telegram_id = p_telegram_id;
  IF uid IS NULL THEN RAISE EXCEPTION 'unknown_player'; END IF;
  got := pk.gold + pk.bonus;
  INSERT INTO stars_purchases(charge_id, telegram_id, stars, gold) VALUES (p_charge_id, p_telegram_id, p_stars, got)
    ON CONFLICT (charge_id) DO NOTHING;
  IF NOT FOUND THEN RETURN 0; END IF;
  UPDATE profiles SET gold = gold + got WHERE id = uid;
  RETURN got;
END $$;
REVOKE ALL ON FUNCTION public.credit_stars_purchase(bigint, integer, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.credit_stars_purchase(bigint, integer, text) TO service_role;
