import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { batchChatHistory, expireChatHistory, pushMusicHistoryLine, pushTextLine, resetRoomMusic, stampChatHistory, useMusicSession } from '@/lib/music-session';
afterEach(() => { cleanup(); resetRoomMusic(); });
const sender = { id:'a',name:'A',photoUrl:'',musicLevel:0 };
function Count(){ return <output>{useMusicSession().lines.length}</output>; }
it('deduplicates a stored music notice across live delivery and history replay', () => {
  expect(pushMusicHistoryLine(sender,'DJ','Track',45,999)).toBe(true);
  expect(pushMusicHistoryLine(sender,'DJ','Track',45,999)).toBe(false);
  render(<Count/>); expect(screen.getByText('1')).toBeVisible();
});
it('expires music and text together at the same 24-hour boundary', () => {
  const now = Date.now(), created = new Date(now-24*3600_000).toISOString();
  pushMusicHistoryLine(sender,'DJ','Track',45); stampChatHistory(45,created);
  pushTextLine(sender,'message',undefined,46); stampChatHistory(46,created);
  expireChatHistory(now-1); render(<Count/>); expect(screen.getByText('2')).toBeVisible();
  cleanup(); expireChatHistory(now); render(<Count/>); expect(screen.getByText('0')).toBeVisible();
});
it('keeps only the last 100 lines so long sessions do not slow the phone', () => {
  for (let i = 0; i < 120; i++) pushTextLine(sender, `message ${i}`);
  render(<Count/>); expect(screen.getByText('100')).toBeVisible();
});
it('loads a full 100-message history into a mounted chat without nested-update overflow', () => {
  render(<Count/>);
  act(() => batchChatHistory(() => { for(let i=0;i<100;i++) pushTextLine(sender,`history ${i}`,undefined,1000+i); }));
  expect(screen.getByText('100')).toBeVisible();
});
