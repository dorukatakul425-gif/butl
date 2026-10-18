import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import bootUrl from "@/assets/kick-boot.svg";
import blastUrl from "@/assets/kick-blast.svg";
import timerUrl from "@/assets/kick-timer.svg";
import shieldUrl from "@/assets/kick-shield.svg";
import { displaySeatOf, onRoomKickout, useRoom } from "@/lib/room-session";
import { useSourceFeatureSession } from "@/lib/source-feature-session";
import { playSfx } from "@/lib/sfx";
import type { CilizAssets } from "@/lib/ciliz-assets";

type Point = { x: number; y: number } | null;
type Anim = { kind: "kick" | "save"; until: number; nonce: number };

/** TableUserView.kickoutView: KickoutView.animateKick / animateSave / animateTimer for every seat, shared live. */
export function KickoutSeatFx({ assets, seatPoint }: { assets: CilizAssets; seatPoint: (seat: number) => Point }) {
  const room = useRoom();
  const feature = useSourceFeatureSession();
  const [anims, setAnims] = useState<Record<string, Anim>>({});
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 250); return () => window.clearInterval(t); }, []);
  useEffect(() => onRoomKickout(ev => {
    if (ev.kind === "kicked") return;
    const kind = ev.kind;
    // Kick: sfx 'kick' at 1.165s (the boot hit). Save: sfx 'save' at 0.2s (shield pop).
    window.setTimeout(() => void playSfx(assets.sfxUrl, kind), kind === "kick" ? 1165 : 200);
    setAnims(a => ({ ...a, [ev.target_id]: { kind, until: Date.now() + (kind === "kick" ? 1700 : 3300), nonce: ev.id } }));
  }), [assets]);
  if (typeof document === "undefined") return null;
  const targets = feature.kickout?.targets ?? {};
  const items = room.players.flatMap(p => {
    if (!p) return [];
    const anim = anims[p.id] && anims[p.id]!.until > now ? anims[p.id] : undefined;
    const kickAt = targets[p.id]?.kickAt;
    const left = kickAt ? Math.ceil((kickAt - now) / 1000) : 0;
    if (!anim && left <= 0) return [];
    const pt = seatPoint(displaySeatOf(p.id));
    if (!pt) return [];
    return [{ id: p.id, pt, anim, left }];
  });
  return createPortal(<>
    {items.map(({ id, pt, anim, left }) => (
      <div key={id} className={`kick-fx${anim?.kind === "kick" ? " kick-fx--kicking" : ""}${anim?.kind === "save" ? " kick-fx--saving" : ""}`} style={{ left: pt.x, top: pt.y }} data-testid="kick-fx">
        <div key={anim?.nonce ?? 0} className="kick-fx__shake">
          {anim?.kind === "kick" && <><img className="kick-fx__blast" src={blastUrl} alt="" /><img className="kick-fx__boot" src={bootUrl} alt="" /></>}
          {anim?.kind === "save" && <img className="kick-fx__shield" src={shieldUrl} alt="" />}
          {anim?.kind !== "kick" && left > 0 && (
            <div className={`kick-fx__timer${left <= 10 ? " kick-fx__timer--red" : ""}`} aria-label={`Şutlanmaya ${left} saniye`}>
              <img src={timerUrl} alt="" /><span>{left}</span>
            </div>
          )}
        </div>
      </div>
    ))}
  </>, document.body);
}
