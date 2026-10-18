-- Telegram ProfileInfoPresenter/TGSocial: first information change free, then 20 hearts.
-- Photo-only edits are free and do not consume the free information change.
alter table public.profiles add column if not exists birthday date;
alter table public.profiles add column if not exists profile_updated_at timestamptz;

create or replace function public.get_profile_edit_state() returns jsonb
language plpgsql security definer set search_path = public as $$
declare p public.profiles;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select * into p from public.profiles where id=auth.uid();
  if not found then raise exception 'no_profile'; end if;
  return jsonb_build_object('name',p.name,'birthday',coalesce(p.birthday,(current_date-make_interval(years=>coalesce(p.age,27)))::date),
    'male',p.male,'photo',p.photo_url,'changePrice',case when p.profile_updated_at is null then 0 else 20 end);
end $$;
revoke all on function public.get_profile_edit_state() from public,anon;
grant execute on function public.get_profile_edit_state() to authenticated;

create or replace function public.save_profile_info(p_birthday date,p_male boolean,p_expected_price integer,p_expected_birthday date,p_expected_male boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
declare p public.profiles; old_birthday date; cost integer;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if p_male is null or p_birthday is null or p_birthday > (current_date-interval '18 years')::date or p_birthday < (current_date-interval '98 years')::date then raise exception 'invalid_profile'; end if;
  select * into p from public.profiles where id=auth.uid() for update;
  if not found then raise exception 'no_profile'; end if;
  old_birthday:=coalesce(p.birthday,(current_date-make_interval(years=>coalesce(p.age,27)))::date);
  if p_birthday=old_birthday and p_male=p.male then return public.get_profile_edit_state(); end if;
  if p_expected_birthday is distinct from old_birthday or p_expected_male is distinct from p.male then raise exception 'profile_changed'; end if;
  cost:=case when p.profile_updated_at is null then 0 else 20 end;
  if p_expected_price is distinct from cost then raise exception 'price_changed'; end if;
  if p.gold < cost then raise exception 'insufficient_hearts'; end if;
  update public.profiles set birthday=p_birthday,age=extract(year from age(current_date,p_birthday))::int,
    male=p_male,gold=gold-cost,profile_updated_at=now() where id=p.id;
  return public.get_profile_edit_state();
end $$;
revoke all on function public.save_profile_info(date,boolean,integer,date,boolean) from public,anon;
grant execute on function public.save_profile_info(date,boolean,integer,date,boolean) to authenticated;

-- Direct API writes cannot bypass the information-change charge. Photo/bio remain owner-editable.
create or replace function public.guard_profile_information() returns trigger
language plpgsql set search_path=public as $$
begin
  if current_user in ('authenticated','anon') and
     (new.age is distinct from old.age or new.male is distinct from old.male or new.birthday is distinct from old.birthday or new.profile_updated_at is distinct from old.profile_updated_at) then
    raise exception 'use_profile_info_action';
  end if;
  return new;
end $$;
drop trigger if exists profile_information_guard on public.profiles;
create trigger profile_information_guard before update on public.profiles for each row execute function public.guard_profile_information();

-- Registration cannot be replayed to evade paid subsequent changes.
create or replace function public.complete_profile_setup(p_male boolean,p_age int default null) returns void
language plpgsql security definer set search_path=public as $$
declare done boolean;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_male is null then raise exception 'gender required'; end if;
  if p_age is not null and p_age<>0 and (p_age<18 or p_age>90) then raise exception 'invalid age'; end if;
  select profile_setup_done into done from public.profiles where id=auth.uid() for update;
  if not found then raise exception 'no profile'; end if;
  if done then raise exception 'profile_setup_already_done'; end if;
  update public.profiles set male=p_male,age=coalesce(nullif(p_age,0),age),profile_setup_done=true where id=auth.uid();
end $$;
revoke all on function public.complete_profile_setup(boolean,int) from public,anon;
grant execute on function public.complete_profile_setup(boolean,int) to authenticated;
