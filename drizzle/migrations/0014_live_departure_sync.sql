CREATE OR REPLACE FUNCTION public._sync_departed_room()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.room_tick(OLD.room_id);
  ELSIF OLD.room_id IS DISTINCT FROM NEW.room_id THEN
    PERFORM public.room_tick(OLD.room_id);
  END IF;
  RETURN NULL;
END $$;
REVOKE ALL ON FUNCTION public._sync_departed_room() FROM public, anon, authenticated;
CREATE TRIGGER room_players_departure AFTER DELETE OR UPDATE OF room_id ON public.room_players FOR EACH ROW EXECUTE FUNCTION public._sync_departed_room();
ALTER TABLE public.room_players REPLICA IDENTITY FULL;
ALTER TABLE public.user_blocks REPLICA IDENTITY FULL;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['rooms','room_players','profiles','chat_messages','gift_events','gesture_events','user_blocks'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;