// Telegram Mini App initData validation (pure, unit-testable).
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app

export interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface ParsedInitData {
  user: TelegramWebAppUser;
  authDate: number;
}

type HmacFn = (key: string | Buffer, data: string) => Buffer;

/** Validates Telegram WebApp initData against the bot token. Returns null when invalid. */
export function validateInitData(
  initData: string,
  botToken: string,
  hmac: HmacFn,
  nowSeconds: number,
  maxAgeSeconds = 86400,
): ParsedInitData | null {
  if (!initData || !botToken) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = hmac("WebAppData", botToken);
  const expected = hmac(secretKey, dataCheckString).toString("hex");
  if (expected.length !== hash.length) return null;
  // Constant-time compare without leaking length differences.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ hash.charCodeAt(i);
  if (diff !== 0) return null;

  const authDate = Number(params.get("auth_date") ?? "0");
  if (!Number.isFinite(authDate) || authDate <= 0) return null;
  if (nowSeconds - authDate > maxAgeSeconds) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;
  try {
    const user = JSON.parse(userRaw) as TelegramWebAppUser;
    if (!user || typeof user.id !== "number" || !user.first_name) return null;
    return { user, authDate };
  } catch {
    return null;
  }
}

export function telegramEmail(telegramId: number): string {
  return `tg_${telegramId}@butl.local`;
}
