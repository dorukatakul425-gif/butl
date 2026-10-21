import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { ASSET_SCALE as K, BOTS, SEATS, TABLE_SIZE as V, seatAngle } from '@/lib/table-preview';

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
  const tableSlot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = tableSlot.current;
    if (!element) return;
    const fit = () => setScale(Math.min(element.clientWidth, element.clientHeight) / V);
    const observer = new ResizeObserver(fit);
    observer.observe(element); fit();
    return () => observer.disconnect();
  }, []);

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
      if (phase === 'spin') setPhase('result');
      if (phase === 'result') { if (to !== null) setFrom(to); setTo(null); setPhase('idle'); }
    }, phase === 'spin' ? 3500 : phase === 'result' ? 3200 : 2200);
    return () => clearTimeout(timer);
  }, [phase, from, to, angle]);

  const current = BOTS[from]; const selected = to === null ? undefined : BOTS[to];
  return (
    <main className="game-preview">
      <div className="game-shell">
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
      </div>
    </main>
  );
}
