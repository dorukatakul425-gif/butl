-- Voice rooms: owner moderation — locked seats, optional room password (hashed, never readable
-- by clients) and temporary kicks enforced when (re)entering. Idempotent.
create extension if not exists pgcrypto;
alter table public.voice_rooms add column if not exists locked_seats int[] not null default '{}';
alter table public.voice_rooms add column if not exists has_password boolean not null default false;

create table if not exists public.voice_room_secrets (
  room_id uuid primary key references public.voice_rooms(id) on delete cascade,
  pass_hash text not null
);
alter table public.voice_room_secrets enable row level security;
revoke all on public.voice_room_secrets from anon, authenticated;
grant all on public.voice_room_secrets to service_role;

create table if not exists public.voice_room_kicks (
  room_id uuid not null references public.voice_rooms(id) on delete cascade,
  user_id uuid not null,
  until timestamptz not null,
  primary key (room_id, user_id)
);
alter table public.voice_room_kicks enable row level security;
drop policy if exists voice_room_kicks_read on public.voice_room_kicks;
create policy voice_room_kicks_read on public.voice_room_kicks for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.voice_rooms r where r.id = room_id and r.owner_id = auth.uid()));
grant select on public.voice_room_kicks to authenticated;
grant all on public.voice_room_kicks to service_role;

create or replace function public.set_voice_room_password(p_room uuid, p_pass text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not exists (select 1 from voice_rooms where id = p_room and owner_id = auth.uid()) then
    raise exception 'not_owner' using errcode = '42501';
  end if;
  if coalesce(btrim(p_pass), '') = '' then
    delete from voice_room_secrets where room_id = p_room;
    update voice_rooms set has_password = false where id = p_room;
  else
    if char_length(p_pass) > 32 then raise exception 'too_long' using errcode = '22023'; end if;
    insert into voice_room_secrets(room_id, pass_hash) values (p_room, crypt(p_pass, gen_salt('bf')))
      on conflict (room_id) do update set pass_hash = excluded.pass_hash;
    update voice_rooms set has_password = true where id = p_room;
  end if;
end $$;

-- 'ok' | 'password' (missing/wrong) | 'kicked:<unix seconds>'
create or replace function public.voice_room_enter(p_room uuid, p_pass text default null) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare r voice_rooms; k timestamptz; h text;
begin
  select * into r from voice_rooms where id = p_room;
  if not found then return 'missing'; end if;
  if r.owner_id = auth.uid() then return 'ok'; end if;
  select until into k from voice_room_kicks where room_id = p_room and user_id = auth.uid() and until > now();
  if k is not null then return 'kicked:' || floor(extract(epoch from k))::bigint; end if;
  if r.has_password then
    select pass_hash into h from voice_room_secrets where room_id = p_room;
    if h is not null and (p_pass is null or crypt(p_pass, h) <> h) then return 'password'; end if;
  end if;
  return 'ok';
end $$;

create or replace function public.kick_voice_member(p_room uuid, p_user uuid, p_minutes int) returns timestamptz
language plpgsql security definer set search_path = public as $$
declare u timestamptz;
begin
  if not exists (select 1 from voice_rooms where id = p_room and owner_id = auth.uid()) then
    raise exception 'not_owner' using errcode = '42501';
  end if;
  if p_user = auth.uid() then raise exception 'self' using errcode = '22023'; end if;
  u := now() + make_interval(mins => least(greatest(coalesce(p_minutes, 5), 1), 1440));
  insert into voice_room_kicks(room_id, user_id, until) values (p_room, p_user, u)
    on conflict (room_id, user_id) do update set until = excluded.until;
  return u;
end $$;

revoke all on function public.set_voice_room_password(uuid, text) from public, anon;
revoke all on function public.voice_room_enter(uuid, text) from public, anon;
revoke all on function public.kick_voice_member(uuid, uuid, int) from public, anon;
grant execute on function public.set_voice_room_password(uuid, text) to authenticated;
grant execute on function public.voice_room_enter(uuid, text) to authenticated;
grant execute on function public.kick_voice_member(uuid, uuid, int) to authenticated;
