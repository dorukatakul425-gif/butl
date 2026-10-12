import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCloudAccount } from '@/lib/cloud-account';
import { supabase } from '@/integrations/supabase/client';

const titles: Record<string, string> = { achievements: 'Başarılar', tops: 'Puanlar', boosters: "Booster’lar", 'bottle-pass': 'Şişe bileti', roulette: 'Rulet', league: 'Lig' };
export function TableFeatureDialog({ feature, onClose }: { feature: string | null; onClose: () => void }) {
  const { wallet } = useCloudAccount();
  const [rows, setRows] = useState<{ name: string; kisses: number }[]>([]);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (feature !== 'tops') return;
    let alive = true; setRows([]); setNotice('Yükleniyor…');
    void (async () => {
      const { data, error } = await supabase.from('profiles').select('id,display_name').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      const result = await Promise.all((data ?? []).map(async p => {
        const { data: stats, error } = await supabase.rpc('player_stats', { player: p.id });
        if (error) throw error;
        const value = stats as { kisses?: number } | null;
        return { name: p.display_name, kisses: Number(value?.kisses ?? 0) };
      }));
      if (alive) { setRows(result.sort((a,b) => b.kisses-a.kisses)); setNotice(''); }
    })().catch(() => { if (alive) setNotice('Puanlar yüklenemedi.'); });
    return () => { alive = false; };
  }, [feature]);
  return <Dialog open={Boolean(feature)} onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="table-feature-dialog"><DialogTitle>{feature ? titles[feature] : ''}</DialogTitle><DialogDescription>{feature === 'achievements' ? 'Oyuncu istatistiklerin' : feature === 'tops' ? 'Son 50 kayıtlı oyuncunun öpücük puanları' : 'Bu özellik henüz hesabınızda kullanıma açık değil.'}</DialogDescription>
    {feature === 'achievements' && <dl className="table-feature-stats"><dt>Öpücük</dt><dd>{wallet?.kisses ?? '—'}</dd><dt>Jest</dt><dd>{wallet?.gestures ?? '—'}</dd><dt>Kalp</dt><dd>{wallet?.hearts ?? '—'}</dd></dl>}
    {feature === 'tops' && <div className="table-feature-scores">{notice && <p role="status">{notice}</p>}{rows.map((r,i) => <div key={i}><span>{i+1}. {r.name}</span><strong>{r.kisses}</strong></div>)}</div>}
  </DialogContent></Dialog>;
}