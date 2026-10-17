import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { loadCilizAssets, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { setSfxVolume, useSfxVolume } from "@/lib/sfx";
import { setMusicVolume, useMusicSession } from "@/lib/music-session";
import { VIEWER_STORE } from "@/lib/viewer";
import { executeSourceFeature, useSourceFeatureSession } from '@/lib/source-feature-session';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { showSourceToast, SourceInfoDialog } from '@/components/source-dialogs';
import { SourceSettingsChild } from './source-settings-children';
import { buildContactItems, buildSettingsItems, idCopyValue, type SettingsItem } from './settings-items';

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

/** SettingsDialog_Items "simple" and "link" (window opener): the dialog closes, then the action runs. */
function Simple({ item, close }: { item: Extract<SettingsItem, { type: "simple" | "link" }>; close: () => void }) {
  return (
    <>
      {item.border === "top" && <div className={cls("border")} />}
      <Button variant="ghost" className={cls("item", ["selectable"])} onClick={() => {
        close();
        if (item.type === "link") window.open(item.href, "_blank", "noopener"); else item.action();
      }}>
        <div className={cls("icon", [item.icon])} />
        <div className={cls("item-name")}>{item.name}</div>
      </Button>
    </>
  );
}

function SettingsPopup({ title, items, phase, onClose, info, sliders }: {
  title: string; items: SettingsItem[]; phase: "show" | "hide" | null; onClose: () => void;
  info?: { icons: string[]; id: string; onCopy: () => void };
  sliders?: { sfx: number; music: number };
}) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose]);
  return createPortal(
    <div className="source-settings-layer">
      <div className="popup__dialog-manager">
        <div className="popup-shade" onClick={onClose} />
        <div role="dialog" aria-modal aria-label={title}
          className={["popup", "popup--center", phase === "show" && "popup--show", phase === "hide" && "popup--hide"].filter(Boolean).join(" ")}>
          <div className={popup("header")}>
            <div className={popup("title")}>{title}</div>
            <Button variant="ghost" className={popup("close", ["dlg"])} aria-label="Kapat" onClick={onClose}>
              <div className={popup("close-icon")} />
            </Button>
          </div>
          <div className={`${popup("content", ["center"])} ${cls("x_popup__content")}`}>
            <div className={cls("")}>
              {items.map((item) => item.type === "slider"
                ? <Slider key={item.icon} icon={item.icon} name={item.name} value={item.icon === "sound" ? sliders?.sfx ?? 0 : sliders?.music ?? 0} onChange={item.onChange} />
                : item.type === 'checkbox' ? <div className={cls('checkbox-item')} key={item.icon}><div className={cls('checkbox-title')}><div className={cls('icon', [item.icon])} /><span className={cls('item-name')}>{item.name}</span></div><Switch aria-label={item.name} checked={item.enabled} disabled={item.busy} onCheckedChange={item.onChange} /></div>
                : <Simple key={item.icon + item.name} item={item} close={onClose} />)}
              {info && (
                <div className={cls("info")} style={{ position: "relative", cursor: "pointer" }} onClick={info.onCopy}>
                  {info.icons.filter(Boolean).map((icon) => <div key={icon} className={cls("icon", [icon])} />)}
                  <div className={cls("id")}>{info.id}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type View = "settings" | "contacts" | "report" | "profile" | null;

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const session = useSourceFeatureSession();
  const [view, setView] = useState<View>(null);
  const [savingLeague, setSavingLeague] = useState(false);
  const [assets, setAssets] = useState<CilizAssets | null>(null);
  const { mounted, phase } = usePopupPhase(open);
  const sfxVolume = useSfxVolume();
  const music = useMusicSession();
  useEffect(() => { if (open) setView("settings"); }, [open]);
  useEffect(() => {
    if (open && !assets) loadCilizAssets().then(setAssets).catch(() => undefined);
  }, [open, assets]);
  if (!assets || (!mounted && view === "settings") || !view) return null;
  const t = (key: string) => translate(assets, key);
  const platform = "html5";
  const social: string = VIEWER_STORE.social;
  const viewerId = session.viewerId ?? undefined;
  // Closing a child dialog does not reopen settings, as in the original presenter flow.
  const finish = () => { setView(null); onClose(); };

  if (view === "contacts") {
    return <SettingsPopup title={t("dlg:settings:contacts")} phase="show" onClose={finish}
      items={buildContactItems(t, { social, platform, viewerId, onReport: () => setView("report") })} />;
  }
  if (view === "profile") return <SourceSettingsChild kind="profile" assets={assets} onClose={finish} />;
  if (view === "report") {
    return <SourceInfoDialog title={t("dlg:settings:console_report:title")} context={t("dlg:settings:console_report:context")} onClose={finish}
      cancel={{ title: t("dlg:report_issue:cancel"), onClick: finish }}
      confirm={{ title: t("android:dlg:feedback:send"), onClick: () => {
        finish();
        executeSourceFeature("feedback").then(r => showSourceToast(r.confirmed ? t("dlg:settings:console_report:sent") : r.message ?? t("dlg:music:unavailable")))
          .catch((e: unknown) => showSourceToast(e instanceof Error ? e.message : t("dlg:music:unavailable")));
      } }} />;
  }

  const items = buildSettingsItems(t, {
    league: { enabled: session.leagueParticipation === true, busy: savingLeague || session.leagueParticipation === undefined, onChange: async enabled => {
      if (savingLeague) return;
      setSavingLeague(true);
      try { const result = await executeSourceFeature('league-settings', { enabled: enabled ? 1 : 0 }); if (!result.confirmed) showSourceToast(result.message ?? 'Lig seçimi kaydedilemedi.'); }
      catch { showSourceToast('Lig seçimi kaydedilemedi.'); }
      finally { setSavingLeague(false); }
    } },
    onSfx: setSfxVolume,
    onMusic: setMusicVolume,
    onInvite: () => {
      // TGSocial.createInviter: native Telegram share sheet (t.me/share/url).
      executeSourceFeature("invite").then(r => {
        const url = r.inviteUrl ?? window.location.origin;
        const share = `https://t.me/share/url?${new URLSearchParams({ url, text: t("dlg:tg:share:text:ab_20240708:c:v2") })}`;
        const tg = (window as unknown as { Telegram?: { WebApp?: { openTelegramLink?: (u: string) => void } } }).Telegram?.WebApp;
        if (tg?.openTelegramLink) tg.openTelegramLink(share); else window.open(share, "_blank", "noopener");
      }).catch(() => showSourceToast(t("dlg:settings:nofriends_toast")));
    },
    onProfile: () => setView("profile"),
    onContacts: () => setView("contacts"),
  });
  const copyId = async () => {
    const value = idCopyValue(platform, social, viewerId);
    try { await navigator.clipboard.writeText(value); showSourceToast(t("dlg:settings:id_toast")); } catch { showSourceToast(value); }
  };
  return <SettingsPopup title={t("ios:dlg:settings:title")} phase={phase} onClose={finish} items={items}
    sliders={{ sfx: sfxVolume, music: music.muted ? 0 : music.volume }}
    info={{ icons: [platform], id: viewerId ?? "", onCopy: copyId }} />;
}
