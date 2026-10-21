import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CreatorLabel } from '@/components/player-name';
import type { Profile } from '@/lib/supabase';
import type { PlayerAppearance } from '@/lib/player-appearance';
import { PHOTO_SIZE } from '@/lib/gift-geometry';

export function PlayerCreatorOverlay({ players, appearances, seatPoint }: { players: Array<Profile | null>; appearances: Record<string, PlayerAppearance>; seatPoint: (seat: number) => { x: number; y: number; scale: number; rotation?: number } | null }) {
  const refs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => {
    let frame = 0;
    const update = () => {
      players.forEach((player, seat) => {
        if (!player) return;
        const el = refs.current.get(player.id), point = seatPoint(seat);
        if (!el) return;
        el.hidden = !point;
        if (!point) return;
        // A photo-sized wrapper follows the same transform as the real avatar,
        // including the bottle's centre movement, scaling and rotation.
        el.style.left = `${point.x}px`;
        el.style.top = `${point.y}px`;
        el.style.width = `${PHOTO_SIZE}px`;
        el.style.height = `${PHOTO_SIZE}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${point.rotation ?? 0}rad) scale(${point.scale})`;
      });
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [players, appearances, seatPoint]);
  if (typeof document === 'undefined') return null;
  return createPortal(<>{players.filter((player): player is Profile => Boolean(player && appearances[player.id]?.creator)).map(player => <div key={player.id} hidden className="table-creator-label" ref={el => { if (el) refs.current.set(player.id, el); else refs.current.delete(player.id); }}><CreatorLabel /></div>)}</>, document.body);
}