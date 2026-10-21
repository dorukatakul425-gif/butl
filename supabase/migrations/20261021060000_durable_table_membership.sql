-- Durable table preference, bounded live membership, and refresh-safe resumption.
-- Two minutes is our reconnect grace, not a claim about the reference server's private timeout.
CREATE OR REPLACE FUNCTION public._remember_table_membership() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=OLD.user_id) OR NOT EXISTS(SELECT 1 FROM public.rooms WHERE id=OLD.room_id) THEN RETURN OLD; END IF;
    INSERT INTO public.last_seats(user_id,room_id,seat,left_at) VALUES(OLD.user_id,OLD.room_id,OLD.seat,now())
    ON CONFLICT(user_id) DO UPDATE SET room_id=excluded.room_id,seat=excluded.seat,left_at=excluded.left_at;
    RETURN OLD;
  END IF;
  INSERT INTO public.last_seats(user_id,room_id,seat,left_at) VALUES(NEW.user_id,NEW.room_id,NEW.seat,now())
  ON CONFLICT(user_id) DO UPDATE SET room_id=excluded.room_id,seat=excluded.seat,left_at=excluded.left_at;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public._remember_table_membership() FROM public,anon,authenticated;
CREATE TRIGGER remember_table_membership AFTER INSERT OR DELETE OR UPDATE OF room_id,seat ON public.room_players
FOR EACH ROW EXECUTE FUNCTION public._remember_table_membership();
INSERT INTO public.last_seats(user_id,room_id,seat,left_at) SELECT user_id,room_id,seat,now() FROM public.room_players
ON CONFLICT(user_id) DO UPDATE SET room_id=excluded.room_id,seat=excluded.seat,left_at=excluded.left_at;

CREATE OR REPLACE FUNCTION public.join_room() RETURNS TABLE(room_id bigint,seat smallint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE me public.profiles; rid bigint; s smallint; parity int; ls public.last_seats;
BEGIN
  -- Same-account refreshes serialize before checking or allocating membership.
  SELECT * INTO me FROM public.profiles WHERE id=auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Oyuna daxil olmalısan.'; END IF;
  parity:=CASE WHEN me.male THEN 1 ELSE 0 END;
  SELECT rp.room_id,rp.seat INTO rid,s FROM public.room_players rp WHERE rp.user_id=me.id;
  IF rid IS NOT NULL THEN
    PERFORM public._kickout_finalize(rid);
    IF EXISTS(SELECT 1 FROM public.room_players WHERE user_id=me.id) THEN
      UPDATE public.room_players SET last_seen=now() WHERE user_id=me.id;
      RETURN QUERY SELECT rid,s; RETURN;
    END IF;
  END IF;
  rid:=NULL; s:=NULL;
  SELECT * INTO ls FROM public.last_seats WHERE user_id=me.id;
  IF FOUND AND NOT EXISTS(SELECT 1 FROM public.kickout_targets k WHERE k.user_id=me.id AND k.room_id=ls.room_id AND k.kick_at<=now() AND k.blocked_until>now()) THEN
    PERFORM 1 FROM public.rooms WHERE id=ls.room_id FOR UPDATE;
    IF FOUND THEN
      PERFORM public.room_tick(ls.room_id);
      IF (ls.seat>=0 AND ls.seat%2=parity OR ls.seat=-1 AND public.has_role(me.id,'admin'))
        AND NOT EXISTS(SELECT 1 FROM public.room_players p WHERE p.room_id=ls.room_id AND p.seat=ls.seat AND p.seat>=0) THEN
        s:=ls.seat;
      ELSE
        SELECT g.s::smallint INTO s FROM generate_series(0,11) g(s)
        WHERE g.s%2=parity AND NOT EXISTS(SELECT 1 FROM public.room_players p WHERE p.room_id=ls.room_id AND p.seat=g.s) ORDER BY g.s LIMIT 1;
      END IF;
      IF s IS NOT NULL THEN rid:=ls.room_id; END IF;
    END IF;
  END IF;
  IF rid IS NULL OR s IS NULL OR EXISTS(SELECT 1 FROM public.kickout_targets k WHERE k.user_id=me.id AND k.room_id=rid AND k.kick_at<=now() AND k.blocked_until>now()) THEN
    SELECT r.id INTO rid FROM public.rooms r
    WHERE (SELECT count(*) FROM public.room_players p WHERE p.room_id=r.id AND p.seat%2=parity)<6
    AND NOT EXISTS(SELECT 1 FROM public.kickout_targets k WHERE k.user_id=me.id AND k.room_id=r.id AND k.kick_at<=now() AND k.blocked_until>now())
    ORDER BY (SELECT count(*) FROM public.room_players p WHERE p.room_id=r.id) DESC,r.id LIMIT 1 FOR UPDATE SKIP LOCKED;
    IF rid IS NULL THEN INSERT INTO public.rooms DEFAULT VALUES RETURNING id INTO rid; END IF;
    SELECT g.s::smallint INTO s FROM generate_series(0,11) g(s) WHERE g.s%2=parity
    AND NOT EXISTS(SELECT 1 FROM public.room_players p WHERE p.room_id=rid AND p.seat=g.s) ORDER BY g.s LIMIT 1;
  END IF;
  INSERT INTO public.room_players(room_id,seat,user_id) VALUES(rid,s,me.id);
  IF s>=0 THEN UPDATE public.rooms SET spinner=coalesce(spinner,s),phase_at=CASE WHEN spinner IS NULL THEN now() ELSE phase_at END WHERE id=rid; END IF;
  RETURN QUERY SELECT rid,s;
END $$;
CREATE OR REPLACE FUNCTION public.leave_room() RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Oyuna daxil olmalısan.'; END IF;
  PERFORM 1 FROM public.profiles WHERE id=auth.uid() FOR UPDATE;
  DELETE FROM public.room_players WHERE user_id=auth.uid();
  -- Explicit leave is not a temporary transport interruption.
  DELETE FROM public.last_seats WHERE user_id=auth.uid();
END $$;
REVOKE ALL ON FUNCTION public.join_room(),public.leave_room() FROM public,anon;
GRANT EXECUTE ON FUNCTION public.join_room(),public.leave_room() TO authenticated;

create or replace function public.room_tick(p_room bigint) returns void
language plpgsql security definer set search_path = public as $$
declare r public.rooms; age double precision; nxt smallint;
begin
  if pg_trigger_depth() = 0 then
    delete from public.room_players where room_id = p_room and last_seen < now() - interval '2 minutes';
  end if;
  select * into r from public.rooms where id = p_room for update skip locked;
  -- Another player is already advancing this room: skip instead of queueing on the lock.
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
