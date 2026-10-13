import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { loadCilizAssets, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { setSfxVolume, useSfxVolume } from "@/lib/sfx";
import { setMusicVolume, useMusicSession } from "@/lib/music-session";
import { VIEWER_STORE } from "@/lib/viewer";
import { useSourceFeatureSession } from '@/lib/source-feature-session';
import { SourceSettingsChild } from './source-settings-children';
import { Button } from '@/components/ui/button';

// Markup and class names ported from SettingsDialog.tsx + SettingsPresenter.ts
// (Dialog.Header / Dialog.Content, popup--center + popup--show/--hide animation).
const bem = (block: string) => (element = "", mods: Array<string | false | undefined> = []) => {
  const base = element ? `${block}__${element}` : block;
  return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
const cls = bem("settings");
const popup = bem("popup");

function usePopupPhase(open: boolean) {
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<"show" | "hide" | null>(null);
  useEffect(() => {
    if (open) {
      setMounted(true);
      setPhase("show");
      const id = window.setTimeout(() => setPhase(null), 300);
      return () => window.clearTimeout(id);
    }
    if (!mounted) return;
    setPhase("hide");
    const id = window.setTimeout(() => { setMounted(false); setPhase(null); }, 100);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return { mounted, phase };
}

function Slider({ icon, name, value, onChange }: { icon: string; name: string; value: number; onChange: (v: number) => void }) {
  const percent = value * 100;
  return (
    <div className={cls("checkbox-item")}>
      <div className={cls("checkbox-title")}>
        <div className={cls("icon", [icon])} />
        <div className={cls("item-name")}>{name}</div>
      </div>
      <input
        className={cls("slider")} type="range" min={0} max={1} step={0.01} value={value} aria-label={name}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--source-tops-confirm) ${percent}%, var(--game-menu-pressed) ${percent}%)` }}
      />
    </div>
  );
}

function Simple({ icon, name, border, onClick }: { icon: string; name: string; border?: "top"; onClick: () => void }) {
  return (
    <>
      {border === "top" && <div className={cls("border")} />}
      <Button variant="ghost" className={cls("item", ["selectable"])} onClick={onClick}>
        <div className={cls("icon", [icon])} />
        <div className={cls("item-name")}>{name}</div>
      </Button>
    </>
  );
}

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const session = useSourceFeatureSession();
  const [child, setChild] = useState<string | null>(null);
  const [assets, setAssets] = useState<CilizAssets | null>(null);
  const { mounted, phase } = usePopupPhase(open);
  const sfxVolume = useSfxVolume();
  const music = useMusicSession();
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (open && !assets) loadCilizAssets().then(setAssets).catch(() => undefined);
  }, [open, assets]);
  useEffect(() => {
    if (!open || child) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, onClose, child]);
  if (!mounted || !assets) return null;
  const t = (key: string) => translate(assets, key);
  const platform: string = VIEWER_STORE.social;
  const viewerId = session.viewerId ?? '—';
  const icons = platform === "android" ? ["android", "html5"] : [platform];

  const copyId = async () => {
    const value = [platform, viewerId].filter(Boolean).join(":");
    try { await navigator.clipboard.writeText(value); } catch { return; }
    setToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 1500);
  };

  return createPortal(
    <div className="source-settings-layer">
      <div className="popup__dialog-manager">
        <div className="popup-shade" onClick={onClose} />
        <div role="dialog" aria-modal={!child} inert={Boolean(child)} aria-label={t("ios:dlg:settings:title")}
          className={["popup", "popup--center", phase === "show" && "popup--show", phase === "hide" && "popup--hide"].filter(Boolean).join(" ")}>
          <div className={popup("header")}>
            <div className={popup("title")}>{t("ios:dlg:settings:title")}</div>
            <Button variant="ghost" className={popup("close", ["dlg"])} aria-label="Kapat" onClick={onClose}>
              <div className={popup("close-icon")} />
            </Button>
          </div>
          <div className={`${popup("content", ["center"])} ${cls("x_popup__content")}`}>
            <div className={cls("")}>
              <Slider icon="sound" name={t("ios:dlg:settings:sounds")} value={sfxVolume} onChange={setSfxVolume} />
              <Slider icon="music" name={t("ios:dlg:settings:music")} value={music.muted ? 0 : music.volume} onChange={setMusicVolume} />
              <Simple icon="invite" name={t("bank:invite:btn")} border="top" onClick={() => setChild('invite')} />
              <Simple icon="profile-info" name={t("dlg:profile_info:title")} onClick={() => setChild('profile')} />
              <Simple icon="feedback" name={t("dlg:settings:contacts")} onClick={() => setChild('contacts')} />
              <div className={cls("info")} style={{ position: "relative", cursor: "pointer" }} onClick={copyId}>
                {icons.filter(Boolean).map((icon) => <div key={icon} className={cls("icon", [icon])} />)}
                <div className={cls("id")}>{toast ? t("dlg:settings:id_toast") : viewerId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {child && <SourceSettingsChild key={child} kind={child} assets={assets} onClose={() => setChild(null)} />}
    </div>,
    document.body,
  );
}
