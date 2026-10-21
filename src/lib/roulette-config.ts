import { z } from 'zod';

export const rouletteConfigSchema = z.object({
  enabled: z.boolean(),
  spinCost: z.number().int().min(1).max(10000),
  dailyChances: z.number().int().min(0).max(10000),
  bundleChances: z.number().int().min(1).max(10000),
  bundleDat: z.number().int().min(1).max(1000000),
  revision: z.number().int().nonnegative(),
  prizes: z.array(z.object({ id: z.number().int().min(0).max(15), percentage: z.number().min(0).max(100).refine(v => Math.abs(v * 100 - Math.round(v * 100)) < 0.000001, 'Ən çox iki onluq rəqəm.') })).length(16),
}).superRefine((v, ctx) => {
  if (new Set(v.prizes.map(p => p.id)).size !== 16) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Bütün 16 mükafat bir dəfə göstərilməlidir.' });
  if (v.prizes.reduce((s, p) => s + Math.round(p.percentage * 100), 0) !== 10000) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Ehtimalların cəmi 100% olmalıdır.' });
});
export type RouletteConfigInput = z.infer<typeof rouletteConfigSchema>;
export const roulettePrizeNames: Record<string, string> = { chances: 'Çarx şansı', tokens: 'Token', gold: 'Ürək', kiss_fire: 'Alovlu öpüş', league5: 'Liqa gücləndiricisi', league_kiss2x: 'İkiqat liqa öpüşü', refuse_slap: 'Şillə ilə imtina' };