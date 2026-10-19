-- Ban/unban announcements are no longer posted to the game chat; remove existing ones.
delete from public.chat_messages where kind in ('ban','disabled_ban');
