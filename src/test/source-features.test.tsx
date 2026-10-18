import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SourceChangeTable } from '@/components/table/source-change-table';
import { SourceSeasonDialog } from '@/components/table/source-season-dialogs';
import { SourceSettingsChild } from '@/components/settings/source-settings-children';
import { attachSourceFeatureSession, executeSourceFeature, type SourceFeatureSnapshot } from '@/lib/source-feature-session';
import type { CilizAssets } from '@/lib/ciliz-assets';
const assets: CilizAssets = { gifts: {}, giftStore: [], spines: {}, sfxUrl: '/sfx/${name}.mp3', frames: {}, stones: {}, decor: [], bundles: [], images: { cup: { size: [0, 0, 60, 60] } }, dialogBundles: [{ dpr: 3, url: '/images/${name}' }], leagues: [{ image: 'cup', gold: 4 }], translation: { 'dlg:change_table:title': 'Masayı değiştir', 'dlg:change_table:btn_random2': 'Rastgele tablo!', 'roulette:main:panel1:header': 'Çarkıfelek', 'roulette:main:btn1': 'Çevir', 'roulette:main:btn2': 'Atla', 'roulette:help:header': 'Oyunun Kuralları', 'roulette:help:btn': 'Tamam', 'dlg:bottle_pass:title': 'Dönemsel geçiş kartı', 'dlg:profile_info:title': 'Profil ayarları', 'dlg:profile_info:save': 'Kaydet', 'dlg:league:idle:title': 'Ligler', 'dlg:league:ladder:title': 'Ligler listesi', 'kickout:info:header': 'Şutlama', 'kickout:info:desc': '%0 sizi #%1 masasından şutladı %2d(erkek|kadın)', 'kickout:info:return': 'Geri dönüş:', 'kickout:help:btn_ok': 'Tamam' } };
vi.mock('@/components/decor/decor-selection', () => ({ useCilizAssets: () => assets }));
vi.mock('@/lib/sfx', () => ({ playSfx: vi.fn() }));
afterEach(() => { cleanup(); attachSourceFeatureSession(null); vi.useRealTimers(); });
function host(snapshot: SourceFeatureSnapshot, execute = vi.fn().mockResolvedValue({ confirmed: true })) { attachSourceFeatureSession({ getSnapshot: () => snapshot, subscribe: () => () => {}, execute }); return execute; }
describe('original feature windows', () => {
 it('never changes tables or spins without an authenticated host', async () => {
  render(<SourceChangeTable onClose={vi.fn()} />);
  expect(screen.getByRole('button', { name: 'Rastgele tablo!' })).toHaveAttribute('aria-disabled', 'true');
  await expect(executeSourceFeature('roulette-spin')).rejects.toThrow('Oyuncu hesabı');
 });
 it('changes only after the host confirms, never before', async () => {
  const close = vi.fn(), execute = host({ viewerId: 'me' }, vi.fn().mockResolvedValue({ confirmed: false, message: 'Bekle' }));
  render(<SourceChangeTable onClose={close} />);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Rastgele tablo!' })));
  expect(execute).toHaveBeenCalledWith('change-table', undefined); expect(close).not.toHaveBeenCalled(); expect(screen.getByRole('status')).toHaveTextContent('Bekle');
 });
 it('does not offer table-number access without a verified admin capability', () => {
  host({ viewerId: 'me', tables: { friends: [], history: [] } }); render(<SourceChangeTable onClose={vi.fn()} />);
  expect(screen.queryByRole('spinbutton')).toBeNull();
 });
 it('honors server kickout timers without joining blocked tables', async () => {
  const execute = host({ viewerId: 'me', tables: { friends: [], history: [{ id: '12', bottle: 'standart', men: 6, women: 6, blockedUntil: Date.now() + 60000 }] } });
  render(<SourceChangeTable onClose={vi.fn()} />); fireEvent.click(screen.getByRole('button', { name: /#12/ })); expect(execute).not.toHaveBeenCalled();
 });
 it('opens the original kickout info dialog when tapping a counting-down table', () => {
  const execute = host({ viewerId: 'me', tables: { friends: [], history: [{ id: '12', bottle: 'standart', men: 6, women: 6, blockedUntil: Date.now() + 60000, kicker: { id: 'k1', name: 'Ayşe', male: false } }] } });
  render(<SourceChangeTable onClose={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /#12/ }));
  expect(execute).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog', { name: 'Şutlama' })).toBeVisible();
  expect(screen.getByText('Ayşe sizi #12 masasından şutladı kadın')).toBeVisible();
  expect(screen.getByText('Geri dönüş:')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Tamam' }));
  expect(screen.queryByRole('dialog', { name: 'Şutlama' })).toBeNull();
 });
 it('help Escape preserves the underlying wheel and never spins locally', () => {
  const close = vi.fn(); render(<SourceSeasonDialog feature="roulette" onClose={close} />);
  expect(screen.getByRole('button', { name: 'Çevir' })).toBeEnabled();
  expect(screen.getByRole('button', { name: /chances/ })).toHaveTextContent('2000');
  fireEvent.click(screen.getByRole('button', { name: 'Yardım' })); expect(screen.getByRole('dialog', { name: 'Oyunun Kuralları' })).toBeVisible();
  fireEvent.keyDown(document, { key: 'Escape' }); expect(screen.getByRole('dialog', { name: 'Çarkıfelek' })).toBeVisible(); expect(close).not.toHaveBeenCalled();
 });
 it('only animates a verified wheel index and allows skip without a second transaction', async () => {
  vi.useFakeTimers(); const execute = host({ viewerId: 'me', roulette: { freeSpins: 1, price: 1, prizes: [{ id: 'p', image: 'cup', count: 1 }] } }, vi.fn().mockResolvedValue({ confirmed: true, rewardIndex: 0, rewards: [{ id: 'award', image: 'cup', count: 3 }] }));
  render(<SourceSeasonDialog feature="roulette" onClose={vi.fn()} />);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Çevir' })));
  expect(document.querySelector('.roulette__wheel')).toHaveStyle({ transform: 'rotate(1620deg)' });
  fireEvent.click(screen.getByRole('button', { name: 'Atla' })); expect(execute).toHaveBeenCalledTimes(1); expect(screen.getByText('3')).toBeVisible();
 });
 it('profile editor opens but cannot save unknown profile state', () => {
  render(<SourceSettingsChild kind="profile" assets={assets} onClose={vi.fn()} />); expect(screen.getByRole('dialog', { name: 'Profil ayarları' })).toBeVisible(); expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
 });
 it('shows the original LeagueMoveDialog outside a round, without ladder button or invented ranking', () => {
  render(<SourceSeasonDialog feature="league" onClose={vi.fn()} />); expect(screen.queryByRole('button', { name: 'Ligler listesi' })).toBeNull(); expect(document.querySelector('.league-move__manual')).not.toBeNull(); expect(document.querySelectorAll('.league__user')).toHaveLength(0);
 });
 it('shows the original large idle cup and closes without a fictitious league transaction', () => {
  const close = vi.fn(), execute = host({ viewerId: 'me' });
  render(<SourceSeasonDialog feature="league" onClose={close} />);
  expect(document.querySelector('.league-move__cups img')).toHaveAttribute('width', '118');
  fireEvent.click(screen.getByRole('button', { name: 'dlg:harem:btn' }));
  expect(close).toHaveBeenCalledOnce(); expect(execute.mock.calls.filter(c => c[0] !== 'league-refresh')).toHaveLength(0);
 });
 it('keeps the original frame, left arrow and center for the isolated visual test', () => {
  render(<SourceSeasonDialog feature="roulette" onClose={vi.fn()} />);
  expect(document.querySelector('.roulette__wheel-frame')).not.toBeNull();
  expect(document.querySelector('.roulette__wheel-center')).not.toBeNull();
  expect(document.querySelectorAll('.roulette__wheel-item')).toHaveLength(16);
  expect(document.querySelector('.roulette__wheel-section')).toHaveAttribute('data-reference-artwork', 'true');
  expect(screen.getByRole('button', { name: 'Çevir' })).toBeEnabled();
 });
 it('spends one visual-test chance and shows the source reward popup without a host wallet', async () => {
  vi.useFakeTimers();
  render(<SourceSeasonDialog feature="roulette" onClose={vi.fn()} />);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Çevir' })));
  expect(screen.getByRole('button', { name: /chances/ })).toHaveTextContent('1999');
  await act(async () => vi.advanceTimersByTime(4000));
  expect(screen.getByRole('dialog', { name: 'dlg:bottle_pass:reward:achieved' })).toBeVisible();
  expect(screen.getByText('Test ödülü · bakiyeye eklenmez')).toBeVisible();
 });
 it('rejects invalid winning indices and does not show an earned reward', async () => {
  host({ viewerId: 'me', roulette: { freeSpins: 1, price: 1, prizes: [{ id: 'p', image: 'cup', count: 1 }] } }, vi.fn().mockResolvedValue({ confirmed: true, rewardIndex: 99, rewards: [{ id: 'bad', image: 'cup', count: 9 }] }));
  render(<SourceSeasonDialog feature="roulette" onClose={vi.fn()} />);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Çevir' })));
  expect(screen.getByRole('status')).toBeVisible();
  expect(document.querySelector('.roulette__wheel')).not.toHaveStyle({ transform: 'rotate(1620deg)' });
  expect(screen.queryByText('9')).toBeNull();
 });
});
it('opens a running league in the original LeagueDialog frame with coloured header and results timer', () => {
  host({ viewerId: 'me', leagueState: 'running', league: { level: 0, score: 5, endsAt: Date.now() + 2 * 86400000, state: 'running', roundId: 1, players: [{ id: 'me', name: 'Ben', score: 5 }] } });
  render(<SourceSeasonDialog feature="league" onClose={vi.fn()} />);
  expect(document.querySelector('.popup.league__x_popup .league__x_popup__header--up .league__manual')).not.toBeNull();
  expect(document.querySelector('.league__x_popup__content .league__user')).not.toBeNull();
  expect(document.querySelector('.toast .toast__icon--timer')).not.toBeNull();
});
