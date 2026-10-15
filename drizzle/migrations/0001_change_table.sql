create table public.table_history (
  user_id uuid not null references public.profiles(id) on delete cascade,
  room_id bigint not null references public.rooms(id) on delete cascade,
  visited_at timestamptz not null default now(),
  primary key (user_id, room_id)
);
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