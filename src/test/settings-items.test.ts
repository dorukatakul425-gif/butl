import { describe, expect, it, vi } from "vitest";
import { buildContactItems, buildSettingsItems, idCopyValue } from "@/components/settings/settings-items";
const t = (k: string) => k;
const noop = vi.fn();
describe("original OK settings", () => {
  it('offers league participation without inventing league membership', () => {
    const item = buildSettingsItems(t, { onSfx: noop, onMusic: noop, onInvite: noop, onCommunity: noop, onContacts: noop, league: { enabled: true, busy: false, onChange: noop } })[2];
    expect(item).toMatchObject({ type: 'checkbox', icon: 'league', enabled: true, name: 'dlg:league:idle:title' });
  });
  it("lists sounds, music, invite, OK community and contacts in source order", () => {
    expect(buildSettingsItems(t, { onSfx: noop, onMusic: noop, onInvite: noop, onCommunity: noop, onContacts: noop }).map(i => i.icon)).toEqual(["sound", "music", "invite", "ok", "feedback"]);
  });
  it("contacts follow OKSocial feedbackOps", () => {
    expect(buildContactItems(t, { social: "ok", platform: "html5", viewerId: "7", onReport: noop }).map(i => i.icon)).toEqual(["email", "telegram", "faq", "privacy", "terms", "report"]);
  });
  it("telegram link carries platform_social_id", () => {
    const tg = buildContactItems(t, { social: "ok", platform: "html5", viewerId: "7", onReport: noop })[1];
    expect(tg && "href" in tg && tg.href).toBe("https://t.me/cilizbot?start=html5_ok_7");
  });
  it("copied id joins platform, social, version and viewer", () => {
    expect(idCopyValue("html5", "ok", "7")).toBe("html5:ok:1.6.393:7");
  });
});
