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