import { createFileRoute } from "@tanstack/react-router";
import woodTable from "@/assets/original-wood-table.png.asset.json";
import { OriginalTableHeader } from "@/components/original-table-header";
import { OriginalChatPanel } from "@/components/original-chat-panel";
import { TableSeats } from "@/components/table/table-seats";
import { OriginalLoadingScreen } from "@/components/original-loading-screen";

import { SourceConnectionScreen } from "@/components/table/source-connection-screen";
import { SourceHeartBonus } from "@/components/table/source-heart-bonus";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orijinal Oyun Masası" },
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
  return (
    <main className="original-table-page" aria-label="Orijinal oyun masası">
      <OriginalLoadingScreen />
      <SourceConnectionScreen />
      <SourceHeartBonus />
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
