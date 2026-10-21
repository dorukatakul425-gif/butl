-- Room-scoped realtime: every game event is published once to the butl WebSocket hub
-- (LISTEN butl_rt). The hub routes it only to sockets allowed to see it, replacing
-- global postgres_changes fan-out. Notification failures never block game writes.
create or replace function public._rt_notify() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  r jsonb; o jsonb; rooms text[]; extra jsonb := '{}'::jsonb; p text; k text;
begin
  begin
    if TG_OP <> 'DELETE' then r := to_jsonb(NEW); end if;
    if TG_OP <> 'INSERT' then o := to_jsonb(OLD); end if;
    if TG_TABLE_NAME = 'rooms' then
      rooms := array[(r->>'id')];
      if (o->>'bottle') is distinct from (r->>'bottle') then extra := jsonb_build_object('bottle_changed', true); end if;
    elsif TG_TABLE_NAME = 'profiles' then
      select array_agg(rp.room_id::text) into rooms from public.room_players rp where rp.user_id = (r->>'id')::uuid;
      if rooms is null then return null; end if;
    elsif TG_TABLE_NAME = 'premium_gift_events' then
      rooms := array[]::text[];
    else
      rooms := array_remove(array[r->>'room_id', o->>'room_id'], null);
      if TG_TABLE_NAME = 'room_players' and (r->>'room_id') is not distinct from (o->>'room_id') then rooms := array[r->>'room_id']; end if;
    end if;
    if TG_TABLE_NAME = 'chat_messages' and TG_OP = 'INSERT' then
      extra := jsonb_build_object('banned', coalesce(public.is_banned(NEW.user_id), false));
    end if;
    p := (jsonb_build_object('t', TG_TABLE_NAME, 'op', TG_OP, 'rooms', to_jsonb(rooms), 'new', r, 'old', o) || extra)::text;
    if octet_length(p) > 7800 then
      k := coalesce(r->>'id', o->>'id', r->>'user_id', o->>'user_id');
      p := (jsonb_build_object('t', TG_TABLE_NAME, 'op', TG_OP, 'rooms', to_jsonb(rooms), 'big', true, 'key', k,
        'old', case when TG_TABLE_NAME = 'room_players' then jsonb_build_object('user_id', o->>'user_id', 'room_id', o->>'room_id', 'seat', o->'seat', 'kisses', o->'kisses') else null end) || extra)::text;
    end if;
    perform pg_notify('butl_rt', p);
  exception when others then
    null;
  end;
  return null;
end $$;
revoke all on function public._rt_notify() from public, anon, authenticated;

drop trigger if exists _rt_rooms on public.rooms;
create trigger _rt_rooms after update on public.rooms for each row execute function public._rt_notify();
drop trigger if exists _rt_room_players on public.room_players;
create trigger _rt_room_players after insert or update or delete on public.room_players for each row execute function public._rt_notify();
drop trigger if exists _rt_chat on public.chat_messages;
create trigger _rt_chat after insert or delete on public.chat_messages for each row execute function public._rt_notify();
drop trigger if exists _rt_kickout on public.kickout_events;
create trigger _rt_kickout after insert on public.kickout_events for each row execute function public._rt_notify();
drop trigger if exists _rt_gifts on public.gift_events;
create trigger _rt_gifts after insert on public.gift_events for each row execute function public._rt_notify();
drop trigger if exists _rt_premium on public.premium_gift_events;
create trigger _rt_premium after insert on public.premium_gift_events for each row execute function public._rt_notify();
drop trigger if exists _rt_gestures on public.gesture_events;
create trigger _rt_gestures after insert on public.gesture_events for each row execute function public._rt_notify();
drop trigger if exists _rt_profiles on public.profiles;
create trigger _rt_profiles after update on public.profiles for each row execute function public._rt_notify();
