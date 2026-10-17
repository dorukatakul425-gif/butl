/** Port of LeaguePresenter's split and ranking (leagueCompare) from the original client. */
export interface LeagueRow { id: string; name: string; score: number; photo?: string }
export interface LeagueInfo { state: string; level?: number; round_id?: number; start_ms?: number; finish_ms?: number; users_max?: number; move_up?: number; move_down?: number; max_league?: number; kisses?: number; kisses_lim?: number; limit?: 'kiss' | 'gift' | 'all' | null; gold?: number; gifts?: string[]; final_pos?: number | null; reward_gold?: number | null; reward_gifts?: string[] | null; users?: Array<{ id: string; name: string; photo_url?: string | null; score: number }> }

/** users.up = [0, move_up), stay = [move_up, users_max - move_down), down = rest. */
export function splitLeague<T>(users: T[], moveUp: number, moveDown: number, usersMax: number) {
  return { up: users.slice(0, moveUp), stay: users.slice(moveUp, Math.max(moveUp, usersMax - moveDown)), down: users.slice(Math.max(moveUp, usersMax - moveDown)) };
}

/** Header pill: position while running, final place when finished. */
export function leagueHeader(info: LeagueInfo, viewerId: string, now: number) {
  if (info.state === 'welcome') return { type: 'welcome' as const };
  if (info.state !== 'running' && info.state !== 'finished') return { type: 'unknown' as const };
  const pos = (info.users ?? []).findIndex(u => u.id === viewerId) + 1;
  if (info.state === 'finished') return { type: 'finished' as const, positionText: String(info.final_pos ?? (pos || '—')) };
  const left = Math.max(0, (info.finish_ms ?? now) - now), h = Math.floor(left / 3600000), d = Math.floor(h / 24);
  return { type: 'running' as const, positionText: pos ? String(pos) : '—', leftTimeShortText: d > 0 ? `${d}g` : h > 0 ? `${h}s` : `${Math.ceil(left / 60000)}dk` };
}
