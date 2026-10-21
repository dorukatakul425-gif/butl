import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { joinRoom, detachRoom, leaveRoomNow, useRoom } from "@/lib/room-session";
import { setViewerProfile } from "@/lib/viewer";
import { setupTelegramViewport } from "@/lib/telegram-viewport";
import woodTable from "@/assets/original-wood-table.png";
import { OriginalTableHeader } from "@/components/original-table-header";
import { OriginalChatPanel } from "@/components/original-chat-panel";
import { TableSeats } from "@/components/table/table-seats";
import { OriginalLoadingScreen } from "@/components/original-loading-screen";

import { SourceConnectionScreen } from "@/components/table/source-connection-screen";
import { SourceHeartBonus } from "@/components/table/source-heart-bonus";
import { startCloudAchievements } from "@/lib/cloud-achievements";
import { DailyBonusHost } from "@/components/table/daily-bonus-dialog";
import { startCloudBlocks } from "@/lib/block-session";
import { SourceHaremNotice } from '@/components/table/source-harem-notice';
import { ProfileSetupDialog } from "@/components/profile/profile-setup-dialog";
import { getSupabase } from "@/lib/supabase";
import { Button } from '@/components/ui/button';
import { tableBgUrl, useTableBg } from "@/lib/table-bg";
import { useOriginalLayout } from "@/lib/original-layout";
import "@/styles/table-bg.css";
import { GameCrashShield } from "@/components/game-crash-shield";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "Deltagame — Oyun masası" },
      { name: "description", content: "Deltagame oyun masasında şüşəni fırlat, söhbət et və yeni insanlarla tanış ol." },
      { property: "og:title", content: "Deltagame — Oyun masası" },
      { property: "og:description", content: "Şüşəni fırlat və Deltagame oyun masasında söhbətə qoşul." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const auth = useAuth();
  const navigate = useNavigate();
  const room = useRoom();
  const tableBg = useTableBg();
  // Original getLayout() engine: table/chat geometry + keyboard shift.
  const { layout, shift } = useOriginalLayout();
  const [joined, setJoined] = useState(false);
  // Telegram Mini App only: keep the table height stable while the chat
  // keyboard opens (original client's expand + keyboard scroll behavior).
  useEffect(() => setupTelegramViewport(), []);
  useEffect(() => {
    if (!auth.ready) return;
    if (!auth.session || !auth.profile) { void navigate({ to: "/auth" }); return; }
    setViewerProfile(auth.profile);
    // Telegram first entry: gender/age setup must finish before the live room is mounted.
    if (auth.profile.profile_setup_done === false) return;
    let alive = true;
    const connect = () => void joinRoom().then(() => { if (alive) setJoined(true); }).catch(() => { if (alive) setJoined(false); });
    connect();
    // Membership belongs to the server, not this page's component lifecycle.
    const stopAchievements = startCloudAchievements();
    const stopBlocks = startCloudBlocks(auth.session.user.id);
    // Aktivlik liderləri: every minute spent at the table is counted by the server.
    const activity = window.setInterval(() => { void getSupabase()?.rpc("activity_ping" as never); }, 60000);
    const bye = () => leaveRoomNow();
    const resume = () => { if (alive && document.visibilityState === 'visible') connect(); };
    // Re-read the authoritative membership and table after suspended tabs/network recovery.
    const back = (e: PageTransitionEvent) => { if (e.persisted) connect(); };
    window.addEventListener("pagehide", bye);
    window.addEventListener("pageshow", back);
    window.addEventListener("online", resume);
    document.addEventListener("visibilitychange", resume);
    return () => { alive = false; window.clearInterval(activity); stopAchievements(); stopBlocks(); window.removeEventListener("pagehide", bye); window.removeEventListener("pageshow", back); window.removeEventListener("online", resume); document.removeEventListener("visibilitychange", resume); void detachRoom(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.ready, auth.session?.user.id, Boolean(auth.profile), auth.profile?.profile_setup_done]);
  if (auth.profile && auth.profile.profile_setup_done === false) return <ProfileSetupDialog onDone={() => undefined} />;
  if (!joined || !room.roomId) {
    return <main className="grid min-h-dvh place-items-center bg-background p-6 text-center text-foreground">
      <p>{room.error ?? "Masaya qoşulursan…"}</p>
      {room.error && <Button onClick={() => void joinRoom().then(() => setJoined(true)).catch(() => undefined)}>Qayıt</Button>}
    </main>;
  }
  return (
    <main className="original-table-page" aria-label="Deltagame oyun masası">
      <GameCrashShield name="loading"><OriginalLoadingScreen /></GameCrashShield>
      <GameCrashShield name="connection"><SourceConnectionScreen /></GameCrashShield>
      <GameCrashShield name="heart-bonus"><SourceHeartBonus /></GameCrashShield>
      {auth.session && <GameCrashShield name="harem"><SourceHaremNotice key={auth.session.user.id} viewerId={auth.session.user.id} /></GameCrashShield>}
      {auth.session && <GameCrashShield name="daily-bonus"><DailyBonusHost viewerId={auth.session.user.id} /></GameCrashShield>}
      <img className="original-page-wood" src={woodTable} alt="" />
      <div className="original-game">
        <div className="original-game-shell" style={shift ? { transform: `translateY(${shift}px)` } : undefined}>
          <GameCrashShield name="header"><OriginalTableHeader /></GameCrashShield>
          <div
            className={`original-table${!tableBg && room.room?.table_color != null ? ` personal-table-color-${room.room.table_color}` : ''}`}
            style={layout ? { left: layout.table.x, top: layout.table.y, width: layout.table.size, height: layout.table.size } : undefined}
          >
            <img className="original-table-wood" src={woodTable} alt="Taxta oyun masası" />
            {tableBg && <img key={tableBg} className="original-table-bg-image" src={tableBgUrl(tableBg)} alt="" />}
            <GameCrashShield name="seats"><TableSeats /></GameCrashShield>
          </div>
          <div
            className="original-chat-slot"
            style={layout ? { left: layout.chat.x, top: layout.chat.y, width: layout.chat.w, height: layout.chat.h } : undefined}
          >
            <GameCrashShield name="chat"><OriginalChatPanel /></GameCrashShield>
          </div>
        </div>
      </div>
    </main>
  );
}
