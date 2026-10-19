import { useEffect, useState, type ReactNode } from "react";
import { useAuth, signOut } from "@/lib/auth";
import { useBan, checkOwnBan, clearBan, formatBanRemaining, type BanInfo } from "@/lib/ban";
import banMaleUrl from "@/assets/ban-male.svg";
import banFemaleUrl from "@/assets/ban-female.svg";

/** Wraps the app: checks the player's ban on sign-in, every 20 s and on focus. */
export function BanGuard({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const ban = useBan();
  const uid = auth.session?.user.id;
  useEffect(() => {
    if (!uid) return;
    void checkOwnBan();
    const t = setInterval(() => void checkOwnBan(), 20000);
    const f = () => void checkOwnBan();
    window.addEventListener("focus", f);
    return () => { clearInterval(t); window.removeEventListener("focus", f); };
  }, [uid]);
  if (ban) return <BanScreen ban={ban} />;
  return <>{children}</>;
}

function useCountdown(until: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [until]);
  if (!until) return null;
  return Math.max(0, new Date(until).getTime() - now);
}

/**
 * Ban screen — pixel-faithful copy of the Ciliz original: darkened backdrop
 * (65 %), white card, gendered illustration, remaining time in red, green
 * outlined "Çıxış" button. Tapping outside does not close it.
 */
export function BanScreen({ ban }: { ban: BanInfo }) {
  const ms = useCountdown(ban.banned_until);
  useEffect(() => { if (ms === 0) clearBan(); }, [ms]);
  const left = ms !== null && ms > 0 ? formatBanRemaining(ms) : null;
  const illustration = ban.male === false ? banFemaleUrl : banMaleUrl;
  return (
    <div className="ban-screen fixed inset-0 z-[9999] flex items-center justify-center p-5" style={{ background: "rgba(0,0,0,.65)" }}>
      <style>{banStyles}</style>
      <div className="ban-card w-full max-w-[340px] rounded-2xl bg-white px-6 pb-7 pt-8 text-center shadow-2xl">
        <h1 className="text-[22px] font-bold leading-tight text-[#9a9a9a]">Hesabınız bloklanıb</h1>
        <img src={illustration} alt="" width={110} height={110} className="mx-auto my-6 block" draggable={false} />
        <p className="text-[15px] leading-snug text-[#3c3c3c]">
          {left ? (
            <>
              Blokun bitməsinə:{" "}
              <span className="font-bold text-[#e23b2e]">
                {left.value} {left.unit}
              </span>
            </>
          ) : (
            <span className="font-bold text-[#e23b2e]">Daimi blok</span>
          )}
        </p>
        <p className="mt-1 text-[15px] leading-snug text-[#3c3c3c]">
          Səbəb: {ban.reason?.trim() || "Oyun qaydalarının pozulması"}
        </p>
        <button
          type="button"
          className="ban-exit mx-auto mt-6 block rounded-xl border-2 border-[#97ca31] bg-white px-10 py-2.5 text-[16px] font-medium text-[#97ca31] transition-colors hover:bg-[#97ca31] hover:text-white"
          onClick={() => { clearBan(); void signOut(); }}
        >
          Çıxış
        </button>
      </div>
    </div>
  );
}

const banStyles = `
.ban-card{animation:banIn .45s cubic-bezier(.2,.9,.3,1.15) both}
.ban-exit:active{transform:scale(.96)}
@keyframes banIn{from{opacity:0;transform:translateY(24px) scale(.95)}to{opacity:1;transform:none}}
`;
