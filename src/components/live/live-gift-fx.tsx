// TikTok-style live gifts: bottom gift panel with combo button, left-side combo banners,
// centre pop for medium gifts and full-screen scenes for big gifts. Everyone in the room
// receives the same broadcast, so the same animation plays for sender and all viewers.
import { useEffect, useRef, useState } from "react";
import { Gift, X } from "lucide-react";
import { translate, usePreferences, type Language } from "@/lib/app-preferences";
import { LIVE_GIFTS, COMBO_MS, giftByKey, type LiveGift } from "@/lib/live-gifts";
import type { RoomGift, RoomMember } from "@/lib/voice-rtc";
import { uid } from "@/lib/voice-rtc";

const T: Record<string, Record<Language, string>> = {
  gifts: { az: "Hədiyyələr", tr: "Hediyeler", ru: "Подарки", en: "Gifts" },
  all: { az: "Hamıya", tr: "Herkese", ru: "Всем", en: "Everyone" },
  send: { az: "Göndər", tr: "Gönder", ru: "Отправить", en: "Send" },
  sent: { az: "göndərdi", tr: "gönderdi", ru: "отправил(а)", en: "sent" },
  free: { az: "Pulsuz", tr: "Ücretsiz", ru: "Бесплатно", en: "Free" },
};
export const useGiftT = () => {
  const { language } = usePreferences();
  return { language, t: (k: keyof typeof T) => T[k]?.[language] ?? T[k]?.az ?? "" };
};

export function GiftSheet({
  members, meId, defaultPhoto, initialTo, disabled, onSend, onClose,
}: {
  members: RoomMember[]; meId: string; defaultPhoto: string; initialTo: string | null; disabled: boolean;
  onSend: (to: RoomMember | null, gift: LiveGift, combo: { id: string; count: number }) => Promise<boolean>;
  onClose: () => void;
}) {
  const { t, language } = useGiftT();
  const [to, setTo] = useState<string | null>(initialTo);
  const [sel, setSel] = useState<string>("rose");
  const [combo, setCombo] = useState<{ id: string; key: string; to: string | null; count: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef(0);
  const others = members.filter((m) => m.id !== meId);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const fire = async () => {
    const g = giftByKey(sel);
    if (!g || busy || disabled) return;
    const same = combo && combo.key === g.key && combo.to === to;
    const next = same ? { ...combo, count: combo.count + 1 } : { id: uid(), key: g.key, to, count: 1 };
    setBusy(true);
    const ok = await onSend(members.find((m) => m.id === to) ?? null, g, { id: next.id, count: next.count });
    setBusy(false);
    if (!ok) return;
    if (g.tier === "big" || g.tier === "video") { onClose(); return; }
    setCombo(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCombo(null), COMBO_MS);
  };

  return (
    <div className="gx-wrap" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="gx-sheet" role="dialog" aria-label={t("gifts")}>
        <div className="gx-head">
          <strong><Gift size={16} /> {t("gifts")}</strong>
          <button type="button" className="gx-x" onClick={onClose} aria-label="Close"><X size={17} /></button>
        </div>
        <div className="gx-to">
          <button type="button" className={to === null ? "on" : ""} onClick={() => setTo(null)}><span className="gx-all">🎉</span>{t("all")}</button>
          {others.map((m) => (
            <button key={m.id} type="button" className={to === m.id ? "on" : ""} onClick={() => setTo(m.id)}>
              <img src={m.photo || defaultPhoto} alt="" />{m.name}{m.seat !== null && <i>{m.seat + 1}</i>}
            </button>
          ))}
        </div>
        <div className="gx-grid">
          {LIVE_GIFTS.map((g) => (
            <button key={g.key} type="button" className={`gx-item${sel === g.key ? " on" : ""} t-${g.tier}`} onClick={() => { setSel(g.key); if (sel === g.key) void fire(); }}>
              <span className="gx-ico">{g.icon}</span>
              <span className="gx-name">{g.name[language]}</span>
              {sel === g.key ? <span className="gx-send">{t("send")}</span> : <span className="gx-price">{t("free")}</span>}
            </button>
          ))}
        </div>
        <div className="gx-foot">
          <span>{giftByKey(sel)?.icon} {giftByKey(sel)?.name[language]}</span>
          <button type="button" className={`gx-fire${combo ? " combo" : ""}`} disabled={busy || disabled} onClick={() => void fire()}>
            {combo ? <><b>x{combo.count + 1}</b><svg viewBox="0 0 40 40"><circle key={combo.count} cx="20" cy="20" r="18" /></svg></> : t("send")}
          </button>
        </div>
      </div>
    </div>
  );
}

export type Banner = RoomGift & { key: string; until: number };

/** Left-side TikTok combo banners (max 2 visible). */
export function GiftBanners({ banners, defaultPhoto, meId }: { banners: Banner[]; defaultPhoto: string; meId: string }) {
  const { t, language } = useGiftT();
  return (
    <div className="gx-banners" aria-live="polite">
      {banners.slice(-2).map((b) => {
        const g = giftByKey(b.gift);
        if (!g) return null;
        return (
          <div key={b.key} className="gx-banner">
            <img src={b.photo || defaultPhoto} alt="" />
            <div><b>{b.from === meId ? translate("Sən") : b.name}</b><small>{t("sent")} {g.name[language]}{b.toName ? ` → ${b.toName}` : ""}</small></div>
            <span className="gx-bico">{g.icon}</span>
            <span key={b.count} className="gx-count">x{b.count ?? 1}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Centre pop (medium) or full-screen scene (big). */
export function GiftScene({ gift, onDone }: { gift: RoomGift; onDone: () => void }) {
  const { t, language } = useGiftT();
  const g = giftByKey(gift.gift);
  useEffect(() => {
    const tm = window.setTimeout(onDone, g?.tier === "big" ? 3600 : 2200);
    return () => window.clearTimeout(tm);
  }, [gift.id, g?.tier, onDone]);
  if (!g) return null;
  return (
    <div className={`gx-scene s-${g.tier} k-${g.key}`} aria-hidden="true">
      {g.tier === "big" && <div className="gx-bg" />}
      {g.tier === "big" && Array.from({ length: 14 }, (_, i) => <i key={i} className="gx-spark" style={{ ["--i" as string]: i }} />)}
      <span className="gx-hero">{g.icon}</span>
      <div className="gx-cap"><b>{gift.name}</b> {t("sent")} {g.name[language]}{gift.toName ? ` → ${gift.toName}` : ""}</div>
    </div>
  );
}

export const GIFT_FX_STYLES = `
.gx-wrap{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center;background:oklch(0 0 0 / .35);}
.gx-sheet{width:min(100%,520px);max-height:62dvh;display:flex;flex-direction:column;background:oklch(.16 .01 280 / .97);border-radius:18px 18px 0 0;padding:10px 10px max(10px,env(safe-area-inset-bottom));animation:vr-up .22s ease-out;color:oklch(.97 0 0);}
.gx-head{display:flex;justify-content:space-between;align-items:center;padding:0 4px 6px;}
.gx-head strong{display:flex;align-items:center;gap:6px;font-size:14px;}
.gx-x{all:unset;cursor:pointer;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:oklch(1 0 0 / .08);}
.gx-to{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 2px 8px;}
.gx-to button{all:unset;cursor:pointer;flex-shrink:0;display:flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;padding:3px 9px 3px 3px;border-radius:16px;background:oklch(1 0 0 / .07);border:1px solid oklch(1 0 0 / .08);}
.gx-to button.on{border-color:oklch(.68 .22 15);background:oklch(.68 .22 15 / .2);}
.gx-to img,.gx-all{width:22px;height:22px;border-radius:50%;object-fit:cover;display:grid;place-items:center;font-size:12px;}
.gx-to i{font-style:normal;font-size:9.5px;padding:0 4px;border-radius:6px;background:oklch(1 0 0 / .15);}
.gx-grid{flex:1;min-height:0;overflow-y:auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;scrollbar-width:none;}
.gx-item{all:unset;cursor:pointer;position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px 0;border-radius:12px;border:1.5px solid transparent;overflow:hidden;transition:transform .15s;}
.gx-item.on{border-color:oklch(.68 .22 15);background:oklch(1 0 0 / .06);}
.gx-item:active{transform:scale(.93);}
.gx-ico{font-size:34px;line-height:1.15;filter:drop-shadow(0 3px 6px oklch(0 0 0 / .4));}
.gx-item.on .gx-ico{animation:gx-bob .9s ease-in-out infinite;}
.gx-name{font-size:11px;font-weight:700;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.gx-price{font-size:10px;color:oklch(.85 .14 85);padding-bottom:6px;}
.gx-send{width:100%;text-align:center;font-size:11px;font-weight:850;padding:5px 0;background:oklch(.64 .23 15);margin-top:2px;}
.t-big .gx-name::after,.t-video .gx-name::after{content:" ✦";color:oklch(.85 .14 85);}
.gx-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 4px 0;font-size:12.5px;font-weight:700;}
.gx-fire{all:unset;cursor:pointer;position:relative;min-width:84px;height:36px;border-radius:18px;text-align:center;line-height:36px;font-weight:850;font-size:13px;background:linear-gradient(90deg,oklch(.66 .24 10),oklch(.62 .24 350));box-shadow:0 6px 16px oklch(.6 .23 10 / .45);}
.gx-fire.combo{min-width:0;width:54px;height:54px;line-height:54px;border-radius:50%;font-size:15px;animation:gx-pulse .6s ease-in-out infinite alternate;}
.gx-fire svg{position:absolute;inset:-4px;width:62px;height:62px;transform:rotate(-90deg);}
.gx-fire circle{fill:none;stroke:oklch(.97 0 0);stroke-width:3;stroke-dasharray:113;stroke-dashoffset:0;animation:gx-ring ${COMBO_MS}ms linear forwards;}
.gx-fire:disabled{opacity:.6;}
.gx-banners{position:fixed;z-index:70;left:8px;top:38%;display:flex;flex-direction:column;gap:6px;pointer-events:none;}
.gx-banner{position:relative;display:flex;align-items:center;gap:6px;height:38px;padding:0 44px 0 3px;border-radius:19px;background:linear-gradient(90deg,oklch(.25 .05 300 / .9),oklch(.25 .05 300 / .2));animation:gx-slide .35s cubic-bezier(.2,.9,.3,1.2);}
.gx-banner img{width:32px;height:32px;border-radius:50%;object-fit:cover;}
.gx-banner div{display:flex;flex-direction:column;line-height:1.1;max-width:120px;}
.gx-banner b{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.gx-banner small{font-size:10.5px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.gx-bico{position:absolute;right:2px;font-size:30px;animation:gx-pop .4s cubic-bezier(.2,1.6,.4,1);}
.gx-count{position:absolute;left:calc(100% + 4px);font-size:22px;font-weight:900;font-style:italic;color:oklch(.92 .15 90);text-shadow:0 2px 0 oklch(.5 .15 50),0 0 10px oklch(.8 .15 80 / .6);animation:gx-pop .3s cubic-bezier(.2,1.8,.4,1);}
.gx-scene{position:fixed;inset:0;z-index:88;pointer-events:none;display:grid;place-items:center;overflow:hidden;}
.gx-hero{font-size:110px;filter:drop-shadow(0 10px 30px oklch(0 0 0 / .5));animation:gx-zoom 2.2s cubic-bezier(.2,1.4,.4,1) forwards;}
.gx-cap{position:absolute;top:24%;left:50%;transform:translateX(-50%);padding:6px 14px;border-radius:16px;font-size:13px;background:oklch(0 0 0 / .5);white-space:nowrap;animation:gx-fade 2.2s ease forwards;}
.gx-cap b{color:oklch(.85 .14 85);}
.s-big .gx-hero{font-size:150px;animation-duration:3.6s;}
.s-big .gx-cap{animation-duration:3.6s;}
.gx-bg{position:absolute;inset:0;animation:gx-fade 3.6s ease forwards;background:radial-gradient(circle at 50% 50%,oklch(.7 .2 330 / .45),oklch(.2 .08 290 / .5) 60%,transparent);}
.k-universe .gx-bg{background:conic-gradient(from 0deg,oklch(.35 .15 280 / .7),oklch(.45 .2 320 / .7),oklch(.3 .12 240 / .7),oklch(.35 .15 280 / .7));animation:gx-fade 3.6s ease forwards,gx-spin 6s linear infinite;}
.k-castle .gx-bg{background:linear-gradient(transparent 30%,oklch(.6 .15 60 / .5));}
.gx-spark{position:absolute;left:50%;top:50%;width:8px;height:8px;border-radius:50%;background:oklch(.92 .15 90);box-shadow:0 0 12px oklch(.92 .15 90);animation:gx-spark 1.6s ease-out calc(var(--i) * .12s) infinite;transform:rotate(calc(var(--i) * 25.7deg)) translateY(0);}
.k-car .gx-hero{animation:gx-drive 3.6s cubic-bezier(.3,.7,.4,1) forwards;}
.k-rocket .gx-hero{animation:gx-launch 3.6s cubic-bezier(.5,0,.6,1) forwards;}
.k-lion .gx-hero{animation:gx-roar 3.6s ease forwards;}
.k-castle .gx-hero{animation:gx-rise 3.6s cubic-bezier(.2,1,.4,1) forwards;}
.k-fireworks .gx-hero{animation:gx-burst 2.2s ease-out forwards;}
@keyframes gx-bob{50%{transform:translateY(-4px) scale(1.06)}}
@keyframes gx-pulse{to{transform:scale(1.08)}}
@keyframes gx-ring{to{stroke-dashoffset:113}}
@keyframes gx-slide{from{transform:translateX(-110%);opacity:0}}
@keyframes gx-pop{0%{transform:scale(2.2);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes gx-zoom{0%{transform:scale(.2);opacity:0}20%{transform:scale(1.15);opacity:1}35%{transform:scale(1)}80%{transform:scale(1);opacity:1}100%{transform:scale(.6) translateY(-80px);opacity:0}}
@keyframes gx-fade{0%{opacity:0}12%{opacity:1}82%{opacity:1}100%{opacity:0}}
@keyframes gx-spin{to{transform:rotate(360deg) scale(1.6)}}
@keyframes gx-spark{0%{opacity:1;transform:rotate(calc(var(--i) * 25.7deg)) translateY(0) scale(1)}100%{opacity:0;transform:rotate(calc(var(--i) * 25.7deg)) translateY(-42vmin) scale(.3)}}
@keyframes gx-drive{0%{transform:translateX(-120vw) scaleX(-1)}35%{transform:translateX(0) scaleX(-1)}45%{transform:translateX(0) scaleX(-1) rotate(-4deg)}70%{transform:translateX(0) scaleX(-1)}100%{transform:translateX(120vw) scaleX(-1)}}
@keyframes gx-launch{0%{transform:translateY(60vh) rotate(-45deg)}30%{transform:translateY(0) rotate(-45deg)}60%{transform:translateY(-4vh) rotate(-45deg)}100%{transform:translateY(-120vh) rotate(-45deg)}}
@keyframes gx-roar{0%{transform:scale(.3);opacity:0}20%{transform:scale(1.25);opacity:1}30%,50%{transform:scale(1)}40%{transform:scale(1.12) rotate(-3deg)}85%{opacity:1}100%{transform:scale(1.5);opacity:0}}
@keyframes gx-rise{0%{transform:translateY(70vh)}35%{transform:translateY(0)}85%{opacity:1}100%{transform:translateY(0) scale(1.1);opacity:0}}
@keyframes gx-burst{0%{transform:scale(.2);opacity:0}30%{transform:scale(1.4);opacity:1}100%{transform:scale(2.4);opacity:0}}
@media(prefers-reduced-motion:reduce){.gx-scene *,.gx-banner,.gx-banner *{animation-duration:.01s!important}}
`;
