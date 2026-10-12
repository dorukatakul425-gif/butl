import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DecorSelection, useCilizAssets } from "@/components/decor/decor-selection";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { SendGiftDialog } from "@/components/gifts/send-gift-dialog";
import { GestureDialog } from "@/components/gestures/gesture-dialog";
import { useCloudAccount } from "@/lib/cloud-account";
import { purchaseGameItem } from "@/lib/cloud-game.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { DEFAULT_PHOTO } from "@/lib/ciliz-default-photo";
import type { CloudRoom } from "@/lib/cloud-room";
import { buildGiftItems, createSentGift, type GiftStoreItem } from "@/lib/gifts";
import { playSfx, preloadSfx, prepareSfx, unlockSfx } from "@/lib/sfx";
import { BottlePlay } from "./bottle-play";
import { completeLoadingStage, failGameLoading } from "@/lib/game-loading";

export interface SeatPlayer {
  id?: string;
  name: string;
  photoUrl: string;
  frame: string;
  stone: string;
}


export const VIEWER_SEAT = 5;

type PixiTable = Awaited<ReturnType<typeof import("@/components/table/pixi-table").createPixiTable>>;

export function TableSeats({ room }: { room: CloudRoom | null }) {
  const { user, wallet } = useCloudAccount();
  const purchase = useServerFn(purchaseGameItem);
  const roomRef = useRef(room); roomRef.current = room;
  const viewerSeat = room?.players.find(p => p.id === user?.id)?.seat ?? VIEWER_SEAT;
  const viewerSeatRef = useRef(viewerSeat); viewerSeatRef.current = viewerSeat;
  const seenEvents = useRef(new Set<number>());
  const hostRef = useRef<HTMLDivElement>(null);
  const assets = useCilizAssets();
  const tableRef = useRef<PixiTable | null>(null);
  const playersRef = useRef<SeatPlayer[]>([]);
  const [giftSeat, setGiftSeat] = useState<number | null>(null);
  const [gesturesOpen, setGesturesOpen] = useState(false);
  const [profileSeat, setProfileSeat] = useState<number | null>(null);
  const [decorOpen, setDecorOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<PixiTable | null>(null);

  const giftItems = useMemo(() => (assets ? buildGiftItems(assets, "ok", { kisses: wallet?.kisses ?? 0, vip: wallet?.vip ?? false, ...(user ? { id: user.id } : {}) }) : []), [assets, wallet, user?.id]);

  useEffect(() => {
    if (!assets || !hostRef.current) return;
    let disposed = false;
    const host = hostRef.current;
    import("@/components/table/pixi-table").then(async ({ createPixiTable }) => {
      const table = await createPixiTable(host, assets, {
        onSeatClick: (index) => {
          unlockSfx();
          if (!roomRef.current?.players.some(p => p.seat === index)) return;
          if (index === viewerSeatRef.current) { setGiftSeat(null); setGesturesOpen(true); }
          else { setGesturesOpen(false); setGiftSeat(index); }
        },
        playSfx: (id) => void playSfx(assets.sfxUrl, id),
        prepareSfx: (id) => prepareSfx(assets.sfxUrl, id),
      });
      if (disposed) {
        table.destroy();
        return;
      }
      tableRef.current = table;
      playersRef.current = buildPlayers(roomRef.current);
      table.setPlayers(playersRef.current);
      setActiveTable(table);
      completeLoadingStage("renderer");
    }).catch(error => { console.error("Table loading failed", error); failGameLoading(); });
    return () => {
      disposed = true;
      tableRef.current?.destroy();
      tableRef.current = null;
      setActiveTable(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  useEffect(() => {
    playersRef.current = buildPlayers(room);
    tableRef.current?.setPlayers(playersRef.current);
  }, [room, activeTable]);
  useEffect(() => {
    if (!room || !assets || !activeTable) return;
    for (const event of room.events) {
      if (seenEvents.current.has(event.id)) continue;
      seenEvents.current.add(event.id);
      const from = room.players.find(p => p.id === event.actor_id)?.seat;
      const to = room.players.find(p => p.id === event.receiver_id)?.seat;
      if (from === undefined) continue;
      if (event.kind === 'gift' && to !== undefined && Date.now() - Date.parse(event.created_at) < 20000) {
        const gift = assets.gifts[event.item_id];
        if (gift) void activeTable.sendGift(from, to, createSentGift(assets, gift, event.random_seed));
      } else if (event.kind === 'gesture') {
        const gesture = assets.gestures?.[event.item_id];
        if (gesture && Date.now() - Date.parse(event.created_at) < 20000) void activeTable.playGesture(from, gesture);
      }
    }
  }, [room, assets, activeTable]);

  // Warm the sounds of the store gifts once the drawer opens, so the first send plays instantly.
  useEffect(() => {
    if (giftSeat === null || !assets) return;
    const ids = new Set(giftItems.flatMap((item) => [...item.gift.startSounds, ...item.gift.finishSounds]));
    ids.forEach((id) => preloadSfx(assets.sfxUrl, id));
  }, [giftSeat, assets, giftItems]);

  const send = useCallback((item: GiftStoreItem) => {
    const receiver = room?.players.find(p => p.seat === giftSeat);
    if (!receiver) return;
    unlockSfx();
    void purchase({ data: { kind: 'gift', item: item.type, receiver: receiver.id } }).catch(e => toast.error(e instanceof Error ? e.message : 'Hediye gönderilemedi.'));
  }, [room, giftSeat, purchase]);
  const preload = useCallback((item: GiftStoreItem) => {
    void tableRef.current?.preloadGift(item.gift).catch(error => console.warn(`Gift preload ${item.type}`, error));
  }, []);
  const close = useCallback(() => setGiftSeat(null), []);
  useEffect(() => {
    const gift = (event: Event) => { const seat = roomRef.current?.players.find(p => p.id === (event as CustomEvent<string>).detail)?.seat; if (seat !== undefined) setGiftSeat(seat); };
    window.addEventListener('game-gift-to', gift);
    return () => window.removeEventListener('game-gift-to', gift);
  }, []);

  return (
    <>
      <div ref={hostRef} className="original-table-seats" aria-label="Masadaki oyuncular">
        {activeTable && assets && <BottlePlay table={activeTable} assets={assets} room={room} viewerId={user?.id ?? ""} />}
      </div>
      {assets && (
        <GestureDialog open={gesturesOpen} assets={assets} account={user && wallet ? { userId: user.id, kisses: wallet.kisses, vip: wallet.vip, tokens: wallet.tokens, social: "ok", platform: "web", scheduled: [] } : null} onSend={async item => { await purchase({ data: { kind: "gesture", item: item.gesture.type, receiver: null } }); }} onProfile={() => setProfileSeat(viewerSeat)} onClose={() => setGesturesOpen(false)} onPreview={async item => {
          const table = tableRef.current;
          if (!table) throw new Error("Table unavailable");
          await table.playGesture(viewerSeat, item.gesture);
        }} />
      )}
      {assets && (
        <SendGiftDialog
          open={giftSeat !== null}
          assets={assets}
          items={giftItems}
          receiverName={giftSeat !== null ? (playersRef.current[giftSeat]?.name ?? "") : ""}
          onSend={send}
          onPreload={preload}
          onClose={close}
          onProfile={() => { if (giftSeat !== null) setProfileSeat(giftSeat); }}
        />
      )}
      {assets && profileSeat !== null && playersRef.current[profileSeat] && <ProfileDialog player={playersRef.current[profileSeat]} self={profileSeat === viewerSeat} assets={assets} onClose={() => setProfileSeat(null)} onGift={() => { setGiftSeat(profileSeat); setProfileSeat(null); setGesturesOpen(false); }} onDecor={() => { setProfileSeat(null); setGesturesOpen(false); setGiftSeat(null); setDecorOpen(true); }} onMusic={() => { setProfileSeat(null); setGesturesOpen(false); setGiftSeat(null); document.querySelector<HTMLElement>('[aria-label="Müzik"]')?.click(); }} />}
      <DecorSelection open={decorOpen} onClose={() => setDecorOpen(false)} />
    </>
  );
}

function buildPlayers(room: CloudRoom | null): SeatPlayer[] {
  return Array.from({ length: 12 }, (_, seat) => {
    const player = room?.players.find(p => p.seat === seat);
    return player ? { id: player.id, name: player.name, photoUrl: player.photoUrl, frame: player.frame ?? '', stone: player.stone ?? '' } : { name: '', photoUrl: DEFAULT_PHOTO, frame: '', stone: '' };
  });
}
