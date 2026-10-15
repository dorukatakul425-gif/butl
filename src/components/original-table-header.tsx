import { translate } from "@/lib/ciliz-assets";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getPendingGold, subscribePendingGold } from "@/lib/game-session";
import { OPEN_TOPS_EVENT, OPEN_VIP_EVENT, OPEN_BANK_EVENT, OPEN_DECOR_EVENT, SourceToastHost } from "@/components/source-dialogs";
import { VipDialog } from "@/components/bank/vip-dialog";
import { useCilizAssets } from "@/components/decor/decor-selection";
import backgroundUp from "@/assets/ui_btn_bg_up.svg.asset.json";
import backgroundDown from "@/assets/ui_btn_bg_down.svg.asset.json";
import heartUp from "@/assets/ui_btn_gold_add_heart_up.svg.asset.json";
import heartDown from "@/assets/ui_btn_gold_add_heart_down.svg.asset.json";
import bottlePass from "@/assets/ui_btn_bottle_pass.svg.asset.json";
import roulette from "@/assets/ui_btn_roulette.svg.asset.json";
import league from "@/assets/ui_btn_league.svg.asset.json";
import menu from "@/assets/ui_btn_misc_menu.svg.asset.json";
import settings from "@/assets/ui_btn_settings.svg.asset.json";
import fullscreen from "@/assets/ui_btn_fullscreen_on.svg.asset.json";
import fullscreenOff from "@/assets/ui_btn_fullscreen_off.svg.asset.json";
import changeTable from "@/assets/ui_btn_change_table.svg.asset.json";
import { Button } from "@/components/ui/button";
import { OriginalMiscMenu } from "@/components/original-misc-menu";
import { DecorSelection } from "@/components/decor/decor-selection";
import { BottleSelection } from "@/components/table/bottle-selection";
import { BankDialog } from "@/components/bank/bank-dialog";
import { SourceTopsDialog } from "@/components/table/source-tops-dialog";
import { SourceBoostersDialog } from "@/components/table/source-boosters-dialog";
import { SourceAchievementNotifications } from "@/components/table/source-achievements-dialog";
import { SourceAchievementsDialog } from "@/components/table/source-achievements-dialog";

import { SettingsDialog } from '@/components/settings/settings-dialog';
import { SourceSeasonDialog } from '@/components/table/source-season-dialogs';
import { SourceChangeTable } from '@/components/table/source-change-table';
import { useRoom, VIEWER_DISPLAY_SEAT } from '@/lib/room-session';

// TableView.createHeaderLayer() order and SVGIcon.getSize() dimensions.
// All artwork is extracted unchanged from the live game's preloader bundle.
const middleIcons = [
  { asset: bottlePass, label: "Şişe bileti", kind: "bottle-pass" },
  { asset: roulette, label: "Rulet", kind: "default" },
  { asset: league, label: "Lig", kind: "default" },
  { asset: menu, label: "Menü", kind: "menu" },
  { asset: settings, label: "Ayarlar", kind: "default" },
  { asset: fullscreen, label: "Tam ekran", kind: "fullscreen" },
];

// FullscreenButton + screenfull.toggle(htmlRoot): "on" icon while windowed, "off" icon while fullscreen.
type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void; webkitFullscreenEnabled?: boolean };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
function FullscreenIcon() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const d = document as FsDoc;
    const sync = () => setOn(Boolean(d.fullscreenElement ?? d.webkitFullscreenElement));
    sync();
    document.addEventListener("fullscreenchange", sync); document.addEventListener("webkitfullscreenchange", sync);
    return () => { document.removeEventListener("fullscreenchange", sync); document.removeEventListener("webkitfullscreenchange", sync); };
  }, []);
  const toggle = () => {
    const d = document as FsDoc; const root = document.documentElement as FsEl;
    if (!(d.fullscreenEnabled || d.webkitFullscreenEnabled)) return;
    if (d.fullscreenElement ?? d.webkitFullscreenElement) void (d.exitFullscreen ? d.exitFullscreen() : d.webkitExitFullscreen?.())?.catch?.(() => {});
    else void (root.requestFullscreen ? root.requestFullscreen() : root.webkitRequestFullscreen?.())?.catch?.(() => {});
  };
  const label = on ? "Tam ekrandan çık" : "Tam ekran";
  return <Button variant="ghost" onClick={toggle} aria-label={label} title={label} aria-pressed={on} className="original-header-button original-icon-fullscreen">
    <img src={backgroundUp.url} alt="" className="original-button-background original-button-up" />
    <img src={backgroundDown.url} alt="" className="original-button-background original-button-down" />
    <img src={on ? fullscreenOff.url : fullscreen.url} alt="" className="original-button-icon" />
  </Button>;
}

function OriginalIcon({ asset, label, kind, onClick }: (typeof middleIcons)[number] & { onClick?: (() => void) | undefined }) {
  if (onClick) return <Button variant="ghost" onClick={onClick} aria-label={label} title={label} className={`original-header-button original-icon-${kind}`}>
    <img src={backgroundUp.url} alt="" className="original-button-background original-button-up" />
    <img src={backgroundDown.url} alt="" className="original-button-background original-button-down" />
    <img src={asset.url} alt="" className="original-button-icon" />
  </Button>;
  return (
    <Button asChild variant="ghost" className={`original-header-button original-icon-${kind}`}>
      <a href={asset.url} target="_blank" rel="noreferrer" aria-label={`${label} orijinal görseli`} title={label}>
        <img src={backgroundUp.url} alt="" className="original-button-background original-button-up" />
        <img src={backgroundDown.url} alt="" className="original-button-background original-button-down" />
        <img src={asset.url} alt={label} className="original-button-icon" />
      </a>
    </Button>
  );
}

export function OriginalTableHeader() {
  const room = useRoom();
  const pending = useSyncExternalStore(subscribePendingGold, getPendingGold, () => 0);
  const rawGold = room.players[VIEWER_DISPLAY_SEAT]?.gold;
  const gold = rawGold == null ? rawGold : Math.max(0, rawGold - pending);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  // Source: changeTableTimeoutSec (10) - 1 → the button shows 9..1 on every table entry, then the icon returns.
  const [changeCount, setChangeCount] = useState(9);
  useEffect(() => {
    if (room.roomId === null) return;
    let n = 9; setChangeCount(n);
    const id = window.setInterval(() => { n -= 1; setChangeCount(n); if (n < 1) window.clearInterval(id); }, 1000);
    return () => window.clearInterval(id);
  }, [room.roomId]);
  const [season, setSeason] = useState<'league' | 'roulette' | 'bottle-pass' | null>(null);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [decorOpen, setDecorOpen] = useState(false);
  const [bottleOpen, setBottleOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [topsOpen, setTopsOpen] = useState(false);
  const [vipOpen, setVipOpen] = useState(false);
  const vipAssets = useCilizAssets();
  const [boostersOpen, setBoostersOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const closeBank = useCallback(() => setBankOpen(false), []);
  const closeBottle = useCallback(() => setBottleOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeDecor = useCallback(() => setDecorOpen(false), []);
  // MiscMenuPresenter: "Stil" -> DecorSelectionPresenter.show()
  const onMenuSelect = useCallback((id: string) => {
    if (id === "decor") setDecorOpen(true);
    if (id === "bottle") setBottleOpen(true);
    if (id === "tops") setTopsOpen(true);
    if (id === "boosters") setBoostersOpen(true);
    if (id === "achievements") setAchievementsOpen(true);
  }, []);
  useEffect(() => {
    const tops = () => setTopsOpen(true), vip = () => setVipOpen(true), gold = () => setBankOpen(true), decor = () => setDecorOpen(true);
    window.addEventListener(OPEN_TOPS_EVENT, tops); window.addEventListener(OPEN_VIP_EVENT, vip); window.addEventListener(OPEN_BANK_EVENT, gold); window.addEventListener(OPEN_DECOR_EVENT, decor);
    return () => { window.removeEventListener(OPEN_TOPS_EVENT, tops); window.removeEventListener(OPEN_VIP_EVENT, vip); window.removeEventListener(OPEN_BANK_EVENT, gold); window.removeEventListener(OPEN_DECOR_EVENT, decor); };
  }, []);
  return (
    <div className="original-table-header" aria-label="Orijinal üst masa ikonları">
      <div className="original-header-wallet">
      <Button type="button" variant="ghost" className="original-header-button original-heart-button"
        aria-label="Kalp al" title="Kalp al" aria-haspopup="dialog" onClick={() => setBankOpen(true)}>
        <img src={heartUp.url} alt="" className="original-heart-image original-button-up" />
        <img src={heartDown.url} alt="" className="original-heart-image original-button-down" />
      </Button>
      <output className="original-header-balance" aria-label="Kalp bakiyesi" aria-live="polite" style={{ width: `${String(gold ?? '—').length}ch` }}>{gold ?? '—'}</output>
      </div>
      <div className="original-header-middle">
        {middleIcons.map((icon) => icon.kind === "menu" ? (
          <Button key={icon.label} ref={menuTriggerRef} type="button" variant="ghost"
            className="original-header-button original-icon-menu" aria-label="Menü" title="Menü"
            aria-expanded={menuOpen} aria-controls="original-misc-menu" aria-haspopup="dialog"
            onClick={() => setMenuOpen((value) => !value)}>
            <img src={backgroundUp.url} alt="" className="original-button-background original-button-up" />
            <img src={backgroundDown.url} alt="" className="original-button-background original-button-down" />
            <img src={menu.url} alt="" className="original-button-icon" />
          </Button>
        ) : icon.kind === 'fullscreen' ? <FullscreenIcon key={icon.label} /> : <OriginalIcon key={icon.label} {...icon} onClick={icon.label === 'Ayarlar' ? () => setSettingsOpen(true) : icon.label === 'Lig' ? () => setSeason('league') : icon.label === 'Rulet' ? () => setSeason('roulette') : icon.kind === 'bottle-pass' ? () => setSeason('bottle-pass') : undefined} />)}
      </div>
      {room.roomId !== null && <div className="original-header-table" aria-label={`Masa ${room.roomId}`}>
        <span className="original-header-table-label">{vipAssets ? translate(vipAssets, 'chat:room_title') : ''}</span>
        <span className="original-header-table-id">{room.roomId}</span>
      </div>}
      <Button variant="ghost" aria-label="Masa değiştir" title="Masa değiştir" aria-disabled={changeCount >= 1}
        onClick={() => { if (changeCount < 1) setChangeOpen(true); }}
        className={`original-header-button original-icon-default${changeCount >= 1 ? ' original-change-table--count' : ''}`}>
        <img src={backgroundUp.url} alt="" className="original-button-background original-button-up" />
        <img src={backgroundDown.url} alt="" className="original-button-background original-button-down" />
        {changeCount >= 1 ? <span className="original-change-table-count">{changeCount}</span> : <img src={changeTable.url} alt="" className="original-button-icon" />}
      </Button>
      {changeOpen && <SourceChangeTable onClose={() => setChangeOpen(false)} />}
      {season && <SourceSeasonDialog feature={season} onClose={() => setSeason(null)} />}
      <SettingsDialog open={settingsOpen} onClose={closeSettings} />
      {topsOpen && <SourceTopsDialog onClose={() => setTopsOpen(false)} />}
      <SourceAchievementNotifications />
      {boostersOpen && <SourceBoostersDialog onClose={() => setBoostersOpen(false)} />}
      {achievementsOpen && <SourceAchievementsDialog onClose={() => setAchievementsOpen(false)} />}
      <OriginalMiscMenu open={menuOpen} triggerRef={menuTriggerRef} onClose={closeMenu} onSelect={onMenuSelect} />
      <DecorSelection open={decorOpen} onClose={closeDecor} />
      <BottleSelection open={bottleOpen} onClose={closeBottle} />
      <BankDialog open={bankOpen} onClose={closeBank} isVip onVip={() => setVipOpen(true)} />
      {vipOpen && vipAssets && <VipDialog assets={vipAssets} onClose={() => setVipOpen(false)} onBought={closeBank} />}
      <SourceToastHost />
    </div>
  );
}