import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { joinRoom, leaveRoom, leaveRoomNow, useRoom } from "@/lib/room-session";
import { setViewerProfile } from "@/lib/viewer";
import woodTable from "@/assets/original-wood-table.png.asset.json";
import { OriginalTableHeader } from "@/components/original-table-header";
import { OriginalChatPanel } from "@/components/original-chat-panel";
import { TableSeats } from "@/components/table/table-seats";
import { OriginalLoadingScreen } from "@/components/original-loading-screen";

import { SourceConnectionScreen } from "@/components/table/source-connection-screen";
import { SourceHeartBonus } from "@/components/table/source-heart-bonus";
import { startCloudAchievements } from "@/lib/cloud-achievements";
import { DailyBonusHost } from "@/components/table/daily-bonus-dialog";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "Şişe Oyunu — Masa" },
      { name: "description", content: "Oyunun sunucusundan alınan orijinal ahşap masa ve masa ikonları." },
      { property: "og:title", content: "Orijinal Oyun Masası" },
      { property: "og:description", content: "Orijinal ahşap oyun masası ve sunucu görselleri." },
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
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    if (!auth.ready) return;
    if (!auth.session || !auth.profile) { void navigate({ to: "/auth" }); return; }
    setViewerProfile(auth.profile);
    let alive = true;
    void joinRoom().then(() => { if (alive) setJoined(true); }).catch(() => { if (alive) setJoined(false); });
    // Closing the tab frees the seat at once, so others see the player leave immediately.
    const stopAchievements = startCloudAchievements();
    const bye = () => leaveRoomNow();
    window.addEventListener("pagehide", bye);
    return () => { alive = false; stopAchievements(); window.removeEventListener("pagehide", bye); void leaveRoom(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.ready, auth.session?.user.id, Boolean(auth.profile)]);
  if (!joined || !room.roomId) {
    return <main className="grid min-h-dvh place-items-center bg-background p-6 text-center text-foreground">
      <p>{room.error ?? "Masaya bağlanılıyor…"}</p>
    </main>;
  }
  return (
    <main className="original-table-page" aria-label="Orijinal oyun masası">
      <OriginalLoadingScreen />
      <SourceConnectionScreen />
      <SourceHeartBonus />
      {auth.session && <DailyBonusHost viewerId={auth.session.user.id} />}
      <img className="original-page-wood" src={woodTable.url} alt="" />
      <div className="original-game">
        <div className="original-table">
          <img className="original-table-wood" src={woodTable.url} alt="Oyunun sunucusundan alınan orijinal ahşap masa" />
          <TableSeats />
          <OriginalTableHeader />
        </div>
        <OriginalChatPanel />
      </div>
    </main>
  );
}
