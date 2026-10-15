alter table public.profiles add column if not exists tokens integer not null default 50;
create table public.gesture_prices (gesture text primary key, price integer not null, kisses_required integer not null default 0, vip_only boolean not null default false);
grant select on public.gesture_prices to anon, authenticated;
grant all on public.gesture_prices to service_role;
alter table public.gesture_prices enable row level security;
create policy "gesture prices read" on public.gesture_prices for select using (true);
insert into public.gesture_prices(gesture, price, kisses_required, vip_only) values
('agree',1,175,false), ('airkissges',3,0,false), ('angelges',3,20100,false), ('anger',1,1700,false), ('applause',1,28100,false), ('artistges',3,0,false), ('bandit',2,31100,false), ('barmanges',2,0,false), ('bayanistges',2,17700,false), ('beback',1,6900,false), ('beerges',3,0,false), ('binocularsges',2,0,false), ('bla',2,14100,false), ('bouqetges',3,0,false), ('bragging',2,90300,false), ('braggingvip',1,0,true), ('bunchofmoney',10,226300,false), ('bye',1,50,false), ('camouflageges',3,0,false), ('cannotspeak',2,16500,false), ('chocolateges',2,0,false), ('contempt',1,11700,false), ('cool',3,15300,false), ('crackerges',3,0,false), ('crazy',1,0,false), ('cry',1,385,false), ('dance',2,8100,false), ('defenderges',3,0,false), ('devil',3,21500,false), ('dikaprio',1,0,true), ('disagree',1,225,false), ('disco',3,0,false), ('dj',2,34500,false), ('dragonges',3,0,false), ('driving',2,148300,false), ('drunk',2,0,false), ('elvisges',2,0,false), ('explode',3,65100,false), ('facepalm',3,42500,false), ('famousges',3,0,false), ('fearful',2,81100,false), ('fk',5,209100,false), ('gentleman',2,135100,false), ('gratitude',1,2400,false), ('grinning',1,1100,false), ('grunt',1,18900,false), ('guitaristges',2,0,false), ('handround',2,10500,false), ('happy',1,70,false), ('heartface',3,52300,false), ('heartges',2,0,false), ('hello',1,30,false), ('jediges',3,0,false), ('jewelerges',3,0,false), ('jugglerges',3,0,false), ('kiss',3,3300,false), ('laugh',1,280,false), ('little',1,650,false), ('lookthroughges',2,0,false), ('loveges',2,25500,false), ('michael',3,0,false), ('mimistges',3,0,false), ('monkey',3,192700,false), ('muerteges',3,0,false), ('music',2,47100,false), ('nohearts',1,10,false), ('nurseges',3,0,false), ('ok',1,500,false), ('orangutanges',1,0,false), ('parrot',3,162300,false), ('party',2,38300,false), ('rap',3,0,false), ('rich',5,72700,false), ('rock',2,23300,false), ('sad',1,125,false), ('scream',2,111100,false), ('selfie',1,0,true), ('shy',1,800,false), ('sleepges',2,0,false), ('smoking',2,177100,false), ('snowballges',2,0,false), ('sparklerges',3,0,false), ('star',2,100300,false), ('stereoglassesges',2,0,false), ('strictges',2,0,false), ('sun',3,0,false), ('thumbdown',1,5700,false), ('thumbup',1,4500,false), ('tongue',1,1400,false), ('vomiting',3,12900,false), ('wall',2,122700,false), ('watermelonges',2,0,false), ('wink',1,9300,false), ('yawn',2,58300,false);
create table public.gesture_events (id bigint generated always as identity primary key, room_id bigint not null references public.rooms(id) on delete cascade, sender_id uuid not null references public.profiles(id) on delete cascade, gesture text not null, created_at timestamptz not null default now());
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