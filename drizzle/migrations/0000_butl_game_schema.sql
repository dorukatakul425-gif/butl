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
create table if not exists public.room_players (
  room_id bigint not null references public.rooms(id) on delete cascade,
  seat smallint not null check (seat between 0 and 11),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  last_seen timestamptz not null default now(),
  joined_at timestamptz not null default now(),
  primary key (room_id, seat)
);
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  room_id bigint not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete set null,
  text text not null check (char_length(text) between 1 and 300),
  created_at timestamptz not null default now()
);
create table if not exists public.gift_prices (
  gift_type text primary key,
  price int not null check (price >= 0),
  kisses_required int not null default 0,
  vip_only boolean not null default false
);
create table if not exists public.gift_events (
  id bigint generated always as identity primary key,
  room_id bigint not null references public.rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  gift_type text not null references public.gift_prices(gift_type),
  seed int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.decor_prices (
  item text primary key,
  price int not null check (price > 0)
);

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