/** User.color from the supplied original game. Precedence matters. */
export interface ChatProfile {
  id: string;
  male?: boolean;
  isVip?: boolean;
  isPremium?: boolean;
  top?: boolean;
  isViewer?: boolean;
  /** Server-provided player locale (e.g. "tr", "ru"). */
  locale?: string;
  /** Decor stone id shown next to the name in chat (ChatContent.setDecor). */
  stone?: string;
}

const customColors: Record<string, string> = {
  "919768320917": "custom-pink",
  "177270703106": "custom-red",
  "894009589914": "custom-green",
  "255676327079": "custom-purple",
  "915269141219": "custom-magenta",
  "37343099": "custom-green",
  "247216532": "custom-violet",
};

export function chatNameClass(user: ChatProfile) {
  const custom = customColors[user.id];
  if (custom) return `chat__name-color--${custom}`;
  if (user.top) return "chat__name-color--top";
  if (user.isPremium) return "chat__name-color--premium";
  if (user.male === undefined) return "chat__name-color--unknown";
  return `chat__name-color--${user.isVip ? "vip-" : ""}${user.male ? "male" : "female"}`;
}

export function chatMessageIsBold(sender: ChatProfile, receiver?: ChatProfile) {
  return Boolean(sender.isViewer || receiver?.isViewer);
}
