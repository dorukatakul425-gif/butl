-- Leagues (cup competition), port of the original game's league rules.
-- Known from the original client/texts: 17 leagues (0 Wood .. 16 Diamond), 3-day rounds,
-- 100 received kisses to enter, a per-league kiss-point limit, a received-vs-sent gift
-- difference limit of 100 points, top move_up go up, last move_down go down, rest stay.
-- Group size / move counts / limits are server-side numbers in the original; they live in
-- league_config / league_levels so they can be tuned without code changes.
-- Idempotent: safe on Lovable Cloud and on the VPS database.

create table if not exists public.league_config (
  id boolean primary key default true check (id),
  users_max int not null default 20,
  move_up int not null default 3,
  move_down int not null default 3,
  round_hours int not null default 72,
  entry_kisses int not null default 100,
  gift_diff_lim int not null default 100
);
insert into public.league_config (id) values (true) on conflict do nothing;

create table if not exists public.league_levels (
  level int primary key check (level between 0 and 16),
  kisses_lim int not null default 500,
  gold int not null default 0,
  gifts text[] not null default '{}'
);
insert into public.league_levels (level, gold, gifts) values
  (0, 4, '{heartangel,brokenheart,heartdevil}'), (1, 6, '{joystick,helicopter,tank}'),
  (2, 8, '{cakeforher,cakeforhim,birds}'), (3, 10, '{motorcycle,castetmug,lighter}'),
  (4, 12, '{unicorn,flowersviolet,pig}'), (5, 15, '{japanesefan,aircraft,manekineko}'),
  (6, 18, '{revolver,horseheadhat,sheriffstar}'), (7, 21, '{milkcoctail,flowerswhitered,corgidog}'),
  (8, 24, '{handcuffs,makarov,hammer}'), (9, 27, '{}'), (10, 30, '{}'), (11, 33, '{}'),
  (12, 36, '{}'), (13, 39, '{}'), (14, 42, '{}'), (15, 45, '{}'), (16, 50, '{}')
on conflict (level) do nothing;

create table if not exists public.league_players (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  level int not null default 0 check (level between 0 and 16),
  max_level int not null default 0
);

create table if not exists public.league_rounds (
  id bigint generated always as identity primary key,
  level int not null,
  state text not null default 'running' check (state in ('running','finished')),
  start_at timestamptz not null default now(),
  finish_at timestamptz not null,
  processed boolean not null default false
);
create index if not exists league_rounds_open_idx on public.league_rounds (level, state);

create table if not exists public.league_members (
  round_id bigint not null references public.league_rounds(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score int not null default 0,
  kiss_points int not null default 0,
  kisses_lim int not null default 500,
  gifts_in int not null default 0,
  gifts_out int not null default 0,
  lim text check (lim in ('kiss','gift','all')),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  final_pos int,
  reward_gold int,
  reward_gifts text[],
  reward_seen boolean not null default false,
  primary key (round_id, user_id)
);
create index if not exists league_members_user_idx on public.league_members (user_id, round_id desc);

grant select on public.league_config, public.league_levels to anon, authenticated;
grant select on public.league_players, public.league_rounds, public.league_members to authenticated;
grant all on public.league_config, public.league_levels, public.league_players, public.league_rounds, public.league_members to service_role;
alter table public.league_config enable row level security;
alter table public.league_levels enable row level security;
alter table public.league_players enable row level security;
alter table public.league_rounds enable row level security;
alter table public.league_members enable row level security;
drop policy if exists "league config readable" on public.league_config;
create policy "league config readable" on public.league_config for select using (true);
drop policy if exists "league levels readable" on public.league_levels;
create policy "league levels readable" on public.league_levels for select using (true);
drop policy if exists "league players readable" on public.league_players;
create policy "league players readable" on public.league_players for select to authenticated using (true);
drop policy if exists "league rounds readable" on public.league_rounds;
create policy "league rounds readable" on public.league_rounds for select to authenticated using (true);
drop policy if exists "league members readable" on public.league_members;
create policy "league members readable" on public.league_members for select to authenticated using (true);

do $$ begin
  alter publication supabase_realtime add table public.league_members;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.league_rounds;
exception when duplicate_object then null; end $$;

-- Ranking order (leagueCompare): score desc, earlier join first.
create or replace function public._league_finalize() returns void
language plpgsql security definer set search_path = public as $$
declare c public.league_config; r public.league_rounds; m record; lv public.league_levels; n int; nl int;
begin
  select * into c from public.league_config;
  for r in select * from public.league_rounds where state = 'running' and finish_at <= now() and not processed for update skip locked loop
    select * into lv from public.league_levels where level = r.level;
    select count(*) into n from public.league_members where round_id = r.id;
    for m in select user_id, row_number() over (order by score desc, joined_at, user_id) as pos
             from public.league_members where round_id = r.id loop
      nl := r.level;
      if m.pos <= c.move_up then nl := least(16, r.level + 1);
      elsif m.pos > c.users_max - c.move_down then nl := greatest(0, r.level - 1);
      end if;
      update public.league_members set final_pos = m.pos,
        reward_gold = coalesce(lv.gold, 0),
        reward_gifts = case when m.pos <= 3 and coalesce(array_length(lv.gifts,1),0) >= m.pos then array[lv.gifts[m.pos]] else '{}' end
       where round_id = r.id and user_id = m.user_id;
      update public.profiles set gold = gold + coalesce(lv.gold, 0),
        owned_items = case when m.pos <= 3 and coalesce(array_length(lv.gifts,1),0) >= m.pos and not (('gift:' || lv.gifts[m.pos]) = any(owned_items))
                           then array_append(owned_items, 'gift:' || lv.gifts[m.pos]) else owned_items end
       where id = m.user_id;
      update public.league_players set level = nl, max_level = greatest(max_level, nl) where user_id = m.user_id;
    end loop;
    update public.league_rounds set state = 'finished', processed = true where id = r.id;
  end loop;
end $$;

create or replace function public._league_participates(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select (raw_user_meta_data->>'league_participation')::boolean from auth.users where id = p_user), false)
     and coalesce((select kisses from public.profiles where id = p_user), 0) >= (select entry_kisses from public.league_config);
$$;

-- Current running membership, joining a group of the player's league when needed.
create or replace function public._league_member(p_user uuid) returns public.league_members
language plpgsql security definer set search_path = public as $$
declare c public.league_config; lp public.league_players; rid bigint; mem public.league_members;
begin
  perform public._league_finalize();
  select mm.* into mem from public.league_members mm join public.league_rounds rr on rr.id = mm.round_id
   where mm.user_id = p_user and rr.state = 'running' order by mm.round_id desc limit 1;
  if found then return mem; end if;
  if not public._league_participates(p_user) then return null; end if;
  select * into c from public.league_config;
  insert into public.league_players(user_id) values (p_user) on conflict do nothing;
  select * into lp from public.league_players where user_id = p_user;
  select rr.id into rid from public.league_rounds rr
   where rr.level = lp.level and rr.state = 'running' and rr.finish_at > now()
     and (select count(*) from public.league_members x where x.round_id = rr.id) < c.users_max
   order by rr.id limit 1 for update skip locked;
  if rid is null then
    insert into public.league_rounds(level, finish_at) values (lp.level, now() + make_interval(hours => c.round_hours)) returning id into rid;
  end if;
  insert into public.league_members(round_id, user_id, kisses_lim)
    values (rid, p_user, coalesce((select kisses_lim from public.league_levels where level = lp.level), 500))
    on conflict do nothing;
  select * into mem from public.league_members where round_id = rid and user_id = p_user;
  return mem;
end $$;

create or replace function public._league_lim(m public.league_members, gift_lim int) returns text
language sql immutable as $$
  select case
    when m.kiss_points >= m.kisses_lim and m.gifts_in - m.gifts_out >= gift_lim then 'all'
    when m.kiss_points >= m.kisses_lim then 'kiss'
    when m.gifts_in - m.gifts_out >= gift_lim then 'gift'
    else null end;
$$;

-- kind: 'kiss' (received kiss), 'gift_in' (received gift worth p_points), 'gift_out' (sent gift), 'other' (music/admiration).
create or replace function public._league_add(p_user uuid, p_kind text, p_points int) returns void
language plpgsql security definer set search_path = public as $$
declare mem public.league_members; c public.league_config; add int := 0;
begin
  mem := public._league_member(p_user);
  if mem.round_id is null then return; end if;
  select * into c from public.league_config;
  select * into mem from public.league_members where round_id = mem.round_id and user_id = p_user for update;
  if p_kind = 'kiss' then
    add := greatest(0, least(p_points, mem.kisses_lim - mem.kiss_points));
    mem.kiss_points := mem.kiss_points + add;
  elsif p_kind = 'gift_in' then
    add := greatest(0, least(p_points, c.gift_diff_lim - (mem.gifts_in - mem.gifts_out)));
    mem.gifts_in := mem.gifts_in + add;
  elsif p_kind = 'gift_out' then
    add := p_points;
    mem.gifts_out := mem.gifts_out + p_points;
  else
    add := p_points;
  end if;
  update public.league_members set score = score + add, kiss_points = mem.kiss_points, gifts_in = mem.gifts_in,
    gifts_out = mem.gifts_out, lim = public._league_lim(mem, c.gift_diff_lim), updated_at = now()
   where round_id = mem.round_id and user_id = p_user;
end $$;

create or replace function public._league_on_kiss() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.kisses > old.kisses then perform public._league_add(new.id, 'kiss', new.kisses - old.kisses); end if;
  return new;
end $$;
drop trigger if exists league_on_kiss on public.profiles;
create trigger league_on_kiss after update of kisses on public.profiles for each row execute function public._league_on_kiss();

create or replace function public._league_on_gift() returns trigger
language plpgsql security definer set search_path = public as $$
declare pr int;
begin
  select price into pr from public.gift_prices where gift_type = new.gift_type;
  if coalesce(pr, 0) > 0 then
    perform public._league_add(new.receiver_id, 'gift_in', pr);
    perform public._league_add(new.sender_id, 'gift_out', pr);
  end if;
  return new;
end $$;
drop trigger if exists league_on_gift on public.gift_events;
create trigger league_on_gift after insert on public.gift_events for each row execute function public._league_on_gift();

-- Viewer league state for the dialog/header (finalizes ended rounds lazily).
create or replace function public.get_league() returns jsonb
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); mem public.league_members; r public.league_rounds; c public.league_config; lp public.league_players; lv public.league_levels; fin public.league_members;
begin
  if me is null then raise exception 'not signed in'; end if;
  select * into c from public.league_config;
  perform public._league_finalize();
  -- Unseen finished result first (showLeagueFinish), then the running round.
  select mm.* into fin from public.league_members mm join public.league_rounds rr on rr.id = mm.round_id
   where mm.user_id = me and rr.state = 'finished' and not mm.reward_seen order by mm.round_id desc limit 1;
  if fin.round_id is not null then mem := fin; else
    mem := public._league_member(me);
    if mem.round_id is null then
      select * into lp from public.league_players where user_id = me;
      return jsonb_build_object('state', case when public._league_participates(me) then 'welcome' when coalesce((select kisses from public.profiles where id = me),0) < c.entry_kisses then 'undefined' else 'idle' end,
        'level', coalesce(lp.level, 0), 'max_league', coalesce(lp.max_level, 0), 'entry_kisses', c.entry_kisses);
    end if;
  end if;
  select * into r from public.league_rounds where id = mem.round_id;
  select * into lv from public.league_levels where level = r.level;
  select * into lp from public.league_players where user_id = me;
  return jsonb_build_object(
    'state', r.state, 'round_id', r.id, 'level', r.level, 'max_league', coalesce(lp.max_level, r.level),
    'start_ms', (extract(epoch from r.start_at) * 1000)::bigint, 'finish_ms', (extract(epoch from r.finish_at) * 1000)::bigint,
    'users_max', c.users_max, 'move_up', c.move_up, 'move_down', c.move_down,
    'kisses', mem.kiss_points, 'kisses_lim', mem.kisses_lim, 'limit', mem.lim,
    'gold', lv.gold, 'gifts', to_jsonb(lv.gifts),
    'final_pos', mem.final_pos, 'reward_gold', mem.reward_gold, 'reward_gifts', to_jsonb(mem.reward_gifts),
    'users', coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'name', p.name, 'photo_url', p.photo_url, 'score', x.score) order by x.score desc, x.joined_at, x.user_id)
       from public.league_members x join public.profiles p on p.id = x.user_id where x.round_id = r.id), '[]'::jsonb));
end $$;

create or replace function public.league_seen(p_round bigint) returns void
language sql security definer set search_path = public as $$
  update public.league_members set reward_seen = true where round_id = p_round and user_id = auth.uid();
$$;

revoke all on function public._league_finalize(), public._league_member(uuid), public._league_add(uuid, text, int), public._league_participates(uuid) from public, anon, authenticated;
grant execute on function public.get_league(), public.league_seen(bigint) to authenticated;
