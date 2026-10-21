import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowLeft, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ASSET_SCALE as K, BOTS, INITIAL_MESSAGES, SEATS, TABLE_SIZE as V, seatAngle, type ChatMessage } from '@/lib/table-preview';

export const Route = createFileRoute('/game')({
  head: () => ({ meta: [
    { title: 'Deltagame — Oyun masası' },
    { name: 'description', content: 'Deltagame oyun masasında şişeyi çevir, sohbet et ve yeni insanlarla tanış.' },
    { property: 'og:title', content: 'Deltagame — Oyun masası' },
    { property: 'og:description', content: 'Şişeyi çevir ve Deltagame oyun masasında sohbete katıl.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: Masa,
});

function Masa() {
  const [angle, setAngle] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'spin' | 'result'>('idle');
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [nearBottom, setNearBottom] = useState(true);
  const tableSlot = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const counter = useRef(10);
  const replyTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    const id = counter.current++;
    setMessages(previous => [...previous.slice(-99), { ...message, id }]);
  };

  useEffect(() => {
    const element = tableSlot.current;
    if (!element) return;
    const fit = () => setScale(Math.min(element.clientWidth, element.clientHeight) / V);
    const observer = new ResizeObserver(fit);
    observer.observe(element); fit();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const viewport = window.visualViewport;
    const fit = () => document.documentElement.style.setProperty('--game-viewport-height', `${viewport?.height ?? window.innerHeight}px`);
    fit(); viewport?.addEventListener('resize', fit);
    return () => { viewport?.removeEventListener('resize', fit); document.documentElement.style.removeProperty('--game-viewport-height'); };
  }, []);
  useEffect(() => () => replyTimers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (nearBottom && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, nearBottom]);

  const spin = () => {
    if (phase !== 'idle') return;
    let target = Math.floor(Math.random() * BOTS.length);
    if (target === from) target = (target + 1) % BOTS.length;
    const delta = ((seatAngle(target) - angle % 360) % 360 + 360) % 360;
    setTo(target); setAngle(previous => previous + 1440 + delta); setPhase('spin');
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === 'idle') spin();
      if (phase === 'spin') {
        setPhase('result');
        const sender = BOTS[from]; const recipient = to === null ? undefined : BOTS[to];
        if (sender && recipient) addMessage({ name: '', text: `${sender.name} 💋 ${recipient.name}`, system: true });
      }
      if (phase === 'result') { if (to !== null) setFrom(to); setTo(null); setPhase('idle'); }
    }, phase === 'spin' ? 3500 : phase === 'result' ? 3200 : 2200);
    return () => clearTimeout(timer);
  }, [phase, from, to, angle]);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim(); if (!text) return;
    setNearBottom(true); addMessage({ name: 'Sen', text }); setDraft(''); setEmojiOpen(false);
    const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
    if (bot) replyTimers.current.push(setTimeout(() => addMessage({ name: bot.name, gender: bot.g, text: /merhaba|selam/i.test(text) ? 'Merhaba, hoş geldin! 😊' : '😄 Şişe bir sonraki turda sende!' }), 1800));
    input.current?.focus();
  };
  const current = BOTS[from]; const selected = to === null ? undefined : BOTS[to];
  return (
    <main className="game-preview">
      <div className="game-shell">
        <header className="game-header">
          <Button asChild variant="ghost" size="icon" className="game-back" title="Geri"><Link to="/" aria-label="Geri"><ArrowLeft /></Link></Button>
          <span className="game-room">Masa 1</span>
          <span className="game-occupancy"><Users size={16} />12</span>
        </header>
        <div ref={tableSlot} className="game-table-slot">
          <div className="game-table-frame" style={{ width: V * scale, height: V * scale }}>
            <div className="game-table" style={{ '--table-scale': scale } as CSSProperties}>
              {BOTS.map((bot, index) => {
                const seat = SEATS[index]; if (!seat) return null;
                const active = index === from || (phase === 'result' && index === to);
                return <div key={bot.name} className="game-seat" style={{ left: V / 2 + seat[0] - 32, top: V / 2 + seat[1] - 32 }}>
                  <div className={`game-portrait ${active ? 'game-portrait-active' : ''}`}>
                    <img src={`https://randomuser.me/api/portraits/${bot.g}/${bot.id}.jpg`} alt={bot.name} draggable={false} />
                  </div>
                  <span className="game-player-name">{bot.name}</span>
                  {phase === 'result' && active && <img className="game-kiss" src="/game/img/kalp.svg" alt="Öpücük" />}
                </div>;
              })}
              <Button variant="ghost" className={`game-bottle ${phase === 'spin' ? 'is-spinning' : ''}`} aria-label="Şişeyi çevir" onClick={spin} disabled={phase !== 'idle'} style={{ '--bottle-angle': `${angle}deg` } as CSSProperties}>
                <span className="game-bottle-pivot">
                  <img className="game-bottle-shadow" src="/game/orj/b_standart_v2.shadow.png" alt="" style={{ left: -30 * K + 4, top: -97.8 * K + 3, width: 60 * K, height: 170 * K }} />
                  <img className="game-bottle-image" src="/game/orj/b_standart_v2.base.png" alt="Şişe" style={{ left: -25 * K, top: -92.8 * K, width: 50 * K, height: 160 * K }} />
                </span>
              </Button>
            </div>
          </div>
          <span className="game-turn" aria-live="polite">{phase === 'result' ? `${current?.name} → ${selected?.name} 💋` : phase === 'spin' ? 'Şişe dönüyor…' : `Sıra: ${current?.name}`}</span>
        </div>
        <section className="game-chat" aria-label="Masa sohbeti">
          <div ref={scroll} className="game-chat-scroll" onScroll={() => { const element = scroll.current; if (element) setNearBottom(element.scrollHeight - element.scrollTop - element.clientHeight < 45); }}>
            <div className="game-chat-body" role="log" aria-label="Sohbet mesajları" aria-live="polite" aria-relevant="additions">
              {messages.map(message => {
                const bot = BOTS.find(item => item.name === message.name);
                return message.system ? <div key={message.id} className="game-chat-system">{message.text}</div> :
                  <div key={message.id} className="game-chat-message">
                    {bot ? <img className="game-chat-avatar" src={`https://randomuser.me/api/portraits/${bot.g}/${bot.id}.jpg`} alt="" /> : <span className="game-chat-avatar game-chat-self">S</span>}
                    <div className="game-chat-bubble"><span className={`game-chat-name ${message.gender === 'women' ? 'is-female' : ''}`}>{message.name}</span><span>{message.text}</span></div>
                  </div>;
              })}
            </div>
          </div>
          {!nearBottom && <Button variant="outline" size="icon" className="game-chat-bottom" aria-label="Son mesajlara git" onClick={() => setNearBottom(true)}><ChevronDown /></Button>}
          {emojiOpen && <div className="game-emoji-picker" aria-label="Emojiler">{['😊', '😂', '❤️', '💋', '😍', '🍀', '👋', '😎'].map(emoji => <Button key={emoji} variant="ghost" size="icon" aria-label={`${emoji} ekle`} onClick={() => { setDraft(previous => previous + emoji); input.current?.focus(); }}>{emoji}</Button>)}</div>}
          <form className="game-chat-input" onSubmit={sendMessage}>
            <input ref={input} aria-label="Mesajın" placeholder="Mesaj yaz…" value={draft} onChange={event => setDraft(event.target.value)} autoComplete="off" />
            <Button type="button" variant="ghost" size="icon" className="original-emoji" aria-label="Emoji seç" title="Emoji seç" aria-expanded={emojiOpen} onClick={() => setEmojiOpen(previous => !previous)} />
            <Button type="submit" variant="ghost" size="icon" className="original-send" aria-label="Mesajı gönder" title="Gönder" disabled={!draft.trim()} />
          </form>
        </section>
      </div>
    </main>
  );
}
