// Item lists from SettingsPresenter.show() and FeedbackPresenter.showImpl()
// for the OK social (OKSocial: no profileUpdatePrice, community item, feedbackOps).
export type SettingsItem =
  | { type: "slider"; icon: "sound" | "music"; name: string; onChange: (v: number) => void }
  | { type: "simple"; icon: string; name: string; action: () => void; border?: "top" }
  | { type: "link"; icon: string; name: string; href: string; border?: "top" };

type T = (key: string) => string;

export const OK_SUPPORT_EMAIL = "support@ciliz.com";
export const OK_LEGAL = {
  privacyUrl: "https://butilochka.cdnvideo.ru/bottle/bundle/legal/ok_privacy.pdf",
  termsUrl: "https://butilochka.cdnvideo.ru/bottle/bundle/legal/ok_terms.pdf",
};
export const CLIENT_VERSION = "1.6.393";

export function buildSettingsItems(t: T, cb: { onSfx: (v: number) => void; onMusic: (v: number) => void; onInvite: () => void; onCommunity: () => void; onContacts: () => void }): SettingsItem[] {
  return [
    { type: "slider", icon: "sound", name: t("ios:dlg:settings:sounds"), onChange: cb.onSfx },
    { type: "slider", icon: "music", name: t("ios:dlg:settings:music"), onChange: cb.onMusic },
    { type: "simple", icon: "invite", name: t("bank:invite:btn"), action: cb.onInvite },
    { type: "simple", icon: "ok", name: t("dlg:settings:community:ok"), action: cb.onCommunity },
    { type: "simple", icon: "feedback", name: t("dlg:settings:contacts"), action: cb.onContacts },
  ];
}

const qs = (o: Record<string, string>) => new URLSearchParams(o).toString();

export function buildContactItems(t: T, p: { social: string; platform: string; viewerId?: string | undefined; onReport: () => void }): SettingsItem[] {
  const id = p.viewerId ?? "";
  return [
    { type: "link", icon: "email", name: t("dlg:settings:email"), href: `mailto:${OK_SUPPORT_EMAIL}?${qs({ subject: [`Platform: ${p.platform}`, `social: ${p.social}`, `id: ${id}`].join(", ") })}` },
    { type: "link", icon: "telegram", name: t("dlg:settings:telegram"), href: `https://t.me/cilizbot?${qs({ start: [p.platform, p.social, id].join("_") })}` },
    { type: "link", icon: "faq", name: t("dlg:settings:faq"), href: t("dlg:settings:contacts:href") },
    { type: "link", icon: "privacy", name: t("dlg:settings:pp"), href: OK_LEGAL.privacyUrl },
    { type: "link", icon: "terms", name: t("dlg:settings:tos"), href: OK_LEGAL.termsUrl },
    { type: "simple", icon: "report", name: t("dlg:settings:console_report:menu"), action: p.onReport },
  ];
}

export function idCopyValue(platform: string, social: string, viewerId?: string) {
  return [platform, social, CLIENT_VERSION, viewerId].filter(Boolean).join(":");
}
