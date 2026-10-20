import { useEffect, useRef } from "react";

export function RemoteAudio({ id, stream, muted, onBlocked }: {
  id: string; stream: MediaStream; muted: boolean; onBlocked: (id: string, blocked: boolean) => void;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    let active = true;
    audio.srcObject = stream;
    audio.muted = muted;
    const play = () => {
      if (!active || muted) return;
      void audio.play().then(() => { if (active) onBlocked(id, false); }).catch(() => { if (active) onBlocked(id, true); });
    };
    const visible = () => { if (document.visibilityState === "visible") play(); };
    play();
    window.addEventListener("pointerdown", play, true);
    window.addEventListener("touchstart", play, true);
    window.addEventListener("voice-audio-resume", play);
    document.addEventListener("visibilitychange", visible);
    stream.addEventListener("addtrack", play);
    return () => {
      active = false;
      window.removeEventListener("pointerdown", play, true);
      window.removeEventListener("touchstart", play, true);
      window.removeEventListener("voice-audio-resume", play);
      document.removeEventListener("visibilitychange", visible);
      stream.removeEventListener("addtrack", play);
      audio.pause(); audio.srcObject = null;
    };
  }, [id, stream, muted, onBlocked]);
  return <audio ref={ref} autoPlay muted={muted} />;
}
