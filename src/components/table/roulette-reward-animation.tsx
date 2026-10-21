import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import type { SourceReward } from '@/lib/source-feature-session';
import { roulettePrizeNames } from '@/lib/roulette-config';
import { playSfx } from '@/lib/sfx';
import '@/styles/roulette-reward.css';

/** Source RouletteItem/Heart animation: 30fps, 114-frame timeline, tap-to-skip. */
export function RouletteRewardAnimation({ reward, template, onFinish }: { reward: SourceReward; template: string; onFinish: () => void }) {
  const finish = useRef(onFinish); finish.current = onFinish;
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const sound = window.setTimeout(() => void playSfx(template, 'roulette_reward'), reduced ? 0 : 5 / 30 * 1000);
    const end = window.setTimeout(() => finish.current(), reduced ? 500 : 114 / 30 * 1000);
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.stopImmediatePropagation(); finish.current(); } };
    document.addEventListener('keydown', key, true);
    return () => { clearTimeout(sound); clearTimeout(end); document.removeEventListener('keydown', key, true); };
  }, [reward.id, template]);
  return createPortal(<div className="roulette-earned" role="dialog" aria-label="Çarx mükafatı" aria-modal="true">
    <Button variant="ghost" className="roulette-earned__surface" aria-label="Mükafatı bağla" onClick={() => finish.current()}>
      <div className="roulette-earned__stars" aria-hidden>{Array.from({ length: 16 }, (_, i) => <span key={i} className={`roulette-earned__star roulette-earned__star--${i}`}>✦</span>)}</div>
      <span className={`roulette__reward-icon roulette__reward-icon--${reward.image} roulette-earned__icon`} aria-hidden />
      <strong className="roulette-earned__amount">{reward.count}</strong>
      <span className="roulette-earned__name">{roulettePrizeNames[reward.image] ?? reward.image}</span>
    </Button>
  </div>, document.body);
}