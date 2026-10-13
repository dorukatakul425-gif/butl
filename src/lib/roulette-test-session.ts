import { sourceRouletteReferenceArtwork } from './source-roulette-artwork';
import type { SourceFeatureResult, SourceReward } from './source-feature-session';

export const ROULETTE_TEST_CHANCES = 2000;

let rewardSequence = 0;

function secureIndex(length: number) {
  if (length < 1) return 0;
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return (values[0] ?? 0) % length;
}

/** Presentation-only roulette result. It never writes a wallet, inventory or account balance. */
export function createRouletteTestResult(): SourceFeatureResult {
  const rewardIndex = secureIndex(sourceRouletteReferenceArtwork.length);
  const source = sourceRouletteReferenceArtwork[rewardIndex];
  if (!source) return { confirmed: false };
  const reward: SourceReward = { ...source, id: `roulette-test-${++rewardSequence}` };
  return { confirmed: true, rewardIndex, rewards: [reward], testOnly: true };
}