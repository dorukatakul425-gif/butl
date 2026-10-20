-- Voice rooms: optional uploaded cover photo + server-side banned-word check on room titles
-- (az/tr/ru/en). Mirrors src/lib/profanity.ts normalization. Idempotent.
alter table public.voice_rooms add column if not exists photo text;
alter table public.voice_rooms drop constraint if exists voice_rooms_photo_len;
alter table public.voice_rooms add constraint voice_rooms_photo_len check (photo is null or (char_length(photo) <= 400000 and photo like 'data:image/%'));

create or replace function public.room_title_normalize(t text) returns text
language sql immutable set search_path = public as $$
  select regexp_replace(
    regexp_replace(
      replace(replace(replace(replace(replace(
        translate(replace(replace(lower(coalesce(t, '')), 'ю', 'iu'), 'я', 'ia'),
          'əıöüşçğqxwâîû0134578@$!|абвгдеёжзийклмнопрстуфхцчшщыэіәөқүғ',
          'eiouscgghvaiuoieastbasiiabvgdeecziiglmnoprstufhscssieieogug'),
        'sh', 's'), 'ch', 'c'), 'zh', 'c'), 'kh', 'h'), 'ph', 'f'),
      '[^a-z]+', '', 'g'),
    '(.)\1+', '\1', 'g');
$$;

create or replace function public.voice_rooms_title_guard() returns trigger
language plpgsql set search_path = public as $$
declare n text;
begin
  n := translate(translate(translate(translate(public.room_title_normalize(new.name), 'q', 'g'), 'y', 'i'), 'j', 'c'), 'k', 'g');
  if n ~ '(peiser|peisar|peiserlig|gicdilah|gicdilag|gicbeser|gehbe|gahba|gehbehana|uehve|gancig|amcig|aminagoi|sigdir|sigtir|sigim|sigerem|sigecem|sigmeg|sigis|sigig|sigdim|sigilmis|gotveren|gotoglu|gotleme|dalbaiob|dolbaiob|dalbaiog|iarag|dasag|tasag|ogras|anavi|anani|ananisig|bacini|bacivi|godug|itoglu|pezeveng|peiserler|gehbelig|fahise|ehlagsiz|dilag|harabaia|pohuiu|pohiedi|pohuna|orospu|orosbu|gahpe|picgurusu|iavsag|daliarag|sogarim|sogaim|galtag|surtug|serefsiz|gavat|ibne|pust|sigerim|sigtigim|anasini|gerizegali|huia|nahui|pohui|pizd|ebat|eban|ebal|eblo|zaeb|bliad|bliat|mudag|mudil|pidor|pidar|gandon|zalup|sliuh|govn|droci|govno|dermo|fucg|bitc|biatc|dicg|cocg|pusi|asole|cunt|vhore|slut|bastard|motherf|milf|hentai|onlifans|erotig|erotic|fetis|bobs|tits|penis|vagina|blovcob|handcob|horni|masturb|dildo|orgasm|orgi|nude|naged|porn|porno|pornhub|segs|sesg)' then
    raise exception 'banned_word' using errcode = '22023';
  end if;
  return new;
end $$;

drop trigger if exists voice_rooms_title_guard on public.voice_rooms;
create trigger voice_rooms_title_guard before insert or update of name on public.voice_rooms
for each row execute function public.voice_rooms_title_guard();
