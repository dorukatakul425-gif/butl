import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TelegramNotifications } from "@/components/admin/telegram-notifications";
import { TelegramBotSettings } from '@/components/admin/telegram-bot-settings';
import { Input } from "@/components/ui/input";
import { PlayerLevelPanel } from "@/components/admin/player-level-panel";
import { TablePricePanel } from '@/components/admin/table-price-panel';
import { RoulettePanel } from '@/components/admin/roulette-panel';
import { PlayerNamePanel, SiteRefreshPanel } from '@/components/admin/player-name-panel';
import { useAuth } from "@/lib/auth";
import { checkAdmin, getAdminStats, listPlayers, adjustBalance, setKisses, setBan, listReports, resolveReport, listStatusReviews, reviewStatus, sendBroadcast, listRoomsAdmin, viewRoomAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/sako")({
  head: () => ({
    meta: [
      { title: "Deltagame.az — İdarə paneli" },
      { name: "description", content: "Oyunun idarə paneli." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Deltagame.az — İdarə paneli" },
      { property: "og:description", content: "Oyunun idarə paneli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Tab = "umumi" | "masalar" | "oyuncular" | "sikayetler" | "statuslar" | "telegram" | "roulette";

const TABS: Array<[Tab, string]> = [
  ["umumi", "Ümumi"],
  ["masalar", "Masalar"],
  ["oyuncular", "Oyunçular"],
  ["sikayetler", "Şikayətlər"],
  ["statuslar", "Statuslar"],
  ["telegram", "Telegram bildirişləri"],
  ['roulette', 'Şans çarxı'],
];

function AdminPage() {
  const auth = useAuth();
  const check = useServerFn(checkAdmin);
  const role = useQuery({
    queryKey: ["admin", "role", auth.session?.user.id],
    queryFn: () => check(),
    enabled: !!auth.session,
  });

  if (!auth.ready || (auth.session && role.isLoading)) return <Center>Yüklənir…</Center>;
  if (!auth.session)
    return (
      <Center>
        <p className="mb-4">İdarə paneli üçün giriş edin.</p>
        <Button asChild><Link to="/auth">Giriş et</Link></Button>
      </Center>
    );
  if (!role.data?.isAdmin) return <Center>Bu səhifəyə giriş icazəniz yoxdur.</Center>;
  return <Dashboard />;
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center text-foreground">{children}</div>;
}

function Dashboard() {
  const [tab, setTab] = useState<Tab>("umumi");
  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">İdarə paneli</h1>
          <Button variant="outline" asChild><Link to="/">Oyuna qayıt</Link></Button>
        </div>
        <div className="mb-6 flex flex-wrap gap-2 border-b pb-3">
          {TABS.map(([key, label]) => (
            <Button key={key} size="sm" variant={tab === key ? "default" : "outline"} onClick={() => setTab(key)}>
              {label}
            </Button>
          ))}
        </div>
        {tab === "umumi" && <><Stats /><SiteRefreshPanel /><Broadcast /></>}
        {tab === "masalar" && <><TablePricePanel /><Rooms /></>}
        {tab === "oyuncular" && <Players />}
        {tab === "sikayetler" && <Reports />}
        {tab === "statuslar" && <StatusReviews />}
        {tab === "telegram" && <><TelegramBotSettings /><TelegramNotifications /></>}
        {tab === 'roulette' && <RoulettePanel />}
      </div>
    </div>
  );
}

function Stats() {
  const stats = useServerFn(getAdminStats);
  const s = useQuery({ queryKey: ["admin", "stats"], queryFn: () => stats(), refetchInterval: 30000 });
  const items = [
    ["Ümumi oyunçu", s.data?.players],
    ["Son 24 saat yeni", s.data?.newToday],
    ["Masada oturan", s.data?.seated],
    ["Masalar", s.data?.rooms],
    ["Hədiyyələr", s.data?.gifts],
    ["Mesajlar", s.data?.messages],
  ] as const;
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-6">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border bg-card p-4 text-card-foreground">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value ?? "—"}</div>
        </div>
      ))}
    </div>
  );
}

/** Original admin_chat: green announcement into a room's chat. */
function Broadcast() {
  const rooms = useServerFn(listRoomsAdmin);
  const send = useServerFn(sendBroadcast);
  const qc = useQueryClient();
  const r = useQuery({ queryKey: ["admin", "rooms"], queryFn: () => rooms(), refetchInterval: 15000 });
  const [roomId, setRoomId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const m = useMutation({
    mutationFn: () => send({ data: { roomId: roomId ?? 0, text } }),
    onSuccess: () => { setText(""); void qc.invalidateQueries({ queryKey: ["admin", "room"] }); },
  });
  const list = r.data?.rooms ?? [];
  const chosen = roomId ?? list[0]?.id ?? null;
  return (
    <div className="mb-8 rounded-lg border bg-card p-4 text-card-foreground">
      <h2 className="mb-3 text-lg font-semibold">Elan (yaşıl admin mesajı)</h2>
      <form className="flex flex-col gap-2 md:flex-row" onSubmit={(e) => { e.preventDefault(); if (chosen && text.trim()) m.mutate(); }}>
        <select className="rounded-md border bg-background px-3 py-2 text-sm" value={chosen ?? ""} onChange={(e) => setRoomId(Number(e.target.value))}>
          {list.map((rm: AdminRoom) => <option key={rm.id} value={rm.id}>Masa {rm.id} · {rm.players} oyunçu</option>)}
        </select>
        <Input placeholder="Bütün masada görünəcək elan mətni" value={text} onChange={(e) => setText(e.target.value)} maxLength={300} />
        <Button type="submit" disabled={m.isPending || !chosen || !text.trim()}>Göndər</Button>
      </form>
      {m.isError && <p className="mt-2 text-sm text-destructive">{(m.error as Error).message}</p>}
      {m.isSuccess && <p className="mt-2 text-sm text-green-600">Elan göndərildi.</p>}
    </div>
  );
}

/** Original viewtable: watch any table live — seats and chat, read-only. */
function Rooms() {
  const rooms = useServerFn(listRoomsAdmin);
  const view = useServerFn(viewRoomAdmin);
  const r = useQuery({ queryKey: ["admin", "rooms"], queryFn: () => rooms(), refetchInterval: 15000 });
  const [open, setOpen] = useState<number | null>(null);
  const detail = useQuery({
    queryKey: ["admin", "room", open],
    queryFn: () => view({ data: { roomId: open ?? 0 } }),
    enabled: open !== null,
    refetchInterval: 5000,
  });
  return (
    <div className="mb-8 rounded-lg border bg-card p-4 text-card-foreground">
      <h2 className="mb-3 text-lg font-semibold">Masaları izlə</h2>
      <div className="mb-3 flex flex-wrap gap-2">
        {(r.data?.rooms ?? []).map((rm: AdminRoom) => (
          <Button key={rm.id} variant={open === rm.id ? "default" : "outline"} size="sm" onClick={() => setOpen(open === rm.id ? null : rm.id)}>
            Masa {rm.id} · {rm.players}
          </Button>
        ))}
        {r.data && r.data.rooms.length === 0 && <p className="text-sm text-muted-foreground">Aktiv masa yoxdur.</p>}
      </div>
      {open !== null && detail.data && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-xs text-muted-foreground">Oturacaqlar</div>
            <div className="grid grid-cols-4 gap-2">
              {detail.data.seats.map((s: AdminSeat) => (
                <div key={s.seat} className="flex flex-col items-center rounded-md border p-2">
                  {s.photoUrl ? <img src={s.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-muted" />}
                  <span className="mt-1 max-w-full truncate text-xs">{s.name}</span>
                </div>
              ))}
              {detail.data.seats.length === 0 && <p className="col-span-4 text-sm text-muted-foreground">Masa boşdur.</p>}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs text-muted-foreground">Canlı söhbət (son 50)</div>
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border p-2 text-sm">
              {detail.data.messages.map((msg) => (
                <div key={msg.id}>
                  {msg.kind === "admin_chat"
                    ? <span className="text-green-600">{msg.text}</span>
                    : msg.kind === "ban" || msg.kind === "disabled_ban"
                      ? <span className="text-red-600">{msg.kind === "ban" ? `${msg.text} oyundan qadağan edildi` : `${msg.text} istifadəçisinin qadağası ləğv edildi`}</span>
                      : <><span className="font-medium">{msg.name}:</span> {msg.text}</>}
                </div>
              ))}
              {detail.data.messages.length === 0 && <p className="text-muted-foreground">Mesaj yoxdur.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type Player = Awaited<ReturnType<typeof listPlayers>>["players"][number];
type AdminRoom = { id: number; phase: string; players: number };
type AdminSeat = { seat: number; name: string; photoUrl: string };
type AdminReport = Awaited<ReturnType<typeof listReports>>["reports"][number];

function Players() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const list = useServerFn(listPlayers);
  const r = useQuery({ queryKey: ["admin", "players", query, page], queryFn: () => list({ data: { search: query, page } }) });
  const pages = r.data ? Math.max(1, Math.ceil(r.data.total / r.data.pageSize)) : 1;
  return (
    <div>
      <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); setPage(0); setQuery(search); }}>
        <Input placeholder="İstifadəçi adı, ad və ya oyunçu nömrəsi" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button type="submit">Axtar</Button>
      </form>
      {r.isError && <p className="mb-3 text-sm text-destructive">{(r.error as Error).message}</p>}
      <div className="space-y-2">
        {r.isLoading && <p className="text-muted-foreground">Yüklənir…</p>}
        {r.data?.players.map((p: Player) => <PlayerRow key={p.id} p={p} />)}
        {r.data && r.data.players.length === 0 && <p className="text-muted-foreground">Oyunçu tapılmadı.</p>}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Əvvəlki</Button>
        <span className="text-sm text-muted-foreground">{page + 1} / {pages} · {r.data?.total ?? 0} oyunçu</span>
        <Button variant="outline" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Növbəti</Button>
      </div>
    </div>
  );
}

function PlayerRow({ p }: { p: Player }) {
  const qc = useQueryClient();
  const adjust = useServerFn(adjustBalance);
  const kiss = useServerFn(setKisses);
  const ban = useServerFn(setBan);
  const [open, setOpen] = useState(false);
  const [kissOpen, setKissOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const [kissValue, setKissValue] = useState("");
  const [field, setField] = useState<"gold" | "tokens" | "dat">("gold");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });
  const bal = useMutation({
    mutationFn: (sign: 1 | -1) => adjust({ data: { userId: p.id, field, delta: sign * Math.abs(parseInt(amount, 10) || 0) } }),
    onSuccess: (res) => { setMsg(`Yeni balans: ${res.value}`); setAmount(""); void refresh(); },
    onError: (e) => setMsg((e as Error).message),
  });
  const kissM = useMutation({
    mutationFn: () => kiss({ data: { userId: p.id, value: Math.abs(parseInt(kissValue, 10) || 0) } }),
    onSuccess: (res) => { setMsg(`Öpüş sayı: ${res.value}`); setKissValue(""); setKissOpen(false); void refresh(); },
    onError: (e) => setMsg((e as Error).message),
  });
  const [banOpen, setBanOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [hours, setHours] = useState<string>("perm");
  const banM = useMutation({
    mutationFn: () => ban({ data: { userId: p.id, banned: !p.banned, reason, hours: hours === "perm" ? null : parseInt(hours, 10) } }),
    onSuccess: () => { setBanOpen(false); setReason(""); void refresh(); },
    onError: (e) => setMsg((e as Error).message),
  });
  return (
    <div className="rounded-lg border bg-card p-3 text-card-foreground">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-medium">
            {p.name} <span className="text-muted-foreground">@{p.username} · #{p.player_no}</span>
            {p.banned && <span className="ml-2 rounded bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">QADAĞANLI</span>}
          </div>
          <div className="text-xs text-muted-foreground">
            {p.male ? "Kişi" : "Qadın"}{p.age ? ` · ${p.age}` : ""}{p.city ? ` · ${p.city}` : ""} · Qızıl {p.gold} · Jeton {p.tokens} · DAT {p.dat} · Öpüş {p.kisses}
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>Balans</Button>
        <Button size="sm" variant="outline" onClick={() => setKissOpen(!kissOpen)}>Öpüş</Button>
        <Button size="sm" variant="outline" onClick={() => setLevelOpen(!levelOpen)}>Səviyyə / Ramka</Button>
        <Button size="sm" variant="outline" onClick={() => setNameOpen(!nameOpen)}>Ad / Creator</Button>
        <Button size="sm" variant={p.banned ? "secondary" : "destructive"} disabled={banM.isPending}
          onClick={() => { if (p.banned) { if (confirm("Qadağa ləğv edilsin?")) banM.mutate(); } else setBanOpen(!banOpen); }}>
          {p.banned ? "Qadağanı ləğv et" : "Qadağan et"}
        </Button>
      </div>
      {p.banned && (
        <p className="mt-2 text-xs text-destructive">
          Səbəb: {p.banReason || "—"} · {p.bannedUntil ? `Bitmə: ${new Date(p.bannedUntil).toLocaleString("az-AZ")}` : "Daimi"}
        </p>
      )}
      {banOpen && !p.banned && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Input className="min-w-48 flex-1" maxLength={300} placeholder="Qadağa səbəbi (oyunçu görür)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <select className="h-9 rounded-md border bg-background px-2 text-sm" value={hours} onChange={(e) => setHours(e.target.value)}>
            <option value="1">1 saat</option>
            <option value="24">1 gün</option>
            <option value="168">7 gün</option>
            <option value="720">30 gün</option>
            <option value="perm">Daimi</option>
          </select>
          <Button size="sm" variant="destructive" disabled={banM.isPending} onClick={() => banM.mutate()}>Qadağan et</Button>
        </div>
      )}
      {open && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select className="h-9 rounded-md border bg-background px-2 text-sm" value={field} onChange={(e) => setField(e.target.value as typeof field)}>
            <option value="gold">Qızıl</option>
            <option value="tokens">Jeton</option>
            <option value="dat">DAT</option>
          </select>
          <Input className="w-32" type="number" min={1} placeholder="Miqdar" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button size="sm" disabled={!amount || bal.isPending} onClick={() => bal.mutate(1)}>Əlavə et</Button>
          <Button size="sm" variant="outline" disabled={!amount || bal.isPending} onClick={() => bal.mutate(-1)}>Çıx</Button>
        </div>
      )}
      {kissOpen && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">İndiki: {p.kisses}</span>
          <Input className="w-32" type="number" min={0} placeholder="Yeni say" value={kissValue} onChange={(e) => setKissValue(e.target.value)} />
          <Button size="sm" disabled={!kissValue || kissM.isPending} onClick={() => kissM.mutate()}>Təyin et</Button>
        </div>
      )}
      {levelOpen && <PlayerLevelPanel userId={p.id} />}
      {nameOpen && <PlayerNamePanel userId={p.id} name={p.name} />}
      {msg && <p className="mt-2 text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}

const CATEGORY_AZ: Record<string, string> = { spam: "Spam", harassment: "Təhqir / təcavüz", inappropriate: "Uyğunsuz məzmun", fake: "Saxta profil", scam: "Dələduzluq", other: "Digər", photo: "Şəkil (qadağan)" };

function Reports() {
  const [status, setStatus] = useState<"open" | "reviewed" | "dismissed">("open");
  const list = useServerFn(listReports);
  const resolve = useServerFn(resolveReport);
  const qc = useQueryClient();
  const r = useQuery({ queryKey: ["admin", "reports", status], queryFn: () => list({ data: { status } }), refetchInterval: 20000 });
  const m = useMutation({
    mutationFn: (v: { id: string; status: "reviewed" | "dismissed" | "open" }) => resolve({ data: { ...v, note: "" } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reports"] }),
  });
  return (
    <div className="mb-10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-xl font-bold">Şikayətlər {r.data?.open ? <span className="ml-1 rounded bg-destructive px-2 py-0.5 text-sm text-destructive-foreground">{r.data.open} yeni</span> : null}</h2>
        {(["open", "reviewed", "dismissed"] as const).map((s) => (
          <Button key={s} size="sm" variant={status === s ? "default" : "outline"} onClick={() => setStatus(s)}>{s === "open" ? "Açıq" : s === "reviewed" ? "Baxıldı" : "Rədd edildi"}</Button>
        ))}
      </div>
      {r.isError && <p className="text-sm text-destructive">{(r.error as Error).message}</p>}
      {r.isLoading && <p className="text-muted-foreground">Yüklənir…</p>}
      {r.data && r.data.reports.length === 0 && <p className="text-muted-foreground">Şikayət yoxdur.</p>}
      <div className="space-y-2">
        {r.data?.reports.map((x: AdminReport) => (
          <div key={x.id} className="rounded-lg border bg-card p-3 text-card-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-destructive/15 px-2 py-0.5 text-xs font-semibold text-destructive">{CATEGORY_AZ[x.category] ?? x.category}</span>
              <span className="text-xs text-muted-foreground">{new Date(x.createdAt).toLocaleString("az-AZ")} · {x.context === "chat" ? "Şəxsi mesaj" : x.context === "game" ? "Oyun profili" : "Profil"}</span>
            </div>
            <div className="mt-2 text-sm">
              <b>Şikayət edilən:</b> {x.reported.name} <span className="text-muted-foreground">@{x.reported.username}{x.reported.playerNo ? ` · #${x.reported.playerNo}` : ""}</span>
            </div>
            <div className="text-sm"><b>Şikayət edən:</b> {x.reporter.name} <span className="text-muted-foreground">@{x.reporter.username}</span></div>
            {x.photoUrl && <a href={x.photoUrl} target="_blank" rel="noreferrer"><img src={x.photoUrl} alt="Şikayət edilən şəkil" className="mt-2 h-28 w-28 rounded object-cover" /></a>}
            {x.details && <p className="mt-2 whitespace-pre-wrap rounded bg-muted p-2 text-sm">{x.details}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {status !== "reviewed" && <Button size="sm" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, status: "reviewed" })}>Baxıldı</Button>}
              {status !== "dismissed" && <Button size="sm" variant="outline" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, status: "dismissed" })}>Rədd et</Button>}
              {status !== "open" && <Button size="sm" variant="outline" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, status: "open" })}>Yenidən aç</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_GRADIENTS: Record<string, string> = {
  emerald: "linear-gradient(160deg, oklch(.6 .15 165), oklch(.36 .09 195))",
  sunset: "linear-gradient(160deg, oklch(.72 .17 50), oklch(.55 .21 15))",
  night: "linear-gradient(160deg, oklch(.35 .08 260), oklch(.18 .04 280))",
  rose: "linear-gradient(160deg, oklch(.72 .16 0), oklch(.5 .2 340))",
  ocean: "linear-gradient(160deg, oklch(.7 .13 220), oklch(.42 .14 250))",
  gold: "linear-gradient(160deg, oklch(.85 .15 90), oklch(.62 .15 60))",
};

function StatusReviews() {
  const [review, setReview] = useState<"pending" | "approved" | "rejected">("pending");
  const list = useServerFn(listStatusReviews);
  const decide = useServerFn(reviewStatus);
  const qc = useQueryClient();
  const r = useQuery({ queryKey: ["admin", "statuses", review], queryFn: () => list({ data: { review } }), refetchInterval: 20000 });
  const m = useMutation({
    mutationFn: (v: { id: string; approve: boolean }) => decide({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "statuses"] }),
  });
  return (
    <div className="mb-10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-xl font-bold">Status təsdiqi {r.data?.pending ? <span className="ml-1 rounded bg-destructive px-2 py-0.5 text-sm text-destructive-foreground">{r.data.pending} gözləyir</span> : null}</h2>
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <Button key={s} size="sm" variant={review === s ? "default" : "outline"} onClick={() => setReview(s)}>{s === "pending" ? "Gözləyən" : s === "approved" ? "Təsdiqlənən" : "Rədd edilən"}</Button>
        ))}
      </div>
      {r.isError && <p className="text-sm text-destructive">{(r.error as Error).message}</p>}
      {r.isLoading && <p className="text-muted-foreground">Yüklənir…</p>}
      {r.data && r.data.statuses.length === 0 && <p className="text-muted-foreground">Status yoxdur.</p>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {r.data?.statuses.map((x) => (
          <div key={x.id} className="overflow-hidden rounded-lg border bg-card text-card-foreground">
            <div className="flex aspect-[9/14] items-center justify-center overflow-hidden bg-muted" style={x.kind === "text" ? { background: STATUS_GRADIENTS[x.bg] ?? STATUS_GRADIENTS["emerald"] } : undefined}>
              {x.kind === "text" && <p className="whitespace-pre-wrap break-words p-3 text-center text-sm font-semibold text-primary-foreground">{x.body}</p>}
              {x.kind === "image" && x.mediaUrl && <img src={x.mediaUrl} alt="" className="h-full w-full object-cover" />}
              {x.kind === "video" && x.mediaUrl && <video src={x.mediaUrl} className="h-full w-full object-cover" controls playsInline preload="metadata" />}
              {x.kind !== "text" && !x.mediaUrl && <span className="text-xs text-muted-foreground">Fayl yoxdur</span>}
            </div>
            <div className="p-2">
              <div className="truncate text-sm font-semibold">{x.author.name} <span className="font-normal text-muted-foreground">@{x.author.username}</span></div>
              {x.kind !== "text" && x.body && <p className="mt-1 line-clamp-2 text-xs">{x.body}</p>}
              <div className="text-xs text-muted-foreground">{new Date(x.createdAt).toLocaleString("az-AZ")}</div>
              <div className="mt-2 flex gap-2">
                {review !== "approved" && <Button size="sm" className="flex-1" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, approve: true })}>Təsdiqlə</Button>}
                {review !== "rejected" && <Button size="sm" variant="outline" className="flex-1" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, approve: false })}>Rədd et</Button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
