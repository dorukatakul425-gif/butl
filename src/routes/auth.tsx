import { AppControls } from "@/components/app-controls";
import { useAppTranslation, usePreferences } from "@/lib/app-preferences";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { checkBanForUsername, isBanError } from "@/lib/ban";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound, LoaderCircle, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, refreshProfile } from "@/lib/auth";
import { getSupabase, normalizeUsername, usernameEmail } from "@/lib/supabase";
const bottle = "https://deltagame.az/deltagame-icon-512.png";
import authLogo from "@/assets/auth-logo.png";

function LiveIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M9.5 9.5a9.2 9.2 0 0 0 0 13" />
      <path d="M22.5 9.5a9.2 9.2 0 0 1 0 13" />
      <path d="M5.2 5.2a15.3 15.3 0 0 0 0 21.6" opacity="0.55" />
      <path d="M26.8 5.2a15.3 15.3 0 0 1 0 21.6" opacity="0.55" />
      <circle className="auth-live-dot" cx="16" cy="16" r="4" stroke="none" />
    </svg>
  );
}

export const Route = createFileRoute("/auth")({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" },
      { rel: "icon", type: "image/png", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/deltagame-icon-512.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    meta: [
      { title: "Deltagame.az — Şüşə oyunu" },
      { name: "description", content: "Deltagame.az-da şüşəni fırlat, yeni insanlarla tanış ol və əyləncənin dadını çıxar." },
      { property: "og:title", content: "Deltagame.az — Şüşə oyunu" },
      { property: "og:description", content: "Deltagame.az — hər fırlanış yeni tanışlıq, hər oyun unudulmaz bir an. Şüşəni fırlat və əyləncəyə qoşul!" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: bottle },
      { property: "og:image:alt", content: "Deltagame.az şişə ikonu" },
      { name: "twitter:image", content: bottle },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

// Scoped design tokens keep the rest of the game and its global theme unchanged.
const authStyles = `
.butl-auth {
  --auth-bg: oklch(0.2 0.045 20);
  --auth-bg-2: oklch(0.13 0.03 15);
  --auth-glow-1: oklch(0.62 0.21 25 / 0.45);
  --auth-glow-2: oklch(0.7 0.17 145 / 0.3);
  --auth-highlight: oklch(0.86 0.13 75);
  --auth-headline: linear-gradient(100deg, oklch(0.97 0.02 80) 0%, oklch(0.88 0.12 70) 60%, oklch(0.8 0.16 40) 100%);
  --auth-text: oklch(0.98 0.005 60);
  --auth-muted: oklch(0.78 0.02 40);
  --auth-sheet: oklch(0.22 0.03 20 / 0.72);
  --auth-surface: oklch(1 0 0 / 0.07);
  --auth-surface-2: oklch(1 0 0 / 0.12);
  --auth-border: oklch(1 0 0 / 0.13);
  --auth-brand: oklch(0.66 0.21 25);
  --auth-brand-2: oklch(0.58 0.22 15);
  --auth-brand-grad: linear-gradient(135deg, oklch(0.72 0.19 35) 0%, oklch(0.6 0.23 20) 100%);
  --auth-ink: oklch(0.99 0 0);
  --auth-live: oklch(0.64 0.24 25);
  --auth-error: oklch(0.85 0.1 25);
  --auth-error-bg: oklch(0.4 0.12 25 / 0.35);
  --auth-shadow: 0 18px 50px oklch(0.05 0.02 20 / 0.55);
  --auth-btn-shadow: 0 10px 28px oklch(0.6 0.22 25 / 0.45);
  --background: var(--auth-bg);
  --foreground: var(--auth-text);
  --primary: var(--auth-brand);
  --primary-foreground: var(--auth-ink);
  --muted-foreground: var(--auth-muted);
  --accent: var(--auth-surface);
  --accent-foreground: var(--auth-text);
  --input: var(--auth-border);
  --ring: var(--auth-brand);
  --auth-font: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  box-sizing: border-box; width: 100%; min-height: 100svh; min-height: 100dvh;
  position: relative;
  background:
    radial-gradient(120% 60% at 0% 0%, var(--auth-glow-1), transparent 60%),
    radial-gradient(90% 50% at 100% 100%, var(--auth-glow-2), transparent 60%),
    linear-gradient(180deg, var(--auth-bg) 0%, var(--auth-bg-2) 100%);
  color: var(--auth-text); font-family: var(--auth-font);
  letter-spacing: 0; overflow-x: clip; isolation: isolate;
  display: flex; flex-direction: column; align-items: center;
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  -webkit-text-size-adjust: 100%;
}
.butl-auth *, .butl-auth *::before, .butl-auth *::after { box-sizing: border-box; letter-spacing: 0; }
.butl-auth .auth-top { width: 100%; max-width: 440px; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; }
.butl-auth .auth-wordmark { margin: 0; font-size: 20px; line-height: 1.3; font-weight: 800; white-space: nowrap; }
.butl-auth .auth-wordmark span { color: var(--auth-highlight); font-weight: 600; }
.butl-auth .auth-content { width: 100%; min-width: 0; max-width: 440px; margin: auto 0; padding: 20px 0; }
.butl-auth .auth-intro { text-align: center; margin-bottom: 22px; }
.butl-auth .auth-brand-row { display: flex; align-items: center; justify-content: center; gap: 14px; margin: 0 auto 18px; }
.butl-auth .auth-mark { width: 96px; height: 96px; object-fit: cover; display: block; border-radius: 26px; box-shadow: var(--auth-shadow), 0 0 0 3px oklch(1 0 0 / 0.12); animation: auth-float 4s ease-in-out infinite; }
.butl-auth .auth-live { position: relative; width: 64px; height: 64px; border-radius: 20px; display: grid; place-items: center; background: var(--auth-surface-2); border: 1px solid var(--auth-border); box-shadow: var(--auth-shadow); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.butl-auth .auth-live svg { width: 34px; height: 34px; color: var(--auth-text); }
.butl-auth .auth-live-dot { fill: var(--auth-live); transform-origin: center; animation: auth-pulse 1.4s ease-in-out infinite; }
.butl-auth .auth-live-label { position: absolute; bottom: -9px; left: 50%; transform: translateX(-50%); padding: 2px 7px; border-radius: 999px; background: var(--auth-live); color: var(--auth-ink); font-size: 9px; font-weight: 800; line-height: 1.4; text-transform: uppercase; white-space: nowrap; box-shadow: 0 4px 12px oklch(0.6 0.24 25 / 0.5); }
.butl-auth h1 { font-size: 26px; line-height: 1.25; font-weight: 800; margin: 0 0 8px; overflow-wrap: break-word; text-wrap: balance; color: var(--auth-highlight); }
@supports (background-clip: text) { .butl-auth h1 { background: var(--auth-headline); background-clip: text; -webkit-background-clip: text; color: transparent; } }
.butl-auth .auth-subtitle { margin: 0; font-size: 14px; line-height: 1.55; color: var(--auth-muted); }
.butl-auth .auth-sheet { background: var(--auth-sheet); border: 1px solid var(--auth-border); border-radius: 28px; padding: 18px; box-shadow: var(--auth-shadow); backdrop-filter: blur(18px) saturate(140%); -webkit-backdrop-filter: blur(18px) saturate(140%); }
.butl-auth .auth-tabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 5px; background: var(--auth-surface); border: 1px solid var(--auth-border); border-radius: 999px; margin-bottom: 20px; }
.butl-auth .auth-tab { border: 0; height: 42px; min-width: 0; border-radius: 999px; background: transparent; color: var(--auth-muted); font-size: 14px; font-weight: 700; box-shadow: none; white-space: normal; transition: background .2s, color .2s; }
.butl-auth .auth-tab:hover { background: var(--auth-surface); color: var(--auth-text); }
.butl-auth .auth-tab[aria-pressed="true"] { background: var(--auth-brand-grad); color: var(--auth-ink); box-shadow: var(--auth-btn-shadow); }
.butl-auth .auth-form { display: grid; gap: 14px; }
.butl-auth .auth-field { display: grid; gap: 7px; min-width: 0; }
.butl-auth .auth-label { color: var(--auth-muted); font-size: 12px; font-weight: 700; line-height: 1.4; padding-left: 4px; }
.butl-auth .auth-input-wrap { position: relative; min-width: 0; }
.butl-auth .auth-input { width: 100%; height: 54px; background: var(--auth-surface); border: 1px solid var(--auth-border); border-radius: 16px; color: var(--auth-text); font-family: inherit; font-size: 16px; line-height: 1.4; padding: 0 16px; box-shadow: none; transition: border-color .2s, background .2s; }
.butl-auth .auth-input:focus { background: var(--auth-surface-2); border-color: var(--auth-brand); }
.butl-auth .auth-input.with-icon { padding-left: 48px; }
.butl-auth .auth-input.password { padding-right: 54px; }
.butl-auth .auth-input::placeholder { color: var(--auth-muted); opacity: 0.7; }
.butl-auth .auth-input:focus-visible { outline: none; box-shadow: 0 0 0 4px oklch(0.66 0.21 25 / 0.25); }
.butl-auth .auth-field-icon { position: absolute; left: 17px; top: 18px; width: 18px; height: 18px; color: var(--auth-muted); pointer-events: none; }
.butl-auth .auth-eye { border: 0; position: absolute; right: 5px; top: 5px; width: 44px; height: 44px; padding: 0; border-radius: 12px; background: transparent; color: var(--auth-muted); box-shadow: none; }
.butl-auth .auth-eye:hover { color: var(--auth-text); background: var(--auth-surface); }
.butl-auth .auth-eye svg { width: 19px; height: 19px; }
.butl-auth .auth-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 12px; }
.butl-auth .auth-gender { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.butl-auth .auth-gender-button { min-width: 0; height: 54px; padding: 0 8px; border: 1px solid var(--auth-border); background: var(--auth-surface); color: var(--auth-muted); border-radius: 16px; box-shadow: none; font-size: 14px; font-weight: 700; }
.butl-auth .auth-gender-button:hover { background: var(--auth-surface-2); color: var(--auth-text); }
.butl-auth .auth-gender-button[aria-pressed="true"] { border-color: var(--auth-brand); color: var(--auth-text); background: oklch(0.66 0.21 25 / 0.22); }
.butl-auth .auth-submit { width: 100%; min-height: 56px; height: auto; padding: 15px 20px; display: grid; grid-template-columns: 20px minmax(0, 1fr) 20px; gap: 10px; background: var(--auth-brand-grad); color: var(--auth-ink); border: 0; border-radius: 18px; font-size: 16px; font-weight: 800; box-shadow: var(--auth-btn-shadow); white-space: normal; margin-top: 6px; transition: transform .15s, filter .2s; }
.butl-auth .auth-submit:hover { filter: brightness(1.07); }
.butl-auth .auth-submit:active { transform: scale(0.98); }
.butl-auth .auth-submit svg { width: 20px; height: 20px; }
.butl-auth .auth-submit:disabled { opacity: 0.6; }
.butl-auth .auth-error { display: grid; grid-template-columns: 18px minmax(0, 1fr); align-items: start; gap: 10px; padding: 12px; border-radius: 14px; background: var(--auth-error-bg); color: var(--auth-error); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
.butl-auth .auth-error svg { width: 18px; height: 18px; margin-top: 1px; }
.butl-auth .auth-switch { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; margin: 12px 0 0; font-size: 13px; line-height: 1.5; color: var(--auth-muted); }
.butl-auth .auth-switch-button { border: 0; background: transparent; min-height: 44px; height: auto; padding: 8px 4px; color: var(--auth-highlight); font-size: 13px; font-weight: 700; white-space: normal; }
.butl-auth .auth-footer { max-width: 440px; flex-wrap: wrap; display: flex; align-items: center; justify-content: center; gap: 7px; color: var(--auth-muted); font-size: 11px; line-height: 1.5; text-align: center; width: 100%; }
.butl-auth .auth-footer-brand { flex-basis: 100%; margin: 0 0 6px; font-size: 12px; line-height: 1.6; color: var(--auth-muted); }
.butl-auth .auth-footer-brand strong { color: var(--auth-highlight); font-weight: 700; }
.butl-auth .auth-footer svg { width: 14px; height: 14px; flex-shrink: 0; }
.butl-auth .auth-spin { animation: auth-spin 0.8s linear infinite; }
@keyframes auth-spin { to { transform: rotate(360deg); } }
@keyframes auth-float { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
@keyframes auth-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.8); } }
@media (min-width: 640px) { .butl-auth { padding: 28px 40px; } .butl-auth .auth-sheet { padding: 24px; } }
@media (max-height: 720px) { .butl-auth .auth-content { padding: 12px 0; } .butl-auth .auth-mark { width: 72px; height: 72px; border-radius: 20px; } .butl-auth .auth-live { width: 52px; height: 52px; border-radius: 16px; } .butl-auth .auth-intro { margin-bottom: 14px; } .butl-auth .auth-form { gap: 10px; } .butl-auth h1 { font-size: 22px; } }
@media (prefers-reduced-motion: reduce) { .butl-auth *, .butl-auth *::before, .butl-auth *::after { animation: none !important; transition: none !important; } }
`;

function AuthPage() {
  const preferences = usePreferences();
  const t = useAppTranslation();
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
    if (!sb) { setError(t("Hazırda xidmətə qoşulmaq mümkün deyil. Bir az sonra yenidən cəhd et.")); return; }
    const uname = normalizeUsername(username);
    if (uname.length < 3) { setError(t("İstifadəçi adı ən azı 3 hərf və ya rəqəmdən ibarət olmalıdır.")); return; }
    if (password.length < 6) { setError(t("Şifrə ən azı 6 simvoldan ibarət olmalıdır.")); return; }
    setBusy(true);
    setError("");
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email: usernameEmail(uname), password });
        if (error && !(await checkBanForUsername(uname)) && !isBanError(error.message)) setError(t("İstifadəçi adı və ya şifrə yanlışdır."));
      } else {
        const { data, error } = await sb.auth.signUp({
          email: usernameEmail(uname), password,
          options: { data: { username: uname, name: name.trim() || uname, male, age: age || null } },
        });
        if (error) setError(error.message.includes("registered") ? t("Bu istifadəçi adı artıq istifadə olunur.") : t("Qeydiyyat alınmadı. Məlumatlarını yoxlayıb yenidən cəhd et."));
        else if (!data.session) setError(t("Hesab yaradıldı. Daxil olmaq üçün hesabın təsdiqlənməlidir."));
        else await refreshProfile();
      }
    } catch {
      setError(t("Bağlantıda problem yarandı. Yenidən cəhd et."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="butl-auth" lang={preferences.language}>
      <style>{authStyles}</style>
      <header className="auth-top">
        <p className="auth-wordmark">Deltagame<span>.az</span></p>
        <AppControls />
      </header>
      <section className="auth-content" aria-labelledby="auth-heading">
        <div className="auth-intro">
          <div className="auth-brand-row">
            <img src={authLogo} alt="Deltagame.az" className="auth-mark" width="96" height="96" />
            <span className="auth-live" role="img" aria-label={t("Canlı")}><LiveIcon /><span className="auth-live-label">{t("Canlı")}</span></span>
          </div>
          <h1 id="auth-heading">{login ? t("Əyləncənin dadını çıxarmağa hazırsan?") : t("Tanışlıq buradan başlayır")}</h1>
          <p className="auth-subtitle">{login ? t("Söhbətə qaldığın yerdən davam et.") : t("Öz hesabını yarat, yeni insanlarla tanış ol.")}</p>
        </div>
        <div className="auth-sheet">
        <div className="auth-tabs" role="group" aria-label={t("Hesaba giriş üsulu")}>
          <Button type="button" variant="ghost" className="auth-tab" aria-pressed={login} disabled={busy} onClick={() => changeMode("login")}>{t("Giriş")}</Button>
          <Button type="button" variant="ghost" className="auth-tab" aria-pressed={!login} disabled={busy} onClick={() => changeMode("register")}>{t("Qeydiyyat")}</Button>
        </div>
        <form className="auth-form" onSubmit={submit} aria-busy={busy}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-username">{t("İstifadəçi adı")}</label>
            <div className="auth-input-wrap">
              <UserRound className="auth-field-icon" aria-hidden="true" />
              <Input id="auth-username" name="username" className="auth-input with-icon" placeholder={t("İstifadəçi adını yaz")} value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} disabled={busy} required />
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">{t("Şifrə")}</label>
            <div className="auth-input-wrap">
              <LockKeyhole className="auth-field-icon" aria-hidden="true" />
              <Input id="auth-password" name="password" className="auth-input with-icon password" placeholder={t("Şifrəni yaz")} type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} autoComplete={login ? "current-password" : "new-password"} autoCapitalize="none" autoCorrect="off" spellCheck={false} disabled={busy} required />
              <Button type="button" variant="ghost" className="auth-eye" aria-label={showPassword ? t("Şifrəni gizlət") : t("Şifrəni göstər")} title={showPassword ? t("Şifrəni gizlət") : t("Şifrəni göstər")} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)} disabled={busy}>{showPassword ? <EyeOff /> : <Eye />}</Button>
            </div>
          </div>
          {!login && <>
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-name">{t("Oyunda görünən ad")}</label>
              <Input id="auth-name" name="name" className="auth-input" placeholder={t("Sənə necə müraciət edək?")} value={name} onChange={e => setName(e.target.value)} maxLength={20} autoComplete="nickname" disabled={busy} />
            </div>
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-age">{t("Yaş")}</label>
                <Input id="auth-age" name="age" className="auth-input" placeholder={t("Yaşın")} type="number" inputMode="numeric" min={14} max={99} value={age} onChange={e => setAge(e.target.value)} disabled={busy} />
              </div>
              <div className="auth-field" role="group" aria-labelledby="auth-gender-label">
                <span id="auth-gender-label" className="auth-label">{t("Cins")}</span>
                <div className="auth-gender">
                  <Button type="button" variant="outline" className="auth-gender-button" aria-pressed={male} disabled={busy} onClick={() => setMale(true)}>{t("Kişi")}</Button>
                  <Button type="button" variant="outline" className="auth-gender-button" aria-pressed={!male} disabled={busy} onClick={() => setMale(false)}>{t("Qadın")}</Button>
                </div>
              </div>
            </div>
          </>}
          {(error || unavailable) && <div className="auth-error" role="alert"><AlertCircle aria-hidden="true" /><span>{error || t("Hazırda xidmətə qoşulmaq mümkün deyil. Bir az sonra yenidən cəhd et.")}</span></div>}
          <Button type="submit" className="auth-submit" disabled={busy || unavailable}>
            <span aria-hidden="true" />
            <span>{busy ? t("Bir az gözlə…") : login ? t("Daxil ol") : t("Hesab yarat")}</span>
            {busy ? <LoaderCircle className="auth-spin" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          </Button>
        </form>
        </div>
        <div className="auth-switch">
          <span>{login ? t("Hələ hesabın yoxdur?") : t("Artıq hesabın var?")}</span>
          <Button type="button" variant="link" className="auth-switch-button" disabled={busy} onClick={() => changeMode(login ? "register" : "login")}>{login ? t("Qeydiyyatdan keç") : t("Daxil ol")}</Button>
        </div>
      </section>
      <footer className="auth-footer"><p className="auth-footer-brand"><strong>Deltagame.az</strong> — {t("hər fırlanış yeni tanışlıq, hər oyun unudulmaz bir an. Şüşəni fırlat və əyləncəyə qoşul!")}</p><ShieldCheck aria-hidden="true" /><span>{t("Şifrən heç vaxt digər oyunçulara göstərilmir.")}</span></footer>
    </main>
  );
}
