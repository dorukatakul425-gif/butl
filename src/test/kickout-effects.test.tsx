import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
const mock = vi.hoisted(() => ({ callback: null as null | ((ev: any) => void), room: { roomId: 1, players: [{ id: 'target' }] } }));
vi.mock('@/lib/room-session', () => ({ useRoom: () => mock.room, displaySeatOf: () => 0, onRoomKickout: (fn: any) => { mock.callback = fn; return () => { mock.callback = null; }; } }));
vi.mock('@/lib/source-feature-session', () => ({ useSourceFeatureSession: () => ({}) }));
vi.mock('@/lib/sfx', () => ({ playSfx: vi.fn() }));
import { KickoutSeatFx } from '@/components/table/kickout-seat-fx';
import { playSfx } from '@/lib/sfx';
import type { CilizAssets } from '@/lib/ciliz-assets';
const assets = { sfxUrl: '/sfx' } as CilizAssets;
afterEach(() => { cleanup(); vi.useRealTimers(); vi.clearAllMocks(); mock.room.roomId = 1; });
describe('kickout animation cancellation', () => {
  it('cancels the delayed kick sound when the player is saved', () => {
    vi.useFakeTimers(); render(<KickoutSeatFx assets={assets} seatPoint={() => ({ x: 10, y: 10, scale: 1 })} />);
    act(() => mock.callback?.({ id: 1, kind: 'kick', target_id: 'target' }));
    act(() => { vi.advanceTimersByTime(100); mock.callback?.({ id: 2, kind: 'save', target_id: 'target' }); vi.advanceTimersByTime(1500); });
    expect(playSfx).toHaveBeenCalledTimes(1); expect(playSfx).toHaveBeenCalledWith('/sfx', 'save');
  });
  it('cancels pending sounds when changing rooms', () => {
    vi.useFakeTimers(); const view = render(<KickoutSeatFx assets={assets} seatPoint={() => null} />);
    act(() => mock.callback?.({ id: 1, kind: 'kick', target_id: 'target' }));
    mock.room.roomId = 2; view.rerender(<KickoutSeatFx assets={assets} seatPoint={() => null} />);
    act(() => vi.advanceTimersByTime(2000)); expect(playSfx).not.toHaveBeenCalled();
  });
});