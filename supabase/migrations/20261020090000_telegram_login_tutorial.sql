-- Telegram Mini App login + first-entry tutorial flags.
-- telegram_id links a profile to a Telegram account; tutorial_done=false only for
-- brand-new Telegram players, so existing players never see the tutorial again.

alter table public.profiles
  add column if not exists telegram_id bigint;

create unique index if not exists profiles_telegram_id_key
  on public.profiles (telegram_id) where telegram_id is not null;

alter table public.profiles
  add column if not exists tutorial_done boolean not null default true;

-- Marks the scripted first-entry tutorial as finished for the signed-in player.
-- Like the original client's TutorialFinishedDialog (addViewerGold), finishing
-- the tutorial grants a one-time +50 gold bonus.
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
  update public.profiles
  set tutorial_done = true,
      gold = gold + 50
  where id = auth.uid() and tutorial_done = false;
end;
$$;

grant execute on function public.complete_tutorial() to authenticated;
