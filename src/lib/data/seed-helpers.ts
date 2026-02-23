/**
 * Simple string hash (djb2)
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Mulberry32 PRNG - deterministic random number generator
 */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Create a seeded random for a specific fund ticker
 */
export function createFundRandom(ticker: string): () => number {
  return mulberry32(hashString(ticker));
}

/**
 * Generate a random number in range using seeded PRNG
 */
export function randomInRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

/**
 * Generate a normally-distributed random number using Box-Muller
 */
export function randomNormal(rng: () => number, mean: number = 0, stdDev: number = 1): number {
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z;
}
