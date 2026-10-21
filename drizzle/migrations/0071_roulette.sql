-- Original visual sector catalogue; probabilities and pricing are local admin configuration,
-- not claimed to be the reference site's private server rules. Disabled until configured.
create table public.roulette_config (
 id integer primary key check(id=1), enabled boolean not null default false,
 spin_cost integer not null check(spin_cost between 1 and 10000),
 daily_chances integer not null check(daily_chances between 0 and 10000),
 bundle_chances integer not null check(bundle_chances between 1 and 10000),
 bundle_dat integer not null check(bundle_dat between 1 and 1000000),
 revision integer not null default 0, updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
grant select on public.roulette_config to authenticated;
grant all on public.roulette_config to service_role;
alter table public.roulette_config enable row level security;
create policy "roulette config read" on public.roulette_config for select to authenticated using (true);
insert into public.roulette_config(id,spin_cost,daily_chances,bundle_chances,bundle_dat) values(1,1,0,10,10);

create table public.roulette_prizes (
 id integer primary key check(id between 0 and 15), image text not null,
 amount integer not null check(amount>0), probability_bp integer not null check(probability_bp between 0 and 10000)
);
grant select on public.roulette_prizes to authenticated;
grant all on public.roulette_prizes to service_role;
alter table public.roulette_prizes enable row level security;
create policy "roulette prizes read" on public.roulette_prizes for select to authenticated using (true);
insert into public.roulette_prizes(id,image,amount,probability_bp) values
 (0,'chances',3,625),(1,'tokens',100,625),(2,'kiss_fire',3,625),(3,'gold',10,625),
 (4,'tokens',5,625),(5,'league5',1,625),(6,'gold',3,625),(7,'chances',1,625),
 (8,'tokens',1000,625),(9,'kiss_fire',3,625),(10,'gold',25,625),(11,'tokens',3,625),
 (12,'league_kiss2x',1,625),(13,'gold',5,625),(14,'tokens',25,625),(15,'refuse_slap',1,625);

create table public.roulette_accounts (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 chances integer not null default 0 check(chances>=0), daily_claimed date
);
grant select on public.roulette_accounts to authenticated;
grant all on public.roulette_accounts to service_role;
alter table public.roulette_accounts enable row level security;
create policy "roulette account own" on public.roulette_accounts for select to authenticated using(user_id=auth.uid());

create table public.roulette_events (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 request_id uuid not null, action text not null check(action in ('spin','buy')),
 prize_id integer references public.roulette_prizes(id), response jsonb not null,
 created_at timestamptz not null default now(), unique(user_id,request_id)
);
grant select on public.roulette_events to authenticated;
grant all on public.roulette_events to service_role;
alter table public.roulette_events enable row level security;
create policy "roulette events own" on public.roulette_events for select to authenticated using(user_id=auth.uid());

create or replace function public.roulette_info() returns jsonb
language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid(); c public.roulette_config; a public.roulette_accounts; prizes jsonb;
begin
 if u is null then raise exception 'not authenticated'; end if;
 select * into c from public.roulette_config where id=1;
 insert into public.roulette_accounts(user_id) values(u) on conflict do nothing;
 select * into a from public.roulette_accounts where user_id=u;
 select jsonb_agg(jsonb_build_object('id',id::text,'image',image,'count',amount) order by id) into prizes from public.roulette_prizes;
 return jsonb_build_object('enabled',c.enabled,'freeSpins',a.chances + case when c.enabled and a.daily_claimed is distinct from (now() at time zone 'Asia/Baku')::date then c.daily_chances else 0 end,
 'price',c.spin_cost,'bundleChances',c.bundle_chances,'bundleDat',c.bundle_dat,'revision',c.revision,'prizes',prizes);
end $$;
revoke all on function public.roulette_info() from public, anon;
grant execute on function public.roulette_info() to authenticated;

create or replace function public.roulette_action(p_request uuid,p_action text,p_revision integer) returns jsonb
language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid(); c public.roulette_config; a public.roulette_accounts; p public.roulette_prizes;
 result jsonb; prior public.roulette_events; ticket integer; total integer; eid uuid:=gen_random_uuid(); today date:=(now() at time zone 'Asia/Baku')::date;
begin
 if u is null then raise exception 'not authenticated'; end if;
 if public.is_banned(u) then raise exception 'user_banned'; end if;
 if p_request is null or p_action not in ('spin','buy') then raise exception 'Əməliyyat düzgün deyil.'; end if;
 -- Profile lock serializes wallet spending with every other purchase and concurrent spins.
 perform 1 from public.profiles where id=u for update;
 if not found then raise exception 'unknown_user'; end if;
 select * into prior from public.roulette_events where user_id=u and request_id=p_request;
 if found then
  if prior.action<>p_action then raise exception 'Əməliyyat düzgün deyil.'; end if;
  return prior.response;
 end if;
 -- Shared config lock freezes the odds/catalogue while admins replace all percentages atomically.
 select * into c from public.roulette_config where id=1 for share;
 if not c.enabled then raise exception 'Çarx hazırda bağlıdır.'; end if;
 if p_revision is distinct from c.revision then raise exception 'Çarx ayarları dəyişib. Yenidən açın.'; end if;
 insert into public.roulette_accounts(user_id) values(u) on conflict do nothing;
 select * into a from public.roulette_accounts where user_id=u for update;
 if a.daily_claimed is distinct from today then
  a.chances:=a.chances+c.daily_chances;
  update public.roulette_accounts set chances=a.chances,daily_claimed=today where user_id=u;
 end if;
 if p_action='buy' then
  update public.profiles set dat=dat-c.bundle_dat where id=u and dat>=c.bundle_dat;
  if not found then raise exception 'insufficient_dat'; end if;
  update public.roulette_accounts set chances=chances+c.bundle_chances where user_id=u;
  result:=jsonb_build_object('confirmed',true);
 else
  if a.chances<c.spin_cost then raise exception 'Çarx şansın kifayət etmir.'; end if;
  select sum(probability_bp) into total from public.roulette_prizes;
  if total<>10000 then raise exception 'Ehtimalların cəmi 100%% olmalıdır.'; end if;
  -- Server random ticket over exact basis-point intervals; zero has no interval, 100% covers all tickets.
  ticket:=floor(random()*10000)::integer;
  select r.* into p from public.roulette_prizes r join
   (select id,sum(probability_bp) over(order by id) as upper_bound from public.roulette_prizes) b using(id)
   where r.probability_bp>0 and ticket<b.upper_bound order by r.id limit 1;
  if not found then raise exception 'Çarx mükafatı tapılmadı.'; end if;
  update public.roulette_accounts set chances=chances-c.spin_cost where user_id=u;
  if p.image='gold' then update public.profiles set gold=gold+p.amount where id=u;
  elsif p.image='tokens' then update public.profiles set tokens=tokens+p.amount where id=u;
  elsif p.image='chances' then update public.roulette_accounts set chances=chances+p.amount where user_id=u;
  elsif p.image in ('kiss_fire','refuse_slap','league5','league_kiss2x') then
   insert into public.user_boosters(user_id,booster,count) values(u,p.image,p.amount)
   on conflict(user_id,booster) do update set count=user_boosters.count+excluded.count;
  else raise exception 'Çarx mükafatı düzgün deyil.'; end if;
  result:=jsonb_build_object('confirmed',true,'rewardIndex',p.id,'rewards',jsonb_build_array(jsonb_build_object('id',eid::text,'image',p.image,'count',p.amount)));
 end if;
 insert into public.roulette_events(id,user_id,request_id,action,prize_id,response) values(eid,u,p_request,p_action,case when p_action='spin' then p.id else null end,result);
 return result;
end $$;
revoke all on function public.roulette_action(uuid,text,integer) from public,anon;
grant execute on function public.roulette_action(uuid,text,integer) to authenticated;

create or replace function public.admin_roulette_save(p_config jsonb) returns integer
language plpgsql security definer set search_path=public as $$
declare rev integer; entries jsonb:=p_config->'prizes'; s integer; n integer; distinct_n integer;
begin
 if auth.uid() is null or not public.has_role(auth.uid(),'admin') then raise exception 'forbidden'; end if;
 select revision into rev from public.roulette_config where id=1 for update;
 if rev is distinct from (p_config->>'revision')::integer then raise exception 'Ayarlar dəyişib. Səhifəni yeniləyin.'; end if;
 if jsonb_typeof(entries)<>'array' or jsonb_array_length(entries)<>16 then raise exception 'Bütün 16 mükafat göstərilməlidir.'; end if;
 select sum(round((e->>'percentage')::numeric*100)),count(*),count(distinct (e->>'id')::int) into s,n,distinct_n from jsonb_array_elements(entries) e;
 if s is distinct from 10000 or n<>16 or distinct_n<>16 or exists(select 1 from jsonb_array_elements(entries) e where (e->>'id')::integer not between 0 and 15 or (e->>'percentage')::numeric not between 0 and 100 or (e->>'percentage')::numeric*100<>round((e->>'percentage')::numeric*100) or e->>'percentage' is null or e->>'id' is null) then raise exception 'Ehtimalların cəmi 100%% olmalıdır.'; end if;
 update public.roulette_config set enabled=(p_config->>'enabled')::boolean,spin_cost=(p_config->>'spinCost')::int,daily_chances=(p_config->>'dailyChances')::int,
 bundle_chances=(p_config->>'bundleChances')::int,bundle_dat=(p_config->>'bundleDat')::int,revision=revision+1,updated_by=auth.uid(),updated_at=now() where id=1;
 update public.roulette_prizes r set probability_bp=round((e->>'percentage')::numeric*100)::int from jsonb_array_elements(entries) e where r.id=(e->>'id')::int;
 return rev+1;
end $$;
revoke all on function public.admin_roulette_save(jsonb) from public,anon;
grant execute on function public.admin_roulette_save(jsonb) to authenticated;