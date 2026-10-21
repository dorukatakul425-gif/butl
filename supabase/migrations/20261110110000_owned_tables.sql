-- Client source Cd controller: 30 days, optional 1..9999 number; DAT price is admin-configured,
-- persistent passwords, free edits and reusable paid credit after deletion. Currency is DAT.
CREATE TABLE public.owned_table_config (
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
 price_dat int CHECK(price_dat BETWEEN 0 AND 1000000000),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
GRANT SELECT ON public.owned_table_config TO authenticated;
GRANT ALL ON public.owned_table_config TO service_role;
ALTER TABLE public.owned_table_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY owned_table_config_read ON public.owned_table_config FOR SELECT TO authenticated USING(true);
INSERT INTO public.owned_table_config(singleton,price_dat) VALUES(true,NULL);
CREATE FUNCTION public.admin_set_table_price(p_price int) RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'İcazə yoxdur'; END IF;
 IF p_price IS NULL OR p_price NOT BETWEEN 0 AND 1000000000 THEN RAISE EXCEPTION 'DAT miqdarı düzgün deyil'; END IF;
 UPDATE owned_table_config SET price_dat=p_price,updated_at=clock_timestamp() WHERE singleton;
 RETURN p_price;
END $$;
REVOKE ALL ON FUNCTION public.admin_set_table_price(int) FROM public,anon;
GRANT EXECUTE ON FUNCTION public.admin_set_table_price(int) TO authenticated;

ALTER TABLE public.rooms ADD COLUMN table_number int;
ALTER TABLE public.rooms ADD COLUMN table_name text NOT NULL DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN table_color smallint CHECK(table_color BETWEEN 0 AND 5);
UPDATE public.rooms SET table_number=id WHERE id BETWEEN 1 AND 9999;
CREATE UNIQUE INDEX rooms_table_number_unique ON public.rooms(table_number) WHERE table_number IS NOT NULL;
CREATE UNIQUE INDEX rooms_table_name_unique ON public.rooms(lower(table_name)) WHERE table_name<>'';
CREATE TABLE public.owned_tables (
 user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
 room_id bigint UNIQUE REFERENCES public.rooms(id) ON DELETE SET NULL,
 credit_until timestamptz NOT NULL,
 pass_hash text,
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
GRANT ALL ON public.owned_tables TO service_role;
ALTER TABLE public.owned_tables ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.table_access (
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 room_id bigint NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
 PRIMARY KEY(user_id,room_id)
);
GRANT ALL ON public.table_access TO service_role;
ALTER TABLE public.table_access ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.table_password_attempts (
 user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
 attempted_at timestamptz NOT NULL, attempts int NOT NULL DEFAULT 0
);
GRANT ALL ON public.table_password_attempts TO service_role;
ALTER TABLE public.table_password_attempts ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION public._expire_owned_tables() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(75001);
 UPDATE rooms SET table_name='',table_color=NULL WHERE id IN(SELECT room_id FROM owned_tables WHERE credit_until<=clock_timestamp());
 DELETE FROM table_access WHERE room_id IN(SELECT room_id FROM owned_tables WHERE credit_until<=clock_timestamp());
 UPDATE owned_tables SET room_id=NULL,pass_hash=NULL WHERE credit_until<=clock_timestamp() AND room_id IS NOT NULL;
END $$;
CREATE FUNCTION public._table_allowed(p_room bigint,p_user uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT NOT EXISTS(SELECT 1 FROM owned_tables WHERE room_id=p_room AND credit_until>clock_timestamp() AND pass_hash IS NOT NULL AND user_id<>p_user)
 OR EXISTS(SELECT 1 FROM table_access WHERE room_id=p_room AND user_id=p_user)
$$;
CREATE FUNCTION public._table_access_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF NOT public._table_allowed(NEW.room_id,NEW.user_id) THEN RAISE EXCEPTION 'password_required'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER owned_table_access BEFORE INSERT OR UPDATE OF room_id,user_id ON room_players FOR EACH ROW EXECUTE FUNCTION public._table_access_guard();

CREATE FUNCTION public.my_table_info() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o owned_tables; r rooms;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not signed in'; END IF;
 PERFORM pg_advisory_xact_lock(75001);
 PERFORM public._expire_owned_tables();
 SELECT * INTO o FROM owned_tables WHERE user_id=auth.uid();
 SELECT * INTO r FROM rooms WHERE id=o.room_id;
 RETURN jsonb_build_object('price',(SELECT price_dat FROM owned_table_config WHERE singleton),'days',30,'credit_until',o.credit_until,'room_id',o.room_id,'number',r.table_number,'name',r.table_name,'until',o.credit_until,'has_password',o.pass_hash IS NOT NULL,'here',o.room_id=public.my_room(),'max_number',9999);
END $$;

CREATE FUNCTION public.create_owned_table(p_number int DEFAULT NULL,p_password text DEFAULT '',p_expected_price int DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,extensions AS $$
DECLARE me profiles; o owned_tables; rid bigint; num int; expiry timestamptz; price int;
BEGIN
 IF auth.uid() IS NULL OR public.is_banned(auth.uid()) THEN RAISE EXCEPTION 'not signed in'; END IF;
 PERFORM pg_advisory_xact_lock(75001);
 PERFORM public._expire_owned_tables();
 SELECT * INTO me FROM profiles WHERE id=auth.uid() FOR UPDATE;
 SELECT * INTO o FROM owned_tables WHERE user_id=me.id FOR UPDATE;
 IF o.room_id IS NOT NULL THEN RETURN public.my_table_info(); END IF;
 IF p_number IS NOT NULL AND p_number NOT BETWEEN 1 AND 9999 THEN RAISE EXCEPTION 'Nömrə 1-9999 arası rəqəm olmalıdır'; END IF;
 IF length(coalesce(p_password,''))>32 THEN RAISE EXCEPTION 'Parol çox uzundur (ən çox 32 simvol)'; END IF;
 num:=p_number;
 IF num IS NULL THEN
  SELECT n INTO num FROM generate_series(1,9999) n WHERE NOT EXISTS(SELECT 1 FROM rooms r WHERE r.table_number=n AND (EXISTS(SELECT 1 FROM room_players WHERE room_id=r.id) OR EXISTS(SELECT 1 FROM owned_tables WHERE room_id=r.id))) ORDER BY random() LIMIT 1;
 END IF;
 IF num IS NULL THEN RAISE EXCEPTION 'Boş masa nömrəsi yoxdur.'; END IF;
 SELECT id INTO rid FROM rooms WHERE table_number=num FOR UPDATE;
 IF EXISTS(SELECT 1 FROM owned_tables WHERE room_id=rid) THEN RAISE EXCEPTION 'Bu masa artıq başqasınındır.'; END IF;
 IF EXISTS(SELECT 1 FROM room_players WHERE room_id=rid) THEN RAISE EXCEPTION 'Bu masada hazırda adamlar oturur.'; END IF;
 expiry:=o.credit_until;
 IF expiry IS NULL OR expiry<=clock_timestamp() THEN
  SELECT price_dat INTO price FROM owned_table_config WHERE singleton FOR SHARE;
  IF price IS NULL THEN RAISE EXCEPTION 'Masa yaratmaq hələ aktiv deyil.'; END IF;
  IF price IS DISTINCT FROM p_expected_price THEN RAISE EXCEPTION 'Qiymət dəyişib. Yenidən açıb yoxla.'; END IF;
  IF me.dat<price THEN RAISE EXCEPTION 'insufficient_dat'; END IF;
  UPDATE profiles SET dat=dat-price WHERE id=me.id;
  expiry:=clock_timestamp()+interval '30 days';
 END IF;
 IF rid IS NULL THEN INSERT INTO rooms(table_number) VALUES(num) RETURNING id INTO rid; END IF;
 UPDATE rooms SET table_color=floor(random()*6)::smallint,table_name='' WHERE id=rid;
 INSERT INTO owned_tables(user_id,room_id,credit_until,pass_hash) VALUES(me.id,rid,expiry,CASE WHEN coalesce(p_password,'')='' THEN NULL ELSE crypt(p_password,gen_salt('bf')) END)
 ON CONFLICT(user_id) DO UPDATE SET room_id=excluded.room_id,credit_until=excluded.credit_until,pass_hash=excluded.pass_hash,updated_at=clock_timestamp();
 RETURN public.my_table_info();
END $$;

CREATE FUNCTION public.edit_owned_table(p_number int DEFAULT NULL,p_name text DEFAULT '',p_password text DEFAULT NULL,p_remove_password boolean DEFAULT false) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,extensions AS $$
DECLARE o owned_tables; dest rooms; n text:=trim(coalesce(p_name,''));
BEGIN
 PERFORM pg_advisory_xact_lock(75001); PERFORM public._expire_owned_tables();
 SELECT * INTO o FROM owned_tables WHERE user_id=auth.uid() AND room_id IS NOT NULL FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Yalnız masanın sahibi dəyişə bilər'; END IF;
 IF n<>'' AND (length(n) NOT BETWEEN 2 AND 20 OR n~'^[0-9]+$') THEN RAISE EXCEPTION 'Ad 2-20 simvol olmalıdır və yalnız rəqəmdən ibarət ola bilməz'; END IF;
 IF EXISTS(SELECT 1 FROM rooms WHERE lower(table_name)=lower(n) AND n<>'' AND id<>o.room_id) THEN RAISE EXCEPTION 'Bu adda masa artıq var'; END IF;
 IF p_number IS NOT NULL THEN
  IF p_number NOT BETWEEN 1 AND 9999 THEN RAISE EXCEPTION 'Nömrə 1-9999 arası rəqəm olmalıdır'; END IF;
  SELECT * INTO dest FROM rooms WHERE table_number=p_number AND id<>o.room_id FOR UPDATE;
  IF FOUND THEN
   IF EXISTS(SELECT 1 FROM owned_tables WHERE room_id=dest.id) THEN RAISE EXCEPTION 'Bu masa artıq başqasınındır.'; END IF;
   IF EXISTS(SELECT 1 FROM room_players WHERE room_id=dest.id) THEN RAISE EXCEPTION 'Bu masada hazırda adamlar oturur.'; END IF;
   UPDATE rooms SET table_number=NULL WHERE id=dest.id;
  END IF;
  UPDATE rooms SET table_number=p_number WHERE id=o.room_id;
 END IF;
 IF length(coalesce(p_password,''))>32 THEN RAISE EXCEPTION 'Parol çox uzundur (ən çox 32 simvol)'; END IF;
 UPDATE rooms SET table_name=n WHERE id=o.room_id;
 IF p_remove_password OR coalesce(p_password,'')<>'' THEN DELETE FROM table_access WHERE room_id=o.room_id; END IF;
 UPDATE owned_tables SET pass_hash=CASE WHEN p_remove_password THEN NULL WHEN coalesce(p_password,'')<>'' THEN crypt(p_password,gen_salt('bf')) ELSE pass_hash END,updated_at=clock_timestamp() WHERE user_id=o.user_id;
 RETURN public.my_table_info();
END $$;
CREATE FUNCTION public.delete_owned_table() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o owned_tables;
BEGIN
 PERFORM pg_advisory_xact_lock(75001);
 SELECT * INTO o FROM owned_tables WHERE user_id=auth.uid() AND room_id IS NOT NULL FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Yalnız masanın sahibi dəyişə bilər'; END IF;
 UPDATE rooms SET table_name='',table_color=NULL WHERE id=o.room_id;
 DELETE FROM table_access WHERE room_id=o.room_id;
 UPDATE owned_tables SET room_id=NULL,pass_hash=NULL WHERE user_id=o.user_id;
 RETURN public.my_table_info();
END $$;

-- Gate explicit joins here and gate every other insertion with owned_table_access.
CREATE FUNCTION public.enter_table(p_room bigint,p_password text DEFAULT NULL) RETURNS TABLE(room_id bigint,seat smallint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,extensions AS $$
DECLARE me profiles; o owned_tables; a table_password_attempts;
BEGIN
 PERFORM pg_advisory_xact_lock(75001);
 SELECT * INTO me FROM profiles WHERE id=auth.uid() FOR UPDATE;
 IF NOT FOUND OR public.is_banned(me.id) THEN RAISE EXCEPTION 'not signed in'; END IF;
 SELECT * INTO o FROM owned_tables WHERE owned_tables.room_id=p_room AND credit_until>clock_timestamp() FOR SHARE;
 IF o.pass_hash IS NOT NULL AND o.user_id<>me.id AND NOT public._table_allowed(p_room,me.id) THEN
  IF p_password IS NULL THEN RAISE EXCEPTION 'password_required'; END IF;
  SELECT * INTO a FROM table_password_attempts WHERE user_id=me.id FOR UPDATE;
  IF a.attempts>=5 AND a.attempted_at>clock_timestamp()-interval '1 minute' THEN RAISE EXCEPTION 'Bir dəqiqə sonra yenidən yoxla.'; END IF;
  IF crypt(p_password,o.pass_hash)<>o.pass_hash THEN
   -- Return instead of raising: persist the failed-attempt counter.
   INSERT INTO table_password_attempts(user_id,attempted_at,attempts) VALUES(me.id,clock_timestamp(),1)
   ON CONFLICT(user_id) DO UPDATE SET attempted_at=clock_timestamp(),attempts=CASE WHEN table_password_attempts.attempted_at<clock_timestamp()-interval '1 minute' THEN 1 ELSE table_password_attempts.attempts+1 END;
   RETURN QUERY SELECT (-1)::bigint,(-2)::smallint; RETURN;
  END IF;
  DELETE FROM table_password_attempts WHERE user_id=me.id;
  INSERT INTO table_access VALUES(me.id,p_room) ON CONFLICT DO NOTHING;
 END IF;
 IF public.my_room()=p_room THEN RETURN QUERY SELECT rp.room_id,rp.seat FROM room_players rp WHERE user_id=me.id; RETURN; END IF;
 RETURN QUERY SELECT * FROM public.change_table(p_room);
END $$;
REVOKE ALL ON FUNCTION public._expire_owned_tables(),public._table_allowed(bigint,uuid),public._table_access_guard() FROM public,anon,authenticated;
REVOKE ALL ON FUNCTION public.my_table_info(),public.create_owned_table(int,text,int),public.edit_owned_table(int,text,text,boolean),public.delete_owned_table(),public.enter_table(bigint,text) FROM public,anon;
GRANT EXECUTE ON FUNCTION public.my_table_info(),public.create_owned_table(int,text,int),public.edit_owned_table(int,text,text,boolean),public.delete_owned_table(),public.enter_table(bigint,text) TO authenticated;

create or replace function public.change_table(p_room bigint default null) returns table(room_id bigint, seat smallint)
language plpgsql security definer set search_path = public as $$
declare me public.profiles; cur bigint; rid bigint; s smallint; parity int;
begin
  select * into me from public.profiles where id = auth.uid() for update;
  if not found then raise exception 'not signed in'; end if;
  parity := case when me.male then 1 else 0 end;
  select rp.room_id into cur from public.room_players rp where rp.user_id = me.id;
  if p_room is not null then
    if p_room = cur then raise exception 'Zaten bu masadasın'; end if;
    select r.id into rid from public.rooms r where r.id = p_room for update;
    if rid is null then raise exception 'Masa bulunamadı'; end if;
  else
    select r.id into rid from public.rooms r
     where public._table_allowed(r.id,me.id) and r.id is distinct from cur
       and (select count(*) from public.room_players p where p.room_id = r.id and p.seat % 2 = parity) < 6
     order by (select count(*) from public.room_players p where p.room_id = r.id) desc, r.id limit 1
     for update;
    if rid is null then insert into public.rooms default values returning id into rid; end if;
  end if;
  select g.s into s from generate_series(0,11) g(s)
   where g.s % 2 = parity and not exists (select 1 from public.room_players p where p.room_id = rid and p.seat = g.s)
   order by random() limit 1;
  if s is null then
    -- Admin spectator: a full table stays watchable (original goto_view_table).
    if public.has_role(me.id, 'admin') then
      delete from public.room_players where user_id = me.id;
      insert into public.room_players(room_id, seat, user_id) values (rid, -1, me.id);
      return query select rid, (-1)::smallint; return;
    end if;
    raise exception 'table_full';
  end if;
  delete from public.room_players where user_id = me.id;
  insert into public.room_players(room_id, seat, user_id) values (rid, s, me.id);
  update public.rooms set spinner = coalesce(spinner, s), phase_at = case when spinner is null then now() else phase_at end where id = rid;
  return query select rid, s;
end $$;


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
      PERFORM public.heartbeat(); RETURN QUERY SELECT rid,s; RETURN;
    END IF;
  END IF;
  rid:=NULL; s:=NULL;
  SELECT * INTO ls FROM public.last_seats WHERE user_id=me.id;
  IF FOUND AND public._table_allowed(ls.room_id,me.id) AND NOT EXISTS(SELECT 1 FROM public.kickout_targets k WHERE k.user_id=me.id AND k.room_id=ls.room_id AND k.kick_at<=now() AND k.blocked_until>now()) THEN
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
    WHERE public._table_allowed(r.id,me.id) AND (SELECT count(*) FROM public.room_players p WHERE p.room_id=r.id AND p.seat%2=parity)<6
    AND NOT EXISTS(SELECT 1 FROM public.kickout_targets k WHERE k.user_id=me.id AND k.room_id=r.id AND k.kick_at<=now() AND k.blocked_until>now())
    ORDER BY (SELECT count(*) FROM public.room_players p WHERE p.room_id=r.id) DESC,r.id LIMIT 1 FOR UPDATE;
    IF rid IS NULL THEN INSERT INTO public.rooms DEFAULT VALUES RETURNING id INTO rid; END IF;
    SELECT g.s::smallint INTO s FROM generate_series(0,11) g(s) WHERE g.s%2=parity
    AND NOT EXISTS(SELECT 1 FROM public.room_players p WHERE p.room_id=rid AND p.seat=g.s) ORDER BY g.s LIMIT 1;
  END IF;
  INSERT INTO public.room_players(room_id,seat,user_id) VALUES(rid,s,me.id);
  IF s>=0 THEN UPDATE public.rooms SET spinner=coalesce(spinner,s),phase_at=CASE WHEN spinner IS NULL THEN now() ELSE phase_at END WHERE id=rid; END IF;
  PERFORM public.heartbeat();
  RETURN QUERY SELECT rid,s;
END $$;


DROP FUNCTION public.list_tables();
CREATE FUNCTION public.list_tables() RETURNS TABLE(room_id bigint,men int,women int,bottle text,is_current boolean,blocked_until timestamptz,kicker_id uuid,kicker_name text,kicker_photo text,kicker_male boolean,number int,name text,locked boolean,owned boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT r.id,
 (SELECT count(*)::int FROM room_players WHERE room_players.room_id=r.id AND seat%2=1),
 (SELECT count(*)::int FROM room_players WHERE room_players.room_id=r.id AND seat%2=0),
 r.bottle,r.id=public.my_room(),k.blocked_until,p.id,p.name,p.photo_url,p.male,coalesce(r.table_number,r.id::int),
 CASE WHEN o.credit_until>clock_timestamp() THEN r.table_name ELSE '' END,
 o.credit_until>clock_timestamp() AND o.pass_hash IS NOT NULL,
 o.credit_until>clock_timestamp()
 FROM rooms r LEFT JOIN owned_tables o ON o.room_id=r.id
 LEFT JOIN kickout_targets k ON k.room_id=r.id AND k.user_id=auth.uid() AND k.blocked_until>clock_timestamp()
 LEFT JOIN profiles p ON p.id=k.kicked_by
 WHERE auth.uid() IS NOT NULL AND (EXISTS(SELECT 1 FROM room_players WHERE room_players.room_id=r.id) OR o.credit_until>clock_timestamp() OR r.id=public.my_room() OR k.blocked_until IS NOT NULL)
 ORDER BY (r.id=public.my_room()) DESC,o.user_id=auth.uid() DESC NULLS LAST,(SELECT max(visited_at) FROM table_history WHERE table_history.room_id=r.id AND user_id=auth.uid()) DESC NULLS LAST,r.id LIMIT 100;
$$;
REVOKE ALL ON FUNCTION public.list_tables(),public.change_table(bigint),public.join_room() FROM public,anon;
GRANT EXECUTE ON FUNCTION public.list_tables(),public.change_table(bigint),public.join_room() TO authenticated;
