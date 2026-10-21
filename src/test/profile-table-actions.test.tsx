import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ProfileDialog } from '@/components/profile/profile-dialog';
import type { CilizAssets } from '@/lib/ciliz-assets';

const state = vi.hoisted(() => ({ players: [] as Array<{ id: string } | null>, toast: vi.fn() }));
vi.mock('@/lib/room-session', () => ({ useRoom: () => ({ players: state.players }) }));
vi.mock('@/lib/viewer-progress', () => ({ useViewerProgress: () => ({ vip: false }) }));
vi.mock('@/lib/supabase', () => ({ getSupabase: () => null }));
vi.mock('@/components/source-dialogs', async importOriginal => ({ ...(await importOriginal<object>()), showSourceToast: state.toast }));
const assets = { gifts: {}, giftStore: [], spines: {}, frames: {}, stones: {}, decor: [], images: {}, bundles: [], dialogBundles: [], translation: {} } as unknown as CilizAssets;
afterEach(() => { cleanup(); state.toast.mockClear(); state.players = []; });

describe('profile table actions', () => {
  it('never starts gifts, private chat or kicking for an off-table player', () => {
    const gift = vi.fn(), reply = vi.fn(); window.addEventListener('game-reply-to', reply);
    render(<ProfileDialog player={{ id: 'other', name: 'Other', male: false, photoUrl: '', frame: '', stone: '' }} self={false} assets={assets} onClose={vi.fn()} onGift={gift} onDecor={vi.fn()} onMusic={vi.fn()} />);
    for (const name of ['Hədiyyə', 'Mesaj', 'kickout:header']) fireEvent.click(screen.getByRole('button', { name }));
    expect(gift).not.toHaveBeenCalled(); expect(reply).not.toHaveBeenCalled(); expect(state.toast).toHaveBeenCalledTimes(3);
    window.removeEventListener('game-reply-to', reply);
  });
  it('allows a gift when present and blocks it immediately after departure', () => {
    state.players = [{ id: 'other' }]; const gift = vi.fn();
    const props = { player: { id: 'other', name: 'Other', male: false, photoUrl: '', frame: '', stone: '' }, self: false, assets, onClose: vi.fn(), onGift: gift, onDecor: vi.fn(), onMusic: vi.fn() };
    const view = render(<ProfileDialog {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hədiyyə' })); expect(gift).toHaveBeenCalledTimes(1);
    state.players = []; view.rerender(<ProfileDialog {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hədiyyə' })); expect(gift).toHaveBeenCalledTimes(1); expect(state.toast).toHaveBeenCalledTimes(1);
  });
});