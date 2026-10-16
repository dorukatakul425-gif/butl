-- Fresh Lovable Cloud project ONLY. Do not apply to an existing game database.
-- Application schema/catalogues only: no users, wallets, chat or signed URLs.
-- Create the private avatars bucket through Lovable Cloud before applying.


-- Source: 0000_butl_game_schema.sql
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  player_no bigint generated always as identity unique,
  username text not null unique,
  name text not null,
  male boolean not null default true,
  age int check (age between 14 and 99),
  city text,
  photo_url text,
  frame text not null default '',
  stone text not null default '',
  kisses int not null default 0,
  gold int not null default 50,
  vip_until timestamptz,
  welcome_gold boolean not null default true,
  owned_items text[] not null default '{}',
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT ON public.profiles TO anon;
grant select on public.profiles to anon, authenticated;
grant update (name, age, city, photo_url) on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable" on public.profiles for select using (true);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare uname text := lower(coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)));
begin
  insert into public.profiles (id, username, name, male, age)
  values (new.id, uname, coalesce(nullif(new.raw_user_meta_data->>'name',''), uname),
          coalesce((new.raw_user_meta_data->>'male')::boolean, true),
          nullif(new.raw_user_meta_data->>'age','')::int);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create policy "avatar read" on storage.objects for select to authenticated using (bucket_id = 'avatars');
create policy "avatar write own" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar update own" on storage.objects for update to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create table if not exists public.rooms (
  id bigint generated always as identity primary key,
  phase text not null default 'offer' check (phase in ('offer','spin','choose','result','return')),
  spinner smallint,
  target smallint,
  decisions jsonb not null default '{}'::jsonb,
  round int not null default 0,
  phase_at timestamptz not null default now(),
  music jsonb,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.rooms TO authenticated;
GRANT ALL ON public.rooms TO service_role;
create table if not exists public.room_players (
  room_id bigint not null references public.rooms(id) on delete cascade,
  seat smallint not null check (seat between 0 and 11),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  last_seen timestamptz not null default now(),
  joined_at timestamptz not null default now(),
  primary key (room_id, seat)
);
GRANT SELECT ON public.room_players TO authenticated;
GRANT ALL ON public.room_players TO service_role;
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  room_id bigint not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete set null,
  text text not null check (char_length(text) between 1 and 300),
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
create table if not exists public.gift_prices (
  gift_type text primary key,
  price int not null check (price >= 0),
  kisses_required int not null default 0,
  vip_only boolean not null default false
);
GRANT SELECT ON public.gift_prices TO authenticated;
GRANT ALL ON public.gift_prices TO service_role;
GRANT SELECT ON public.gift_prices TO anon;
create table if not exists public.gift_events (
  id bigint generated always as identity primary key,
  room_id bigint not null references public.rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  gift_type text not null references public.gift_prices(gift_type),
  seed int not null default 0,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.gift_events TO authenticated;
GRANT ALL ON public.gift_events TO service_role;
create table if not exists public.decor_prices (
  item text primary key,
  price int not null check (price > 0)
);
GRANT SELECT ON public.decor_prices TO authenticated;
GRANT ALL ON public.decor_prices TO service_role;
GRANT SELECT ON public.decor_prices TO anon;

grant select on public.rooms, public.room_players, public.chat_messages, public.gift_events, public.gift_prices to authenticated;
grant select on public.gift_prices, public.decor_prices to anon;
grant select on public.decor_prices to authenticated;
grant all on public.rooms, public.room_players, public.chat_messages, public.gift_events, public.gift_prices, public.decor_prices to service_role;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.chat_messages enable row level security;
alter table public.gift_events enable row level security;
alter table public.gift_prices enable row level security;
alter table public.decor_prices enable row level security;

create or replace function public.my_room() returns bigint language sql stable security definer set search_path = public as $$
  select room_id from public.room_players where user_id = auth.uid()
$$;
create policy "rooms read" on public.rooms for select to authenticated using (true);
create policy "players read" on public.room_players for select to authenticated using (true);
create policy "chat read own room" on public.chat_messages for select to authenticated using (room_id = public.my_room());
create policy "gifts read own room" on public.gift_events for select to authenticated using (room_id = public.my_room());
create policy "prices read" on public.gift_prices for select using (true);
create policy "decor prices read" on public.decor_prices for select using (true);

create or replace function public._next_seat(p_room bigint, p_after int) returns smallint
language sql stable as $$
  select seat from public.room_players where room_id = p_room
  order by (seat - p_after + 11) % 12 limit 1
$$;

create or replace function public._has_pair(p_room bigint) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.room_players where room_id = p_room and seat % 2 = 1)
     and exists (select 1 from public.room_players where room_id = p_room and seat % 2 = 0)
$$;

create or replace function public._do_spin(p_room bigint) returns boolean
language plpgsql security definer set search_path = public as $$
declare r public.rooms; t smallint;
begin
  select * into r from public.rooms where id = p_room for update;
  if r.phase <> 'offer' or r.spinner is null then return false; end if;
  select seat into t from public.room_players
   where room_id = p_room and seat % 2 <> r.spinner % 2 order by random() limit 1;
  if t is null then
    update public.rooms set phase_at = now() where id = p_room;
    return false;
  end if;
  update public.rooms set phase='spin', target=t, decisions='{}'::jsonb, round=round+1, phase_at=now() where id = p_room;
  return true;
end $$;

create or replace function public._finish_choice(p_room bigint) returns void
language plpgsql security definer set search_path = public as $$
declare r public.rooms; d jsonb;
begin
  select * into r from public.rooms where id = p_room for update;
  if r.phase <> 'choose' then return; end if;
  d := jsonb_build_object(r.spinner::text, 'refuse', r.target::text, 'refuse') || r.decisions;
  if d->>r.spinner::text = 'kiss' and d->>r.target::text = 'kiss' then
    update public.profiles set kisses = kisses + 1
     where id in (select user_id from public.room_players where room_id = p_room and seat in (r.spinner, r.target));
  end if;
  update public.rooms set phase='result', decisions=d, phase_at=now() where id = p_room;
end $$;

create or replace function public.room_tick(p_room bigint) returns void
language plpgsql security definer set search_path = public as $$
declare r public.rooms; age double precision; nxt smallint;
begin
  delete from public.room_players where room_id = p_room and last_seen < now() - interval '20 seconds';
  select * into r from public.rooms where id = p_room for update;
  if not found then return; end if;
  if not public._has_pair(p_room) then
    if r.phase <> 'offer' or r.spinner is not null then
      update public.rooms set phase='offer', spinner=null, target=null, decisions='{}'::jsonb, phase_at=now() where id = p_room;
    end if;
    return;
  end if;
  if r.spinner is null or not exists (select 1 from public.room_players where room_id=p_room and seat=r.spinner)
     or (r.phase in ('spin','choose','result') and (r.target is null or not exists (select 1 from public.room_players where room_id=p_room and seat=r.target))) then
    nxt := public._next_seat(p_room, coalesce(r.spinner, 0));
    update public.rooms set phase='offer', spinner=nxt, target=null, decisions='{}'::jsonb, phase_at=now() where id = p_room;
    return;
  end if;
  age := extract(epoch from now() - r.phase_at);
  if r.phase = 'offer' then
    if age >= 9 then perform public._do_spin(p_room); end if;
  elsif r.phase = 'spin' and age >= 6 then
    update public.rooms set phase='choose', phase_at=now() where id = p_room;
  elsif r.phase = 'choose' and age >= 9 then
    perform public._finish_choice(p_room);
  elsif r.phase = 'result' and age >= 2 then
    update public.rooms set phase='return', phase_at=now() where id = p_room;
  elsif r.phase = 'return' and age >= 1 then
    nxt := case when exists (select 1 from public.room_players where room_id=p_room and seat=r.target) then r.target
                else public._next_seat(p_room, coalesce(r.target, 0)) end;
    update public.rooms set phase='offer', spinner=nxt, target=null, decisions='{}'::jsonb, phase_at=now() where id = p_room;
  end if;
end $$;

create or replace function public.join_room() returns table(room_id bigint, seat smallint)
language plpgsql security definer set search_path = public as $$
declare me public.profiles; rid bigint; s smallint; parity int;
begin
  select * into me from public.profiles where id = auth.uid();
  if not found then raise exception 'not signed in'; end if;
  select rp.room_id, rp.seat into rid, s from public.room_players rp where rp.user_id = me.id;
  if rid is not null then
    update public.room_players set last_seen = now() where user_id = me.id;
    return query select rid, s; return;
  end if;
  parity := case when me.male then 1 else 0 end;
  delete from public.room_players where last_seen < now() - interval '45 seconds';
  select r.id into rid from public.rooms r
   where (select count(*) from public.room_players p where p.room_id = r.id and p.seat % 2 = parity) < 6
   order by (select count(*) from public.room_players p where p.room_id = r.id) desc, r.id limit 1
   for update skip locked;
  if rid is null then insert into public.rooms default values returning id into rid; end if;
  select g.s into s from generate_series(0,11) g(s)
   where g.s % 2 = parity and not exists (select 1 from public.room_players p where p.room_id = rid and p.seat = g.s)
   order by random() limit 1;
  insert into public.room_players(room_id, seat, user_id) values (rid, s, me.id);
  update public.rooms set spinner = coalesce(spinner, s), phase_at = case when spinner is null then now() else phase_at end where id = rid;
  return query select rid, s;
end $$;

create or replace function public.heartbeat() returns void
language sql security definer set search_path = public as $$
  update public.room_players set last_seen = now() where user_id = auth.uid();
$$;

create or replace function public.leave_room() returns void
language sql security definer set search_path = public as $$
  delete from public.room_players where user_id = auth.uid();
$$;

create or replace function public.spin_bottle() returns boolean
language plpgsql security definer set search_path = public as $$
declare rid bigint; s smallint; r public.rooms;
begin
  select room_id, seat into rid, s from public.room_players where user_id = auth.uid();
  if rid is null or not public._has_pair(rid) then return false; end if;
  select * into r from public.rooms where id = rid;
  if r.phase <> 'offer' or r.spinner <> s then return false; end if;
  return public._do_spin(rid);
end $$;

create or replace function public.decide(p_kiss boolean) returns void
language plpgsql security definer set search_path = public as $$
declare rid bigint; s smallint; r public.rooms;
begin
  select room_id, seat into rid, s from public.room_players where user_id = auth.uid();
  select * into r from public.rooms where id = rid for update;
  if r.phase <> 'choose' or s not in (r.spinner, r.target) or r.decisions ? s::text then return; end if;
  update public.rooms set decisions = decisions || jsonb_build_object(s::text, case when p_kiss then 'kiss' else 'refuse' end) where id = rid;
  select * into r from public.rooms where id = rid;
  if r.decisions ? r.spinner::text and r.decisions ? r.target::text then perform public._finish_choice(rid); end if;
end $$;

create or replace function public.send_chat(p_text text, p_receiver uuid default null) returns void
language plpgsql security definer set search_path = public as $$
declare rid bigint;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  insert into public.chat_messages(room_id, user_id, receiver_id, text) values (rid, auth.uid(), p_receiver, left(trim(p_text), 300));
end $$;

create or replace function public.send_gift(p_gift text, p_receivers uuid[], p_seed int default 0) returns int
language plpgsql security definer set search_path = public as $$
declare rid bigint; g public.gift_prices; me public.profiles; n int; total int;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  select * into g from public.gift_prices where gift_type = p_gift;
  if not found then raise exception 'unknown gift'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if g.vip_only and (me.vip_until is null or me.vip_until < now()) then raise exception 'vip required'; end if;
  if me.kisses < g.kisses_required then raise exception 'kisses required'; end if;
  select count(*) into n from public.room_players where room_id = rid and user_id = any(p_receivers) and user_id <> me.id;
  if n = 0 then raise exception 'no receivers'; end if;
  total := g.price * n;
  if me.gold < total then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - total where id = me.id;
  insert into public.gift_events(room_id, sender_id, receiver_id, gift_type, seed)
    select rid, me.id, user_id, p_gift, p_seed from public.room_players where room_id = rid and user_id = any(p_receivers) and user_id <> me.id;
  return me.gold - total;
end $$;

create or replace function public.buy_decor(p_item text) returns int
language plpgsql security definer set search_path = public as $$
declare me public.profiles; pr int;
begin
  select * into me from public.profiles where id = auth.uid() for update;
  if not found then raise exception 'not signed in'; end if;
  if p_item = any(me.owned_items) then return me.gold; end if;
  select price into pr from public.decor_prices where item = p_item;
  if pr is null then raise exception 'not for sale'; end if;
  if me.gold < pr then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - pr, owned_items = array_append(owned_items, p_item) where id = me.id;
  return me.gold - pr;
end $$;

create or replace function public.set_decor(p_frame text, p_stone text) returns void
language plpgsql security definer set search_path = public as $$
declare me public.profiles;
begin
  select * into me from public.profiles where id = auth.uid();
  if not found then raise exception 'not signed in'; end if;
  if coalesce(p_frame,'') <> '' and not (p_frame = any(me.owned_items)) then raise exception 'not owned'; end if;
  if coalesce(p_stone,'') <> '' and not (p_stone = any(me.owned_items)) then raise exception 'not owned'; end if;
  update public.profiles set frame = coalesce(p_frame,''), stone = coalesce(p_stone,'') where id = me.id;
end $$;

create or replace function public.play_music(p_service text, p_item jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare rid bigint; me public.profiles; pr int;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  pr := case p_service when 'cz' then 5 when 'yt' then 9 else null end;
  if pr is null then raise exception 'unknown service'; end if;
  if coalesce((p_item->>'duration')::numeric, 0) <= 0 or coalesce(p_item->>'song_id','') = '' then raise exception 'bad item'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if me.gold < pr then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - pr where id = me.id;
  update public.rooms set music = jsonb_build_object(
    'service', p_service,
    'item', jsonb_build_object('artist', left(coalesce(p_item->>'artist',''),200), 'title', left(coalesce(p_item->>'title',''),200),
       'duration', (p_item->>'duration')::numeric, 'song_id', left(p_item->>'song_id',100), 'provider', p_service,
       'url', left(coalesce(p_item->>'url',''),500), 'icon', left(coalesce(p_item->>'icon',''),500)),
    'sender', me.id, 'started_at', now(), 'key', (extract(epoch from clock_timestamp())*1000)::bigint)
   where id = rid;
  return me.gold - pr;
end $$;

create or replace function public.server_now() returns timestamptz language sql stable as $$ select now() $$;

revoke all on function public._do_spin(bigint), public._finish_choice(bigint), public._next_seat(bigint,int), public._has_pair(bigint) from public, anon, authenticated;
grant execute on function public.room_tick(bigint), public.join_room(), public.heartbeat(), public.leave_room(),
  public.spin_bottle(), public.decide(boolean), public.send_chat(text, uuid), public.send_gift(text, uuid[], int), public.my_room(),
  public.buy_decor(text), public.set_decor(text, text), public.play_music(text, jsonb), public.server_now() to authenticated;

alter publication supabase_realtime add table public.rooms, public.room_players, public.chat_messages, public.gift_events, public.profiles;

insert into public.gift_prices (gift_type, price, kisses_required, vip_only) values
('crown1',3,0,false),('crown2',3,0,false),('crown3',3,0,false),('crown4',3,0,false),('partyhat',2,0,false),('birthdaycake',1,0,false),
('air_kiss',1,0,false),('gem',1,0,false),('strawberry',1,0,false),('tomato',1,0,false),('frog',2,0,false),('flower',1,0,false),
('sweet',1,0,false),('bear4',1,0,false),('bear1',1,0,false),('bear7',1,0,false),('bouquet',1,0,false),('bouquet2',1,0,false),
('rose',1,0,false),('cactus',1,0,false),('icecream',1,0,false),('cake',1,0,false),('milk',1,0,false),('wine',1,0,false),
('whiskey',1,0,false),('tea',1,0,false),('vodka',3,0,false),('coffee',1,0,false),('champagne',1,0,false),('beer',1,0,false),
('martini',1,0,false),('juice',1,0,false),('love',2,0,false),('teddybear',1,0,false),('healthdrink',1,0,false),('nurse',2,0,false),
('cowboy',2,0,false),('bezkoz',2,0,false),('slug',2,0,false),('ears1',2,0,false),('ears2',2,0,false),('ears3',2,0,false),
('ears4',2,0,false),('ears5',2,0,false),('ears6',2,0,false),('ears7',2,0,false),('ears8',2,0,false),('ears9a',2,0,false),
('bow1',2,0,false),('bow2',2,0,false),('bow3',2,0,false),('bow4',2,0,false),('flagaz',1,0,false),('baseballaz',2,0,false),
('flagam',1,0,false),('baseballam',2,0,false),('mobile',2,0,false),('ushanka',2,20,false),('romcola',1,40,false),('clown',2,80,false),
('mineralka',1,150,false),('strawhat',2,250,false),('bloodymary',1,350,false),('weddingring1',1,550,false),('weddingring2',1,550,false),
('weddingring3',1,550,false),('weddingring4',1,550,false),('latte',1,750,false),('sombrero',2,950,false),('mojito',1,1150,false),
('viking',2,1450,false),('tarhun',1,1750,false),('cappy',2,2150,false),('bluelagoon',1,2550,false),('pirat',2,3050,false),
('b52',2,3550,false),('kotelok',2,4150,false),('daiquiri',1,4750,false),('pilotka',2,5350,false),('sexonthebeach',2,5950,false),
('cylinder',2,6550,false),('pinacolada',1,7150,false),('rasta',2,7750,false),('oscar',1,8350,false),('nipple',1,8950,false),
('cocoscocktail',1,9550,false),('surprizebox',1,10150,false),('napoleon',2,10750,false),('poison',1,11350,false),('musketeer',2,11950,false),
('rassol',1,12550,false),('sultan',2,13150,false),('microphone',1,13750,false),('voodoo',1,14350,false),('jam',1,14950,false),
('pepper',1,15550,false),('colander',2,16150,false),('genielamp',1,16750,false),('vanilla',1,17350,false),('cherry',1,17950,false),
('sparta',2,18550,false),('pearl',1,19150,false),('cylinderw',2,19750,false),('icecrown',2,20350,false),('hookah',1,21050,false),
('indianhat',2,21850,false),('bosscap',2,22750,false),('cognacglass',1,23750,false),('dollar',1,24850,false),('matreshka',1,26050,false),
('universal',1,27350,false),('easterrabbit',1,28750,false),('tequilashot',1,30250,false),('candy',1,31850,false),('knight',2,33550,false),
('orchid',1,35350,false),('lifestyle',1,37250,false),('honeybarrel',1,39250,false),('candyheartcup',1,41350,false),('hamburger',1,43550,false),
('clutch',1,45850,false),('friedpotatoes',1,48250,false),('vipring',1,0,true),('vipgold',3,0,true),('viproses',1,0,true),
('viplegbox',1,0,true),('vipkalash',1,0,true),('vipcock',2,0,true),('vipcrown',3,0,true),('viphorseshoe',1,0,true),
('vipchampagne',1,0,true),('blackrose',1,0,true),('blackcrown',3,0,true),('blackring',1,0,true)
on conflict (gift_type) do nothing;

insert into public.decor_prices (item, price) values
('turbodecor',500),('tourismdecor',500),('heartsdecor',500),('kissesdecor',500),('theatredecor',500),('cinemadecor',500),
('eastdecor',500),('westdecor',500),('lovedecor',500),('hatreddecor',500),('chipsdecor',500),('cardsdecor',500),('nightdecor',500),
('daydecor',500),('discodecor',500),('rockdecor',500),('fruitjellydecor',500),('carameldecor',500),('naturedecor',500),
('stonedecor',500),('violetdecor',500),('greendecor',500),('egyptdecor',500),('romedecor',500),('venusdecor',500),('marsdecor',500),
('icedecor',500),('lavadecor',500),('angel',500),('demon',500)
on conflict (item) do nothing;


-- Source: 0001_change_table.sql
create table public.table_history (
  user_id uuid not null references public.profiles(id) on delete cascade,
  room_id bigint not null references public.rooms(id) on delete cascade,
  visited_at timestamptz not null default now(),
  primary key (user_id, room_id)
);
GRANT SELECT ON public.table_history TO authenticated;
GRANT ALL ON public.table_history TO service_role;
grant select on public.table_history to authenticated;
grant all on public.table_history to service_role;
alter table public.table_history enable row level security;
create policy "own history read" on public.table_history for select to authenticated using (user_id = auth.uid());

create or replace function public._log_table_visit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.table_history(user_id, room_id) values (new.user_id, new.room_id)
  on conflict (user_id, room_id) do update set visited_at = now();
  return new;
end $$;
create trigger room_players_history after insert on public.room_players
for each row execute function public._log_table_visit();

create or replace function public.list_tables() returns table(room_id bigint, men int, women int)
language sql stable security definer set search_path = public as $$
  select h.room_id,
    (select count(*)::int from public.room_players p where p.room_id = h.room_id and p.seat % 2 = 1),
    (select count(*)::int from public.room_players p where p.room_id = h.room_id and p.seat % 2 = 0)
  from public.table_history h
  where h.user_id = auth.uid() and h.room_id is distinct from public.my_room()
  order by h.visited_at desc limit 10
$$;

-- Masa değiştir: belirtilen masaya ya da (boşsa) başka rastgele masaya, tek işlemde geçer.
create or replace function public.change_table(p_room bigint default null) returns table(room_id bigint, seat smallint)
language plpgsql security definer set search_path = public as $$
declare me public.profiles; cur bigint; rid bigint; s smallint; parity int;
begin
  select * into me from public.profiles where id = auth.uid();
  if not found then raise exception 'not signed in'; end if;
  parity := case when me.male then 1 else 0 end;
  select rp.room_id into cur from public.room_players rp where rp.user_id = me.id;
  if p_room is not null then
    if p_room = cur then raise exception 'Zaten bu masadasın'; end if;
    select r.id into rid from public.rooms r where r.id = p_room for update;
    if rid is null then raise exception 'Masa bulunamadı'; end if;
  else
    select r.id into rid from public.rooms r
     where r.id is distinct from cur
       and (select count(*) from public.room_players p where p.room_id = r.id and p.seat % 2 = parity) < 6
     order by random() limit 1 for update skip locked;
    if rid is null then insert into public.rooms default values returning id into rid; end if;
  end if;
  select g.s into s from generate_series(0,11) g(s)
   where g.s % 2 = parity and not exists (select 1 from public.room_players p where p.room_id = rid and p.seat = g.s)
   order by random() limit 1;
  if s is null then raise exception 'Masa dolu'; end if;
  delete from public.room_players where user_id = me.id;
  insert into public.room_players(room_id, seat, user_id) values (rid, s, me.id);
  update public.rooms set spinner = coalesce(spinner, s), phase_at = case when spinner is null then now() else phase_at end where id = rid;
  return query select rid, s;
end $$;

revoke all on function public._log_table_visit() from public, anon, authenticated;
grant execute on function public.list_tables(), public.change_table(bigint) to authenticated;


-- Source: 0002_player_starting_balance.sql
ALTER TABLE public.profiles ALTER COLUMN gold SET DEFAULT 10000;


-- Source: 0003_live_tables_realtime.sql
alter table public.room_players replica identity full;
create or replace function public.list_tables()
 returns table(room_id bigint, men integer, women integer)
 language sql stable security definer set search_path to 'public'
as $$
  with cur as (select public.my_room() as id),
  cand as (
    select h.room_id, 0 as grp, h.visited_at as ord from public.table_history h where h.user_id = auth.uid()
    union all
    select p.room_id, 1, max(p.joined_at) from public.room_players p group by p.room_id
  ),
  best as (select c.room_id, min(c.grp) grp, max(c.ord) ord from cand c, cur where c.room_id is distinct from cur.id group by c.room_id)
  select b.room_id,
    (select count(*)::int from public.room_players p where p.room_id = b.room_id and p.seat % 2 = 1),
    (select count(*)::int from public.room_players p where p.room_id = b.room_id and p.seat % 2 = 0)
  from best b order by b.grp, b.ord desc limit 20
$$;


-- Source: 0004_room_bottle_purchase.sql
alter table public.rooms add column if not exists bottle text not null default 'standart';
create table public.bottle_prices (bottle text primary key, price integer not null, vip_only boolean not null default false);
GRANT SELECT ON public.bottle_prices TO authenticated;
GRANT ALL ON public.bottle_prices TO service_role;
GRANT SELECT ON public.bottle_prices TO anon;
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


-- Source: 0005_list_tables_bottle_current.sql
drop function if exists public.list_tables();
create function public.list_tables()
 returns table(room_id bigint, men integer, women integer, bottle text, is_current boolean)
 language sql stable security definer set search_path to 'public'
as $$
  with cur as (select public.my_room() as id),
  cand as (
    select c.id as room_id, -1 as grp, now() as ord from cur c where c.id is not null
    union all
    select h.room_id, 0, h.visited_at from public.table_history h where h.user_id = auth.uid()
    union all
    select p.room_id, 1, max(p.joined_at) from public.room_players p group by p.room_id
  ),
  best as (select c.room_id, min(c.grp) grp, max(c.ord) ord from cand c group by c.room_id)
  select b.room_id,
    (select count(*)::int from public.room_players p where p.room_id = b.room_id and p.seat % 2 = 1),
    (select count(*)::int from public.room_players p where p.room_id = b.room_id and p.seat % 2 = 0),
    coalesce((select r.bottle from public.rooms r where r.id = b.room_id), 'standart'),
    b.grp = -1
  from best b order by b.grp, b.ord desc limit 20
$$;
grant execute on function public.list_tables() to authenticated;


-- Source: 0006_gestures_realtime.sql
alter table public.profiles add column if not exists tokens integer not null default 50;
create table public.gesture_prices (gesture text primary key, price integer not null, kisses_required integer not null default 0, vip_only boolean not null default false);
GRANT SELECT ON public.gesture_prices TO authenticated;
GRANT ALL ON public.gesture_prices TO service_role;
GRANT SELECT ON public.gesture_prices TO anon;
grant select on public.gesture_prices to anon, authenticated;
grant all on public.gesture_prices to service_role;
alter table public.gesture_prices enable row level security;
create policy "gesture prices read" on public.gesture_prices for select using (true);
insert into public.gesture_prices(gesture, price, kisses_required, vip_only) values
('agree',1,175,false), ('airkissges',3,0,false), ('angelges',3,20100,false), ('anger',1,1700,false), ('applause',1,28100,false), ('artistges',3,0,false), ('bandit',2,31100,false), ('barmanges',2,0,false), ('bayanistges',2,17700,false), ('beback',1,6900,false), ('beerges',3,0,false), ('binocularsges',2,0,false), ('bla',2,14100,false), ('bouqetges',3,0,false), ('bragging',2,90300,false), ('braggingvip',1,0,true), ('bunchofmoney',10,226300,false), ('bye',1,50,false), ('camouflageges',3,0,false), ('cannotspeak',2,16500,false), ('chocolateges',2,0,false), ('contempt',1,11700,false), ('cool',3,15300,false), ('crackerges',3,0,false), ('crazy',1,0,false), ('cry',1,385,false), ('dance',2,8100,false), ('defenderges',3,0,false), ('devil',3,21500,false), ('dikaprio',1,0,true), ('disagree',1,225,false), ('disco',3,0,false), ('dj',2,34500,false), ('dragonges',3,0,false), ('driving',2,148300,false), ('drunk',2,0,false), ('elvisges',2,0,false), ('explode',3,65100,false), ('facepalm',3,42500,false), ('famousges',3,0,false), ('fearful',2,81100,false), ('fk',5,209100,false), ('gentleman',2,135100,false), ('gratitude',1,2400,false), ('grinning',1,1100,false), ('grunt',1,18900,false), ('guitaristges',2,0,false), ('handround',2,10500,false), ('happy',1,70,false), ('heartface',3,52300,false), ('heartges',2,0,false), ('hello',1,30,false), ('jediges',3,0,false), ('jewelerges',3,0,false), ('jugglerges',3,0,false), ('kiss',3,3300,false), ('laugh',1,280,false), ('little',1,650,false), ('lookthroughges',2,0,false), ('loveges',2,25500,false), ('michael',3,0,false), ('mimistges',3,0,false), ('monkey',3,192700,false), ('muerteges',3,0,false), ('music',2,47100,false), ('nohearts',1,10,false), ('nurseges',3,0,false), ('ok',1,500,false), ('orangutanges',1,0,false), ('parrot',3,162300,false), ('party',2,38300,false), ('rap',3,0,false), ('rich',5,72700,false), ('rock',2,23300,false), ('sad',1,125,false), ('scream',2,111100,false), ('selfie',1,0,true), ('shy',1,800,false), ('sleepges',2,0,false), ('smoking',2,177100,false), ('snowballges',2,0,false), ('sparklerges',3,0,false), ('star',2,100300,false), ('stereoglassesges',2,0,false), ('strictges',2,0,false), ('sun',3,0,false), ('thumbdown',1,5700,false), ('thumbup',1,4500,false), ('tongue',1,1400,false), ('vomiting',3,12900,false), ('wall',2,122700,false), ('watermelonges',2,0,false), ('wink',1,9300,false), ('yawn',2,58300,false);
create table public.gesture_events (id bigint generated always as identity primary key, room_id bigint not null references public.rooms(id) on delete cascade, sender_id uuid not null references public.profiles(id) on delete cascade, gesture text not null, created_at timestamptz not null default now());
GRANT SELECT ON public.gesture_events TO authenticated;
GRANT ALL ON public.gesture_events TO service_role;
grant select on public.gesture_events to authenticated;
grant all on public.gesture_events to service_role;
alter table public.gesture_events enable row level security;
create policy "gestures read own room" on public.gesture_events for select to authenticated using (room_id = public.my_room());
alter publication supabase_realtime add table public.gesture_events;
create or replace function public.send_gesture(p_gesture text) returns integer language plpgsql security definer set search_path to 'public' as $$
declare rid bigint; g public.gesture_prices; me public.profiles;
begin
  select room_id into rid from public.room_players where user_id = auth.uid();
  if rid is null then raise exception 'not seated'; end if;
  select * into g from public.gesture_prices where gesture = p_gesture;
  if not found then raise exception 'unknown gesture'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if g.vip_only and (me.vip_until is null or me.vip_until < now()) then raise exception 'vip required'; end if;
  if me.kisses < g.kisses_required then raise exception 'kisses required'; end if;
  if me.tokens < g.price then raise exception 'insufficient tokens'; end if;
  update public.profiles set tokens = tokens - g.price where id = me.id;
  insert into public.gesture_events(room_id, sender_id, gesture) values (rid, me.id, p_gesture);
  return me.tokens - g.price;
end $$;
revoke execute on function public.send_gesture(text) from anon;


-- Source: 0007_token_bank.sql
create table public.token_prices (gold integer primary key, tokens integer not null);
GRANT SELECT ON public.token_prices TO authenticated;
GRANT ALL ON public.token_prices TO service_role;
GRANT SELECT ON public.token_prices TO anon;
grant select on public.token_prices to anon, authenticated;
grant all on public.token_prices to service_role;
alter table public.token_prices enable row level security;
create policy "token prices read" on public.token_prices for select using (true);
insert into public.token_prices(gold, tokens) values (180,450),(30,75),(10,25),(5,10),(2,3);
create or replace function public.buy_tokens(p_gold integer) returns integer language plpgsql security definer set search_path to 'public' as $$
declare me public.profiles; tp public.token_prices;
begin
  select * into tp from public.token_prices where gold = p_gold;
  if not found then raise exception 'not for sale'; end if;
  select * into me from public.profiles where id = auth.uid() for update;
  if not found then raise exception 'not signed in'; end if;
  if me.gold < tp.gold then raise exception 'insufficient gold'; end if;
  update public.profiles set gold = gold - tp.gold, tokens = tokens + tp.tokens where id = me.id;
  return me.tokens + tp.tokens;
end $$;
revoke execute on function public.buy_tokens(integer) from anon;


-- Source: 0008_daily_bonus.sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_bonus_day integer NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_bonus_on date;

-- DailyBonusPresenter: server sends gold_daily {day, gold_diff}; days 1..5 award 1..5 hearts.
CREATE OR REPLACE FUNCTION public.claim_daily_bonus()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); p record; today date := (now() AT TIME ZONE 'utc')::date; d integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT daily_bonus_day, daily_bonus_on INTO p FROM profiles WHERE id = uid FOR UPDATE;
  IF NOT FOUND OR p.daily_bonus_on = today THEN RETURN NULL; END IF;
  d := CASE WHEN p.daily_bonus_on = today - 1 THEN LEAST(p.daily_bonus_day + 1, 5) ELSE 1 END;
  UPDATE profiles SET daily_bonus_day = d, daily_bonus_on = today, gold = gold + d WHERE id = uid;
  RETURN jsonb_build_object('id', uid::text || ':' || today::text, 'day', d, 'gold_diff', d);
END $$;
REVOKE ALL ON FUNCTION public.claim_daily_bonus() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.claim_daily_bonus() TO authenticated;


-- Source: 0009_tops_achievements.sql
CREATE INDEX IF NOT EXISTS gesture_events_sender_idx ON public.gesture_events (sender_id, created_at);
CREATE INDEX IF NOT EXISTS gift_events_sender_idx ON public.gift_events (sender_id);
CREATE INDEX IF NOT EXISTS gift_events_receiver_idx ON public.gift_events (receiver_id);

-- TopDialog: total_kisses (lifetime counter) and gestures (event log, so periods are real).
CREATE OR REPLACE FUNCTION public.top_players(p_section text, p_period text DEFAULT '')
RETURNS TABLE(id uuid, name text, photo_url text, male boolean, score bigint, rank bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE since timestamptz := CASE p_period WHEN 'daily' THEN date_trunc('day', now()) WHEN 'weekly' THEN date_trunc('week', now()) WHEN 'monthly' THEN date_trunc('month', now()) ELSE NULL END;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF p_section = 'total_kisses' AND coalesce(p_period,'') = '' THEN
    RETURN QUERY WITH r AS (SELECT p.id, p.name, p.photo_url, p.male, p.kisses::bigint AS score,
      row_number() OVER (ORDER BY p.kisses DESC, p.id) AS rank FROM profiles p)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSIF p_section = 'gestures' THEN
    RETURN QUERY WITH c AS (SELECT sender_id, count(*)::bigint n FROM gesture_events WHERE since IS NULL OR created_at >= since GROUP BY sender_id),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.sender_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid() ORDER BY r.rank;
  ELSE
    RAISE EXCEPTION 'unsupported';
  END IF;
END $$;
REVOKE ALL ON FUNCTION public.top_players(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.top_players(text, text) TO authenticated;

CREATE TABLE public.achievement_acks (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  level integer NOT NULL,
  acknowledged_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id, level)
);
GRANT SELECT ON public.achievement_acks TO authenticated;
GRANT ALL ON public.achievement_acks TO service_role;
GRANT SELECT ON public.achievement_acks TO authenticated;
GRANT ALL ON public.achievement_acks TO service_role;
ALTER TABLE public.achievement_acks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own acks read" ON public.achievement_acks FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Levels from trusted counters and the original thresholds (assets.json counters).
CREATE OR REPLACE FUNCTION public.my_achievements()
RETURNS TABLE(achievement_id text, level integer, acknowledged_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); v record;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  FOR v IN
    SELECT 'celebrity' a, (SELECT kisses FROM profiles WHERE id = uid)::bigint n, ARRAY[20,80,250,750,1500] t
    UNION ALL SELECT 'heartofgold', (SELECT count(*) FROM gift_events WHERE sender_id = uid), ARRAY[25,1000,15000,125000,500000]
    UNION ALL SELECT 'courtesies', (SELECT count(*) FROM gift_events WHERE receiver_id = uid), ARRAY[50,2000,30000,250000,1000000]
    UNION ALL SELECT 'pantomime', (SELECT count(*) FROM gesture_events WHERE sender_id = uid), ARRAY[25,1000,15000,125000,500000]
    UNION ALL SELECT 'guru', (SELECT (now()::date - created_at::date) FROM profiles WHERE id = uid)::bigint, ARRAY[30,90,365]
  LOOP
    FOR i IN 1..array_length(v.t, 1) LOOP
      EXIT WHEN coalesce(v.n, 0) < v.t[i];
      achievement_id := v.a; level := i - 1;
      SELECT k.acknowledged_at INTO acknowledged_at FROM achievement_acks k WHERE k.user_id = uid AND k.achievement_id = v.a AND k.level = i - 1;
      RETURN NEXT;
    END LOOP;
  END LOOP;
END $$;
REVOKE ALL ON FUNCTION public.my_achievements() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.my_achievements() TO authenticated;

CREATE OR REPLACE FUNCTION public.ack_achievement(p_id text, p_level integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM my_achievements() m WHERE m.achievement_id = p_id AND m.level = p_level) THEN RAISE EXCEPTION 'not_completed'; END IF;
  INSERT INTO achievement_acks(user_id, achievement_id, level) VALUES (auth.uid(), p_id, p_level) ON CONFLICT DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.ack_achievement(text, integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.ack_achievement(text, integer) TO authenticated;


-- Source: 0010_dat_wallet.sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dat integer NOT NULL DEFAULT 10000;

CREATE TABLE public.gold_packages (real integer PRIMARY KEY, gold integer NOT NULL, bonus integer NOT NULL DEFAULT 0);
GRANT SELECT ON public.gold_packages TO authenticated;
GRANT ALL ON public.gold_packages TO service_role;
GRANT SELECT ON public.gold_packages TO anon;
GRANT SELECT ON public.gold_packages TO anon, authenticated;
GRANT ALL ON public.gold_packages TO service_role;
ALTER TABLE public.gold_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gold packages read" ON public.gold_packages FOR SELECT USING (true);
INSERT INTO public.gold_packages(real, gold, bonus) VALUES (10,10,0),(50,50,0),(100,100,10),(200,200,40),(500,500,150),(1000,1000,350),(5000,5000,1750);

CREATE TABLE public.vip_packages (id text PRIMARY KEY, price integer NOT NULL, days integer NOT NULL);
GRANT SELECT ON public.vip_packages TO authenticated;
GRANT ALL ON public.vip_packages TO service_role;
GRANT SELECT ON public.vip_packages TO anon;
GRANT SELECT ON public.vip_packages TO anon, authenticated;
GRANT ALL ON public.vip_packages TO service_role;
ALTER TABLE public.vip_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vip packages read" ON public.vip_packages FOR SELECT USING (true);
INSERT INTO public.vip_packages(id, price, days) VALUES ('vip7',120,7),('vip30',390,30);

CREATE OR REPLACE FUNCTION public.buy_gold(p_real integer)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); pk record; got integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO pk FROM gold_packages WHERE real = p_real;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  got := pk.gold + pk.bonus;
  UPDATE profiles SET dat = dat - pk.real, gold = gold + got WHERE id = uid AND dat >= pk.real;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  RETURN got;
END $$;
REVOKE ALL ON FUNCTION public.buy_gold(integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.buy_gold(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.buy_vip(p_option text)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); pk record; till timestamptz;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO pk FROM vip_packages WHERE id = p_option;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  UPDATE profiles SET dat = dat - pk.price,
    vip_until = greatest(coalesce(vip_until, now()), now()) + make_interval(days => pk.days)
  WHERE id = uid AND dat >= pk.price RETURNING vip_until INTO till;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  RETURN till;
END $$;
REVOKE ALL ON FUNCTION public.buy_vip(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.buy_vip(text) TO authenticated;


-- Source: 0011_premium_pass.sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_until timestamptz;
CREATE TABLE public.premium_packages (id text PRIMARY KEY, price integer NOT NULL, days integer NOT NULL);
GRANT SELECT ON public.premium_packages TO authenticated;
GRANT ALL ON public.premium_packages TO service_role;
GRANT SELECT ON public.premium_packages TO anon;
GRANT SELECT ON public.premium_packages TO anon, authenticated;
GRANT ALL ON public.premium_packages TO service_role;
ALTER TABLE public.premium_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "premium packages read" ON public.premium_packages FOR SELECT USING (true);
CREATE OR REPLACE FUNCTION public.buy_premium(p_option text DEFAULT 'pass30')
 RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE uid uuid := auth.uid(); pk record; till timestamptz;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO pk FROM premium_packages WHERE id = p_option;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_package'; END IF;
  UPDATE profiles SET dat = dat - pk.price,
    premium_until = greatest(coalesce(premium_until, now()), now()) + make_interval(days => pk.days)
  WHERE id = uid AND dat >= pk.price RETURNING premium_until INTO till;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  RETURN till;
END $$;
REVOKE EXECUTE ON FUNCTION public.buy_premium(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.buy_premium(text) TO authenticated;


-- Source: 0012_profile_stats_achievements.sql
CREATE OR REPLACE FUNCTION public.user_achievements(p_user uuid)
 RETURNS TABLE(achievement_id text, level integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  FOR v IN
    SELECT 'celebrity' a, (SELECT kisses FROM profiles WHERE id = p_user)::bigint n, ARRAY[20,80,250,750,1500] t
    UNION ALL SELECT 'heartofgold', (SELECT count(*) FROM gift_events WHERE sender_id = p_user), ARRAY[25,1000,15000,125000,500000]
    UNION ALL SELECT 'courtesies', (SELECT count(*) FROM gift_events WHERE receiver_id = p_user), ARRAY[50,2000,30000,250000,1000000]
    UNION ALL SELECT 'pantomime', (SELECT count(*) FROM gesture_events WHERE sender_id = p_user), ARRAY[25,1000,15000,125000,500000]
    UNION ALL SELECT 'guru', (SELECT (now()::date - created_at::date) FROM profiles WHERE id = p_user)::bigint, ARRAY[30,90,365]
  LOOP
    FOR i IN 1..array_length(v.t, 1) LOOP
      EXIT WHEN coalesce(v.n, 0) < v.t[i];
      achievement_id := v.a; level := i - 1;
      RETURN NEXT;
    END LOOP;
  END LOOP;
END $function$;

CREATE OR REPLACE FUNCTION public.user_profile_stats(p_user uuid)
 RETURNS jsonb
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE k bigint; kr bigint; g bigint; gr bigint;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT kisses INTO k FROM profiles WHERE id = p_user;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT count(*) + 1 INTO kr FROM profiles WHERE kisses > k;
  SELECT count(*) INTO g FROM gesture_events WHERE sender_id = p_user;
  SELECT count(*) + 1 INTO gr FROM (SELECT sender_id FROM gesture_events GROUP BY sender_id HAVING count(*) > g) s;
  RETURN jsonb_build_object(
    'total_kisses', k, 'total_kisses_rank', CASE WHEN k > 0 THEN kr END,
    'gestures', g, 'gestures_rank', CASE WHEN g > 0 THEN gr END,
    'dj_score', 0, 'price', 0, 'harem_price', 0);
END $function$;

REVOKE ALL ON FUNCTION public.user_achievements(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.user_profile_stats(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.user_achievements(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_profile_stats(uuid) TO authenticated;


-- Source: 0013_harem_and_blocks.sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS harem_owner uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS harem_value integer NOT NULL DEFAULT 0;

CREATE TABLE public.user_blocks (
  blocker uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker, blocked)
);
GRANT SELECT ON public.user_blocks TO authenticated;
GRANT ALL ON public.user_blocks TO service_role;
GRANT SELECT ON public.user_blocks TO authenticated;
GRANT ALL ON public.user_blocks TO service_role;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own blocks read" ON public.user_blocks FOR SELECT TO authenticated USING (blocker = auth.uid());
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_blocks;

CREATE OR REPLACE FUNCTION public.block_user(p_user uuid, p_block boolean DEFAULT true)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF p_user = auth.uid() THEN RETURN; END IF;
  IF p_block THEN INSERT INTO user_blocks(blocker, blocked) VALUES (auth.uid(), p_user) ON CONFLICT DO NOTHING;
  ELSE DELETE FROM user_blocks WHERE blocker = auth.uid() AND blocked = p_user; END IF;
END $$;
REVOKE ALL ON FUNCTION public.block_user(uuid, boolean) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.block_user(uuid, boolean) TO authenticated;

-- Original formatHarem: the purchase costs current price + 1, which becomes the new price.
CREATE OR REPLACE FUNCTION public.harem_purchase(p_target uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); t profiles; cost int; g int;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO t FROM profiles WHERE id = p_target FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_user'; END IF;
  IF t.harem_owner = uid THEN RAISE EXCEPTION 'already_owner'; END IF;
  IF p_target = uid AND t.harem_owner IS NULL THEN RAISE EXCEPTION 'no_owner'; END IF;
  cost := t.harem_value + 1;
  UPDATE profiles SET gold = gold - cost WHERE id = uid AND gold >= cost RETURNING gold INTO g;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_enough_gold'; END IF;
  UPDATE profiles SET harem_value = cost, harem_owner = CASE WHEN p_target = uid THEN NULL ELSE uid END WHERE id = p_target;
  RETURN jsonb_build_object('price', cost, 'gold', g);
END $$;
REVOKE ALL ON FUNCTION public.harem_purchase(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.harem_purchase(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.user_profile_stats(p_user uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE k bigint; kr bigint; g bigint; gr bigint; pr int; prr bigint; hp bigint; hpr bigint; o profiles; own uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT kisses, harem_value, harem_owner INTO k, pr, own FROM profiles WHERE id = p_user;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT count(*) + 1 INTO kr FROM profiles WHERE kisses > k;
  SELECT count(*) INTO g FROM gesture_events WHERE sender_id = p_user;
  SELECT count(*) + 1 INTO gr FROM (SELECT sender_id FROM gesture_events GROUP BY sender_id HAVING count(*) > g) s;
  SELECT count(*) + 1 INTO prr FROM profiles WHERE harem_value > pr;
  SELECT coalesce(sum(harem_value), 0) INTO hp FROM profiles WHERE harem_owner = p_user;
  SELECT count(*) + 1 INTO hpr FROM (SELECT harem_owner FROM profiles WHERE harem_owner IS NOT NULL GROUP BY harem_owner HAVING sum(harem_value) > hp) s;
  IF own IS NOT NULL THEN SELECT * INTO o FROM profiles WHERE id = own; END IF;
  RETURN jsonb_build_object(
    'total_kisses', k, 'total_kisses_rank', CASE WHEN k > 0 THEN kr END,
    'gestures', g, 'gestures_rank', CASE WHEN g > 0 THEN gr END,
    'dj_score', 0, 'price', pr, 'price_rank', CASE WHEN pr > 0 THEN prr END,
    'harem_price', hp, 'harem_price_rank', CASE WHEN hp > 0 THEN hpr END,
    'owner', CASE WHEN o.id IS NULL THEN NULL ELSE jsonb_build_object('id', o.id, 'name', o.name, 'male', o.male, 'photo_url', o.photo_url) END);
END $$;


-- Source: 0014_live_departure_sync.sql
CREATE OR REPLACE FUNCTION public._sync_departed_room()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.room_tick(OLD.room_id);
  ELSIF OLD.room_id IS DISTINCT FROM NEW.room_id THEN
    PERFORM public.room_tick(OLD.room_id);
  END IF;
  RETURN NULL;
END $$;
REVOKE ALL ON FUNCTION public._sync_departed_room() FROM public, anon, authenticated;
CREATE TRIGGER room_players_departure AFTER DELETE OR UPDATE OF room_id ON public.room_players FOR EACH ROW EXECUTE FUNCTION public._sync_departed_room();
ALTER TABLE public.room_players REPLICA IDENTITY FULL;
ALTER TABLE public.user_blocks REPLICA IDENTITY FULL;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['rooms','room_players','profiles','chat_messages','gift_events','gesture_events','user_blocks'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;


-- Catalogue entries installed outside historical DDL, required on fresh projects.
INSERT INTO public.premium_packages(id, price, days) VALUES ('pass30',499,30)
ON CONFLICT (id) DO UPDATE SET price=excluded.price, days=excluded.days;
INSERT INTO public.bottle_prices(bottle, price, vip_only) VALUES
('autumn',5,false),('baby',5,false),('champagnebot',5,false),('cognac',5,false),
('cola',5,false),('jackdaniels',5,false),('ketchup',5,false),('lemonade',5,false),
('martinibot',5,false),('milkbot',5,false),('nybottle',3,false),('pirate',5,false),
('ship',5,false),('skeleton',5,false),('skewer',5,false),('spring',5,false),
('sprite',5,false),('standart',5,false),('summer',5,false),('vipbottle',5,true)
ON CONFLICT (bottle) DO UPDATE SET price=excluded.price, vip_only=excluded.vip_only;

-- PostgreSQL grants EXECUTE to PUBLIC by default. Close that implicit access.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_room(), public.leave_room(), public.heartbeat(),
public.room_tick(bigint), public.spin_bottle(), public.decide(boolean),
public.send_chat(text,uuid), public.send_gift(text,uuid[],integer), public.send_gesture(text),
public.my_room(), public.server_now(), public.list_tables(), public.change_table(bigint),
public.buy_bottle(text), public.buy_decor(text), public.set_decor(text,text),
public.play_music(text,jsonb), public.buy_tokens(integer), public.claim_daily_bonus(),
public.buy_gold(integer), public.buy_vip(text), public.buy_premium(text),
public.top_players(text,text), public.my_achievements(), public.ack_achievement(text,integer),
public.user_achievements(uuid), public.user_profile_stats(uuid),
public.block_user(uuid,boolean), public.harem_purchase(uuid) TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Source: 0015_statuses.sql
-- WhatsApp-style statuses (text / image / video) with likes and comments.
-- Statuses are hidden exactly 24 hours after creation (RLS + feed filter) and purged by pg_cron.
-- Idempotent: safe to run on Lovable Cloud and on the self-hosted VPS database.

create table if not exists public.statuses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('text','image','video')),
  body text check (body is null or char_length(body) <= 700),
  media_path text,
  bg text not null default 'emerald' check (char_length(bg) <= 20),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  check ((kind = 'text' and body is not null and char_length(btrim(body)) > 0) or (kind <> 'text' and media_path is not null))
);
create index if not exists statuses_expires_idx on public.statuses (expires_at);
create index if not exists statuses_user_idx on public.statuses (user_id, created_at desc);

create table if not exists public.status_likes (
  status_id uuid not null references public.statuses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (status_id, user_id)
);

create table if not exists public.status_comments (
  id uuid primary key default gen_random_uuid(),
  status_id uuid not null references public.statuses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 300),
  created_at timestamptz not null default now()
);
create index if not exists status_comments_status_idx on public.status_comments (status_id, created_at);

-- Clients can never choose their own lifetime: the server stamps it.
create or replace function public.status_stamp_times() returns trigger
language plpgsql set search_path = public as $$
begin
  new.created_at := now();
  new.expires_at := now() + interval '24 hours';
  return new;
end $$;
drop trigger if exists statuses_stamp_times on public.statuses;
create trigger statuses_stamp_times before insert on public.statuses
for each row execute function public.status_stamp_times();

grant select, insert, delete on public.statuses to authenticated;
grant select, insert, delete on public.status_likes to authenticated;
grant select, insert, delete on public.status_comments to authenticated;
grant all on public.statuses, public.status_likes, public.status_comments to service_role;

alter table public.statuses enable row level security;
alter table public.status_likes enable row level security;
alter table public.status_comments enable row level security;

drop policy if exists "status read live" on public.statuses;
create policy "status read live" on public.statuses for select to authenticated
  using (expires_at > now() or user_id = auth.uid());
drop policy if exists "status insert own" on public.statuses;
create policy "status insert own" on public.statuses for insert to authenticated
  with check (user_id = auth.uid() and (media_path is null or split_part(media_path, '/', 1) = auth.uid()::text));
drop policy if exists "status delete own" on public.statuses;
create policy "status delete own" on public.statuses for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists "status like read" on public.status_likes;
create policy "status like read" on public.status_likes for select to authenticated
  using (exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now()));
drop policy if exists "status like own" on public.status_likes;
create policy "status like own" on public.status_likes for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now()));
drop policy if exists "status unlike own" on public.status_likes;
create policy "status unlike own" on public.status_likes for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists "status comment read" on public.status_comments;
create policy "status comment read" on public.status_comments for select to authenticated
  using (exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now()));
drop policy if exists "status comment own" on public.status_comments;
create policy "status comment own" on public.status_comments for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.statuses s where s.id = status_id and s.expires_at > now()));
drop policy if exists "status comment delete" on public.status_comments;
create policy "status comment delete" on public.status_comments for delete to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.statuses s where s.id = status_id and s.user_id = auth.uid()));

-- Feed with author and counters in one round trip (runs with the caller's RLS).
create or replace function public.status_feed()
returns table (id uuid, user_id uuid, kind text, body text, media_path text, bg text,
  created_at timestamptz, expires_at timestamptz, author_name text, author_photo text,
  like_count bigint, comment_count bigint, liked boolean)
language sql stable security invoker set search_path = public as $$
  select s.id, s.user_id, s.kind, s.body, s.media_path, s.bg, s.created_at, s.expires_at,
    p.name, p.photo_url,
    (select count(*) from public.status_likes l where l.status_id = s.id),
    (select count(*) from public.status_comments c where c.status_id = s.id),
    exists (select 1 from public.status_likes l where l.status_id = s.id and l.user_id = auth.uid())
  from public.statuses s join public.profiles p on p.id = s.user_id
  where s.expires_at > now()
  order by s.created_at desc
  limit 300;
$$;
revoke execute on function public.status_feed() from public, anon;
grant execute on function public.status_feed() to authenticated;

-- Private media bucket: 50 MB, images and videos only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('statuses', 'statuses', false, 52428800,
  array['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do nothing;

drop policy if exists "status media read" on storage.objects;
create policy "status media read" on storage.objects for select to authenticated
  using (bucket_id = 'statuses' and (split_part(name, '/', 1) = auth.uid()::text
    or exists (select 1 from public.statuses s where s.media_path = name and s.expires_at > now())));
drop policy if exists "status media write own" on storage.objects;
create policy "status media write own" on storage.objects for insert to authenticated
  with check (bucket_id = 'statuses' and split_part(name, '/', 1) = auth.uid()::text);
drop policy if exists "status media delete own" on storage.objects;
create policy "status media delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'statuses' and split_part(name, '/', 1) = auth.uid()::text);

-- Automatic purge of expired statuses (and their media rows).
create or replace function public.purge_expired_statuses() returns void
language plpgsql security definer set search_path = public as $$
begin
  begin
    perform set_config('storage.allow_delete_query', 'true', true);
    delete from storage.objects o using public.statuses s
      where o.bucket_id = 'statuses' and o.name = s.media_path and s.expires_at < now();
  exception when others then null;
  end;
  delete from public.statuses where expires_at < now();
end $$;
revoke execute on function public.purge_expired_statuses() from public, anon, authenticated;

do $$
begin
  create extension if not exists pg_cron;
  perform cron.unschedule(jobid) from cron.job where jobname = 'purge-expired-statuses';
  perform cron.schedule('purge-expired-statuses', '*/10 * * * *', 'select public.purge_expired_statuses()');
exception when others then
  raise notice 'pg_cron unavailable, statuses still hide after 24h: %', sqlerrm;
end $$;
