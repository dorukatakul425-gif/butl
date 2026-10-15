import { Fragment, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SourceFeaturePopup } from '@/components/table/source-feature-popup';
import { translate, type CilizAssets } from '@/lib/ciliz-assets';
import { useSourceFeatureSession } from '@/lib/source-feature-session';
import { useAuth, refreshProfile } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { DEFAULT_PHOTO } from '@/lib/ciliz-default-photo';

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

const ageToBirthday = (age: number | null | undefined) => age ? `${new Date().getFullYear() - age}-01-01` : '';
const birthdayToAge = (b: string) => {
  if (!b) return null;
  const d = new Date(b), n = new Date();
  let a = n.getFullYear() - d.getFullYear();
  if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--;
  return a;
};

/** Original "Profil ayarları" dialog, saved to the signed-in player's own account (RLS: own row only). */
export function SourceProfileSettings({ assets, name, photo, onClose }: { assets: CilizAssets; name: string; photo: string; onClose: () => void }) {
  const t = (k: string) => translate(assets, k);
  const auth = useAuth();
  const p = auth.profile;
  const [form, setForm] = useState({ name: p?.name ?? name, birthday: ageToBirthday(p?.age), male: p?.male ?? false });
  const [photoUrl, setPhotoUrl] = useState<string>(p?.photo_url || photo);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setNotice('');
    try { await fn(); } catch (e) { setNotice(e instanceof Error ? e.message : 'İşlem tamamlanamadı.'); } finally { setBusy(false); }
  };
  const sb = () => { const c = getSupabase(); if (!c || !p) throw new Error('Oturum bulunamadı, tekrar giriş yapın.'); return c; };
  const upload = (file: File) => run(async () => {
    if (!file.type.startsWith('image/')) throw new Error('Yalnız resim dosyası seçin.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Resim 5 MB’den küçük olmalı.');
    const c = sb();
    const path = `${p!.id}/${Date.now()}.${file.name.split('.').pop() || 'jpg'}`;
    const up = await c.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
    if (up.error) throw new Error('Fotoğraf yüklenemedi.');
    const { data: signed } = await c.storage.from('avatars').createSignedUrl(path, 60 * 60 * 24 * 365);
    if (!signed?.signedUrl) throw new Error('Fotoğraf yüklenemedi.');
    const { error } = await c.from('profiles').update({ photo_url: signed.signedUrl }).eq('id', p!.id);
    if (error) throw new Error('Fotoğraf kaydedilemedi.');
    setPhotoUrl(signed.signedUrl); await refreshProfile();
  });
  const resetPhoto = () => run(async () => {
    const { error } = await sb().from('profiles').update({ photo_url: null }).eq('id', p!.id);
    if (error) throw new Error('Fotoğraf sıfırlanamadı.');
    setPhotoUrl(DEFAULT_PHOTO); await refreshProfile();
  });
  const save = () => run(async () => {
    const c = sb();
    const age = birthdayToAge(form.birthday);
    if (age !== null && (age < 14 || age > 99)) throw new Error('Geçerli bir doğum tarihi girin.');
    if (form.male !== p!.male) {
      const { data: seat } = await c.from('room_players').select('room_id').eq('user_id', p!.id).maybeSingle();
      if (seat) throw new Error('Cinsiyet masadayken değiştirilemez. Önce masadan çıkın.');
    }
    const { error } = await c.from('profiles').update({ name: form.name.trim().slice(0, 30), male: form.male, age }).eq('id', p!.id);
    if (error) throw new Error('Profil kaydedilemedi.');
    await refreshProfile(); onClose();
  });
  return <SourceFeaturePopup title={t('dlg:profile_info:title')} onClose={onClose} className="source-profile-settings">
    <div className="source-profile-settings__photo"><img src={photoUrl || DEFAULT_PHOTO} alt={form.name} /></div>
    <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void upload(f); }} />
    <div className="source-profile-settings__photo-buttons">
      <Button variant="secondary" disabled={busy || !p} onClick={() => fileRef.current?.click()}>{t('dlg:profile_info:photo')}</Button>
      <Button variant="ghost" disabled={busy || !p || !p.photo_url} onClick={() => void resetPhoto()}>{t('dlg:profile_info:reset_photo')}</Button>
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
    {notice && <p role="status" className="profile-notice">{notice}</p>}
    <div className="popup__buttons popup__buttons--center">
      <Button variant="ghost" onClick={onClose}>{t('dlg:profile_info:cancel')}</Button>
      <Button className="button--confirm" disabled={busy || !p || !form.name.trim()} onClick={() => void save()}>{t('dlg:profile_info:save')}</Button>
    </div>
  </SourceFeaturePopup>;
}
