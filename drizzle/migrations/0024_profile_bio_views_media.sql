-- Profile bio/status, profile view counter, follower stats, and image/voice direct messages.

alter table public.profiles add column if not exists bio text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_bio_len') then
    alter table public.profiles add constraint profiles_bio_len check (bio is null or char_length(bio) <= 160);
  end if;
end $$;
grant update (bio) on public.profiles to authenticated;

-- One row per (viewer, profile); counts unique visitors.
create table if not exists public.profile_views (
  profile_id uuid not null references auth.users(id) on delete cascade,
  viewer_id uuid not null references auth.users(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (profile_id, viewer_id),
  check (profile_id <> viewer_id)
);
grant all on public.profile_views to service_role;
alter table public.profile_views enable row level security;

create or replace function public.record_profile_view(_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null or _id is null or me = _id then return; end if;
  if not exists (select 1 from public.profiles where id = _id) then return; end if;
  insert into public.profile_views (profile_id, viewer_id) values (_id, me)
  on conflict (profile_id, viewer_id) do update set viewed_at = now();
end $$;
revoke all on function public.record_profile_view(uuid) from public, anon;
grant execute on function public.record_profile_view(uuid) to authenticated;

-- followers: players who follow _id (they requested, or accepted friendship)
-- following: players _id follows (_id requested, or accepted friendship)
create or replace function public.get_profile_stats(_id uuid)
returns table (followers integer, following integer, views integer)
language sql stable security definer set search_path = public as $$
  select
    (select count(*)::int from public.friendships f
      where (f.addressee_id = _id) or (f.requester_id = _id and f.status = 'accepted')),
    (select count(*)::int from public.friendships f
      where (f.requester_id = _id) or (f.addressee_id = _id and f.status = 'accepted')),
    (select count(*)::int from public.profile_views v where v.profile_id = _id)
$$;
revoke all on function public.get_profile_stats(uuid) from public, anon;
grant execute on function public.get_profile_stats(uuid) to authenticated;

-- Media messages.
alter table public.direct_messages add column if not exists kind text not null default 'text';
alter table public.direct_messages add column if not exists media_path text;
alter table public.direct_messages add column if not exists duration_ms integer;
do $$
declare c record;
begin
  for c in select conname from pg_constraint
    where conrelid = 'public.direct_messages'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%btrim(body)%'
  loop
    execute format('alter table public.direct_messages drop constraint %I', c.conname);
  end loop;
  if not exists (select 1 from pg_constraint where conname = 'direct_messages_content_check') then
    alter table public.direct_messages add constraint direct_messages_content_check check (
      (kind = 'text' and media_path is null and char_length(btrim(body)) between 1 and 1000)
      or (kind in ('image', 'audio') and media_path is not null and char_length(body) <= 1000
          and (duration_ms is null or duration_ms between 0 and 600000))
    );
  end if;
end $$;
grant insert (sender_id, recipient_id, body, kind, media_path, duration_ms) on public.direct_messages to authenticated;

-- Private bucket: <sender>/<recipient>/<file>; readable only by the two participants.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dm-media', 'dm-media', false, 10485760,
  array['image/jpeg','image/png','image/webp','image/gif','audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/aac'])
on conflict (id) do nothing;
drop policy if exists "dm media write own" on storage.objects;
create policy "dm media write own" on storage.objects for insert to authenticated
  with check (bucket_id = 'dm-media' and (storage.foldername(name))[1] = auth.uid()::text
    and public.are_friends(auth.uid(), ((storage.foldername(name))[2])::uuid));
drop policy if exists "dm media read participants" on storage.objects;
create policy "dm media read participants" on storage.objects for select to authenticated
  using (bucket_id = 'dm-media' and auth.uid()::text in ((storage.foldername(name))[1], (storage.foldername(name))[2]));
