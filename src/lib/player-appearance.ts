import { z } from 'zod';

export const NAME_STYLES = ['default', 'ruby', 'emerald', 'sapphire', 'gold', 'rose', 'rainbow'] as const;
export type NameStyle = typeof NAME_STYLES[number];
export const NAME_STYLE_LABELS: Record<NameStyle, string> = { default: 'Standart', ruby: 'Yaqut', emerald: 'Zümrüd', sapphire: 'Sapfir', gold: 'Qızıl', rose: 'Qızılgül', rainbow: 'Göy qurşağı' };
export const appearanceInput = z.object({ userId: z.string().uuid(), nameStyle: z.enum(NAME_STYLES), creator: z.boolean() });
export interface PlayerAppearance { level: number; nameStyle: NameStyle; creator: boolean }
export const DEFAULT_APPEARANCE: PlayerAppearance = { level: 0, nameStyle: 'default', creator: false };
export function validNameStyle(value: unknown): NameStyle { return NAME_STYLES.find(style => style === value) ?? 'default'; }

/** A revision observed after this document opened needs confirmation, never an automatic reload. */
export function needsRefresh(event: { id: string; created_at: string } | null, openedAt: number, seen: ReadonlySet<string>): boolean {
  return Boolean(event && !seen.has(event.id) && Date.parse(event.created_at) >= openedAt);
}