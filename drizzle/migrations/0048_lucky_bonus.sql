-- Ciliz game_lucky_gold: the server randomly awards a lucky heart bonus after a spin.
-- Only the spinner receives it; the client shows the green "Şanslı bonus!" banner.
drop function if exists public.spin_bottle();

create or replace function public.spin_bottle() returns int
language plpgsql security definer set search_path = public as $$
declare rid bigint; s smallint; r public.rooms; lucky int := 0;
begin
  select room_id, seat into rid, s from public.room_players where user_id = auth.uid();
  if rid is null or not public._has_pair(rid) then return 0; end if;
  select * into r from public.rooms where id = rid;
  if r.phase <> 'offer' or r.spinner <> s then return 0; end if;
  if not public._do_spin(rid) then return 0; end if;
  -- Lucky bonus: ~12% of spins win 5..20 hearts, credited by the server at once.
  if random() < 0.12 then
    lucky := 5 + floor(random() * 16)::int;
    update public.profiles set gold = gold + lucky where id = auth.uid();
  end if;
  return lucky;
end $$;
