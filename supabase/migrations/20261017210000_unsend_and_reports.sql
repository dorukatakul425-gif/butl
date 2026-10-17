-- Unsend direct messages (soft delete, delivered to both sides as an UPDATE) and user reports for admins.

alter table public.direct_messages add column if not exists deleted_at timestamptz;
do $$ begin
  if exists (select 1 from pg_constraint where conname = 'direct_messages_content_check') then
    alter table public.direct_messages drop constraint direct_messages_content_check;
  end if;
  alter table public.direct_messages add constraint direct_messages_content_check check (
    deleted_at is not null
    or (kind = 'text' and media_path is null and char_length(btrim(body)) between 1 and 1000)
    or (kind in ('image', 'audio') and media_path is not null and char_length(body) <= 1000
        and (duration_ms is null or duration_ms between 0 and 600000))
  );
end $$;

-- Only the sender can unsend; content is wiped so neither side can still read it.
create or replace function public.unsend_message(_id uuid)
returns public.direct_messages language plpgsql security definer set search_path = public as $$
declare r public.direct_messages;
begin
  if auth.uid() is null then raise exception 'not_authenticated' using errcode = '42501'; end if;
  update public.direct_messages
     set deleted_at = now(), body = '', media_path = null, duration_ms = null
   where id = _id and sender_id = auth.uid() and deleted_at is null
   returning * into r;
  if not found then raise exception 'not_allowed' using errcode = '42501'; end if;
  return r;
end $$;
revoke all on function public.unsend_message(uuid) from public, anon;
grant execute on function public.unsend_message(uuid) to authenticated;

drop policy if exists "dm media delete own" on storage.objects;
create policy "dm media delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'dm-media' and (storage.foldername(name))[1] = auth.uid()::text);

-- Reports go to the admin panel; reporters can only file and see their own.
create table if not exists public.user_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('spam', 'harassment', 'inappropriate', 'fake', 'scam', 'other')),
  details text not null default '' check (char_length(details) <= 1000),
  context text not null default 'chat' check (context in ('chat', 'profile')),
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  check (reporter_id <> reported_id)
);
create index if not exists user_reports_status_idx on public.user_reports (status, created_at desc);
grant select on public.user_reports to authenticated;
grant insert (reporter_id, reported_id, category, details, context) on public.user_reports to authenticated;
grant all on public.user_reports to service_role;
alter table public.user_reports enable row level security;
drop policy if exists "reporters file reports" on public.user_reports;
create policy "reporters file reports" on public.user_reports for insert to authenticated
  with check (auth.uid() = reporter_id and status = 'open');
drop policy if exists "reporters see own reports" on public.user_reports;
create policy "reporters see own reports" on public.user_reports for select to authenticated
  using (auth.uid() = reporter_id);
