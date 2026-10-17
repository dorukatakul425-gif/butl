-- Bans: one row per banned player. Enforced in the database (inserts blocked,
-- sessions revoked) so a still-valid token cannot keep playing.
create table if not exists public.user_bans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reason text not null default '' check (char_length(reason) <= 300),
  banned_by uuid references auth.users(id) on delete set null,
  banned_at timestamptz not null default now(),
  banned_until timestamptz -- null = permanent
);
grant select on public.user_bans to authenticated;
grant all on public.user_bans to service_role;
alter table public.user_bans enable row level security;
drop policy if exists "read own ban" on public.user_bans;
create policy "read own ban" on public.user_bans for select to authenticated using (auth.uid() = user_id);

create or replace function public.is_banned(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_bans b where b.user_id = _user_id and (b.banned_until is null or b.banned_until > now()))
$$;
grant execute on function public.is_banned(uuid) to anon, authenticated, service_role;

-- Ban details for the signed-in player.
create or replace function public.my_ban()
returns table (reason text, banned_at timestamptz, banned_until timestamptz)
language sql stable security definer set search_path = public as $$
  select b.reason, b.banned_at, b.banned_until from public.user_bans b
  where b.user_id = auth.uid() and (b.banned_until is null or b.banned_until > now())
$$;
grant execute on function public.my_ban() to authenticated;

-- Ban details by username, used when a banned player tries to sign in.
create or replace function public.ban_info(_username text)
returns table (reason text, banned_at timestamptz, banned_until timestamptz)
language sql stable security definer set search_path = public as $$
  select b.reason, b.banned_at, b.banned_until from public.user_bans b
  join public.profiles p on p.id = b.user_id
  where p.username = lower(_username) and (b.banned_until is null or b.banned_until > now())
$$;
grant execute on function public.ban_info(text) to anon, authenticated;

-- Reject any player-originated write while banned.
create or replace function public.reject_banned_writes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and public.is_banned(auth.uid()) then
    raise exception 'user_banned' using errcode = '42501';
  end if;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['room_players','chat_messages','gift_events','gesture_events','statuses','status_comments','status_likes'] loop
    if to_regclass('public.' || t) is not null then
      execute format('drop trigger if exists reject_banned on public.%I', t);
      execute format('create trigger reject_banned before insert or update on public.%I for each row execute function public.reject_banned_writes()', t);
    end if;
  end loop;
end $$;

-- Revoke every session of a player so the app is signed out on next refresh.
create or replace function public.admin_revoke_sessions(_user_id uuid)
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  delete from auth.sessions where user_id = _user_id;
  delete from auth.refresh_tokens where user_id = _user_id::text;
end $$;
revoke all on function public.admin_revoke_sessions(uuid) from public, anon, authenticated;
grant execute on function public.admin_revoke_sessions(uuid) to service_role;
