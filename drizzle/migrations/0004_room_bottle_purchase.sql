alter table public.rooms add column if not exists bottle text not null default 'standart';
create table public.bottle_prices (bottle text primary key, price integer not null, vip_only boolean not null default false);
grant select on public.bottle_prices to anon, authenticated;
grant all on public.bottle_prices to service_role;
alter table public.bottle_prices enable row level security;
create policy "bottle prices read" on public.bottle_prices for select using (true);
create or replace function public.buy_bottle(p_bottle text)
 returns integer language plpgsql security definer set search_path to 'public'
as $$
declare rid bigint; me public.profiles; b public.bottle_prices;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  select * into b from public.bottle_prices where bottle = p_bottle;
  if not found then raise exception 'not for sale'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if b.vip_only and (me.vip_until is null or me.vip_until < now()) then raise exception 'vip required'; end if;
  if me.gold < b.price then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - b.price where id = me.id;
  update public.rooms set bottle = p_bottle where id = rid;
  return me.gold - b.price;
end $$;
grant execute on function public.buy_bottle(text) to authenticated;