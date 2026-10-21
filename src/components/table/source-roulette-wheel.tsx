import type { SourceReward } from '@/lib/source-feature-session';
import { sourceRouletteReferenceArtwork } from '@/lib/source-roulette-artwork';
import type { RefObject } from 'react';
import { type CilizAssets } from '@/lib/ciliz-assets';
/** Public reference labels never authorize a spin or define a server payout. */
export function SourceRouletteWheel({ assets, prizes, wheelRef }: { assets: CilizAssets; prizes: SourceReward[]; wheelRef: RefObject<HTMLDivElement | null> }) {
  const sectors = prizes.length ? prizes : sourceRouletteReferenceArtwork;
  return <div className="roulette__wheel-section" data-reference-artwork={!prizes.length}>
    <div className="roulette__wheel-overflow-container"><div ref={wheelRef} className="roulette__wheel">
      {sectors.map((reward, index) => {
        return <div key={reward.id} data-text={reward.count} className={`roulette__wheel-item roulette__wheel-item--${reward.image}`} style={{ transform: `translate(0%, -50%) rotate(${index * 360 / sectors.length}deg) translate(105px) rotate(180deg)` }}>
          <span aria-hidden className={`roulette__reward-icon roulette__reward-icon--${reward.image}`} />
          <span>{reward.count}</span>
        </div>;
      })}
    </div></div>
    <div className="roulette__wheel-frame" aria-hidden /><div className="roulette__wheel-center" aria-hidden />
  </div>;
}