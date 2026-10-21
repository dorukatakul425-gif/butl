import { useEffect, useRef, useState } from "react";

// Port of YouTubePlayer.ts: official iframe API, same playerVars, synced start position.
// When YouTube is blocked for the player (e.g. Russia), playback switches to the
// game server's own stream (/api/public/yt/<id>) with the same sync rules.
interface YTPlayer {
  destroy(): void; mute(): void; unMute(): void; setVolume(v: number): void; playVideo(): void;
  seekTo(s: number, a: boolean): void; getDuration(): number; getPlayerState(): number; isMuted(): boolean;
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer; PlayerState: Record<string, number> };
    onYouTubeIframeAPIReady?: (() => void) | undefined;
  }
}
type Mode = "yt" | "proxy";
const MODE_KEY = "butl-yt-mode";
let prepare: Promise<void> | null = null;
let modePromise: Promise<Mode> | null = null;

export function prepareYouTube() {
  if (!prepare) {
    prepare = new Promise<void>((resolve, reject) => {
      if (window.YT?.Player) return resolve();
      const timer = window.setTimeout(() => reject(new Error("timeout")), 7000);
      window.onYouTubeIframeAPIReady = () => { window.clearTimeout(timer); window.onYouTubeIframeAPIReady = undefined; resolve(); };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => { window.clearTimeout(timer); reject(new Error("blocked")); };
      document.head.appendChild(script);
    });
    prepare.catch(() => { prepare = null; });
  }
  return prepare;
}

function probeVideoHost(): Promise<boolean> {
  const ctl = new AbortController();
  const t = window.setTimeout(() => ctl.abort(), 5000);
  return fetch("https://redirector.googlevideo.com/generate_204", { mode: "no-cors", cache: "no-store", signal: ctl.signal })
    .then(() => true, () => false)
    .finally(() => window.clearTimeout(t));
}

export function markYouTubeBlocked() {
  modePromise = Promise.resolve("proxy");
  try { sessionStorage.setItem(MODE_KEY, "proxy"); } catch { /* private mode */ }
}

export function detectYouTubeMode(): Promise<Mode> {
  if (!modePromise) {
    let saved: string | null = null;
    try { saved = sessionStorage.getItem(MODE_KEY); } catch { /* ignore */ }
    if (saved === "proxy") modePromise = Promise.resolve("proxy");
    else modePromise = Promise.all([prepareYouTube().then(() => true, () => false), probeVideoHost()]).then(([api, video]) => {
      const mode: Mode = api && video ? "yt" : "proxy";
      if (mode === "proxy") markYouTubeBlocked();
      return mode;
    });
  }
  return modePromise;
}

export const proxyThumb = (id: string) => `/api/public/yt/${id}.jpg`;

export interface YouTubeFrameProps {
  videoId: string;
  preview?: boolean;
  startPosition?: number;
  muted?: boolean;
  volume?: number;
  onReady?: () => void;
  onProgress?: (sec: number) => void;
  onComplete?: () => void;
}

export function YouTubeFrame(props: YouTubeFrameProps) {
  const [mode, setMode] = useState<Mode | null>(null);
  useEffect(() => {
    let alive = true;
    void detectYouTubeMode().then((m) => { if (alive) setMode(m); });
    return () => { alive = false; };
  }, []);
  if (!mode) return <div className="music__video-frame" style={{ height: "100%" }} />;
  if (mode === "proxy") return <ProxyFrame {...props} />;
  return <IframeFrame {...props} onBlocked={() => { markYouTubeBlocked(); setMode("proxy"); }} />;
}

function ProxyFrame({ videoId, preview = false, startPosition = 0, muted = false, volume = 1, onReady, onProgress, onComplete }: YouTubeFrameProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const cb = useRef({ onReady, onProgress, onComplete, muted, volume });
  cb.current = { onReady, onProgress, onComplete, muted, volume };

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const startTs = Date.now() - 1000 * startPosition;
    const now = () => (Date.now() - startTs) / 1000;
    const apply = () => { v.volume = Math.max(0, Math.min(1, cb.current.volume)); v.muted = cb.current.muted || cb.current.volume === 0; };
    const play = () => {
      apply();
      v.play().catch(() => { v.muted = true; void v.play().catch(() => undefined); });
    };
    const onMeta = () => {
      cb.current.onReady?.();
      if (preview) return;
      const t = now();
      if (Number.isFinite(v.duration) && t < v.duration) v.currentTime = t;
      play();
    };
    const resume = (event: Event) => {
      if (preview) return;
      if (event.target instanceof Element && event.target.closest(".player-controls, .music-stop-button")) return;
      if (v.paused) { if (Math.abs(v.currentTime - now()) > 2) v.currentTime = now(); }
      apply();
      void v.play().catch(() => undefined);
    };
    const ended = () => cb.current.onComplete?.();
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", ended);
    document.addEventListener("pointerdown", resume);
    const interval = window.setInterval(() => cb.current.onProgress?.(now()), 1000);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", ended);
      document.removeEventListener("pointerdown", resume);
      window.clearInterval(interval);
      v.pause();
      v.removeAttribute("src");
      v.load();
    };
  }, [videoId, preview, startPosition]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.volume = Math.max(0, Math.min(1, volume));
    v.muted = muted || volume === 0;
  }, [muted, volume]);

  return (
    <div className="music__video-frame" style={{ height: "100%" }}>
      <video
        ref={ref}
        src={`/api/public/yt/${videoId}`}
        poster={proxyThumb(videoId)}
        playsInline
        preload={preview ? "metadata" : "auto"}
        controls={preview}
        style={{ width: "100%", height: "100%", objectFit: "contain", background: "var(--background, #000)" }}
      />
    </div>
  );
}

function IframeFrame({ videoId, preview = false, startPosition = 0, muted = false, volume = 1, onReady, onProgress, onComplete, onBlocked }: YouTubeFrameProps & { onBlocked: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const cb = useRef({ onReady, onProgress, onComplete, onBlocked, muted, volume });
  cb.current = { onReady, onProgress, onComplete, onBlocked, muted, volume };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let destroyed = false;
    let ready = false;
    let started = false;
    let autoplayCheck: number | undefined;
    let stallCheck: number | undefined;
    const resume = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.player-controls, .music-stop-button')) return;
      const q = playerRef.current;
      if (!q || !ready || destroyed) return;
      try {
        if (q.getPlayerState() !== 1) { q.playVideo(); q.seekTo(currentTimeSec(), true); }
        q.setVolume(Math.round(cb.current.volume * 100));
        if (cb.current.muted || cb.current.volume === 0) q.mute(); else if (q.isMuted()) q.unMute();
      } catch { /* not ready */ }
    };
    if (!preview) document.addEventListener("pointerdown", resume);
    const startTs = Date.now() - 1000 * startPosition;
    const currentTimeSec = () => (Date.now() - startTs) / 1000;
    const target = document.createElement("div");
    host.appendChild(target);
    const interval = window.setInterval(() => cb.current.onProgress?.(currentTimeSec()), 1000);
    void prepareYouTube().then(() => {
      if (destroyed || !window.YT) return;
      playerRef.current = new window.YT.Player(target, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: { autoplay: preview ? 0 : 1, enablejsapi: 1, disablekb: 1, iv_load_policy: 3, playsinline: 1, modestbranding: 1, rel: 0, showinfo: 0, start: Math.floor(startPosition), vq: preview ? "default" : "small", origin: window.location.origin },
        events: {
          onReady: () => {
            ready = true;
            const p = playerRef.current;
            if (!p || destroyed) return;
            cb.current.onReady?.();
            if (!preview) {
              p.setVolume(Math.max(0, Math.min(100, Math.round(cb.current.volume * 100))));
              if (cb.current.muted || cb.current.volume === 0) p.mute();
              else { p.setVolume(Math.max(0, Math.min(100, Math.round(cb.current.volume * 100)))); p.unMute(); }
              p.playVideo();
              p.seekTo(currentTimeSec(), true);
              // Phones block unmuted autoplay: fall back to muted playback, unmute on the next tap.
              autoplayCheck = window.setTimeout(() => {
                const q = playerRef.current;
                if (!q || destroyed) return;
                if (q.getPlayerState() !== 1 && q.getPlayerState() !== 3) { q.mute(); q.playVideo(); q.seekTo(currentTimeSec(), true); }
              }, 1500);
              // Video host throttled/blocked: never started even muted -> server stream.
              stallCheck = window.setTimeout(() => { if (!started && !destroyed) cb.current.onBlocked(); }, 12000);
            }
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === 1) started = true;
            if (e.data === window.YT?.PlayerState["ENDED"]) cb.current.onComplete?.();
          },
          onError: (e: { data: number }) => { if (!preview && (e.data === 5 || e.data === 2)) return; if (!destroyed && !started) cb.current.onBlocked(); },
        },
      });
    }, () => { if (!destroyed) cb.current.onBlocked(); });
    return () => {
      destroyed = true;
      window.clearInterval(interval);
      window.clearTimeout(autoplayCheck);
      window.clearTimeout(stallCheck);
      document.removeEventListener("pointerdown", resume);
      if (ready) playerRef.current?.destroy();
      playerRef.current = null;
      host.innerHTML = "";
    };
  }, [videoId, preview, startPosition]);

  // updateSoundSettings()
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      p.setVolume(volume * 100);
      if (muted || volume === 0) p.mute();
      else p.unMute();
    } catch { /* player not ready yet */ }
  }, [muted, volume]);

  return <div ref={hostRef} className="music__video-frame" style={{ height: "100%" }} />;
}
