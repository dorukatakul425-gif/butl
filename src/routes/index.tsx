import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useAuth, refreshProfile } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_PHOTO } from "@/lib/ciliz-default-photo";
import bottleIcon from "@/assets/original-menu-bottle.svg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Şişe Oyunu — Ana Sayfa" },
      { name: "description", content: "Profilin, oyuncu numaran ve şişe oyununa giriş." },
      { property: "og:title", content: "Şişe Oyunu — Ana Sayfa" },
      { property: "og:description", content: "Şişe oyununa gir, gerçek oyuncularla oyna." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function Home() {
  const auth = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => { if (auth.ready && (!auth.session || !auth.profile)) void navigate({ to: "/auth" }); }, [auth.ready, auth.session, auth.profile, navigate]);
  const p = auth.profile;
  if (!p) return <main className="grid min-h-dvh place-items-center bg-background text-foreground">Yükleniyor…</main>;

  const upload = async (file: File) => {
    const sb = getSupabase();
    if (!sb) return;
    setUploading(true);
    const path = `${p.id}/${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
    const { error } = await sb.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (!error) {
      const url = sb.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      await sb.from("profiles").update({ photo_url: url }).eq("id", p.id);
      await refreshProfile();
    }
    setUploading(false);
  };

  return (
    <main className="min-h-dvh bg-background p-6 text-foreground">
      <div className="mx-auto max-w-md space-y-6">
        <section className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <button type="button" onClick={() => fileRef.current?.click()} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg" aria-label="Fotoğraf değiştir">
            <img src={p.photo_url || DEFAULT_PHOTO} alt={p.name} className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-background/70 text-xs">{uploading ? "…" : "Değiştir"}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) void upload(f); }} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold">{p.name}{p.age ? `, ${p.age}` : ""}</p>
            <p className="text-sm text-muted-foreground">@{p.username}</p>
            <p className="text-sm text-muted-foreground">ID: {p.player_no}</p>
            <p className="text-sm">💋 {p.kisses} · ❤ {p.gold}</p>
          </div>
        </section>
        <Link to="/game" className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6" aria-label="Şişe oyununu aç">
          <img src={bottleIcon.url} alt="" className="h-24 w-24" />
          <span className="font-bold">Şişe Oyunu</span>
        </Link>
        <Button variant="outline" className="w-full" onClick={() => void signOut()}>Çıkış yap</Button>
      </div>
    </main>
  );
}
