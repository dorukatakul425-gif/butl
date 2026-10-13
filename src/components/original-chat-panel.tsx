import { useEffect, useMemo, useRef, useState } from "react";
import { InteractiveHints, HINT_SET_INPUT_EVENT, CHAT_SENT_EVENT } from "@/components/interactive-hints";
import emojiIcon from "@/assets/original-chat-emoji.svg.asset.json";
import sendIcon from "@/assets/original-chat-send.svg.asset.json";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { MusicListDialog, MusicPreviewDialog } from "@/components/music/music-dialogs";
import { MusicView } from "@/components/music/music-view";
import { CilizMusicService, YTVideoService, type MusicItem, type MusicService } from "@/lib/music";
import { pushTextLine, sendMusic, useMusicSession } from "@/lib/music-session";
import { chatMessageIsBold, chatNameClass } from "@/lib/chat-format";
import { Button } from "@/components/ui/button";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
import { translate } from "@/lib/ciliz-assets";
import { EmojiPicker } from "@/components/chat/emoji-picker";
import { emojiPickerSize, emojiSendDecision, insertEmoji } from "@/lib/emoji";
import { useViewerProgress } from "@/lib/viewer-progress";
import { OPEN_VIP_EVENT, SourceInfoDialog } from "@/components/source-dialogs";

const VIEWER_COUNTRY = "TR";
const VIEWER_SENDER = { id: "viewer", name: VIEWER.name, photoUrl: VIEWER.photoUrl, musicLevel: 0 };

/** Original chat area: MediaPanel (video, music), chat body with info lines, input at bottom (source order). */
export function OriginalChatPanel() {
  const assets = useCilizAssets();
  const session = useMusicSession();
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
  const [receiver, setReceiver] = useState<import("@/lib/music-session").ChatUser | undefined>();
  const [small, setSmall] = useState(false);
  const { vip } = useViewerProgress();
  const sectionRef = useRef<HTMLElement>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiSize, setEmojiSize] = useState(0);
  const [emojiWarning, setEmojiWarning] = useState<string | null>(null);
  const openVip = () => window.dispatchEvent(new Event(OPEN_VIP_EVENT));
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
  const doSend = (value: string) => {
    if (pushTextLine({ ...VIEWER_SENDER, isViewer: true }, value, receiver)) {
      window.dispatchEvent(new CustomEvent(CHAT_SENT_EVENT, { detail: value }));
      setText(""); setReceiver(undefined); inputRef.current?.focus();
    }
  };

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

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [session.lines.length]);

  const listService = listType ? services[listType] : null;

  return (
    <section ref={sectionRef} className="original-chat chat" aria-label="Sohbet">
      <div ref={scrollRef} className="original-chat-scroll chat__scroll">
        <div className={`chat__body${small ? " chat__small" : ""}`}>
          {session.lines.map((line) => line.kind === "text" ? (
            <div key={line.key} className={`chat__message chat__noselect${chatMessageIsBold(line.sender, line.receiver) ? " chat__message--bold" : ""}`}>
              <div className="chat__photo" style={{ backgroundImage: `url('${line.sender.photoUrl}')` }} title={line.sender.name} />
              <div className="chat__message-line">
                <span className={`chat__sender-name ${chatNameClass(line.sender)}${line.sender.isPremium ? " chat__premium-sender-name" : ""}`}
                  onClick={() => { setReceiver(line.sender); inputRef.current?.focus(); }}>{line.sender.name}</span>
                <span className={`${chatNameClass(line.sender)}${line.sender.isPremium ? " chat__premium-sender-name" : ""}`}>: </span>
                {line.receiver && <><span className="chat__sender-name">{line.receiver.name}</span><span>, </span></>}
                <span className="chat__word-break">{line.text}</span>
              </div>
            </div>
          ) : line.kind === "gift" ? (
            <div key={line.key} className="chat__info chat__noselect">
              <div className="chat__photo" style={{ backgroundImage: `url('${line.sender.photoUrl}')` }} title={line.sender.name} />
              <img className="chat__gift" src={line.image} width={28} height={28} title={line.name} alt="" crossOrigin="anonymous" />
              {line.count > 1 && <div className="chat__count"><div className="chat__icon chat__icon--count" />{line.count}</div>}
              <div className="chat__icon chat__icon--arrows" />
              <div className="chat__multigift-receivers">
                {line.receivers.map((u) => (
                  <div key={u.id} className="chat__multigift-photo-wrapper">
                    <div className="chat__photo chat__multigift-photo" style={{ backgroundImage: `url('${u.photoUrl}')` }} title={u.name} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div key={line.key} className="chat__info chat__noselect">
              <div className="chat__photo" style={{ backgroundImage: `url('${line.sender.photoUrl}')` }} title={line.sender.name} />
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
      {session.song && <MusicView key={session.song.key} song={session.song} muted={session.muted} volume={session.volume} />}
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
        <input ref={inputRef} className="original-chat-input-field" type="text" placeholder="" aria-label="Mesaj yaz" value={receiver ? `${receiver.name}, ${text}` : text}
          onChange={(e) => {
            const prefix = receiver ? `${receiver.name}, ` : "";
            if (prefix && !e.target.value.startsWith(prefix)) setReceiver(undefined);
            setText(prefix && e.target.value.startsWith(prefix) ? e.target.value.slice(prefix.length) : e.target.value);
          }} />
        <Button variant="ghost" type="button" className="original-chat-round original-chat-emoji js-emoji" onClick={toggleEmoji} aria-expanded={emojiOpen} style={{ backgroundImage: `url(${emojiIcon.url})` }} aria-label="Emoji" />
        <Button variant="ghost" type="submit" className="original-chat-round original-chat-send" style={{ backgroundImage: `url(${sendIcon.url})` }} aria-label="Gönder" />
      </form>
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
            sendMusic(music, preview.service, VIEWER_SENDER);
          }} />
      )}
    </section>
  );
}
