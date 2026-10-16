-- Live voice/video rooms ("Canlı"). Rooms are persistent rows; who is inside, seats, mic/cam state,
-- chat, gifts and WebRTC signalling travel over Realtime websockets (presence + broadcast).
-- Idempotent: safe to run on Lovable Cloud and on the self-hosted VPS database.

create sequence if not exists public.voice_room_code_seq start 100100;

create table if not exists public.voice_rooms (
  id uuid primary key default gen_random_uuid(),
  code bigint not null unique default nextval('public.voice_room_code_seq'),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 40),
  cover text not null default 'emerald' check (cover in ('emerald','sunset','night','rose','gold','ocean')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists voice_rooms_created_idx on public.voice_rooms (created_at desc);

create or replace function public.voice_rooms_touch() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := now();
    new.code := nextval('public.voice_room_code_seq');
  else
    new.code := old.code;
    new.owner_id := old.owner_id;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists voice_rooms_touch on public.voice_rooms;
create trigger voice_rooms_touch before insert or update on public.voice_rooms
for each row execute function public.voice_rooms_touch();

alter table public.voice_rooms enable row level security;

drop policy if exists voice_rooms_read on public.voice_rooms;
create policy voice_rooms_read on public.voice_rooms for select to authenticated using (true);
drop policy if exists voice_rooms_insert on public.voice_rooms;
create policy voice_rooms_insert on public.voice_rooms for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists voice_rooms_update on public.voice_rooms;
create policy voice_rooms_update on public.voice_rooms for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists voice_rooms_delete on public.voice_rooms;
create policy voice_rooms_delete on public.voice_rooms for delete to authenticated using (owner_id = auth.uid());

grant select, insert, update, delete on public.voice_rooms to authenticated;
grant usage, select on sequence public.voice_room_code_seq to authenticated;
grant all on public.voice_rooms to service_role;
