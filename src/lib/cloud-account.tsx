import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { resolveProfilePhoto } from '@/lib/profile-photo';

export type PlayerProfile = Database['public']['Tables']['profiles']['Row'];
export type PlayerWallet = Database['public']['Tables']['wallets']['Row'];
const AccountContext = createContext<{ user: User | null; profile: PlayerProfile | null; wallet: PlayerWallet | null; loading: boolean; refresh: () => Promise<void> }>({ user: null, profile: null, wallet: null, loading: true, refresh: async () => {} });
export function CloudAccountProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { queryClient } = router.options.context;
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [wallet, setWallet] = useState<PlayerWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    if (data.user) {
      const [p, w] = await Promise.all([supabase.from('profiles').select('*').eq('id', data.user.id).single(), supabase.from('wallets').select('*').eq('user_id', data.user.id).single()]);
      setProfile(p.data ? await resolveProfilePhoto(p.data) : null); setWallet(w.data);
    } else { setProfile(null); setWallet(null); }
    setLoading(false);
  };
  useEffect(() => {
    void refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      if (event === 'SIGNED_OUT') { setUser(null); setProfile(null); setWallet(null); }
      else { window.setTimeout(() => void refresh(), 0); void queryClient.invalidateQueries(); }
      void router.invalidate();
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel(`account-${user.id}`).on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` }, () => void refresh()).on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, () => void refresh()).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [user?.id]);
  return <AccountContext.Provider value={{ user, profile, wallet, loading, refresh }}>{children}</AccountContext.Provider>;
}
export const useCloudAccount = () => useContext(AccountContext);
export async function leaveRoom() { const { error } = await supabase.rpc('leave_game'); if (error) throw error; }