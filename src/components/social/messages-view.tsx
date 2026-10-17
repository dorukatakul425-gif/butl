import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Bell, BellOff, Check, CheckCheck, Search, Send } from "lucide-react";
import { translate, usePreferences } from "@/lib/app-preferences";
import { MediaComposer, MediaImage, VoiceBubble } from "@/components/social/chat-media";
import {
  joinTyping, loadConversation, markConversationRead, MAX_MESSAGE_LENGTH, normalizeMessage, onDirectMessage, otherParty,
  requestNotifyPermission, sendDirectMessage, setActiveChat, setSocialSound, socialSoundEnabled, unlockSocialAudio, upsertMessage,
  useSocial, type DirectMessage, messagePreview,
} from "@/lib/social";

// Full-screen messenger: conversation list of friends and a realtime chat thread.
export function MessagesView({ me, defaultPhoto, initialPeer, onClose, onOpenProfile }: { me: string; defaultPhoto: string; initialPeer: string | null; onClose: () => void; onOpenProfile?: ((id: string) => void) | undefined }) {
  const { language } = usePreferences();
  const social = useSocial();
  const [peer, setPeer] = useState<string | null>(initialPeer);
  const [query, setQuery] = useState("");
  const [sound, setSound] = useState(true);
  useEffect(() => { setSound(socialSoundEnabled()); requestNotifyPermission(); unlockSocialAudio(); }, []);
  useEffect(() => { setPeer(initialPeer); }, [initialPeer]);
  useEffect(() => { const o = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = o; }; }, []);
  const friends = useMemo(() => social.friendships.filter(f => f.status === "accepted").map(f => otherParty(f, me))
    .sort((a, b) => (social.last[b]?.created_at ?? "").localeCompare(social.last[a]?.created_at ?? "")), [social.friendships, social.last, me]);
  const incoming = social.friendships.filter(f => f.status === "pending" && f.addressee_id === me).length;
  const q = query.trim().toLowerCase();
  const shown = friends.filter(id => { const p = social.profiles[id]; return !q || (p?.name ?? "").toLowerCase().includes(q) || (p?.username ?? "").includes(q); });
  const time = (iso: string) => { const d = new Date(iso); const today = new Date(); return d.toDateString() === today.toDateString() ? new Intl.DateTimeFormat(language, { hour: "2-digit", minute: "2-digit" }).format(d) : new Intl.DateTimeFormat(language, { day: "numeric", month: "short" }).format(d); };

  return <div className="sm-root" role="dialog" aria-modal="true" aria-label={translate("Mesajlar")}>
    <style>{SM_STYLES}</style>
    {peer ? <ChatThread me={me} peer={peer} defaultPhoto={defaultPhoto} onOpenProfile={onOpenProfile} onBack={() => (initialPeer && peer === initialPeer ? onClose() : setPeer(null))} /> : <>
      <header className="sm-head">
        <button type="button" className="sm-icon" aria-label={translate("Geri")} onClick={onClose}><ArrowLeft size={20} /></button>
        <h1>{translate("Mesajlar")}</h1>
        <button type="button" className="sm-icon" aria-label={sound ? translate("Səsi bağla") : translate("Səsi aç")} onClick={() => { setSocialSound(!sound); setSound(!sound); }}>{sound ? <Bell size={19} /> : <BellOff size={19} />}</button>
      </header>
      <label className="sm-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={translate("Dost axtar")} /></label>
      {incoming > 0 && <p className="sm-hint">{incoming} {translate("yeni dostluq istəyi — Profil bölməsində qəbul et")}</p>}
      <ul className="sm-list">
        {shown.map(id => { const p = social.profiles[id]; const last = social.last[id]; const unread = social.unread[id] ?? 0; return <li key={id}>
          <button type="button" className={"sm-row" + (unread ? " unread" : "")} onClick={() => setPeer(id)}>
            <img src={p?.photo_url || defaultPhoto} alt="" />
            <span className="sm-row-text"><strong>{p?.name ?? "…"}</strong><span>{last ? (last.sender_id === me ? translate("Sən: ") : "") + messagePreview(last) : translate("Söhbətə başla 👋")}</span></span>
            <span className="sm-row-meta">{last && <time>{time(last.created_at)}</time>}{unread > 0 && <b>{unread > 99 ? "99+" : unread}</b>}</span>
          </button>
        </li>; })}
      </ul>
      {friends.length === 0 && <div className="sm-empty"><span>💬</span><strong>{translate("Hələ dostun yoxdur")}</strong><p>{translate("Əsas səhifədə “izlə” düyməsinə toxun, istək qəbul olunanda burada yazışa bilərsən.")}</p></div>}
    </>}
  </div>;
}

function ChatThread({ me, peer, defaultPhoto, onBack, onOpenProfile }: { me: string; peer: string; defaultPhoto: string; onBack: () => void; onOpenProfile?: ((id: string) => void) | undefined }) {
  const { language } = usePreferences();
  const social = useSocial();
  const p = social.profiles[peer];
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef<ReturnType<typeof joinTyping> | null>(null);

  useEffect(() => {
    let on = true;
    setActiveChat(peer);
    setLoading(true);
    setMessages([]);
    void loadConversation(me, peer).then(rows => { if (on) { setMessages(prev => rows.reduce(upsertMessage, prev)); setLoading(false); } });
    void markConversationRead(peer);
    const off = onDirectMessage((m, type) => {
      const mine = m.sender_id === me && m.recipient_id === peer;
      const theirs = m.sender_id === peer && m.recipient_id === me;
      if (!mine && !theirs) return;
      setMessages(prev => upsertMessage(prev, m));
      if (type === "insert" && theirs) { setTyping(false); if (document.visibilityState === "visible") void markConversationRead(peer); }
    });
    const onVisible = () => { if (document.visibilityState === "visible") void markConversationRead(peer); };
    document.addEventListener("visibilitychange", onVisible);
    const t = joinTyping(me, peer, setTyping);
    typingRef.current = t;
    return () => { on = false; off(); t.leave(); typingRef.current = null; setActiveChat(null); document.removeEventListener("visibilitychange", onVisible); };
  }, [me, peer]);

  useEffect(() => { const el = listRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: messages.length > 30 ? "auto" : "smooth" }); }, [messages.length, typing]);
  useEffect(() => { const el = inputRef.current; if (!el) return; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }, [text]);

  const send = async () => {
    const body = normalizeMessage(text);
    if (!body) return;
    setText("");
    setError("");
    const temp: DirectMessage = { id: `tmp-${Date.now()}`, sender_id: me, recipient_id: peer, body, created_at: new Date().toISOString(), read_at: null, pending: true };
    setMessages(prev => upsertMessage(prev, temp));
    const res = await sendDirectMessage(me, peer, body);
    if (res.ok) setMessages(prev => upsertMessage(prev.filter(x => x.id !== temp.id), res.message));
    else { setMessages(prev => prev.filter(x => x.id !== temp.id)); setText(body); setError(translate(res.error)); }
    inputRef.current?.focus();
  };

  const clock = (iso: string) => new Intl.DateTimeFormat(language, { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  const dayLabel = (iso: string) => {
    const d = new Date(iso); const now = new Date(); const y = new Date(now); y.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString()) return translate("Bu gün");
    if (d.toDateString() === y.toDateString()) return translate("Dünən");
    return new Intl.DateTimeFormat(language, { day: "numeric", month: "long" }).format(d);
  };

  return <div className="sm-chat">
    <header className="sm-head sm-chat-head">
      <button type="button" className="sm-icon" aria-label={translate("Geri")} onClick={onBack}><ArrowLeft size={20} /></button>
      <button type="button" className="sm-peer-btn" onClick={() => onOpenProfile?.(peer)} aria-label={translate("Profilə bax")}><img src={p?.photo_url || defaultPhoto} alt="" />
      <span className="sm-peer"><strong>{p?.name ?? "…"}</strong><small className={typing ? "typing" : ""}>{typing ? translate("yazır…") : "@" + (p?.username ?? "")}</small></span></button>
    </header>
    <div className="sm-thread" ref={listRef} aria-live="polite">
      {loading && <div className="sm-loading"><span /><span /><span /></div>}
      {!loading && messages.length === 0 && <div className="sm-empty sm-empty-chat"><img src={p?.photo_url || defaultPhoto} alt="" /><strong>{p?.name}</strong><p>{translate("İlk mesajı sən yaz 👋")}</p></div>}
      {messages.map((m, i) => {
        const mine = m.sender_id === me;
        const prev = messages[i - 1];
        const next = messages[i + 1];
        const newDay = !prev || new Date(prev.created_at).toDateString() !== new Date(m.created_at).toDateString();
        const tail = !next || next.sender_id !== m.sender_id;
        return <div key={m.id} className="sm-msg-wrap">
          {newDay && <div className="sm-day"><span>{dayLabel(m.created_at)}</span></div>}
          <div className={"sm-msg " + (mine ? "mine" : "theirs") + (tail ? " tail" : "") + (m.pending ? " pending" : "")}>
            {m.kind === "image" && m.media_path ? <MediaImage path={m.media_path} /> : m.kind === "audio" && m.media_path ? <VoiceBubble path={m.media_path} durationMs={m.duration_ms ?? null} mine={mine} /> : null}
            {m.body && <span className="sm-body">{m.body}</span>}
            <span className="sm-meta">{clock(m.created_at)}{mine && (m.read_at ? <CheckCheck size={14} className="read" /> : m.pending ? null : <Check size={14} />)}</span>
          </div>
        </div>;
      })}
      {typing && <div className="sm-msg theirs tail sm-typing" aria-label={translate("yazır…")}><span /><span /><span /></div>}
    </div>
    {error && <p className="sm-error" role="alert">{error}</p>}
    <MediaComposer me={me} peer={peer} onSent={m => setMessages(prev => upsertMessage(prev, m))} onError={setError}>
    <form className="sm-composer-form" onSubmit={e => { e.preventDefault(); void send(); }}>
      <textarea ref={inputRef} rows={1} value={text} maxLength={MAX_MESSAGE_LENGTH} placeholder={translate("Mesaj yaz…")} aria-label={translate("Mesaj yaz…")}
        onChange={e => { setText(e.target.value); if (e.target.value) typingRef.current?.ping(); }}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); } }} />
      {text.trim() && <button type="submit" className="sm-send" aria-label={translate("Göndər")}><Send size={18} /></button>}
    </form>
    </MediaComposer>
  </div>;
}

const SM_STYLES = `
.sm-root{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:var(--background);color:var(--foreground);animation:sm-in .28s cubic-bezier(.2,.9,.3,1) both;}
.sm-root>*{width:100%;max-width:640px;margin-left:auto;margin-right:auto;}
.sm-head{display:flex;align-items:center;gap:10px;padding:max(12px,env(safe-area-inset-top)) 14px 10px;}
.sm-head h1{flex:1;margin:0;font-size:24px;font-weight:800;letter-spacing:-.4px;}
.sm-icon{all:unset;cursor:pointer;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--surface);border:1px solid var(--border);color:var(--foreground);flex-shrink:0;}
.sm-icon:focus-visible,.sm-row:focus-visible,.sm-send:focus-visible{outline:2px solid var(--primary);outline-offset:2px;}
.sm-search{display:flex;align-items:center;gap:8px;margin:0 14px 8px;padding:0 14px;height:42px;border-radius:21px;background:var(--surface);border:1px solid var(--border);color:var(--muted-foreground);box-sizing:border-box;width:auto;}
.sm-search input{all:unset;flex:1;font-size:14px;color:var(--foreground);}
.sm-hint{margin:0 14px 6px;padding:9px 12px;border-radius:12px;background:color-mix(in oklch,var(--heart) 14%,var(--surface));font-size:12px;font-weight:600;}
.sm-list{list-style:none;margin:0;padding:0 6px 20px;overflow-y:auto;flex:1;}
.sm-row{all:unset;box-sizing:border-box;cursor:pointer;width:100%;display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:16px;transition:background .2s;}
.sm-row:hover,.sm-row:active{background:var(--surface);}
.sm-row img{width:54px;height:54px;border-radius:50%;object-fit:cover;flex-shrink:0;}
.sm-row-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.sm-row-text strong{font-size:15px;}
.sm-row-text span{font-size:13px;color:var(--muted-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sm-row.unread .sm-row-text span{color:var(--foreground);font-weight:650;}
.sm-row-meta{display:flex;flex-direction:column;align-items:flex-end;gap:5px;font-size:11px;color:var(--muted-foreground);}
.sm-row-meta b{min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:10px;background:var(--primary);color:var(--primary-foreground);font-size:11px;display:grid;place-items:center;}
.sm-empty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:40px 30px;color:var(--muted-foreground);}
.sm-empty>span{font-size:44px;}.sm-empty strong{color:var(--foreground);font-size:16px;}.sm-empty p{margin:0;font-size:13px;max-width:280px;}
.sm-chat{flex:1;min-height:0;display:flex;flex-direction:column;}
.sm-chat-head{border-bottom:1px solid var(--border);background:color-mix(in oklch,var(--surface) 85%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}
.sm-peer-btn{all:unset;cursor:pointer;display:flex;align-items:center;gap:10px;min-width:0;flex:1;}
.sm-chat-head img{width:40px;height:40px;border-radius:50%;object-fit:cover;}
.sm-peer{display:flex;flex-direction:column;min-width:0;}
.sm-peer strong{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sm-peer small{font-size:12px;color:var(--muted-foreground);}.sm-peer small.typing{color:var(--primary);font-weight:650;}
.sm-thread{flex:1;min-height:0;overflow-y:auto;padding:12px 12px 8px;display:flex;flex-direction:column;gap:2px;overscroll-behavior:contain;}
.sm-msg-wrap{display:flex;flex-direction:column;}
.sm-day{display:flex;justify-content:center;margin:12px 0 8px;}
.sm-day span{font-size:11px;font-weight:700;color:var(--muted-foreground);padding:4px 10px;border-radius:10px;background:var(--surface);border:1px solid var(--border);}
.sm-msg{position:relative;max-width:78%;padding:7px 10px 6px 12px;border-radius:18px;font-size:14.5px;line-height:1.35;display:flex;flex-wrap:wrap;align-items:flex-end;gap:2px 8px;animation:sm-pop .22s ease-out both;word-break:break-word;}
.sm-msg.mine{align-self:flex-end;background:var(--primary);color:var(--primary-foreground);}
.sm-msg.theirs{align-self:flex-start;background:var(--surface);border:1px solid var(--border);}
.sm-msg.mine.tail{border-bottom-right-radius:5px;margin-bottom:6px;}
.sm-msg.theirs.tail{border-bottom-left-radius:5px;margin-bottom:6px;}
.sm-msg.pending{opacity:.65;}
.sm-body{white-space:pre-wrap;}
.sm-meta{margin-left:auto;display:inline-flex;align-items:center;gap:3px;font-size:10.5px;opacity:.75;}
.sm-meta .read{opacity:1;}
.sm-typing{display:flex;gap:4px;padding:12px 14px;}
.sm-typing span,.sm-loading span{width:7px;height:7px;border-radius:50%;background:var(--muted-foreground);animation:sm-dot 1.2s infinite;}
.sm-typing span:nth-child(2),.sm-loading span:nth-child(2){animation-delay:.15s;}.sm-typing span:nth-child(3),.sm-loading span:nth-child(3){animation-delay:.3s;}
.sm-loading{display:flex;gap:5px;justify-content:center;padding:30px;}
.sm-empty-chat img{width:84px;height:84px;border-radius:50%;object-fit:cover;margin-bottom:4px;}
.sm-error{margin:0 14px 4px;font-size:12px;color:var(--heart);font-weight:600;}
.sm-composer{display:flex;align-items:flex-end;gap:8px;padding:8px 12px max(10px,env(safe-area-inset-bottom));border-top:1px solid var(--border);background:var(--background);}
.sm-composer textarea{flex:1;resize:none;min-height:42px;max-height:120px;box-sizing:border-box;padding:10px 16px;border-radius:21px;border:1px solid var(--border);background:var(--surface);color:var(--foreground);font:inherit;font-size:15px;line-height:1.35;outline:none;}
.sm-composer textarea:focus{border-color:var(--primary);}
.sm-send{all:unset;cursor:pointer;display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:var(--primary);color:var(--primary-foreground);flex-shrink:0;transition:transform .15s,opacity .2s;}
.sm-send:active{transform:scale(.9);}.sm-send:disabled{opacity:.4;cursor:default;}
@keyframes sm-in{from{transform:translateX(24px);opacity:0;}}
@keyframes sm-pop{from{transform:translateY(6px) scale(.97);opacity:0;}}
@keyframes sm-dot{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-4px);opacity:1;}}
@media(prefers-reduced-motion:reduce){.sm-root,.sm-msg,.sm-typing span,.sm-loading span{animation:none!important;}}
`;
