import { useEffect, useRef, useState } from "react";
import { YouTubeFrame } from "@/components/music/youtube-player";
import { finishMusic, setMusicMuted, setMusicVolume, getSharedAudio, type PlayingSong } from "@/lib/music-session";
import { Button } from "@/components/ui/button";
import { Play, Pause, X } from "lucide-react";

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
  const [playing,setPlaying] = useState(false);
  const [failed,setFailed] = useState(false);
  const cb = useRef({ onReady, onProgress, onComplete });
  cb.current = { onReady, onProgress, onComplete };
  useEffect(() => {
    const a = getSharedAudio();
    if (!a) return;
    if (a.src !== url) a.src = url;
    const ready = () => { try { if (startPosition > 1) a.currentTime = startPosition; } catch { /* ignore */ } cb.current.onReady(); };
    const time = () => cb.current.onProgress(a.currentTime);
    const ended = () => cb.current.onComplete();
    const onPlay = () => { setPlaying(true); setFailed(false); };
    const onPause = () => setPlaying(false);
    const onError = () => setFailed(true);
    if (a.readyState >= 1) ready(); else a.addEventListener("loadedmetadata", ready, { once: true });
    a.addEventListener("timeupdate", time); a.addEventListener("ended", ended);
    a.addEventListener("play", onPlay); a.addEventListener("pause", onPause); a.addEventListener("error", onError);
    setPlaying(!a.paused);
    if (a.paused) void a.play().catch(() => setPlaying(false));
    // If the browser still blocked playback, the first tap anywhere starts it.
    const resume = () => { if (a.paused && !a.ended) void a.play().catch(() => {}); };
    document.addEventListener("pointerdown", resume, true);
    return () => {
      a.pause();
      document.removeEventListener("pointerdown", resume, true);
      a.removeEventListener("loadedmetadata", ready); a.removeEventListener("timeupdate", time); a.removeEventListener("ended", ended);
      a.removeEventListener("play", onPlay); a.removeEventListener("pause", onPause); a.removeEventListener("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  useEffect(() => { const a = getSharedAudio(); if (a) { a.muted = muted; a.volume = volume; } }, [muted, volume]);
  return <>
    <Button variant="ghost" className="music-play-toggle" aria-label={playing ? "Müziği duraklat" : failed ? "Müziği yeniden dene" : "Müziği oynat"} title={playing ? "Duraklat" : "Oynat"} onClick={()=>{
      const audio=getSharedAudio(); if(!audio)return;
      if(playing)audio.pause();else {if(failed){audio.load();setFailed(false);}void audio.play().catch(()=>setPlaying(false));}
    }}>{playing ? <Pause size={18}/> : <Play size={18}/>}</Button>
  </>;
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
      <Button variant="ghost" className="music-stop-button" aria-label="Müziği kapat" title="Kapat" onClick={done}><X size={14}/></Button>
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
