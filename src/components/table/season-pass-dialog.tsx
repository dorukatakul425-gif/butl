import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { showSourceToast } from "@/components/source-dialogs";
import {
  buyPassPremium, canClaim, claimPassChest, claimPassLevel, fetchPassInfo, getCachedPass, passClock, passLeftText,
  passProgress, prizeView, type PassInfo, type PassLevel, type PassReward,
} from "@/lib/season-pass";
import "@/styles/season-pass.css";

/** Port of ureyimsen BottlePassDialog + BottlePassPremiumDialog + bottle_pass_info pager help. */
const CDN = "https://butilochka.cdnvideo.ru/bottle/bundle/dlg300";
const HELP = [
  "Fəsil başa çatmazdan əvvəl mükafatlar əldə etmək üçün xallar qazan və səviyyəni yüksəlt",
  "Hər yeni səviyyədə mükafatları əlçatan et",
  "Hər gün yeni mükafat əldə et",
  "Premium keçid icazəsi olanlar üçün təkrarolunmaz dekor daxil olmaqla, xüsusi güzəştlər və premium mükafatlar",
];
const BOOSTER_NAMES: Record<string, string> = {
  league_kiss_lim10: "Liqa öpüş limiti +10", league_kiss2x: "Liqa öpüşü x2", league5: "Liqa +5 xal",
  kiss_fire: "Alovlu öpüş", refuse_slap: "Şillə", nitrodecor: "Dəst Nitro",
};

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  return now;
}

function rewardText(r: PassReward | undefined) {
  if (!r) return "";
  const parts: string[] = [];
  if (r.gold) parts.push(`❤️ ${r.gold}`);
  if (r.tokens) parts.push(`🪙 ${r.tokens}`);
  for (const [k, v] of Object.entries(r.items ?? {})) parts.push(`${BOOSTER_NAMES[k] ?? k} ×${v}`);
  return parts.join(", ");
}

function Prize({ reward }: { reward: PassReward }) {
  const v = prizeView(reward);
  if (!v) return null;
  if (v.kind === "heart") return <div className="css-item css-item--heart bottle-pass__item bottle-pass__item--heart" style={{ width: 50, height: 50, fontSize: 18.18 }}><div className="css-item__value ">+{v.value}</div></div>;
  if (v.kind === "tokens") return <div className="css-item css-item--token bottle-pass__item bottle-pass__item--tokens" style={{ width: 36, height: 36, fontSize: 13.09 }}><div className="css-item__value ">+{v.value}</div></div>;
  if (v.kind === "booster") return <div className="booster-item booster-item--list bottle-pass__booster-item"><div className="booster-item__image"><div className={`booster-item__icon booster-item__icon--${v.id}`} /><div className="booster-item__hint booster-item__hint--counter">{v.count}</div></div></div>;
  if (v.kind === "decor") return <img className="bottle-pass__item" src={`${CDN}/f_${v.id}.webp`} width={56} height={56} alt="" crossOrigin="anonymous" />;
  return <div className={`bottle-pass__item bottle-pass__item--${v.kind}`} />;
}

function LevelRow({ info, l, now, onClaim }: { info: PassInfo; l: PassLevel; now: number; onClaim: (l: PassLevel, premium: boolean) => void }) {
  const opened = l.level <= info.level;
  const decor = prizeView(l.paid)?.kind === "decor";
  const premiumState = opened && info.pass_premium ? "premium" : "premium-locked";
  const freeState = opened ? "free" : "free-locked";
  const cp = canClaim(info, l, true, now), cf = canClaim(info, l, false, now);
  const icon = (r: PassReward, mine: boolean) => r.claimed ? "claimed" : !mine ? "locked" : "opened";
  return <div className="bottle-pass__level">
    <div className={`bottle-pass__level-bar bottle-pass__level-bar--${opened ? "opened" : "locked"}`}>
      <div className="bottle-pass__level-bar-shadow bottle-pass__level-bar-shadow--top" /><div className="bottle-pass__level-bar-shadow bottle-pass__level-bar-shadow--bottom" />
    </div>
    <div className={`bottle-pass__level-prize bottle-pass__level-prize--${decor ? `premium-decor${premiumState === "premium" ? "" : "-locked"}` : premiumState}`} role="button" onClick={() => onClaim(l, true)}>
      {cp && <div className="bottle-pass__level-prize-light bottle-pass__level-prize-light--premium" />}
      <Prize reward={l.paid} />
      <div className={`bottle-pass__level-prize-icon bottle-pass__level-prize-icon--${icon(l.paid, info.pass_premium)}`} />
      {cp && <div className="bottle-pass__level-prize-collect bottle-pass__level-prize-collect--premium">Topla!</div>}
    </div>
    <div className="bottle-pass__level-dots" />
    <div className={`bottle-pass__level-title bottle-pass__level-title--${opened ? "opened" : "locked"}`}><div className="bottle-pass__level-title bottle-pass__level-title--text">{l.level + 1}</div></div>
    <div className="bottle-pass__level-dots" />
    <div className={`bottle-pass__level-prize bottle-pass__level-prize--${freeState}`} role="button" onClick={() => onClaim(l, false)}>
      {cf && <div className="bottle-pass__level-prize-light bottle-pass__level-prize-light--free" />}
      <Prize reward={l.free} />
      {l.free.claimed && <div className="bottle-pass__level-prize-icon bottle-pass__level-prize-icon--claimed" />}
      {cf && <div className="bottle-pass__level-prize-collect bottle-pass__level-prize-collect--free">Topla!</div>}
    </div>
  </div>;
}

function Popup({ name, z, children }: { name: string; z: number; children: React.ReactNode }) {
  return <div className={`popup popup--center popup--show ${name}`} data-dm-type="dialog" style={{ pointerEvents: "auto", zIndex: z }}>{children}</div>;
}
function Close({ onClick, cls }: { onClick: () => void; cls: string }) {
  return <div className="popup__close popup__close--dlg" role="button" aria-label="Bağla" onClick={onClick}><div className={`popup__close-icon ${cls}`} /></div>;
}

export function SeasonPassDialog({ onClose, startPremium = false }: { onClose: () => void; startPremium?: boolean }) {
  const [info, setInfo] = useState<PassInfo | null>(getCachedPass());
  const [premiumOpen, setPremiumOpen] = useState(startPremium);
  const [helpOpen, setHelpOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [claimed, setClaimed] = useState<PassReward | null>(null);
  const now = useNow();
  const scroller = useRef<HTMLDivElement>(null);
  const offset = info ? info.now_ms - Date.now() : 0;
  const t = now + offset;

  const reload = () => fetchPassInfo().then((d) => { if (d) setInfo(d); });
  useEffect(() => { void reload(); }, []);
  // Source: the list opens scrolled to the current level (bottom = level 1).
  useEffect(() => {
    const el = scroller.current;
    if (!el || !info) return;
    const rows = el.querySelectorAll<HTMLElement>(".bottle-pass__level:not(.bottle-pass__level--footer)");
    const row = rows[rows.length - 1 - Math.min(info.level + 1, rows.length - 1)];
    if (row) el.scrollTop = row.offsetTop - el.clientHeight / 2;
    else el.scrollTop = el.scrollHeight;
  }, [info?.level, info === null]); // eslint-disable-line react-hooks/exhaustive-deps

  const onClaim = async (l: PassLevel, premium: boolean) => {
    if (!info || busy) return;
    const r = premium ? l.paid : l.free;
    if (r.claimed) { showSourceToast("Mükafat artıq toplanıb"); return; }
    if (l.start_ms > t) { showSourceToast(`${l.level + 1} səviyyəsinin açılacağı müddət: ${passClock(l.start_ms - t)}`); return; }
    if (l.score > info.score) { showSourceToast("Mükafatı almaq üçün bu səviyyəyə çat"); return; }
    if (premium && !info.pass_premium) { setPremiumOpen(true); return; }
    setBusy(true);
    const res = await claimPassLevel(l.level, premium);
    setBusy(false);
    if (res.ok) { setClaimed(r); void reload(); }
    else showSourceToast(res.reason === "claimed" ? "Mükafat artıq toplanıb" : "Mükafat toplanmadı, yenidən yoxla");
  };
  const onBuy = async () => {
    if (busy || !info) return;
    setBusy(true);
    const r = await buyPassPremium();
    setBusy(false);
    if (r.ok) { showSourceToast("✨ Premium icazənamə aktivdir!"); void reload(); }
    else showSourceToast(r.reason.includes("insufficient") ? "Kifayət qədər DAT yoxdur 🪙" : r.reason === "purchased" ? "Satın alındı!" : "Alınmadı, yenidən yoxla");
  };
  const onChest = async () => {
    setBusy(true);
    const r = await claimPassChest();
    setBusy(false);
    if (r.ok) setClaimed({ claimed: true, gold: r.gold ?? 0 });
    else showSourceToast("Sandıq açılmadı");
  };

  const prog = info ? passProgress(info.levels, info.score, info.level) : null;
  const left = info ? info.finish_ms - t : 0;
  const lastLevel = info?.levels.length ?? 35;
  const nextLocked = info?.levels.find((l) => l.start_ms > t);
  const totals = info?.levels.reduce((a, l) => {
    a.gold += l.paid.gold ?? 0; a.tokens += l.paid.tokens ?? 0;
    for (const [k, v] of Object.entries(l.paid.items ?? {})) if (!k.endsWith("decor")) a.items[k] = (a.items[k] ?? 0) + v;
    return a;
  }, { gold: 0, tokens: 0, items: {} as Record<string, number> });

  return createPortal(
    <div className="season-pass-layer" style={{ position: "fixed", inset: 0, zIndex: 1100, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup__dialog-manager">
        <div className="popup-shade" onClick={onClose} />
        <Popup name="bottle-pass__x_popup" z={1000}>
          <div className="popup__header bottle-pass__x_popup__header">
            <div className="popup__title bottle-pass__x_popup__title">Mövsümi icazənamə</div>
            <div className="bottle-pass__manual" role="button" aria-label="Qaydalar" onClick={() => setHelpOpen(true)} />
            <div className="bottle-pass__header-info">
              <div className="bottle-pass__controls">
                <div className="bottle-pass__control bottle-pass__control--premium" role="button" onClick={() => setPremiumOpen(true)}>
                  <div className="bottle-pass__premium-icon-bg"><div className="bottle-pass__premium-icon" />{info?.pass_premium && <div className="bottle-pass__premium-purchased-icon" />}</div>
                  <div className="bottle-pass__premium-btn-title">Premium icazənamə</div>
                </div>
                <div className="bottle-pass__control bottle-pass__control--state">
                  <div className={`bottle-pass__season-state-icon bottle-pass__season-state-icon--${left > 0 ? "timer" : "finish"}`} />
                  <div className="bottle-pass__season-state-info">
                    <div className="bottle-pass__season-state-title">{left > 0 ? "Etibarlıdır: " : "Mövsüm bitdi"}</div>
                    {left > 0 && <div className="bottle-pass__season-state-timer">{passLeftText(left)}</div>}
                  </div>
                </div>
              </div>
              <div className="bottle-pass__season-stats">
                <div className="bottle-pass__season-stats-icon" />
                <div className="bottle-pass__season-stats-progress">
                  <div className="bottle-pass__season-stats-progress bottle-pass__season-stats-progress--bar" style={{ width: `${prog ? Math.min(100, (prog.value / prog.max) * 100) : 0}%` }} />
                  <div className="bottle-pass__season-stats-info"><strong>{prog?.value ?? 0}</strong>/{prog?.max ?? 100}</div>
                </div>
                <div className="bottle-pass__season-stats-level bottle-pass__season-stats-level--level"><div>{Math.min(prog?.next ?? 1, lastLevel)}</div></div>
              </div>
            </div>
            <div className="bottle-pass__header-border-btm" />
            <Close onClick={onClose} cls="bottle-pass__x_popup__close-icon" />
          </div>
          <div ref={scroller} className="popup__content popup__content--no-padding bottle-pass__x_popup__content" style={{ overflowY: "auto" }}>
            {info && <div className="bottle-pass">
              <div className="bottle-pass__bonus">
                <div className={`bottle-pass__bonus-chest-stats bottle-pass__bonus-chest-stats--${info.pass_premium ? "premium" : "disabled"}`}>
                  <div className="bottle-pass__bonus-chest-stats-shadow" />
                  <div className="bottle-pass__bonus-chest-title">Bonus sandığında: <div className="bottle-pass__bonus-chest-score">{info.chest.gold}</div></div>
                </div>
                <div className="bottle-pass__bonus-chest">
                  <div className="bottle-pass__bonus-chest-title bottle-pass__bonus-chest-title--info">Bonus sandığı</div>
                  <div className="bottle-pass__bonus-chest-icon" />
                  <div className="bottle-pass__bonus-chest-desc">Sən <b>{lastLevel}</b> səviyyəsinə çatdıqdan sonra, hər <span className="bottle-pass__bonus-chest-desc-icon bottle-pass__bonus-chest-desc-icon--star">{info.chest.overscore2gold}</span> bonus sandığına <span className="bottle-pass__bonus-chest-desc-icon bottle-pass__bonus-chest-desc-icon--heart">1</span> əlavə edəcək. Sandığı, Premium icazənamən olduğu halda mövsümün sonunda açmaq olar.</div>
                  <div className="bottle-pass__bonus-chest-max">Maksimum: <div className="bottle-pass__bonus-chest-score">{info.chest.gold_max}</div></div>
                  {info.prev_chest > 0 && <div role="button" className="button button--confirm" style={{ margin: "8px auto 0" }} onClick={() => void onChest()}>Sandığı aç (+{info.prev_chest} ❤️)</div>}
                </div>
              </div>
              <div className="bottle-pass__levels">
                {[...info.levels].reverse().map((l) => <LevelRow key={l.level} info={info} l={l} now={t} onClaim={(lv, p) => void onClaim(lv, p)} />)}
                {nextLocked && <div className="bottle-pass__toast" style={{ position: "relative" }}>
                  <div className="bottle-pass__toast-title">{nextLocked.level + 1} səviyyəsinin açılacağı müddət:</div>
                  <div className="bottle-pass__toast-timer">{passClock(nextLocked.start_ms - t)}</div>
                </div>}
                <div className="bottle-pass__level bottle-pass__level--footer">
                  <div className="bottle-pass__level-bar bottle-pass__level-bar--level" />
                  <div className="bottle-pass__prize-title bottle-pass__prize-title--premium bottle-pass__prize-title--clickable" role="button" onClick={() => setPremiumOpen(true)}>Premium mükafatlar</div>
                  <div className="bottle-pass__level-title bottle-pass__level-title--level">Səviyyə</div>
                  <div className="bottle-pass__prize-title bottle-pass__prize-title--free">Mükafatlar</div>
                </div>
              </div>
            </div>}
          </div>
        </Popup>

        {premiumOpen && info && totals && <>
          <div className="popup-shade" style={{ zIndex: 1001 }} onClick={() => setPremiumOpen(false)} />
          <Popup name="bottle-pass-premium__x_popup" z={1002}>
            <div className="popup__header bottle-pass-premium__x_popup__header">
              <div className="popup__title bottle-pass-premium__x_popup__title">Premium icazənamə</div>
              <Close onClick={() => setPremiumOpen(false)} cls="bottle-pass-premium__x_popup__close-icon" />
            </div>
            <div className="popup__content popup__content--no-padding" style={{ overflowY: "auto" }}>
              <div className="bottle-pass-premium">
                <div className="bottle-pass-premium__info"><div className="bottle-pass-premium__description">Mövsüm başa çatana qədər premium mükafatları və xüsusi güzəştləri aşkar et!</div><div className="bottle-pass-premium__pass-icon" /></div>
                <div className="bottle-pass-premium__overall-prize-container"><div className="bottle-pass-premium__overall-prize">Mükafatların ümumi dəyəri ən azı <span className="bottle-pass-premium__heart">2000</span>!</div></div>
                <div className="bottle-pass-premium__features">
                  <div className="bottle-pass-premium__feature bottle-pass-premium__feature--decor">
                    <div className="decor-preview__table">
                      <div className="decor-preview__photo_bg"><div className="decor-preview__photo" style={{ backgroundColor: "rgb(221, 232, 237)" }} /><img className="decor-preview__frame" width={75} height={75} crossOrigin="anonymous" src={`${CDN}/f_nitrodecor.webp`} alt="" /></div>
                      <div className="decor-preview__name_bg"><img className="decor-preview__stone" width={9} height={9} crossOrigin="anonymous" src={`${CDN}/n_nitrodecor.webp`} alt="" /><div className="decor-preview__name">Nitro</div><img className="decor-preview__stone" width={9} height={9} crossOrigin="anonymous" src={`${CDN}/n_nitrodecor.webp`} alt="" /></div>
                    </div>
                    <div className="decor-preview__control"><div className="decor-preview__text"><div className="decor-preview__title">Dəst Nitro</div><div className="decor-preview__desc"><span className="decor-preview__heart">500</span> qiymətində <b>FREE</b> təkrarolunmaz dekor əldə etmək şansı</div></div></div>
                  </div>
                  <div className="bottle-pass-premium__feature"><div className="bottle-pass-premium__feature-icon bottle-pass-premium__feature-icon--name" /><div className="bottle-pass-premium__feature-title">Adını həm söhbətdə, həm də profildə nəzərəçarpacaq şəkildə fərqləndir</div></div>
                  <div className="bottle-pass-premium__feature"><div className="bottle-pass-premium__feature-icon bottle-pass-premium__feature-icon--daily" /><div className="bottle-pass-premium__feature-title">Gündəlik bonus sayını iki dəfə artır: mövsüm ərzində <span className="bottle-pass-premium__heart">210</span> qədər ürək topla</div></div>
                  <div className="bottle-pass-premium__feature"><div className="bottle-pass-premium__feature-icon bottle-pass-premium__feature-icon--chest" /><div className="bottle-pass-premium__feature-title">Bütün səviyyələri bitirdikdən sonra bonus sandığında <span className="bottle-pass-premium__heart">{info.chest.gold_max}</span> qədər bonus al!</div></div>
                </div>
                <div className="bottle-pass-premium__prizes">
                  <div className="bottle-pass-premium__prize-title">Bütün səviyyələrin tamamlanması üçün digər premium mükafatlar:</div>
                  <div className="bottle-pass-premium__prize-list">
                    <div className="css-item css-item--heart bottle-pass-premium__item bottle-pass-premium__item--heart" style={{ width: 42, height: 42, fontSize: 13 }}><div className="css-item__value ">+{totals.gold}</div></div>
                    <div className="css-item css-item--token-small bottle-pass-premium__item" style={{ width: 42, height: 42, fontSize: 13 }}><div className="css-item__value ">+{totals.tokens}</div></div>
                    {Object.entries(totals.items).map(([k, v]) => <div key={k} className="booster-item booster-item--info bottle-pass-premium__item bottle-pass-premium__item--booster" style={{ width: 42, height: 42, fontSize: 11 }}>
                      <div className="booster-item__image"><img width={42} height={42} crossOrigin="anonymous" src={`${CDN}/boost_${k}.webp`} alt="" /><div className="booster-item__hint booster-item__hint--counter" style={{ padding: "0 5px" }}>{v}</div></div>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="popup__buttons popup__buttons--center bottle-pass-premium__x_buttons popup__border--top">
              {info.pass_premium
                ? <div className="bottle-pass-premium__status bottle-pass-premium__status--purchased"><div className="bottle-pass-premium__success" /><div className="bottle-pass-premium__btn-label bottle-pass-premium__btn-label--purchased">Satın alındı!</div></div>
                : <div className="bottle-pass-premium__status bottle-pass-premium__status--buy">
                    <div role="button" className={`button button--confirm bottle-pass-premium__x_button${busy ? " bottle-pass-premium__x_button--disabled" : ""}`} onClick={() => void onBuy()}>Al {info.price} DAT</div>
                    <div className="bottle-pass-premium__timer">Etibarlıdır: {passLeftText(left)}</div>
                  </div>}
            </div>
          </Popup>
        </>}

        {helpOpen && <PassHelp onClose={() => setHelpOpen(false)} />}

        {claimed && <>
          <div className="popup-shade" style={{ zIndex: 1003 }} onClick={() => setClaimed(null)} />
          <Popup name="info__x_popup" z={1004}>
            <div className="popup__header"><div className="popup__title">Mükafat toplandı!</div><Close onClick={() => setClaimed(null)} cls="" /></div>
            <div className="popup__content popup__content--center" style={{ textAlign: "center", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><Prize reward={claimed} /></div>
              <div style={{ fontSize: 15 }}>{rewardText(claimed)}</div>
            </div>
            <div className="popup__buttons popup__buttons--center"><div role="button" className="button button--confirm" onClick={() => setClaimed(null)}>Əla!</div></div>
          </Popup>
        </>}
      </div>
    </div>,
    document.body,
  );
}

function PassHelp({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(0);
  return <>
    <div className="popup-shade" style={{ zIndex: 1001 }} onClick={onClose} />
    <Popup name="info__x_popup pager-help__x_popup" z={1002}>
      <div className="popup__header"><div className="popup__title">Qaydalar</div><Close onClick={onClose} cls="" /></div>
      <div className="popup__content">
        <div className="pager pager-help__previews">
          <div className="pager__page pager-help__preview"><div className="pager-help__preview">
            <div className={`pager-help__image pager-help__image--bp-help-${page + 1}`} />
            <div className="pager-help__desc">{HELP[page]}</div>
          </div></div>
        </div>
        <div className="page-scroller-controls__container pager-help__controls">
          <div className={`pager-help__control pager-help__control--backward${page > 0 ? " pager-help__control--active" : ""}`} role="button" onClick={() => setPage((p) => Math.max(0, p - 1))} />
          <div className="page-scroller-controls__dots-container">
            {HELP.map((_, i) => <div key={i} role="button" className={`page-scroller-controls__dot${i === page ? "" : " page-scroller-controls__dot--clickable"}`} onClick={() => setPage(i)} />)}
            <div className="page-scroller-controls__indicator" style={{ left: 12 + page * 18 }} />
          </div>
          <div className={`pager-help__control pager-help__control--forward${page < HELP.length - 1 ? " pager-help__control--active" : ""}`} role="button" onClick={() => setPage((p) => Math.min(HELP.length - 1, p + 1))} />
        </div>
      </div>
    </Popup>
  </>;
}
