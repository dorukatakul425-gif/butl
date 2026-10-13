import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, refreshProfile } from "@/lib/auth";
import { getSupabase, normalizeUsername, usernameEmail } from "@/lib/supabase";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Giriş / Kayıt — Şişe Oyunu" },
      { name: "description", content: "Şişe oyununa kullanıcı adı ve şifrenle giriş yap ya da yeni hesap aç." },
      { property: "og:title", content: "Giriş / Kayıt — Şişe Oyunu" },
      { property: "og:description", content: "Kullanıcı adı ve şifre ile giriş yap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [male, setMale] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (auth.ready && auth.session && auth.profile) void navigate({ to: "/" }); }, [auth.ready, auth.session, auth.profile, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    const uname = normalizeUsername(username);
    if (uname.length < 3) { setError("Kullanıcı adı en az 3 harf/rakam olmalı."); return; }
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalı."); return; }
    setBusy(true); setError("");
    if (mode === "login") {
      const { error } = await sb.auth.signInWithPassword({ email: usernameEmail(uname), password });
      if (error) setError("Kullanıcı adı veya şifre yanlış.");
    } else {
      const { data, error } = await sb.auth.signUp({
        email: usernameEmail(uname), password,
        options: { data: { username: uname, name: name.trim() || uname, male, age: age || null } },
      });
      if (error) setError(error.message.includes("registered") ? "Bu kullanıcı adı alınmış." : error.message);
      else if (!data.session) setError("Supabase'de 'Confirm email' kapalı olmalı.");
      else await refreshProfile();
    }
    setBusy(false);
  };

  if (auth.ready && !auth.configured) {
    return <main className="grid min-h-dvh place-items-center bg-background p-6 text-center text-foreground">
      <p>Sunucu ayarlanmamış: VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY eklenmeli.</p>
    </main>;
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background p-6 text-foreground">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3 rounded-xl border border-border bg-card p-6">
        <h1 className="text-center text-2xl font-bold">{mode === "login" ? "Giriş yap" : "Kayıt ol"}</h1>
        <Input placeholder="Kullanıcı adı" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
        <Input placeholder="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
        {mode === "register" && <>
          <Input placeholder="Oyunda görünen isim" value={name} onChange={e => setName(e.target.value)} maxLength={20} />
          <Input placeholder="Yaş" type="number" min={14} max={99} value={age} onChange={e => setAge(e.target.value)} />
          <div className="flex gap-2">
            <Button type="button" variant={male ? "default" : "outline"} className="flex-1" onClick={() => setMale(true)}>Erkek</Button>
            <Button type="button" variant={!male ? "default" : "outline"} className="flex-1" onClick={() => setMale(false)}>Kadın</Button>
          </div>
        </>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Bekle…" : mode === "login" ? "Giriş yap" : "Kayıt ol"}</Button>
        <button type="button" className="w-full text-sm text-muted-foreground underline" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
          {mode === "login" ? "Hesabın yok mu? Kayıt ol" : "Hesabın var mı? Giriş yap"}
        </button>
      </form>
    </main>
  );
}
