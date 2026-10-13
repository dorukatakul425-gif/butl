import { useEffect, useMemo, useRef, useState } from "react";
import emojiIcon from "@/assets/original-chat-emoji.svg.asset.json";
import sendIcon from "@/assets/original-chat-send.svg.asset.json";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { MusicListDialog, MusicPreviewDialog } from "@/components/music/music-dialogs";
import { MusicView } from "@/components/music/music-view";
import { CilizMusicService, YTVideoService, type MusicItem, type MusicService } from "@/lib/music";
import { sendMusic, useMusicSession } from "@/lib/music-session";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";

const VIEWER_COUNTRY = "TR";
const VIEWER_SENDER = { id: "viewer", name: VIEWER.name, photoUrl: VIEWER.photoUrl, musicLevel: 0 };

/** Original chat area: MediaPanel (video, music), chat body with info lines, input at bottom (source order). */
export function OriginalChatPanel() {
  const assets = useCilizAssets();
  const session = useMusicSession();
  const [listType, setListType] = useState<"audio" | "video" | null>(null);
  const [preview, setPreview] = useState<{ music: MusicItem; service: MusicService } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section className="original-chat chat" aria-label="Sohbet">
      <div ref={scrollRef} className="original-chat-scroll chat__scroll">
        <div className="chat__body">
          {session.lines.map((line) => line.kind === "gift" ? (
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
      <form className="original-chat-input" onSubmit={(e) => e.preventDefault()}>
        <input className="original-chat-input-field" type="text" placeholder="" aria-label="Mesaj yaz" />
        <button type="button" className="original-chat-round original-chat-emoji" style={{ backgroundImage: `url(${emojiIcon.url})` }} aria-label="Emoji" />
        <button type="submit" className="original-chat-round original-chat-send" style={{ backgroundImage: `url(${sendIcon.url})` }} aria-label="Gönder" />
      </form>
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
