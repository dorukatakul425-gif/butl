import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CreatorLabel } from '@/components/player-name';
import type { Profile } from '@/lib/supabase';
import type { PlayerAppearance } from '@/lib/player-appearance';

export function PlayerCreatorOverlay({ players, appearances, seatPoint }: { players: Array<Profile | null>; appearances: Record<string, PlayerAppearance>; seatPoint: (seat: number) => { x: number; y: number; scale: number } | null }) {
  const refs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => {
    let frame = 0, last = 0;
    const update = (now: number) => {
      if (now - last > 60) {
        last = now;
        players.forEach((player, seat) => {
          if (!player) return;
          const el = refs.current.get(player.id), point = seatPoint(seat);
          if (!el) return;
          el.hidden = !point;
          if (point) { el.style.left = `${point.x}px`; el.style.top = `${point.y - 43 * point.scale}px`; el.style.transform = `translate(-50%, -100%) scale(${point.scale})`; }
        });
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [players, seatPoint]);
  if (typeof document === 'undefined') return null;
  return createPortal(<>{players.filter((player): player is Profile => Boolean(player && appearances[player.id]?.creator)).map(player => <div key={player.id} className="table-creator-label" ref={el => { if (el) refs.current.set(player.id, el); else refs.current.delete(player.id); }}><CreatorLabel /></div>)}</>, document.body);
}