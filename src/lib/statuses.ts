// Statuses (24h stories): text / image / video with likes and comments.
// Browser-only helpers on the shared Supabase client; RLS enforces ownership and expiry.
import { getSupabase } from "@/lib/supabase";

export type StatusKind = "text" | "image" | "video";
export type FeedStatus = {
  id: string;
  userId: string;
  kind: StatusKind;
  body: string | null;
  mediaPath: string | null;
  mediaUrl: string | null;
  bg: string;
  createdAt: string;
  expiresAt: string;
  authorName: string;
  authorPhoto: string | null;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  review: "pending" | "approved" | "rejected";
};
export type StatusComment = { id: string; userId: string; body: string; createdAt: string; name: string; photo: string | null };

export const STATUS_BGS: Record<string, string> = {
  emerald: "linear-gradient(160deg, oklch(.6 .15 165), oklch(.36 .09 195))",
  sunset: "linear-gradient(160deg, oklch(.72 .17 50), oklch(.55 .21 15))",
  night: "linear-gradient(160deg, oklch(.35 .08 260), oklch(.18 .04 280))",
  rose: "linear-gradient(160deg, oklch(.72 .16 0), oklch(.5 .2 340))",
  ocean: "linear-gradient(160deg, oklch(.7 .13 220), oklch(.42 .14 250))",
  gold: "linear-gradient(160deg, oklch(.85 .15 90), oklch(.62 .15 60))",
};
export const statusBg = (bg: string) => STATUS_BGS[bg] ?? STATUS_BGS["emerald"]!;

export const IMAGE_LIMIT = 10 * 1024 * 1024;
export const VIDEO_LIMIT = 50 * 1024 * 1024;
const BUCKET = "statuses";

const VIDEO_EXT = ["mp4", "webm", "mov", "m4v"];
const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"];
export function fileKind(file: File): "image" | "video" | null {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "image";
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (VIDEO_EXT.includes(ext)) return "video";
  if (IMAGE_EXT.includes(ext)) return "image";
  return null;
}
function contentType(file: File, kind: "image" | "video") {
  if (file.type) return file.type;
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (kind === "video") return ext === "webm" ? "video/webm" : ext === "mov" ? "video/quicktime" : "video/mp4";
  return ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/jpeg";
}

function client() {
  const sb = getSupabase();
  if (!sb) throw new Error("Bağlantı yoxdur.");
  return sb;
}

type FeedRow = {
  id: string; user_id: string; kind: StatusKind; body: string | null; media_path: string | null; bg: string;
  created_at: string; expires_at: string; author_name: string; author_photo: string | null;
  like_count: number | string; comment_count: number | string; liked: boolean; review?: string | null;
};

export async function loadFeed(): Promise<FeedStatus[]> {
  const sb = client();
  const { data, error } = await sb.rpc("status_feed");
  if (error) throw new Error("Statuslar yüklənmədi.");
  const rows = (data ?? []) as FeedRow[];
  const paths = rows.map(r => r.media_path).filter((p): p is string => Boolean(p));
  const urls = new Map<string, string>();
  if (paths.length) {
    const { data: signed } = await sb.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 3);
    for (const s of signed ?? []) if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
  }
  return rows.map(r => ({
    id: r.id, userId: r.user_id, kind: r.kind, body: r.body, mediaPath: r.media_path,
    mediaUrl: r.media_path ? urls.get(r.media_path) ?? null : null, bg: r.bg,
    createdAt: r.created_at, expiresAt: r.expires_at, authorName: r.author_name, authorPhoto: r.author_photo,
    likeCount: Number(r.like_count) || 0, commentCount: Number(r.comment_count) || 0, liked: Boolean(r.liked),
    review: (r.review === "pending" || r.review === "rejected" ? r.review : "approved") as FeedStatus["review"],
  })).filter(s => s.kind === "text" || s.mediaUrl);
}

export async function createStatus(userId: string, input: { kind: StatusKind; body: string; bg: string; file?: File | null }) {
  const sb = client();
  const body = input.body.trim().slice(0, 700);
  let mediaPath: string | null = null;
  if (input.kind !== "text") {
    const file = input.file;
    if (!file) throw new Error("Fayl seçin.");
    const kind = fileKind(file);
    if (kind !== input.kind) throw new Error(input.kind === "video" ? "Video faylı seçin." : "Şəkil faylı seçin.");
    if (file.size > (kind === "video" ? VIDEO_LIMIT : IMAGE_LIMIT))
      throw new Error(kind === "video" ? "Video 50 MB-dan kiçik olmalıdır." : "Şəkil 10 MB-dan kiçik olmalıdır.");
    const ext = (file.name.split(".").pop() || (kind === "video" ? "mp4" : "jpg")).toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    mediaPath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(mediaPath, file, { contentType: contentType(file, kind), upsert: false });
    if (error) throw new Error("Fayl yüklənmədi. Yenidən cəhd edin.");
  } else if (!body) throw new Error("Status mətni yazın.");
  const { error } = await sb.from("statuses").insert({ user_id: userId, kind: input.kind, body: body || null, media_path: mediaPath, bg: input.bg });
  if (error) {
    if (mediaPath) await sb.storage.from(BUCKET).remove([mediaPath]);
    throw new Error("Status paylaşılmadı.");
  }
}

export async function deleteStatus(status: Pick<FeedStatus, "id" | "mediaPath">) {
  const sb = client();
  const { error } = await sb.from("statuses").delete().eq("id", status.id);
  if (error) throw new Error("Status silinmədi.");
  if (status.mediaPath) await sb.storage.from(BUCKET).remove([status.mediaPath]);
}

/** Removes the signed-in user's own expired statuses and their files. */
export async function cleanupOwnExpired(userId: string) {
  const sb = getSupabase();
  if (!sb) return;
  const { data } = await sb.from("statuses").select("id, media_path").eq("user_id", userId).lt("expires_at", new Date().toISOString());
  const rows = (data ?? []) as Array<{ id: string; media_path: string | null }>;
  if (!rows.length) return;
  const paths = rows.map(r => r.media_path).filter((p): p is string => Boolean(p));
  if (paths.length) await sb.storage.from(BUCKET).remove(paths);
  await sb.from("statuses").delete().in("id", rows.map(r => r.id));
}

export async function setLike(statusId: string, userId: string, like: boolean) {
  const sb = client();
  const { error } = like
    ? await sb.from("status_likes").upsert({ status_id: statusId, user_id: userId }, { onConflict: "status_id,user_id", ignoreDuplicates: true })
    : await sb.from("status_likes").delete().eq("status_id", statusId).eq("user_id", userId);
  if (error) throw new Error("Bəyənmə alınmadı.");
}

export async function loadComments(statusId: string): Promise<StatusComment[]> {
  const sb = client();
  const { data, error } = await sb.from("status_comments")
    .select("id, user_id, body, created_at, profiles(name, photo_url)")
    .eq("status_id", statusId).order("created_at", { ascending: true }).limit(200);
  if (error) throw new Error("Şərhlər yüklənmədi.");
  type Row = { id: string; user_id: string; body: string; created_at: string; profiles: { name: string; photo_url: string | null } | Array<{ name: string; photo_url: string | null }> | null };
  return ((data ?? []) as unknown as Row[]).map(r => {
    const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return { id: r.id, userId: r.user_id, body: r.body, createdAt: r.created_at, name: p?.name ?? "Oyunçu", photo: p?.photo_url ?? null };
  });
}

export async function addComment(statusId: string, userId: string, body: string) {
  const text = body.trim().slice(0, 300);
  if (!text) throw new Error("Şərh yazın.");
  const { error } = await client().from("status_comments").insert({ status_id: statusId, user_id: userId, body: text });
  if (error) throw new Error("Şərh göndərilmədi.");
}

export async function deleteComment(id: string) {
  const { error } = await client().from("status_comments").delete().eq("id", id);
  if (error) throw new Error("Şərh silinmədi.");
}

export function timeAgo(iso: string, now = Date.now()) {
  const m = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000));
  if (m < 1) return "indi";
  if (m < 60) return `${m} dəq əvvəl`;
  return `${Math.floor(m / 60)} saat əvvəl`;
}
export function timeLeft(iso: string, now = Date.now()) {
  const m = Math.max(0, Math.floor((new Date(iso).getTime() - now) / 60000));
  return m >= 60 ? `${Math.floor(m / 60)} saat qalıb` : `${m} dəq qalıb`;
}

const SEEN_KEY = "butl.seenStatuses";
export function readSeen(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]") as string[]); } catch { return new Set(); }
}
export function markSeen(id: string) {
  try {
    const s = readSeen(); s.add(id);
    localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(s).slice(-500)));
  } catch { /* storage unavailable */ }
}
