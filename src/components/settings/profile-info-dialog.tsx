import { gameError } from '@/lib/game-language';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { translate, type CilizAssets } from '@/lib/ciliz-assets';
import { executeSourceFeature, useSourceFeatureSession } from '@/lib/source-feature-session';
import { prepareProfilePhoto } from '@/lib/profile-edit';
import { DEFAULT_PHOTO } from '@/lib/ciliz-default-photo';
import { SourceFeaturePopup } from '@/components/table/source-feature-popup';

function rich(text: string) { return text.split(/(<b>.*?<\/b>)/g).map((part,i) => { const b=/^<b>(.*?)<\/b>$/.exec(part); return <Fragment key={i}>{b ? <b>{b[1]}</b> : part.replace(/<[^>]*>/g,'')}</Fragment>; }); }
function dateBound(age: number) { const d = new Date(); d.setFullYear(d.getFullYear()-age); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function ProfileInfoDialog({ assets, onClose }: { assets: CilizAssets; onClose: () => void }) {
  const session = useSourceFeatureSession(), profile = session.profile;
  const [birthday, setBirthday] = useState(profile?.birthday ?? '');
  const [male, setMale] = useState(profile?.male ?? true);
  const [photo, setPhoto] = useState(profile?.photo ?? '');
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const initialized = useRef(false), fileRef = useRef<HTMLInputElement>(null);
  const t = (key: string) => translate(assets, key);
  useEffect(() => {
    let active = true;
    void executeSourceFeature('profile-refresh').then(r => { if (active && !r.confirmed) setMessage((r.message ? gameError(r.message) : undefined) ?? t('dlg:music:unavailable')); }).catch(e => { if (active) setMessage(gameError(e)); });
    return () => { active = false; };
  }, []);
  useEffect(() => { if (profile && !initialized.current) { initialized.current = true; setBirthday(profile.birthday); setMale(profile.male); setPhoto(profile.photo ?? ''); } }, [profile]);
  const infoChanged = !!profile && (birthday !== profile.birthday || male !== profile.male);
  const photoChanged = !!profile && photo !== (profile.photo ?? '');
  const save = async () => {
    if (!profile || busy) return; setBusy(true); setMessage('');
    try {
      // Original photo action is independent and never charges/consumes the free info edit.
      if (photoChanged) { const r = await executeSourceFeature('save-profile-photo', { photo }); if (!r.confirmed) throw new Error(r.message ?? 'Şəkil yadda saxlanılmadı.'); }
      if (infoChanged) { const r = await executeSourceFeature('save-profile', { birthday, male: male ? 1 : 0, expectedPrice: profile.changePrice ?? -1, expectedBirthday: profile.birthday, expectedMale: profile.male ? 1 : 0 }); if (!r.confirmed) throw new Error(r.message ?? 'Profil yadda saxlanılmadı.'); }
      onClose();
    } catch (e) { setMessage(gameError(e)); }
    finally { setBusy(false); }
  };
  const footer = <div className="popup__buttons"><Button variant="ghost" className="button button--cancel" disabled={busy} onClick={onClose}>{t('dlg:profile_info:cancel')}</Button><Button variant="ghost" className="button button--confirm" disabled={busy || !profile || (!infoChanged && !photoChanged) || (infoChanged && (!birthday || birthday < dateBound(98) || birthday > dateBound(18) || profile.changePrice === undefined))} onClick={() => void save()}>{t('dlg:profile_info:save')}</Button></div>;
  return <SourceFeaturePopup title={t('dlg:profile_info:title')} onClose={busy ? () => {} : onClose} className="profile-info__x_popup source-profile-info-popup popup--show" contentClass="profile-info__x_popup__content" manualClass="" footer={footer}>
    <div className="profile-info">
      <div className="profile-info__profile">
        <Button variant="ghost" className="profile-info__photo" aria-label={t('dlg:profile_info:photo')} disabled={busy || !profile} onClick={() => fileRef.current?.click()}><img src={photo || DEFAULT_PHOTO} alt="" /></Button>
        <Button variant="ghost" className={`profile-info__add-photo profile-info__add-photo--${photo ? 'reset' : 'add'}`} aria-label={t(photo ? 'dlg:profile_info:reset_photo' : 'dlg:profile_info:photo')} disabled={busy || !profile} onClick={() => photo ? setPhoto('') : fileRef.current?.click()} />
        <input ref={fileRef} type="file" accept="image/*" className="profile-info__photo-input" onChange={async e => { const file=e.target.files?.[0]; e.target.value=''; if (!file) return; setBusy(true); try { setPhoto(await prepareProfilePhoto(file)); } catch (e) { setMessage(gameError(e)); } finally { setBusy(false); } }} />
        <div className="profile-info__add-photo-title">{t(photo ? 'dlg:profile_info:reset_photo' : 'dlg:profile_info:photo')}</div>
      </div>
      <div className="profile-info__info">
        <label className="profile-info__name"><span className="profile-info__info-title">{t('dlg:profile_info:name')}:</span><input aria-label={t('dlg:profile_info:name')} value={profile?.name ?? ''} maxLength={50} readOnly required /></label>
        <label className="profile-info__date"><span className="profile-info__info-title">{t('dlg:profile_info:date')}:</span><input aria-label={t('dlg:profile_info:date')} type="date" value={birthday} min={dateBound(98)} max={dateBound(18)} disabled={busy || !profile} required onChange={e => { const v=e.target.value; setBirthday(v ? (v < dateBound(98) ? dateBound(98) : v > dateBound(18) ? dateBound(18) : v) : ''); }} /></label>
        <div className="profile-info__gender"><div className="profile-info__info-title">{t('dlg:profile_info:gender')}:</div><div className="profile-info__gender-items"><Button variant="ghost" aria-label="Kişi" aria-pressed={male} disabled={busy || !profile} className={`profile-info__gender-item profile-info__gender-item--male${male ? '' : ' profile-info__gender-item--inactive'}`} onClick={() => setMale(true)} /><Button variant="ghost" aria-label="Qadın" aria-pressed={!male} disabled={busy || !profile} className={`profile-info__gender-item profile-info__gender-item--female${male ? ' profile-info__gender-item--inactive' : ''}`} onClick={() => setMale(false)} /></div></div>
      </div>
    </div>
    {infoChanged && profile?.changePrice !== undefined && <div className="profile-info__description">{rich(t(profile.changePrice === 0 ? 'dlg:profile_info:warning:tg' : 'dlg:profile_info:description'))}{profile.changePrice > 0 && <span className="profile-info__heart">{profile.changePrice}</span>}</div>}
    {message && <div className="source-feature-message" role="status">{message}</div>}
  </SourceFeaturePopup>;
}
