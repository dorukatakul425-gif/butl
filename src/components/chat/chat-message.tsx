import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { translate, type CilizAssets } from "@/lib/ciliz-assets";
import { translateChatMessage, type ChatMessage, type ChatPlayer } from "@/lib/game-session";

export function ChatMessageRow({ message, assets, selected, onSelect, onProfile, onReply, onError, onTranslationAction }: {
  message: ChatMessage; assets: CilizAssets; selected: boolean; onSelect: () => void;
  onProfile: (player: ChatPlayer) => void; onReply?: (() => void) | undefined; onError: (text: string) => void;
  onTranslationAction?: (action: () => void, shown: boolean) => void;
}) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translating, setTranslating] = useState(false);
  const longTap = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancel = () => clearTimeout(longTap.current);
  const doTranslate = async () => {
    if (translation !== null) { setShowTranslation(!showTranslation); return; }
    setTranslating(true);
    try { setTranslation(await translateChatMessage(message.id)); setShowTranslation(true); }
    catch (error) { onError(error instanceof Error ? error.message : "Çeviri alınamadı."); }
    finally { setTranslating(false); }
  };
  useEffect(() => {
    if (selected && message.canTranslate) onTranslationAction?.(() => { void doTranslate(); }, showTranslation);
  }, [selected, message.canTranslate, showTranslation, translation]);
  useEffect(() => () => clearTimeout(longTap.current), []);
  return <div className="chat__message chat__noselect">
    <Button variant="ghost" className="chat__photo" aria-label={`${message.sender.name} profili`} onClick={() => onProfile(message.sender)}><img src={message.sender.photoUrl} alt="" /></Button>
    <div className={`chat__message-line ${selected ? "chat__message-line--selected" : ""}`} onDoubleClick={onSelect} onPointerDown={event => { if ((event.target as HTMLElement).closest("button")) return; cancel(); longTap.current = setTimeout(onSelect, 500); }} onPointerUp={cancel} onPointerCancel={cancel} onPointerLeave={cancel}>
      <Button variant="ghost" className="chat__report" aria-label="Mesaj işlemleri" title="Mesaj işlemleri" onClick={onSelect}><span className="chat__report-icon">⋮</span></Button>
      <span className="chat__sender-name">{message.sender.name}</span><span>: </span>
      {message.receiver && <span className="chat__sender-name">{message.receiver.name}, </span>}
      <span className="chat__word-break">{showTranslation ? translation : message.text}</span>
      {message.canTranslate && <Button variant="ghost" className="chat__translate" disabled={translating} onClick={() => void doTranslate()}>{translate(assets, showTranslation ? "dlg:translate:show_original" : "dlg:translate:show_translation")}</Button>}
    </div>
    {onReply && <Button variant="ghost" className="chat__reply-button" title="Yanıtla" aria-label="Yanıtla" onClick={onReply}>↩</Button>}
  </div>;
}