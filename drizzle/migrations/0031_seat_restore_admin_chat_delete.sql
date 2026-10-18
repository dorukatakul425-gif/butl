-- Reload keeps the player's table and seat: leave_room remembers the seat, and
-- join_room gives it back when the player returns within 2 minutes and it is still free.
create table if not exists public.last_seats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  room_id bigint not null references public.rooms(id) on delete cascade,
  seat smallint not null,
  left_at timestamptz not null default now()
);
alter table public.last_seats enable row level security;
grant all on public.last_seats to service_role;

create or replace function public.leave_room() returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into public.last_seats(user_id, room_id, seat, left_at)
    select user_id, room_id, seat, now() from public.room_players where user_id = auth.uid()
  on conflict (user_id) do update set room_id = excluded.room_id, seat = excluded.seat, left_at = excluded.left_at;
  delete from public.room_players where user_id = auth.uid();
end $$;

create or replace function public.join_room() returns table(room_id bigint, seat smallint)
language plpgsql security definer set search_path = public as $$
declare me public.profiles; rid bigint; s smallint; parity int; ls public.last_seats;
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
  select * into ls from public.last_seats where user_id = me.id and left_at > now() - interval '2 minutes';
  if found and ls.seat % 2 = parity
     and not exists (select 1 from public.room_players p where p.room_id = ls.room_id and p.seat = ls.seat) then
    begin
      insert into public.room_players(room_id, seat, user_id) values (ls.room_id, ls.seat, me.id);
      delete from public.last_seats where user_id = me.id;
      update public.rooms set spinner = coalesce(spinner, ls.seat), phase_at = case when spinner is null then now() else phase_at end where id = ls.room_id;
      return query select ls.room_id, ls.seat; return;
    exception when others then null; -- banned from that table or seat just taken: pick a new one
    end;
  end if;
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
revoke all on function public.join_room(), public.leave_room() from public, anon;
grant execute on function public.join_room(), public.leave_room() to authenticated;

-- Admins delete chat messages: the row disappears for everyone, no trace left in the chat.
create or replace function public.admin_delete_chat(p_id bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  delete from public.chat_messages where id = p_id;
end $$;
revoke all on function public.admin_delete_chat(bigint) from public, anon;
grant execute on function public.admin_delete_chat(bigint) to authenticated;
