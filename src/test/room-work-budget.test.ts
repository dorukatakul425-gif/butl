import { expect, it } from 'vitest';
import { presentationBudget, singleFlight } from '../lib/room-work-budget';

it('slow heartbeat cycles do not stack during a gift burst', async () => {
  const pulse = singleFlight();
  let complete: (() => void) | undefined;
  let calls = 0;
  const work = () => { calls++; return new Promise<void>(resolve => { complete = resolve; }); };
  const first = pulse(work);
  for (let i = 0; i < 100; i++) expect(pulse(work)).toBe(first);
  await Promise.resolve();
  expect(calls).toBe(1);
  complete?.(); await first;
  await pulse(async () => { calls++; });
  expect(calls).toBe(2);
});

it('gift burst holds at most 24 visual flights and releases capacity', () => {
  const budget = presentationBudget(24);
  const releases = Array.from({ length: 24 }, () => budget.acquire());
  expect(releases.every(Boolean)).toBe(true);
  for (let i = 0; i < 1000; i++) expect(budget.acquire()).toBeNull();
  releases[0]?.();
  expect(budget.acquire()).not.toBeNull();
  budget.clear();
  expect(budget.acquire()).not.toBeNull();
});