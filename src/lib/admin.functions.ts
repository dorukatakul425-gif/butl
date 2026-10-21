// Admin panel (/sako) server functions. Every call re-verifies the caller's admin role.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { telegramNoticeSchema, telegramPayload } from "./telegram-notifications";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { rouletteConfigSchema } from './roulette-config';
import { appearanceInput, validNameStyle } from './player-appearance';
import { levelFromPoints } from './top-level-activity';

/* eslint-disable @typescript-eslint/no-explicit-any */
async function assertAdmin(context: { supabase: unknown; userId: string }) {
  const sb = context.supabase as any;
  const { data, error } = await sb.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || data !== true) throw new Error("Forbidden");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await (context.supabase as any).rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: data === true };
  });

export const getAdminStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await assertAdmin(context);
    const count = async (table: string) => {
      const { count: c } = await admin.from(table).select("*", { count: "exact", head: true });
      return c ?? 0;
    };
    const since = new Date(Date.now() - 86400000).toISOString();
    const { count: newToday } = await admin.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", since);
    const [players, seated, rooms, gifts, messages] = await Promise.all([
      count("profiles"), count("room_players"), count("rooms"), count("gift_events"), count("chat_messages"),
    ]);
    return { players, newToday: newToday ?? 0, seated, rooms, gifts, messages };
  });

const ListInput = z.object({ search: z.string().trim().max(60).default(""), page: z.number().int().min(0).max(10000).default(0) });

export const listPlayers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ListInput.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const size = 25;
    let q = admin.from("profiles")
      .select("id, player_no, username, name, male, age, city, gold, tokens, dat, kisses, vip_until, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(data.page * size, data.page * size + size - 1);
    const s = data.search.replace(/[%,()]/g, "");
    if (s) q = /^\d+$/.test(s) ? q.or(`player_no.eq.${s},username.ilike.%${s}%`) : q.or(`username.ilike.%${s}%,name.ilike.%${s}%`);
    const { data: rows, count, error } = await q;
    if (error) throw new Error(error.message);
    const ids = (rows ?? []).map((p: any) => p.id);
    const { data: bans } = ids.length
      ? await admin.from("user_bans").select("user_id, reason, banned_until").in("user_id", ids)
      : { data: [] };
    const active = new Map<string, any>((bans ?? []).filter((b: any) => !b.banned_until || new Date(b.banned_until).getTime() > Date.now()).map((b: any) => [b.user_id, b]));
    const players = (rows ?? []).map((p: any) => ({ ...p, banned: active.has(p.id), banReason: active.get(p.id)?.reason as string | undefined, bannedUntil: active.get(p.id)?.banned_until as string | null | undefined }));
    return { players, total: count ?? 0, pageSize: size };
  });

const BalanceInput = z.object({
  userId: z.string().uuid(),
  field: z.enum(["gold", "tokens", "dat"]),
  delta: z.number().int().min(-10_000_000).max(10_000_000),
});

export const adjustBalance = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => BalanceInput.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { data: value, error } = await admin.rpc("admin_adjust_balance", { _user_id: data.userId, _field: data.field, _delta: data.delta });
    if (error) throw new Error(error.message);
    return { value: value as number };
  });

const KissesInput = z.object({
  userId: z.string().uuid(),
  value: z.number().int().min(0).max(10_000_000),
});

/** Admin: set a player's total kiss count to an exact value. */
export const setKisses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => KissesInput.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { data: value, error } = await admin.rpc("admin_set_kisses", { _user_id: data.userId, _value: data.value });
    if (error) throw new Error(error.message);
    return { value: value as number };
  });

const BanInput = z.object({
  userId: z.string().uuid(),
  banned: z.boolean(),
  reason: z.string().trim().max(300).default(""),
  hours: z.number().int().min(1).max(876000).nullable().default(null), // null = permanent
});

export const setBan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => BanInput.parse(d))
  .handler(async ({ data, context }) => {
    if (data.userId === context.userId) throw new Error("Kendini banlayamazsın");
    const admin = await assertAdmin(context);
    if (!data.banned) {
      await admin.from("user_bans").delete().eq("user_id", data.userId);
      const { error } = await admin.auth.admin.updateUserById(data.userId, { ban_duration: "none" });
      if (error) throw new Error(error.message);
      return { banned: false };
    }
    const until = data.hours ? new Date(Date.now() + data.hours * 3600000).toISOString() : null;
    const { error: e1 } = await admin.from("user_bans").upsert({
      user_id: data.userId, reason: data.reason, banned_by: context.userId, banned_at: new Date().toISOString(), banned_until: until,
    });
    if (e1) throw new Error(e1.message);
    const { error } = await admin.auth.admin.updateUserById(data.userId, { ban_duration: `${data.hours ?? 876000}h` });
    if (error) throw new Error(error.message);
    await admin.rpc("admin_revoke_sessions", { _user_id: data.userId });
    await admin.from("room_players").delete().eq("user_id", data.userId);
    return { banned: true };
  });

const BroadcastInput = z.object({ roomId: z.number().int().positive(), text: z.string().trim().min(1).max(300) });

/** Original admin_chat: a green announcement line in the chosen room's chat. */
export const sendBroadcast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => BroadcastInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await (context.supabase as any).rpc("admin_broadcast", { p_room: data.roomId, p_text: data.text });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Original viewtable: admins can watch any table — live seats + chat, read-only. */
export const listRoomsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await assertAdmin(context);
    const { data: rooms, error } = await admin.from("rooms").select("id, phase, created_at").order("id");
    if (error) throw new Error(error.message);
    const { data: players } = await admin.from("room_players").select("room_id, user_id");
    const counts = new Map<number, number>();
    for (const p of players ?? []) counts.set(p.room_id, (counts.get(p.room_id) ?? 0) + 1);
    return { rooms: (rooms ?? []).map((r: any) => ({ id: r.id as number, phase: r.phase as string, players: counts.get(r.id) ?? 0 })) };
  });

const ViewRoomInput = z.object({ roomId: z.number().int().positive() });

export const viewRoomAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ViewRoomInput.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { data: seats, error } = await admin.from("room_players").select("seat, user_id, last_seen").eq("room_id", data.roomId).order("seat");
    if (error) throw new Error(error.message);
    const ids = (seats ?? []).map((s: any) => s.user_id);
    const { data: people } = ids.length ? await admin.from("profiles").select("id, name, username, photo_url, male").in("id", ids) : { data: [] };
    const byId = new Map<string, any>((people ?? []).map((p: any) => [p.id, p]));
    const { data: msgs } = await admin.from("chat_messages").select("id, user_id, text, kind, created_at")
      .eq("room_id", data.roomId).order("id", { ascending: false }).limit(50);
    const msgIds = [...new Set((msgs ?? []).map((m: any) => m.user_id))];
    const { data: msgPeople } = msgIds.length ? await admin.from("profiles").select("id, name").in("id", msgIds) : { data: [] };
    const nameOf = new Map<string, string>((msgPeople ?? []).map((p: any) => [p.id, p.name as string]));
    return {
      seats: (seats ?? []).map((s: any) => ({ seat: s.seat as number, name: (byId.get(s.user_id)?.name ?? "?") as string, photoUrl: (byId.get(s.user_id)?.photo_url ?? "") as string })),
      messages: ((msgs ?? []) as any[]).reverse().map((m) => ({ id: m.id as number, name: nameOf.get(m.user_id) ?? "?", text: m.text as string, kind: (m.kind ?? "chat") as string })),
    };
  });

const ReportsInput = z.object({ status: z.enum(["open", "reviewed", "dismissed"]).default("open") });

export const listReports = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ReportsInput.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { data: rows, error } = await admin.from("user_reports")
      .select("id, reporter_id, reported_id, category, details, context, status, admin_note, created_at, photo_url")
      .eq("status", data.status).order("created_at", { ascending: false }).limit(100);
    if (error) throw new Error(error.message);
    const ids = [...new Set((rows ?? []).flatMap((r: any) => [r.reporter_id, r.reported_id]))];
    const { data: people } = ids.length ? await admin.from("profiles").select("id, name, username, player_no").in("id", ids) : { data: [] };
    const byId = new Map<string, any>((people ?? []).map((p: any) => [p.id, p]));
    const { count: open } = await admin.from("user_reports").select("*", { count: "exact", head: true }).eq("status", "open");
    const reports = (rows ?? []).map((r: any) => ({
      id: r.id as string, category: r.category as string, details: r.details as string, context: r.context as string, status: r.status as string,
      adminNote: (r.admin_note ?? "") as string, photoUrl: (r.photo_url ?? null) as string | null, createdAt: r.created_at as string,
      reporter: { id: r.reporter_id as string, name: (byId.get(r.reporter_id)?.name ?? "?") as string, username: (byId.get(r.reporter_id)?.username ?? "") as string },
      reported: { id: r.reported_id as string, name: (byId.get(r.reported_id)?.name ?? "?") as string, username: (byId.get(r.reported_id)?.username ?? "") as string, playerNo: (byId.get(r.reported_id)?.player_no ?? null) as number | null },
    }));
    return { reports, open: open ?? 0 };
  });

const ResolveInput = z.object({ id: z.string().uuid(), status: z.enum(["reviewed", "dismissed", "open"]), note: z.string().trim().max(500).default("") });

export const resolveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ResolveInput.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { error } = await admin.from("user_reports")
      .update({ status: data.status, admin_note: data.note || null, reviewed_at: data.status === "open" ? null : new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const StatusListInput = z.object({ review: z.enum(["pending", "approved", "rejected"]).default("pending") });

export const listStatusReviews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => StatusListInput.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { data: rows, error } = await admin.from("statuses")
      .select("id, user_id, kind, body, media_path, bg, created_at, expires_at, review")
      .eq("review", data.review).gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: data.review === "pending" }).limit(100);
    if (error) throw new Error(error.message);
    const list = (rows ?? []) as any[];
    const ids = [...new Set(list.map((r) => r.user_id))];
    const { data: people } = ids.length ? await admin.from("profiles").select("id, name, username, player_no").in("id", ids) : { data: [] };
    const byId = new Map<string, any>((people ?? []).map((p: any) => [p.id, p]));
    const paths = list.map((r) => r.media_path).filter(Boolean) as string[];
    const urls = new Map<string, string>();
    if (paths.length) {
      const { data: signed } = await admin.storage.from("statuses").createSignedUrls(paths, 60 * 60);
      for (const s of (signed ?? []) as any[]) if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
    }
    const { count: pending } = await admin.from("statuses").select("*", { count: "exact", head: true })
      .eq("review", "pending").gt("expires_at", new Date().toISOString());
    const statuses = list.map((r) => ({
      id: r.id as string, kind: r.kind as "text" | "image" | "video", body: (r.body ?? "") as string, bg: r.bg as string,
      mediaUrl: r.media_path ? urls.get(r.media_path) ?? null : null, createdAt: r.created_at as string, review: r.review as string,
      author: { name: (byId.get(r.user_id)?.name ?? "?") as string, username: (byId.get(r.user_id)?.username ?? "") as string, playerNo: (byId.get(r.user_id)?.player_no ?? null) as number | null },
    }));
    return { statuses, pending: pending ?? 0 };
  });

const StatusReviewInput = z.object({ id: z.string().uuid(), approve: z.boolean() });

export const reviewStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => StatusReviewInput.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    // An approved status is visible for a full 24 hours from the moment it is approved.
    const patch = data.approve
      ? { review: "approved", expires_at: new Date(Date.now() + 24 * 3600000).toISOString() }
      : { review: "rejected" };
    const { error } = await admin.from("statuses").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Direct Bot API: uses the same explicitly configured bot token as Telegram login. */
async function callTelegram(token: string, method: string, body: Record<string, unknown> | FormData) {
  const multipart = body instanceof FormData;
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST", headers: multipart ? undefined : { "Content-Type": "application/json" },
    body: multipart ? body : JSON.stringify(body), signal: AbortSignal.timeout(20000),
  });
  const raw = await response.text();
  let json: { ok?: boolean; description?: string; result?: { photo?: Array<{ file_id: string }>; video?: { file_id: string } }; parameters?: { retry_after?: number } };
  try { json = JSON.parse(raw); } catch { throw new Error(`Telegram [${response.status}]: etibarsız cavab`); }
  if (!response.ok || json.ok !== true) {
    // Do not include the token-bearing URL or arbitrary response bodies in logs.
    const reason = (json.description ?? "Göndərilə bilmədi").replaceAll(token, "[redacted]");
    console.error(`Telegram [${response.status}]: ${reason}`);
    throw new Error(`Telegram [${response.status}]: ${reason}${json.parameters?.retry_after ? ` (${json.parameters.retry_after} saniyə gözləyin)` : ""}`);
  }
  return json.result;
}

export const sendTelegramNotifications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => telegramNoticeSchema.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { getTelegramBotToken } = await import('./telegram-config.server');
    const token = await getTelegramBotToken();
    let query = admin.from("profiles").select("id, telegram_id").not("telegram_id", "is", null).order("id").limit(11);
    if (data.after) query = query.gt("id", data.after);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    const batch = (rows ?? []).slice(0, 10) as Array<{ id: string; telegram_id: number }>;
    let sent = 0, failed = 0;
    const errors = new Set<string>();
    for (const row of batch) {
      try { const payload = telegramPayload(data, row.telegram_id); await callTelegram(token, payload.method, payload.body); sent++; }
      catch (e) { failed++; errors.add(e instanceof Error ? e.message : "Telegram göndərişi uğursuz oldu."); }
      await new Promise(resolve => setTimeout(resolve, 60));
    }
    return { attempted: batch.length, sent, failed, errors: [...errors].slice(0, 5), after: batch.at(-1)?.id ?? null, done: (rows ?? []).length <= 10 };
  });

export const uploadTelegramMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => { if (!(d instanceof FormData)) throw new Error("Fayl tələb olunur."); return d; })
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { getTelegramBotToken } = await import('./telegram-config.server');
    const token = await getTelegramBotToken();
    const file = data.get("file"), kind = data.get("kind");
    if (!(file instanceof File) || !["photo", "video"].includes(String(kind))) throw new Error("Etibarsız fayl.");
    const photo = kind === "photo";
    if (!file.size || file.size > (photo ? 10 : 50) * 1024 * 1024) throw new Error(photo ? "Şəkil 10 MB-dan böyük ola bilməz." : "Video 50 MB-dan böyük ola bilməz.");
    if (!(photo ? ["image/jpeg", "image/png"] : ["video/mp4"]).includes(file.type)) throw new Error("Şəkil JPEG/PNG, video MP4 olmalıdır.");
    const { data: recipient } = await admin.from("profiles").select("telegram_id").eq("id", context.userId).maybeSingle();
    if (!recipient?.telegram_id) throw new Error("Fayl yükləmək üçün admin hesabına Telegram ilə giriş edin.");
    const form = new FormData(); form.set("chat_id", String(recipient.telegram_id)); form.set(String(kind), file);
    form.set("disable_notification", "true"); form.set("caption", "Admin: göndəriş üçün media önbaxışı");
    const result = await callTelegram(token, photo ? "sendPhoto" : "sendVideo", form);
    const fileId = photo ? result?.photo?.at(-1)?.file_id : result?.video?.file_id;
    if (!fileId) throw new Error("Telegram fayl ID-si alınmadı.");
    return { fileId };
  });

export const replaceTelegramBotToken = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  // Never let a validator echo input or include the supplied credential in errors.
  .inputValidator((input: unknown) => {
    if (!input || typeof input !== 'object' || !('token' in input) || typeof input.token !== 'string'
      || !/^\d{5,16}:[A-Za-z0-9_-]{20,200}$/.test(input.token)) throw new Error('Etibarsız bot tokeni.');
    return { token: input.token };
  })
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    try {
      const response = await fetch(`https://api.telegram.org/bot${data.token}/getMe`, { method: 'POST', signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error();
      const body = await response.json();
      if (!body.ok || body.result?.is_bot !== true) throw new Error();
    } catch { throw new Error('Bot tokeni doğrulanmadı.'); }
    const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];
    if (!key) throw new Error('Bot ayarları saxlanmadı.');
    const { encryptBotToken } = await import('../../bot/telegram-config.mjs');
    const encrypted = await encryptBotToken(data.token, key);
    const { error } = await admin.from('telegram_bot_settings').upsert({ id: 1, ...encrypted, updated_by: context.userId, updated_at: new Date().toISOString() });
    if (error) throw new Error('Bot ayarları saxlanmadı.');
    return { ok: true };
  });

const LevelInput = z.object({ userId: z.string().uuid(), level: z.number().int().min(0).max(100) });

/** Admin: player's gift level and individually granted level frames. */
export const getPlayerLevel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const [{ data: pts, error }, { data: prof }] = await Promise.all([
      admin.rpc("gift_points_of", { p_user: data.userId }),
      admin.from("profiles").select("owned_items, frame").eq("id", data.userId).single(),
    ]);
    if (error) throw new Error(error.message);
    const points = Number(pts) || 0;
    return { points, level: Math.min(100, Math.floor(points / 1400)), owned: ((prof?.owned_items ?? []) as string[]).filter((i) => i.startsWith("cf_")), frame: (prof?.frame ?? "") as string };
  });

/** Admin: set an exact gift level (1400 points per level, max 100). */
export const setGiftLevel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => LevelInput.parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { data: level, error } = await admin.rpc("admin_set_gift_level", { _user_id: data.userId, _level: data.level });
    if (error) throw new Error(error.message);
    return { level: level as number };
  });

/** Admin: give or take one animated level frame regardless of level. */
export const grantFrame = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ userId: z.string().uuid(), frame: z.string().regex(/^cf_\d+$/), give: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context);
    const { data: owned, error } = await admin.rpc("admin_grant_frame", { _user_id: data.userId, _frame: data.frame, _give: data.give });
    if (error) throw new Error(error.message);
    return { owned: ((owned ?? []) as string[]).filter((i) => i.startsWith("cf_")) };
  });

export const getRouletteAdmin = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await assertAdmin(context);
    const [configResult, prizesResult, eventsResult] = await Promise.all([
      admin.from('roulette_config').select('*').eq('id', 1).single(),
      admin.from('roulette_prizes').select('id,image,amount,probability_bp').order('id'),
      admin.from('roulette_events').select('id,user_id,action,prize_id,created_at').order('created_at', { ascending: false }).limit(50),
    ]);
    for (const result of [configResult, prizesResult, eventsResult]) if (result.error) throw new Error(result.error.message);
    const prizes = prizesResult.data as Array<{ id: number; image: string; amount: number; probability_bp: number }>;
    const events = eventsResult.data as Array<{ id: string; user_id: string; action: string; prize_id: number | null; created_at: string }>;
    const ids = [...new Set(events.map(e => e.user_id))];
    const peopleResult = ids.length ? await admin.from('profiles').select('id,name').in('id', ids) : { data: [], error: null };
    if (peopleResult.error) throw new Error(peopleResult.error.message);
    const people = new Map<string, string>((peopleResult.data ?? []).map((p: { id: string; name: string }) => [p.id, p.name]));
    const c = configResult.data;
    return { config: { enabled: Boolean(c.enabled), spinCost: Number(c.spin_cost), dailyChances: Number(c.daily_chances), bundleChances: Number(c.bundle_chances), bundleDat: Number(c.bundle_dat), revision: Number(c.revision), prizes: prizes.map(p => ({ id: p.id, percentage: p.probability_bp / 100 })) }, prizes,
      events: events.map(e => { const p = prizes.find(p => p.id === e.prize_id); return { ...e, name: people.get(e.user_id) ?? 'Oyunçu', image: p?.image, amount: p?.amount }; }) };
  });

export const saveRouletteAdmin = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => rouletteConfigSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: revision, error } = await (context.supabase as any).rpc('admin_roulette_save', { p_config: data });
    if (error) throw new Error(error.message);
    return { revision: Number(revision) };
  });

export const getPlayerNameStyle = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const admin = await assertAdmin(context);
    const [style, points] = await Promise.all([
      admin.from('player_name_styles').select('name_style,creator').eq('user_id', data.userId).maybeSingle(),
      admin.rpc('gift_points_of', { p_user: data.userId }),
    ]);
    if (style.error || points.error) throw new Error('Ad üslubu yüklənmədi.');
    return { nameStyle: validNameStyle(style.data?.name_style), creator: style.data?.creator === true, level: levelFromPoints(Number(points.data)) };
  });

export const savePlayerNameStyle = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => appearanceInput.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await (context.supabase as any).rpc('admin_set_name_style', { p_user: data.userId, p_style: data.nameStyle, p_creator: data.creator });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const requestSiteRefresh = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { title?: string; countdown?: number } | undefined) => {
    const title = String(input?.title ?? '').trim().slice(0, 80);
    const countdown = Math.round(Number(input?.countdown ?? 10));
    if (!Number.isFinite(countdown) || countdown < 3 || countdown > 300) throw new Error('Geri sayım 3-300 saniyə olmalıdır');
    return { title, countdown };
  })
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context);
    const { data, error } = await (context.supabase as any).rpc('admin_request_site_refresh', { p_title: input.title || null, p_countdown: input.countdown });
    if (error) throw new Error(error.message);
    return { id: String(data) };
  });
