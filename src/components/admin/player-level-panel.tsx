import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPlayerLevel, grantFrame, setGiftLevel } from "@/lib/admin.functions";
import { LEVEL_FRAMES, customFrameUrl, customFrameImageName } from "@/lib/custom-frames";

const FRAMES = [...LEVEL_FRAMES, { key: "cf_131", level: 0 }];

/** Admin: gift level (frames + entrance effect follow it) and per-player animated frame grants. */
export function PlayerLevelPanel({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const load = useServerFn(getPlayerLevel);
  const setLevel = useServerFn(setGiftLevel);
  const grant = useServerFn(grantFrame);
  const key = ["admin", "level", userId];
  const q = useQuery({ queryKey: key, queryFn: () => load({ data: { userId } }) });
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  const levelM = useMutation({
    mutationFn: (level: number) => setLevel({ data: { userId, level } }),
    onSuccess: (r) => { setMsg(`Yeni səviyyə: Lv ${r.level}`); setValue(""); void qc.invalidateQueries({ queryKey: key }); },
    onError: (e) => setMsg((e as Error).message),
  });
  const frameM = useMutation({
    mutationFn: (v: { frame: string; give: boolean }) => grant({ data: { userId, ...v } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: key }),
    onError: (e) => setMsg((e as Error).message),
  });
  if (q.isLoading) return <p className="mt-3 text-xs text-muted-foreground">Yüklənir…</p>;
  if (q.error || !q.data) return <p className="mt-3 text-xs text-destructive">{(q.error as Error)?.message ?? "Xəta"}</p>;
  const { level, points, owned } = q.data;
  const n = parseInt(value, 10);
  return (
    <div className="mt-3 space-y-3 rounded-md border p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Hədiyyə səviyyəsi: Lv {level}</span>
        <span className="text-xs text-muted-foreground">({points} xal)</span>
        <Input className="w-28" type="number" min={0} max={100} placeholder="0-100" value={value} onChange={(e) => setValue(e.target.value)} />
        <Button size="sm" disabled={!(n >= 0 && n <= 100) || levelM.isPending} onClick={() => levelM.mutate(n)}>Təyin et</Button>
        <Button size="sm" variant="outline" disabled={levelM.isPending} onClick={() => levelM.mutate(100)}>Lv 100</Button>
      </div>
      <p className="text-xs text-muted-foreground">Səviyyə dəyişəndə ramkalar və masaya giriş effekti avtomatik ona uyğun olur.</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FRAMES.map((f) => {
          const given = owned.includes(f.key);
          const open = given || (f.level > 0 && level >= f.level);
          return (
            <div key={f.key} className="flex flex-col items-center gap-1 rounded-md border p-2 text-center">
              <img src={customFrameUrl(customFrameImageName(f.key)) ?? ""} alt={f.key} className="h-16 w-16 object-contain" loading="lazy" />
              <span className="text-xs">{f.level ? `Lv ${f.level}` : "Xüsusi"}</span>
              <span className="text-[10px] text-muted-foreground">{given ? "Verilib" : open ? "Səviyyə ilə açıq" : "Bağlı"}</span>
              <Button size="sm" variant={given ? "outline" : "default"} disabled={frameM.isPending} onClick={() => frameM.mutate({ frame: f.key, give: !given })}>
                {given ? "Geri al" : "Ver"}
              </Button>
            </div>
          );
        })}
      </div>
      {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}
