/** Telegram ServerTimestamp.zodiacSymbol; indices match the original SVG classes. */
export function telegramZodiac(birthday?: string | null): number | undefined {
  if (!birthday || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return undefined;
  const date = new Date(`${birthday}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== birthday) return undefined;
  const m = date.getUTCMonth() + 1, d = date.getUTCDate();
  const map = [[12,23,1,20,9],[1,21,2,19,10],[2,20,3,20,11],[3,21,4,20,0],[4,21,5,21,1],[5,22,6,21,2],[6,22,7,22,3],[7,23,8,21,4],[8,22,9,23,5],[9,24,10,23,6],[10,24,11,22,7],[11,23,12,22,8]];
  return map.find(([m1,d1,m2,d2]) => (m === m1 && d >= d1) || (m === m2 && d <= d2))?.[4];
}

/** Re-evaluate current membership, not the seat where a profile was first opened. */
export function profileIsAtTable(id: string | undefined, players: ReadonlyArray<{ id: string } | null>): boolean {
  return Boolean(id && players.some(p => p?.id === id));
}