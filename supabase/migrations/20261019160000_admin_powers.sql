-- Admin powers 1:1 with the original: green admin_chat announcements and
-- ban / disabled_ban system lines in the room chat.
alter table public.chat_messages add column if not exists kind text not null default 'chat';
alter table public.chat_messages drop constraint if exists chat_messages_kind_check;
alter table public.chat_messages add constraint chat_messages_kind_check
  check (kind in ('chat', 'admin_chat', 'ban', 'disabled_ban'));

-- Green announcement into any room's chat (original: admin_chat, color 6fbf5c).
create or replace function public.admin_broadcast(p_room bigint, p_text text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  if not exists (select 1 from public.rooms where id = p_room) then raise exception 'no room'; end if;
  if char_length(trim(p_text)) < 1 then raise exception 'empty'; end if;
  insert into public.chat_messages(room_id, user_id, text, kind)
  values (p_room, auth.uid(), left(trim(p_text), 300), 'admin_chat');
end $$;
revoke all on function public.admin_broadcast(bigint, text) from public, anon;
grant execute on function public.admin_broadcast(bigint, text) to authenticated;
