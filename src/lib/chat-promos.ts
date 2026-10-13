// Ports of GameSession.notifyNewcomers, ChatPresenter.createWidgetLine and
// Session.scheduleWidgetOfTheDay / scheduleVipTeaser from the original client.
import type { ChatActionPart, ChatUser } from "@/lib/music-session";

export const VIP_TEASER_DELAY = 5 * 60 * 1000;
export const OPEN_GIFT_FOR_SEAT_EVENT = "source:open-gift-for-seat";

export interface NewcomerCandidate { id: string; isNew?: boolean; photoUrl?: string; male?: boolean }

/** Which newcomers get a widget: new, has photo, opposite sex, not yet notified this session. */
export function newcomersToNotify<T extends NewcomerCandidate>(users: T[], viewer: { id: string; male: boolean }, notified: Set<string>): T[] {
  const out: T[] = [];
  for (const u of users) {
    if (u.id === viewer.id || !u.isNew || !u.photoUrl || u.male === undefined || u.male === viewer.male || notified.has(u.id)) continue;
    notified.add(u.id);
    out.push(u);
  }
  return out;
}

/** gold > 0 → newcomerGift (chat:newcomer:gift), otherwise newcomerChat (chat:newcomer:message). */
export const newcomerKind = (gold: number) => (gold > 0 ? "gift" : "chat") as "gift" | "chat";
export const newcomerKey = (kind: "gift" | "chat") => (kind === "gift" ? "chat:newcomer:gift" : "chat:newcomer:message");

/** translateCustom with one '%' argument: raw text parts around the bold user name. */
export function widgetParts(template: string, user: ChatUser): ChatActionPart[] {
  const parts: ChatActionPart[] = [];
  template.split("%").forEach((raw, i) => {
    if (i > 0) parts.push({ user });
    if (raw) parts.push({ text: raw });
  });
  return parts;
}

/** scheduleWidgetOfTheDay: without rewarded video the widget is always the VIP teaser. */
export function widgetOfTheDay(viewerId: string, day: number, hasRewardedVideo: boolean): "vip" | "video" {
  if (!hasRewardedVideo) return "vip";
  return (parseInt(viewerId, 10) + day) % 2 ? "vip" : "video";
}
export const shouldScheduleVipTeaser = (vip: boolean, allowVipPromo: boolean) => !vip && allowVipPromo;
