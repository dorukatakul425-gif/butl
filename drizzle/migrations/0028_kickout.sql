-- Telegram client 1.6.393: 30-second pending kick, 15-minute same-table ban.
-- Price and free cooldown are server-fed and absent from the archive. Do not guess them.
CREATE TABLE public.kickout_config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  paid_price integer CHECK (paid_price >= 0),
  free_cooldown_seconds integer CHECK (free_cooldown_seconds > 0),
  kick_delay_seconds integer NOT NULL DEFAULT 30 CHECK (kick_delay_seconds = 30),
  ban_seconds integer NOT NULL DEFAULT 900 CHECK (ban_seconds = 900)
);
GRANT SELECT ON public.kickout_config TO authenticated;
GRANT ALL ON public.kickout_config TO service_role;
ALTER TABLE public.kickout_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY kickout_config_read ON public.kickout_config FOR SELECT TO authenticated USING (true);
INSERT INTO public.kickout_config(id) VALUES (true);
CREATE TABLE public.kickout_usage (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_free_at timestamptz
);
GRANT SELECT ON public.kickout_usage TO authenticated;
GRANT ALL ON public.kickout_usage TO service_role;
ALTER TABLE public.kickout_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY kickout_usage_own ON public.kickout_usage FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE TABLE public.kickout_targets (
  room_id bigint NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kicked_by uuid NOT NULL REFERENCES public.profiles(id),
  kick_at timestamptz NOT NULL,
  blocked_until timestamptz NOT NULL,
  PRIMARY KEY(room_id, user_id)
);
GRANT SELECT ON public.kickout_targets TO authenticated;
GRANT ALL ON public.kickout_targets TO service_role;
ALTER TABLE public.kickout_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY kickout_targets_read ON public.kickout_targets FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR EXISTS(SELECT 1 FROM public.room_players rp WHERE rp.room_id = kickout_targets.room_id AND rp.user_id = auth.uid())
);

-- Finalize on the existing 2-second room pulse; joining also checks expired/pending kicks.
CREATE FUNCTION public._kickout_finalize(p_room bigint) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Delete first: the existing departure trigger may call room_tick recursively.
  -- No tick hook is installed, so this never recurses into this finalizer.
  DELETE FROM public.room_players rp USING public.kickout_targets k
    WHERE rp.room_id=k.room_id AND rp.user_id=k.user_id AND k.room_id=p_room AND k.kick_at<=now() AND k.blocked_until>now();
END $$;
REVOKE ALL ON FUNCTION public._kickout_finalize(bigint) FROM public, anon, authenticated;

CREATE FUNCTION public.kickout_refresh() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); rid bigint; cfg public.kickout_config; vip boolean; last_free timestamptz; free_at timestamptz; target_map jsonb;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not signed in'; END IF;
  SELECT room_id INTO rid FROM public.room_players WHERE user_id=uid;
  IF rid IS NOT NULL THEN PERFORM public._kickout_finalize(rid); END IF;
  SELECT * INTO cfg FROM public.kickout_config WHERE id;
  IF cfg.paid_price IS NULL OR cfg.free_cooldown_seconds IS NULL THEN RETURN jsonb_build_object('configured',false); END IF;
  SELECT coalesce(vip_until>now(),false) INTO vip FROM public.profiles WHERE id=uid;
  SELECT last_free_at INTO last_free FROM public.kickout_usage WHERE user_id=uid;
  free_at := coalesce(last_free + make_interval(secs=>cfg.free_cooldown_seconds::double precision / CASE WHEN vip THEN 2 ELSE 1 END),now());
  SELECT coalesce(jsonb_object_agg(rp.user_id::text,
    CASE WHEN k.kick_at>now() THEN jsonb_build_object('kickAt',extract(epoch from k.kick_at)*1000) ELSE '{}'::jsonb END),'{}'::jsonb)
    INTO target_map FROM public.room_players rp LEFT JOIN public.kickout_targets k ON k.room_id=rp.room_id AND k.user_id=rp.user_id WHERE rp.room_id=rid;
  RETURN jsonb_build_object('configured',true,'price',CASE WHEN free_at<=now() THEN 0 ELSE cfg.paid_price END,'vip',vip,
    'freeAt',extract(epoch from free_at)*1000,'lastFreeAt',extract(epoch from last_free)*1000,'targets',target_map);
END $$;
REVOKE ALL ON FUNCTION public.kickout_refresh() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.kickout_refresh() TO authenticated;

CREATE FUNCTION public.kickout_action(p_user uuid,p_action text,p_expected_price integer) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid:=auth.uid(); rid bigint; cfg public.kickout_config; me public.profiles; k public.kickout_targets; last_free timestamptz; free_at timestamptz; price integer; vip boolean;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not signed in'; END IF;
  IF p_action NOT IN ('kick','save') THEN RAISE EXCEPTION 'invalid action'; END IF;
  SELECT * INTO cfg FROM public.kickout_config WHERE id;
  IF cfg.paid_price IS NULL OR cfg.free_cooldown_seconds IS NULL THEN RAISE EXCEPTION 'kickout_not_configured'; END IF;
  SELECT room_id INTO rid FROM public.room_players WHERE user_id=uid;
  IF rid IS NULL THEN RAISE EXCEPTION 'not_at_table'; END IF;
  -- All kicks/saves in one room serialize before balance/deadline checks.
  PERFORM 1 FROM public.rooms WHERE id=rid FOR UPDATE;
  PERFORM public._kickout_finalize(rid);
  IF NOT EXISTS(SELECT 1 FROM public.room_players WHERE user_id=uid AND room_id=rid) THEN RAISE EXCEPTION 'not_at_table'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.room_players WHERE user_id=p_user AND room_id=rid) THEN RAISE EXCEPTION 'target_not_at_table'; END IF;
  SELECT * INTO me FROM public.profiles WHERE id=uid FOR UPDATE;
  vip := coalesce(me.vip_until>now(),false);
  IF p_action='kick' AND uid=p_user THEN RAISE EXCEPTION 'cannot_kick_self'; END IF;
  IF NOT vip AND NOT(p_action='save' AND uid=p_user) THEN RAISE EXCEPTION 'vip_required'; END IF;
  SELECT * INTO k FROM public.kickout_targets WHERE room_id=rid AND user_id=p_user FOR UPDATE;
  IF p_action='kick' AND k.kick_at>now() THEN RAISE EXCEPTION 'already_kicked'; END IF;
  IF p_action='save' AND (k.kick_at IS NULL OR k.kick_at<=now()) THEN RAISE EXCEPTION 'already_saved'; END IF;
  INSERT INTO public.kickout_usage(user_id) VALUES(uid) ON CONFLICT DO NOTHING;
  SELECT last_free_at INTO last_free FROM public.kickout_usage WHERE user_id=uid FOR UPDATE;
  free_at := coalesce(last_free + make_interval(secs=>cfg.free_cooldown_seconds::double precision / CASE WHEN vip THEN 2 ELSE 1 END),now());
  price:=CASE WHEN free_at<=now() THEN 0 ELSE cfg.paid_price END;
  IF p_expected_price IS DISTINCT FROM price THEN RAISE EXCEPTION 'price_changed'; END IF;
  IF me.gold<price THEN RAISE EXCEPTION 'not_enough_gold'; END IF;
  UPDATE public.profiles SET gold=gold-price WHERE id=uid;
  IF free_at<=now() THEN UPDATE public.kickout_usage SET last_free_at=now() WHERE user_id=uid; END IF;
  IF p_action='kick' THEN
    INSERT INTO public.kickout_targets(room_id,user_id,kicked_by,kick_at,blocked_until)
      VALUES(rid,p_user,uid,now()+make_interval(secs=>cfg.kick_delay_seconds),now()+make_interval(secs=>cfg.kick_delay_seconds+cfg.ban_seconds))
      ON CONFLICT(room_id,user_id) DO UPDATE SET kicked_by=uid,kick_at=excluded.kick_at,blocked_until=excluded.blocked_until;
  ELSE DELETE FROM public.kickout_targets WHERE room_id=rid AND user_id=p_user;
  END IF;
  RETURN public.kickout_refresh();
END $$;
REVOKE ALL ON FUNCTION public.kickout_action(uuid,text,integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.kickout_action(uuid,text,integer) TO authenticated;

-- Every entry path (join_room/change_table/direct service insert) honors the same room ban.
CREATE FUNCTION public._kickout_guard_membership() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS(SELECT 1 FROM public.kickout_targets WHERE user_id=NEW.user_id AND room_id=NEW.room_id AND kick_at<=now() AND blocked_until>now()) THEN
    RAISE EXCEPTION 'kickout_room_blocked';
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public._kickout_guard_membership() FROM public, anon, authenticated;
CREATE TRIGGER kickout_membership_guard BEFORE INSERT OR UPDATE OF room_id ON public.room_players FOR EACH ROW EXECUTE FUNCTION public._kickout_guard_membership();
ALTER TABLE public.kickout_targets REPLICA IDENTITY FULL;
DO $$ BEGIN
  IF NOT EXISTS(SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='kickout_targets') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.kickout_targets;
  END IF;
END $$;
