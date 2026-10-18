import { z } from 'zod';
export const telegramNoticeSchema = z.object({
  text: z.string().trim().max(4096), bold: z.boolean(), silent: z.boolean(),
  kind: z.enum(['text', 'photo', 'video']), media: z.string().max(2000).default(''),
  after: z.string().uuid().nullable(),
}).superRefine((v, ctx) => {
  if (v.kind === 'text' && !v.text) ctx.addIssue({ code: 'custom', message: 'Mətn daxil edin.' });
  if (v.kind !== 'text') {
    if (v.text.length > 1024) ctx.addIssue({ code: 'custom', message: 'Şəkil/video mətni 1024 simvoldan çox ola bilməz.' });
    if (!v.media) ctx.addIssue({ code: 'custom', message: 'Şəkil və ya video seçin.' });
    if (v.media.startsWith('http') && !v.media.startsWith('https://')) ctx.addIssue({ code: 'custom', message: 'HTTPS keçidi tələb olunur.' });
  }
});
export function telegramHtml(text: string, bold: boolean) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return bold && escaped ? `<b>${escaped}</b>` : escaped;
}
export function telegramPayload(input: z.infer<typeof telegramNoticeSchema>, chatId: string | number) {
  const text = telegramHtml(input.text, input.bold);
  const common = { chat_id: chatId, parse_mode: 'HTML', disable_notification: input.silent };
  return input.kind === 'text' ? { method: 'sendMessage', body: { ...common, text } } :
    { method: input.kind === 'photo' ? 'sendPhoto' : 'sendVideo', body: { ...common, [input.kind]: input.media, caption: text } };
}
