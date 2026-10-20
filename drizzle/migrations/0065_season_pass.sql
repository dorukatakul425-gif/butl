-- ureyimsen "Mövsümi icazənamə" (Ciliz BottlePass): 35-day seasons, 35 levels, free + premium rewards,
-- one new level unlocks per day, bonus chest for overscore. Same levels/rewards as ureyimsen pass_info.
-- Points are added only by triggers on trusted kiss/gift events; clients only read and claim.

create table if not exists public.pass_config (
  id boolean primary key default true check (id),
  epoch timestamptz not null,
  season_days integer not null,
  level_days integer not null,
  premium_price integer not null,
  kiss_points integer not null,
  gift_points integer not null,
  chest_gold_max integer not null,
  overscore2gold integer not null
);
insert into public.pass_config values (true, to_timestamp(1791386995.266), 35, 1, 500, 10, 5, 100, 50)
on conflict (id) do nothing;

create table if not exists public.pass_levels (
  level integer primary key,
  score integer not null,
  free jsonb not null,
  paid jsonb not null
);
insert into public.pass_levels (level, score, free, paid) values
(0,0,'{"items": {"league_kiss_lim10": 2}}'::jsonb,'{"gold": 100}'::jsonb),
(1,100,'{"items": {"league_kiss2x": 1}}'::jsonb,'{"tokens": 10}'::jsonb),
(2,200,'{"items": {"league5": 1}}'::jsonb,'{"items": {"kiss_fire": 7, "refuse_slap": 3}}'::jsonb),
(3,300,'{"items": {"kiss_fire": 5}}'::jsonb,'{"items": {"league_kiss2x": 2, "league_kiss_lim10": 3, "league5": 1}}'::jsonb),
(4,400,'{"items": {"refuse_slap": 3}}'::jsonb,'{"gold": 75}'::jsonb),
(5,500,'{"gold": 10}'::jsonb,'{"items": {"kiss_fire": 7, "refuse_slap": 3}}'::jsonb),
(6,600,'{"tokens": 5}'::jsonb,'{"items": {"league_kiss2x": 2, "league_kiss_lim10": 3, "league5": 1}}'::jsonb),
(7,700,'{"items": {"league_kiss_lim10": 2}}'::jsonb,'{"gold": 100}'::jsonb),
(8,800,'{"items": {"league_kiss2x": 1}}'::jsonb,'{"tokens": 10}'::jsonb),
(9,900,'{"items": {"league5": 1}}'::jsonb,'{"items": {"kiss_fire": 7, "refuse_slap": 3}}'::jsonb),
(10,1000,'{"items": {"kiss_fire": 5}}'::jsonb,'{"items": {"league_kiss2x": 2, "league_kiss_lim10": 3, "league5": 1}}'::jsonb),
(11,1100,'{"items": {"refuse_slap": 3}}'::jsonb,'{"gold": 75}'::jsonb),
(12,1200,'{"gold": 10}'::jsonb,'{"items": {"kiss_fire": 7, "refuse_slap": 3}}'::jsonb),
(13,1300,'{"tokens": 5}'::jsonb,'{"items": {"league_kiss2x": 2, "league_kiss_lim10": 3, "league5": 1}}'::jsonb),
(14,1400,'{"items": {"league_kiss_lim10": 2}}'::jsonb,'{"gold": 100}'::jsonb),
(15,1500,'{"items": {"league_kiss2x": 1}}'::jsonb,'{"tokens": 10}'::jsonb),
(16,1600,'{"items": {"league5": 1}}'::jsonb,'{"items": {"kiss_fire": 7, "refuse_slap": 3}}'::jsonb),
(17,1700,'{"items": {"kiss_fire": 5}}'::jsonb,'{"items": {"league_kiss2x": 2, "league_kiss_lim10": 3, "league5": 1}}'::jsonb),
(18,1800,'{"items": {"refuse_slap": 3}}'::jsonb,'{"gold": 75}'::jsonb),
(19,1900,'{"gold": 10}'::jsonb,'{"items": {"kiss_fire": 7, "refuse_slap": 3}}'::jsonb),
(20,2000,'{"tokens": 5}'::jsonb,'{"items": {"league_kiss2x": 2, "league_kiss_lim10": 3, "league5": 1}}'::jsonb),
(21,2100,'{"items": {"league_kiss_lim10": 2}}'::jsonb,'{"gold": 100}'::jsonb),
(22,2200,'{"items": {"league_kiss2x": 1}}'::jsonb,'{"tokens": 10}'::jsonb),
(23,2300,'{"items": {"league5": 1}}'::jsonb,'{"items": {"kiss_fire": 7, "refuse_slap": 3}}'::jsonb),
(24,2400,'{"items": {"kiss_fire": 5}}'::jsonb,'{"items": {"league_kiss2x": 2, "league_kiss_lim10": 3, "league5": 1}}'::jsonb),
(25,2500,'{"items": {"refuse_slap": 3}}'::jsonb,'{"gold": 75}'::jsonb),
(26,2600,'{"gold": 10}'::jsonb,'{"items": {"kiss_fire": 7, "refuse_slap": 3}}'::jsonb),
(27,2700,'{"tokens": 5}'::jsonb,'{"items": {"league_kiss2x": 2, "league_kiss_lim10": 3, "league5": 1}}'::jsonb),
(28,2800,'{"items": {"kiss_fire": 5}}'::jsonb,'{"items": {"nitrodecor": 1}}'::jsonb),
(29,2900,'{"items": {"refuse_slap": 3}}'::jsonb,'{"tokens": 15}'::jsonb),
(30,3000,'{"items": {"league_kiss_lim10": 2}}'::jsonb,'{"gold": 125}'::jsonb),
(31,3100,'{"items": {"league_kiss2x": 2}}'::jsonb,'{"tokens": 30}'::jsonb),
(32,3200,'{"tokens": 10}'::jsonb,'{"gold": 175}'::jsonb),
(33,3300,'{"gold": 40}'::jsonb,'{"tokens": 45}'::jsonb),
(34,3400,'{"tokens": 25}'::jsonb,'{"gold": 225}'::jsonb)
on conflict (level) do update set score = excluded.score, free = excluded.free, paid = excluded.paid;

create table if not exists public.pass_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  season_start timestamptz not null,
  score integer not null default 0,
  premium boolean not null default false,
  free_claimed integer[] not null default '{}',
  paid_claimed integer[] not null default '{}',
  chest_claimed boolean not null default false,
  primary key (user_id, season_start)
);

create table if not exists public.user_boosters (
  user_id uuid not null references public.profiles(id) on delete cascade,
  booster text not null,
  count integer not null default 0,
  primary key (user_id, booster)
);

grant select on public.pass_config, public.pass_levels to anon, authenticated;
grant select on public.pass_progress, public.user_boosters to authenticated;
grant all on public.pass_config, public.pass_levels, public.pass_progress, public.user_boosters to service_role;
alter table public.pass_config enable row level security;
alter table public.pass_levels enable row level security;
alter table public.pass_progress enable row level security;
alter table public.user_boosters enable row level security;
drop policy if exists "pass config read" on public.pass_config;
create policy "pass config read" on public.pass_config for select using (true);
drop policy if exists "pass levels read" on public.pass_levels;
create policy "pass levels read" on public.pass_levels for select using (true);
drop policy if exists "pass progress own" on public.pass_progress;
create policy "pass progress own" on public.pass_progress for select to authenticated using (user_id = auth.uid());
drop policy if exists "boosters own" on public.user_boosters;
create policy "boosters own" on public.user_boosters for select to authenticated using (user_id = auth.uid());

-- Season n covers [epoch + n*season_days, epoch + (n+1)*season_days); seasons roll automatically.
create or replace function public._pass_season_start(p_at timestamptz default now())
 returns timestamptz language sql stable set search_path to 'public'
as $$
  select c.epoch + make_interval(days => c.season_days * floor(extract(epoch from (p_at - c.epoch)) / (c.season_days * 86400))::int)
  from public.pass_config c
$$;

create or replace function public._pass_add(p_user uuid, p_points integer)
 returns void language plpgsql security definer set search_path to 'public'
as $$
declare s timestamptz := public._pass_season_start();
begin
  if p_user is null or p_points <= 0 then return; end if;
  insert into public.pass_progress (user_id, season_start, score) values (p_user, s, p_points)
  on conflict (user_id, season_start) do update set score = pass_progress.score + p_points;
end $$;

create or replace function public._pass_on_kiss() returns trigger
 language plpgsql security definer set search_path to 'public'
as $$
begin
  if new.kisses > old.kisses then
    perform public._pass_add(new.id, (new.kisses - old.kisses) * (select kiss_points from public.pass_config));
  end if;
  return new;
end $$;
drop trigger if exists pass_on_kiss on public.profiles;
create trigger pass_on_kiss after update of kisses on public.profiles for each row execute function public._pass_on_kiss();

create or replace function public._pass_on_gift() returns trigger
 language plpgsql security definer set search_path to 'public'
as $$
begin
  perform public._pass_add(new.sender_id, (select gift_points from public.pass_config));
  return new;
end $$;
drop trigger if exists pass_on_gift on public.gift_events;
create trigger pass_on_gift after insert on public.gift_events for each row execute function public._pass_on_gift();

create or replace function public._pass_premium(p_user uuid, p_progress public.pass_progress)
 returns boolean language sql stable set search_path to 'public'
as $$
  select coalesce(p_progress.premium, false)
      or coalesce((select premium_until > now() from public.profiles where id = p_user), false)
$$;

create or replace function public._pass_grant(p_user uuid, p_reward jsonb)
 returns void language plpgsql security definer set search_path to 'public'
as $$
declare k text; v jsonb;
begin
  update public.profiles set gold = gold + coalesce((p_reward->>'gold')::int, 0),
    tokens = tokens + coalesce((p_reward->>'tokens')::int, 0) where id = p_user;
  for k, v in select * from jsonb_each(coalesce(p_reward->'items', '{}'::jsonb)) loop
    insert into public.user_boosters (user_id, booster, count) values (p_user, k, v::int)
    on conflict (user_id, booster) do update set count = user_boosters.count + excluded.count;
  end loop;
end $$;

-- Same shape as ureyimsen's pass_info packet.
create or replace function public.pass_info()
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
declare c public.pass_config; s timestamptz; f timestamptz; p public.pass_progress; prev public.pass_progress;
  prem boolean; lvls jsonb; last_score int; lvl int; chest int; prev_chest int;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into c from public.pass_config;
  s := public._pass_season_start(); f := s + make_interval(days => c.season_days);
  select * into p from public.pass_progress where user_id = auth.uid() and season_start = s;
  prem := public._pass_premium(auth.uid(), p);
  select max(score) into last_score from public.pass_levels;
  select coalesce(max(level), 0) into lvl from public.pass_levels
   where score <= coalesce(p.score, 0) and s + make_interval(days => level * c.level_days) <= now();
  chest := least(c.chest_gold_max, greatest(coalesce(p.score, 0) - last_score, 0) / c.overscore2gold);
  select jsonb_agg(jsonb_build_object('level', l.level, 'score', l.score,
      'start_ms', (extract(epoch from s + make_interval(days => l.level * c.level_days)) * 1000)::bigint,
      'free', l.free || jsonb_build_object('claimed', l.level = any(coalesce(p.free_claimed, '{}'))),
      'paid', l.paid || jsonb_build_object('claimed', l.level = any(coalesce(p.paid_claimed, '{}'))))
    order by l.level) into lvls from public.pass_levels l;
  -- Previous season's bonus chest stays collectable after the season ends (premium only).
  select * into prev from public.pass_progress where user_id = auth.uid() and season_start = s - make_interval(days => c.season_days);
  prev_chest := case when prev.user_id is not null and not prev.chest_claimed and public._pass_premium(auth.uid(), prev)
    then least(c.chest_gold_max, greatest(prev.score - last_score, 0) / c.overscore2gold) else 0 end;
  return jsonb_build_object('state', 'running', 'pass_premium', prem, 'score', coalesce(p.score, 0), 'level', lvl,
    'start_ms', (extract(epoch from s) * 1000)::bigint, 'finish_ms', (extract(epoch from f) * 1000)::bigint,
    'now_ms', (extract(epoch from now()) * 1000)::bigint, 'price', c.premium_price,
    'dat', (select dat from public.profiles where id = auth.uid()),
    'chest', jsonb_build_object('claimed', coalesce(p.chest_claimed, false), 'gold', chest, 'gold_max', c.chest_gold_max,
      'next_gold_score', last_score + (chest + 1) * c.overscore2gold, 'overscore2gold', c.overscore2gold),
    'prev_chest', prev_chest, 'levels', lvls);
end $$;

create or replace function public.pass_claim(p_level integer, p_premium boolean)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
declare c public.pass_config; s timestamptz; p public.pass_progress; l public.pass_levels; reward jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into c from public.pass_config;
  s := public._pass_season_start();
  insert into public.pass_progress (user_id, season_start) values (auth.uid(), s) on conflict do nothing;
  select * into p from public.pass_progress where user_id = auth.uid() and season_start = s for update;
  select * into l from public.pass_levels where level = p_level;
  if l.level is null then return jsonb_build_object('ok', false, 'reason', 'bad_level'); end if;
  if s + make_interval(days => l.level * c.level_days) > now() then return jsonb_build_object('ok', false, 'reason', 'level_block'); end if;
  if p.score < l.score then return jsonb_build_object('ok', false, 'reason', 'level_block'); end if;
  if p_premium and not public._pass_premium(auth.uid(), p) then return jsonb_build_object('ok', false, 'reason', 'pass_block'); end if;
  if (p_premium and l.level = any(p.paid_claimed)) or (not p_premium and l.level = any(p.free_claimed)) then
    return jsonb_build_object('ok', false, 'reason', 'claimed');
  end if;
  reward := case when p_premium then l.paid else l.free end;
  if p_premium then
    update public.pass_progress set paid_claimed = array_append(paid_claimed, l.level) where user_id = p.user_id and season_start = s;
  else
    update public.pass_progress set free_claimed = array_append(free_claimed, l.level) where user_id = p.user_id and season_start = s;
  end if;
  perform public._pass_grant(auth.uid(), reward);
  return jsonb_build_object('ok', true, 'reward', reward);
end $$;

create or replace function public.pass_buy_premium()
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
declare c public.pass_config; s timestamptz; p public.pass_progress; me public.profiles;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into c from public.pass_config;
  s := public._pass_season_start();
  insert into public.pass_progress (user_id, season_start) values (auth.uid(), s) on conflict do nothing;
  select * into p from public.pass_progress where user_id = auth.uid() and season_start = s for update;
  if public._pass_premium(auth.uid(), p) then return jsonb_build_object('ok', false, 'reason', 'purchased'); end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if me.dat < c.premium_price then return jsonb_build_object('ok', false, 'reason', 'insufficient_dat', 'dat', me.dat); end if;
  update public.profiles set dat = dat - c.premium_price,
    premium_until = greatest(coalesce(premium_until, now()), s + make_interval(days => c.season_days)) where id = me.id;
  update public.pass_progress set premium = true where user_id = p.user_id and season_start = s;
  return jsonb_build_object('ok', true, 'dat', me.dat - c.premium_price);
end $$;

create or replace function public.pass_claim_chest()
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
declare c public.pass_config; s timestamptz; prev public.pass_progress; last_score int; g int;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into c from public.pass_config;
  s := public._pass_season_start() - make_interval(days => c.season_days);
  select * into prev from public.pass_progress where user_id = auth.uid() and season_start = s for update;
  if prev.user_id is null or prev.chest_claimed then return jsonb_build_object('ok', false, 'reason', 'claimed'); end if;
  if not public._pass_premium(auth.uid(), prev) then return jsonb_build_object('ok', false, 'reason', 'pass_block'); end if;
  select max(score) into last_score from public.pass_levels;
  g := least(c.chest_gold_max, greatest(prev.score - last_score, 0) / c.overscore2gold);
  if g <= 0 then return jsonb_build_object('ok', false, 'reason', 'empty'); end if;
  update public.pass_progress set chest_claimed = true where user_id = prev.user_id and season_start = s;
  update public.profiles set gold = gold + g where id = prev.user_id;
  return jsonb_build_object('ok', true, 'gold', g);
end $$;

revoke execute on function public._pass_season_start(timestamptz), public._pass_add(uuid, integer),
  public._pass_premium(uuid, public.pass_progress), public._pass_grant(uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.pass_info(), public.pass_claim(integer, boolean), public.pass_buy_premium(),
  public.pass_claim_chest() from public, anon;
grant execute on function public.pass_info(), public.pass_claim(integer, boolean), public.pass_buy_premium(),
  public.pass_claim_chest() to authenticated;
