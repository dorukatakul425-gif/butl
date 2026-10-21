import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SourceFeaturePopup } from './source-feature-popup';
import { executeSourceFeature } from '@/lib/source-feature-session';
import { tableRpc, type OwnedTableInfo } from '@/lib/owned-tables';
import { refreshProfile } from '@/lib/auth';
import { gameError } from '@/lib/game-language';
export function OwnedTableDialog({ onClose, onJoined }: { onClose: () => void; onJoined: () => void }) {
  const [info, setInfo] = useState<OwnedTableInfo | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [number, setNumber] = useState(''), [name, setName] = useState(''), [password, setPassword] = useState(''), [remove, setRemove] = useState(false), [deleting, setDeleting] = useState(false);
  const accept = (next: OwnedTableInfo) => { setInfo(next); setNumber(next.number == null ? '' : String(next.number)); setName(next.name ?? ''); setPassword(''); setRemove(false); };
  useEffect(() => { let active = true; tableRpc<OwnedTableInfo>('my_table_info').then(i => { if (active) accept(i); }).catch(e => { if (active) setError(gameError(e)); }); return () => { active = false; }; }, []);
  const credit = info?.credit_until ? new Date(info.credit_until).getTime() > Date.now() : false;
  const join = async (id: number) => { const result = await executeSourceFeature('change-table', { tableId: id }); if (!result.confirmed) throw new Error(result.message ?? 'Masaya qoşulmaq olmadı.'); onJoined(); };
  const run = async (kind: 'create' | 'edit' | 'delete' | 'join') => {
    if (busy || !info) return; setBusy(true); setError('');
    try {
      if (kind === 'join' && info.room_id != null) { await join(info.room_id); return; }
      const next = kind === 'delete' ? await tableRpc<OwnedTableInfo>('delete_owned_table') : kind === 'edit'
        ? await tableRpc<OwnedTableInfo>('edit_owned_table', { p_number: number === '' ? null : Number(number), p_name: name, p_password: password || null, p_remove_password: remove })
        : await tableRpc<OwnedTableInfo>('create_owned_table', { p_number: number === '' ? null : Number(number), p_password: password, p_expected_price: info.price });
      accept(next); setDeleting(false); await refreshProfile();
      if (kind === 'create' && next.room_id != null) await join(next.room_id);
    } catch (e) { setError(gameError(e)); } finally { setBusy(false); }
  };
  return <SourceFeaturePopup title={info?.room_id ? '👑 Mənim masam' : '👑 Masa yarat'} onClose={onClose}>
    <div className="space-y-4 text-sm">
      {!info && !error && <p>Yüklənir…</p>}
      {info && <>
        {info.room_id ? <><strong>Masa #{info.number}{info.name ? ` · ${info.name}` : ''}</strong><p>{info.until ? `Müddət: ${new Date(info.until).toLocaleDateString('az-AZ')}` : ''}</p><Button disabled={busy || info.here} onClick={() => void run('join')}>{info.here ? 'Bu masadasan' : 'Masama keç'}</Button></> : <p>{credit ? `Əvvəlki masadan ${Math.max(0, Math.ceil((new Date(info.credit_until ?? '').getTime() - Date.now()) / 86400000))} gün qalıb. Yeni masa yaratmaq pulsuzdur.` : info.price == null ? 'Masa yaratmaq hələ aktiv deyil.' : `${info.price.toLocaleString('az-AZ')} DAT · ${info.days} gün`}</p>}
        <form className="space-y-3" onSubmit={e => { e.preventDefault(); void run(info.room_id ? 'edit' : 'create'); }}>
          <label className="block space-y-1"><span>Masa nömrəsi (istəyə bağlı)</span><Input aria-label="Masa nömrəsi (istəyə bağlı)" type="number" min={1} max={9999} step={1} value={number} onChange={e => setNumber(e.target.value)} placeholder="Avtomatik" disabled={busy} /></label>
          {info.room_id && <label className="block space-y-1"><span>Masa adı</span><Input aria-label="Masa adı" value={name} maxLength={20} onChange={e => setName(e.target.value)} disabled={busy} /></label>}
          <label className="block space-y-1"><span>{info.has_password ? 'Yeni parol' : 'Parol (istəyə bağlı)'}</span><Input aria-label="Masa parolu" type="password" autoComplete="new-password" maxLength={32} value={password} onChange={e => setPassword(e.target.value)} disabled={busy || remove} /></label>
          {info.has_password && <label className="flex items-center gap-2"><input type="checkbox" checked={remove} onChange={e => setRemove(e.target.checked)} disabled={busy} />Parolu sil</label>}
          <p>Parol qoysan, masaya yalnız parolu bilənlər girə bilər. Sən çıxanda da masa kilidli qalır. Parolu istənilən vaxt dəyişmək və ya silmək olar. Müddət bitəndə masa adi masaya çevrilir.</p>
          <Button type="submit" disabled={busy || (!info.room_id && !credit && info.price == null)}>{busy ? 'Gözlə…' : info.room_id ? 'Saxla · pulsuz' : credit ? 'Yarat · pulsuz' : `Yarat · ${info.price ?? '—'} DAT`}</Button>
        </form>
        {info.room_id && <div className="border-t pt-3">{deleting ? <><p>Masa adi masaya çevriləcək; oyunçular yerində qalacaq. Qalan müddət yeni masa yaratmaq üçün saxlanılacaq.</p><div className="mt-2 flex gap-2"><Button variant="destructive" disabled={busy} onClick={() => void run('delete')}>Bəli, sil</Button><Button variant="outline" disabled={busy} onClick={() => setDeleting(false)}>Ləğv et</Button></div></> : <Button variant="destructive" disabled={busy} onClick={() => setDeleting(true)}>Masanı sil</Button>}</div>}
      </>}
      {error && <p role="alert" className="text-destructive">{error}</p>}
    </div>
  </SourceFeaturePopup>;
}
