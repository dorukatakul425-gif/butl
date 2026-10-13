import type { SourceReward } from './source-feature-session';

// Visible sector labels transcribed from the supplied original screenshots.
// They drive the isolated visual test only and are not an account payout catalogue.
export const sourceRouletteReferenceArtwork: SourceReward[] = [
  ['chances', 3], ['tokens', 100], ['kiss_fire', 3], ['gold', 10],
  ['tokens', 5], ['league5', 1], ['gold', 3], ['chances', 1],
  ['tokens', 1000], ['kiss_fire', 3], ['gold', 25], ['tokens', 3],
  ['league_kiss2x', 1], ['gold', 5], ['tokens', 25], ['refuse_slap', 1],
].map(([image, count], index) => ({ id: `reference-${index}`, image: String(image), count: Number(count) }));