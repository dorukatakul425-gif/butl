// SfxPresenter: sounds come from the game's sfx bundle as `${id}.mp3`.
// Decoded once with Web Audio so repeated gifts never stall the page.
let ctx: AudioContext | null = null;
const buffers = new Map<string, Promise<AudioBuffer | null>>();
const raw = new Map<string, Promise<ArrayBuffer | null>>();

export function sfxUrl(template: string, id: string) {
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
  if (!id) return;
  const ac = context();
  const buffer = await decoded(sfxUrl(template, id));
  if (!ac || !buffer) return;
  const source = ac.createBufferSource();
  source.buffer = buffer;
  source.connect(ac.destination);
  source.onended = () => source.disconnect();
  source.start();
}
