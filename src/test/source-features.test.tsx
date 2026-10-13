import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SourceChangeTable } from '@/components/table/source-change-table';
import { SourceSeasonDialog } from '@/components/table/source-season-dialogs';
import { SourceSettingsChild } from '@/components/settings/source-settings-children';
import { attachSourceFeatureSession, executeSourceFeature, type SourceFeatureSnapshot } from '@/lib/source-feature-session';
import type { CilizAssets } from '@/lib/ciliz-assets';
const assets: CilizAssets = { gifts: {}, giftStore: [], spines: {}, sfxUrl: '/sfx/${name}.mp3', frames: {}, stones: {}, decor: [], bundles: [], images: { cup: { size: [0, 0, 60, 60] } }, dialogBundles: [{ dpr: 3, url: '/images/${name}' }], leagues: [{ image: 'cup', gold: 4 }], translation: { 'dlg:change_table:title': 'Masayı değiştir', 'dlg:change_table:btn_random2': 'Rastgele tablo!', 'roulette:main:panel1:header': 'Çarkıfelek', 'roulette:main:btn1': 'Çevir', 'roulette:main:btn2': 'Atla', 'roulette:help:header': 'Oyunun Kuralları', 'roulette:help:btn': 'Tamam', 'dlg:bottle_pass:title': 'Dönemsel geçiş kartı', 'dlg:profile_info:title': 'Profil ayarları', 'dlg:profile_info:save': 'Kaydet', 'dlg:league:idle:title': 'Ligler', 'dlg:league:ladder:title': 'Ligler listesi' } };
vi.mock('@/components/decor/decor-selection', () => ({ useCilizAssets: () => assets }));
vi.mock('@/lib/sfx', () => ({ playSfx: vi.fn() }));
afterEach(() => { cleanup(); attachSourceFeatureSession(null); vi.useRealTimers(); });
function host(snapshot: SourceFeatureSnapshot, execute = vi.fn().mockResolvedValue({ confirmed: true })) { attachSourceFeatureSession({ getSnapshot: () => snapshot, subscribe: () => () => {}, execute }); return execute; }
describe('original feature windows', () => {
 it('never changes tables or spins without an authenticated host', async () => {
  render(<SourceChangeTable onClose={vi.fn()} />);
  expect(screen.getByRole('button', { name: 'Rastgele tablo!' })).toBeDisabled();
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
 it('help Escape preserves the underlying wheel and never spins locally', () => {
  const close = vi.fn(); render(<SourceSeasonDialog feature="roulette" onClose={close} />);
  expect(screen.getByRole('button', { name: 'Çevir' })).toBeDisabled();
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
 it('renders all public league cups without inventing a player ranking', () => {
  render(<SourceSeasonDialog feature="league" onClose={vi.fn()} />); fireEvent.click(screen.getByRole('button', { name: 'Ligler listesi' })); expect(screen.getByRole('dialog', { name: 'Ligler listesi' })).toBeVisible(); expect(document.querySelectorAll('.league__user')).toHaveLength(0);
 });
 it('keeps the original frame, left arrow and center without inventing reward values', () => {
  render(<SourceSeasonDialog feature="roulette" onClose={vi.fn()} />);
  expect(document.querySelector('.roulette__wheel-frame')).not.toBeNull();
  expect(document.querySelector('.roulette__wheel-center')).not.toBeNull();
  expect(document.querySelectorAll('.roulette__wheel-item')).toHaveLength(16);
  expect(document.querySelector('.roulette__wheel-section')).toHaveAttribute('data-reference-artwork', 'true');
  expect(screen.getByRole('button', { name: 'Çevir' })).toBeDisabled();
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
