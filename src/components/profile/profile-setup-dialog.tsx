import "@/styles/ciliz-profile-setup.css";
import { useEffect, useState } from "react";
import { loadCilizAssets, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { getSupabase } from "@/lib/supabase";
import { refreshProfile } from "@/lib/auth";
import { showSourceToast, SourceToastHost } from "@/components/source-dialogs";

export const SETUP_AGE_FROM = 18;
export const SETUP_AGE_TO = 90;

/** ProfileSettingsDialog validation 'male' (TGPresenter): gender is required, age is optional. */
export function setupProblem(male: boolean | undefined): "male" | null {
  return male === undefined ? "male" : null;
}

/**
 * Telegram build first entry (TGPresenter.showProfileRegistration): green screen with
 * "Profil" dialog, gender tiles and an 18–90 age dropdown. Saved through complete_profile_setup.
 */
export function ProfileSetupDialog({ onDone }: { onDone: () => void }) {
  const [assets, setAssets] = useState<CilizAssets | null>(null);
  const [male, setMale] = useState<boolean | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => { void loadCilizAssets().then(setAssets).catch(() => setAssets(null)); }, []);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  const t = (k: string, fallback: string) => {
    const v = assets ? translate(assets, k) : k;
    return v === k ? fallback : v;
  };
  const valid = setupProblem(male) === null;
  const save = async () => {
    if (saving) return;
    if (!valid) { showSourceToast(t("dlg:profile_settings_tg:toast_setsex", "Cinsiyet seçmelisiniz")); return; }
    const sb = getSupabase();
    if (!sb) return;
    setSaving(true);
    const { error } = await sb.rpc("complete_profile_setup", { p_male: male, p_age: age ?? null });
    if (error) { setSaving(false); showSourceToast(error.message); return; }
    await refreshProfile();
    onDone();
  };
  const ages = Array.from({ length: SETUP_AGE_TO - SETUP_AGE_FROM + 1 }, (_, i) => SETUP_AGE_FROM + i);
  const option = (a?: number) => (
    <div key={a ?? "none"} role="option" aria-selected={a === age}
      className={`profile-settings__custom-option${a === age ? " profile-settings__custom-option--selected" : ""}`}
      onClick={() => { setAge(a); setOpen(false); }}>
      {a ?? "--"}<div className="profile-settings__selected-icon" />
    </div>
  );
  const title = t("dlg:profile_info:title", "Profil");
  return (
    <div className="profile-setup-screen">
      <div className="popup__dialog-manager">
        <div className="popup-shade" />
        <div role="dialog" aria-modal="true" aria-label={title} className="popup popup--center popup--show profile-settings__x_popup">
          <div className="popup__header"><div className="popup__title">{title}</div></div>
          <div className="popup__content profile-settings__x_popup__content">
            <div className="profile-settings__description">{t("dlg:profile_settings_tg:text", "Kendinizden bahsedin. Masada eşleştirme açısından bu bilgi gereklidir.")}</div>
            <div className="profile-settings__item">
              <div className="profile-settings__gender-title">{t("dlg:profile_settings_tg:gender", "Cinsiyet:")}</div>
              <div className="profile-settings__gender-items" role="radiogroup">
                <div role="radio" aria-checked={male === true} aria-label={t("dlg:gender:male", "Erkek")}
                  className={`profile-settings__gender-item profile-settings__gender-item--male${male ? "" : " profile-settings__gender-item--inactive"}`}
                  onClick={() => setMale(true)} />
                <div role="radio" aria-checked={male === false} aria-label={t("dlg:gender:female", "Kadın")}
                  className={`profile-settings__gender-item profile-settings__gender-item--female${male === false ? "" : " profile-settings__gender-item--inactive"}`}
                  onClick={() => setMale(false)} />
              </div>
            </div>
            <div className="profile-settings__item">
              <div className="profile-settings__age-title">{t("dlg:profile_settings_tg:age", "Yaş:")}</div>
              <div className={`profile-settings__custom-select ${open ? "opened" : ""}`}>
                <div className="profile-settings__custom-select-trigger" role="button" aria-haspopup="listbox"
                  onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>{age ?? "--"}</div>
                <div className="profile-settings__custom-options" role="listbox" onClick={(e) => e.stopPropagation()}>
                  {option()}{ages.map(option)}
                </div>
              </div>
            </div>
          </div>
          <div className="popup__buttons popup__buttons--center">
            <div role="button" className={`button button--confirm${valid ? "" : " profile-settings__x_button--disabled"}`} onClick={() => void save()}>
              {t("dlg:profile_settings_tg:continue", "Devam et")}
            </div>
          </div>
        </div>
      </div>
      <SourceToastHost />
    </div>
  );
}
