import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

export const purchaseGameItem = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(input => z.object({ kind: z.enum(['gift', 'gesture']), item: z.string().min(1).max(100), receiver: z.string().uuid().nullable() }).parse(input)).handler(async ({ data, context }) => {
  const { data: membership } = await context.supabase.from('room_members').select('room_id').eq('user_id', context.userId).single();
  if (!membership) throw new Error('Önce masaya katılın.');
  const serverResponse = await fetch('https://cdn-s.ciliz.com/mobile/server.json');
  if (!serverResponse.ok) throw new Error('Ürün listesi yüklenemedi.');
  const server = await serverResponse.json() as { assets: { url: string } };
  const manifestUrl = new URL(server.assets.url);
  if (manifestUrl.protocol !== 'https:' || !(manifestUrl.hostname.endsWith('.ciliz.com') || manifestUrl.hostname === 'butilochka.cdnvideo.ru')) throw new Error('Ürün kaynağı doğrulanamadı.');
  const manifestResponse = await fetch(manifestUrl);
  if (!manifestResponse.ok) throw new Error('Ürünler yüklenemedi.');
  type Entry = { id: string; kisses_s?: number; vip_s?: boolean; social?: string[]; platform?: string[]; user_s?: string[]; birthday?: boolean };
  const manifest = await manifestResponse.json() as Record<string, Record<string, unknown>>;
  const group = manifest[data.kind === 'gift' ? 'gifts' : 'gestures'];
  const entries = (group?.[data.kind === 'gift' ? '__store' : '__store_v3'] as Entry[][] | undefined)?.flat() ?? [];
  const entry = entries.find(e => e.id === data.item);
  const item = group?.[data.item] as { storePrice?: number } | undefined;
  if (!entry || !item || entry.birthday || entry.user_s && !entry.user_s.includes(context.userId) || entry.social && !entry.social.includes('ok') || entry.platform && !entry.platform.includes('web')) throw new Error('Bu ürün hesabınız için kullanılamıyor.');
  const price = item.storePrice;
  if (typeof price !== 'number' || !Number.isSafeInteger(price) || price < 0) throw new Error('Ürün fiyatı doğrulanamadı.');
  // Only this authenticated, manifest-validated path may invoke the privileged transaction.
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const seed = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
  const { data: eventId, error } = await supabaseAdmin.rpc('purchase_game_item', { actor: context.userId, receiver: data.receiver ?? context.userId, kind: data.kind, item: data.item, price, need_kisses: entry.kisses_s ?? 0, need_vip: entry.vip_s ?? false, seed: seed % 233280 });
  if (error) throw new Error(error.message);
  return eventId;
});