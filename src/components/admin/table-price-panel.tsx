import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tableRpc, type OwnedTableInfo } from '@/lib/owned-tables';
export function TablePricePanel() {
  const qc = useQueryClient(), [price, setPrice] = useState<string | null>(null);
  const query = useQuery({ queryKey: ['admin', 'table-price'], queryFn: () => tableRpc<OwnedTableInfo>('my_table_info') });
  const save = useMutation({ mutationFn: (amount: number) => tableRpc<number>('admin_set_table_price', { p_price: amount }), onSuccess: async () => { setPrice(null); await qc.invalidateQueries({ queryKey: ['admin', 'table-price'] }); } });
  const current = price ?? (query.data?.price == null ? '' : String(query.data.price));
  return <section className="mb-8 space-y-3 border-b pb-6">
    <h2 className="text-lg font-semibold">Masa yarat · 30 gün</h2>
    <form className="flex flex-wrap items-end gap-3" onSubmit={e => { e.preventDefault(); const n = Number(current); if (current !== '' && Number.isSafeInteger(n) && n >= 0) save.mutate(n); }}>
      <label className="space-y-2 text-sm"><span>Masa yaratma qiyməti · DAT</span><Input aria-label="Masa yaratma qiyməti · DAT" type="number" min={0} max={1000000000} step={1} required value={current} onChange={e => setPrice(e.target.value)} disabled={save.isPending || query.isPending} /></label>
      <Button type="submit" disabled={save.isPending || query.isPending || current === ''}>{save.isPending ? 'Saxlanılır…' : 'Saxla'}</Button>
    </form>
    {query.data?.price == null && <p className="text-sm text-muted-foreground">Qiymət təyin olunmayıb. Masa yaratmaq bağlıdır.</p>}
    {(query.error || save.error) && <p role="alert" className="text-sm text-destructive">{(query.error ?? save.error)?.message}</p>}
    {save.isSuccess && <p role="status" className="text-sm">DAT qiyməti saxlanıldı.</p>}
  </section>;
}
