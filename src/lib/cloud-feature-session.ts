// Lovable Cloud adapter for the source feature dialogs (currently: change table).
import { attachSourceFeatureSession, type SourceFeatureSnapshot, type SourceTableEntry } from './source-feature-session';
import { getSupabase } from './supabase';
import { leagueHeader, type LeagueInfo } from './league';

let snapshot: SourceFeatureSnapshot = { viewerId: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
let tableRead = 0;
let preferenceRevision = 0;
async function refreshPreference(viewerId: string) {
  const sb = getSupabase();
  if (!sb) return;
  const revision = ++preferenceRevision;
  const { data, error } = await sb.auth.getUser();
  if (error || snapshot.viewerId !== viewerId || revision !== preferenceRevision) return;
  snapshot = { ...snapshot, leagueParticipation: data.user?.user_metadata['league_participation'] === true };
  emit();
}

async function refreshTables() {
  const sb = getSupabase();
  if (!sb) return;
  const read = ++tableRead;
  const { data, error } = await sb.rpc('list_tables');
  if (error || read !== tableRead) return;
  const history: SourceTableEntry[] = ((data ?? []) as Array<{ room_id: number; men: number; women: number; bottle: string; is_current: boolean }>).map((r) => ({
    id: String(r.room_id), bottle: r.bottle || 'standart', men: r.men, women: r.women, ...(r.is_current ? { current: true } : {}),
  }));
  snapshot = { ...snapshot, tables: { friends: [], history, canViewById: true } };
  emit();
}

let leagueRead = 0, leagueInfo: LeagueInfo | null = null, leagueChannel: { unsubscribe: () => unknown } | null = null, leagueRound: number | undefined, leagueTimer: ReturnType<typeof setInterval> | undefined;
function applyLeague(viewerId: string) {
  const info = leagueInfo;
  if (!info) return;
  const running = info.state === 'running' || info.state === 'finished';
  snapshot = {
    ...snapshot,
    leagueState: info.state,
    leagueLevel: info.level ?? 0,
    leagueHeader: leagueHeader(info, viewerId, Date.now()),
    league: running ? {
      level: info.level ?? 0, endsAt: info.finish_ms ?? Date.now(),
      score: info.users?.find(u => u.id === viewerId)?.score ?? 0,
      players: (info.users ?? []).map(u => ({ id: u.id, name: u.name, score: u.score, ...(u.photo_url && /^https?:/.test(u.photo_url) ? { photo: u.photo_url } : {}) })),
      state: info.state as 'running' | 'finished', ...(info.round_id !== undefined ? { roundId: info.round_id } : {}),
      usersMax: info.users_max ?? 20, moveUp: info.move_up ?? 3, moveDown: info.move_down ?? 3, maxLeague: info.max_league ?? 0,
      kisses: info.kisses ?? 0, kissesLim: info.kisses_lim ?? 500, limit: info.limit ?? null, gold: info.gold ?? 0, gifts: info.gifts ?? [],
      finalPos: info.final_pos ?? null, rewardGold: info.reward_gold ?? null, rewardGifts: info.reward_gifts ?? null,
    } : undefined,
  } as SourceFeatureSnapshot;
  emit();
}
async function refreshLeague(viewerId: string) {
  const sb = getSupabase();
  if (!sb) return;
  const read = ++leagueRead;
  const { data, error } = await sb.rpc('get_league' as never);
  if (read !== leagueRead || snapshot.viewerId !== viewerId) return;
  if (error || !data) { console.error('get_league failed', error); if (!leagueInfo) { snapshot = { ...snapshot, leagueState: 'error' }; emit(); } return; }
  leagueInfo = data as unknown as LeagueInfo;
  applyLeague(viewerId);
  // Live score updates for this round over Realtime websockets (league_score).
  if (leagueInfo.round_id !== leagueRound) {
    leagueRound = leagueInfo.round_id;
    void leagueChannel?.unsubscribe(); leagueChannel = null;
    if (leagueRound !== undefined) {
      let t: ReturnType<typeof setTimeout> | undefined;
      const again = () => { clearTimeout(t); t = setTimeout(() => void refreshLeague(viewerId), 250); };
      leagueChannel = sb.channel(`league-${leagueRound}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'league_members', filter: `round_id=eq.${leagueRound}` }, again)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'league_rounds', filter: `id=eq.${leagueRound}` }, again)
        .subscribe();
    }
  }
}

export function installCloudFeatureSession(viewerId: string, rejoin: (membership: { room_id: number; seat: number }) => Promise<unknown>) {
  preferenceRevision++;
  snapshot = { viewerId, leagueState: 'loading', tables: { friends: [], history: [], canViewById: true } };
  attachSourceFeatureSession({
    getSnapshot: () => snapshot,
    subscribe: (l) => { listeners.add(l); return () => { listeners.delete(l); }; },
    execute: async (action, input) => {
      const sb = getSupabase();
      if (!sb) return { confirmed: false, message: 'Server bağlantısı yoxdur.' };
      if (action === 'league-settings') {
        if (input?.['enabled'] !== 0 && input?.['enabled'] !== 1) return { confirmed: false };
        const revision = ++preferenceRevision;
        const { data, error } = await sb.auth.updateUser({ data: { league_participation: input['enabled'] === 1 } });
        if (error) return { confirmed: false, message: 'Lig seçimi kaydedilemedi.' };
        if (snapshot.viewerId === viewerId && revision === preferenceRevision) { snapshot = { ...snapshot, leagueParticipation: data.user?.user_metadata['league_participation'] === true }; emit(); }
        await refreshLeague(viewerId);
        return { confirmed: true };
      }
      if (action === 'league-refresh') { await refreshLeague(viewerId); return { confirmed: true }; }
      if (action === 'league-seen') {
        const round = Number(input?.['roundId']);
        if (!Number.isSafeInteger(round)) return { confirmed: false };
        const { error } = await sb.rpc('league_seen' as never, { p_round: round } as never);
        if (error) return { confirmed: false, message: error.message };
        await refreshLeague(viewerId);
        return { confirmed: true };
      }
      if (action === 'user-kick' || action === 'user-save') return { confirmed: false, message: 'Şutla ve Koru hizmeti bağlı değil.' };
      if (action !== 'change-table') return { confirmed: false };
      const tableId = input?.['tableId'];
      if (tableId !== undefined && snapshot.tables?.history.find((h) => h.id === String(tableId))?.current) return { confirmed: true };
      const { data, error } = await sb.rpc('change_table', tableId !== undefined ? { p_room: Number(tableId) } : {});
      if (error) return { confirmed: false, message: error.message };
      const membership = Array.isArray(data) ? data[0] : null;
      if (!membership) return { confirmed: false, message: 'Masaya qoşulmaq olmadı.' };
      await rejoin({ room_id: Number(membership.room_id), seat: Number(membership.seat) });
      await refreshTables();
      return { confirmed: true };
    },
  });
  void refreshTables();
  void refreshPreference(viewerId);
  leagueInfo = null; leagueRound = undefined; void leagueChannel?.unsubscribe(); leagueChannel = null;
  void refreshLeague(viewerId);
  // Header timer, finish detection and joining once the viewer earns points.
  clearInterval(leagueTimer);
  let ticks = 0;
  leagueTimer = setInterval(() => {
    if (snapshot.viewerId !== viewerId) return;
    ticks++;
    const ended = leagueInfo?.state === 'running' && (leagueInfo.finish_ms ?? Infinity) <= Date.now();
    if (ended || ticks % 6 === 0) void refreshLeague(viewerId); else applyLeague(viewerId);
  }, 10000);
  // Live men/women counts: any seat change anywhere refreshes the list.
  const sb = getSupabase();
  if (sb && !liveChannel) {
    let t: ReturnType<typeof setTimeout> | undefined;
    liveChannel = sb.channel('tables-live').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_players' }, () => {
      clearTimeout(t); t = setTimeout(() => void refreshTables(), 300);
    }).on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'room_players' }, () => {
      clearTimeout(t); t = setTimeout(() => void refreshTables(), 300);
    }).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms' }, (p) => {
      const n = p.new as { id?: number; bottle?: string };
      if (snapshot.tables?.history.some((h) => h.id === String(n.id) && h.bottle !== n.bottle)) { clearTimeout(t); t = setTimeout(() => void refreshTables(), 300); }
    }).subscribe();
  }
}
let liveChannel: ReturnType<NonNullable<ReturnType<typeof getSupabase>>['channel']> | null = null;
