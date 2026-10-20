import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, CornerUpLeft, Send, Trash2, Users, X, AtSign, ArrowDown } from "lucide-react";
import { translate, usePreferences } from "@/lib/app-preferences";
import { ensureProfiles, useSocial } from "@/lib/social";
import {
  deleteGlobal, GLOBAL_MAX_LENGTH, loadGlobal, mentionsMe, mergeGlobal, normalizeGlobal, sendGlobal, slowModeWait, subscribeGlobal,
  type GlobalMessage,
} from "@/lib/global-chat";

const QUICK = ["👋", "😂", "❤️", "🔥", "😍", "🎉"];

// Mobile-app style public lobby chat: live messages, online count, typing, replies, @mentions, slow mode.
export function GlobalChat({ me, defaultPhoto, onOpenProfile }: { me: string; defaultPhoto: string; onOpenProfile?: ((id: string) => void) | undefined }) {
  const { language } = usePreferences();
  const social = useSocial();
  const [messages, setMessages] = useState<GlobalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(0);
  const [typers, setTypers] = useState<Record<string, number>>({});
  const [text, setText] = useState("");
  const [reply, setReply] = useState<GlobalMessage | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [wait, setWait] = useState(0);
  const [atBottom, setAtBottom] = useState(true);
  const [fresh, setFresh] = useState(0);
  const lastSent = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const subRef = useRef<ReturnType<typeof subscribeGlobal> | null>(null);
  const myName = social.profiles[me]?.name;

  useEffect(() => {
    let on = true;
    void ensureProfiles([me]);
    void loadGlobal().then(rows => { if (!on) return; setMessages(prev => mergeGlobal(prev, rows)); setLoading(false); void ensureProfiles(rows.map(r => r.sender_id)); });
    const sub = subscribeGlobal(me, {
      insert: m => { void ensureProfiles([m.sender_id]); setMessages(prev => mergeGlobal(prev.filter(x => !(x.pending && x.sender_id === m.sender_id && x.body === m.body)), [m])); setTypers(t => { const n = { ...t }; delete n[m.sender_id]; return n; }); },
      remove: id => setMessages(prev => prev.filter(x => x.id !== id)),
      online: setOnline,
      typing: id => { void ensureProfiles([id]); setTypers(t => ({ ...t, [id]: Date.now() })); },
    });
    subRef.current = sub;
    const iv = window.setInterval(() => setTypers(t => { const now = Date.now(); const n = Object.fromEntries(Object.entries(t).filter(([, at]) => now - at < 4000)); return Object.keys(n).length === Object.keys(t).length ? t : n; }), 1500);
    return () => { on = false; sub.leave(); subRef.current = null; window.clearInterval(iv); };
  }, [me]);

  useEffect(() => {
    const el = listRef.current; if (!el) return;
    if (atBottom) { el.scrollTo({ top: el.scrollHeight, behavior: messages.length > 40 ? "auto" : "smooth" }); setFresh(0); }
    else setFresh(f => f + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);
  useEffect(() => { const el = inputRef.current; if (!el) return; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 110) + "px"; }, [text]);
  useEffect(() => { if (wait <= 0) return; const t = window.setTimeout(() => setWait(slowModeWait(lastSent.current, Date.now())), 200); return () => window.clearTimeout(t); }, [wait]);

  const byId = useMemo(() => new Map(messages.map(m => [m.id, m])), [messages]);
  const name = (id: string) => social.profiles[id]?.name ?? "…";
  const clock = (iso: string) => new Intl.DateTimeFormat(language, { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  const typingNames = Object.keys(typers).filter(id => id !== me).map(name);

  const send = async (raw = text) => {
    const body = normalizeGlobal(raw);
    if (!body) return;
    const w = slowModeWait(lastSent.current, Date.now());
    if (w > 0) { setWait(w); return; }
    lastSent.current = Date.now(); setWait(slowModeWait(lastSent.current, Date.now()));
    const replyTo = reply?.id ?? null;
    if (raw === text) setText("");
    setReply(null); setError(""); setAtBottom(true);
    const temp: GlobalMessage = { id: `tmp-${Date.now()}`, sender_id: me, body, reply_to: replyTo, created_at: new Date().toISOString(), pending: true };
    setMessages(prev => mergeGlobal(prev, [temp]));
    const res = await sendGlobal(body, replyTo);
    if (res.ok) setMessages(prev => mergeGlobal(prev.filter(x => x.id !== temp.id), [res.message]));
    else { setMessages(prev => prev.filter(x => x.id !== temp.id)); if (raw === text) setText(body); setError(translate(res.error)); }
  };
  const remove = async (m: GlobalMessage) => {
    setPicked(null);
    const before = messages;
    setMessages(prev => prev.filter(x => x.id !== m.id));
    if (!(await deleteGlobal(m.id))) { setMessages(before); setError(translate("Silinmədi")); }
  };
  const mention = (id: string) => { setPicked(null); setText(t => `@${name(id)} ` + t); inputRef.current?.focus(); };

  return <div className="gc">
    <style>{GC_STYLES}</style>
    <div className="gc-bar">
      <span className="gc-live"><i />{translate("Canlı")}</span>
      <span className="gc-online"><Users size={14} />{online} {translate("onlayn")}</span>
    </div>
    <div className="gc-list" ref={listRef} onScroll={e => { const el = e.currentTarget; const b = el.scrollHeight - el.scrollTop - el.clientHeight < 60; setAtBottom(b); if (b) setFresh(0); }}>
      {loading && <div className="gc-skel">{[0, 1, 2, 3].map(i => <span key={i} />)}</div>}
      {!loading && messages.length === 0 && <div className="gc-empty"><span>🌍</span><strong>{translate("Ümumi çat boşdur")}</strong><p>{translate("İlk salamı sən yaz!")}</p>
        <div className="gc-quick">{QUICK.map(q => <button type="button" key={q} onClick={() => void send(q)}>{q}</button>)}</div></div>}
      {messages.map((m, i) => {
        const mine = m.sender_id === me;
        const prev = messages[i - 1];
        const grouped = prev && prev.sender_id === m.sender_id && Date.parse(m.created_at) - Date.parse(prev.created_at) < 120000;
        const p = social.profiles[m.sender_id];
        const parent = m.reply_to ? byId.get(m.reply_to) : null;
        const hot = !mine && mentionsMe(m.body, myName);
        return <div key={m.id} className={"gc-row" + (mine ? " mine" : "") + (grouped ? " grouped" : "")}>
          {!mine && <button type="button" className="gc-ava" onClick={() => onOpenProfile?.(m.sender_id)} aria-label={translate("Profilə bax")}>{!grouped && <img src={p?.photo_url || defaultPhoto} alt="" />}</button>}
          <div className="gc-col">
            {!mine && !grouped && <button type="button" className="gc-name" onClick={() => mention(m.sender_id)}>{p?.name ?? "…"}</button>}
            <button type="button" className={"gc-bubble" + (hot ? " hot" : "") + (m.pending ? " pending" : "") + (picked === m.id ? " picked" : "")} onClick={() => setPicked(picked === m.id ? null : m.id)}>
              {parent && <span className="gc-quote"><b>{name(parent.sender_id)}</b>{parent.body}</span>}
              <span className="gc-body">{m.body}</span>
              <time>{clock(m.created_at)}</time>
            </button>
            {picked === m.id && <div className="gc-actions">
              <button type="button" onClick={() => { setReply(m); setPicked(null); inputRef.current?.focus(); }}><CornerUpLeft size={14} />{translate("Cavab")}</button>
              {!mine && <button type="button" onClick={() => mention(m.sender_id)}><AtSign size={14} />{translate("Qeyd et")}</button>}
              <button type="button" onClick={() => { void navigator.clipboard?.writeText(m.body); setPicked(null); }}><Copy size={14} />{translate("Kopyala")}</button>
              {mine && !m.pending && <button type="button" className="danger" onClick={() => void remove(m)}><Trash2 size={14} />{translate("Sil")}</button>}
            </div>}
          </div>
        </div>;
      })}
    </div>
    {!atBottom && <button type="button" className="gc-down" onClick={() => { const el = listRef.current; el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }} aria-label={translate("Aşağı")}><ArrowDown size={18} />{fresh > 0 && <b>{fresh}</b>}</button>}
    <div className="gc-typing">{typingNames.length > 0 && <><span className="gc-dots"><i /><i /><i /></span>{typingNames.slice(0, 2).join(", ")}{typingNames.length > 2 ? ` +${typingNames.length - 2}` : ""} {translate("yazır…")}</>}</div>
    {error && <p className="gc-error" role="alert">{error}</p>}
    {reply && <div className="gc-reply"><CornerUpLeft size={15} /><span><b>{name(reply.sender_id)}</b>{reply.body}</span><button type="button" onClick={() => setReply(null)} aria-label={translate("Bağla")}><X size={16} /></button></div>}
    <form className="gc-input" onSubmit={e => { e.preventDefault(); void send(); }}>
      <textarea ref={inputRef} rows={1} value={text} maxLength={GLOBAL_MAX_LENGTH} placeholder={translate("Hamıya yaz…")}
        onChange={e => { setText(e.target.value); subRef.current?.typing(); }}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} />
      {text.length > GLOBAL_MAX_LENGTH - 60 && <small className="gc-count">{GLOBAL_MAX_LENGTH - text.length}</small>}
      <button type="submit" className="gc-send" disabled={!text.trim() || wait > 0} aria-label={translate("Göndər")}>{wait > 0 ? Math.ceil(wait / 1000) : <Send size={18} />}</button>
    </form>
  </div>;
}

const GC_STYLES = `
.gc{flex:1;min-height:0;display:flex;flex-direction:column;position:relative;}
.gc-bar{display:flex;align-items:center;justify-content:space-between;padding:6px 16px 8px;font-size:12px;color:var(--muted-foreground);}
.gc-live{display:inline-flex;align-items:center;gap:6px;font-weight:800;color:var(--heart);text-transform:uppercase;letter-spacing:.6px;font-size:11px;}
.gc-live i{width:7px;height:7px;border-radius:50%;background:var(--heart);animation:gc-pulse 1.4s infinite;}
.gc-online{display:inline-flex;align-items:center;gap:5px;font-weight:700;padding:4px 10px;border-radius:12px;background:var(--surface);border:1px solid var(--border);}
.gc-list{flex:1;min-height:0;overflow-y:auto;padding:4px 12px 8px;display:flex;flex-direction:column;overscroll-behavior:contain;}
.gc-row{display:flex;gap:8px;margin-top:10px;align-items:flex-end;}
.gc-row.grouped{margin-top:3px;}
.gc-row.mine{justify-content:flex-end;}
.gc-ava{all:unset;cursor:pointer;width:34px;height:34px;flex-shrink:0;}
.gc-ava img{width:34px;height:34px;border-radius:50%;object-fit:cover;}
.gc-col{display:flex;flex-direction:column;max-width:78%;min-width:0;}
.gc-row.mine .gc-col{align-items:flex-end;}
.gc-name{all:unset;cursor:pointer;font-size:12px;font-weight:800;color:var(--primary);margin:0 0 3px 10px;}
.gc-bubble{all:unset;cursor:pointer;box-sizing:border-box;display:flex;flex-direction:column;gap:3px;padding:8px 12px 6px;border-radius:18px 18px 18px 6px;background:var(--surface);border:1px solid var(--border);font-size:14.5px;line-height:1.4;max-width:100%;-webkit-user-select:none;user-select:none;transition:transform .15s;}
.gc-row.mine .gc-bubble{background:var(--primary);color:var(--primary-foreground);border-color:transparent;border-radius:18px 18px 6px 18px;}
.gc-bubble.hot{background:color-mix(in oklch,var(--gold) 28%,var(--surface));border-color:var(--gold);}
.gc-bubble.pending{opacity:.6;}
.gc-bubble.picked{transform:scale(1.03);}
.gc-body{white-space:pre-wrap;overflow-wrap:anywhere;}
.gc-bubble time{align-self:flex-end;font-size:10px;opacity:.6;}
.gc-quote{display:flex;flex-direction:column;padding:4px 8px;border-left:3px solid currentColor;border-radius:6px;background:color-mix(in oklch,currentColor 10%,transparent);font-size:12px;opacity:.85;max-height:44px;overflow:hidden;}
.gc-quote b{font-size:11px;}
.gc-actions{display:flex;flex-wrap:wrap;gap:6px;margin:5px 0 4px;animation:gc-pop .18s ease-out both;}
.gc-actions button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 11px;border-radius:15px;background:var(--surface);border:1px solid var(--border);font-size:12px;font-weight:750;color:var(--foreground);}
.gc-actions .danger{color:var(--heart);}
.gc-empty{margin:auto;display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;color:var(--muted-foreground);padding:30px;}
.gc-empty>span{font-size:46px;}.gc-empty strong{color:var(--foreground);font-size:16px;}.gc-empty p{margin:0;font-size:13px;}
.gc-quick{display:flex;gap:8px;margin-top:10px;}
.gc-quick button{all:unset;cursor:pointer;font-size:22px;width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:var(--surface);border:1px solid var(--border);transition:transform .15s;}
.gc-quick button:active{transform:scale(.9);}
.gc-skel{display:flex;flex-direction:column;gap:12px;padding-top:10px;}
.gc-skel span{height:38px;border-radius:18px;background:var(--muted);width:60%;animation:gc-shine 1.2s ease-in-out infinite;}
.gc-skel span:nth-child(even){align-self:flex-end;width:45%;}
.gc-down{all:unset;cursor:pointer;position:absolute;right:16px;bottom:120px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--surface);border:1px solid var(--border);box-shadow:var(--shadow);color:var(--foreground);}
.gc-down b{position:absolute;top:-6px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:var(--primary);color:var(--primary-foreground);font-size:10px;display:grid;place-items:center;padding:0 4px;}
.gc-typing{min-height:18px;padding:0 18px;font-size:11.5px;color:var(--primary);font-weight:650;display:flex;align-items:center;gap:6px;}
.gc-dots{display:inline-flex;gap:3px;}.gc-dots i{width:5px;height:5px;border-radius:50%;background:currentColor;animation:gc-dot 1s infinite;}.gc-dots i:nth-child(2){animation-delay:.15s;}.gc-dots i:nth-child(3){animation-delay:.3s;}
.gc-error{margin:0 14px 4px;font-size:12px;color:var(--heart);font-weight:650;}
.gc-reply{display:flex;align-items:center;gap:8px;margin:0 12px 6px;padding:7px 10px;border-radius:12px;background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--primary);font-size:12px;color:var(--primary);}
.gc-reply span{flex:1;min-width:0;display:flex;flex-direction:column;color:var(--muted-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.gc-reply b{color:var(--primary);}
.gc-reply button{all:unset;cursor:pointer;color:var(--muted-foreground);}
.gc-input{display:flex;align-items:flex-end;gap:8px;padding:8px 12px max(10px,env(safe-area-inset-bottom));border-top:1px solid var(--border);background:color-mix(in oklch,var(--surface) 90%,transparent);position:relative;}
.gc-input textarea{flex:1;resize:none;border:1px solid var(--border);background:var(--background);border-radius:21px;padding:10px 14px;font:inherit;font-size:14.5px;color:var(--foreground);outline:none;max-height:110px;}
.gc-input textarea:focus{border-color:var(--primary);}
.gc-count{position:absolute;right:66px;top:-2px;font-size:10px;color:var(--muted-foreground);}
.gc-send{all:unset;cursor:pointer;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);font-weight:800;font-size:14px;flex-shrink:0;transition:transform .15s,opacity .2s;}
.gc-send:disabled{opacity:.45;cursor:default;}.gc-send:not(:disabled):active{transform:scale(.9);}
@keyframes gc-pulse{50%{opacity:.3;}}
@keyframes gc-dot{50%{transform:translateY(-3px);}}
@keyframes gc-pop{from{opacity:0;transform:translateY(-4px);}}
@keyframes gc-shine{50%{opacity:.5;}}
@media(prefers-reduced-motion:reduce){.gc *{animation:none!important;}}
`;
