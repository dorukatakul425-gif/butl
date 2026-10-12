import { useEffect, useRef, useState } from "react";
import { YouTubeFrame } from "@/components/music/youtube-player";
import { finishMusic, setMusicMuted, setMusicVolume, type PlayingSong } from "@/lib/music-session";

// Markup ported from MusicViewPreact.tsx, UniversalPlayer.tsx and PlayerControls.tsx (portrait layout).
const bem = (block: string) => (element = "", mods: Array<string | false | undefined> = []) => {
  const base = element ? `${block}__${element}` : block;
  return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
const cls = bem("music");
const upCls = bem("universal-player");
const pcCls = bem("player-controls");

function backgroundImageSector(deg: number, bg: string, fg: string) {
  if (deg <= 180) return `linear-gradient(${90 + deg}deg, transparent 50%, ${bg} 50%),linear-gradient(90deg, ${bg} 50%, transparent 50%)`;
  return `linear-gradient(${deg - 90}deg, transparent 50%, ${fg} 50%),linear-gradient(90deg, ${bg} 50%, transparent 50%)`;
}

/** HTMLAudioPlayer: plays the catalogue url from the shared start time. */
function HtmlAudio({ url, startPosition, muted, volume, onReady, onProgress, onComplete }: { url: string; startPosition: number; muted: boolean; volume: number; onReady: () => void; onProgress: (s: number) => void; onComplete: () => void }) {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const ready = () => { try { a.currentTime = startPosition; } catch { /* ignore */ } onReady(); };
    const time = () => onProgress(a.currentTime);
    a.addEventListener("loadedmetadata", ready, { once: true });
    a.addEventListener("timeupdate", time);
    a.addEventListener("ended", onComplete);
    a.play().catch(() => { /* waits for the next tap */ });
    return () => { a.pause(); a.removeEventListener("timeupdate", time); a.removeEventListener("ended", onComplete); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  useEffect(() => { if (ref.current) { ref.current.muted = muted; ref.current.volume = volume; } }, [muted, volume]);
  return <audio ref={ref} src={url} className="music__html-audio--hidden" preload="auto" />;
}

export function MusicView({ song, muted, volume }: { song: PlayingSong; muted: boolean; volume: number }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startPosition] = useState(() => Math.max(0, (Date.now() - song.startedAt) / 1000));
  useEffect(() => { setReady(false); setProgress(0); }, [song.key]);

  // getPlayerParams(): the game is laid out in portrait (chat under the table).
  const frameWidth = typeof window === "undefined" ? 0 : window.innerWidth;
  const isLarge = frameWidth > 600;
  const size = isLarge ? "large" : "small";
  const position = "portrait";
  const hasVideo = song.isVideo;
  const media = hasVideo ? "video" : "audio";
  const supportVolume = true;
  const volumeClass = supportVolume ? "with-volume" : "no-volume";
  const title = `${song.musicItem.artist} - ${song.musicItem.title}`;
  const deg = 360 * Math.max(0, Math.min(1, progress / (song.musicItem.duration || 1)));
  const level = Math.max(0, Math.min(7, Math.round(song.sender.musicLevel)));
  const volumePercent = volume * 100;
  const rangeValue = muted ? 0 : volumePercent;
  const muteMode = muted ? "disabled" : volume > 0.5 ? "high" : "low";
  const done = () => finishMusic(song.key);

  return (
    <div className={cls("", [position, media, size])} style={{ right: 0, top: 6 }}>
      <div className={cls("top", [size, media, position, volumeClass])}>
        <div className={cls("progress", [ready ? undefined : "loading", size, position, media])}
          style={{ backgroundImage: ready ? backgroundImageSector(deg, "#F4F2EF", "#B6B6B6") : "none" }}>
          <div className={cls("photo", [size])} style={{ backgroundImage: `url('${song.sender.photoUrl}')` }} title={song.sender.name} />
        </div>
        {!hasVideo && <div title={title} className={cls("recorder", [`${level}`, size, position, media])} />}
        <div className={`${cls("player", [media, size, position])} ${upCls("")}`}>
          {hasVideo
            ? <>
                <div className={upCls("thumbnail", [ready ? "hidden" : undefined])} style={ready ? undefined : { backgroundImage: `url('https://img.youtube.com/vi/${song.musicItem.song_id}/0.jpg')` }} />
                <YouTubeFrame key={song.key} videoId={song.musicItem.song_id} startPosition={startPosition} muted={muted} volume={volume}
                  onReady={() => setReady(true)} onProgress={setProgress} onComplete={done} />
              </>
            : <HtmlAudio key={song.key} url={song.musicItem.url} startPosition={startPosition} muted={muted} volume={volume}
                onReady={() => setReady(true)} onProgress={setProgress} onComplete={done} />}
        </div>
      </div>
      <div className={pcCls("", [position, size, volumeClass])}>
        <div role="button" aria-label={muted ? "Sesi aç" : "Sesi kapat"} onClick={() => setMusicMuted(!muted)} className={pcCls("mute", [position, size, volumeClass, muteMode, media])} />
        <input type="range" aria-label="Ses" value={rangeValue} onChange={(e) => setMusicVolume(Number(e.target.value) / 100)}
          className={pcCls("slider", [size, supportVolume ? undefined : "disabled", position])}
          style={{ background: `linear-gradient(to right, #9dc93b ${rangeValue}%, #ccc ${rangeValue}%)` }} />
      </div>
    </div>
  );
}
