/** The host returns top players plus the viewer, whose rank can be outside the page. */
export type TopPlayerRow = { id: string; name: string; photo_url: string | null; score: number | string; rank: number | string };
export function topRankingRows(rows: readonly TopPlayerRow[]) {
  return rows.map(row => ({ ...row, score: Number(row.score), rank: Number(row.rank) }))
    .sort((a, b) => a.rank - b.rank);
}