-- ureyimsen "Masa fonu": a paid, room-wide table background chosen from the 3-line menu.
-- Price is paid in crystals (DAT, profiles.dat); everyone at the table sees the change via rooms realtime.
alter table public.rooms add column if not exists table_bg text not null default '';
alter table public.rooms add column if not exists table_bg_by uuid;
alter table public.profiles add column if not exists table_bg_free integer not null default 0;

create table if not exists public.table_bg_config (id boolean primary key default true check (id), price integer not null);
insert into public.table_bg_config (id, price) values (true, 500) on conflict (id) do nothing;
grant select on public.table_bg_config to anon, authenticated;
grant all on public.table_bg_config to service_role;
alter table public.table_bg_config enable row level security;
drop policy if exists "table bg config read" on public.table_bg_config;
create policy "table bg config read" on public.table_bg_config for select using (true);

create or replace function public.table_bg_info()
 returns jsonb language plpgsql stable security definer set search_path to 'public'
as $$
declare rid bigint; cur text; me public.profiles;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select room_id into rid from public.room_players where user_id = auth.uid();
  select table_bg into cur from public.rooms where id = rid;
  select * into me from public.profiles where id = auth.uid();
  return jsonb_build_object('current', coalesce(cur, ''), 'price', (select price from public.table_bg_config),
    'crystals', coalesce(me.dat, 0), 'free', coalesce(me.table_bg_free, 0));
end $$;
revoke execute on function public.table_bg_info() from public, anon;
grant execute on function public.table_bg_info() to authenticated;

create or replace function public.set_table_bg(p_bg text)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
declare rid bigint; cur text; me public.profiles; v_price integer; v_free boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if coalesce(p_bg, '') not in ('', 'royal_velvet', 'lux_hall', 'night_city', 'space', 'seaside', 'vip_club', 'golden_lounge',
      'crystal_cave', 'royal_garden', 'aurora_lake', 'underwater', 'desert_night', 'sakura_garden') then
    return jsonb_build_object('ok', false, 'reason', 'bad_bg');
  end if;
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then return jsonb_build_object('ok', false, 'reason', 'not_seated'); end if;
  select table_bg into cur from public.rooms where id = rid for update;
  if cur = coalesce(p_bg, '') then return jsonb_build_object('ok', true, 'same', true, 'bg_type', cur); end if;
  select * into me from public.profiles where id = auth.uid() for update;
  select price into v_price from public.table_bg_config;
  v_free := me.table_bg_free > 0;
  if not v_free and me.dat < v_price then
    return jsonb_build_object('ok', false, 'reason', 'insufficient_crystals', 'crystals', me.dat);
  end if;
  if v_free then
    update public.profiles set table_bg_free = table_bg_free - 1 where id = me.id;
  else
    update public.profiles set dat = dat - v_price where id = me.id;
  end if;
  update public.rooms set table_bg = coalesce(p_bg, ''), table_bg_by = auth.uid() where id = rid;
  return jsonb_build_object('ok', true, 'bg_type', coalesce(p_bg, ''), 'free_used', v_free,
    'crystals', case when v_free then me.dat else me.dat - v_price end);
end $$;
revoke execute on function public.set_table_bg(text) from public, anon;
grant execute on function public.set_table_bg(text) to authenticated;
