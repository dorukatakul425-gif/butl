import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { SendGiftDialog } from "@/components/gifts/send-gift-dialog";
import { GestureDialog } from "@/components/gestures/gesture-dialog";
import { useDecorState } from "@/lib/decor-store";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
import { buildGiftItems, createSentGift, RAND_MOD, type GiftStoreItem } from "@/lib/gifts";
import { playSfx, preloadSfx, prepareSfx, unlockSfx } from "@/lib/sfx";
import { dialogImage, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { closedTarget, giftReceivers, openFor, seatSelection, selectGender, setSelective, type GiftTargetState } from "@/lib/gift-selection";
import { pushActionLine, pushGiftLine } from "@/lib/music-session";
import { BottlePlay } from "./bottle-play";
import { completeLoadingStage, failGameLoading } from "@/lib/game-loading";
import { useViewerProgress, VIEWER_GOLD } from "@/lib/viewer-progress";
import { GIFT_SENT_EVENT, setSeatLocator } from "@/lib/interactive-hint-flags";
import { newcomerKey, newcomerKind, newcomersToNotify, widgetParts, OPEN_GIFT_FOR_SEAT_EVENT } from "@/lib/chat-promos";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { SourceGiftLockedDialog, OPEN_TOPS_EVENT, OPEN_VIP_EVENT, OPEN_BANK_EVENT } from "@/components/source-dialogs";

export interface SeatPlayer {
  id?: string;
  name: string;
  photoUrl: string;
  frame: string;
  stone: string;
  male: boolean;
  /** user.detail.isNew from the server: first time in the game. */
  isNew?: boolean;
  /** Server profile fields (age, city, zodiac index 0-11). */
  age?: number;
  city?: string;
  zodiac?: number;
}

// Players sitting at the other seats, each wearing a different animated frame from the game.
const DEMO_FRAMES = ["diamond", "nitrodecor", "heartsdecor", "lavadecor", "discodecor", "angel", "demon", "icedecor", "kissesdecor", "egyptdecor", "cinemadecor"];
export const VIEWER_SEAT = 5;

type PixiTable = Awaited<ReturnType<typeof import("@/components/table/pixi-table").createPixiTable>>;

export function TableSeats() {
  const hostRef = useRef<HTMLDivElement>(null);
  const assets = useCilizAssets();
  const decor = useDecorState();
  const tableRef = useRef<PixiTable | null>(null);
  const playersRef = useRef<SeatPlayer[]>([]);
  const [target, setTarget] = useState<GiftTargetState>(closedTarget);
  const giftSeat = target.receiver;
  const [activeTable, setActiveTable] = useState<PixiTable | null>(null);
  const [gesturesOpen, setGesturesOpen] = useState(false);

  const progress = useViewerProgress();
  useEffect(() => {
    const open = (e: Event) => { const seat = (e as CustomEvent<number>).detail; if (seat !== VIEWER_SEAT && playersRef.current[seat]) { setGesturesOpen(false); setTarget(state => openFor(state, seat, VIEWER_SEAT)); } };
    window.addEventListener(OPEN_GIFT_FOR_SEAT_EVENT, open);
    return () => window.removeEventListener(OPEN_GIFT_FOR_SEAT_EVENT, open);
  }, []);
  const [profileSeat, setProfileSeat] = useState<number | null>(null);
  const [lockedGift, setLockedGift] = useState<GiftStoreItem | null>(null);
  const giftItems = useMemo(() => (assets ? buildGiftItems(assets, VIEWER_STORE.social, { kisses: progress.kisses, vip: progress.vip }) : []), [assets, progress.kisses, progress.vip]);
  const gestureAccount = useMemo(() => ({ userId: "viewer", kisses: progress.kisses, vip: progress.vip, tokens: 0, social: VIEWER_STORE.social, platform: "web", scheduled: [] }), [progress.kisses, progress.vip]);
  // GiftLockedPresenter.showKiss: the open dialog follows totalKisses and closes once reached.
  useEffect(() => {
    if (lockedGift?.lock?.kind === "kisses" && progress.kisses >= lockedGift.lock.need) setLockedGift(null);
  }, [lockedGift, progress.kisses]);

  useEffect(() => {
    if (!assets || !hostRef.current) return;
    let disposed = false;
    const host = hostRef.current;
    import("@/components/table/pixi-table").then(async ({ createPixiTable }) => {
      const table = await createPixiTable(host, assets, {
        onSeatClick: (index) => {
          unlockSfx();
          // Own seat opens the gesture picker; other seats re-target or toggle the gift dialog.
          if (index === VIEWER_SEAT) { setTarget(closedTarget); setGesturesOpen(true); return; }
          setGesturesOpen(false);
          setTarget(state => openFor(state, index, VIEWER_SEAT));
        },
        playSfx: (id) => void playSfx(assets.sfxUrl, id),
        prepareSfx: (id) => prepareSfx(assets.sfxUrl, id),
      });
      if (disposed) {
        table.destroy();
        return;
      }
      tableRef.current = table;
      playersRef.current = buildPlayers(assets, decor.frame, decor.stone);
      table.setPlayers(playersRef.current);
      setActiveTable(table);
      setSeatLocator(seat => table.seatPoint(seat));
      notifyNewcomers(assets, playersRef.current);
      completeLoadingStage("renderer");
    }).catch(error => { console.error("Table loading failed", error); failGameLoading(); });
    return () => {
      disposed = true;
      setSeatLocator(null);
      tableRef.current?.destroy();
      tableRef.current = null;
      setActiveTable(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  useEffect(() => {
    if (!assets) return;
    const viewer = { name: VIEWER.name, photoUrl: VIEWER.photoUrl, frame: decor.frame, stone: decor.stone, male: true };
    playersRef.current[VIEWER_SEAT] = viewer;
    tableRef.current?.setPlayer(VIEWER_SEAT, viewer);
  }, [assets, decor.frame, decor.stone]);

  useEffect(() => {
    activeTable?.setSelection(Array.from({ length: 12 }, (_, seat) => seatSelection(target, seat, VIEWER_SEAT)));
  }, [activeTable, target]);

  // Warm sounds on open; visible/pointed gift items preload their own visuals.
  // Parsing the entire catalogue here competes with rapid sends on slower phones.
  useEffect(() => {
    if (giftSeat === null || !assets) return;
    const ids = new Set(giftItems.flatMap((item) => [...item.gift.startSounds, ...item.gift.finishSounds]));
    ids.forEach((id) => preloadSfx(assets.sfxUrl, id));
  }, [giftSeat, assets, giftItems]);

  const send = useCallback(
    (item: GiftStoreItem) => {
      if (!assets) return;
      unlockSfx();
      // Viewer.decGold: not enough hearts for every receiver -> onGoldNeeded -> bank.
      if (item.price * giftReceivers(target).length > VIEWER_GOLD) { window.dispatchEvent(new Event(OPEN_BANK_EVENT)); return; }
      window.dispatchEvent(new CustomEvent(GIFT_SENT_EVENT, { detail: item.type }));
      // viewerSendGift(selectedUsers, gift): one independent gift per selected receiver.
      for (const seat of giftReceivers(target)) {
        const gift = createSentGift(assets, item.gift, Math.floor(Math.random() * RAND_MOD));
        void tableRef.current?.sendGift(VIEWER_SEAT, seat, gift);
        const receiver = playersRef.current[seat];
        pushGiftLine(
          { id: "viewer", name: VIEWER.name, photoUrl: VIEWER.photoUrl },
          { id: `seat-${seat}`, name: receiver?.name ?? "", photoUrl: receiver?.photoUrl ?? "" },
          { type: item.type, name: item.name, image: dialogImage(assets, item.image, 28, 28).src },
        );
      }
    },
    [assets, target],
  );
  const preload = useCallback((item: GiftStoreItem) => {
    void tableRef.current?.preloadGift(item.gift).catch(error => console.warn(`Gift preload ${item.type}`, error));
  }, []);
  const close = useCallback(() => setTarget(closedTarget), []);
  const multiselect = useMemo(() => ({
    title: assets ? translate(assets, "mobile:dlg:gift:multiselect", "Birden fazla kişi seç") : "",
    onSelectState: (on: boolean) => setTarget(state => setSelective(state, on)),
    onSelectMen: () => setTarget(state => selectGender(state, playersRef.current.map(p => p.male), true, VIEWER_SEAT)),
    onSelectWomen: () => setTarget(state => selectGender(state, playersRef.current.map(p => p.male), false, VIEWER_SEAT)),
  }), [assets]);

  return (
    <>
      <div ref={hostRef} className="original-table-seats" aria-label="Masadaki oyuncular">
        {activeTable && assets && <BottlePlay table={activeTable} assets={assets} />}
      </div>
      {assets && (
        <GestureDialog
          open={gesturesOpen}
          assets={assets}
          account={gestureAccount}
          onClose={() => setGesturesOpen(false)}
          onPreview={async item => {
            const table = tableRef.current;
            if (!table) throw new Error("Table unavailable");
            await table.playGesture(VIEWER_SEAT, item.gesture);
          }}
        />
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
          onLocked={setLockedGift}
          onProfile={() => { if (giftSeat !== null) { setProfileSeat(giftSeat); setTarget(closedTarget); } }}
          selective={target.selective}
          multiselect={multiselect}
        />
      )}
      {assets && profileSeat !== null && playersRef.current[profileSeat] && (
        <ProfileDialog player={playersRef.current[profileSeat]!} self={false} assets={assets}
          onClose={() => setProfileSeat(null)}
          onGift={() => { const seat = profileSeat; setProfileSeat(null); setTarget(state => openFor(state, seat, VIEWER_SEAT)); }}
          onDecor={() => setProfileSeat(null)} onMusic={() => setProfileSeat(null)} />
      )}
      {assets && lockedGift?.lock && (() => {
        const t = (key: string) => translate(assets, key);
        const vip = lockedGift.lock.kind === "vip";
        return <SourceGiftLockedDialog kind="gift" image={dialogImage(assets, lockedGift.image, 60, 60)}
          title={vip ? t("dlg:locked:vip:title") : t("dlg:locked_gift:title")}
          description={vip ? t("dlg:locked_gift:vip:desc") : t("dlg:locked:kiss:desc")}
          {...(lockedGift.lock.kind === "kisses" ? { lock: { type: "kisses" as const, needed: lockedGift.lock.need, current: progress.kisses } } : {})}
          onClose={() => setLockedGift(null)}
          cancel={{ title: t("dlg:navigate_vip:btn"), onClick: () => setLockedGift(null) }}
          info={{ title: t("mobile:vip:know"), onClick: () => { setLockedGift(null); setTarget(closedTarget); window.dispatchEvent(new CustomEvent(vip ? OPEN_VIP_EVENT : OPEN_TOPS_EVENT, { detail: "total_kisses" })); } }} />;
      })()}
    </>
  );
}

function buildPlayers(assets: CilizAssets, frame: string, stone: string): SeatPlayer[] {
  let demo = 0;
  return Array.from({ length: 12 }, (_, seat) => {
    if (seat === VIEWER_SEAT) return { name: VIEWER.name, photoUrl: VIEWER.photoUrl, frame, stone, male: true };
    const id = DEMO_FRAMES[demo++ % DEMO_FRAMES.length] ?? "";
    return {
      id: `seat-${seat}`,
      name: `Oyuncu ${seat + 1}`,
      // Preview stand-in for the server's isNew flag on one seat.
      ...(seat === 1 ? { isNew: true } : {}),
      photoUrl: VIEWER.photoUrl,
      frame: assets.frames[id] ? id : "",
      stone: assets.stones[id] ? id : "",
      // Demo seats alternate gender so men/women multiselect has targets.
      male: seat % 2 === 0,
    };
  });
}

// GameSession.notifyNewcomers: one widget per new opposite-sex player per session.
const notifiedNewcomers = new Set<string>();
function notifyNewcomers(assets: CilizAssets, players: SeatPlayer[]) {
  const users = players.map((p, seat) => ({ ...p, id: p.id ?? `seat-${seat}`, seat })).filter(u => u.seat !== VIEWER_SEAT);
  const kind = newcomerKind(VIEWER_GOLD);
  for (const u of newcomersToNotify(users, { id: "viewer", male: true }, notifiedNewcomers)) {
    const user = { id: u.id, name: u.name, photoUrl: u.photoUrl, male: u.male };
    pushActionLine({ style: "newcomer", icon: kind, parts: widgetParts(translate(assets, newcomerKey(kind)), user), sender: user, seat: u.seat });
  }
}
