-- Private chat from the profile popup: only sender and receiver can read the row (and receive it live).
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;
DROP POLICY IF EXISTS "chat read own room" ON public.chat_messages;
CREATE POLICY "chat read own room" ON public.chat_messages FOR SELECT TO authenticated USING (
  room_id = public.my_room() AND (NOT is_private OR user_id = auth.uid() OR receiver_id = auth.uid())
);

DROP FUNCTION IF EXISTS public.send_chat(text, uuid);
CREATE FUNCTION public.send_chat(p_text text, p_receiver uuid DEFAULT NULL, p_private boolean DEFAULT false) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE rid bigint;
BEGIN
  SELECT room_id INTO rid FROM public.room_players WHERE user_id = auth.uid();
  IF rid IS NULL THEN RAISE EXCEPTION 'not seated'; END IF;
  IF p_private AND (p_receiver IS NULL OR p_receiver = auth.uid()) THEN RAISE EXCEPTION 'private_needs_receiver'; END IF;
  IF p_private AND NOT EXISTS(SELECT 1 FROM public.room_players WHERE user_id = p_receiver AND room_id = rid) THEN RAISE EXCEPTION 'receiver_not_at_table'; END IF;
  INSERT INTO public.chat_messages(room_id, user_id, receiver_id, text, is_private)
    VALUES (rid, auth.uid(), p_receiver, left(trim(p_text), 300), coalesce(p_private, false));
END $$;
REVOKE ALL ON FUNCTION public.send_chat(text, uuid, boolean) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.send_chat(text, uuid, boolean) TO authenticated;

-- Telegram user_kickout / user_save / user_kicked: every player at the table sees the boot, shield and chat line.
CREATE TABLE IF NOT EXISTS public.kickout_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id bigint NOT NULL,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('kick','save','kicked')),
  kick_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kickout_events_room_idx ON public.kickout_events(room_id, created_at);
GRANT SELECT ON public.kickout_events TO authenticated;
GRANT ALL ON public.kickout_events TO service_role;
ALTER TABLE public.kickout_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY kickout_events_read ON public.kickout_events FOR SELECT TO authenticated USING (
  target_id = auth.uid() OR EXISTS(SELECT 1 FROM public.room_players rp WHERE rp.room_id = kickout_events.room_id AND rp.user_id = auth.uid())
);

CREATE OR REPLACE FUNCTION public._kickout_target_event() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.kick_at > now() THEN
      INSERT INTO public.kickout_events(room_id, actor_id, target_id, kind) VALUES (OLD.room_id, coalesce(auth.uid(), OLD.user_id), OLD.user_id, 'save');
    END IF;
    RETURN OLD;
  END IF;
  IF NEW.kick_at > now() THEN
    INSERT INTO public.kickout_events(room_id, actor_id, target_id, kind, kick_at) VALUES (NEW.room_id, NEW.kicked_by, NEW.user_id, 'kick', NEW.kick_at);
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public._kickout_target_event() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS kickout_target_event ON public.kickout_targets;
CREATE TRIGGER kickout_target_event AFTER INSERT OR UPDATE OF kick_at OR DELETE ON public.kickout_targets FOR EACH ROW EXECUTE FUNCTION public._kickout_target_event();

CREATE OR REPLACE FUNCTION public._kickout_removed_event() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE k public.kickout_targets;
BEGIN
  SELECT * INTO k FROM public.kickout_targets WHERE room_id = OLD.room_id AND user_id = OLD.user_id AND kick_at <= now() AND blocked_until > now();
  IF FOUND THEN
    INSERT INTO public.kickout_events(room_id, actor_id, target_id, kind) VALUES (OLD.room_id, k.kicked_by, OLD.user_id, 'kicked');
  END IF;
  RETURN OLD;
END $$;
REVOKE ALL ON FUNCTION public._kickout_removed_event() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS kickout_removed_event ON public.room_players;
CREATE TRIGGER kickout_removed_event AFTER DELETE ON public.room_players FOR EACH ROW EXECUTE FUNCTION public._kickout_removed_event();

DO $$ BEGIN
  IF NOT EXISTS(SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='kickout_events') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.kickout_events;
  END IF;
END $$;
