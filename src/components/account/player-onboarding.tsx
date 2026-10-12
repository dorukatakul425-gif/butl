import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useCloudAccount } from '@/lib/cloud-account';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { translate } from '@/lib/ciliz-assets';
import maleIcon from '@/assets/source-gender-male.svg';
import femaleIcon from '@/assets/source-gender-female.svg';

export function PlayerOnboarding() {
  const { refresh } = useCloudAccount();
  const assets = useCilizAssets();
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [step, setStep] = useState<'gender' | 'age'>('gender');
  const [age, setAge] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const choose = (value: 'male' | 'female') => { if (busy) return; setGender(value); setBusy(true); window.setTimeout(() => { setStep('age'); setBusy(false); }, 500); };
  const save = async () => {
    if (!gender || !age || busy) return;
    setBusy(true); setError('');
    try { const { error } = await supabase.rpc('complete_player_onboarding', { selected_gender: gender, selected_age: Number(age) }); if (error) throw error; await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Seçim kaydedilemedi.'); setBusy(false); }
  };
  const text = (key: string, fallback: string) => assets ? translate(assets, key) : fallback;
  return <main className="onboarding-page"><section className="onboarding-popup" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
    <h1 id="onboarding-title">{step === 'gender' ? text('dlg:gender:title', 'Cinsiyetiniz') : 'Yaşınız'}</h1>
    {step === 'gender' ? <><div className="onboarding-genders">{(['male', 'female'] as const).map(value => <div className={`onboarding-gender ${value} ${gender === value ? 'active' : ''}`} key={value}><Button variant="ghost" className="onboarding-gender-button" aria-label={value === 'male' ? 'Erkek' : 'Kadın'} disabled={busy} aria-pressed={gender === value} onClick={() => choose(value)}><img src={value === 'male' ? maleIcon : femaleIcon} alt="" width={value === 'male' ? 44 : 51} height={50} /></Button><span>{text(`dlg:gender:${value}`, value === 'male' ? 'Erkek' : 'Kadın')}</span></div>)}</div><p className="onboarding-context">{text('dlg:gender:ctx', 'Partner bulmanız önemli')}</p></> : <div className="onboarding-age"><label htmlFor="player-age">Yaşınız</label><Select value={age} onValueChange={setAge}><SelectTrigger id="player-age" aria-label="Yaşınız"><SelectValue placeholder="Yaş seçin" /></SelectTrigger><SelectContent>{Array.from({ length:81 }, (_,i) => String(i+18)).map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select><Button className="onboarding-save" disabled={!age || busy} onClick={() => void save()}>{busy ? 'Kaydediliyor…' : 'Devam et'}</Button><Button variant="link" disabled={busy} onClick={() => setStep('gender')}>Geri</Button></div>}
    {error && <p role="alert" className="onboarding-error">{error}</p>}
  </section></main>;
}