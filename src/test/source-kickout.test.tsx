import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SourceKickoutDialog } from '@/components/profile/source-kickout-dialog';
import { attachSourceFeatureSession } from '@/lib/source-feature-session';
import type { CilizAssets } from '@/lib/ciliz-assets';
const assets: CilizAssets = { gifts: {}, giftStore: [], spines: {}, sfxUrl: '', frames: {}, stones: {}, decor: [], images: {}, bundles: [], dialogBundles: [], translation: { 'kickout:header': 'Şutla ve Koru', 'kickout:btn_kick': 'Şutla', 'kickout:btn_save': 'Koru', 'kickout:btn_defend': 'Kendimi koru' } };
const player = { id: 'other', name: 'Oyuncu', photoUrl: '/avatar.png', male: true, frame: '', stone: '' };
afterEach(() => { cleanup(); attachSourceFeatureSession(null); });
it('does not invent a price or send a kick without verified host state', () => {
  render(<SourceKickoutDialog player={player} self={false} assets={assets} onClose={vi.fn()} onConfirmed={vi.fn()} />);
  expect(screen.queryByRole('button', { name: 'Şutla' })).toBeNull();
  expect(screen.getByRole('status')).toHaveTextContent('hizmeti bağlı değil');
});
it('uses a confirmed host price and keeps the dialog open when rejected', async () => {
  const execute = vi.fn().mockResolvedValue({ confirmed: false, message: 'Reddedildi' }), confirmed = vi.fn();
  attachSourceFeatureSession({ getSnapshot: () => ({ viewerId: 'me', kickout: { price: 7, vip: true, targets: { other: {} } } }), subscribe: () => () => {}, execute });
  render(<SourceKickoutDialog player={player} self={false} assets={assets} onClose={vi.fn()} onConfirmed={confirmed} />);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Şutla' })));
  expect(execute).toHaveBeenCalledWith('user-kick', { userId: 'other', expectedPrice: 7, referrer: 'profile' });
  expect(confirmed).not.toHaveBeenCalled(); expect(screen.getByRole('status')).toHaveTextContent('Reddedildi');
});
it('allows self-defense without VIP only for a host-confirmed pending kick', async () => {
  const execute = vi.fn().mockResolvedValue({ confirmed: true }), confirmed = vi.fn();
  attachSourceFeatureSession({ getSnapshot: () => ({ viewerId: 'other', kickout: { price: 0, vip: false, targets: { other: { kickAt: Date.now() + 30000 } } } }), subscribe: () => () => {}, execute });
  render(<SourceKickoutDialog player={player} self assets={assets} onClose={vi.fn()} onConfirmed={confirmed} />);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Kendimi koru' })));
  expect(execute).toHaveBeenCalledWith('user-save', expect.objectContaining({ userId: 'other' })); expect(confirmed).toHaveBeenCalledOnce();
});