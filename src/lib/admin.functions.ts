// Admin panel (/sako) server functions. Every call re-verifies the caller's admin role.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
    // Original: ban / disabled_ban system lines appear in the target's room chat.
    const { data: seat } = await admin.from("room_players").select("room_id").eq("user_id", data.userId).maybeSingle();
    const { data: target } = await admin.from("profiles").select("name").eq("id", data.userId).maybeSingle();
    const banLine = async (kind: "ban" | "disabled_ban") => {
      let roomId = seat?.room_id as number | undefined;
      if (!roomId) {
        const { data: anyRoom } = await admin.from("rooms").select("id").order("id").limit(1).maybeSingle();
        roomId = anyRoom?.id as number | undefined;
      }
      if (roomId) await admin.from("chat_messages").insert({ room_id: roomId, user_id: data.userId, text: (target?.name as string) ?? "?", kind });
    };
    if (!data.banned) {
      await admin.from("user_bans").delete().eq("user_id", data.userId);
      const { error } = await admin.auth.admin.updateUserById(data.userId, { ban_duration: "none" });
      if (error) throw new Error(error.message);
      await banLine("disabled_ban");
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
    await banLine("ban");
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
