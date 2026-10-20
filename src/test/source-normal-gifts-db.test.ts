// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { SOURCE_NORMAL_ENTRIES, SOURCE_NORMAL_GIFTS } from '@/lib/source-normal-gifts';

it('every added ordinary gift has its authoritative price without overriding configured prices or adding rewards', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE TABLE gift_prices(gift_type text PRIMARY KEY, price int, kisses_required int, vip_only boolean, kisses int, hearts int);
      INSERT INTO gift_prices VALUES ('bbq',7,0,false,0,0);`);
    const sql = readFileSync(new URL('../../drizzle/migrations/0057_source_normal_gifts.sql', import.meta.url), 'utf8');
    await db.exec(sql);
    await db.exec(sql);
    const { rows } = await db.query<{ gift_type: string; price: number; vip_only: boolean; kisses_required: number; kisses: number; hearts: number }>('SELECT * FROM gift_prices');
    expect(rows).toHaveLength(SOURCE_NORMAL_ENTRIES.length);
    for (const row of rows) {
      expect(row.price).toBe(row.gift_type === 'bbq' ? 7 : SOURCE_NORMAL_GIFTS[row.gift_type]?.storePrice);
      expect([row.vip_only, row.kisses_required, row.kisses, row.hearts]).toEqual([false,0,0,0]);
    }
  } finally { await db.close(); }
}, 30000);