// Lovable Cloud adapter for the source feature dialogs (currently: change table).
import { attachSourceFeatureSession, type SourceFeatureSnapshot, type SourceTableEntry } from './source-feature-session';
import { getSupabase } from './supabase';
import { readProfileEdit, saveProfileEdit, saveProfilePhoto } from './profile-edit';
import { leagueHeader, type LeagueInfo } from './league';
import { refreshProfile } from './auth';

let snapshot: SourceFeatureSnapshot = { viewerId: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
let tableRead = 0;
let preferenceRevision = 0;
let kickoutRead = 0;
let rouletteRead = 0;
async function refreshRoulette(viewerId: string) {
  const sb = getSupabase();
  if (!sb) return;
  const read = ++rouletteRead;
  const { data, error } = await sb.rpc('roulette_info' as never);
  if (snapshot.viewerId !== viewerId || read !== rouletteRead) return;
  if (error || !data) throw new Error('Çarx məlumatları alınmadı. Yenidən yoxlayın.');
  snapshot = { ...snapshot, roulette: data as SourceFeatureSnapshot['roulette'] }; emit();
}
async function refreshKickout(viewerId: string) {
  const sb = getSupabase();
  if (!sb) return;
  const read = ++kickoutRead;
  const { data, error } = await sb.rpc('kickout_refresh');
  if (read !== kickoutRead || snapshot.viewerId !== viewerId) return;
  if (error || !data?.configured) {
    const { kickout: _kickout, ...rest } = snapshot;
    snapshot = rest; emit(); return;
  }
  snapshot = { ...snapshot, kickout: { price: data.price, vip: data.vip, freeAt: data.freeAt, lastFreeAt: data.lastFreeAt, targets: data.targets } };
  emit();
}
async function refreshPreference(viewerId: string) {
  const sb = getSupabase();
  if (!sb) return;
  const revision = ++preferenceRevision;
  const { data, error } = await sb.auth.getUser();
  if (error || snapshot.viewerId !== viewerId || revision !== preferenceRevision) return;
  snapshot = { ...snapshot, leagueParticipation: data.user?.user_metadata['league_participation'] !== false };
  emit();
}

async function refreshTables() {
  const sb = getSupabase();
  if (!sb) return;
  const read = ++tableRead;
  const { data, error } = await sb.rpc('list_tables');
  if (error || read !== tableRead) return;
  const history: SourceTableEntry[] = ((data ?? []) as Array<{ room_id: number; number?: number; name?: string; locked?: boolean; owned?: boolean; men: number; women: number; bottle: string; is_current: boolean; blocked_until: string | null; kicker_id: string | null; kicker_name: string | null; kicker_photo: string | null; kicker_male: boolean | null }>).map((r) => ({
    id: String(r.room_id), number: r.number ?? r.room_id, name: r.name ?? '', locked: r.locked ?? false, owned: r.owned ?? false, bottle: r.bottle || 'standart', men: r.men, women: r.women, ...(r.is_current ? { current: true } : {}),
    ...(r.blocked_until ? { blockedUntil: Date.parse(r.blocked_until) } : {}),
    ...(r.kicker_id ? { kicker: { id: r.kicker_id, name: r.kicker_name ?? '', ...(r.kicker_photo ? { photo: r.kicker_photo } : {}), ...(r.kicker_male !== null ? { male: r.kicker_male } : {}) } } : {}),
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
      if (action === 'roulette-refresh') { await refreshRoulette(viewerId); return { confirmed: true }; }
      if (action === 'roulette-spin' || action === 'roulette-buy-chances') {
        if (!snapshot.roulette || snapshot.viewerId !== viewerId || typeof input?.['requestId'] !== 'string') return { confirmed: false };
        const { data, error } = await sb.rpc('roulette_action' as never, { p_request: input['requestId'], p_action: action === 'roulette-spin' ? 'spin' : 'buy', p_revision: snapshot.roulette.revision } as never);
        if (error) { await refreshRoulette(viewerId).catch(() => undefined); return { confirmed: false, message: error.message }; }
        // Payment already committed; a failed follow-up read must not discard the earned result.
        await Promise.allSettled([refreshRoulette(viewerId), refreshProfile()]);
        return data as import('./source-feature-session').SourceFeatureResult;
      }
      if (action === 'profile-refresh' || action === 'save-profile' || action === 'save-profile-photo') {
        try {
          if (action === 'save-profile-photo') await saveProfilePhoto(viewerId, String(input?.['photo'] ?? ''));
          const profile = action === 'save-profile' && input ? await saveProfileEdit(input) : await readProfileEdit();
          if (snapshot.viewerId !== viewerId) return { confirmed: false };
          snapshot = { ...snapshot, profile }; emit(); return { confirmed: true };
        } catch (e) {
          return { confirmed: false, message: e instanceof Error ? e.message : 'Profil yadda saxlanılmadı.' };
        }
      }
      if (action === 'league-settings') {
        if (input?.['enabled'] !== 0 && input?.['enabled'] !== 1) return { confirmed: false };
        const revision = ++preferenceRevision;
        const { data, error } = await sb.auth.updateUser({ data: { league_participation: input['enabled'] === 1 } });
        if (error) return { confirmed: false, message: 'Liqa seçimi yadda saxlanılmadı.' };
        if (snapshot.viewerId === viewerId && revision === preferenceRevision) { snapshot = { ...snapshot, leagueParticipation: data.user?.user_metadata['league_participation'] !== false }; emit(); }
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
      if (action === 'user-kick' || action === 'user-save') {
        if (typeof input?.['userId'] !== 'string' || !Number.isSafeInteger(input?.['expectedPrice'])) return { confirmed: false };
        const { error } = await sb.rpc('kickout_action', { p_user: input['userId'], p_action: action === 'user-kick' ? 'kick' : 'save', p_expected_price: input['expectedPrice'] });
        await refreshKickout(viewerId);
        if (error) return { confirmed: false, message: error.message };
        return { confirmed: true };
      }
      if (action !== 'change-table') return { confirmed: false };
      const tableId = input?.['tableId'];
      if (tableId !== undefined && snapshot.tables?.history.find((h) => h.id === String(tableId))?.current) return { confirmed: true };
      const { data, error } = await sb.rpc(tableId !== undefined ? 'enter_table' : 'change_table', tableId !== undefined ? { p_room: Number(tableId), p_password: input?.['password'] ?? null } : {});
      if (error) return { confirmed: false, message: error.message };
      const membership = Array.isArray(data) ? data[0] : null;
      if (membership?.room_id === -1) return { confirmed: false, message: 'wrong_password' };
      if (!membership) return { confirmed: false, message: 'Masaya qoşulmaq olmadı.' };
      await rejoin({ room_id: Number(membership.room_id), seat: Number(membership.seat) });
      await refreshTables();
      return { confirmed: true };
    },
  });
  void refreshTables();
  void refreshKickout(viewerId);
  void refreshPreference(viewerId);
  void refreshRoulette(viewerId).catch(() => undefined);
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
  clearInterval(kickoutTimer);
  kickoutTimer = setInterval(() => { if (snapshot.viewerId === viewerId) void refreshKickout(viewerId); }, 2000);
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
let kickoutTimer: ReturnType<typeof setInterval> | undefined;
