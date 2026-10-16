// Home statuses: WhatsApp-style ring row + TikTok-style vertical viewer with likes/comments.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Heart, MessageCircle, Plus, X, Trash2, Send, Type, Image as ImageIcon, Video, LoaderCircle, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import {
  STATUS_BGS, statusBg, loadFeed, createStatus, deleteStatus, cleanupOwnExpired, setLike,
  loadComments, addComment, deleteComment, timeAgo, timeLeft, readSeen, markSeen, fileKind,
  IMAGE_LIMIT, VIDEO_LIMIT, type FeedStatus, type StatusKind, type StatusComment,
} from "@/lib/statuses";

type Me = { id: string; name: string; photo_url?: string | null | undefined };

export function StatusStrip({ me, defaultPhoto }: { me: Me; defaultPhoto: string }) {
  const [feed, setFeed] = useState<FeedStatus[] | null>(null);
  const [error, setError] = useState("");
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [composer, setComposer] = useState(false);
  const [viewerAt, setViewerAt] = useState<{ g: number; i: number } | null>(null);

  const refresh = useCallback(async () => {
    try { setFeed(await loadFeed()); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Statuslar yüklənmədi."); setFeed(f => f ?? []); }
  }, []);
  useEffect(() => {
    setSeen(readSeen());
    void cleanupOwnExpired(me.id).catch(() => undefined).finally(() => void refresh());
    const t = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(t);
  }, [me.id, refresh]);

  // Own statuses first, then others grouped per author (newest author first).
  const ordered = useMemo(() => {
    const list = feed ?? [];
    const groups = new Map<string, FeedStatus[]>();
    for (const s of list) { const g = groups.get(s.userId) ?? []; g.push(s); groups.set(s.userId, g); }
    for (const g of groups.values()) g.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const own = groups.get(me.id) ?? [];
    groups.delete(me.id);
    const others = Array.from(groups.values()).sort((a, b) => (b[b.length - 1]?.createdAt ?? "").localeCompare(a[a.length - 1]?.createdAt ?? ""));
    return { own, others, flat: [...own, ...others.flat()] };
  }, [feed, me.id]);

  const groups = useMemo(() => [ordered.own, ...ordered.others].filter(g => g.length > 0), [ordered]);
  const openAt = (id: string | undefined) => {
    if (!id) return;
    for (let g = 0; g < groups.length; g++) {
      const i = groups[g]!.findIndex(s => s.id === id);
      if (i >= 0) { setViewerAt({ g, i }); return; }
    }
  };
  const firstUnseen = (g: FeedStatus[]) => (g.find(s => !seen.has(s.id)) ?? g[0])?.id;
  const onSeen = useCallback((id: string) => { markSeen(id); setSeen(prev => prev.has(id) ? prev : new Set(prev).add(id)); }, []);
  const patch = useCallback((id: string, p: Partial<FeedStatus>) => setFeed(f => f?.map(s => s.id === id ? { ...s, ...p } : s) ?? f), []);

  return <section aria-label="Statuslar" className="st-section">
    <style>{STATUS_STYLES}</style>
    <div className="mh-status-heading"><h2>Statuslar</h2>{feed && <span className="st-count">{ordered.flat.length ? `${ordered.flat.length} aktiv` : "24 saat"}</span>}</div>
    <div className="mh-status-list">
      <div className="mh-story">
        <button type="button" className="st-add" onClick={() => setComposer(true)} aria-label="Status əlavə et">
          <span className="st-add-ring" aria-hidden="true" />
          <img src={me.photo_url || defaultPhoto} alt="" />
          <span className="st-add-plus" aria-hidden="true"><Plus size={14} strokeWidth={3} /></span>
        </button>
        <span className="mh-story-label st-add-label">Status əlavə et</span>
      </div>
      {ordered.own.length > 0 && <StoryBubble group={ordered.own} label="Statusum" seen={seen} onOpen={() => openAt(ordered.own[0]?.id)} defaultPhoto={defaultPhoto} />}
      {ordered.others.map(g => <StoryBubble key={g[0]!.userId} group={g} label={g[0]!.authorName} seen={seen} onOpen={() => openAt(firstUnseen(g))} defaultPhoto={defaultPhoto} />)}
      {feed === null && [0, 1, 2].map(i => <div className="mh-story" key={i}><span className="st-skeleton" /><span className="mh-story-label">&nbsp;</span></div>)}
      {feed && !ordered.flat.length && <p className="st-empty">Hələ status yoxdur — ilk sən paylaş ✨</p>}
    </div>
    {error && <p role="status" className="mh-notice">{error}</p>}
    {composer && <StatusComposer me={me} onClose={() => setComposer(false)} onDone={async () => { setComposer(false); await refresh(); }} />}
    {viewerAt !== null && groups.length > 0 && <StatusViewer
      groups={groups} startGroup={Math.min(viewerAt.g, groups.length - 1)} startIndex={viewerAt.i} me={me} defaultPhoto={defaultPhoto}
      onClose={() => { setViewerAt(null); void refresh(); }} onSeen={onSeen} onPatch={patch}
      onDeleted={id => { setFeed(f => f?.filter(s => s.id !== id) ?? f); }} />}
  </section>;
}

function StoryBubble({ group, label, seen, onOpen, defaultPhoto }: { group: FeedStatus[]; label: string; seen: Set<string>; onOpen: () => void; defaultPhoto: string }) {
  const n = group.length;
  const unseen = group.some(s => !seen.has(s.id));
  const last = group[n - 1]!;
  // Segmented WhatsApp ring: one arc per status.
  const gap = n > 1 ? 4 : 0;
  const seg = (360 - gap * n) / n;
  const stops = group.map((s, i) => {
    const a = i * (seg + gap); const c = seen.has(s.id) ? "var(--st-seen)" : "var(--st-ring)";
    return `${c} ${a}deg ${a + seg}deg, transparent ${a + seg}deg ${a + seg + gap}deg`;
  }).join(", ");
  return <div className="mh-story">
    <button type="button" className={"st-bubble" + (unseen ? " unseen" : "")} style={{ background: `conic-gradient(${stops})` }} onClick={onOpen} aria-label={`${label} statusunu aç`}>
      <span className="st-bubble-inner">
        {last.kind === "image" && last.mediaUrl ? <img src={last.mediaUrl} alt="" loading="lazy" />
          : last.kind === "text" ? <span className="st-bubble-text" style={{ background: statusBg(last.bg) }}>{(last.body ?? "").slice(0, 18)}</span>
          : <img src={last.authorPhoto || defaultPhoto} alt="" loading="lazy" />}
        {last.kind === "video" && <span className="st-bubble-play" aria-hidden="true">▶</span>}
      </span>
    </button>
    <span className="mh-story-label">{label}</span>
  </div>;
}

/* ---------------- Composer ---------------- */
function StatusComposer({ me, onClose, onDone }: { me: Me; onClose: () => void; onDone: () => Promise<void> }) {
  const [kind, setKind] = useState<StatusKind>("text");
  const [text, setText] = useState("");
  const [bg, setBg] = useState("emerald");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const pick = useRef<HTMLInputElement>(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useBodyLock();
  useEscape(onClose);

  const choose = (k: StatusKind) => { setKind(k); setMsg(""); if (k !== "text") { setFile(null); setPreview(null); window.setTimeout(() => pick.current?.click(), 30); } };
  const onFile = (f: File | undefined) => {
    if (!f) return;
    const k = fileKind(f);
    if (!k || (kind !== "text" && k !== kind)) { setMsg(kind === "video" ? "Video faylı seçin." : "Şəkil faylı seçin."); return; }
    if (f.size > (k === "video" ? VIDEO_LIMIT : IMAGE_LIMIT)) { setMsg(k === "video" ? "Video 50 MB-dan kiçik olmalıdır." : "Şəkil 10 MB-dan kiçik olmalıdır."); return; }
    setMsg(""); setKind(k); setFile(f); setPreview(URL.createObjectURL(f));
  };
  const share = async () => {
    setBusy(true); setMsg("");
    try { await createStatus(me.id, { kind, body: text, bg, file }); await onDone(); }
    catch (e) { setMsg(e instanceof Error ? e.message : "Status paylaşılmadı."); }
    finally { setBusy(false); }
  };
  const canShare = !busy && (kind === "text" ? text.trim().length > 0 : Boolean(file));

  return <div className="st-full st-composer" role="dialog" aria-modal="true" aria-label="Yeni status">
    <div className="st-stage" style={kind === "text" ? { background: statusBg(bg) } : undefined}>
      {kind === "text" && <textarea autoFocus className="st-text-input" placeholder="Status yaz…" maxLength={700} value={text} onChange={e => setText(e.target.value)} />}
      {kind !== "text" && preview && (kind === "video"
        ? <video className="st-media" src={preview} autoPlay muted loop playsInline />
        : <img className="st-media" src={preview} alt="Önizləmə" />)}
      {kind !== "text" && !preview && <button type="button" className="st-pick" onClick={() => pick.current?.click()}>
        {kind === "video" ? <Video size={38} /> : <ImageIcon size={38} />}<span>{kind === "video" ? "Video seç (max 50 MB)" : "Şəkil seç (max 10 MB)"}</span></button>}
    </div>
    <div className="st-top"><button type="button" className="st-icon" onClick={onClose} aria-label="Bağla"><X /></button><strong>Yeni status</strong><span className="st-top-sp" /></div>
    <div className="st-composer-bottom">
      {kind === "text" && <div className="st-colors">{Object.keys(STATUS_BGS).map(k => <button key={k} type="button" aria-label={k} className={"st-color" + (bg === k ? " on" : "")} style={{ background: statusBg(k) }} onClick={() => setBg(k)} />)}</div>}
      {kind !== "text" && file && <input className="st-caption" placeholder="Açıqlama əlavə et…" maxLength={700} value={text} onChange={e => setText(e.target.value)} />}
      {msg && <p className="st-msg" role="status">{msg}</p>}
      <div className="st-composer-row">
        <div className="st-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={kind === "text"} className={kind === "text" ? "on" : ""} onClick={() => choose("text")}><Type size={16} />Yazı</button>
          <button type="button" role="tab" aria-selected={kind === "image"} className={kind === "image" ? "on" : ""} onClick={() => choose("image")}><ImageIcon size={16} />Şəkil</button>
          <button type="button" role="tab" aria-selected={kind === "video"} className={kind === "video" ? "on" : ""} onClick={() => choose("video")}><Video size={16} />Video</button>
        </div>
        <button type="button" className="st-send" disabled={!canShare} onClick={() => void share()} aria-label="Paylaş">{busy ? <LoaderCircle className="st-spin" /> : <Send />}</button>
      </div>
    </div>
    <input ref={pick} type="file" hidden accept={kind === "video" ? "video/mp4,video/webm,video/quicktime,video/*" : "image/*"} onChange={e => { const f = e.target.files?.[0]; e.target.value = ""; onFile(f); }} />
  </div>;
}

/* ---------------- Viewer (TikTok style) ---------------- */
function StatusViewer({ groups, startGroup, startIndex, me, defaultPhoto, onClose, onSeen, onPatch, onDeleted }: {
  groups: FeedStatus[][]; startGroup: number; startIndex: number; me: Me; defaultPhoto: string; onClose: () => void;
  onSeen: (id: string) => void; onPatch: (id: string, p: Partial<FeedStatus>) => void; onDeleted: (id: string) => void;
}) {
  // Vertical swipe = next/previous person; horizontal swipe or side taps = that person's other statuses.
  const scroller = useRef<HTMLDivElement>(null);
  const tracks = useRef(new Map<string, HTMLDivElement>());
  const [active, setActive] = useState(startGroup);
  const [sub, setSub] = useState<Record<string, number>>(() => ({ [groups[startGroup]?.[0]?.userId ?? ""]: startIndex }));
  const [muted, setMuted] = useState(true);
  const [commentsFor, setCommentsFor] = useState<FeedStatus | null>(null);
  const videos = useRef(new Map<string, HTMLVideoElement>());
  useBodyLock();
  useEscape(() => { if (commentsFor) setCommentsFor(null); else onClose(); });

  const keyOf = (g: FeedStatus[] | undefined) => g?.[0]?.userId ?? "";
  const idxOf = (g: FeedStatus[] | undefined) => Math.min(sub[keyOf(g)] ?? 0, Math.max(0, (g?.length ?? 1) - 1));
  useLayoutEffect(() => {
    const el = scroller.current; if (el) el.scrollTop = startGroup * el.clientHeight;
    const t = tracks.current.get(keyOf(groups[startGroup])); if (t) t.scrollLeft = startIndex * t.clientWidth;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startGroup, startIndex]);
  const onScroll = () => { const el = scroller.current; if (!el) return; const i = Math.round(el.scrollTop / Math.max(1, el.clientHeight)); if (i !== active) setActive(Math.max(0, Math.min(groups.length - 1, i))); };
  const onTrackScroll = (key: string, el: HTMLDivElement, n: number) => {
    const i = Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
    setSub(prev => prev[key] === i ? prev : { ...prev, [key]: i });
  };
  const curGroup = groups[active];
  const curIdx = idxOf(curGroup);
  const cur = curGroup?.[curIdx];
  useEffect(() => { if (cur) onSeen(cur.id); }, [cur, onSeen]);
  useEffect(() => {
    videos.current.forEach((v, id) => {
      if (id === cur?.id) { v.muted = muted; void v.play().catch(() => { v.muted = true; setMuted(true); void v.play().catch(() => undefined); }); }
      else { v.pause(); try { v.currentTime = 0; } catch { /* not seekable yet */ } }
    });
  }, [cur?.id, muted]);

  const goGroup = (g: number) => { const el = scroller.current; if (el && g >= 0 && g < groups.length) el.scrollTo({ top: g * el.clientHeight, behavior: "smooth" }); };
  const step = (dir: 1 | -1) => {
    if (!curGroup) return;
    const next = curIdx + dir;
    if (next < 0) { goGroup(active - 1); return; }
    if (next >= curGroup.length) { if (active < groups.length - 1) goGroup(active + 1); else onClose(); return; }
    const t = tracks.current.get(keyOf(curGroup));
    if (t) t.scrollTo({ left: next * t.clientWidth, behavior: "smooth" });
    setSub(prev => ({ ...prev, [keyOf(curGroup)]: next }));
  };

  const toggleLike = async (s: FeedStatus, force?: boolean) => {
    const like = force ?? !s.liked;
    if (like === s.liked) return;
    onPatch(s.id, { liked: like, likeCount: Math.max(0, s.likeCount + (like ? 1 : -1)) });
    try { await setLike(s.id, me.id, like); }
    catch { onPatch(s.id, { liked: s.liked, likeCount: s.likeCount }); }
  };
  const total = groups.reduce((n, g) => n + g.length, 0);
  const remove = async (s: FeedStatus) => {
    if (!window.confirm("Bu status silinsin?")) return;
    try { await deleteStatus(s); onDeleted(s.id); if (total <= 1) onClose(); } catch { window.alert("Status silinmədi."); }
  };

  return <div className="st-full st-viewer" role="dialog" aria-modal="true" aria-label="Statuslar">
    <div ref={scroller} className="st-scroller" onScroll={onScroll}>
      {groups.map((g, gi) => { const key = keyOf(g); return <section key={key} className="st-group" aria-label={g[0]?.authorName}>
        <div className="st-hscroll" ref={el => { if (el) tracks.current.set(key, el); else tracks.current.delete(key); }} onScroll={e => onTrackScroll(key, e.currentTarget, g.length)}>
          {g.map((s, i) => <StatusSlide key={s.id} s={s} near={Math.abs(gi - active) <= 1 && Math.abs(i - idxOf(g)) <= 1} mine={s.userId === me.id} defaultPhoto={defaultPhoto}
            videoRef={el => { if (el) videos.current.set(s.id, el); else videos.current.delete(s.id); }}
            muted={muted} onToggleMute={() => setMuted(m => !m)} onPrev={() => step(-1)} onNext={() => step(1)}
            onLike={force => void toggleLike(s, force)} onComments={() => setCommentsFor(s)} onDelete={() => void remove(s)} />)}
        </div>
      </section>; })}
    </div>
    <div className="st-top st-top-viewer">
      <button type="button" className="st-icon" onClick={onClose} aria-label="Bağla"><X /></button>
      <div className="st-dots" aria-hidden="true">{curGroup && curGroup.length <= 30 && curGroup.map((s, i) => <span key={s.id} className={i === curIdx ? "on" : i < curIdx ? "past" : ""} />)}</div>
      {curGroup && curGroup.length > 1 && <span className="st-counter">{curIdx + 1}/{curGroup.length}</span>}
      {cur?.kind === "video" ? <button type="button" className="st-icon" onClick={() => setMuted(m => !m)} aria-label={muted ? "Səsi aç" : "Səsi bağla"}>{muted ? <VolumeX /> : <Volume2 />}</button> : <span className="st-top-sp" />}
    </div>
    {curGroup && curGroup.length > 1 && <>
      {curIdx > 0 && <button type="button" className="st-nav prev" onClick={() => step(-1)} aria-label="Əvvəlki status"><ChevronLeft /></button>}
      {curIdx < curGroup.length - 1 && <button type="button" className="st-nav next" onClick={() => step(1)} aria-label="Növbəti status"><ChevronRight /></button>}
    </>}
    {commentsFor && <CommentsSheet status={commentsFor} me={me} defaultPhoto={defaultPhoto} onClose={() => setCommentsFor(null)} onCount={n => onPatch(commentsFor.id, { commentCount: n })} />}
  </div>;
}

function StatusSlide({ s, near, mine, defaultPhoto, videoRef, muted, onToggleMute, onPrev, onNext, onLike, onComments, onDelete }: {
  s: FeedStatus; near: boolean; mine: boolean; defaultPhoto: string; videoRef: (el: HTMLVideoElement | null) => void;
  muted: boolean; onToggleMute: () => void; onPrev: () => void; onNext: () => void; onLike: (force?: boolean) => void; onComments: () => void; onDelete: () => void;
}) {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [pop, setPop] = useState(0);
  const lastTap = useRef(0);
  const single = useRef<number | undefined>(undefined);
  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      window.clearTimeout(single.current);
      const r = e.currentTarget.getBoundingClientRect();
      const id = now;
      setBursts(b => [...b, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
      window.setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 900);
      setPop(p => p + 1);
      onLike(true);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
      // Single tap: left third = previous, right third = next, middle = mute (video).
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left) / Math.max(1, r.width);
      const action = x < 0.3 ? onPrev : x > 0.7 ? onNext : s.kind === "video" ? onToggleMute : null;
      if (action) single.current = window.setTimeout(action, 290);
    }
  };
  return <article className="st-slide">
    <div className="st-slide-stage" style={s.kind === "text" ? { background: statusBg(s.bg) } : undefined} onClick={onTap}>
      {s.kind === "text" && <p className="st-slide-text">{s.body}</p>}
      {s.kind === "image" && s.mediaUrl && <><img className="st-blur" src={s.mediaUrl} alt="" aria-hidden="true" /><img className="st-media" src={s.mediaUrl} alt={s.body || s.authorName} loading={near ? "eager" : "lazy"} /></>}
      {s.kind === "video" && s.mediaUrl && <video ref={videoRef} className="st-media" src={near ? s.mediaUrl : undefined} preload={near ? "auto" : "none"} loop playsInline muted={muted} />}
      {bursts.map(b => <span key={b.id} className="st-burst" style={{ left: b.x, top: b.y }} aria-hidden="true"><Heart fill="currentColor" /></span>)}
    </div>
    <div className="st-shade" aria-hidden="true" />
    <aside className="st-rail">
      <img className="st-rail-avatar" src={s.authorPhoto || defaultPhoto} alt={s.authorName} />
      <button type="button" key={pop} className={"st-rail-btn" + (s.liked ? " liked" : "")} onClick={() => onLike()} aria-pressed={s.liked} aria-label="Bəyən"><Heart fill={s.liked ? "currentColor" : "none"} /><span>{s.likeCount}</span></button>
      <button type="button" className="st-rail-btn" onClick={onComments} aria-label="Şərhlər"><MessageCircle /><span>{s.commentCount}</span></button>
      {mine && <button type="button" className="st-rail-btn" onClick={onDelete} aria-label="Sil"><Trash2 /><span>Sil</span></button>}
    </aside>
    <div className="st-info">
      <strong>{mine ? "Sən" : s.authorName}</strong> <small>· {timeAgo(s.createdAt)} · {timeLeft(s.expiresAt)}</small>
      {s.kind !== "text" && s.body && <p>{s.body}</p>}
    </div>
  </article>;
}

function CommentsSheet({ status, me, defaultPhoto, onClose, onCount }: { status: FeedStatus; me: Me; defaultPhoto: string; onClose: () => void; onCount: (n: number) => void }) {
  const [list, setList] = useState<StatusComment[] | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const countRef = useRef(onCount); countRef.current = onCount;
  const load = useCallback(async () => {
    try { const c = await loadComments(status.id); setList(c); countRef.current(c.length); }
    catch (e) { setMsg(e instanceof Error ? e.message : "Şərhlər yüklənmədi."); setList(l => l ?? []); }
  }, [status.id]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [list?.length]);
  const send = async () => {
    if (!text.trim() || busy) return;
    setBusy(true); setMsg("");
    try { await addComment(status.id, me.id, text); setText(""); await load(); }
    catch (e) { setMsg(e instanceof Error ? e.message : "Şərh göndərilmədi."); }
    finally { setBusy(false); }
  };
  const canDelete = (c: StatusComment) => c.userId === me.id || status.userId === me.id;
  return <div className="st-sheet-wrap" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="st-sheet" role="dialog" aria-label="Şərhlər">
      <span className="st-grip" aria-hidden="true" />
      <div className="st-sheet-head"><strong>{list ? `${list.length} şərh` : "Şərhlər"}</strong><button type="button" className="st-icon dark" onClick={onClose} aria-label="Bağla"><X size={18} /></button></div>
      <div className="st-comments">
        {list === null && <p className="st-muted"><LoaderCircle className="st-spin" size={16} /> Yüklənir…</p>}
        {list?.length === 0 && <p className="st-muted">İlk şərhi sən yaz 💬</p>}
        {list?.map(c => <div className="st-comment" key={c.id}>
          <img src={c.photo || defaultPhoto} alt="" />
          <div><b>{c.userId === me.id ? "Sən" : c.name}</b> <small>{timeAgo(c.createdAt)}</small><p>{c.body}</p></div>
          {canDelete(c) && <button type="button" className="st-comment-del" aria-label="Şərhi sil" onClick={() => void deleteComment(c.id).then(load).catch(() => setMsg("Şərh silinmədi."))}><Trash2 size={14} /></button>}
        </div>)}
        <div ref={end} />
      </div>
      {msg && <p className="st-msg dark" role="status">{msg}</p>}
      <form className="st-comment-form" onSubmit={e => { e.preventDefault(); void send(); }}>
        <input value={text} onChange={e => setText(e.target.value)} maxLength={300} placeholder="Şərh yaz…" aria-label="Şərh yaz" />
        <button type="submit" disabled={busy || !text.trim()} aria-label="Göndər">{busy ? <LoaderCircle className="st-spin" size={18} /> : <Send size={18} />}</button>
      </form>
    </div>
  </div>;
}

function useBodyLock() {
  useEffect(() => { const o = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = o; }; }, []);
}
function useEscape(fn: () => void) {
  const ref = useRef(fn); ref.current = fn;
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === "Escape") ref.current(); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, []);
}

const STATUS_STYLES = `
.st-section{margin-top:24px;--st-ring:var(--primary);--st-seen:color-mix(in oklch,var(--muted-foreground) 45%,transparent)}
.st-count{font-size:10px;color:var(--muted-foreground)}
.st-empty{align-self:center;font-size:11px;color:var(--muted-foreground);margin:0 0 20px}
.st-skeleton{display:block;width:60px;height:60px;border-radius:50%;background:linear-gradient(90deg,var(--muted),var(--accent),var(--muted));background-size:200% 100%;animation:st-shimmer 1.2s linear infinite}
@keyframes st-shimmer{to{background-position:-200% 0}}
.st-add{position:relative;width:60px;height:60px;border:0;padding:4px;border-radius:50%;background:transparent;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .18s cubic-bezier(.3,1.6,.5,1)}
.st-add:active{transform:scale(.88)}
.st-add-ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,var(--primary),oklch(.8 .15 83),oklch(.62 .21 18),var(--primary));animation:st-spin 3.2s linear infinite;-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2.5px));mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2.5px))}
.st-add img{position:relative;width:100%;height:100%;object-fit:cover;border-radius:50%;border:2px solid var(--background)}
.st-add-plus{position:absolute;right:-2px;bottom:-2px;width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);border:2.5px solid var(--background);box-shadow:0 4px 10px oklch(.4 .1 165/.35);animation:st-pulse 1.8s ease-in-out infinite}
.st-add:hover .st-add-plus{transform:rotate(90deg)}
.st-add-label{color:var(--primary)!important;font-weight:700}
@keyframes st-pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 oklch(.57 .14 165/.5)}50%{transform:scale(1.12);box-shadow:0 0 0 7px oklch(.57 .14 165/0)}}
@keyframes st-spin{to{transform:rotate(360deg)}}
.st-bubble{width:60px;height:60px;border-radius:50%;border:0;padding:2.5px;cursor:pointer;transition:transform .18s cubic-bezier(.3,1.6,.5,1);-webkit-tap-highlight-color:transparent}
.st-bubble:active{transform:scale(.9)}
.st-bubble.unseen{animation:st-in .45s cubic-bezier(.3,1.5,.5,1) both}
@keyframes st-in{from{transform:scale(.6);opacity:0}}
.st-bubble-inner{position:relative;display:block;width:100%;height:100%;border-radius:50%;overflow:hidden;border:2.5px solid var(--background);background:var(--muted)}
.st-bubble-inner img{width:100%;height:100%;object-fit:cover}
.st-bubble-text{display:grid;place-items:center;width:100%;height:100%;font-size:8px;line-height:1.15;font-weight:800;color:oklch(1 0 0);padding:6px;text-align:center;overflow:hidden;word-break:break-word}
.st-bubble-play{position:absolute;inset:0;display:grid;place-items:center;color:oklch(1 0 0);font-size:13px;text-shadow:0 1px 4px oklch(0 0 0/.6)}
.st-full{position:fixed;inset:0;z-index:80;background:oklch(.08 0 0);color:oklch(1 0 0);font-family:'Manrope',system-ui,sans-serif;animation:st-up .28s cubic-bezier(.2,.9,.3,1) both}
@keyframes st-up{from{transform:translateY(6%);opacity:0}}
.st-top{position:absolute;left:0;right:0;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:max(12px,env(safe-area-inset-top)) 12px 12px;background:linear-gradient(oklch(0 0 0/.55),transparent)}
.st-top strong{font-size:15px}.st-top-sp{width:40px}
.st-icon{width:40px;height:40px;border:0;border-radius:50%;display:grid;place-items:center;background:oklch(1 0 0/.14);color:oklch(1 0 0);backdrop-filter:blur(8px);cursor:pointer}
.st-icon.dark{background:oklch(0 0 0/.06);color:inherit}
.st-dots{flex:1;display:flex;gap:3px;justify-content:center}
.st-dots span{flex:1;max-width:28px;height:3px;border-radius:3px;background:oklch(1 0 0/.3);transition:background .2s}
.st-dots span.past{background:oklch(1 0 0/.65)}.st-dots span.on{background:oklch(1 0 0)}
.st-group{position:relative;height:100%;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden}
.st-hscroll{display:flex;height:100%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;scrollbar-width:none}
.st-hscroll::-webkit-scrollbar{display:none}
.st-hscroll>.st-slide{flex:0 0 100%;width:100%;scroll-snap-align:start;scroll-snap-stop:always}
.st-counter{font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;background:oklch(0 0 0/.35);font-variant-numeric:tabular-nums}
.st-nav{position:absolute;top:50%;z-index:4;width:38px;height:38px;margin-top:-19px;border-radius:50%;border:0;display:grid;place-items:center;background:oklch(0 0 0/.35);color:oklch(1 0 0);cursor:pointer;backdrop-filter:blur(4px)}
.st-nav.prev{left:max(8px,calc(50% - 280px))}.st-nav.next{right:max(8px,calc(50% - 280px))}
@media(hover:none){.st-nav{display:none}}
.st-scroller{height:100%;overflow-y:auto;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none}
.st-scroller::-webkit-scrollbar{display:none}
.st-slide{position:relative;height:100dvh;height:100%;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden}
.st-slide-stage,.st-stage{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;background:oklch(.1 0 0)}
.st-media{position:relative;width:100%;height:100%;object-fit:contain}
.st-blur{position:absolute;inset:-20px;width:calc(100% + 40px);height:calc(100% + 40px);object-fit:cover;filter:blur(28px) brightness(.55)}
.st-slide-text{margin:0;padding:0 34px;max-width:560px;text-align:center;font-size:clamp(22px,6.4vw,34px);font-weight:800;line-height:1.3;white-space:pre-wrap;word-break:break-word;text-shadow:0 2px 12px oklch(0 0 0/.18)}
.st-shade{position:absolute;inset:auto 0 0 0;height:40%;background:linear-gradient(transparent,oklch(0 0 0/.65));pointer-events:none}
.st-rail{position:absolute;right:10px;bottom:calc(110px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:18px;z-index:2}
.st-rail-avatar{width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid oklch(1 0 0)}
.st-rail-btn{display:flex;flex-direction:column;align-items:center;gap:3px;border:0;background:none;color:oklch(1 0 0);font-size:12px;font-weight:700;cursor:pointer;filter:drop-shadow(0 2px 6px oklch(0 0 0/.45));-webkit-tap-highlight-color:transparent}
.st-rail-btn svg{width:33px;height:33px;transition:transform .15s}
.st-rail-btn:active svg{transform:scale(.8)}
.st-rail-btn.liked{color:oklch(.65 .23 18)}
.st-rail-btn.liked svg{animation:st-like .45s cubic-bezier(.3,1.8,.5,1)}
@keyframes st-like{0%{transform:scale(.6)}60%{transform:scale(1.3)}100%{transform:scale(1)}}
.st-info{position:absolute;left:14px;right:78px;bottom:calc(26px + env(safe-area-inset-bottom));z-index:2;text-shadow:0 1px 6px oklch(0 0 0/.5)}
.st-info strong{font-size:15px}.st-info small{font-size:11px;opacity:.85}
.st-info p{margin:6px 0 0;font-size:14px;line-height:1.4;max-height:5.6em;overflow:auto;white-space:pre-wrap;word-break:break-word}
.st-burst{position:absolute;z-index:3;width:96px;height:96px;margin:-48px 0 0 -48px;color:oklch(.65 .23 18);pointer-events:none;animation:st-burst .9s ease-out forwards;filter:drop-shadow(0 6px 18px oklch(0 0 0/.35))}
.st-burst svg{width:100%;height:100%}
@keyframes st-burst{0%{transform:scale(.2) rotate(-15deg);opacity:0}25%{transform:scale(1.15) rotate(0);opacity:1}60%{transform:scale(.95)}100%{transform:scale(1.4) translateY(-60px);opacity:0}}
.st-text-input{width:100%;max-width:560px;height:60%;padding:0 30px;border:0;outline:0;resize:none;background:transparent;color:oklch(1 0 0);text-align:center;font:800 clamp(22px,6.4vw,32px)/1.3 'Manrope',system-ui,sans-serif;align-self:center}
.st-text-input::placeholder{color:oklch(1 0 0/.6)}
.st-pick{display:grid;justify-items:center;gap:12px;border:2px dashed oklch(1 0 0/.35);border-radius:22px;padding:32px 28px;background:oklch(1 0 0/.06);color:oklch(1 0 0);font:700 14px 'Manrope',system-ui,sans-serif;cursor:pointer}
.st-composer-bottom{position:absolute;left:0;right:0;bottom:0;z-index:5;display:grid;gap:12px;padding:20px 14px max(16px,env(safe-area-inset-bottom));background:linear-gradient(transparent,oklch(0 0 0/.6))}
.st-colors{display:flex;gap:10px;justify-content:center}
.st-color{width:30px;height:30px;border-radius:50%;border:2px solid oklch(1 0 0/.4);cursor:pointer;transition:transform .15s}
.st-color.on{border-color:oklch(1 0 0);transform:scale(1.18)}
.st-caption{width:100%;height:44px;border-radius:22px;border:0;padding:0 16px;background:oklch(1 0 0/.16);color:oklch(1 0 0);font:500 14px 'Manrope',system-ui,sans-serif;outline:0;backdrop-filter:blur(10px)}
.st-caption::placeholder{color:oklch(1 0 0/.65)}
.st-composer-row{display:flex;align-items:center;gap:10px}
.st-tabs{flex:1;display:flex;gap:4px;padding:4px;border-radius:26px;background:oklch(1 0 0/.14);backdrop-filter:blur(10px)}
.st-tabs button{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;height:38px;border:0;border-radius:20px;background:transparent;color:oklch(1 0 0/.8);font:700 12px 'Manrope',system-ui,sans-serif;cursor:pointer;transition:background .2s,color .2s}
.st-tabs button.on{background:oklch(1 0 0);color:oklch(.2 .02 165)}
.st-send{width:52px;height:52px;flex-shrink:0;border:0;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);cursor:pointer;box-shadow:0 6px 18px oklch(.4 .12 165/.5);transition:transform .15s,opacity .15s}
.st-send:active{transform:scale(.88)}.st-send:disabled{opacity:.45}
.st-msg{margin:0;text-align:center;font-size:12px;font-weight:600;color:oklch(.85 .12 30)}
.st-msg.dark{color:var(--heart);padding:0 16px 6px}
.st-spin{animation:st-spin .8s linear infinite}
.st-sheet-wrap{position:absolute;inset:0;z-index:10;background:oklch(0 0 0/.35);display:flex;align-items:flex-end;animation:st-fade .2s both}
@keyframes st-fade{from{opacity:0}}
.st-sheet{width:100%;max-width:560px;margin:0 auto;height:68%;display:flex;flex-direction:column;border-radius:20px 20px 0 0;background:var(--surface);color:var(--foreground);animation:st-sheet .3s cubic-bezier(.2,.9,.3,1) both;padding-bottom:env(safe-area-inset-bottom)}
@keyframes st-sheet{from{transform:translateY(100%)}}
.st-grip{display:block;width:38px;height:4px;border-radius:4px;background:var(--border);margin:8px auto 0}
.st-sheet-head{display:flex;align-items:center;justify-content:space-between;padding:6px 10px 6px 18px;border-bottom:1px solid var(--border)}
.st-sheet-head strong{font-size:14px}
.st-comments{flex:1;overflow-y:auto;padding:12px 16px;display:grid;align-content:start;gap:14px}
.st-muted{margin:20px 0;text-align:center;color:var(--muted-foreground);font-size:13px;display:flex;gap:6px;justify-content:center;align-items:center}
.st-comment{display:flex;gap:10px;align-items:flex-start;animation:st-in .3s both}
.st-comment img{width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0}
.st-comment div{flex:1;min-width:0;font-size:13px}
.st-comment small{color:var(--muted-foreground);font-size:11px}
.st-comment p{margin:2px 0 0;line-height:1.4;word-break:break-word;white-space:pre-wrap}
.st-comment-del{border:0;background:none;color:var(--muted-foreground);cursor:pointer;padding:4px}
.st-comment-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--border)}
.st-comment-form input{flex:1;height:42px;border-radius:21px;border:1px solid var(--border);background:var(--muted);padding:0 16px;font:500 14px 'Manrope',system-ui,sans-serif;color:var(--foreground);outline:0}
.st-comment-form button{width:42px;height:42px;border:0;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);cursor:pointer}
.st-comment-form button:disabled{opacity:.45}
@media (min-width:700px){.st-slide-stage,.st-stage{max-width:480px;margin:0 auto}.st-rail{right:calc(50% - 230px)}.st-info{left:calc(50% - 226px);right:calc(50% - 160px)}}
@media (prefers-reduced-motion:reduce){.st-add-ring,.st-add-plus{animation:none}}
`;
