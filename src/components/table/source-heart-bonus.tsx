import { useEffect, useRef } from 'react';
import { loadCilizAssets, translate } from '@/lib/ciliz-assets';
import { subscribeHeartAwards } from '@/lib/game-session';
import { playSfx, preloadSfx } from '@/lib/sfx';
import { sourceHeart, sourceLuckyHeart } from '@/lib/source-bonus-artwork';

/** Presentation only: the authenticated adapter owns awards and wallet readback. */
export function SourceHeartBonus() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let active = true;
    let assets: Awaited<ReturnType<typeof loadCilizAssets>> | undefined;
    const seen = new Set<string>();
    const animations = new Set<Animation>();
    void loadCilizAssets().then(value => { if (active) { assets = value; preloadSfx(value.sfxUrl, 'drop'); } }, () => {});
    const unsubscribe = subscribeHeartAwards(award => {
      const host = layer.current;
      const origin = document.querySelector('.bottle-play-overlay')?.getBoundingClientRect();
      const target = document.querySelector('.original-heart-button')?.getBoundingClientRect();
      if (!assets || !host || !origin || !target || seen.has(award.id)) return;
      seen.add(award.id);
      if (seen.size > 1000) seen.delete(seen.values().next().value ?? '');
      const heart = document.createElement('img');
      heart.src = sourceHeart; heart.alt = ''; heart.className = 'source-bonus-heart';
      heart.style.left = `${origin.x}px`; heart.style.top = `${origin.y}px`;
      host.append(heart);
      void playSfx(assets.sfxUrl, 'drop');
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const flight = heart.animate([
        { transform: 'translate(-50%, -50%)', opacity: 1, offset: 0 },
        { transform: `translate(calc(-50% + ${target.x + target.width / 2 - origin.x}px), calc(-50% + ${target.y + target.height / 2 - origin.y}px))`, opacity: 1, offset: 2 / 2.3 },
        { transform: `translate(calc(-50% + ${target.x + target.width / 2 - origin.x}px), calc(-50% + ${target.y + target.height / 2 - origin.y}px))`, opacity: 0, offset: 1 },
      ], { duration: reduced ? 1 : 2300, easing: 'ease-out', fill: 'forwards' });
      animations.add(flight);
      flight.onfinish = () => { heart.remove(); animations.delete(flight); };
      if (award.lucky) {
        const banner = document.createElement('div'); banner.className = 'source-bonus-banner';
        banner.style.left = `${origin.x}px`; banner.style.top = `${origin.y}px`;
        const image = document.createElement('img'); image.src = sourceLuckyHeart; image.alt = '';
        const text = document.createElement('span'); text.textContent = translate(assets, 'table:lucky_bonus:title');
        banner.append(image, text); host.append(banner);
        const animation = banner.animate([{ transform: 'translate(-50%,-50%) scale(.75)', opacity: 1, offset: 0 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: 1 / 1.3 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }], { duration: reduced ? 1 : 1300, easing: 'ease-out', fill: 'forwards' });
        animations.add(animation); animation.onfinish = () => { banner.remove(); animations.delete(animation); };
      }
    });
    return () => { active = false; unsubscribe(); animations.forEach(animation => animation.cancel()); layer.current?.replaceChildren(); };
  }, []);
  return <div ref={layer} className="source-heart-bonus-layer" aria-hidden="true" />;
}