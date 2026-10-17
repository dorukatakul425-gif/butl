import { describe, expect, it } from "vitest";
import { friendStateFor, normalizeMessage, summarizeInbox, upsertMessage, type DirectMessage, type Friendship } from "@/lib/social";

const f = (requester_id: string, addressee_id: string, status: Friendship["status"]): Friendship => ({ id: `${requester_id}-${addressee_id}`, requester_id, addressee_id, status, created_at: "2026-10-17T10:00:00Z" });
const m = (id: string, sender_id: string, recipient_id: string, created_at: string, read_at: string | null = null): DirectMessage => ({ id, sender_id, recipient_id, body: "salam", created_at, read_at });

describe("friend state", () => {
  it("is none without a row", () => expect(friendStateFor("a", "b", [])).toBe("none"));
  it("is sent for my pending request", () => expect(friendStateFor("a", "b", [f("a", "b", "pending")])).toBe("sent"));
  it("is received for their pending request", () => expect(friendStateFor("a", "b", [f("b", "a", "pending")])).toBe("received"));
  it("is friends once accepted, from either side", () => expect(friendStateFor("b", "a", [f("a", "b", "accepted")])).toBe("friends"));
});

describe("messages", () => {
  it("rejects empty and over-long messages", () => {
    expect(normalizeMessage("   ")).toBeNull();
    expect(normalizeMessage("x".repeat(1001))).toBeNull();
    expect(normalizeMessage("  salam  ")).toBe("salam");
  });
  it("deduplicates by id and keeps time order", () => {
    const list = upsertMessage([m("2", "a", "b", "2026-10-17T10:02:00Z"), m("1", "a", "b", "2026-10-17T10:01:00Z")], m("2", "a", "b", "2026-10-17T10:02:00Z", "2026-10-17T10:03:00Z"));
    expect(list.map(x => x.id)).toEqual(["1", "2"]);
    expect(list[1]?.read_at).toBe("2026-10-17T10:03:00Z");
  });
  it("counts only unread messages sent to me", () => {
    const { unread, last } = summarizeInbox("a", [m("1", "b", "a", "2026-10-17T10:01:00Z"), m("2", "b", "a", "2026-10-17T10:02:00Z", "2026-10-17T10:05:00Z"), m("3", "a", "b", "2026-10-17T10:03:00Z")]);
    expect(unread["b"]).toBe(1);
    expect(last["b"]?.id).toBe("3");
  });
});
