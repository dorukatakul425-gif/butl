import { gameError } from '@/lib/game-language';
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { refreshProfile } from "@/lib/auth";
import { telegramLogin } from "@/lib/telegram-auth.functions";
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute("/tg")({
  head: () => ({
    meta: [
      { title: "Deltagame.az — Telegram Girişi" },
      { name: "description", content: "Telegram vasitəsilə oyuna avtomatik giriş." },
      { property: "og:title", content: "Deltagame.az — Telegram" },
      { property: "og:description", content: "Telegram vasitəsilə oyuna avtomatik giriş." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TelegramEntry,
});

function TelegramEntry() {
  const navigate = useNavigate();
  const login = useServerFn(telegramLogin);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const run = async () => {
      const webApp = window.Telegram?.WebApp;
      const initData = webApp?.initData ?? "";
      if (!initData) {
        setError("Bu səhifə yalnız Telegram botu vasitəsilə açılır. Oyuna daxil olmaq üçün botdakı düyməyə basın.");
        return;
      }
      webApp?.ready?.();
      webApp?.expand?.();
      const sb = getSupabase();
      if (!sb) { setError("Xidmətə qoşulmaq mümkün deyil."); return; }
      try {
        const { tokenHash } = await login({ data: { initData } });
        const { error: otpError } = await sb.auth.verifyOtp({ token_hash: tokenHash, type: "magiclink" });
        if (otpError) throw otpError;
        await refreshProfile();
        if (alive) void navigate({ to: "/game" });
      } catch (e) {
        if (alive) setError(gameError(e));
      }
    };
    // The Telegram script loads async; wait a tick for it when needed.
    const timer = window.setTimeout(() => void run(), 300);
    return () => { alive = false; window.clearTimeout(timer); };
  }, [navigate, login]);

  return (
    <main className="grid min-h-dvh place-items-center bg-background p-6 text-center text-foreground">
      <p>{error || "Telegram hesabınızla oyuna qoşulursunuz…"}</p>
    </main>
  );
}
