import { describe, expect, it } from 'vitest';
import { usernameEmail, usernameSchema } from '@/lib/account-identity';

describe('email-free account identity', () => {
  it('normalizes a username to one deterministic internal address', () => {
    expect(usernameEmail('Player_25')).toBe('player_25@players.sise.local');
  });
  it('rejects unsupported and unsafe usernames', () => {
    for (const name of ['a', 'player@example.com', 'a b c', '<script>', 'x'.repeat(31)]) {
      expect(usernameSchema.safeParse(name).success).toBe(false);
    }
    expect(usernameSchema.safeParse('player_25').success).toBe(true);
  });
});