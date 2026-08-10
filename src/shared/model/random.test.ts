import { createSeededRandomInt, shuffleArray } from "./random";
import { describe, it, expect } from "vitest";

describe("createSeededRandomInt", () => {
  it("should stay within the given bounds", () => {
    const rndFn = createSeededRandomInt(42);

    for (let i = 0; i < 100; i++) {
      const result = rndFn(10, 20);
      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThanOrEqual(20);
    }
  });

  it("should produce the same sequence for the same seed", () => {
    const first = createSeededRandomInt(42);
    const second = createSeededRandomInt(42);

    const firstRun = Array.from({ length: 20 }, () => first(0, 1000));
    const secondRun = Array.from({ length: 20 }, () => second(0, 1000));

    expect(secondRun).toEqual(firstRun);
  });

  it("should produce a different sequence for a different seed", () => {
    const first = createSeededRandomInt(42);
    const second = createSeededRandomInt(43);

    const firstRun = Array.from({ length: 20 }, () => first(0, 1000));
    const secondRun = Array.from({ length: 20 }, () => second(0, 1000));

    expect(secondRun).not.toEqual(firstRun);
  });
});

describe("shuffleArray", () => {
  it("should return the array as it is if the array has only one element", () => {
    const arr = [1];

    const result = shuffleArray(arr, createSeededRandomInt(42));

    expect(result).toEqual(arr);
  });

  it("should return the array as it is if all elements are the same", () => {
    const arr = [1, 1, 1, 1];

    const result = shuffleArray(arr, createSeededRandomInt(42));

    expect(result).toEqual(arr);
  });

  it("should return a shuffled array", () => {
    const arr = [1, 2, 3, 4, 5];

    const result = shuffleArray(arr, createSeededRandomInt(42));

    expect(result).not.toEqual(arr);
    expect(result).toHaveLength(arr.length);
    expect(result).toEqual(expect.arrayContaining(arr));
  });
});
