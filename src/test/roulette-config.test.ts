import { describe, expect, it } from 'vitest';
import { rouletteConfigSchema } from '@/lib/roulette-config';
const config = (percentages: number[]) => ({ enabled:true,spinCost:1,dailyChances:0,bundleChances:10,bundleDat:10,revision:0,prizes:percentages.map((percentage,id)=>({id,percentage})) });
describe('wheel admin probabilities', () => {
  it('accepts exactly one 100% reward and fifteen 0% rewards', () => { expect(rouletteConfigSchema.safeParse(config([100,...Array(15).fill(0)])).success).toBe(true); });
  it('rejects totals below 100%', () => { expect(rouletteConfigSchema.safeParse(config([99,...Array(15).fill(0)])).success).toBe(false); });
  it('rejects totals above 100%', () => { expect(rouletteConfigSchema.safeParse(config([100,1,...Array(14).fill(0)])).success).toBe(false); });
  it('retains 6.25% as an exact percentage rather than a relative weight', () => { expect(rouletteConfigSchema.parse(config(Array(16).fill(6.25))).prizes[0]?.percentage).toBe(6.25); });
  it('rejects duplicated sectors', () => { const v=config(Array(16).fill(6.25));v.prizes[1]={id:0,percentage:6.25};expect(rouletteConfigSchema.safeParse(v).success).toBe(false); });
});