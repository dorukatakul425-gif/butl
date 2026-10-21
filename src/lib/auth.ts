import { useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, type Profile } from "./supabase";

interface AuthState { ready: boolean; configured: boolean; session: Session | null; profile: Profile | null }
let state: AuthState = { ready: false, configured: true, session: null, profile: null };
const listeners = new Set<() => void>();
const set = (next: Partial<AuthState>) => { state = { ...state, ...next }; listeners.forEach(l => l()); };
let started = false;
let authRevision = 0;
let profileRevision = 0;

export async function refreshProfile() {
  const authRead = authRevision, read = ++profileRevision;
  const sb = getSupabase();
  const uid = state.session?.user.id;
  if (!sb || !uid) { set({ profile: null }); return null; }
  const { data } = await sb.from("profiles").select("*").eq("id", uid).maybeSingle();
  if (authRead !== authRevision || read !== profileRevision || state.session?.user.id !== uid) return null;
  set({ profile: (data as Profile | null) ?? null });
  return data as Profile | null;
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  const sb = getSupabase();
  if (!sb) { set({ ready: true, configured: false }); return; }
  sb.auth.onAuthStateChange((event, session) => {
    if (event === "TOKEN_REFRESHED") { state = { ...state, session }; return; }
    const revision = ++authRevision;
    profileRevision++;
    // Session and profile switch together so pages never see a signed-in user without a profile.
    if (!session) { set({ session: null, profile: null, ready: true }); return; }
    void sb.from("profiles").select("*").eq("id", session.user.id).maybeSingle()
      .then(({ data }) => { if (revision === authRevision) set({ session, profile: (data as Profile | null) ?? null, ready: true }); },
            () => { if (revision === authRevision) set({ session, profile: null, ready: true }); });
  });
}

/** Signs out and updates every page immediately, without waiting for the network. */
export async function signOut() {
  const { leaveRoom } = await import('./room-session');
  // Local sign-out must not be held hostage by a stalled transport queue.
  const leaving = leaveRoom().catch(() => undefined);
  authRevision++;
  profileRevision++;
  set({ session: null, profile: null, ready: true });
  await Promise.race([leaving, new Promise<void>(resolve => setTimeout(resolve, 1500))]);
  await getSupabase()?.auth.signOut();
}

const SERVER: AuthState = { ready: false, configured: true, session: null, profile: null };
export function useAuth(): AuthState {
  start();
  return useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb); }, () => state, () => SERVER);
}
export const getAuth = () => state;
