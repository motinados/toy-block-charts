import { unsafeUniformIntDistribution, xoroshiro128plus } from "pure-rand";

/** Returns a random integer between min and max, both inclusive. */
export type RandomIntFn = (min: number, max: number) => number;

/**
 * Build a seeded random integer source.
 *
 * This is deliberately a plain factory rather than a hook. The generator is
 * stateful, so a layout has to start from a fresh one every time it is
 * recomputed; a hook that memoized the generator would carry its position
 * across recomputations and the same seed would stop producing the same chart.
 */
export function createSeededRandomInt(seed: number): RandomIntFn {
  const generator = xoroshiro128plus(seed);
  return (min, max) => unsafeUniformIntDistribution(min, max, generator);
}

// Generate multiple random numbers and return an array of them sorted in ascending order
export function getOrderdRandomInt(
  min: number,
  max: number,
  size: number,
  rndFn: RandomIntFn
) {
  const numbers = Array.from({ length: size }, () => rndFn(min, max));
  return numbers.sort((a, b) => a - b);
}

// Receives an array and returns a shuffled array
export function shuffleArray<T>(array: T[], rndFn: RandomIntFn): T[] {
  if (array.length <= 1) {
    return array;
  }

  const allEqual = array.every((e) => e === array[0]);
  if (allEqual) {
    return array;
  }

  let shffledArray = [];
  let attempts = 0;
  const maxAttempts = 100;

  do {
    shffledArray = [...array];

    for (let i = shffledArray.length - 1; i > 0; i--) {
      const j = rndFn(0, i);
      const temp = shffledArray[i];
      shffledArray[i] = shffledArray[j];
      shffledArray[j] = temp;
    }

    attempts++;
  } while (
    shffledArray.every((e, i) => e === array[i]) &&
    attempts < maxAttempts
  );

  return shffledArray;
}
