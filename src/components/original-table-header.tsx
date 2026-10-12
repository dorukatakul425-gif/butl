import { useCallback, useRef, useState } from "react";
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
import changeTable from "@/assets/ui_btn_change_table.svg.asset.json";
import { Button } from "@/components/ui/button";
import { OriginalMiscMenu } from "@/components/original-misc-menu";
import { DecorSelection } from "@/components/decor/decor-selection";
import { BottleSelection } from "@/components/table/bottle-selection";
import { BankDialog } from "@/components/bank/bank-dialog";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { useGameSession } from "@/lib/game-session";
import { TableFeatureDialog } from '@/components/table/table-feature-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// TableView.createHeaderLayer() order and SVGIcon.getSize() dimensions.
// All artwork is extracted unchanged from the live game's preloader bundle.
const middleIcons = [
  { asset: bottlePass, label: "Şişe bileti", kind: "bottle-pass" },
  { asset: roulette, label: "Rulet", kind: "default" },
  { asset: league, label: "Lig", kind: "default" },
  { asset: menu, label: "Menü", kind: "menu" },
  { asset: settings, label: "Ayarlar", kind: "settings" },
  { asset: fullscreen, label: "Tam ekran", kind: "fullscreen" },
];

function OriginalIcon({ asset, label, kind, onClick, disabled }: (typeof middleIcons)[number] & { onClick: () => void; disabled?: boolean }) {
  return (
    <Button variant="ghost" disabled={disabled} onClick={onClick} aria-label={label} title={label} className={`original-header-button original-icon-${kind}`}>
        <img src={backgroundUp.url} alt="" className="original-button-background original-button-up" />
        <img src={backgroundDown.url} alt="" className="original-button-background original-button-down" />
        <img src={asset.url} alt={label} className="original-button-icon" />
    </Button>
  );
}

export function OriginalTableHeader() {
  const account = useGameSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [decorOpen, setDecorOpen] = useState(false);
  const [bottleOpen, setBottleOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [feature, setFeature] = useState<string | null>(null);
  const [changing, setChanging] = useState(false);
  const changingRef = useRef(false);
  const changeRoom = async () => {
    if (changingRef.current) return;
    changingRef.current = true; setChanging(true);
    try { const { error } = await supabase.rpc('change_game_room'); if (error) throw error; window.dispatchEvent(new Event('game-room-rejoin')); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Masa değiştirilemedi.'); }
    finally { changingRef.current = false; setChanging(false); }
  };
  const clickIcon = async (icon: (typeof middleIcons)[number]) => {
    if (icon.kind !== 'fullscreen') { setFeature(icon.kind === 'bottle-pass' ? 'bottle-pass' : icon.label === 'Rulet' ? 'roulette' : 'league'); return; }
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); else toast.info('Bu tarayıcı tam ekranı desteklemiyor.'); }
    catch { toast.info('Bu tarayıcı tam ekranı açamadı.'); }
  };
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const closeBank = useCallback(() => setBankOpen(false), []);
  const closeBottle = useCallback(() => setBottleOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeDecor = useCallback(() => setDecorOpen(false), []);
  // MiscMenuPresenter: "Stil" -> DecorSelectionPresenter.show()
  const onMenuSelect = useCallback((id: string) => {
    if (id === "decor") setDecorOpen(true);
    if (id === "bottle") setBottleOpen(true);
    if (['achievements', 'tops', 'boosters'].includes(id)) setFeature(id);
  }, []);
  return (
    <div className="original-table-header" aria-label="Orijinal üst masa ikonları">
      <div className="original-heart-balance">
      <Button type="button" variant="ghost" className="original-header-button original-heart-button"
        aria-label="Kalp al" title="Kalp al" aria-haspopup="dialog" onClick={() => setBankOpen(true)}>
        <img src={heartUp.url} alt="" className="original-heart-image original-button-up" />
        <img src={heartDown.url} alt="" className="original-heart-image original-button-down" />
      </Button>
      <span className="original-heart-count" aria-label="Kalp bakiyesi" title={account.hearts === null ? "Oyuncu hesabı bağlı değil" : "Kalp bakiyesi"}>{account.hearts ?? "—"}</span>
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
        ) : icon.kind === "settings" ? (
          <Button key={icon.label} type="button" variant="ghost" className="original-header-button original-icon-default"
            aria-label={icon.label} title={icon.label} aria-haspopup="dialog" onClick={() => setSettingsOpen(true)}>
            <img src={backgroundUp.url} alt="" className="original-button-background original-button-up" />
            <img src={backgroundDown.url} alt="" className="original-button-background original-button-down" />
            <img src={settings.url} alt="" className="original-button-icon" />
          </Button>
        ) : <OriginalIcon key={icon.label} {...icon} onClick={() => void clickIcon(icon)} />)}
      </div>
      <OriginalIcon asset={changeTable} label="Masa değiştir" kind="default" disabled={changing} onClick={() => void changeRoom()} />
      <TableFeatureDialog feature={feature} onClose={() => setFeature(null)} />
      <OriginalMiscMenu open={menuOpen} triggerRef={menuTriggerRef} onClose={closeMenu} onSelect={onMenuSelect} />
      <DecorSelection open={decorOpen} onClose={closeDecor} />
      <BottleSelection open={bottleOpen} onClose={closeBottle} />
      <SettingsDialog open={settingsOpen} onClose={closeSettings} />
      <BankDialog open={bankOpen} onClose={closeBank} isVip={false} />
    </div>
  );
}