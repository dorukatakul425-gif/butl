import { useEffect, useRef } from "react";

// Port of YouTubePlayer.ts: official iframe API, same playerVars, synced start position.
interface YTPlayer {
  destroy(): void; mute(): void; unMute(): void; setVolume(v: number): void; playVideo(): void;
  seekTo(s: number, a: boolean): void; getDuration(): number;
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer; PlayerState: Record<string, number> };
    onYouTubeIframeAPIReady?: (() => void) | undefined;
  }
}
let prepare: Promise<void> | null = null;
export function prepareYouTube() {
  if (!prepare) {
    prepare = new Promise<void>((resolve) => {
      if (window.YT?.Player) return resolve();
      window.onYouTubeIframeAPIReady = () => { window.onYouTubeIframeAPIReady = undefined; resolve(); };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    });
  }
  return prepare;
}

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

export function YouTubeFrame({ videoId, preview = false, startPosition = 0, muted = false, volume = 1, onReady, onProgress, onComplete }: YouTubeFrameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const cb = useRef({ onReady, onProgress, onComplete, muted, volume });
  cb.current = { onReady, onProgress, onComplete, muted, volume };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let destroyed = false;
    let ready = false;
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
        playerVars: { enablejsapi: 1, disablekb: 1, iv_load_policy: 3, playsinline: 1, modestbranding: 1, rel: 0, showinfo: 0, start: Math.floor(startPosition), vq: preview ? "default" : "small", origin: window.location.origin },
        events: {
          onReady: () => {
            ready = true;
            const p = playerRef.current;
            if (!p || destroyed) return;
            cb.current.onReady?.();
            if (!preview) {
              if (cb.current.muted) p.mute();
              else { p.setVolume(Math.max(0, Math.min(100, Math.round(cb.current.volume * 100)))); p.unMute(); }
              p.playVideo();
              p.seekTo(currentTimeSec(), true);
            }
          },
          onStateChange: (e: { data: number }) => { if (e.data === window.YT?.PlayerState["ENDED"]) cb.current.onComplete?.(); },
        },
      });
    });
    return () => {
      destroyed = true;
      window.clearInterval(interval);
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
      if (muted) p.mute();
      else { if (volume) p.setVolume(volume * 100); p.unMute(); }
    } catch { /* player not ready yet */ }
  }, [muted, volume]);

  return <div ref={hostRef} className="music__video-frame" style={{ height: "100%" }} />;
}
