import { describe, expect, it } from 'vitest';
import { activityText, extraScoreText, levelFromPoints } from '@/lib/top-level-activity';

describe('Telegram level ranking', () => {
  it('1400 hearts spent on gifts make one level', () => {
    expect(levelFromPoints(1399)).toBe(0);
    expect(levelFromPoints(1400)).toBe(1);
    expect(levelFromPoints(2800)).toBe(2);
  });
  it('level stops at 100', () => {
    expect(levelFromPoints(1400 * 250)).toBe(100);
  });
  it('all-time list shows Lv, period lists show points', () => {
    expect(extraScoreText('glv', 1400 * 97, '')).toBe('Lv 97');
    expect(extraScoreText('glv', 500, 'daily')).toBe('500');
    expect(extraScoreText('glv', 0, '')).toBe('0');
  });
});

describe('Telegram hours ranking', () => {
  it('formats minutes like the original', () => {
    expect(activityText(23)).toBe('23 dəq');
    expect(activityText(177 * 60 + 20)).toBe('177 saat 20 dəq');
    expect(activityText(120)).toBe('2 saat');
  });
});
