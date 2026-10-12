import { translate, type CilizAssets } from "./ciliz-assets";
export interface CilizGesture { type: string; image: string; storeImage: string; storePrice: number; spine: string | string[]; shade: [number, number, number, number] }
export interface GestureEntry { id: string; kisses_s?: number; vip_s?: boolean; social?: string[]; platform?: string[]; user_s?: string[] }
export interface GestureAccount { userId: string; kisses: number; vip: boolean; tokens: number; social: string; platform: string; scheduled: GestureEntry[] }
export interface GestureItem { gesture: CilizGesture; name: string; lock?: { kind: "kisses"; needed: number; current: number } | { kind: "vip" } }
/** Original ordering: available, kiss-locked, VIP-locked. Scheduled entries
 * require the authenticated session; never invent a schedule or grant VIP. */
export function buildGestureItems(assets: CilizAssets, account: GestureAccount | null): GestureItem[] {
  const entries = (assets.gestureStore ?? []).flatMap(e => e.id === "__SCHEDULED__" ? account?.scheduled ?? [] : [e]);
  const groups: GestureItem[][] = [[], [], []];
  for (const entry of entries) {
    const gesture = assets.gestures?.[entry.id];
    if (!gesture) continue;
    if (entry.social && (!account || !entry.social.includes(account.social))) continue;
    if (entry.platform && (!account || !entry.platform.includes(account.platform))) continue;
    if (entry.user_s && (!account || !entry.user_s.includes(account.userId))) continue;
    const current = account?.kisses ?? 0;
    const lock: GestureItem["lock"] = entry.kisses_s && current < entry.kisses_s ? { kind: "kisses", needed: entry.kisses_s, current } : entry.vip_s && !account?.vip ? { kind: "vip" } : undefined;
    groups[lock?.kind === "kisses" ? 1 : lock?.kind === "vip" ? 2 : 0]?.push({ gesture, name: translate(assets, `gesture:${gesture.type}`), ...(lock ? { lock } : {}) });
  }
  return groups.flat();
}
export function gestureEligibility(item: GestureItem, account: GestureAccount | null) {
  if (!account) return "session";
  if (item.lock) return item.lock.kind;
  return account.tokens < item.gesture.storePrice ? "tokens" : "available";
}