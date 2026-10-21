-- Cosmetic identity grants never imply an admin/moderator role or VIP membership.
CREATE TABLE public.player_name_styles (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  name_style text NOT NULL DEFAULT 'default' CHECK (name_style IN ('default','ruby','emerald','sapphire','gold','rose','rainbow')),
  creator boolean NOT NULL DEFAULT false,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.player_name_styles TO authenticated;
GRANT ALL ON public.player_name_styles TO service_role;
ALTER TABLE public.player_name_styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY name_styles_read ON public.player_name_styles FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.admin_set_name_style(p_user uuid, p_style text, p_creator boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'İcazə yoxdur'; END IF;
  IF p_style IS NULL OR p_creator IS NULL OR p_style NOT IN ('default','ruby','emerald','sapphire','gold','rose','rainbow') THEN RAISE EXCEPTION 'Etibarsız ad üslubu'; END IF;
  INSERT INTO public.player_name_styles(user_id,name_style,creator,updated_by)
    VALUES(p_user,p_style,p_creator,auth.uid())
    ON CONFLICT(user_id) DO UPDATE SET name_style=EXCLUDED.name_style, creator=EXCLUDED.creator, updated_by=auth.uid(), updated_at=now();
END $$;
REVOKE ALL ON FUNCTION public.admin_set_name_style(uuid,text,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_name_style(uuid,text,boolean) TO authenticated;

-- A latest-revision row supports realtime plus reconnect recovery without replaying old requests to new documents.
CREATE TABLE public.site_refresh_requests (
  singleton smallint PRIMARY KEY CHECK(singleton = 1),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.site_refresh_requests TO authenticated;
GRANT ALL ON public.site_refresh_requests TO service_role;
ALTER TABLE public.site_refresh_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY refresh_requests_read ON public.site_refresh_requests FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.admin_request_site_refresh()
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE revision uuid := gen_random_uuid();
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'İcazə yoxdur'; END IF;
  INSERT INTO public.site_refresh_requests(singleton,id,created_at,created_by) VALUES(1,revision,clock_timestamp(),auth.uid())
    ON CONFLICT(singleton) DO UPDATE SET id=EXCLUDED.id, created_at=EXCLUDED.created_at, created_by=EXCLUDED.created_by;
  RETURN revision;
END $$;
REVOKE ALL ON FUNCTION public.admin_request_site_refresh() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_request_site_refresh() TO authenticated;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname='supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.player_name_styles, public.site_refresh_requests;
  END IF;
END $$;
NOTIFY pgrst, 'reload schema';