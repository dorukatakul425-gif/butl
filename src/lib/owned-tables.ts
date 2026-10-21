import { getSupabase } from './supabase';
export interface OwnedTableInfo { price: number | null; days: number; credit_until: string | null; room_id: number | null; number: number | null; name: string; until: string | null; has_password: boolean; here: boolean; max_number: number }
export async function tableRpc<T>(name: string, args?: Record<string, unknown>): Promise<T> {
  const sb = getSupabase();
  if (!sb) throw new Error('Hesaba giriş et.');
  const { data, error } = await sb.rpc(name, args);
  if (error) throw new Error(error.message);
  return data as T;
}
