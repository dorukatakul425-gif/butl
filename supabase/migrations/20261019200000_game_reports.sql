-- In-game reports (source "Fotoğrafı bildir" / "Kullanıcıyı şikayet et") go to the admin report queue.
alter table public.user_reports add column if not exists photo_url text;
alter table public.user_reports drop constraint if exists user_reports_category_check;
alter table public.user_reports add constraint user_reports_category_check
  check (category in ('spam', 'harassment', 'inappropriate', 'fake', 'scam', 'other', 'photo'));
alter table public.user_reports drop constraint if exists user_reports_context_check;
alter table public.user_reports add constraint user_reports_context_check
  check (context in ('chat', 'profile', 'game'));

-- One open report per reporter/target/kind; the server snapshots the reported photo.
create or replace function public.report_player(p_user uuid, p_kind text, p_text text default '')
returns text language plpgsql security definer set search_path = public as $$
declare v_photo text; v_text text := btrim(coalesce(p_text, ''));
begin
  if auth.uid() is null then raise exception 'not_authenticated' using errcode = '42501'; end if;
  if p_user is null or p_user = auth.uid() then raise exception 'invalid_target'; end if;
  if p_kind not in ('photo', 'user') then raise exception 'invalid_kind'; end if;
  if p_kind = 'user' and char_length(v_text) < 1 then raise exception 'empty_text'; end if;
  if exists (select 1 from user_reports where reporter_id = auth.uid() and reported_id = p_user and status = 'open'
             and category = case when p_kind = 'photo' then 'photo' else 'other' end and context = 'game') then
    return 'already';
  end if;
  select photo_url into v_photo from profiles where id = p_user;
  insert into user_reports (reporter_id, reported_id, category, details, context, photo_url)
  values (auth.uid(), p_user, case when p_kind = 'photo' then 'photo' else 'other' end, left(v_text, 1000), 'game',
          case when p_kind = 'photo' then v_photo end);
  return 'sent';
end $$;
revoke all on function public.report_player(uuid, text, text) from public, anon;
grant execute on function public.report_player(uuid, text, text) to authenticated;
