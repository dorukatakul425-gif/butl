-- Telegram build first entry: TGPresenter.showProfileRegistration (gender required, age 18-90 optional).
alter table public.profiles add column if not exists profile_setup_done boolean not null default false;

create or replace function public.complete_profile_setup(p_male boolean, p_age int default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_male is null then raise exception 'gender required'; end if;
  if p_age is not null and p_age <> 0 and (p_age < 18 or p_age > 90) then raise exception 'invalid age'; end if;
  update public.profiles
     set male = p_male,
         age = coalesce(nullif(p_age, 0), age),
         profile_setup_done = true
   where id = auth.uid();
  if not found then raise exception 'no profile'; end if;
end $$;
revoke all on function public.complete_profile_setup(boolean, int) from public, anon;
grant execute on function public.complete_profile_setup(boolean, int) to authenticated;
