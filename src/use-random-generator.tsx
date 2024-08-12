import { useMemo } from "react";
import { unsafeUniformIntDistribution, xoroshiro128plus } from "pure-rand";

export function useRandomGenerator(seed: number) {
  const rndFn = useMemo(() => {
    const generator = xoroshiro128plus(seed);
    const getRandomInt = (min: number, max: number) => {
      return unsafeUniformIntDistribution(min, max, generator);
    };
    return getRandomInt;
  }, [seed]);

  return { getRandomInt: rndFn };
}
