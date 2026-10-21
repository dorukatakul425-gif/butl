import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('@/lib/music-session', () => ({ getSharedAudio: () => null, finishMusic: vi.fn(), setMusicMuted: vi.fn(), setMusicVolume: vi.fn() }));
import { MusicView } from '@/components/music/music-view';
import type { PlayingSong } from '@/lib/music-session';
afterEach(cleanup);
it('opens the actual DJ action and recorder selection independently', () => {
  const dj = vi.fn(), player = vi.fn();
  const song = { key: 1, startedAt: Date.now(), isVideo: false, musicItem: { artist: 'A', title: 'T', duration: 180, url: '' }, sender: { id: 'dj-id', name: 'DJ', photoUrl: '', musicLevel: 1 } } as PlayingSong;
  render(<MusicView song={song} muted={false} volume={1} onDj={dj} onPlayer={player} />);
  fireEvent.click(screen.getByRole('button', { name: 'DJ: DJ' })); expect(dj).toHaveBeenCalledWith('dj-id');
  fireEvent.click(screen.getByRole('button', { name: 'Musiqi seç' })); expect(player).toHaveBeenCalledTimes(1);
});