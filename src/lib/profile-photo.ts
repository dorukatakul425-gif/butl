import { supabase } from '@/integrations/supabase/client';
import type { PlayerProfile } from '@/lib/cloud-account';
const signedPhotos = new Map<string, { expires: number; request: Promise<string | null> }>();

export async function resolveProfilePhoto(profile: PlayerProfile): Promise<PlayerProfile> {
  if (!profile.avatar_path) return profile;
  const path = profile.avatar_path;
  let cached = signedPhotos.get(path);
  if (!cached || cached.expires < Date.now()) {
    cached = { expires: Date.now() + 3300000, request: supabase.storage.from('avatars').createSignedUrl(path, 3600).then(({ data }) => data?.signedUrl ?? null) };
    signedPhotos.set(path, cached);
    void cached.request.then(url => { if (!url) signedPhotos.delete(path); });
  }
  return { ...profile, avatar_url: await cached.request ?? profile.avatar_url };
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