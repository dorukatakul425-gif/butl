import { Fragment, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SourceFeaturePopup } from '@/components/table/source-feature-popup';
import { translate, type CilizAssets } from '@/lib/ciliz-assets';
import { executeSourceFeature, useSourceFeatureSession } from '@/lib/source-feature-session';

/** Source league index of "Demir Lig" (wood, rock, iron…) that unlocks the profile frame. */
export const IRON_LEAGUE_INDEX = 2;

/** Renders source <b> markup safely, dropping any other tags. */
export function sourceRich(text: string): ReactNode {
  return text.split(/(<b>.*?<\/b>)/g).map((part, i) => {
    const bold = /^<b>(.*)<\/b>$/.exec(part);
    return <Fragment key={i}>{bold ? <b>{bold[1]}</b> : part.replace(/<[^>]+>/g, '')}</Fragment>;
  });
}

export function useFrameUnlocked() {
  const session = useSourceFeatureSession();
  return (session.league?.level ?? -1) >= IRON_LEAGUE_INDEX;
}

/** Original locked-feature popup ("Gerektirir" + reason + "Devam et"). */
export function SourceLockedPopup({ assets, title, desc, onClose }: { assets: CilizAssets; title: string; desc: string; onClose: () => void }) {
  const t = (k: string) => translate(assets, k);
  return <SourceFeaturePopup title={title} onClose={onClose} className="source-profile-locked">
    <div className="source-profile-locked__icon" aria-hidden />
    <p className="source-profile-locked__desc">{sourceRich(desc)}</p>
    <div className="popup__buttons popup__buttons--center"><Button className="button--confirm" onClick={onClose}>{t('dlg:league_locked_gift:btn')}</Button></div>
  </SourceFeaturePopup>;
}

/** Original "Profil ayarları" dialog; saving only succeeds through the authenticated host session. */
export function SourceProfileSettings({ assets, name, photo, onClose }: { assets: CilizAssets; name: string; photo: string; onClose: () => void }) {
  const t = (k: string) => translate(assets, k);
  const session = useSourceFeatureSession();
  const p = session.profile;
  const [form, setForm] = useState({ name: p?.name ?? name, birthday: p?.birthday ?? '', male: p?.male ?? false });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const price = p?.changePrice;
  const save = async () => {
    setBusy(true); setNotice('');
    try {
      const r = await executeSourceFeature('save-profile', { name: form.name.trim(), birthday: form.birthday, male: form.male ? 1 : 0 });
      if (r.confirmed) onClose(); else setNotice(r.message ?? 'İşlem tamamlanamadı.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'İşlem tamamlanamadı.'); } finally { setBusy(false); }
  };
  return <SourceFeaturePopup title={t('dlg:profile_info:title')} onClose={onClose} className="source-profile-settings">
    <div className="source-profile-settings__photo"><img src={p?.photo ?? photo} alt={form.name} /></div>
    <div className="source-profile-settings__photo-buttons">
      <Button variant="secondary" disabled={!session.viewerId} onClick={() => setNotice('Oyuncu hesabı bağlı değil.')}>{t('dlg:profile_info:photo')}</Button>
      <Button variant="ghost" disabled={!session.viewerId}>{t('dlg:profile_info:reset_photo')}</Button>
    </div>
    <label className="source-profile-settings__field"><span>{t('dlg:profile_info:name')}</span><input value={form.name} maxLength={30} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
    <div className="source-profile-settings__field"><span>{t('dlg:profile_info:gender')}</span>
      <div className="source-profile-settings__gender" role="radiogroup" aria-label={t('dlg:profile_info:gender')}>
        <button type="button" role="radio" aria-checked={!form.male} aria-label="Kadın" className="source-profile-settings__gender-btn source-profile-settings__gender-btn--female" onClick={() => setForm({ ...form, male: false })} />
        <button type="button" role="radio" aria-checked={form.male} aria-label="Erkek" className="source-profile-settings__gender-btn source-profile-settings__gender-btn--male" onClick={() => setForm({ ...form, male: true })} />
      </div>
    </div>
    <label className="source-profile-settings__field"><span>{t('dlg:profile_info:date')}</span><input type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} /></label>
    <p className="source-profile-settings__warning">{sourceRich(t('dlg:profile_info:warning'))}</p>
    <p className="source-profile-settings__cost">{t('dlg:profile_info:description')} ❤️{price ?? '—'}</p>
    {notice && <p role="status" className="profile-notice">{notice}</p>}
    <div className="popup__buttons popup__buttons--center">
      <Button variant="ghost" onClick={onClose}>{t('dlg:profile_info:cancel')}</Button>
      <Button className="button--confirm" disabled={busy || !session.viewerId || !form.name.trim()} onClick={save}>{t('dlg:profile_info:save')}</Button>
    </div>
  </SourceFeaturePopup>;
}
