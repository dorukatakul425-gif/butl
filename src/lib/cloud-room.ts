import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { attachGameSession, type ChatPlayer, type GameSessionSnapshot } from '@/lib/game-session';
import { useCloudAccount, type PlayerProfile } from '@/lib/cloud-account';
import { DEFAULT_PHOTO } from '@/lib/ciliz-default-photo';
import type { Database } from '@/integrations/supabase/types';
import { useServerFn } from '@tanstack/react-start';
import { translateRoomMessage } from '@/lib/chat-translation.functions';
import { resolveProfilePhoto } from '@/lib/profile-photo';

export interface SharedRound { phase: 'waiting' | 'offer' | 'choose' | 'result'; spinner: string | null; target: string | null; decisions: Record<string, 'kiss' | 'refuse'>; deadline?: string; started_at?: string; turns?: number }
export interface RoomPlayer extends ChatPlayer { seat: number; username: string; gender: string | null; onboarded: boolean }
export type RoomEvent = Database['public']['Tables']['game_events']['Row'];
export interface CloudRoom { id: string; players: RoomPlayer[]; events: RoomEvent[]; round: SharedRound }
const toPlayer = (p: PlayerProfile): ChatPlayer => ({ id: p.id, name: p.display_name, photoUrl: p.avatar_url || DEFAULT_PHOTO, frame: p.frame, stone: p.stone });
export function useCloudRoom() {
  const translateMessage = useServerFn(translateRoomMessage);
  const { user } = useCloudAccount();
  const [room, setRoom] = useState<CloudRoom | null>(null);
  const [error, setError] = useState('');
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    const restart = () => { setRoom(null); setError(''); setGeneration(value => value + 1); };
    window.addEventListener('game-room-rejoin', restart);
    return () => window.removeEventListener('game-room-rejoin', restart);
  }, []);
  useEffect(() => {
    if (!user) return;
    let alive = true;
    let channel: ReturnType<typeof supabase.channel> | undefined;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    const reconcileRound = (event: Event) => {
      const result = (event as CustomEvent<{ roomId: string; round: SharedRound }>).detail;
      setRoom(current => current?.id === result.roomId ? { ...current, round: result.round } : current);
    };
    window.addEventListener('game-round-confirmed', reconcileRound);
    const listeners = new Set<() => void>();
    let snapshot: GameSessionSnapshot = { viewer: null, hearts: null, messages: [] };
    let refreshing = false, again = false;
    const start = async () => {
      const joined = await supabase.rpc('join_game');
      if (joined.error || !joined.data) throw new Error(joined.error?.message ?? 'Masaya katılınamadı.');
      const id = joined.data;
      if (!alive) return;
      await supabase.rpc('play_round', { action: 'refresh' });
      const refresh = async () => {
        if (!alive) return;
        if (refreshing) { again = true; return; }
        refreshing = true;
        try {
          const [members, state, messages, events, wallet, blocked] = await Promise.all([
            supabase.from('room_members').select('*, profiles(*)').eq('room_id', id).gt('last_seen', new Date(Date.now() - 90000).toISOString()),
            supabase.from('game_rooms').select('*').eq('id', id).single(),
            supabase.from('game_messages').select('*, sender:profiles!game_messages_sender_id_fkey(*), receiver:profiles!game_messages_receiver_id_fkey(*)').eq('room_id', id).order('created_at', { ascending: false }).limit(100),
            supabase.from('game_events').select('*').eq('room_id', id).order('id', { ascending: false }).limit(200),
            supabase.from('wallets').select('*').eq('user_id', user.id).single(),
            supabase.from('user_blocks').select('blocked_id').eq('user_id', user.id),
          ]);
          for (const result of [members, state, messages, events, wallet, blocked]) if (result.error) throw new Error(result.error.message);
          if (!alive) return;
          const players = (await Promise.all((members.data ?? []).map(async m => m.profiles ? { ...toPlayer(await resolveProfilePhoto(m.profiles)), username: m.profiles.username, gender: m.profiles.gender, onboarded: Boolean(m.profiles.onboarding_completed_at), seat: m.seat } : null))).filter((p): p is RoomPlayer => p !== null);
          const hidden = new Set(blocked.data?.map(b => b.blocked_id));
          snapshot = { viewer: players.find(p => p.id === user.id) ?? null, hearts: wallet.data?.hearts ?? null, messages: (messages.data ?? []).reverse().flatMap(m => m.sender && !hidden.has(m.sender_id) ? [{ id: m.id, text: m.text, sender: toPlayer(m.sender), ...(m.receiver ? { receiver: toPlayer(m.receiver) } : {}), canTranslate: true }] : []) };
          listeners.forEach(fn => fn());
          setRoom({ id, players, events: (events.data ?? []).reverse(), round: state.data?.round as unknown as SharedRound });
          setError('');
        } catch (e) { if (alive) setError(e instanceof Error ? e.message : 'Bağlantı yenilenemedi.'); }
        finally { refreshing = false; if (again) { again = false; void refresh(); } }
      };
      attachGameSession({
        getSnapshot: () => snapshot,
        subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
        sendMessage: async (text, receiverId) => { const { error } = await supabase.from('game_messages').insert({ room_id: id, sender_id: user.id, receiver_id: receiverId ?? null, text }); if (error) throw new Error(error.message); await refresh(); },
        translateMessage: messageId => translateMessage({ data: { id: messageId } }),
        reportMessage: async messageId => { const { error } = await supabase.from('user_reports').insert({ reporter_id: user.id, message_id: messageId }); if (error) throw new Error(error.message); },
        blockUser: async blockedId => { const { error } = await supabase.from('user_blocks').upsert({ user_id: user.id, blocked_id: blockedId }); if (error) throw new Error(error.message); await refresh(); },
      });
      channel = supabase.channel(`room-${id}-${user.id}`);
      for (const table of ['room_members', 'game_messages'] as const) channel.on('postgres_changes', { event: '*', schema: 'public', table, filter: `room_id=eq.${id}` }, () => void refresh());
      // Deliver each confirmed gift immediately, without waiting for six readbacks.
      channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'game_events', filter: `room_id=eq.${id}` }, payload => {
        const event = payload.new as RoomEvent;
        if (!alive || event.room_id !== id) return;
        setRoom(current => current?.id === id && !current.events.some(existing => existing.id === event.id)
          ? { ...current, events: [...current.events, event].slice(-400) }
          : current);
      });
      channel.on('postgres_changes', { event: '*', schema: 'public', table: 'game_rooms', filter: `id=eq.${id}` }, payload => {
        const next = payload.new as { round?: SharedRound };
        const round = next.round;
        if (round) setRoom(current => current?.id === id ? { ...current, round } : current);
      });
      channel.on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` }, () => void refresh());
      channel.on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => void refresh());
      channel.subscribe(status => { if (status === 'SUBSCRIBED') void refresh(); });
      heartbeat = setInterval(() => { void supabase.rpc('heartbeat_game').then(() => refresh()); }, 25000);
      await refresh();
    };
    void start().catch(e => { if (alive) setError(e instanceof Error ? e.message : 'Masaya katılınamadı.'); });
    return () => { alive = false; window.removeEventListener('game-round-confirmed', reconcileRound); if (heartbeat) clearInterval(heartbeat); if (channel) void supabase.removeChannel(channel); attachGameSession(null); };
  }, [user?.id, generation]);
  return { room, error };
}
export async function performRound(action: 'spin' | 'decide' | 'refresh', decision?: 'kiss' | 'refuse', roomId?: string) {
  const { data, error } = await supabase.rpc('play_round', { action, ...(decision ? { decision } : {}) });
  if (error) throw new Error(error.message);
  if (roomId && data) window.dispatchEvent(new CustomEvent('game-round-confirmed', { detail: { roomId, round: data } }));
}