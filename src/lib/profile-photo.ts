import { supabase } from '@/integrations/supabase/client';
import type { PlayerProfile } from '@/lib/cloud-account';

export async function resolveProfilePhoto(profile: PlayerProfile): Promise<PlayerProfile> {
  if (!profile.avatar_path) return profile;
  const { data } = await supabase.storage.from('avatars').createSignedUrl(profile.avatar_path, 3600);
  return { ...profile, avatar_url: data?.signedUrl ?? profile.avatar_url };
}

export async function uploadProfilePhoto(userId: string, file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('JPG, PNG veya WebP seçin; fotoğraf en fazla 5 MB olabilir.');
  const extension = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('avatars').upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  const { error: updateError } = await supabase.from('profiles').update({ avatar_path: path }).eq('id', userId);
  if (updateError) throw new Error(updateError.message);
}