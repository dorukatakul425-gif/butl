-- Admin panel (/sako): roles live in their own table; only server code with the
-- service role can change balances, and only after the caller's admin role is verified.
do $$ begin
  create type public.app_role as enum ('admin', 'moderator', 'user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
drop policy if exists "read own roles" on public.user_roles;
create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

create or replace function public.admin_adjust_balance(_user_id uuid, _field text, _delta int)
returns int language plpgsql security definer set search_path = public as $$
declare result int;
begin
  if _field not in ('gold', 'tokens', 'dat') then raise exception 'invalid field'; end if;
  execute format('update public.profiles set %1$I = greatest(0, %1$I + $1) where id = $2 returning %1$I', _field)
    into result using _delta, _user_id;
  if result is null then raise exception 'player not found'; end if;
  return result;
end $$;
revoke all on function public.admin_adjust_balance(uuid, text, int) from public, anon, authenticated;
grant execute on function public.admin_adjust_balance(uuid, text, int) to service_role;

-- Make yourself admin (replace the username):
-- insert into public.user_roles (user_id, role)
-- select id, 'admin' from public.profiles where username = 'KULLANICI_ADIN';
