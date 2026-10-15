import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound, LoaderCircle, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, refreshProfile } from "@/lib/auth";
import { getSupabase, normalizeUsername, usernameEmail } from "@/lib/supabase";
import bottle from "@/assets/ui_table_default_bottle.svg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Giriş və qeydiyyat — BUTL" },
      { name: "description", content: "BUTL hesabına istifadəçi adı və şifrənlə daxil ol və ya yeni hesab yarat." },
      { property: "og:title", content: "Giriş və qeydiyyat — BUTL" },
      { property: "og:description", content: "BUTL dünyasına qoşul. Hesabına daxil ol və ya qeydiyyatdan keç." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

// Scoped design tokens keep the rest of the game and its global theme unchanged.
const authStyles = `
.butl-auth {
  --auth-bg: oklch(0.17 0.008 175);
  --auth-text: oklch(0.98 0.003 175);
  --auth-muted: oklch(0.7 0.012 175);
  --auth-surface: oklch(0.225 0.009 175);
  --auth-border: oklch(0.32 0.01 175);
  --auth-brand: oklch(0.86 0.16 155);
  --auth-ink: oklch(0.2 0.035 155);
  --auth-error: oklch(0.79 0.12 25);
  --auth-error-bg: oklch(0.25 0.035 25);
  --auth-shadow: 0 6px 24px oklch(0.1 0.01 175 / 0.2);
  --background: var(--auth-bg);
  --foreground: var(--auth-text);
  --primary: var(--auth-brand);
  --primary-foreground: var(--auth-ink);
  --muted-foreground: var(--auth-muted);
  --accent: var(--auth-surface);
  --accent-foreground: var(--auth-text);
  --input: var(--auth-border);
  --ring: var(--auth-brand);
  --auth-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  box-sizing: border-box; width: 100%; min-height: 100svh; min-height: 100dvh;
  background: var(--auth-bg); color: var(--auth-text); font-family: var(--auth-font);
  letter-spacing: 0; overflow-x: clip; isolation: isolate;
  display: flex; flex-direction: column; align-items: center;
  padding: max(22px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left));
  -webkit-text-size-adjust: 100%;
}
.butl-auth *, .butl-auth *::before, .butl-auth *::after { box-sizing: border-box; letter-spacing: 0; }
.butl-auth .auth-top { width: 100%; max-width: 1040px; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; }
.butl-auth .auth-wordmark { margin: 0; font-size: 19px; font-weight: 800; }
.butl-auth .auth-locale { color: var(--auth-muted); font-size: 12px; font-weight: 600; display: flex; gap: 7px; align-items: center; }
.butl-auth .auth-locale-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--auth-brand); }
.butl-auth .auth-content { width: 100%; min-width: 0; max-width: 400px; margin: auto 0; padding: 30px 0; }
.butl-auth .auth-intro { text-align: center; margin-bottom: 28px; }
.butl-auth .auth-mark { width: 64px; height: 76px; object-fit: contain; display: block; margin: 0 auto 20px; transform: rotate(-16deg); filter: drop-shadow(var(--auth-shadow)); }
.butl-auth h1 { font-size: 32px; line-height: 1.18; font-weight: 750; margin: 0 0 12px; overflow-wrap: anywhere; }
.butl-auth .auth-subtitle { margin: 0; font-size: 14px; line-height: 1.6; color: var(--auth-muted); }
.butl-auth .auth-tabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 4px; background: var(--auth-surface); border: 1px solid var(--auth-border); border-radius: 8px; margin-bottom: 26px; }
.butl-auth .auth-tab { border: 0; height: 44px; min-width: 0; border-radius: 5px; background: transparent; color: var(--auth-muted); font-size: 14px; font-weight: 600; box-shadow: none; white-space: normal; }
.butl-auth .auth-tab[aria-pressed="true"] { background: var(--auth-bg); color: var(--auth-text); box-shadow: var(--auth-shadow); }
.butl-auth .auth-form { display: grid; gap: 20px; }
.butl-auth .auth-field { display: grid; gap: 8px; min-width: 0; }
.butl-auth .auth-label { color: var(--auth-text); font-size: 13px; font-weight: 600; line-height: 1.4; }
.butl-auth .auth-input-wrap { position: relative; min-width: 0; }
.butl-auth .auth-input { width: 100%; height: 54px; background: var(--auth-surface); border: 1px solid var(--auth-border); border-radius: 8px; color: var(--auth-text); font-family: inherit; font-size: 16px; line-height: 1.4; padding: 0 15px; box-shadow: none; }
.butl-auth .auth-input.with-icon { padding-left: 46px; }
.butl-auth .auth-input.password { padding-right: 54px; }
.butl-auth .auth-input::placeholder { color: var(--auth-muted); opacity: 0.75; }
.butl-auth .auth-input:focus-visible { outline: 2px solid var(--auth-brand); outline-offset: 2px; }
.butl-auth .auth-field-icon { position: absolute; left: 16px; top: 18px; width: 18px; height: 18px; color: var(--auth-muted); pointer-events: none; }
.butl-auth .auth-eye { border: 0; position: absolute; right: 5px; top: 5px; width: 44px; height: 44px; padding: 0; border-radius: 5px; background: transparent; color: var(--auth-muted); box-shadow: none; }
.butl-auth .auth-eye:hover { color: var(--auth-text); background: var(--auth-bg); }
.butl-auth .auth-eye svg { width: 19px; height: 19px; }
.butl-auth .auth-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 14px; }
.butl-auth .auth-gender { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.butl-auth .auth-gender-button { min-width: 0; height: 54px; padding: 0 10px; border: 1px solid var(--auth-border); background: var(--auth-surface); color: var(--auth-muted); border-radius: 8px; box-shadow: none; font-size: 14px; }
.butl-auth .auth-gender-button[aria-pressed="true"] { border-color: var(--auth-brand); color: var(--auth-brand); }
.butl-auth .auth-submit { width: 100%; min-height: 54px; height: auto; padding: 15px 20px; display: grid; grid-template-columns: 20px minmax(0, 1fr) 20px; gap: 10px; background: var(--auth-brand); color: var(--auth-ink); border: 0; border-radius: 8px; font-size: 16px; font-weight: 750; box-shadow: none; white-space: normal; margin-top: 4px; }
.butl-auth .auth-submit:hover { background: color-mix(in oklab, var(--auth-brand) 90%, var(--auth-text)); }
.butl-auth .auth-submit svg { width: 20px; height: 20px; }
.butl-auth .auth-submit:disabled { opacity: 0.6; }
.butl-auth .auth-error { display: grid; grid-template-columns: 18px minmax(0, 1fr); align-items: start; gap: 10px; padding: 12px; border-radius: 8px; background: var(--auth-error-bg); color: var(--auth-error); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
.butl-auth .auth-error svg { width: 18px; height: 18px; margin-top: 1px; }
.butl-auth .auth-switch { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; margin: 20px 0 0; font-size: 13px; line-height: 1.5; color: var(--auth-muted); }
.butl-auth .auth-switch-button { border: 0; background: transparent; min-height: 44px; height: auto; padding: 8px 4px; color: var(--auth-brand); font-size: 13px; font-weight: 600; white-space: normal; }
.butl-auth .auth-footer { display: flex; align-items: center; justify-content: center; gap: 7px; color: var(--auth-muted); font-size: 11px; line-height: 1.5; text-align: center; width: 100%; }
.butl-auth .auth-footer svg { width: 14px; height: 14px; flex-shrink: 0; }
.butl-auth .auth-spin { animation: auth-spin 0.8s linear infinite; }
@keyframes auth-spin { to { transform: rotate(360deg); } }
@media (min-width: 640px) { .butl-auth { padding: 32px 40px; } .butl-auth .auth-content { padding: 42px 0; } }
@media (max-height: 760px) { .butl-auth .auth-content { padding: 22px 0; } .butl-auth .auth-mark { width: 44px; height: 52px; margin-bottom: 12px; } .butl-auth .auth-intro { margin-bottom: 20px; } .butl-auth .auth-form { gap: 14px; } .butl-auth .auth-tabs { margin-bottom: 18px; } .butl-auth h1 { font-size: 28px; } }
@media (prefers-reduced-motion: reduce) { .butl-auth *, .butl-auth *::before, .butl-auth *::after { animation: none; transition: none; } }
`;

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
  const [showPassword, setShowPassword] = useState(false);
  const login = mode === "login";
  const unavailable = auth.ready && !auth.configured;

  useEffect(() => {
    if (auth.ready && auth.session && auth.profile) void navigate({ to: "/" });
  }, [auth.ready, auth.session, auth.profile, navigate]);

  const changeMode = (next: "login" | "register") => {
    if (busy || next === mode) return;
    setMode(next);
    setError("");
    setShowPassword(false);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const sb = getSupabase();
    if (!sb) { setError("Hazırda xidmətə qoşulmaq mümkün deyil. Bir az sonra yenidən cəhd et."); return; }
    const uname = normalizeUsername(username);
    if (uname.length < 3) { setError("İstifadəçi adı ən azı 3 hərf və ya rəqəmdən ibarət olmalıdır."); return; }
    if (password.length < 6) { setError("Şifrə ən azı 6 simvoldan ibarət olmalıdır."); return; }
    setBusy(true);
    setError("");
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email: usernameEmail(uname), password });
        if (error) setError("İstifadəçi adı və ya şifrə yanlışdır.");
      } else {
        const { data, error } = await sb.auth.signUp({
          email: usernameEmail(uname), password,
          options: { data: { username: uname, name: name.trim() || uname, male, age: age || null } },
        });
        if (error) setError(error.message.includes("registered") ? "Bu istifadəçi adı artıq istifadə olunur." : "Qeydiyyat alınmadı. Məlumatlarını yoxlayıb yenidən cəhd et.");
        else if (!data.session) setError("Hesab yaradıldı. Daxil olmaq üçün hesabın təsdiqlənməlidir.");
        else await refreshProfile();
      }
    } catch {
      setError("Bağlantıda problem yarandı. Yenidən cəhd et.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="butl-auth" lang="az">
      <style>{authStyles}</style>
      <header className="auth-top">
        <p className="auth-wordmark">BUTL<span aria-hidden="true">.</span></p>
        <span className="auth-locale"><span className="auth-locale-dot" aria-hidden="true" />AZ</span>
      </header>
      <section className="auth-content" aria-labelledby="auth-heading">
        <div className="auth-intro">
          <img src={bottle} alt="" className="auth-mark" width="64" height="76" aria-hidden="true" />
          <h1 id="auth-heading">{login ? "Yenidən xoş gəldin!" : "Tanışlıq buradan başlayır"}</h1>
          <p className="auth-subtitle">{login ? "Söhbətə qaldığın yerdən davam et." : "Öz hesabını yarat, yeni insanlarla tanış ol."}</p>
        </div>
        <div className="auth-tabs" role="group" aria-label="Hesaba giriş üsulu">
          <Button type="button" variant="ghost" className="auth-tab" aria-pressed={login} disabled={busy} onClick={() => changeMode("login")}>Giriş</Button>
          <Button type="button" variant="ghost" className="auth-tab" aria-pressed={!login} disabled={busy} onClick={() => changeMode("register")}>Qeydiyyat</Button>
        </div>
        <form className="auth-form" onSubmit={submit} aria-busy={busy}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-username">İstifadəçi adı</label>
            <div className="auth-input-wrap">
              <UserRound className="auth-field-icon" aria-hidden="true" />
              <Input id="auth-username" name="username" className="auth-input with-icon" placeholder="İstifadəçi adını yaz" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} disabled={busy} required />
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">Şifrə</label>
            <div className="auth-input-wrap">
              <LockKeyhole className="auth-field-icon" aria-hidden="true" />
              <Input id="auth-password" name="password" className="auth-input with-icon password" placeholder="Şifrəni yaz" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} autoComplete={login ? "current-password" : "new-password"} autoCapitalize="none" autoCorrect="off" spellCheck={false} disabled={busy} required />
              <Button type="button" variant="ghost" className="auth-eye" aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"} title={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)} disabled={busy}>{showPassword ? <EyeOff /> : <Eye />}</Button>
            </div>
          </div>
          {!login && <>
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-name">Oyunda görünən ad</label>
              <Input id="auth-name" name="name" className="auth-input" placeholder="Sənə necə müraciət edək?" value={name} onChange={e => setName(e.target.value)} maxLength={20} autoComplete="nickname" disabled={busy} />
            </div>
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-age">Yaş</label>
                <Input id="auth-age" name="age" className="auth-input" placeholder="Yaşın" type="number" inputMode="numeric" min={14} max={99} value={age} onChange={e => setAge(e.target.value)} disabled={busy} />
              </div>
              <div className="auth-field" role="group" aria-labelledby="auth-gender-label">
                <span id="auth-gender-label" className="auth-label">Cins</span>
                <div className="auth-gender">
                  <Button type="button" variant="outline" className="auth-gender-button" aria-pressed={male} disabled={busy} onClick={() => setMale(true)}>Kişi</Button>
                  <Button type="button" variant="outline" className="auth-gender-button" aria-pressed={!male} disabled={busy} onClick={() => setMale(false)}>Qadın</Button>
                </div>
              </div>
            </div>
          </>}
          {(error || unavailable) && <div className="auth-error" role="alert"><AlertCircle aria-hidden="true" /><span>{error || "Hazırda xidmətə qoşulmaq mümkün deyil. Bir az sonra yenidən cəhd et."}</span></div>}
          <Button type="submit" className="auth-submit" disabled={busy || unavailable}>
            <span aria-hidden="true" />
            <span>{busy ? "Bir az gözlə…" : login ? "Daxil ol" : "Hesab yarat"}</span>
            {busy ? <LoaderCircle className="auth-spin" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          </Button>
        </form>
        <div className="auth-switch">
          <span>{login ? "Hələ hesabın yoxdur?" : "Artıq hesabın var?"}</span>
          <Button type="button" variant="link" className="auth-switch-button" disabled={busy} onClick={() => changeMode(login ? "register" : "login")}>{login ? "Qeydiyyatdan keç" : "Daxil ol"}</Button>
        </div>
      </section>
      <footer className="auth-footer"><ShieldCheck aria-hidden="true" /><span>Şifrən heç vaxt digər oyunçulara göstərilmir.</span></footer>
    </main>
  );
}
