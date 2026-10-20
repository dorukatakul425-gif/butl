-- Global (lobby) chat: every signed-in player can read; send with a 3 s slow mode, max 500 chars.
create table if not exists public.global_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 500),
  reply_to uuid references public.global_messages(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists global_messages_created_idx on public.global_messages (created_at desc);
create index if not exists global_messages_sender_idx on public.global_messages (sender_id, created_at desc);
alter table public.global_messages enable row level security;
grant select, delete on public.global_messages to authenticated;
grant insert (body, reply_to) on public.global_messages to authenticated;
grant all on public.global_messages to service_role;
drop policy if exists "global chat readable" on public.global_messages;
create policy "global chat readable" on public.global_messages for select to authenticated using (not public.is_banned(sender_id));
drop policy if exists "global chat own insert" on public.global_messages;
create policy "global chat own insert" on public.global_messages for insert to authenticated with check (auth.uid() = sender_id);
drop policy if exists "global chat own delete" on public.global_messages;
create policy "global chat own delete" on public.global_messages for delete to authenticated using (auth.uid() = sender_id);

create or replace function public._global_chat_slow_mode()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_messages
             where sender_id = new.sender_id and created_at > now() - interval '3 seconds') then
    raise exception 'slow_mode' using errcode = '22023';
  end if;
  return new;
end $$;
drop trigger if exists global_chat_slow_mode on public.global_messages;
create trigger global_chat_slow_mode before insert on public.global_messages
  for each row execute function public._global_chat_slow_mode();

do $$
begin
  if to_regproc('public.reject_banned_writes') is not null then
    drop trigger if exists reject_banned on public.global_messages;
    create trigger reject_banned before insert on public.global_messages for each row execute function public.reject_banned_writes();
  end if;
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'global_messages') then
    alter publication supabase_realtime add table public.global_messages;
  end if;
end $$;
alter table public.global_messages replica identity full;
