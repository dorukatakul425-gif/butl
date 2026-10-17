-- Friend requests + direct messages (delivered over realtime).
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester_id <> addressee_id)
);
create unique index if not exists friendships_pair_uidx
  on public.friendships (least(requester_id, addressee_id), greatest(requester_id, addressee_id));
create index if not exists friendships_addressee_idx on public.friendships (addressee_id);
alter table public.friendships replica identity full;
alter table public.friendships enable row level security;
grant select, delete on public.friendships to authenticated;
grant all on public.friendships to service_role;
drop policy if exists "friendships visible to both" on public.friendships;
create policy "friendships visible to both" on public.friendships for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
drop policy if exists "friendships removable by both" on public.friendships;
create policy "friendships removable by both" on public.friendships for delete to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create or replace function public.are_friends(_a uuid, _b uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.requester_id = _a and f.addressee_id = _b) or (f.requester_id = _b and f.addressee_id = _a))
  )
$$;
grant execute on function public.are_friends(uuid, uuid) to authenticated, service_role;

-- Sends a request; if the other player already asked, the pair becomes friends.
create or replace function public.send_friend_request(_to uuid)
returns public.friendships language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  r public.friendships;
begin
  if me is null then raise exception 'not_authenticated' using errcode = '42501'; end if;
  if _to is null or _to = me then raise exception 'invalid_target' using errcode = '22023'; end if;
  if not exists (select 1 from public.profiles where id = _to) then raise exception 'unknown_player' using errcode = '22023'; end if;
  select * into r from public.friendships
   where least(requester_id, addressee_id) = least(me, _to) and greatest(requester_id, addressee_id) = greatest(me, _to)
   for update;
  if found then
    if r.status = 'pending' and r.addressee_id = me then
      update public.friendships set status = 'accepted', responded_at = now() where id = r.id returning * into r;
    end if;
    return r;
  end if;
  insert into public.friendships (requester_id, addressee_id) values (me, _to) returning * into r;
  return r;
end $$;
revoke all on function public.send_friend_request(uuid) from public, anon;
grant execute on function public.send_friend_request(uuid) to authenticated;

-- Only the receiving player can accept or decline a pending request.
create or replace function public.respond_friend_request(_id uuid, _accept boolean)
returns boolean language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'not_authenticated' using errcode = '42501'; end if;
  if _accept then
    update public.friendships set status = 'accepted', responded_at = now()
     where id = _id and addressee_id = me and status = 'pending';
  else
    delete from public.friendships where id = _id and addressee_id = me and status = 'pending';
  end if;
  return found;
end $$;
revoke all on function public.respond_friend_request(uuid, boolean) from public, anon;
grant execute on function public.respond_friend_request(uuid, boolean) to authenticated;

create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  check (sender_id <> recipient_id)
);
create index if not exists direct_messages_recipient_idx on public.direct_messages (recipient_id, created_at desc);
create index if not exists direct_messages_sender_idx on public.direct_messages (sender_id, created_at desc);
alter table public.direct_messages enable row level security;
grant select on public.direct_messages to authenticated;
grant insert (sender_id, recipient_id, body) on public.direct_messages to authenticated;
grant all on public.direct_messages to service_role;
drop policy if exists "messages visible to both" on public.direct_messages;
create policy "messages visible to both" on public.direct_messages for select to authenticated
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
drop policy if exists "friends can send messages" on public.direct_messages;
create policy "friends can send messages" on public.direct_messages for insert to authenticated
  with check (auth.uid() = sender_id and read_at is null and public.are_friends(sender_id, recipient_id));

create or replace function public.mark_messages_read(_from uuid)
returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  update public.direct_messages set read_at = now()
   where recipient_id = auth.uid() and sender_id = _from and read_at is null;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.mark_messages_read(uuid) from public, anon;
grant execute on function public.mark_messages_read(uuid) to authenticated;

-- Realtime delivery.
do $$
declare t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array['friendships', 'direct_messages'] loop
      if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
        execute format('alter publication supabase_realtime add table public.%I', t);
      end if;
    end loop;
  end if;
end $$;

-- Banned players cannot send requests or messages.
do $$
declare t text;
begin
  if to_regproc('public.reject_banned_writes') is not null then
    foreach t in array array['friendships', 'direct_messages'] loop
      execute format('drop trigger if exists reject_banned on public.%I', t);
      execute format('create trigger reject_banned before insert or update on public.%I for each row execute function public.reject_banned_writes()', t);
    end loop;
  end if;
end $$;
