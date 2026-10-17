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
    const players = await Promise.all((rows ?? []).map(async (p: any) => {
      const { data: u } = await admin.auth.admin.getUserById(p.id);
      const until = u?.user?.banned_until as string | undefined;
      return { ...p, banned: !!until && new Date(until).getTime() > Date.now() };
    }));
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

const BanInput = z.object({ userId: z.string().uuid(), banned: z.boolean() });

export const setBan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => BanInput.parse(d))
  .handler(async ({ data, context }) => {
    if (data.userId === context.userId) throw new Error("Kendini banlayamazsın");
    const admin = await assertAdmin(context);
    const { error } = await admin.auth.admin.updateUserById(data.userId, { ban_duration: data.banned ? "876000h" : "none" });
    if (error) throw new Error(error.message);
    if (data.banned) await admin.from("room_players").delete().eq("user_id", data.userId);
    return { banned: data.banned };
  });
