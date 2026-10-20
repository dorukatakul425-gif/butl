-- Table chat follows the same rules at every table: banned players' messages are never shown,
-- private lines only reach sender and receiver. Idempotent.
DROP POLICY IF EXISTS "chat read own room" ON public.chat_messages;
CREATE POLICY "chat read own room" ON public.chat_messages FOR SELECT TO authenticated USING (
  room_id = public.my_room()
  AND NOT public.is_banned(user_id)
  AND (NOT is_private OR user_id = auth.uid() OR receiver_id = auth.uid())
);
