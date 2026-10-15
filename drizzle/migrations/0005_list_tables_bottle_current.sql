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