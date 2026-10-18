export function telegramTopupUrl(amount: number, playerNo?: number | null) {
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error('Etibarsız DAT miqdarı.');
  const text = `Salam! Deltagame.az oyun hesabıma ${amount} DAT yükləmək istəyirəm.${playerNo ? ` Oyunçu nömrəm: #${playerNo}.` : ''} Zəhmət olmasa, ödəniş məlumatlarını göndərin.`;
  return `https://t.me/deltagameadmin?text=${encodeURIComponent(text)}`;
}

/** Account linkage alone is not enough: the current launch must be inside Telegram. */
export function shouldContactTelegramAdmin(insufficient: boolean, telegramId: number | null | undefined, initData: string | undefined) {
  return insufficient && Boolean(telegramId && initData);
}