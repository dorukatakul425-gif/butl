-- WhatsApp-style statuses (text / image / video) with likes and comments.
-- Statuses are hidden exactly 24 hours after creation (RLS + feed filter) and purged by pg_cron.
-- Idempotent: safe to run on Lovable Cloud and on the self-hosted VPS database.

create table if not exists public.statuses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('text','image','video')),
  body text check (body is null or char_length(body) <= 700),
  media_path text,
  bg text not null default 'emerald' check (char_length(bg) <= 20),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  check ((kind = 'text' and body is not null and char_length(btrim(body)) > 0) or (kind <> 'text' and media_path is not null))
);
create index if not exists statuses_expires_idx on public.statuses (expires_at);
create index if not exists statuses_user_idx on public.statuses (user_id, created_at desc);

create table if not exists public.status_likes (
  status_id uuid not null references public.statuses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (status_id, user_id)
);

create table if not exists public.status_comments (
  id uuid primary key default gen_random_uuid(),
  status_id uuid not null references public.statuses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 300),
  created_at timestamptz not null default now()
);
create index if not exists status_comments_status_idx on public.status_comments (status_id, created_at);

-- Clients can never choose their own lifetime: the server stamps it.
create or replace function public.status_stamp_times() returns trigger
language plpgsql set search_path = public as $$
begin
  new.created_at := now();
  new.expires_at := now() + interval '24 hours';
  return new;
end $$;
drop trigger if exists statuses_stamp_times on public.statuses;
create trigger statuses_stamp_times before insert on public.statuses
for each row execute function public.status_stamp_times();

grant select, insert, delete on public.statuses to authenticated;
grant select, insert, delete on public.status_likes to authenticated;
grant select, insert, delete on public.status_comments to authenticated;
grant all on public.statuses, public.status_likes, public.status_comments to service_role;

alter table public.statuses enable row level security;
alter table public.status_likes enable row level security;
alter table public.status_comments enable row level security;

drop policy if exists "status read live" on public.statuses;
create policy "status read live" on public.statuses for select to authenticated
  using (expires_at > now() or user_id = auth.uid());
drop policy if exists "status insert own" on public.statuses;
create policy "status insert own" on public.statuses for insert to authenticated
  with check (user_id = auth.uid() and (media_path is null or split_part(media_path, '/', 1) = auth.uid()::text));
drop policy if exists "status delete own" on public.statuses;
create policy "status delete own" on public.statuses for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists "status like read" on public.status_likes;
create policy "status like read" on public.status_likes for select to authenticated
  using (exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now()));
drop policy if exists "status like own" on public.status_likes;
create policy "status like own" on public.status_likes for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now()));
drop policy if exists "status unlike own" on public.status_likes;
create policy "status unlike own" on public.status_likes for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists "status comment read" on public.status_comments;
create policy "status comment read" on public.status_comments for select to authenticated
  using (exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now()));
drop policy if exists "status comment own" on public.status_comments;
create policy "status comment own" on public.status_comments for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now()));
drop policy if exists "status comment delete" on public.status_comments;
create policy "status comment delete" on public.status_comments for delete to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.statuses s where s.id = status_id and s.user_id = auth.uid()));

-- Feed with author and counters in one round trip (runs with the caller's RLS).
create or replace function public.status_feed()
returns table (id uuid, user_id uuid, kind text, body text, media_path text, bg text,
  created_at timestamptz, expires_at timestamptz, author_name text, author_photo text,
  like_count bigint, comment_count bigint, liked boolean)
language sql stable security invoker set search_path = public as $$
  select s.id, s.user_id, s.kind, s.body, s.media_path, s.bg, s.created_at, s.expires_at,
    p.name, p.photo_url,
    (select count(*) from public.status_likes l where l.status_id = s.id),
    (select count(*) from public.status_comments c where c.status_id = s.id),
    exists (select 1 from public.status_likes l where l.status_id = s.id and l.user_id = auth.uid())
  from public.statuses s join public.profiles p on p.id = s.user_id
  where s.expires_at > now()
  order by s.created_at desc
  limit 300;
$$;
revoke execute on function public.status_feed() from public, anon;
grant execute on function public.status_feed() to authenticated;

-- Private media bucket: 50 MB, images and videos only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('statuses', 'statuses', false, 52428800,
  array['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do nothing;

drop policy if exists "status media read" on storage.objects;
create policy "status media read" on storage.objects for select to authenticated
  using (bucket_id = 'statuses' and (split_part(name, '/', 1) = auth.uid()::text
    or exists (select 1 from public.statuses s where s.media_path = name and s.expires_at > now())));
drop policy if exists "status media write own" on storage.objects;
create policy "status media write own" on storage.objects for insert to authenticated
  with check (bucket_id = 'statuses' and split_part(name, '/', 1) = auth.uid()::text);
drop policy if exists "status media delete own" on storage.objects;
create policy "status media delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'statuses' and split_part(name, '/', 1) = auth.uid()::text);

-- Automatic purge of expired statuses (and their media rows).
create or replace function public.purge_expired_statuses() returns void
language plpgsql security definer set search_path = public as $$
begin
  begin
    perform set_config('storage.allow_delete_query', 'true', true);
    delete from storage.objects o using public.statuses s
      where o.bucket_id = 'statuses' and o.name = s.media_path and s.expires_at < now();
  exception when others then null;
  end;
  delete from public.statuses where expires_at < now();
end $$;
revoke execute on function public.purge_expired_statuses() from public, anon, authenticated;

do $$
begin
  create extension if not exists pg_cron;
  perform cron.unschedule(jobid) from cron.job where jobname = 'purge-expired-statuses';
  perform cron.schedule('purge-expired-statuses', '*/10 * * * *', 'select public.purge_expired_statuses()');
exception when others then
  raise notice 'pg_cron unavailable, statuses still hide after 24h: %', sqlerrm;
end $$;
