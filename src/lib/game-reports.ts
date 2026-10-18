import { getSupabase } from "@/lib/supabase";

export type GameReportResult = "sent" | "already" | "error";

/** Source photo/user reports: stored server-side in the admin report queue (one open report per kind). */
export async function reportPlayer(userId: string, kind: "photo" | "user", text: string): Promise<GameReportResult> {
  const sb = getSupabase();
  if (!sb) return "error";
  const { data, error } = await sb.rpc("report_player" as never, { p_user: userId, p_kind: kind, p_text: text } as never);
  if (error) return "error";
  return data === "already" ? "already" : "sent";
}
