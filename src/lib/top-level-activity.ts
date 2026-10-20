/** Telegram Puanlar extra sections (ureyimsen TopsDialog: glv + activity). */
export const LEVEL_POINTS = 1400;
export const MAX_LEVEL = 100;

/** Every heart spent on gifts is 1 level point; 1400 points = 1 level, capped at 100. */
export function levelFromPoints(points: number): number {
  return Math.min(MAX_LEVEL, Math.floor(Math.max(0, Number(points) || 0) / LEVEL_POINTS));
}

/** Original La.text: "{m} dəq", "{h} saat", "{h} saat {m} dəq". */
export function activityText(minutes: number, hoursOnly = false): string {
  const total = Math.max(0, Math.floor(Number(minutes) || 0));
  const h = Math.floor(total / 60), m = total % 60;
  if (!h) return `${m} dəq`;
  const hours = h.toLocaleString('tr-TR');
  return hoursOnly || !m ? `${hours} saat` : `${hours} saat ${m} dəq`;
}

/** Original score cell: activity -> time, glv -> "Lv N" (absolute list, level > 0), else the number. */
export function extraScoreText(section: 'glv' | 'activity', score: number, period: string): string {
  if (section === 'activity') return activityText(score);
  const level = period ? 0 : levelFromPoints(score);
  return level ? `Lv ${level}` : score.toLocaleString('tr-TR');
}
