import "@/styles/original-preloader-background.css";
import { useEffect, useRef } from 'react';
import type { OriginalBackgroundLayout } from '@/lib/original-table-background';

export function OriginalTableBackground({ layout, url }: { layout: { header: number; table: { x: number; y: number; size: number } } | null; url: string }) {
  const host = useRef<HTMLDivElement>(null);
  const drawing = useRef<Awaited<ReturnType<typeof import('@/lib/original-table-background').createOriginalTableBackground>> | null>(null);
  const originalLayout: OriginalBackgroundLayout | null = layout ? {
    background: { x: layout.table.x + layout.table.size / 2, y: layout.table.y + layout.table.size / 2, width: layout.table.size + 2 * layout.header, height: layout.table.size + 2 * layout.header },
    game: { width: layout.table.x + layout.table.size, height: layout.table.y + layout.table.size },
  } : null;
  const latest = useRef(originalLayout);
  latest.current = originalLayout;
  useEffect(() => {
    let cancelled = false;
    void import('@/lib/original-table-background').then(async ({ createOriginalTableBackground }) => {
      if (cancelled || !host.current) return;
      const instance = await createOriginalTableBackground(host.current, url);
      if (cancelled) { instance.destroy(); return; }
      drawing.current = instance;
      if (latest.current) instance.updateLayout(latest.current);
    });
    return () => { cancelled = true; drawing.current?.destroy(); drawing.current = null; };
  }, [url]);
  useEffect(() => { if (originalLayout) drawing.current?.updateLayout(originalLayout); }, [layout]);
  return <div ref={host} className="original-preloader-background" aria-hidden="true" />;
}