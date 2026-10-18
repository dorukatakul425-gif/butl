import { expect, it } from 'vitest';
import { mergeConversation, type DirectMessage } from '@/lib/social';
const message: DirectMessage = { id: '1', sender_id: 'a', recipient_id: 'b', body: 'hello', created_at: '2026-10-18T12:00:00Z', read_at: null };
it('never restores an unsent body from an older recovery snapshot', () => {
  const rows = mergeConversation([{ ...message, body: '', deleted_at: '2026-10-18T12:01:00Z', media_path: null }], [message]);
  expect(rows[0]?.body).toBe(''); expect(rows[0]?.deleted_at).toBe('2026-10-18T12:01:00Z');
});
it('preserves confirmed read receipts during replay', () => {
  expect(mergeConversation([{ ...message, read_at: '2026-10-18T12:02:00Z' }], [message])[0]?.read_at).toBe('2026-10-18T12:02:00Z');
});
it('keeps new live arrivals while incorporating missed messages', () => {
  expect(mergeConversation([{ ...message, id: '2' }], [message]).map(row => row.id).sort()).toEqual(['1', '2']);
});