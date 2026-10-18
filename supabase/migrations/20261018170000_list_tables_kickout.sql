-- Telegram client 1.6.393: ChangeTableDialog entries carry the viewer's kicked state
-- (unkick_ts + kicker_user); tapping a counting-down table opens the kickout info dialog.
drop function if exists public.list_tables();
create function public.list_tables()
 returns table(room_id bigint, men integer, women integer, bottle text, is_current boolean,
               blocked_until timestamptz, kicker_id uuid, kicker_name text, kicker_photo text, kicker_male boolean)
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
    b.grp = -1,
    kt.blocked_until,
    kp.id,
    kp.name,
    kp.photo_url,
    kp.male
  from best b
  left join public.kickout_targets kt
    on kt.room_id = b.room_id and kt.user_id = auth.uid() and kt.blocked_until > now()
  left join public.profiles kp on kp.id = kt.kicked_by
  order by b.grp, b.ord desc limit 20
$$;
grant execute on function public.list_tables() to authenticated;
