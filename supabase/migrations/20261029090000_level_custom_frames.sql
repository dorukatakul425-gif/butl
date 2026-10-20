-- Ureyimsen level frames (animated custom frames cf_*): unlocked by gift level.
-- Gift level points = hearts spent on gifts; 1400 points = 1 level (max 100).
CREATE TABLE IF NOT EXISTS public.level_frames (
  item text PRIMARY KEY,
  level integer NOT NULL CHECK (level BETWEEN 0 AND 100)
);
GRANT SELECT ON public.level_frames TO anon, authenticated;
GRANT ALL ON public.level_frames TO service_role;
ALTER TABLE public.level_frames ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "level frames read" ON public.level_frames;
CREATE POLICY "level frames read" ON public.level_frames FOR SELECT USING (true);

INSERT INTO public.level_frames(item, level) VALUES
  ('cf_42',20),('cf_59',26),('cf_63',31),('cf_64',37),('cf_92',43),('cf_95',49),('cf_169',54),('cf_186',60),
  ('cf_263',66),('cf_402',71),('cf_781',77),('cf_1112',83),('cf_1121',89),('cf_1133',94),('cf_1135',100)
ON CONFLICT (item) DO UPDATE SET level = EXCLUDED.level;

CREATE OR REPLACE FUNCTION public.gift_points_of(p_user uuid) RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(sum(g.price), 0)::bigint FROM gift_events e JOIN gift_prices g ON g.gift_type = e.gift_type WHERE e.sender_id = p_user;
$$;
REVOKE ALL ON FUNCTION public.gift_points_of(uuid) FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.my_gift_points() RETURNS bigint
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  RETURN public.gift_points_of(auth.uid());
END $$;
REVOKE ALL ON FUNCTION public.my_gift_points() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.my_gift_points() TO authenticated;

-- set_decor: owned items, or a level frame whose level the player's gift level has reached.
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
