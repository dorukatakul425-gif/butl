import { useEffect, useMemo, useRef, useState } from "react";
import emojiIcon from "@/assets/original-chat-emoji.svg.asset.json";
import sendIcon from "@/assets/original-chat-send.svg.asset.json";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { MusicListDialog, MusicPreviewDialog } from "@/components/music/music-dialogs";
import { MusicView } from "@/components/music/music-view";
import { CilizMusicService, YTVideoService, type MusicItem, type MusicService } from "@/lib/music";
import { sendMusic, useMusicSession } from "@/lib/music-session";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
import { Button } from "@/components/ui/button";
import { ChatMessageRow } from "@/components/chat/chat-message";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { blockChatUser, reportChatMessage, sendChatMessage, useGameSession, type ChatPlayer } from "@/lib/game-session";
import { translate } from "@/lib/ciliz-assets";

const VIEWER_COUNTRY = "TR";
const VIEWER_SENDER = { id: "viewer", name: VIEWER.name, photoUrl: VIEWER.photoUrl, musicLevel: 0 };

/** Original chat area: MediaPanel (video, music), chat body with info lines, input at bottom (source order). */
export function OriginalChatPanel() {
  const assets = useCilizAssets();
  const session = useMusicSession();
  const account = useGameSession();
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  const [emojisOpen, setEmojisOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [profile, setProfile] = useState<ChatPlayer | null>(null);
  const [receiver, setReceiver] = useState<ChatPlayer | null>(null);
  const [reportConfirm, setReportConfirm] = useState(false);
  const [translationShown, setTranslationShown] = useState(false);
  const translationAction = useRef<{ action: () => void; shown: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [listType, setListType] = useState<"audio" | "video" | null>(null);
  const [preview, setPreview] = useState<{ music: MusicItem; service: MusicService } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reply = (event: Event) => { const player = (event as CustomEvent<ChatPlayer>).detail; setReceiver(player); setText(`${player.name}, `); inputRef.current?.focus(); };
    window.addEventListener('game-reply-to', reply);
    return () => window.removeEventListener('game-reply-to', reply);
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
  }, [session.lines.length, account.messages.length]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") { setSelected(null); setReportConfirm(false); setEmojisOpen(false); } };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const send = async () => {
    const prefix = receiver ? `${receiver.name}, ` : "";
    const addressed = receiver && text.startsWith(prefix);
    const body = addressed ? text.slice(prefix.length) : text;
    if (!body.trim()) return;
    try { await sendChatMessage(body, addressed ? receiver.id : undefined); setText(""); setReceiver(null); setNotice(""); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Mesaj gönderilemedi."); }
  };
  const selectedMessage = account.messages.find(message => message.id === selected);

  const listService = listType ? services[listType] : null;

  return (
    <section className="original-chat chat" aria-label="Sohbet">
      <div ref={scrollRef} className="original-chat-scroll chat__scroll">
        <div className="chat__body">
          {assets && account.messages.map(message => <ChatMessageRow key={message.id} message={message} assets={assets} selected={selected === message.id} onSelect={() => { translationAction.current = null; setReportConfirm(false); setSelected(message.id); }} onTranslationAction={(action, shown) => { translationAction.current = { action, shown }; setTranslationShown(shown); }} onProfile={setProfile} onError={setNotice} onReply={message.receiver?.id === account.viewer?.id ? () => { const prefix = receiver ? `${receiver.name}, ` : ""; const body = prefix && text.startsWith(prefix) ? text.slice(prefix.length) : text; setText(`${message.sender.name}, ${body}`.slice(0, 140)); setReceiver(message.sender); inputRef.current?.focus(); } : undefined} />)}
          {session.lines.map((line) => (
            <div key={line.key} className="chat__info chat__noselect">
              <Button variant="ghost" className="chat__photo" aria-label={`${line.sender.name} profili`} onClick={() => setProfile(line.sender)}><img src={line.sender.photoUrl} alt="" /></Button>
              <div className="chat__icon chat__icon--music" />
              <div className="chat__info-line chat__text-format">
                {line.artist && <span>{line.artist}<br /></span>}
                <span className="chat-music-title">{line.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`media-panel media-panel--${session.song ? "hidden" : "visible"}`}>
        <div className="media-panel__button">
          <Button variant="ghost" aria-label="Video" className="media-panel__video" onClick={() => setListType("video")} />
        </div>
        <div className="media-panel__button">
          <Button variant="ghost" aria-label="Müzik" className="media-panel__music" onClick={() => setListType("audio")} />
        </div>
      </div>
      {session.song && <MusicView key={session.song.key} song={session.song} muted={session.muted} volume={session.volume} />}
      {notice && <p className="chat-notice" role="status">{notice}</p>}
      {emojisOpen && <div className="chat-emojis" role="dialog" aria-label="Emoji">{["😀", "😊", "😍", "😘", "❤️", "👍", "😂", "🎉"].map(emoji => <Button key={emoji} variant="ghost" aria-label={emoji} onClick={() => { setText(value => (value + emoji).slice(0, 140)); inputRef.current?.focus(); }}>{emoji}</Button>)}</div>}
      <form className="original-chat-input" onSubmit={(e) => { e.preventDefault(); void send(); }}>
        <input ref={inputRef} value={text} onChange={e => setText(e.target.value)} maxLength={140} className="original-chat-input-field" type="text" placeholder={assets ? translate(assets, "chat:input_hint") : ""} aria-label="Mesaj yaz" autoComplete="off" enterKeyHint="send" />
        <Button variant="ghost" type="button" className="original-chat-round original-chat-emoji" aria-label="Emoji" aria-expanded={emojisOpen} onClick={() => setEmojisOpen(!emojisOpen)}><img src={emojiIcon.url} alt="" /></Button>
        <Button variant="ghost" type="submit" className="original-chat-round original-chat-send" aria-label="Gönder"><img src={sendIcon.url} alt="" /></Button>
      </form>
      {assets && profile && <ProfileDialog player={{ id: profile.id, name: profile.name, photoUrl: profile.photoUrl, frame: profile.frame ?? "", stone: profile.stone ?? "" }} self={profile.id === account.viewer?.id || profile.id === "viewer"} assets={assets} onClose={() => setProfile(null)} onGift={() => { window.dispatchEvent(new CustomEvent('game-gift-to', { detail: profile.id })); setProfile(null); }} onDecor={() => setNotice("Süsleme için masadaki profilinizi seçin.")} onMusic={() => { setProfile(null); setListType("audio"); }} />}
      {assets && selectedMessage && <div className="chat-actions-layer" onClick={() => { setSelected(null); setReportConfirm(false); }}><section role="dialog" aria-modal="true" aria-label={reportConfirm ? "Mesajı şikayet et" : "Mesaj işlemleri"} className="chat-message-actions message-actions__x_popup" onClick={e => e.stopPropagation()}>
        {reportConfirm ? <><p>{selectedMessage.sender.name}: {selectedMessage.text}</p><Button variant="ghost" onClick={() => setReportConfirm(false)}>{translate(assets, "dlg:report_issue:cancel")}</Button><Button variant="ghost" onClick={() => { void reportChatMessage(selectedMessage.id).then(() => { setSelected(null); setReportConfirm(false); }).catch(error => setNotice(error instanceof Error ? error.message : "İşlem gerçekleştirilemedi.")); }}>{translate(assets, "dlg:report_issue:ok")}</Button></> : <>
          <Button variant="ghost" className="settings__item settings__item--selectable" onClick={() => { void blockChatUser(selectedMessage.sender.id).then(() => setSelected(null)).catch(error => setNotice(error instanceof Error ? error.message : "İşlem gerçekleştirilemedi.")); }}><span className="settings__icon settings__icon--ignore" />{translate(assets, "dlg:block:title")}</Button>
          <Button variant="ghost" className="settings__item settings__item--selectable" onClick={() => setReportConfirm(true)}><span className="settings__icon settings__icon--complain" />{translate(assets, "dlg:report_issue:title")}</Button>
          {selectedMessage.canTranslate && <Button variant="ghost" className="settings__item settings__item--selectable" onClick={() => { translationAction.current?.action(); setSelected(null); }}><span className="settings__icon settings__icon--translate" />{translate(assets, translationShown ? "dlg:translate:show_original" : "dlg:translate:show_translation")}</Button>}
        </>}
      </section></div>}
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
