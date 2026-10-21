import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { getRouletteAdmin, saveRouletteAdmin } from '@/lib/admin.functions';
import { rouletteConfigSchema, roulettePrizeNames, type RouletteConfigInput } from '@/lib/roulette-config';
import '@/styles/ciliz-roulette.css';

export function RoulettePanel() {
  const read = useServerFn(getRouletteAdmin), save = useServerFn(saveRouletteAdmin), qc = useQueryClient();
  const [draft, setDraft] = useState<RouletteConfigInput | null>(null), [notice, setNotice] = useState('');
  const query = useQuery({ queryKey: ['admin', 'roulette'], queryFn: () => read() });
  const mutation = useMutation({ mutationFn: (data: RouletteConfigInput) => save({ data }), onSuccess: async () => { setDraft(null); setNotice('Çarx ayarları saxlanıldı.'); await qc.invalidateQueries({ queryKey: ['admin', 'roulette'] }); } });
  if (query.isPending) return <p>Yüklənir…</p>;
  if (query.error || !query.data) return <p role="alert">Çarx ayarları alınmadı. <Button variant="outline" onClick={() => void query.refetch()}>Yenidən yoxla</Button></p>;
  const data = query.data, current = draft ?? data.config;
  const total = current.prizes.reduce((s, p) => s + Math.round(p.percentage * 100), 0) / 100;
  const change = (patch: Partial<RouletteConfigInput>) => { setDraft({ ...current, ...patch }); setNotice(''); };
  const submit = () => { const parsed = rouletteConfigSchema.safeParse(current); if (!parsed.success) { setNotice(parsed.error.issues[0]?.message ?? 'Ayarlar düzgün deyil.'); return; } mutation.mutate(parsed.data); };
  return <section className="space-y-6">
    <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold">Şans çarxı</h2><label className="flex items-center gap-3">Aktiv<Switch checked={current.enabled} onCheckedChange={v => change({ enabled: v })} disabled={mutation.isPending} /></label></div>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {([['spinCost','Bir dövr üçün şans'],['dailyChances','Gündəlik pulsuz şans'],['bundleChances','Paketdə şans'],['bundleDat','Paket qiyməti · DAT']] as const).map(([key, label]) => <label key={key} className="space-y-2 text-sm"><span>{label}</span><Input type="number" min={key === 'dailyChances' ? 0 : 1} step={1} value={current[key]} onChange={e => change({ [key]: Number(e.target.value) })} disabled={mutation.isPending} /></label>)}
    </div>
    <div className="divide-y border-y">
      {data.prizes.map(prize => <div key={prize.id} className="grid grid-cols-[40px_1fr_100px] items-center gap-3 py-3">
        <span aria-hidden className={`roulette__reward-icon roulette__reward-icon--${prize.image}`} />
        <div className="min-w-0"><div className="text-sm font-medium">{prize.amount} × {roulettePrizeNames[prize.image] ?? prize.image}</div><div className="text-xs text-muted-foreground">Sektor {prize.id + 1}</div></div>
        <label className="flex items-center gap-2"><Input aria-label={`Sektor ${prize.id + 1} ehtimalı`} type="number" min={0} max={100} step={0.01} value={current.prizes.find(p => p.id === prize.id)?.percentage ?? 0} disabled={mutation.isPending} onChange={e => change({ prizes: current.prizes.map(p => p.id === prize.id ? { ...p, percentage: Number(e.target.value) } : p) })} /><span>%</span></label>
      </div>)}
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3"><strong className={total === 100 ? 'text-foreground' : 'text-destructive'}>Cəmi: {total.toFixed(2)}%</strong><Button onClick={submit} disabled={mutation.isPending || total !== 100}>{mutation.isPending ? 'Saxlanılır…' : 'Saxla'}</Button></div>
    {(notice || mutation.error) && <p role="status" className="text-sm">{mutation.error?.message ?? notice}</p>}
    <div><h3 className="mb-3 font-bold">Son çarx əməliyyatları</h3><div className="divide-y border-y">{data.events.map(event => <div key={event.id} className="flex flex-wrap justify-between gap-2 py-2 text-sm"><span>{event.name} · {event.action === 'buy' ? 'Şans paketi' : `${event.amount ?? ''} × ${roulettePrizeNames[event.image ?? ''] ?? 'Mükafat'}`}</span><time className="text-muted-foreground">{new Date(event.created_at).toLocaleString('az-AZ')}</time></div>)}{!data.events.length && <p className="py-3 text-sm text-muted-foreground">Hələ əməliyyat yoxdur.</p>}</div></div>
  </section>;
}