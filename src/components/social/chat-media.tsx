// Image + voice-note support for the direct-message composer and bubbles.
// Files go to private storage; the message row is delivered to the peer over the realtime WebSocket channel.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { translate } from "@/lib/app-preferences";
import { mediaUrl, sendMediaMessage, type DirectMessage } from "@/lib/social";
import { IconImage, IconMic, IconPause, IconPlay, IconSend, IconTrash, IconClose } from "@/components/ui-icons";

const fmt = (ms: number) => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

function pickMime() {
  if (typeof MediaRecorder === "undefined") return "";
  for (const t of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]) if (MediaRecorder.isTypeSupported(t)) return t;
  return "";
}

export function MediaComposer({ me, peer, onSent, onError, children }: { me: string; peer: string; onSent: (m: DirectMessage) => void; onError: (e: string) => void; children: ReactNode }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [rec, setRec] = useState<{ start: number } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState<number[]>([]);
  const recRef = useRef<{ mr: MediaRecorder; stream: MediaStream; chunks: Blob[]; cancel: boolean; ctx?: AudioContext; raf?: number } | null>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview.url); }, [preview]);
  useEffect(() => () => stopTracks(), []);
  useEffect(() => { if (!rec) return; const t = window.setInterval(() => setElapsed(Date.now() - rec.start), 200); return () => window.clearInterval(t); }, [rec]);

  function stopTracks() { const r = recRef.current; if (!r) return; r.stream.getTracks().forEach(t => t.stop()); if (r.raf) cancelAnimationFrame(r.raf); void r.ctx?.close(); }

  const sendImage = async () => {
    if (!preview || busy) return;
    setBusy(true); onError("");
    const res = await sendMediaMessage(me, peer, preview.file, "image", { caption: caption.trim() });
    setBusy(false);
    if (!res.ok) { onError(translate(res.error)); return; }
    onSent(res.message); setPreview(null); setCaption("");
  };

  const startRec = async () => {
    onError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { onError(translate("Bu cihaz səs yazmağı dəstəkləmir")); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mime = pickMime();
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const r: NonNullable<typeof recRef.current> = { mr, stream, chunks: [], cancel: false };
      recRef.current = r;
      try {
        const ctx = new AudioContext(); const an = ctx.createAnalyser(); an.fftSize = 64; ctx.createMediaStreamSource(stream).connect(an);
        const buf = new Uint8Array(an.frequencyBinCount); r.ctx = ctx;
        const tick = () => { an.getByteFrequencyData(buf); const v = buf.reduce((a, b) => a + b, 0) / buf.length / 255; setLevel(l => [...l.slice(-27), v]); r.raf = requestAnimationFrame(tick); };
        tick();
      } catch { /* meter optional */ }
      const start = Date.now();
      mr.ondataavailable = e => { if (e.data.size) r.chunks.push(e.data); };
      mr.onstop = async () => {
        stopTracks(); setRec(null); setLevel([]);
        const duration = Date.now() - start;
        if (r.cancel || duration < 600) return;
        const blob = new Blob(r.chunks, { type: (mr.mimeType || mime || "audio/webm").split(";")[0] ?? "audio/webm" });
        setBusy(true);
        const res = await sendMediaMessage(me, peer, blob, "audio", { durationMs: duration });
        setBusy(false);
        if (!res.ok) onError(translate(res.error)); else onSent(res.message);
      };
      mr.start(250);
      setElapsed(0); setRec({ start });
    } catch { onError(translate("Mikrofona icazə verilmədi")); }
  };
  const stopRec = (cancel: boolean) => { const r = recRef.current; if (!r || r.mr.state === "inactive") return; r.cancel = cancel; r.mr.stop(); };

  return <>
    <style>{CM_STYLES}</style>
    {preview && <div className="cm-preview" role="dialog" aria-label={translate("Şəkil göndər")}>
      <button type="button" className="cm-x" onClick={() => setPreview(null)} aria-label={translate("Bağla")}><IconClose size={20} /></button>
      <img src={preview.url} alt="" />
      <div className="cm-preview-bar">
        <input value={caption} onChange={e => setCaption(e.target.value)} maxLength={300} placeholder={translate("Açıqlama əlavə et…")} />
        <button type="button" className="sm-send" disabled={busy} onClick={() => void sendImage()} aria-label={translate("Göndər")}>{busy ? <span className="cm-spin" /> : <IconSend size={18} />}</button>
      </div>
    </div>}
    <div className="sm-composer">
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; if (!f.type.startsWith("image/")) { onError(translate("Yalnız şəkil faylı seçin.")); return; } setPreview({ file: f, url: URL.createObjectURL(f) }); }} />
      {rec ? <div className="cm-rec">
        <button type="button" className="cm-tool danger" onClick={() => stopRec(true)} aria-label={translate("Ləğv et")}><IconTrash size={20} /></button>
        <span className="cm-dot" /><span className="cm-time">{fmt(elapsed)}</span>
        <span className="cm-wave">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ height: `${12 + (level[i] ?? 0) * 80}%` }} />)}</span>
        <button type="button" className="sm-send" onClick={() => stopRec(false)} aria-label={translate("Göndər")}><IconSend size={18} /></button>
      </div> : <>
        <button type="button" className="cm-tool" disabled={busy} onClick={() => fileRef.current?.click()} aria-label={translate("Şəkil göndər")}><IconImage size={22} /></button>
        {children}
        <button type="button" className="cm-tool mic" disabled={busy} onClick={() => void startRec()} aria-label={translate("Səsli mesaj yaz")}>{busy ? <span className="cm-spin" /> : <IconMic size={22} />}</button>
      </>}
    </div>
  </>;
}

function useSigned(path: string) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => { let on = true; void mediaUrl(path).then(u => { if (on) setUrl(u); }); return () => { on = false; }; }, [path]);
  return url;
}

export function MediaImage({ path }: { path: string }) {
  const url = useSigned(path);
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className="cm-img" onClick={() => url && setOpen(true)} aria-label={translate("Şəkli aç")}>{url ? <img src={url} alt="" loading="lazy" /> : <span className="cm-img-ph" />}</button>
    {open && url && <div className="cm-lightbox" onClick={() => setOpen(false)}><img src={url} alt="" /></div>}
  </>;
}

export function VoiceBubble({ path, durationMs, mine }: { path: string; durationMs: number | null; mine: boolean }) {
  const url = useSigned(path);
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const total = durationMs ?? 0;
  const bars = useRef(Array.from({ length: 26 }, (_, i) => 0.3 + Math.abs(Math.sin(i * 1.7 + path.length)) * 0.7)).current;
  const pct = total ? Math.min(1, pos / total) : 0;
  return <span className={"cm-voice" + (mine ? " mine" : "")}>
    <button type="button" disabled={!url} aria-label={playing ? translate("Dayandır") : translate("Dinlə")} onClick={() => { const a = audio.current; if (!a) return; if (a.paused) void a.play(); else a.pause(); }}>{playing ? <IconPause size={16} /> : <IconPlay size={16} />}</button>
    <span className="cm-bars">{bars.map((h, i) => <i key={i} className={i / bars.length < pct ? "on" : ""} style={{ height: `${h * 100}%` }} />)}</span>
    <small>{fmt(playing || pos ? pos : total)}</small>
    {url && <audio ref={audio} src={url} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setPos(0); }} onTimeUpdate={e => setPos(e.currentTarget.currentTime * 1000)} />}
  </span>;
}

const CM_STYLES = `
.sm-composer{align-items:center!important;}
.sm-composer-form{flex:1;display:flex;align-items:flex-end;gap:8px;min-width:0;}
.cm-tool{all:unset;cursor:pointer;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;color:var(--muted-foreground);flex-shrink:0;transition:background .2s,color .2s,transform .15s;}
.cm-tool:hover{background:var(--surface);color:var(--primary);}.cm-tool:active{transform:scale(.9);}
.cm-tool.mic{background:var(--accent);color:var(--primary);}
.cm-tool.danger{color:var(--heart);}
.cm-tool:disabled{opacity:.5;cursor:default;}
.cm-rec{flex:1;display:flex;align-items:center;gap:10px;min-width:0;}
.cm-dot{width:10px;height:10px;border-radius:50%;background:var(--heart);animation:cm-blink 1s infinite;}
.cm-time{font-variant-numeric:tabular-nums;font-weight:700;font-size:14px;}
.cm-wave{flex:1;display:flex;align-items:center;gap:2px;height:30px;min-width:0;}
.cm-wave i{flex:1;min-width:2px;border-radius:2px;background:var(--primary);transition:height .1s;}
.cm-spin{width:18px;height:18px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:cm-rot .7s linear infinite;}
.cm-img{all:unset;cursor:zoom-in;display:block;margin:-3px -6px 2px -8px;border-radius:14px;overflow:hidden;width:calc(100% + 14px);}
.cm-img img{display:block;width:100%;max-width:240px;max-height:320px;object-fit:cover;}
.cm-img-ph{display:block;width:220px;height:160px;background:color-mix(in oklch,var(--muted-foreground) 25%,transparent);animation:cm-blink 1.2s infinite;}
.cm-lightbox{position:fixed;inset:0;z-index:90;background:oklch(0 0 0 / .9);display:grid;place-items:center;padding:16px;animation:sm-in .2s;}
.cm-lightbox img{max-width:100%;max-height:100%;border-radius:10px;}
.cm-voice{display:flex;align-items:center;gap:8px;min-width:190px;}
.cm-voice button{all:unset;cursor:pointer;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--primary);color:var(--primary-foreground);flex-shrink:0;}
.cm-voice.mine button{background:var(--primary-foreground);color:var(--primary);}
.cm-bars{flex:1;display:flex;align-items:center;gap:2px;height:26px;}
.cm-bars i{flex:1;border-radius:2px;background:currentColor;opacity:.35;}.cm-bars i.on{opacity:1;}
.cm-voice small{font-size:11px;font-variant-numeric:tabular-nums;opacity:.8;}
.cm-preview{position:fixed;inset:0;z-index:80;background:oklch(.12 0 0);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) 12px max(12px,env(safe-area-inset-bottom));}
.cm-preview>img{flex:1;min-height:0;max-width:100%;object-fit:contain;border-radius:12px;}
.cm-x{all:unset;cursor:pointer;position:absolute;top:max(14px,env(safe-area-inset-top));left:14px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:oklch(1 0 0 / .15);color:oklch(1 0 0);}
.cm-preview-bar{display:flex;gap:8px;width:100%;max-width:560px;margin-top:12px;}
.cm-preview-bar input{flex:1;height:44px;padding:0 16px;border-radius:22px;border:0;background:oklch(1 0 0 / .14);color:oklch(1 0 0);font:inherit;outline:none;}
@keyframes cm-blink{50%{opacity:.35;}}
@keyframes cm-rot{to{transform:rotate(360deg);}}
`;
