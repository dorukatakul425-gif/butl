-- Admin güncəlləmə bildirişi: başlıq və geri sayım saniyəsi (ureyimsen app-update banner).
ALTER TABLE public.site_refresh_requests
  ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT 'Yeni versiya hazırdır',
  ADD COLUMN IF NOT EXISTS countdown integer NOT NULL DEFAULT 10;
ALTER TABLE public.site_refresh_requests DROP CONSTRAINT IF EXISTS site_refresh_countdown_range;
ALTER TABLE public.site_refresh_requests ADD CONSTRAINT site_refresh_countdown_range CHECK (countdown BETWEEN 3 AND 300);
ALTER TABLE public.site_refresh_requests DROP CONSTRAINT IF EXISTS site_refresh_title_len;
ALTER TABLE public.site_refresh_requests ADD CONSTRAINT site_refresh_title_len CHECK (char_length(title) BETWEEN 1 AND 80);

CREATE OR REPLACE FUNCTION public.admin_request_site_refresh(p_title text DEFAULT NULL, p_countdown integer DEFAULT 10)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE revision uuid := gen_random_uuid();
DECLARE t text := COALESCE(NULLIF(btrim(p_title), ''), 'Yeni versiya hazırdır');
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'İcazə yoxdur'; END IF;
  IF char_length(t) > 80 THEN RAISE EXCEPTION 'Başlıq çox uzundur'; END IF;
  IF p_countdown IS NULL OR p_countdown < 3 OR p_countdown > 300 THEN RAISE EXCEPTION 'Geri sayım 3-300 saniyə olmalıdır'; END IF;
  INSERT INTO public.site_refresh_requests(singleton,id,created_at,created_by,title,countdown) VALUES(1,revision,clock_timestamp(),auth.uid(),t,p_countdown)
    ON CONFLICT(singleton) DO UPDATE SET id=EXCLUDED.id, created_at=EXCLUDED.created_at, created_by=EXCLUDED.created_by, title=EXCLUDED.title, countdown=EXCLUDED.countdown;
  RETURN revision;
END $$;
DROP FUNCTION IF EXISTS public.admin_request_site_refresh();
REVOKE ALL ON FUNCTION public.admin_request_site_refresh(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_request_site_refresh(text, integer) TO authenticated;
