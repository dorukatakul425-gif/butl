import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { checkAdmin, getAdminStats, listPlayers, adjustBalance, setBan, listReports, resolveReport, listStatusReviews, reviewStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/sako")({
  head: () => ({
    meta: [
      { title: "Admin Panel" },
      { name: "description", content: "Oyun yönetim paneli." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Panel" },
      { property: "og:description", content: "Oyun yönetim paneli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const auth = useAuth();
  const check = useServerFn(checkAdmin);
  const role = useQuery({
    queryKey: ["admin", "role", auth.session?.user.id],
    queryFn: () => check(),
    enabled: !!auth.session,
  });

  if (!auth.ready || (auth.session && role.isLoading)) return <Center>Yükleniyor…</Center>;
  if (!auth.session)
    return (
      <Center>
        <p className="mb-4">Admin paneli için giriş yap.</p>
        <Button asChild><Link to="/auth">Giriş yap</Link></Button>
      </Center>
    );
  if (!role.data?.isAdmin) return <Center>Bu sayfaya erişim yetkin yok.</Center>;
  return <Dashboard />;
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center text-foreground">{children}</div>;
}

function Dashboard() {
  const stats = useServerFn(getAdminStats);
  const s = useQuery({ queryKey: ["admin", "stats"], queryFn: () => stats(), refetchInterval: 30000 });
  const items = [
    ["Toplam oyuncu", s.data?.players],
    ["Son 24 saat yeni", s.data?.newToday],
    ["Masada oturan", s.data?.seated],
    ["Masalar", s.data?.rooms],
    ["Hediyeler", s.data?.gifts],
    ["Mesajlar", s.data?.messages],
  ] as const;
  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Button variant="outline" asChild><Link to="/">Oyuna dön</Link></Button>
        </div>
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-6">
          {items.map(([label, value]) => (
            <div key={label} className="rounded-lg border bg-card p-4 text-card-foreground">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 text-2xl font-semibold">{value ?? "—"}</div>
            </div>
          ))}
        </div>
        <StatusReviews />
        <Reports />
        <Players />
      </div>
    </div>
  );
}

type Player = Awaited<ReturnType<typeof listPlayers>>["players"][number];

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
        <Input placeholder="Kullanıcı adı, isim veya oyuncu no" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button type="submit">Ara</Button>
      </form>
      {r.isError && <p className="mb-3 text-sm text-destructive">{(r.error as Error).message}</p>}
      <div className="space-y-2">
        {r.isLoading && <p className="text-muted-foreground">Yükleniyor…</p>}
        {r.data?.players.map((p) => <PlayerRow key={p.id} p={p} />)}
        {r.data && r.data.players.length === 0 && <p className="text-muted-foreground">Oyuncu bulunamadı.</p>}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Önceki</Button>
        <span className="text-sm text-muted-foreground">{page + 1} / {pages} · {r.data?.total ?? 0} oyuncu</span>
        <Button variant="outline" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Sonraki</Button>
      </div>
    </div>
  );
}

function PlayerRow({ p }: { p: Player }) {
  const qc = useQueryClient();
  const adjust = useServerFn(adjustBalance);
  const ban = useServerFn(setBan);
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<"gold" | "tokens" | "dat">("gold");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });
  const bal = useMutation({
    mutationFn: (sign: 1 | -1) => adjust({ data: { userId: p.id, field, delta: sign * Math.abs(parseInt(amount, 10) || 0) } }),
    onSuccess: (res) => { setMsg(`Yeni bakiye: ${res.value}`); setAmount(""); void refresh(); },
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
            {p.banned && <span className="ml-2 rounded bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">BANLI</span>}
          </div>
          <div className="text-xs text-muted-foreground">
            {p.male ? "Erkek" : "Kadın"}{p.age ? ` · ${p.age}` : ""}{p.city ? ` · ${p.city}` : ""} · Altın {p.gold} · Token {p.tokens} · DAT {p.dat} · Öpücük {p.kisses}
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>Bakiye</Button>
        <Button size="sm" variant={p.banned ? "secondary" : "destructive"} disabled={banM.isPending}
          onClick={() => { if (p.banned) { if (confirm("Ban kaldırılsın mı?")) banM.mutate(); } else setBanOpen(!banOpen); }}>
          {p.banned ? "Banı kaldır" : "Banla"}
        </Button>
      </div>
      {p.banned && (
        <p className="mt-2 text-xs text-destructive">
          Sebep: {p.banReason || "—"} · {p.bannedUntil ? `Bitiş: ${new Date(p.bannedUntil).toLocaleString("tr-TR")}` : "Kalıcı"}
        </p>
      )}
      {banOpen && !p.banned && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Input className="min-w-48 flex-1" maxLength={300} placeholder="Ban sebebi (oyuncu görür)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <select className="h-9 rounded-md border bg-background px-2 text-sm" value={hours} onChange={(e) => setHours(e.target.value)}>
            <option value="1">1 saat</option>
            <option value="24">1 gün</option>
            <option value="168">7 gün</option>
            <option value="720">30 gün</option>
            <option value="perm">Kalıcı</option>
          </select>
          <Button size="sm" variant="destructive" disabled={banM.isPending} onClick={() => banM.mutate()}>Banla</Button>
        </div>
      )}
      {open && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select className="h-9 rounded-md border bg-background px-2 text-sm" value={field} onChange={(e) => setField(e.target.value as typeof field)}>
            <option value="gold">Altın</option>
            <option value="tokens">Token</option>
            <option value="dat">DAT</option>
          </select>
          <Input className="w-32" type="number" min={1} placeholder="Miktar" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button size="sm" disabled={!amount || bal.isPending} onClick={() => bal.mutate(1)}>Ekle</Button>
          <Button size="sm" variant="outline" disabled={!amount || bal.isPending} onClick={() => bal.mutate(-1)}>Düş</Button>
        </div>
      )}
      {msg && <p className="mt-2 text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}

const CATEGORY_TR: Record<string, string> = { spam: "Spam", harassment: "Hakaret / taciz", inappropriate: "Uygunsuz içerik", fake: "Sahte profil", scam: "Dolandırıcılık", other: "Diğer" };

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
        <h2 className="mr-auto text-xl font-bold">Şikayetler {r.data?.open ? <span className="ml-1 rounded bg-destructive px-2 py-0.5 text-sm text-destructive-foreground">{r.data.open} yeni</span> : null}</h2>
        {(["open", "reviewed", "dismissed"] as const).map((s) => (
          <Button key={s} size="sm" variant={status === s ? "default" : "outline"} onClick={() => setStatus(s)}>{s === "open" ? "Açık" : s === "reviewed" ? "İncelendi" : "Reddedildi"}</Button>
        ))}
      </div>
      {r.isError && <p className="text-sm text-destructive">{(r.error as Error).message}</p>}
      {r.isLoading && <p className="text-muted-foreground">Yükleniyor…</p>}
      {r.data && r.data.reports.length === 0 && <p className="text-muted-foreground">Şikayet yok.</p>}
      <div className="space-y-2">
        {r.data?.reports.map((x) => (
          <div key={x.id} className="rounded-lg border bg-card p-3 text-card-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-destructive/15 px-2 py-0.5 text-xs font-semibold text-destructive">{CATEGORY_TR[x.category] ?? x.category}</span>
              <span className="text-xs text-muted-foreground">{new Date(x.createdAt).toLocaleString("tr-TR")} · {x.context === "chat" ? "Özel mesaj" : "Profil"}</span>
            </div>
            <div className="mt-2 text-sm">
              <b>Şikayet edilen:</b> {x.reported.name} <span className="text-muted-foreground">@{x.reported.username}{x.reported.playerNo ? ` · #${x.reported.playerNo}` : ""}</span>
            </div>
            <div className="text-sm"><b>Şikayet eden:</b> {x.reporter.name} <span className="text-muted-foreground">@{x.reporter.username}</span></div>
            {x.details && <p className="mt-2 whitespace-pre-wrap rounded bg-muted p-2 text-sm">{x.details}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {status !== "reviewed" && <Button size="sm" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, status: "reviewed" })}>İncelendi</Button>}
              {status !== "dismissed" && <Button size="sm" variant="outline" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, status: "dismissed" })}>Reddet</Button>}
              {status !== "open" && <Button size="sm" variant="outline" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, status: "open" })}>Yeniden aç</Button>}
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
        <h2 className="mr-auto text-xl font-bold">Status onayı {r.data?.pending ? <span className="ml-1 rounded bg-destructive px-2 py-0.5 text-sm text-destructive-foreground">{r.data.pending} bekliyor</span> : null}</h2>
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <Button key={s} size="sm" variant={review === s ? "default" : "outline"} onClick={() => setReview(s)}>{s === "pending" ? "Bekleyen" : s === "approved" ? "Onaylanan" : "Reddedilen"}</Button>
        ))}
      </div>
      {r.isError && <p className="text-sm text-destructive">{(r.error as Error).message}</p>}
      {r.isLoading && <p className="text-muted-foreground">Yükleniyor…</p>}
      {r.data && r.data.statuses.length === 0 && <p className="text-muted-foreground">Status yok.</p>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {r.data?.statuses.map((x) => (
          <div key={x.id} className="overflow-hidden rounded-lg border bg-card text-card-foreground">
            <div className="flex aspect-[9/14] items-center justify-center overflow-hidden bg-muted" style={x.kind === "text" ? { background: STATUS_GRADIENTS[x.bg] ?? STATUS_GRADIENTS["emerald"] } : undefined}>
              {x.kind === "text" && <p className="whitespace-pre-wrap break-words p-3 text-center text-sm font-semibold text-primary-foreground">{x.body}</p>}
              {x.kind === "image" && x.mediaUrl && <img src={x.mediaUrl} alt="" className="h-full w-full object-cover" />}
              {x.kind === "video" && x.mediaUrl && <video src={x.mediaUrl} className="h-full w-full object-cover" controls playsInline preload="metadata" />}
              {x.kind !== "text" && !x.mediaUrl && <span className="text-xs text-muted-foreground">Dosya yok</span>}
            </div>
            <div className="p-2">
              <div className="truncate text-sm font-semibold">{x.author.name} <span className="font-normal text-muted-foreground">@{x.author.username}</span></div>
              {x.kind !== "text" && x.body && <p className="mt-1 line-clamp-2 text-xs">{x.body}</p>}
              <div className="text-xs text-muted-foreground">{new Date(x.createdAt).toLocaleString("tr-TR")}</div>
              <div className="mt-2 flex gap-2">
                {review !== "approved" && <Button size="sm" className="flex-1" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, approve: true })}>Onayla</Button>}
                {review !== "rejected" && <Button size="sm" variant="outline" className="flex-1" disabled={m.isPending} onClick={() => m.mutate({ id: x.id, approve: false })}>Reddet</Button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
