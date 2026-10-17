import { useEffect, useState, type ReactNode } from "react";
import { ShieldBan, Clock, Infinity as InfinityIcon, LogOut } from "lucide-react";
import { useAuth, signOut } from "@/lib/auth";
import { useBan, checkOwnBan, clearBan, type BanInfo } from "@/lib/ban";

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
  const ms = Math.max(0, new Date(until).getTime() - now);
  const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000) % 24, m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return { ms, parts: [[d, "gün"], [h, "saat"], [m, "dəq"], [s, "san"]] as const };
}

const fmt = (iso: string) => new Date(iso).toLocaleString("az-AZ", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function BanScreen({ ban }: { ban: BanInfo }) {
  const left = useCountdown(ban.banned_until);
  useEffect(() => { if (left && left.ms === 0) clearBan(); }, [left]);
  return (
    <div className="ban-screen fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-background p-5 text-foreground">
      <style>{banStyles}</style>
      <div className="ban-glow" aria-hidden />
      <div className="ban-card relative w-full max-w-md rounded-3xl border border-destructive/30 bg-card/90 p-7 text-center text-card-foreground shadow-2xl backdrop-blur">
        <div className="ban-icon mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <ShieldBan className="h-12 w-12" strokeWidth={1.75} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Hesabınız bloklanıb</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {ban.username ? <>@{ban.username} hesabı </> : "Hesabınız "}oyun qaydalarını pozduğu üçün administrator tərəfindən bloklanıb.
        </p>

        <div className="mt-6 rounded-2xl border bg-muted/50 p-4 text-left">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Səbəb</div>
          <div className="mt-1 text-sm font-medium">{ban.reason?.trim() || "Səbəb göstərilməyib"}</div>
          <div className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tarix</div>
          <div className="mt-1 text-sm">{fmt(ban.banned_at)}</div>
        </div>

        {left ? (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Blokun bitməsinə qalıb</div>
            <div className="grid grid-cols-4 gap-2">
              {left.parts.map(([v, l]) => (
                <div key={l} className="rounded-xl bg-destructive/10 py-2">
                  <div className="text-xl font-bold tabular-nums text-destructive">{String(v).padStart(2, "0")}</div>
                  <div className="text-[10px] text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{fmt(ban.banned_until!)}</div>
          </div>
        ) : (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-1.5 text-sm font-semibold text-destructive-foreground">
            <InfinityIcon className="h-4 w-4" /> Daimi blok
          </div>
        )}

        <p className="mt-6 text-xs text-muted-foreground">Bunun səhv olduğunu düşünürsünüzsə, administrasiya ilə əlaqə saxlayın.</p>
        <button
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-4 py-3 text-sm font-medium transition hover:bg-accent"
          onClick={() => { clearBan(); void signOut(); }}
        >
          <LogOut className="h-4 w-4" /> Başqa hesabla daxil ol
        </button>
      </div>
    </div>
  );
}

const banStyles = `
.ban-glow{position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,color-mix(in oklch,var(--destructive) 35%,transparent),transparent 70%);filter:blur(40px);animation:banPulse 4s ease-in-out infinite}
.ban-card{animation:banIn .5s cubic-bezier(.2,.9,.3,1.2) both}
.ban-icon{animation:banShake 2.8s ease-in-out .6s infinite;box-shadow:0 0 0 0 color-mix(in oklch,var(--destructive) 40%,transparent)}
@keyframes banIn{from{opacity:0;transform:translateY(24px) scale(.95)}to{opacity:1;transform:none}}
@keyframes banPulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.9;transform:scale(1.12)}}
@keyframes banShake{0%,86%,100%{transform:rotate(0)}89%{transform:rotate(-8deg)}92%{transform:rotate(8deg)}95%{transform:rotate(-4deg)}}
`;
