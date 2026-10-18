-- Durable music and entry announcements share the room's existing 24-hour chat history.
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS payload jsonb;
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_kind_check;
ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_kind_check
 CHECK (kind IN ('chat','admin_chat','ban','disabled_ban','music','newcomer','birthday'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS newcomer_announced_at timestamptz;
-- Existing players are not newly registered merely because this feature was installed.
UPDATE public.profiles SET newcomer_announced_at = now() WHERE newcomer_announced_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS birthday_chat_once_per_day
 ON public.chat_messages(room_id,user_id,(payload->>'day')) WHERE kind='birthday';

CREATE OR REPLACE FUNCTION public._chat_room_music() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
begin
 if new.music is not null and new.music is distinct from old.music then
  insert into public.chat_messages(room_id,user_id,text,kind,payload,created_at)
   values(new.id,(new.music->>'sender')::uuid,
    coalesce(nullif(left(new.music->'item'->>'title',300),''),'♫'),'music',
    jsonb_build_object('artist',new.music->'item'->>'artist','title',new.music->'item'->>'title','key',new.music->'key'),
    coalesce((new.music->>'started_at')::timestamptz,now()));
 end if;
 return new;
end $$;
REVOKE ALL ON FUNCTION public._chat_room_music() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER chat_room_music AFTER UPDATE OF music ON public.rooms
 FOR EACH ROW EXECUTE FUNCTION public._chat_room_music();

CREATE OR REPLACE FUNCTION public._chat_entry_announcements() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
declare p public.profiles; today date := (now() at time zone 'Asia/Baku')::date;
begin
 select * into p from public.profiles where id=new.user_id for update;
 if p.newcomer_announced_at is null then
  update public.profiles set newcomer_announced_at=now() where id=p.id;
  insert into public.chat_messages(room_id,user_id,text,kind) values(new.room_id,p.id,'newcomer','newcomer');
 end if;
 -- Original notifyBirthdays: actual day/month, independent of gender or wallet.
 if p.birthday is not null and to_char(p.birthday,'MM-DD')=to_char(today,'MM-DD') then
  insert into public.chat_messages(room_id,user_id,text,kind,payload)
   values(new.room_id,p.id,'birthday','birthday',jsonb_build_object('day',today::text)) on conflict do nothing;
 end if;
 return new;
end $$;
REVOKE ALL ON FUNCTION public._chat_entry_announcements() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER chat_entry_announcements AFTER INSERT ON public.room_players
 FOR EACH ROW EXECUTE FUNCTION public._chat_entry_announcements();
