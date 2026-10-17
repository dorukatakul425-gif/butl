-- New players start with 8 hearts (gold) and 0 DAT. Existing balances are unchanged.
alter table public.profiles alter column gold set default 8;
alter table public.profiles alter column dat set default 0;

-- Status moderation: every new status waits for admin approval before others can see it.
-- Existing statuses stay visible (approved); new rows default to pending.
alter table public.statuses add column if not exists review text not null default 'approved';
alter table public.statuses alter column review set default 'pending';
do $$ begin
  alter table public.statuses add constraint statuses_review_check check (review in ('pending','approved','rejected'));
exception when duplicate_object then null; end $$;
create index if not exists statuses_review_idx on public.statuses (review, created_at);

-- Clients can never approve their own status or choose its lifetime.
create or replace function public.status_stamp_times() returns trigger
language plpgsql set search_path = public as $$
begin
  new.created_at := now();
  new.expires_at := now() + interval '24 hours';
  new.review := 'pending';
  return new;
end $$;

drop policy if exists "status read live" on public.statuses;
create policy "status read live" on public.statuses for select to authenticated
  using ((expires_at > now() and review = 'approved') or user_id = auth.uid());

drop policy if exists "status like read" on public.status_likes;
create policy "status like read" on public.status_likes for select to authenticated
  using (exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now() and s.review = 'approved'));
drop policy if exists "status like own" on public.status_likes;
create policy "status like own" on public.status_likes for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now() and s.review = 'approved'));
drop policy if exists "status comment read" on public.status_comments;
create policy "status comment read" on public.status_comments for select to authenticated
  using (exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now() and s.review = 'approved'));
drop policy if exists "status comment own" on public.status_comments;
create policy "status comment own" on public.status_comments for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now() and s.review = 'approved'));

drop policy if exists "status media read" on storage.objects;
create policy "status media read" on storage.objects for select to authenticated
  using (bucket_id = 'statuses' and (split_part(name, '/', 1) = auth.uid()::text
    or exists (select 1 from public.statuses s where s.media_path = name and s.expires_at > now() and s.review = 'approved')));

-- Feed: approved statuses for everyone, plus the caller's own (any review state).
drop function if exists public.status_feed();
create function public.status_feed()
returns table (id uuid, user_id uuid, kind text, body text, media_path text, bg text,
  created_at timestamptz, expires_at timestamptz, author_name text, author_photo text,
  like_count bigint, comment_count bigint, liked boolean, review text)
language sql stable security invoker set search_path = public as $$
  select s.id, s.user_id, s.kind, s.body, s.media_path, s.bg, s.created_at, s.expires_at,
    p.name, p.photo_url,
    (select count(*) from public.status_likes l where l.status_id = s.id),
    (select count(*) from public.status_comments c where c.status_id = s.id),
    exists (select 1 from public.status_likes l where l.status_id = s.id and l.user_id = auth.uid()),
    s.review
  from public.statuses s join public.profiles p on p.id = s.user_id
  where s.expires_at > now() and (s.review = 'approved' or s.user_id = auth.uid())
  order by s.created_at desc
  limit 300;
$$;
revoke execute on function public.status_feed() from public, anon;
grant execute on function public.status_feed() to authenticated;
