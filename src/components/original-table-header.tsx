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

function OriginalIcon({ asset, label, kind }: (typeof middleIcons)[number]) {
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [decorOpen, setDecorOpen] = useState(false);
  const [bottleOpen, setBottleOpen] = useState(false);
  const closeBottle = useCallback(() => setBottleOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeDecor = useCallback(() => setDecorOpen(false), []);
  // MiscMenuPresenter: "Stil" -> DecorSelectionPresenter.show()
  const onMenuSelect = useCallback((id: string) => {
    if (id === "decor") setDecorOpen(true);
    if (id === "bottle") setBottleOpen(true);
  }, []);
  return (
    <div className="original-table-header" aria-label="Orijinal üst masa ikonları">
      <Button asChild variant="ghost" className="original-header-button original-heart-button">
        <a href={heartUp.url} target="_blank" rel="noreferrer" aria-label="Kalp orijinal görseli" title="Kalp">
          <img src={heartUp.url} alt="Kalp" className="original-heart-image original-button-up" />
          <img src={heartDown.url} alt="" className="original-heart-image original-button-down" />
        </a>
      </Button>
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
        ) : <OriginalIcon key={icon.label} {...icon} />)}
      </div>
      <OriginalIcon asset={changeTable} label="Masa değiştir" kind="default" />
      <OriginalMiscMenu open={menuOpen} triggerRef={menuTriggerRef} onClose={closeMenu} onSelect={onMenuSelect} />
      <DecorSelection open={decorOpen} onClose={closeDecor} />
      <BottleSelection open={bottleOpen} onClose={closeBottle} />
    </div>
  );
}