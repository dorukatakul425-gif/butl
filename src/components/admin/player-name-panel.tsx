import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getPlayerNameStyle, savePlayerNameStyle, requestSiteRefresh } from '@/lib/admin.functions';
import { NAME_STYLES, NAME_STYLE_LABELS, type NameStyle } from '@/lib/player-appearance';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PlayerName } from '@/components/player-name';
import { RefreshCw } from 'lucide-react';

export function PlayerNamePanel({ userId, name }: { userId: string; name: string }) {
  const get = useServerFn(getPlayerNameStyle);
  const query = useQuery({ queryKey: ['admin', 'name-style', userId], queryFn: () => get({ data: { userId } }) });
  if (!query.data) return <p className="mt-3 text-sm text-muted-foreground">{query.isError ? 'Ad üslubu yüklənmədi.' : 'Yüklənir…'}</p>;
  return <NameEditor key={`${userId}:${query.data.nameStyle}:${query.data.creator}`} userId={userId} name={name} initial={query.data} />;
}

function NameEditor({ userId, name, initial }: { userId: string; name: string; initial: { nameStyle: NameStyle; creator: boolean; level: number } }) {
  const [nameStyle, setNameStyle] = useState<NameStyle>(initial.nameStyle);
  const [creator, setCreator] = useState(initial.creator);
  const save = useServerFn(savePlayerNameStyle);
  const qc = useQueryClient();
  const mutation = useMutation({ mutationFn: () => save({ data: { userId, nameStyle, creator } }), onSuccess: () => { void qc.invalidateQueries({ queryKey: ['admin', 'name-style', userId] }); void qc.invalidateQueries({ queryKey: ['player-appearance'] }); } });
  return <div className="mt-4 space-y-3 border-t pt-3">
    <PlayerName name={name} appearance={{ level: initial.level, nameStyle, creator }} />
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Ad rəngi">
      {NAME_STYLES.map(style => <Button key={style} size="icon" variant={nameStyle === style ? 'default' : 'outline'} title={NAME_STYLE_LABELS[style]} aria-label={NAME_STYLE_LABELS[style]} aria-pressed={nameStyle === style} onClick={() => setNameStyle(style)}><span className={`name-swatch name-swatch--${style}`} /></Button>)}
    </div>
    <label className="flex items-center gap-3 text-sm"><Switch checked={creator} onCheckedChange={setCreator} />Creator</label>
    <Button size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate()}>Yadda saxla</Button>
    {mutation.isError && <p className="text-sm text-destructive">{mutation.error.message}</p>}
    {mutation.isSuccess && <p className="text-sm text-muted-foreground">Ad üslubu yadda saxlanıldı.</p>}
  </div>;
}

export function SiteRefreshPanel() {
  const request = useServerFn(requestSiteRefresh);
  const mutation = useMutation({ mutationFn: () => request() });
  return <section className="mb-8 border-t py-4">
    <h2 className="mb-3 text-lg font-semibold">Saytı yenilə</h2>
    <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}><RefreshCw className="mr-2 h-4 w-4" />Hamıya yeniləmə göndər</Button>
    {mutation.isSuccess && <p className="mt-2 text-sm text-muted-foreground">Yeniləmə bildirişi göndərildi.</p>}
    {mutation.isError && <p className="mt-2 text-sm text-destructive">{mutation.error.message}</p>}
  </section>;
}