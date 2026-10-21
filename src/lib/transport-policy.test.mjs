import test from 'node:test';
import assert from 'node:assert/strict';
import { externalAvailable, externalCooldown } from './transport-policy.mjs';
test('external failure uses VPS for the entire cooldown, then permits retry', () => {
  const until = externalCooldown(1000);
  assert.equal(externalAvailable(60999, until), false);
  assert.equal(externalAvailable(61000, until), true);
});