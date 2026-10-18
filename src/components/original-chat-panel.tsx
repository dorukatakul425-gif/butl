import { setUserBlocked, useBlockedUsers } from "@/lib/block-session";
import { MessageActions } from '@/components/chat/message-actions';
import type { ChatTextLine } from '@/lib/music-session';
import { useEffect, useMemo, useRef, useState } from "react";
import { InteractiveHints, HINT_SET_INPUT_EVENT, CHAT_SENT_EVENT } from "@/components/interactive-hints";
import emojiIcon from "@/assets/original-chat-emoji.svg";
import sendIcon from "@/assets/original-chat-send.svg";
import giftIconUrl from "@/assets/original-chat-gift.svg";
const giftIcon = { url: giftIconUrl };
import { useCilizAssets } from "@/components/decor/decor-selection";
import { MusicListDialog, MusicPreviewDialog } from "@/components/music/music-dialogs";
import { MusicView } from "@/components/music/music-view";
import { CilizMusicService, YTVideoService, type MusicItem, type MusicService } from "@/lib/music";
import { pushActionLine, pushHaremLine, pushKickoutLine, pushTextLine, removeTextLine, registerMusicServices, sendMusic, useMusicSession } from "@/lib/music-session";
import { chatMessageIsBold, chatNameClass } from "@/lib/chat-format";
import { Button } from "@/components/ui/button";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
import { deleteChatMessage, displaySeatOf, loadRoomChatHistory, onRoomChatDelete, onRoomKickout, onRoomHarem, useIsChatAdmin, onRoomChat, profileBySeat, sendChat, useRoom } from "@/lib/room-session";
import { getSupabase, type Profile } from "@/lib/supabase";
import { DEFAULT_PHOTO } from "@/lib/ciliz-default-photo";
import { translate } from "@/lib/ciliz-assets";
import { EmojiPicker } from "@/components/chat/emoji-picker";
import { emojiPickerSize, emojiSendDecision, insertEmoji } from "@/lib/emoji";
import { useViewerProgress } from "@/lib/viewer-progress";
import { OPEN_GIFT_FOR_SEAT_EVENT, shouldScheduleVipTeaser, VIP_TEASER_DELAY, widgetOfTheDay } from "@/lib/chat-promos";
import { OPEN_BANK_EVENT, OPEN_VIP_EVENT, SourceInfoDialog, showSourceToast } from "@/components/source-dialogs";
import { translateChatText } from "@/lib/chat-translate.functions";
import { dialogImage } from "@/lib/ciliz-assets";
import { useDecorState } from "@/lib/decor-store";
import { applyTranslation, chatTranslator, needsTranslation, toggleTranslation, useChatTranslations } from "@/lib/chat-translation";
import { roomProfileResolver } from '@/lib/room-profile-resolver';

const VIEWER_LOCALE = "tr";

const VIEWER_COUNTRY = "TR";
const profileUser = (p: Profile) => ({ id: p.id, name: p.name, photoUrl: p.photo_url || DEFAULT_PHOTO, male: p.male, isVip: Boolean(p.vip_until && Date.parse(p.vip_until) > Date.now()), ...(p.stone ? { stone: p.stone } : {}) });

/** Original chat area: MediaPanel (video, music), chat body with info lines, input at bottom (source order). */
export function OriginalChatPanel() {
  const assets = useCilizAssets();
  const session = useMusicSession();
  const blocked = useBlockedUsers();
  const translations = useChatTranslations();
  const decor = useDecorState();
  const [selected, setSelected] = useState<ChatTextLine | null>(null);
  const [reportMessage, setReportMessage] = useState<ChatTextLine | null>(null);
  const [menuBusy, setMenuBusy] = useState(false);
  const longTap = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelLongTap = () => { clearTimeout(longTap.current); longTap.current = undefined; };
  useEffect(() => () => clearTimeout(longTap.current), []);
  useEffect(() => { setSelected(null); setReportMessage(null); }, [session.lines.length === 0]);
  const isAdmin = useIsChatAdmin();
  const selectMessage = (line: ChatTextLine) => { cancelLongTap(); if (!line.sender.isViewer || (isAdmin && line.messageId !== undefined)) setSelected(line); };
  const onTranslate = (key: number, original: string) => {
    if (translations[key]?.translated) { toggleTranslation(key); return; }
    const fn = chatTranslator() ?? ((t: string) => translateChatText({ data: { text: t, lang: VIEWER_LOCALE } }).then(r => r.ttext));
    void fn(original, key).then(t => applyTranslation(key, t), () => showSourceToast('Çeviri alınamadı.'));
  };
  const [listType, setListType] = useState<"audio" | "video" | null>(null);
  const [preview, setPreview] = useState<{ music: MusicItem; service: MusicService } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  useEffect(() => {
    const set = (e: Event) => { setReceiver(undefined); setText((e as CustomEvent<string>).detail); };
    window.addEventListener(HINT_SET_INPUT_EVENT, set);
    return () => window.removeEventListener(HINT_SET_INPUT_EVENT, set);
  }, []);
  const [receiver, setReceiver] = useState<(import("@/lib/music-session").ChatUser & { private?: boolean }) | undefined>();
  const [small, setSmall] = useState(false);
  const { vip } = useViewerProgress();
  useEffect(() => {
    const reply = (e: Event) => { setReceiver((e as CustomEvent).detail); inputRef.current?.focus(); };
    const music = () => setListType("audio");
    window.addEventListener("game-reply-to", reply);
    window.addEventListener("source:open-music-list", music);
    return () => { window.removeEventListener("game-reply-to", reply); window.removeEventListener("source:open-music-list", music); };
  }, []);
  const sectionRef = useRef<HTMLElement>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiSize, setEmojiSize] = useState(0);
  const [emojiWarning, setEmojiWarning] = useState<string | null>(null);
  const openVip = () => window.dispatchEvent(new Event(OPEN_VIP_EVENT));
  // Session.scheduleWidgetOfTheDay → scheduleVipTeaser: VIP widget 5 minutes in, non-VIP only.
  // Web has no rewarded video, so the widget is always VIP. `?teaser=now` previews it.
  useEffect(() => {
    if (!assets || widgetOfTheDay("0", new Date().getDate(), false) !== "vip" || !shouldScheduleVipTeaser(vip, true)) return;
    const delay = new URLSearchParams(window.location.search).get("teaser") === "now" ? 3000 : VIP_TEASER_DELAY;
    const timer = window.setTimeout(() => pushActionLine({ style: "vip", icon: "vip", parts: [{ text: translate(assets, "chat:vip:desc") }] }), delay);
    return () => window.clearTimeout(timer);
  }, [assets, vip]);
  // ChatView.userAction: any click outside the picker / emoji button hides it.
  useEffect(() => {
    if (!emojiOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target;
      if (t instanceof HTMLElement && (t.closest(".emoji-picker") || t.closest(".js-emoji"))) return;
      setEmojiOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [emojiOpen]);
  const toggleEmoji = () => {
    setEmojiSize(emojiPickerSize(sectionRef.current?.clientWidth ?? 0));
    setEmojiOpen(o => !o);
  };
  const pickEmoji = (emoji: string) => {
    const input = inputRef.current;
    const prefix = receiver ? `${receiver.name}, ` : "";
    const start = Math.max(0, (input?.selectionStart ?? prefix.length + text.length) - prefix.length);
    const end = Math.max(0, (input?.selectionEnd ?? prefix.length + text.length) - prefix.length);
    const next = insertEmoji(text, start, end, emoji);
    setText(next.text);
    window.setTimeout(() => { input?.focus(); input?.setSelectionRange(prefix.length + next.caret, prefix.length + next.caret); }, 0);
  };
  // Messages go to the room on the server; every player (including us) renders them from the live feed.
  const doSend = (value: string) => {
    if (!value.trim()) return;
    const to = receiver;
    if (to?.id && displaySeatOf(to.id) < 0) {
      if (assets) showSourceToast(translate(assets, "warning:offline_chat:desc"));
      return;
    }
    setText(""); setReceiver(undefined); inputRef.current?.focus();
    void sendChat(value, to?.id, Boolean(to?.private)).then(ok => {
      if (ok) window.dispatchEvent(new CustomEvent(CHAT_SENT_EVENT, { detail: value }));
      else showSourceToast("Mesaj gönderilemedi.");
    });
  };
  useEffect(() => onRoomChatDelete(id => removeTextLine(id)), []);
  const room = useRoom();
  const resolver = useMemo(() => roomProfileResolver(id => { const seat = displaySeatOf(id); return seat >= 0 ? profileBySeat(seat) : null; }, async id => {
    const sb = getSupabase(); if (!sb) return null;
    const { data } = await sb.from('profiles').select('*').eq('id', id).maybeSingle();
    return data as Profile | null;
  }), [room.roomId]);
  useEffect(() => resolver.remember(room.players), [resolver, room.players]);
  useEffect(() => {
    let alive = true;
    let queue = Promise.resolve();
    const off = onRoomChat(row => {
      const participants = Promise.all([resolver.find(row.user_id), resolver.find(row.receiver_id)]);
      queue = queue.then(async () => {
        const [sender, rec] = await participants;
        if (!alive || !sender) return;
        const isViewer = row.user_id === VIEWER.id;
        pushTextLine({ ...profileUser(sender), ...(isViewer ? { isViewer: true } : {}) }, row.text, rec ? { ...profileUser(rec), ...(rec.id === VIEWER.id ? { isViewer: true } : {}) } : undefined, row.id, Boolean(row.is_private));
      });
    });
    return () => { alive = false; off(); };
  }, [resolver]);
  // ChatPresenter.sendKickout: kick / kicked / save info line for everyone at the table.
  useEffect(() => {
    let alive = true;
    const off = onRoomKickout(ev => { void Promise.all([resolver.find(ev.actor_id), resolver.find(ev.target_id)]).then(([actor, target]) => {
      if (!alive || !target) return;
      const u = (p: Profile) => ({ ...profileUser(p), ...(p.id === VIEWER.id ? { isViewer: true } : {}) });
      pushKickoutLine(ev.kind, u(actor ?? target), u(target), ev.id);
    }); });
    return () => { alive = false; off(); };
  }, [resolver]);

  // ChatPresenter.harem: line for everyone at the table, Telegram branch rules.
  useEffect(() => {
    let alive = true;
    const off = onRoomHarem(ev => {
    if (!assets) return;
    const find = async (id: string | null) => {
      if (!id) return null;
      const seat = displaySeatOf(id); const p = seat >= 0 ? profileBySeat(seat) : null;
      if (p) return p;
      const { data } = await (getSupabase()?.from("profiles").select("*").eq("id", id).maybeSingle() ?? Promise.resolve({ data: null }));
      return (data as Profile | null) ?? null;
    };
    void (async () => {
      const [target, newOwner, oldOwner] = await Promise.all([find(ev.targetId), find(ev.newOwnerId), find(ev.oldOwnerId)]);
      if (!alive || !target || !newOwner) return;
      const u = (p: Profile) => ({ ...profileUser(p), ...(p.id === VIEWER.id ? { isViewer: true } : {}) });
      const icon = newOwner.id === target.id ? "harem_free" as const : "harem_busy" as const;
      const seated = (p: Profile | null) => !!p && displaySeatOf(p.id) >= 0;
      const forText = translate(assets, "chat:harem:for:new_chat");
      if (newOwner.id === target.id && oldOwner && (seated(target) || seated(oldOwner)))
        pushHaremLine({ icon, sender: u(target), receiver: u(oldOwner), text: `${trG("chat:harem:target:target:new_chat", target.male)} ${forText}`, price: ev.price });
      else if (!seated(newOwner) && oldOwner && seated(oldOwner) && target.id !== VIEWER.id && target.id !== oldOwner.id)
        pushHaremLine({ icon, sender: u(target), receiver: u(oldOwner), text: `${trG("chat:harem:target:old:new_chat", target.male)} ${forText}`, price: ev.price });
      else
        pushHaremLine({ icon, sender: u(newOwner), receiver: u(target), text: `${trG("chat:harem:new:target:new_chat", newOwner.male)} ${forText}`, price: ev.price });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    });
    return () => { alive = false; off(); };
  }, [assets, room.roomId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSmall(entry.contentRect.width <= 200);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // createAudioProvider('cz') and createYTProvider() from the game's table presenter.
  const services = useMemo(() => ({
    audio: new CilizMusicService("https://music.ciliz.com/api", { country: VIEWER_COUNTRY, age: VIEWER.age }, VIEWER_STORE.social),
    // The OK video catalogue needs the OK app login; the web game's YouTube catalogue is used instead.
    video: new YTVideoService({ socialId: "fb", user_country: VIEWER_COUNTRY, user_vip: false }),
  }), []);
  useEffect(() => { registerMusicServices([services.audio, services.video]); }, [services]);

  // ChatView: follow the end while at the bottom; otherwise show the "Yeni mesajlar" pill.
  const atBottom = useRef(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (atBottom.current) { el.scrollTop = el.scrollHeight; setShowScrollBtn(false); }
    else setShowScrollBtn(true);
  }, [session.lines.length]);
  const onChatScroll = () => {
    const el = scrollRef.current; if (!el) return;
    atBottom.current = Math.ceil(el.scrollTop) >= el.scrollHeight - el.clientHeight - 2;
    if (atBottom.current) setShowScrollBtn(false);
  };
  const followEnd = () => { const el = scrollRef.current; if (el) { el.scrollTop = el.scrollHeight; atBottom.current = true; } setShowScrollBtn(false); };
  // _recv_game_chat_history: on joining a table load the stored messages (last 24 hours).
  const roomId = useRoom().roomId;
  useEffect(() => {
    if (!roomId) return;
    let alive = true;
    void loadRoomChatHistory(roomId).then(rows => {
      if (!alive) return;
      for (const r of rows) pushTextLine({ ...profileUser(r.sender), ...(r.sender.id === VIEWER.id ? { isViewer: true } : {}) }, r.row.text, r.receiver ? { ...profileUser(r.receiver), ...(r.receiver.id === VIEWER.id ? { isViewer: true } : {}) } : undefined, r.row.id, Boolean(r.row.is_private));
    });
    return () => { alive = false; };
  }, [roomId]);

  const listService = listType ? services[listType] : null;
  const trG = (key: string, ...args: Array<string | boolean | undefined>) => (assets?.translation[key] ?? key).replace(/%(\d*)(?:([bd])\(([^)]*)\))?/g, (_m, i: string, kind?: string, opts?: string) => {
    const arg = args[Number(i) || 0];
    if (kind === 'b') return (opts ?? '').split('|')[arg ? 0 : 1] ?? '';
    if (kind === 'd') return (opts ?? '').split('|')[0] ?? '';
    return arg === undefined ? '' : String(arg);
  });
  const kickoutTooltip = (line: import("@/lib/music-session").ChatKickoutLine) => {
    if (!assets) return "";
    if (line.icon === "kick") return trG("kickout:chat:kick", line.sender.male, line.receiver.name);
    if (line.icon === "kicked") return trG("kickout:chat:banish", line.sender.male, line.receiver.name);
    return line.sender.id === line.receiver.id ? trG("kickout:chat:defend", line.sender.male) : trG("kickout:chat:save", line.sender.male, line.receiver.name);
  };

  return (
    <section ref={sectionRef} className="original-chat chat" aria-label="Sohbet">
      {showScrollBtn && <div className="chat__scroll-btn" role="button" style={{ bottom: 50 }} onClick={followEnd}><div className="chat__scroll-btn-icon" /><div>{assets ? translate(assets, "chat:scroll:text") : "Yeni mesajlar"}</div></div>}
      <div ref={scrollRef} onScroll={onChatScroll} className="original-chat-scroll chat__scroll">
        <div className={`chat__body${small ? " chat__small" : ""}`}>
          {session.lines.filter(line => line.kind !== "text" || !blocked.has(line.sender.id)).map((line) => line.kind === "text" ? (
            <div key={line.key} className={`chat__message chat__noselect${chatMessageIsBold(line.sender, line.receiver) ? " chat__message--bold" : ""}${line.private ? " chat__message--private" : ""}`}>
              <div className="chat__photo" style={{ backgroundImage: `url('${line.sender.photoUrl}')` }} title={line.sender.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: line.sender.id }))} />
              <div className={`chat__message-line${selected?.key === line.key ? ' chat__message-line--selected' : ''}`}
                onClick={() => selectMessage(line)} onContextMenu={e => { e.preventDefault(); selectMessage(line); }} onDoubleClick={() => selectMessage(line)}
                onTouchStart={e => { cancelLongTap(); if (e.touches.length === 1) longTap.current = setTimeout(() => selectMessage(line), 500); }}
                onTouchEnd={cancelLongTap} onTouchMove={cancelLongTap} onTouchCancel={cancelLongTap}>
                {!line.sender.isViewer && selected?.key === line.key && <Button variant="ghost" className="chat__report-button" aria-label={`${line.sender.name}: Mesaj seçenekleri`} onClick={() => selectMessage(line)}><span className="chat__report-icon" /></Button>}
                {(() => {
                  // ChatContent.setDecor: 14×14 stone before the name; the name shrinks to make room.
                  const stoneId = line.sender.isViewer ? decor.stone : line.sender.stone;
                  const stone = assets && stoneId ? assets.stones[stoneId] : undefined;
                  if (!stone || !assets) return null;
                  const img = dialogImage(assets, stone.image, 14, 14);
                  return <><div className="chat__stone" style={{ display: "inline-block" }}><img className="chat__stone-img" src={img.src} width={img.width} height={img.height} alt="" crossOrigin="anonymous" /></div>{" "}</>;
                })()}
                <span className={`chat__sender-name ${chatNameClass(line.sender)}${(line.sender.isViewer ? decor.stone : line.sender.stone) && assets?.stones[(line.sender.isViewer ? decor.stone : line.sender.stone) ?? ""] ? " chat__sender-name--stone" : ""}${line.sender.isPremium ? " chat__premium-sender-name" : ""}`}
                  onClick={e => { e.stopPropagation(); setReceiver(line.sender); inputRef.current?.focus(); }}>{line.sender.name}</span>
                <span className={`${chatNameClass(line.sender)}${line.sender.isPremium ? " chat__premium-sender-name" : ""}`}>: </span>
                {line.private && <span className="chat__private-label">(özel) </span>}
                {line.receiver && <><span className="chat__sender-name">{line.receiver.name}</span><span>, </span></>}
                <span className="chat__word-break">{translations[line.key]?.shown ? translations[line.key]?.translated : line.text}</span>
                {assets && needsTranslation(line.sender, VIEWER_LOCALE, line.text) && (
                  <div className="chat__translate js-translate" role="button" onClick={e => { e.stopPropagation(); onTranslate(line.key, line.text); }}>
                    {translate(assets, translations[line.key]?.shown ? "dlg:translate:show_original" : "dlg:translate:show_translation")}
                  </div>
                )}
              </div>
            </div>
          ) : line.kind === "action" ? (
            <div key={line.key} className={`chat__action chat__action--${line.style} chat__noselect`} role="button"
              onClick={() => {
                if (line.style === "vip") openVip();
                else if (line.icon === "gift" && line.seat !== undefined) window.dispatchEvent(new CustomEvent(OPEN_GIFT_FOR_SEAT_EVENT, { detail: line.seat }));
                else if (line.icon === "chat" && line.sender) { setReceiver(line.sender); inputRef.current?.focus(); }
              }}>
              <div className="chat__action-line">
                {line.sender && (line.style === "newcomer" || line.style === "birthday") && <div className="chat__photo" style={{ backgroundImage: `url('${line.sender.photoUrl}')` }} title={line.sender.name} onClick={e => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('source:open-profile', { detail: line.sender?.id })); }} />}
                {line.parts.map((part, i) => "user" in part
                  ? <span key={i} className={`chat__sender-name ${chatNameClass(part.user)}`} style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                      onClick={e => { e.stopPropagation(); setReceiver(part.user); inputRef.current?.focus(); }}>{part.user.name}</span>
                  : <span key={i}>{part.text}</span>)}
              </div>
              <div className={`chat__btn-bg chat__btn-bg--${line.style}`}><div className={`chat__btn chat__btn--${line.icon}`} /></div>
            </div>
          ) : line.kind === "gift" ? (
            <div key={line.key} className="chat__info chat__noselect">
              <div className="chat__photo" style={{ backgroundImage: `url('${line.sender.photoUrl}')` }} title={line.sender.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: line.sender.id }))} />
              <img className="chat__gift" src={line.image} width={line.imageWidth ?? 28} height={line.imageHeight ?? 28} title={line.name} alt="" crossOrigin="anonymous" />
              {line.count > 1 && <div className="chat__count"><div className="chat__icon chat__icon--count" />{line.count}</div>}
              <div className="chat__icon chat__icon--arrows" />
              <div className="chat__multigift-receivers">
                {line.receivers.map((u) => (
                  <div key={u.id} className="chat__multigift-photo-wrapper">
                    <div className="chat__photo chat__multigift-photo" style={{ backgroundImage: `url('${u.photoUrl}')` }} title={u.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: u.id }))} />
                  </div>
                ))}
              </div>
            </div>
          ) : line.kind === "harem" ? (
            <div key={line.key} className="chat__info chat__info--multiline chat__noselect">
              <div className="chat__photo" style={{ backgroundImage: `url('${line.sender.photoUrl}')` }} title={line.sender.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: line.sender.id }))} />
              <div className={`chat__icon chat__icon--${line.icon}`} />
              <div className="chat__info-line chat__info-line--harem"><span style={{ color: "#878787" }}>{line.text}<div className="chat__icon chat__icon--heart" />{line.price}</span></div>
              <div className="chat__photo" style={{ backgroundImage: `url('${line.receiver.photoUrl}')` }} title={line.receiver.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: line.receiver.id }))} />
            </div>
          ) : line.kind === "kickout" ? (
            <div key={line.key} className="chat__info chat__noselect">
              <div className="chat__photo" style={{ backgroundImage: `url('${line.sender.photoUrl}')` }} title={line.sender.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: line.sender.id }))} />
              <div className={`chat__icon chat__icon--${line.icon}`} title={assets ? kickoutTooltip(line) : ""} />
              <div className="chat__icon chat__icon--arrows" />
              <div className="chat__photo" style={{ backgroundImage: `url('${line.receiver.photoUrl}')` }} title={line.receiver.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: line.receiver.id }))} />
              {line.icon === "kick" && displaySeatOf(line.receiver.id) >= 0 && <div className="chat__reply-button chat__reply-button--save" role="button" aria-label="Koru" onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: line.receiver.id }))} />}
            </div>
          ) : (
            <div key={line.key} className="chat__info chat__noselect">
              <div className="chat__photo" style={{ backgroundImage: `url('${line.sender.photoUrl}')` }} title={line.sender.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: line.sender.id }))} />
              <div className="chat__icon chat__icon--music" />
              <div className="chat__info-line chat__text-format">
                {line.artist && <span>{line.artist}<br /></span>}
                <span style={{ color: "#808080" }}>{line.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`media-panel media-panel--${session.song ? "hidden" : "visible"}`} style={{ right: 0, top: 6 }}>
        <div className="media-panel__button">
          <div role="button" aria-label="Video" className="media-panel__video" onClick={() => setListType("video")} />
        </div>
        <div className="media-panel__button">
          <div role="button" aria-label="Müzik" className="media-panel__music" onClick={() => setListType("audio")} />
        </div>
      </div>
      {session.song && <MusicView key={session.song.key} song={session.song} muted={session.muted} volume={session.volume} onPlayer={() => setListType('audio')} onDj={id => {
        if (id === VIEWER.id) { setListType('audio'); return; }
        const seat = displaySeatOf(id);
        if (seat < 0) { if (assets) showSourceToast(translate(assets, 'warning:offline_gift:desc')); return; }
        window.dispatchEvent(new CustomEvent(OPEN_GIFT_FOR_SEAT_EVENT, { detail: seat }));
      }} />}
      <InteractiveHints />
      {emojiOpen && assets && <EmojiPicker size={emojiSize} vip={vip} lockText={translate(assets, "chat:emoji:hint")} activateText={translate(assets, "chat:emoji:activate")}
        onPick={pickEmoji} onBecomeVip={() => { setEmojiOpen(false); openVip(); }} />}
      <form className="original-chat-input" onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        // EmojiPresenter.showWarning(onSkip): emoji are VIP-only; "Atla" still sends the message.
        if (emojiSendDecision(text, vip) === "warn") { setEmojiWarning(text); return; }
        doSend(text);
      }}>
        {receiver?.private && <div className="chat__private-badge" role="button" aria-label="Özel mesajı iptal et" title="Sadece bu oyuncu görür" onClick={() => setReceiver(undefined)}>Özel</div>}
        <input ref={inputRef} className="original-chat-input-field" type="text" maxLength={300} placeholder={assets ? translate(assets, 'chat:input_hint') : 'Mesaj yaz'} aria-label="Mesaj yaz" value={receiver ? `${receiver.name}, ${text}` : text}
          onChange={(e) => {
            const prefix = receiver ? `${receiver.name}, ` : "";
            if (prefix && !e.target.value.startsWith(prefix)) setReceiver(undefined);
            setText(prefix && e.target.value.startsWith(prefix) ? e.target.value.slice(prefix.length) : e.target.value);
          }} />
        <Button variant="ghost" type="button" className="original-chat-round original-chat-emoji js-emoji" onClick={toggleEmoji} aria-expanded={emojiOpen} aria-label="Emoji"><img className="original-chat-control-image" src={emojiIcon} width={26} height={26} alt="" /></Button>
        <Button variant="ghost" type="button" className="original-chat-round original-chat-gift" aria-label="Hediye" onClick={() => {
          const seat = receiver ? displaySeatOf(receiver.id) : undefined;
          if (seat === undefined || seat < 0) { showSourceToast(receiver && assets ? translate(assets, 'warning:offline_gift:desc') : 'Hediye göndermek için bir oyuncu seçin.'); return; }
          window.dispatchEvent(new CustomEvent(OPEN_GIFT_FOR_SEAT_EVENT, { detail: seat }));
        }}><img className="original-chat-control-image" src={giftIcon.url} width={26} height={26} alt="" /></Button>
        <Button variant="ghost" type="submit" className="original-chat-round original-chat-send" aria-label="Gönder"><img className="original-chat-control-image" src={sendIcon} width={26} height={26} alt="" /></Button>
      </form>
      {assets && selected && <MessageActions assets={assets} blocked={blocked.has(selected.sender.id)} translationShown={Boolean(translations[selected.key]?.shown)} canTranslate={needsTranslation(selected.sender, VIEWER_LOCALE)} busy={menuBusy}
        onClose={() => setSelected(null)} onTranslate={() => { onTranslate(selected.key, selected.text); setSelected(null); }}
        onReport={() => { setReportMessage(selected); setSelected(null); }}
        isOwn={Boolean(selected.sender.isViewer)}
        onDelete={isAdmin && selected.messageId !== undefined ? () => { const id = selected.messageId; if (id === undefined) return; setSelected(null); void deleteChatMessage(id).then(ok => { if (!ok) showSourceToast('Mesaj silinemedi.'); }); } : undefined}
        onIgnore={() => { setMenuBusy(true); void setUserBlocked(selected.sender.id, !blocked.has(selected.sender.id)).then(() => setSelected(null), () => showSourceToast('İgnore kaydedilemedi.')).finally(() => setMenuBusy(false)); }} />}
      {assets && reportMessage && <SourceInfoDialog title={translate(assets, 'dlg:report_issue:title')} context={translate(assets, 'dlg:report_issue:desc', reportMessage.sender.name, reportMessage.text)} onClose={() => setReportMessage(null)}
        cancel={{ title: translate(assets, 'dlg:report_issue:cancel'), onClick: () => setReportMessage(null) }}
        confirm={{ title: translate(assets, 'dlg:report_issue:ok'), onClick: () => { setReportMessage(null); showSourceToast('Şikâyet kaydı hizmeti şu anda kullanılamıyor; şikâyet gönderilmedi.'); } }} />}
      {assets && emojiWarning !== null && (
        <SourceInfoDialog title={translate(assets, "dlg:emoji:title")} context={translate(assets, "dlg:emoji:desc2")} onClose={() => setEmojiWarning(null)}
          cancel={{ title: translate(assets, "dlg:emoji:send2"), onClick: () => { const v = emojiWarning; setEmojiWarning(null); doSend(v); } }}
          confirm={{ title: translate(assets, "dlg:emoji:subscribe"), onClick: () => { setEmojiWarning(null); openVip(); } }} />
      )}
      {assets && listService && (
        <MusicListDialog open={!!listType} type={listType ?? "audio"} assets={assets} service={listService}
          onPurchase={(music) => setPreview({ music, service: listService })} onClose={() => setListType(null)} />
      )}
      {assets && preview && (
        <MusicPreviewDialog open={!!preview} assets={assets} service={preview.service} music={preview.music}
          onClose={() => setPreview(null)}
          onConfirm={(music) => {
            setPreview(null);
            setListType(null);
            void sendMusic(music, preview.service).then(res => {
              if (res.ok) return;
              if (res.reason.includes("insufficient")) window.dispatchEvent(new Event(OPEN_BANK_EVENT));
              else showSourceToast("Müzik gönderilemedi.");
            });
          }} />
      )}
    </section>
  );
}
