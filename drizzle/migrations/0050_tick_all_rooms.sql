-- Ciliz'de oldugu gibi sira sunucunun kendisi tarafindan ilerletilir:
-- oyuncularin telefonlari arka planda olsa bile masa donmaz.
-- VPS'teki bot bu fonksiyonu 2 saniyede bir cagirir.
create or replace function public.tick_all_rooms() returns integer
language plpgsql security definer set search_path = public as $$
declare r record; n integer := 0;
begin
  for r in select distinct room_id from public.room_players loop
    perform public.room_tick(r.room_id);
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function public.tick_all_rooms() from public, anon, authenticated;
grant execute on function public.tick_all_rooms() to service_role;
