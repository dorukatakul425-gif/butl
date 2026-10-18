-- Telegram Mini App login + first-entry tutorial flags (mirror of supabase migration).
alter table public.profiles
  add column if not exists telegram_id bigint;

create unique index if not exists profiles_telegram_id_key
  on public.profiles (telegram_id) where telegram_id is not null;

alter table public.profiles
  add column if not exists tutorial_done boolean not null default true;

create or replace function public.complete_tutorial()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  update public.profiles set tutorial_done = true where id = auth.uid();
end;
$$;

grant execute on function public.complete_tutorial() to authenticated;
