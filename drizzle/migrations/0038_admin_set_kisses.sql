-- Admin panel: set a player's total kiss count to an exact value.
create or replace function public.admin_set_kisses(_user_id uuid, _value int)
returns int language plpgsql security definer set search_path = public as $$
declare result int;
begin
  if _value < 0 or _value > 10000000 then raise exception 'invalid value'; end if;
  update public.profiles set kisses = _value where id = _user_id returning kisses into result;
  if result is null then raise exception 'player not found'; end if;
  return result;
end $$;
revoke all on function public.admin_set_kisses(uuid, int) from public, anon, authenticated;
grant execute on function public.admin_set_kisses(uuid, int) to service_role;
