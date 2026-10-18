import type { TelegramWebAppUser } from './telegram-auth';
import { telegramIdentity } from './telegram-profile-sync';

/** undefined means unavailable: never erase saved information after a failed API call. */
export async function fetchTelegramProfile(botToken: string, user: TelegramWebAppUser) {
  const api = `https://api.telegram.org/bot${botToken}`;
  async function call(method: string, body: object) {
    try {
      const response = await fetch(`${api}/${method}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body), signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return undefined;
      const value = await response.json();
      return value.ok ? value.result : undefined;
    } catch { return undefined; }
  }
  const [chat, photos] = await Promise.all([
    call('getChat', { chat_id: user.id }),
    call('getUserProfilePhotos', { user_id: user.id, limit: 1 }),
  ]);
  const privateChat = chat?.id === user.id && chat?.type === 'private' ? chat : undefined;
  const identity = telegramIdentity(user, privateChat);
  const bio: string | undefined = privateChat ? (typeof privateChat.bio === 'string' ? privateChat.bio : '') : undefined;
  let photo: Uint8Array | null | undefined;
  if (photos?.total_count === 0) photo = null;
  // getChat identifies the currently visible profile picture, including a public fallback photo.
  const fileId = privateChat?.photo?.big_file_id ?? photos?.photos?.[0]?.at(-1)?.file_id;
  if (fileId) {
    const file = await call('getFile', { file_id: fileId });
    if (file?.file_path) {
      try {
        const response = await fetch(`https://api.telegram.org/file/bot${botToken}/${file.file_path}`, { signal: AbortSignal.timeout(8000) });
        if (response.ok) {
          const bytes = new Uint8Array(await response.arrayBuffer());
          if (bytes.byteLength > 0) photo = bytes;
        }
      } catch { /* Preserve the last working photo on transient failure. */ }
    }
  }
  // Mini App's photo_url is signed initData, but never fetch an arbitrary URL from it.
  if (photo === undefined && user.photo_url) {
    try {
      const url = new URL(user.photo_url);
      if (url.protocol === 'https:' && url.hostname === 't.me' && url.pathname.startsWith('/i/userpic/')) {
        const response = await fetch(url, { signal: AbortSignal.timeout(8000), redirect: 'error' });
        if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
          const bytes = new Uint8Array(await response.arrayBuffer());
          if (bytes.byteLength > 0 && bytes.byteLength <= 10 * 1024 * 1024) photo = bytes;
        }
      }
    } catch { /* Keep the last successfully synchronized photo. */ }
  }
  return { ...identity, bio, photo };
}
