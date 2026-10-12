import { createFileRoute } from "@tanstack/react-router";
import woodTable from "@/assets/original-wood-table.png.asset.json";
import { OriginalTableHeader } from "@/components/original-table-header";
import { OriginalChatPanel } from "@/components/original-chat-panel";
import { TableSeats } from "@/components/table/table-seats";
import { OriginalLoadingScreen } from "@/components/original-loading-screen";
import { useGameViewport } from "@/lib/game-viewport";
import { useCloudAccount, leaveRoom } from '@/lib/cloud-account';
import { useCloudRoom } from '@/lib/cloud-room';
import { AuthScreen } from '@/components/account/auth-screen';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orijinal Oyun Masası" },
      { name: "description", content: "Oyunun sunucusundan alınan orijinal ahşap masa ve masa ikonları." },
      { property: "og:title", content: "Orijinal Oyun Masası" },
      { property: "og:description", content: "Orijinal ahşap oyun masası ve sunucu görselleri." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: woodTable.url },
      { name: "twitter:image", content: woodTable.url },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, loading } = useCloudAccount();
  if (loading) return <main className="account-page"><p role="status">Hesabın yükleniyor…</p></main>;
  if (!user) return <AuthScreen />;
  return <LiveGame />;
}
function LiveGame() {
  useGameViewport();
  const { room, error } = useCloudRoom();
  const navigate = useNavigate();
  return (
    <main className="original-table-page" aria-label="Orijinal oyun masası">
      <OriginalLoadingScreen />
      <img className="original-page-wood" src={woodTable.url} alt="" />
      <div className="original-game">
        <div className="original-table">
          <img className="original-table-wood" src={woodTable.url} alt="Oyunun sunucusundan alınan orijinal ahşap masa" />
          <TableSeats room={room} />
          <OriginalTableHeader />
        </div>
        <OriginalChatPanel />
      </div>
      {error && <p className="cloud-room-notice" role="alert">{error}</p>}
      {!room && !error && <p className="cloud-room-notice" role="status">Masaya bağlanılıyor…</p>}
      <Button variant="ghost" size="icon" className="game-exit" aria-label="Ana sayfaya dön" title="Ana sayfaya dön" onClick={async () => { await leaveRoom(); await navigate({ to: '/home' }); }}><LogOut size={18} /></Button>
    </main>
  );
}
