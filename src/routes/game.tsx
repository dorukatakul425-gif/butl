import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { joinRoom, leaveRoom, leaveRoomNow, useRoom } from "@/lib/room-session";
import { setViewerProfile } from "@/lib/viewer";
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
import { TutorialTable } from "@/components/tutorial/tutorial-table";
import { getSupabase } from "@/lib/supabase";
import { refreshProfile } from "@/lib/auth";

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
  const [tutorialDone, setTutorialDone] = useState(false);
  const finishTutorial = async () => {
    const sb = getSupabase();
    if (sb) await sb.rpc("complete_tutorial").catch(() => undefined);
    await refreshProfile();
    setTutorialDone(true);
  };
  useEffect(() => {
    if (!auth.ready) return;
    if (!auth.session || !auth.profile) { void navigate({ to: "/auth" }); return; }
    setViewerProfile(auth.profile);
    // Telegram first entry: gender/age setup must finish before the live room is mounted.
    if (auth.profile.profile_setup_done === false) return;
    // New Telegram players first play the scripted fake-table tutorial.
    if (auth.profile.tutorial_done === false && !tutorialDone) return;
    let alive = true;
    void joinRoom().then(() => { if (alive) setJoined(true); }).catch(() => { if (alive) setJoined(false); });
    // Closing the tab frees the seat at once, so others see the player leave immediately.
    const stopAchievements = startCloudAchievements();
    const stopBlocks = startCloudBlocks(auth.session.user.id);
    const bye = () => leaveRoomNow();
    // Back/forward cache restores the page after pagehide already freed the seat: sit down again.
    const back = (e: PageTransitionEvent) => { if (e.persisted) void joinRoom().catch(() => undefined); };
    window.addEventListener("pagehide", bye);
    window.addEventListener("pageshow", back);
    return () => { alive = false; stopAchievements(); stopBlocks(); window.removeEventListener("pagehide", bye); window.removeEventListener("pageshow", back); void leaveRoom(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.ready, auth.session?.user.id, Boolean(auth.profile), auth.profile?.profile_setup_done]);
  if (auth.profile && auth.profile.profile_setup_done === false) return <ProfileSetupDialog onDone={() => undefined} />;
  if (auth.profile && auth.profile.tutorial_done === false && !tutorialDone) {
    return (
      <TutorialTable
        viewerMale={auth.profile.male}
        viewerName={auth.profile.name}
        viewerPhoto={auth.profile.photo_url}
        onFinish={() => void finishTutorial()}
      />
    );
  }
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
      <SourceHaremNotice />
      {auth.session && <DailyBonusHost viewerId={auth.session.user.id} />}
      <img className="original-page-wood" src={woodTable} alt="" />
      <div className="original-game">
        <div className="original-table">
          <img className="original-table-wood" src={woodTable} alt="Oyunun sunucusundan alınan orijinal ahşap masa" />
          <TableSeats />
          <OriginalTableHeader />
        </div>
        <OriginalChatPanel />
      </div>
    </main>
  );
}
