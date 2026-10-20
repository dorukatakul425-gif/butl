import { useSyncExternalStore } from "react";
// SfxPresenter: sounds come from the game's sfx bundle as `${id}.mp3`.
// Decoded once with Web Audio so repeated gifts never stall the page.
let ctx: AudioContext | null = null;
const buffers = new Map<string, Promise<AudioBuffer | null>>();
const SFX_KEY = "deltagame.sfx.volume";
let volume = (() => { try { const v = Number(typeof window !== "undefined" ? window.localStorage.getItem(SFX_KEY) ?? 1 : 1); return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1; } catch { return 1; } })();
const volumeListeners = new Set<() => void>();
/** SettingsPresenter sounds slider: preferences.sfxVolume. */
export function setSfxVolume(v: number) { volume = Math.max(0, Math.min(1, v)); try { window.localStorage.setItem(SFX_KEY, String(volume)); } catch { /* ignore */ } volumeListeners.forEach((l) => l()); }
export function useSfxVolume() {
  return useSyncExternalStore((l) => { volumeListeners.add(l); return () => volumeListeners.delete(l); }, () => volume, () => 1);
}
const raw = new Map<string, Promise<ArrayBuffer | null>>();

export function sfxUrl(template: string, id: string) {
  // SfxPresenter.buildUrl: ureyimsen premium sounds (mg_*) are served from /room-assets/sfx/.
  if (/^mg_[a-z0-9_]+$/.test(String(id))) return `/room-assets/sfx/${id}.mp3`;
  return template.replace("${name}", `${id}.mp3`);
}

function context() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function fetchRaw(url: string) {
  let p = raw.get(url);
  if (!p) {
    p = fetch(url).then((r) => (r.ok ? r.arrayBuffer() : null), () => null);
    raw.set(url, p);
  }
  return p;
}

export function preloadSfx(template: string, id: string) {
  if (!id) return;
  void prepareSfx(template, id);
}

export async function prepareSfx(template: string, id: string) {
  if (!id) return null;
  return decoded(sfxUrl(template, id));
}

function decoded(url: string) {
  let p = buffers.get(url);
  if (!p) {
    p = (async () => {
      const ac = context();
      const data = await fetchRaw(url);
      if (!ac || !data) return null;
      try {
        return await ac.decodeAudioData(data.slice(0));
      } catch {
        return null;
      }
    })();
    buffers.set(url, p);
  }
  return p;
}

/** Call from a user gesture so mobile browsers allow audio. */
export function unlockSfx() {
  context();
}

export async function playSfx(template: string, id: string) {
  if (!id || volume <= 0) return;
  const ac = context();
  const buffer = await decoded(sfxUrl(template, id));
  if (!ac || !buffer) return;
  const source = ac.createBufferSource();
  source.buffer = buffer;
  const gain = ac.createGain();
  gain.gain.value = volume;
  source.connect(gain).connect(ac.destination);
  source.onended = () => { source.disconnect(); gain.disconnect(); };
  source.start();
}
