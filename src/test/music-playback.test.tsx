import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MusicView } from '@/components/music/music-view';
import { getSharedAudio, resetRoomMusic, setMusicMuted, setMusicVolume, type PlayingSong } from '@/lib/music-session';

const song = { key: 1, startedAt: Date.now(), isVideo: false, musicItem: { url: 'https://example.test/music.mp3', duration: 180, artist: 'Artist', title: 'Song' }, sender: { id: 'sender', name: 'Sender', photoUrl: '', musicLevel: 0 } } as PlayingSong;
let paused = true;
let play: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  paused = true;
  vi.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockImplementation(() => paused);
  play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) { paused = false; this.dispatchEvent(new Event('play')); return Promise.resolve(); });
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) { paused = true; this.dispatchEvent(new Event('pause')); });
  setMusicMuted(false); setMusicVolume(1);
});
afterEach(() => { cleanup(); resetRoomMusic(); vi.restoreAllMocks(); });

describe('music sound controls', () => {
  it('applies mute immediately without restarting paused playback', () => {
    const audio = getSharedAudio();
    render(<MusicView song={song} muted={false} volume={1} />);
    fireEvent.click(screen.getByRole('button', { name: 'Müziği duraklat' }));
    const attempts = play.mock.calls.length;
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Sesi kapat' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sesi kapat' }));
    expect(audio?.muted).toBe(true);
    expect(audio?.paused).toBe(true);
    expect(play).toHaveBeenCalledTimes(attempts);
    fireEvent.pointerDown(document.body);
    expect(audio?.paused).toBe(true);
  });
  it('initializes playback with existing mute/volume preferences', () => {
    setMusicMuted(true); setMusicVolume(0);
    render(<MusicView song={song} muted volume={0} />);
    expect(getSharedAudio()?.muted).toBe(true);
    expect(getSharedAudio()?.volume).toBe(0);
    act(() => setMusicVolume(0.6));
    expect(getSharedAudio()?.muted).toBe(false);
    expect(getSharedAudio()?.volume).toBe(0.6);
  });
});