import musicIcon from "@/assets/original-chat-music.svg.asset.json";
import videoIcon from "@/assets/original-chat-video.svg.asset.json";
import emojiIcon from "@/assets/original-chat-emoji.svg.asset.json";
import sendIcon from "@/assets/original-chat-send.svg.asset.json";

/** Original chat area: media panel (video, music) top-right, chat input at bottom (source order). */
export function OriginalChatPanel() {
  return (
    <section className="original-chat" aria-label="Sohbet">
      <div className="original-chat-scroll" />
      <div className="original-media-panel">
        <div className="original-media-button">
          <button type="button" className="original-media-icon" style={{ backgroundImage: `url(${videoIcon.url})` }} aria-label="Video" />
        </div>
        <div className="original-media-button">
          <button type="button" className="original-media-icon" style={{ backgroundImage: `url(${musicIcon.url})` }} aria-label="Müzik" />
        </div>
      </div>
      <form className="original-chat-input" onSubmit={(e) => e.preventDefault()}>
        <input className="original-chat-input-field" type="text" placeholder="" aria-label="Mesaj yaz" />
        <button type="button" className="original-chat-round original-chat-emoji" style={{ backgroundImage: `url(${emojiIcon.url})` }} aria-label="Emoji" />
        <button type="submit" className="original-chat-round original-chat-send" style={{ backgroundImage: `url(${sendIcon.url})` }} aria-label="Gönder" />
      </form>
    </section>
  );
}
