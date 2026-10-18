// Profile bio, follower/following counts and unique profile views.
import { getSupabase } from "@/lib/supabase";

export const MAX_BIO_LENGTH = 160;
export type ProfileStats = { followers: number; following: number; views: number };
export type PublicProfile = { id: string; name: string; username: string; photo_url: string | null; bio: string | null; age: number | null; city: string | null; player_no: number | string | null; created_at: string | null };

export async function getProfileStats(id: string): Promise<ProfileStats | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.rpc("get_profile_stats", { _id: id });
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row) return null;
  return { followers: Number(row.followers) || 0, following: Number(row.following) || 0, views: Number(row.views) || 0 };
}

/** Counts once per visitor; viewing your own profile is ignored server-side. */
export async function recordProfileView(id: string) {
  const sb = getSupabase();
  if (!sb) return;
  await sb.rpc("record_profile_view", { _id: id });
}

export async function loadPublicProfile(id: string): Promise<PublicProfile | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from("profiles").select("id,name,username,photo_url,bio,age,city,player_no,created_at").eq("id", id).maybeSingle();
  return (data as PublicProfile | null) ?? null;
}

export async function saveBio(me: string, bio: string) {
  const sb = getSupabase();
  if (!sb) return false;
  const value = bio.trim().slice(0, MAX_BIO_LENGTH);
  const { error } = await sb.from("profiles").update({ bio: value || null }).eq("id", me);
  return !error;
}

/** Read the same saved field as the home editor; undefined means the read failed. */
export async function loadProfileBio(id: string): Promise<string | null | undefined> {
  const sb = getSupabase();
  if (!sb) return undefined;
  const { data, error } = await sb.from("profiles").select("bio").eq("id", id).maybeSingle();
  if (error || !data) return undefined;
  return data.bio ?? null;
}
