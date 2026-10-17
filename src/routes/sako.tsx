import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { checkAdmin, getAdminStats, listPlayers, adjustBalance, setBan } from "@/lib/admin.functions";

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
  const banM = useMutation({
    mutationFn: () => ban({ data: { userId: p.id, banned: !p.banned } }),
    onSuccess: () => void refresh(),
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
          onClick={() => { if (confirm(p.banned ? "Ban kaldırılsın mı?" : `${p.username} banlansın mı?`)) banM.mutate(); }}>
          {p.banned ? "Banı kaldır" : "Banla"}
        </Button>
      </div>
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
