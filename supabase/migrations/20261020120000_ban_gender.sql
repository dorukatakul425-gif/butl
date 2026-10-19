-- Ban ekranında Ciliz'deki gibi cinsiyete göre resim göstermek için
-- my_ban() ve ban_info() artık oyuncunun cinsiyetini de döndürüyor.
drop function if exists public.my_ban();
create or replace function public.my_ban()
returns table (reason text, banned_at timestamptz, banned_until timestamptz, male boolean)
language sql stable security definer set search_path = public as $$
  select b.reason, b.banned_at, b.banned_until, p.male from public.user_bans b
  join public.profiles p on p.id = b.user_id
  where b.user_id = auth.uid() and (b.banned_until is null or b.banned_until > now())
$$;
grant execute on function public.my_ban() to authenticated;

drop function if exists public.ban_info(text);
create or replace function public.ban_info(_username text)
returns table (reason text, banned_at timestamptz, banned_until timestamptz, male boolean)
language sql stable security definer set search_path = public as $$
  select b.reason, b.banned_at, b.banned_until, p.male from public.user_bans b
  join public.profiles p on p.id = b.user_id
  where p.username = lower(_username) and (b.banned_until is null or b.banned_until > now())
$$;
grant execute on function public.ban_info(text) to anon, authenticated;
