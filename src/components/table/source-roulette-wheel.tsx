import type { SourceReward } from '@/lib/source-feature-session';
import type { RefObject } from 'react';
import { dialogImage, type CilizAssets } from '@/lib/ciliz-assets';

// Visible sector labels transcribed from the supplied original screenshot, not a payout catalogue.
const referenceArtwork: SourceReward[] = [
  ['chances', 3], ['tokens', 100], ['kiss_fire', 3], ['gold', 10],
  ['tokens', 5], ['league5', 1], ['gold', 3], ['chances', 1],
  ['tokens', 1000], ['kiss_fire', 3], ['gold', 25], ['tokens', 3],
  ['league_kiss2x', 1], ['gold', 5], ['tokens', 25], ['refuse_slap', 1],
].map(([image, count], index) => ({ id: `reference-${index}`, image: String(image), count: Number(count) }));
/** Public reference labels never authorize a spin or define a server payout. */
export function SourceRouletteWheel({ assets, prizes, wheelRef }: { assets: CilizAssets; prizes: SourceReward[]; wheelRef: RefObject<HTMLDivElement | null> }) {
  const sectors = prizes.length ? prizes : referenceArtwork;
  return <div className="roulette__wheel-section" data-reference-artwork={!prizes.length}>
    <div className="roulette__wheel-overflow-container"><div ref={wheelRef} className="roulette__wheel">
      {sectors.map((reward, index) => {
        const image = assets.images[reward.image] ? dialogImage(assets, reward.image, 26, 26) : null;
        return <div key={reward.id} data-text={reward.count} className={`roulette__wheel-item roulette__wheel-item--${reward.image}`} style={{ transform: `translateY(-50%) rotate(${index * 360 / sectors.length}deg) translateX(64px)` }}>
          {image ? <img src={image.src} width={image.width} height={image.height} alt="" /> : <span aria-hidden className={`roulette__reward-icon roulette__reward-icon--${reward.image}`} />}
          <span>{reward.count}</span>
        </div>;
      })}
    </div></div>
    <div className="roulette__wheel-frame" aria-hidden /><div className="roulette__wheel-center" aria-hidden />
  </div>;
}