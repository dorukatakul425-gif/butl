import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useAuth, refreshProfile } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_PHOTO } from "@/lib/ciliz-default-photo";
import bottleIcon from "@/assets/original-menu-bottle.svg";
import datCoin from "@/assets/dat-coin.png";
import { ArrowRight, Camera, Heart, LogOut, LoaderCircle } from "lucide-react";
import pattern from "@/assets/ui_loading_pattern.svg";

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
  const [notice, setNotice] = useState("");
  useEffect(() => { if (auth.ready && (!auth.session || !auth.profile)) void navigate({ to: "/auth" }); }, [auth.ready, auth.session, auth.profile, navigate]);
  const p = auth.profile;
  if (!p) return <main className="grid min-h-dvh place-items-center bg-background text-foreground">Yükleniyor…</main>;

  const upload = async (file: File) => {
    const sb = getSupabase();
    if (!sb) return;
    setUploading(true); setNotice("");
    try {
      if (!file.type.startsWith("image/")) throw new Error("Yalnız resim dosyası seçin.");
      if (file.size > 5 * 1024 * 1024) throw new Error("Resim 5 MB’den küçük olmalı.");
      const path = `${p.id}/${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
      const { error } = await sb.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw new Error("Fotoğraf yüklenemedi.");
      const { data: signed } = await sb.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365);
      if (!signed?.signedUrl) throw new Error("Fotoğraf yüklenemedi.");
      const { error: saved } = await sb.from("profiles").update({ photo_url: signed.signedUrl }).eq("id", p.id);
      if (saved) throw new Error("Fotoğraf kaydedilemedi.");
      await refreshProfile();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Fotoğraf yüklenemedi."); }
    finally { setUploading(false); }
  };

  return (
    <main className="profile-home">
      <div className="profile-home__inner">
        <header className="profile-home__header"><span className="profile-home__brand">Şişe<span>Oyunu</span></span>
          <Button variant="ghost" size="icon" aria-label="Çıkış yap" title="Çıkış yap" onClick={() => void signOut()}><LogOut size={20} /></Button>
        </header>
        <section className="profile-home__identity">
          <Button variant="ghost" disabled={uploading} onClick={() => fileRef.current?.click()} className="profile-home__avatar" aria-label="Fotoğraf değiştir">
            <img src={p.photo_url || DEFAULT_PHOTO} alt={p.name} />
            <span className="profile-home__camera">{uploading ? <LoaderCircle size={16} className="animate-spin" /> : <Camera size={16} />}</span>
          </Button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void upload(f); }} />
          <div className="profile-home__name"><p>Hoş geldin</p><h1>{p.name}{p.age ? <span>, {p.age}</span> : null}</h1><p>@{p.username} <span>· #{p.player_no}</span></p></div>
        </section>
        {notice && <p role="status" className="profile-home__notice">{notice}</p>}
        <section className="profile-home__wallet" aria-label="Bakiyeler">
          <div><Heart className="profile-home__heart" size={21} /><strong>{p.gold.toLocaleString("tr-TR")}</strong><span>Kalp</span></div>
          <div><span className="profile-home__kiss" aria-hidden="true">💋</span><strong>{p.kisses.toLocaleString("tr-TR")}</strong><span>Öpücük</span></div>
          <div><img src={datCoin} alt="" width={22} height={22} /><strong aria-label="DAT bakiyesi">{p.dat == null ? "—" : p.dat.toLocaleString("tr-TR")}</strong><span>DAT</span></div>
        </section>
        <section className="profile-home__play">
          <img src={pattern} alt="" className="profile-home__pattern" />
          <div className="profile-home__play-content"><span className="profile-home__eyebrow">MASA SENİ BEKLİYOR</span><h2>Şişe Oyunu</h2>
            <img src={bottleIcon} alt="Şişe" className="profile-home__bottle" />
            <Button asChild className="profile-home__join"><Link to="/game" aria-label="Şişe oyununu aç">Masaya gir <ArrowRight size={21} /></Link></Button>
          </div>
        </section>
        <footer className="profile-home__footer"><span>Oyuncu #{p.player_no}</span><span>Şişe Oyunu</span></footer>
      </div>
    </main>
  );
}
