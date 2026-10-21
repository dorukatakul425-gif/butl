import { getSupabase } from './supabase';
import { refreshProfile } from './auth';
import type { SourceFeatureSnapshot } from './source-feature-session';
export type EditableProfile = NonNullable<SourceFeatureSnapshot['profile']>;
export async function readProfileEdit(): Promise<EditableProfile> {
  const sb = getSupabase(); if (!sb) throw new Error('Giriş sessiyası tapılmadı.');
  const { data, error } = await sb.rpc('get_profile_edit_state');
  if (error) throw new Error(error.message); if (!data) throw new Error('Profil məlumatları alınmadı.');
  return data as EditableProfile;
}
export async function saveProfileEdit(input: Record<string, string | number>) {
  const sb = getSupabase(); if (!sb) throw new Error('Giriş sessiyası tapılmadı.');
  const { data, error } = await sb.rpc('save_profile_info', { p_birthday: input['birthday'], p_male: input['male'] === 1,
    p_expected_price: input['expectedPrice'], p_expected_birthday: input['expectedBirthday'], p_expected_male: input['expectedMale'] === 1 });
  if (error) throw new Error(error.message); await refreshProfile(); return data as EditableProfile;
}
/** Store an actual prepared JPEG, never a browser-only blob URL in a profile row. */
export async function saveProfilePhoto(viewerId: string, photo: string) {
  const sb = getSupabase(); if (!sb) throw new Error('Giriş sessiyası tapılmadı.');
  let url: string | null = null;
  if (photo) {
    if (!photo.startsWith('data:image/jpeg;base64,')) throw new Error('Etibarsız şəkil.');
    const bytes = Uint8Array.from(atob(photo.split(',')[1] ?? ''), c => c.charCodeAt(0));
    const path = `${viewerId}/${crypto.randomUUID()}.jpg`;
    const upload = await sb.storage.from('avatars').upload(path, bytes, { contentType: 'image/jpeg' });
    if (upload.error) throw new Error(upload.error.message);
    const signed = await sb.storage.from('avatars').createSignedUrl(path, 60 * 60 * 24 * 365);
    if (signed.error || !signed.data?.signedUrl) throw new Error('Şəkil yüklənmədi.');
    url = signed.data.signedUrl;
  }
  const { error } = await sb.from('profiles').update({ photo_url: url }).eq('id', viewerId);
  if (error) throw new Error(error.message); await refreshProfile();
}
export async function prepareProfilePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Yalnız şəkil faylı seçin.');
  const image = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1024;
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Şəkli emal etmək mümkün olmadı.');
    const size = Math.min(image.width, image.height);
    ctx.drawImage(image, (image.width-size)/2, (image.height-size)/2, size, size, 0, 0, 1024, 1024);
    return canvas.toDataURL('image/jpeg', 0.9);
  } finally { image.close(); }
}
