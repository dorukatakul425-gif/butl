import { useEffect, useRef } from "react";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { useDecorState } from "@/lib/decor-store";
import { VIEWER } from "@/lib/viewer";
import type { CilizAssets } from "@/lib/ciliz-assets";

export interface SeatPlayer {
  name: string;
  photoUrl: string;
  frame: string;
  stone: string;
}

// Players sitting at the other seats, each wearing a different animated frame from the game.
const DEMO_FRAMES = ["diamond", "nitrodecor", "heartsdecor", "lavadecor", "discodecor", "angel", "demon", "icedecor", "kissesdecor", "egyptdecor", "cinemadecor"];
export const VIEWER_SEAT = 5;

export function TableSeats() {
  const hostRef = useRef<HTMLDivElement>(null);
  const assets = useCilizAssets();
  const decor = useDecorState();
  const tableRef = useRef<Awaited<ReturnType<typeof import("@/components/table/pixi-table").createPixiTable>> | null>(null);

  useEffect(() => {
    if (!assets || !hostRef.current) return;
    let disposed = false;
    const host = hostRef.current;
    import("@/components/table/pixi-table").then(async ({ createPixiTable }) => {
      const table = await createPixiTable(host, assets as CilizAssets);
      if (disposed) {
        table.destroy();
        return;
      }
      tableRef.current = table;
      table.setPlayers(buildPlayers(assets as CilizAssets, decor.frame, decor.stone));
    });
    return () => {
      disposed = true;
      tableRef.current?.destroy();
      tableRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  useEffect(() => {
    if (!assets) return;
    tableRef.current?.setPlayer(VIEWER_SEAT, { name: VIEWER.name, photoUrl: VIEWER.photoUrl, frame: decor.frame, stone: decor.stone });
  }, [assets, decor.frame, decor.stone]);

  return <div ref={hostRef} className="original-table-seats" aria-label="Masadaki oyuncular" />;
}

function buildPlayers(assets: CilizAssets, frame: string, stone: string): SeatPlayer[] {
  let demo = 0;
  return Array.from({ length: 12 }, (_, seat) => {
    if (seat === VIEWER_SEAT) return { name: VIEWER.name, photoUrl: VIEWER.photoUrl, frame, stone };
    const id = DEMO_FRAMES[demo++ % DEMO_FRAMES.length] ?? "";
    return {
      name: `Oyuncu ${seat + 1}`,
      photoUrl: VIEWER.photoUrl,
      frame: assets.frames[id] ? id : "",
      stone: assets.stones[id] ? id : "",
    };
  });
}
