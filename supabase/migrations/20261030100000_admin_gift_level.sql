-- Admin panel: set a player's gift level (adds/removes bonus points) and grant level frames individually.
CREATE TABLE IF NOT EXISTS public.gift_level_bonus (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  points bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gift_level_bonus ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gift_level_bonus FROM anon, authenticated;
GRANT ALL ON public.gift_level_bonus TO service_role;

-- Real gift points + admin bonus (never below 0). Used by frames, entrance effect and level ranking.
CREATE OR REPLACE FUNCTION public.gift_points_of(p_user uuid) RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT greatest(0,
    coalesce((SELECT sum(g.price) FROM gift_events e JOIN gift_prices g ON g.gift_type = e.gift_type WHERE e.sender_id = p_user), 0)
    + coalesce((SELECT b.points FROM gift_level_bonus b WHERE b.user_id = p_user), 0))::bigint;
$$;
REVOKE ALL ON FUNCTION public.gift_points_of(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gift_points_of(uuid) TO service_role;

-- Exact level: points become level * 1400 (1400 points = 1 level, max 100).
CREATE OR REPLACE FUNCTION public.admin_set_gift_level(_user_id uuid, _level int) RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE real_pts bigint;
BEGIN
  IF _level < 0 OR _level > 100 THEN RAISE EXCEPTION 'level_range'; END IF;
  SELECT coalesce(sum(g.price), 0) INTO real_pts FROM gift_events e JOIN gift_prices g ON g.gift_type = e.gift_type WHERE e.sender_id = _user_id;
  INSERT INTO gift_level_bonus(user_id, points, updated_at) VALUES (_user_id, _level::bigint * 1400 - real_pts, now())
    ON CONFLICT (user_id) DO UPDATE SET points = EXCLUDED.points, updated_at = now();
  RETURN least(100, public.gift_points_of(_user_id) / 1400)::int;
END $$;
REVOKE ALL ON FUNCTION public.admin_set_gift_level(uuid, int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_gift_level(uuid, int) TO service_role;

-- Give / take one level frame (stored in owned_items, which set_decor already accepts).
CREATE OR REPLACE FUNCTION public.admin_grant_frame(_user_id uuid, _frame text, _give boolean) RETURNS text[]
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE res text[];
BEGIN
  IF NOT EXISTS (SELECT 1 FROM level_frames WHERE item = _frame) AND _frame <> 'cf_131' THEN RAISE EXCEPTION 'unknown_frame'; END IF;
  IF _give THEN
    UPDATE profiles SET owned_items = CASE WHEN _frame = ANY(owned_items) THEN owned_items ELSE array_append(owned_items, _frame) END WHERE id = _user_id RETURNING owned_items INTO res;
  ELSE
    UPDATE profiles SET owned_items = array_remove(owned_items, _frame),
      frame = CASE WHEN frame = _frame AND least(100, public.gift_points_of(_user_id) / 1400) < coalesce((SELECT level FROM level_frames WHERE item = _frame), 101) THEN '' ELSE frame END
      WHERE id = _user_id RETURNING owned_items INTO res;
  END IF;
  RETURN res;
END $$;
REVOKE ALL ON FUNCTION public.admin_grant_frame(uuid, text, boolean) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_grant_frame(uuid, text, boolean) TO service_role;

-- cf_131 (owner-exclusive) can be applied only when granted.
create or replace function public.set_decor(p_frame text, p_stone text) returns void
language plpgsql security definer set search_path = public as $$
declare me public.profiles; need int;
begin
  select * into me from public.profiles where id = auth.uid();
  if not found then raise exception 'not signed in'; end if;
  if coalesce(p_frame,'') <> '' and not (p_frame = any(me.owned_items)) then
    select level into need from public.level_frames where item = p_frame;
    if need is null then raise exception 'not owned'; end if;
    if least(100, public.gift_points_of(me.id) / 1400) < need then raise exception 'level_locked'; end if;
  end if;
  if coalesce(p_stone,'') <> '' and not (p_stone = any(me.owned_items)) then raise exception 'not owned'; end if;
  update public.profiles set frame = coalesce(p_frame,''), stone = coalesce(p_stone,'') where id = me.id;
end $$;

-- Level ranking (all time) includes admin bonus.
CREATE OR REPLACE FUNCTION public.top_players_extra(p_section text, p_period text DEFAULT '')
RETURNS TABLE(id uuid, name text, photo_url text, male boolean, score bigint, rank bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE since timestamptz := CASE p_period WHEN 'daily' THEN date_trunc('day', now()) WHEN 'weekly' THEN date_trunc('week', now()) WHEN 'monthly' THEN date_trunc('month', now()) ELSE NULL END;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF p_section = 'glv' THEN
    RETURN QUERY WITH raw AS (
        SELECT e.sender_id AS user_id, g.price::bigint AS n FROM gift_events e JOIN gift_prices g ON g.gift_type = e.gift_type
          WHERE since IS NULL OR e.created_at >= since
        UNION ALL SELECT b.user_id, b.points FROM gift_level_bonus b WHERE since IS NULL),
      c AS (SELECT raw.user_id, sum(raw.n)::bigint n FROM raw GROUP BY raw.user_id HAVING sum(raw.n) > 0),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.user_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid()
      UNION ALL SELECT p.id, p.name, p.photo_url, p.male, 0::bigint, 0::bigint FROM profiles p WHERE p.id = auth.uid() AND NOT EXISTS (SELECT 1 FROM r WHERE r.id = auth.uid())
      ORDER BY 6;
  ELSIF p_section = 'activity' THEN
    RETURN QUERY WITH c AS (SELECT a.user_id, sum(a.minutes)::bigint n FROM activity_minutes a
        WHERE since IS NULL OR a.day >= (since AT TIME ZONE 'UTC')::date GROUP BY a.user_id HAVING sum(a.minutes) > 0),
      r AS (SELECT p.id, p.name, p.photo_url, p.male, c.n AS score, row_number() OVER (ORDER BY c.n DESC, p.id) AS rank FROM c JOIN profiles p ON p.id = c.user_id)
      SELECT * FROM r WHERE r.rank <= 50 OR r.id = auth.uid()
      UNION ALL SELECT p.id, p.name, p.photo_url, p.male, 0::bigint, 0::bigint FROM profiles p WHERE p.id = auth.uid() AND NOT EXISTS (SELECT 1 FROM r WHERE r.id = auth.uid())
      ORDER BY 6;
  ELSE
    RAISE EXCEPTION 'unsupported';
  END IF;
END $$;
REVOKE ALL ON FUNCTION public.top_players_extra(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.top_players_extra(text, text) TO authenticated;
