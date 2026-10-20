-- 0059_premium_dat_gifts.sql
-- ureyimsen "💎 Premium" gift panel, paid with DAT coin instead of crystals (1 crystal = 1 DAT).
-- Rules ported from the source server (premium_gift_info / game_premium_gift):
--   * price is per receiver; multi-select sends one gift to every selected player;
--   * the receiver gets reward_dat (half the price) as DAT;
--   * self gift / receiver not at the table / not enough DAT are rejected with a reason;
--   * every send is announced to all tables (premium_gift_announce) and animates at the room.
-- Premium sends live in their own table so the heart-based gift level is unchanged.

create table if not exists public.premium_gift_prices (
  gift_type text primary key references public.gift_prices(gift_type),
  name text not null,
  dat int not null check (dat > 0),
  reward_dat int not null default 0 check (reward_dat >= 0),
  sort int not null default 0
);
alter table public.premium_gift_prices enable row level security;
drop policy if exists "premium prices read" on public.premium_gift_prices;
create policy "premium prices read" on public.premium_gift_prices for select to authenticated using (true);
grant select on public.premium_gift_prices to authenticated;
grant all on public.premium_gift_prices to service_role;

insert into public.premium_gift_prices(gift_type, name, dat, reward_dat, sort) values
  ('heartangel', 'Mələk ürək', 500, 250, 1),
  ('salute', 'Salyut', 1000, 500, 2),
  ('comet', 'Kometa', 1000, 500, 3),
  ('labubu', 'Labubu', 1500, 750, 4),
  ('astronaut', 'Kosmonavt', 2000, 1000, 5),
  ('gem_premium', 'Brilyant', 5000, 2500, 6)
on conflict (gift_type) do update set name = excluded.name, dat = excluded.dat, reward_dat = excluded.reward_dat, sort = excluded.sort;

create table if not exists public.premium_gift_events (
  id bigint generated always as identity primary key,
  room_id bigint not null references public.rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  sender_name text not null default '',
  receiver_name text not null default '',
  gift_type text not null references public.gift_prices(gift_type),
  gift_name text not null default '',
  dat int not null,
  reward_dat int not null default 0,
  seed int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists premium_gift_events_sender_idx on public.premium_gift_events(sender_id);
alter table public.premium_gift_events enable row level security;
-- premium_gift_announce reaches every table, so every signed-in player may read the feed.
drop policy if exists "premium gifts read" on public.premium_gift_events;
create policy "premium gifts read" on public.premium_gift_events for select to authenticated using (true);
grant select on public.premium_gift_events to authenticated;
grant all on public.premium_gift_events to service_role;
do $$ begin
  alter publication supabase_realtime add table public.premium_gift_events;
exception when duplicate_object then null; when undefined_object then null; end $$;

-- premium_gift_info: list + balance.
create or replace function public.premium_gift_info() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'dat', coalesce((select dat from public.profiles where id = auth.uid()), 0),
    'gifts', coalesce((select jsonb_agg(jsonb_build_object('type', gift_type, 'name', name, 'dat', dat, 'reward_dat', reward_dat) order by sort, dat)
                       from public.premium_gift_prices), '[]'::jsonb));
$$;
revoke all on function public.premium_gift_info() from public, anon;
grant execute on function public.premium_gift_info() to authenticated;

-- game_premium_gift -> game_premium_gift_result {ok, dat | reason}.
create or replace function public.send_premium_gift(p_gift text, p_receivers uuid[], p_seed int default 0) returns jsonb
language plpgsql security definer set search_path = public as $$
declare rid bigint; g public.premium_gift_prices; me public.profiles; n int; total int;
begin
  if auth.uid() is null then return jsonb_build_object('ok', false, 'reason', 'not_signed_in'); end if;
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then return jsonb_build_object('ok', false, 'reason', 'not_seated'); end if;
  select * into g from public.premium_gift_prices where gift_type = p_gift;
  if not found then return jsonb_build_object('ok', false, 'reason', 'unknown_gift'); end if;
  if auth.uid() = any(p_receivers) and coalesce(array_length(p_receivers, 1), 0) = 1 then
    return jsonb_build_object('ok', false, 'reason', 'self_gift');
  end if;
  select * into me from public.profiles where id = auth.uid() for update;
  select count(*) into n from public.room_players where room_id = rid and user_id = any(p_receivers) and user_id <> me.id;
  if n = 0 then return jsonb_build_object('ok', false, 'reason', 'receiver_left', 'dat', me.dat); end if;
  total := g.dat * n;
  if me.dat < total then return jsonb_build_object('ok', false, 'reason', 'insufficient_dat', 'dat', me.dat); end if;
  update public.profiles set dat = dat - total where id = me.id;
  update public.profiles set dat = dat + g.reward_dat
   where id in (select user_id from public.room_players where room_id = rid and user_id = any(p_receivers) and user_id <> me.id);
  insert into public.premium_gift_events(room_id, sender_id, receiver_id, sender_name, receiver_name, gift_type, gift_name, dat, reward_dat, seed)
    select rid, me.id, rp.user_id, me.name, coalesce(p.name, ''), g.gift_type, g.name, g.dat, g.reward_dat, p_seed
      from public.room_players rp join public.profiles p on p.id = rp.user_id
     where rp.room_id = rid and rp.user_id = any(p_receivers) and rp.user_id <> me.id;
  return jsonb_build_object('ok', true, 'dat', me.dat - total, 'count', n);
end $$;
revoke all on function public.send_premium_gift(text, uuid[], int) from public, anon;
grant execute on function public.send_premium_gift(text, uuid[], int) to authenticated;
