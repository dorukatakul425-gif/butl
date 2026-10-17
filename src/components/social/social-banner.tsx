import { MessageCircle, UserPlus, UserCheck, X } from "lucide-react";
import { translate, usePreferences } from "@/lib/app-preferences";
import { dismissNotice, openSocialNotice, useSocial } from "@/lib/social";

// In-app notification cards (phone-notification style) for messages and friend requests.
export function SocialBanner({ defaultPhoto }: { defaultPhoto: string }) {
  usePreferences();
  const { notices } = useSocial();
  if (!notices.length) return null;
  return <div className="sb-stack" aria-live="polite">
    <style>{SB_STYLES}</style>
    {notices.map(n => {
      const Icon = n.kind === "message" ? MessageCircle : n.kind === "request" ? UserPlus : UserCheck;
      return <div key={n.id} className="sb-card" role="status">
        <button type="button" className="sb-main" onClick={() => { dismissNotice(n.id); openSocialNotice(n); }}>
          <span className="sb-photo"><img src={n.photo || defaultPhoto} alt="" /><span className={"sb-kind sb-" + n.kind}><Icon size={11} strokeWidth={2.6} /></span></span>
          <span className="sb-text">
            <span className="sb-app">DeltaGame · {translate("indi")}</span>
            <strong>{n.title}</strong>
            <span className="sb-body">{n.body}</span>
          </span>
        </button>
        <button type="button" className="sb-close" aria-label={translate("Bağla")} onClick={() => dismissNotice(n.id)}><X size={15} /></button>
      </div>;
    })}
  </div>;
}

const SB_STYLES = `
.sb-stack{position:fixed;top:max(10px,env(safe-area-inset-top));left:0;right:0;z-index:80;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;padding:0 10px;}
.sb-card{pointer-events:auto;position:relative;width:min(100%,440px);display:flex;align-items:center;border-radius:20px;background:color-mix(in oklch,var(--surface) 90%,transparent);backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);border:1px solid var(--border);box-shadow:0 14px 40px oklch(.2 .04 260 / .22);animation:sb-in .42s cubic-bezier(.2,1.2,.3,1) both;}
.sb-main{all:unset;cursor:pointer;flex:1;min-width:0;display:flex;align-items:center;gap:11px;padding:11px 8px 11px 12px;}
.sb-photo{position:relative;flex:0 0 42px;height:42px;}
.sb-photo img{width:42px;height:42px;border-radius:50%;object-fit:cover;background:var(--background);}
.sb-kind{position:absolute;right:-3px;bottom:-3px;width:19px;height:19px;border-radius:50%;display:grid;place-items:center;color:var(--primary-foreground);background:var(--primary);border:2px solid var(--surface);}
.sb-kind.sb-request{background:var(--heart);}
.sb-text{display:flex;flex-direction:column;min-width:0;gap:1px;}
.sb-app{font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:var(--muted-foreground);}
.sb-text strong{font-size:14px;color:var(--foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sb-body{font-size:13px;color:var(--muted-foreground);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.sb-close{all:unset;cursor:pointer;display:grid;place-items:center;width:30px;height:30px;margin-right:8px;border-radius:50%;color:var(--muted-foreground);}
.sb-close:hover{background:var(--accent);}
@keyframes sb-in{from{transform:translateY(-120%) scale(.96);opacity:0;}}
@media(prefers-reduced-motion:reduce){.sb-card{animation:none;}}
`;
