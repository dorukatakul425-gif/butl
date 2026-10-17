// Pure ports of UserProfilePresenter.formatUser / formatHarem and OKSocial.getProfileUrl
// from the original OK.ru client (1.6.393). Profile values come from session.queryUserProfile.

/** Server response of queryUserProfile (fields used by the dialog). */
export interface ServerUserProfile {
  social?: string;
  status?: string;
  total_kisses: number; total_kisses_rank?: number;
  dj_score: number; dj_score_rank?: number;
  gestures: number; gestures_rank?: number;
  price: number; price_rank?: number;
  harem_price: number; harem_price_rank?: number;
  /** Current league level (0 Wood .. 16 Diamond) from league_players. */
  league?: number;
  owner?: { id: string; name: string; male: boolean; photoUrl: string; color: string; viewer?: boolean };
}

export function splitThousands(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const rank = (r?: number) => (r && r < 5000 ? splitThousands(r) : undefined);

export function formatStats(p: ServerUserProfile) {
  return {
    totalKisses: splitThousands(p.total_kisses), totalKissesRank: rank(p.total_kisses_rank),
    djScore: splitThousands(p.dj_score), djRank: rank(p.dj_score_rank),
    gestures: splitThousands(p.gestures), gesturesRank: rank(p.gestures_rank),
    price: splitThousands(p.price), priceRank: rank(p.price_rank),
    haremPrice: splitThousands(p.harem_price), haremPriceRank: rank(p.harem_price_rank),
  };
}

/** formatHarem: price shown is price + 1; button disabled when the viewer already owns the user. */
export function formatHarem(userIsViewer: boolean, userId: string, profile: ServerUserProfile | null) {
  const owner = profile?.owner;
  const noOwner = !owner || owner.id === userId;
  const btnIsDisabled = Boolean(noOwner ? userIsViewer : owner.viewer);
  return {
    price: profile ? splitThousands(profile.price + 1) : undefined,
    priceRank: profile?.price_rank && profile.price_rank < 5000 ? profile.price_rank : 0,
    noOwner,
    owner: noOwner ? undefined : owner,
    btnIsDisabled,
    btnKey: userIsViewer && !btnIsDisabled ? "dlg:profile:harem:leave" : "dlg:profile:harem:btn",
  };
}

/** OKSocial.xorId: OK profile ids are xor-encoded in the game. */
export function okXorId(id: number) {
  const b = 363012375412, mask = 0x7fffffff, div = mask + 1;
  return (Math.floor(id / div) ^ Math.floor(b / div)) * div + ((id ^ b) & mask);
}

/** Social button href; undefined renders the disabled OK button (as/gg/ya have none at all). */
export function okProfileUrl(userId?: string) {
  if (!userId || !/^\d+$/.test(userId)) return undefined;
  return `https://ok.ru/profile/${okXorId(parseInt(userId, 10))}`;
}

/** Event the table header listens for to open the league dialog (source: cb.onleague from the profile cup). */
export const OPEN_LEAGUE_EVENT = "source:open-league";

/** Minimum received kisses before the profile shows a league cup (source formatUser). */
export const LEAGUE_CUP_MIN_KISSES = 100;

/** Source formatUser: leagueCupImage = total_kisses >= 100 ? leagues[profile.league].image : "". */
export function leagueCupImage(profile: Pick<ServerUserProfile, "total_kisses" | "league"> | null | undefined, leagues: Array<{ image: string }> | undefined) {
  if (!profile || !leagues?.length || profile.total_kisses < LEAGUE_CUP_MIN_KISSES) return "";
  return leagues[profile.league ?? 0]?.image ?? "";
}

/** Splits a status into plain text and emoji runs (source jsxReplaceRe with EMOJI_RE). */
export function splitStatusEmoji(text: string): Array<{ text: string; emoji: boolean }> {
  const re = /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|\p{Emoji_Modifier})*)+/gu;
  const out: Array<{ text: string; emoji: boolean }> = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push({ text: text.slice(last, m.index), emoji: false });
    out.push({ text: m[0], emoji: true });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), emoji: false });
  return out;
}
