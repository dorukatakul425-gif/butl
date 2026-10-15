create table public.token_prices (gold integer primary key, tokens integer not null);
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