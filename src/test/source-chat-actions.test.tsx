import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MessageActions } from '@/components/chat/message-actions';
import type { CilizAssets } from '@/lib/ciliz-assets';
import { haremNotice, type VerifiedHaremPurchase } from '@/lib/source-harem';
import { pushTextLine, resetRoomMusic, useMusicSession } from '@/lib/music-session';

const assets: CilizAssets = { gifts: {}, giftStore: [], spines: {}, sfxUrl: '', frames: {}, stones: {}, decor: [], images: {}, bundles: [], dialogBundles: [], translation: { 'dlg:block:title': 'İgnore', 'dlg:unblock:title': 'İgnore etmekten vazgec', 'dlg:report_issue:title': 'Mesajı şikayet et', 'dlg:translate:show_translation': 'Tercümeyi göster', 'dlg:translate:show_original': 'Aslını göster' } };
afterEach(() => { cleanup(); resetRoomMusic(); });
describe('original message actions', () => {
  it('renders source icon order and runs every action', () => {
    const ignore = vi.fn(), report = vi.fn(), translation = vi.fn(), close = vi.fn();
    render(<MessageActions assets={assets} blocked={false} translationShown={false} canTranslate busy={false} onClose={close} onIgnore={ignore} onReport={report} onTranslate={translation} />);
    fireEvent.click(screen.getByRole('button', { name: 'İgnore' }));
    fireEvent.click(screen.getByRole('button', { name: 'Mesajı şikayet et' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tercümeyi göster' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(ignore).toHaveBeenCalledOnce(); expect(report).toHaveBeenCalledOnce(); expect(translation).toHaveBeenCalledOnce(); expect(close).toHaveBeenCalledOnce();
  });
  it('uses unblock and original text for existing states', () => {
    render(<MessageActions assets={assets} blocked translationShown canTranslate busy onClose={() => {}} onIgnore={() => {}} onReport={() => {}} onTranslate={() => {}} />);
    expect(screen.getByRole('button', { name: 'İgnore etmekten vazgec' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Aslını göster' })).toBeDisabled();
  });
  it('does not offer translation without source eligibility', () => {
    render(<MessageActions assets={assets} blocked={false} translationShown={false} canTranslate={false} busy={false} onClose={() => {}} onIgnore={() => {}} onReport={() => {}} onTranslate={() => {}} />);
    expect(screen.queryByText('Tercümeyi göster')).toBeNull();
  });
  it('deduplicates replayed server messages but not independent sends', () => {
    const sender = { id: 'a', name: 'A', photoUrl: '' };
    expect(pushTextLine(sender, 'Hello', undefined, 100)).toBe(true);
    expect(pushTextLine(sender, 'Hello', undefined, 100)).toBe(false);
    expect(pushTextLine(sender, 'Hello', undefined, 101)).toBe(true);
    function Count() { return <div>{useMusicSession().lines.length}</div>; }
    render(<Count />); expect(screen.getByText('2')).toBeInTheDocument();
  });
});
describe('HaremPurchasePresenter inbox rules', () => {
  const user = (id: string) => ({ id, name: id, photoUrl: '', male: true });
  const p: VerifiedHaremPurchase = { id: 'event', viewerId: 'target', target: user('target'), newOwner: user('buyer'), oldOwner: user('previous'), price: 2 };
  it('shows stolen-you notice to the target, not a heart reward', () => { expect(haremNotice(p)?.key).toBe('dlg:harem:new:viewer:old'); expect(haremNotice(p)?.user.id).toBe('buyer'); });
  it('shows lost-player notice to the previous owner', () => expect(haremNotice({ ...p, viewerId: 'previous' })?.key).toBe('dlg:harem:new:target:viewer'));
  it('does not show the purchaser or unrelated viewers an inbox notice', () => { expect(haremNotice({ ...p, viewerId: 'buyer' })).toBeNull(); expect(haremNotice({ ...p, viewerId: 'other' })).toBeNull(); });
  it('handles first charm and self-release separately', () => { expect(haremNotice({ ...p, oldOwner: p.target })?.key).toBe('dlg:harem:new:viewer:viewer'); expect(haremNotice({ ...p, viewerId: 'previous', newOwner: p.target })?.key).toBe('dlg:harem:target:target:viewer'); });
});