import { describe, expect, it } from 'vitest';
import { telegramZodiac, profileIsAtTable } from '@/lib/telegram-profile';
import { bottleItems } from '@/lib/bottle-game';
import type { CilizAssets } from '@/lib/ciliz-assets';

describe('Telegram profile rules', () => {
  it('unlocks VIP bottles for active VIP only', () => {
    const assets = { bottleStore: [{ id: 'vip', vip_s: true }], bottles: { vip: { type: 'vip' } }, translation: {} } as unknown as CilizAssets;
    expect(bottleItems(assets, 'tg', true)[0]?.locked).toBe(false);
    expect(bottleItems(assets, 'tg', false)[0]?.locked).toBe(true);
  });
  it('blocks table actions for absent users and reacts to departure/re-entry', () => {
    expect(profileIsAtTable('other', [{ id: 'me' }, { id: 'other' }])).toBe(true);
    expect(profileIsAtTable('other', [{ id: 'me' }, null])).toBe(false);
    expect(profileIsAtTable('other', [{ id: 'other' }])).toBe(true);
    expect(profileIsAtTable(undefined, [{ id: 'me' }])).toBe(false);
  });
  it('uses Telegram birthday boundaries and original SVG indices, not generic zodiac dates', () => {
    const boundaries = [['01-20',9],['01-21',10],['02-19',10],['02-20',11],['03-20',11],['03-21',0],['04-20',0],['04-21',1],['05-21',1],['05-22',2],['06-21',2],['06-22',3],['07-22',3],['07-23',4],['08-21',4],['08-22',5],['09-23',5],['09-24',6],['10-23',6],['10-24',7],['11-22',7],['11-23',8],['12-22',8],['12-23',9]] as const;
    for (const [date, sign] of boundaries) expect(telegramZodiac(`2000-${date}`)).toBe(sign);
    expect(telegramZodiac(null)).toBeUndefined();
    expect(telegramZodiac('2000-02-30')).toBeUndefined();
  });
});