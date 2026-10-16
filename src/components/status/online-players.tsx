// Live player counter shown under the join button in the robot popup.
import { useOnlinePlayers } from "@/lib/online-players";

function BoyIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="op-ico"><circle cx="12" cy="8" r="4.2" fill="currentColor" /><path d="M7.6 6.4c.8-2.6 3-3.6 4.6-3.6 2.4 0 4.2 1.4 4.4 3.8-1.4-.9-3.4-1.2-5-.6-1.4.5-2.8.6-4 .4z" fill="var(--op-hair)" /><path d="M4.5 21c.4-4.2 3.6-6.8 7.5-6.8s7.1 2.6 7.5 6.8z" fill="currentColor" /></svg>;
}
function GirlIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="op-ico"><path d="M6.6 13.4C5.6 6.6 8 2.8 12 2.8s6.4 3.8 5.4 10.6c-1.4-.6-2.4-2.4-2.6-4.4-1.6.8-4 1-6 .2-.2 2-1 3.6-2.2 4.2z" fill="var(--op-hair)" /><circle cx="12" cy="8.6" r="4" fill="currentColor" /><path d="M4.5 21c.6-4.4 3.6-6.6 7.5-6.6s6.9 2.2 7.5 6.6z" fill="currentColor" /></svg>;
}

export function OnlinePlayers({ open, defaultPhoto }: { open: boolean; defaultPhoto: string }) {
  const { summary, live } = useOnlinePlayers(open);
  const faces = summary?.players.slice(0, 5) ?? [];
  return <div className="op-box" aria-live="polite">
    <style>{OP_STYLES}</style>
    <div className="op-head">
      <span className={"op-dot" + (live ? " live" : "")} aria-hidden="true" />
      <strong>{summary ? summary.total : "—"}</strong>
      <span>{summary?.total === 0 ? "hələ heç kim oynamır" : "nəfər indi oynayır"}</span>
    </div>
    <div className="op-genders">
      <span className="op-g boy" title="Oğlan"><BoyIcon /><b>{summary ? summary.boys : "—"}</b><small>oğlan</small></span>
      <span className="op-g girl" title="Qız"><GirlIcon /><b>{summary ? summary.girls : "—"}</b><small>qız</small></span>
    </div>
    {faces.length > 0 && <div className="op-faces">
      {faces.map(p => <span key={p.userId} className={"op-face " + (p.male ? "boy" : "girl")} title={p.name}><img src={p.photo || defaultPhoto} alt={p.name} loading="lazy" /></span>)}
      {summary && summary.total > faces.length && <span className="op-more">+{summary.total - faces.length}</span>}
    </div>}
  </div>;
}

const OP_STYLES = `
.op-box{width:100%;margin-top:-6px;padding:12px 12px 10px;border-radius:14px;background:var(--play-bg);border:1px solid var(--border);display:flex;flex-direction:column;align-items:center;gap:9px;
  --op-boy:oklch(.6 .14 245);--op-girl:oklch(.65 .19 0);--op-hair:oklch(.32 .05 40);}
.op-head{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted-foreground);}
.op-head strong{font-size:18px;color:var(--foreground);font-variant-numeric:tabular-nums;}
.op-dot{width:8px;height:8px;border-radius:50%;background:var(--muted-foreground);}
.op-dot.live{background:var(--primary);box-shadow:0 0 0 0 color-mix(in oklch,var(--primary) 60%,transparent);animation:op-pulse 1.6s infinite;}
.op-genders{display:flex;gap:10px;}
.op-g{display:flex;align-items:center;gap:5px;padding:5px 11px 5px 6px;border-radius:30px;background:var(--surface);border:1px solid var(--border);font-size:11px;color:var(--muted-foreground);}
.op-g b{font-size:14px;color:var(--foreground);font-variant-numeric:tabular-nums;}
.op-ico{width:22px;height:22px;border-radius:50%;padding:2px;}
.op-g.boy .op-ico{color:var(--op-boy);background:color-mix(in oklch,var(--op-boy) 15%,transparent);}
.op-g.girl .op-ico{color:var(--op-girl);background:color-mix(in oklch,var(--op-girl) 15%,transparent);}
.op-faces{display:flex;align-items:center;}
.op-face{width:28px;height:28px;border-radius:50%;margin-left:-7px;border:2px solid var(--op-boy);background:var(--surface);overflow:hidden;animation:op-in .35s ease-out both;}
.op-face:first-child{margin-left:0;}.op-face.girl{border-color:var(--op-girl);}
.op-face img{width:100%;height:100%;object-fit:cover;display:block;}
.op-more{margin-left:5px;font-size:11px;font-weight:700;color:var(--muted-foreground);}
@keyframes op-pulse{70%{box-shadow:0 0 0 7px transparent;}100%{box-shadow:0 0 0 0 transparent;}}
@keyframes op-in{from{transform:scale(.4);opacity:0;}}
@media(prefers-reduced-motion:reduce){.op-dot.live,.op-face{animation:none;}}
`;
