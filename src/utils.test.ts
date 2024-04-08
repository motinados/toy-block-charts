import { getRandomInt, shuffleArray } from "./utils";

describe("utils", () => {
  it("getRandomInt", () => {
    const result = getRandomInt(10, 20);
    expect(result).toBeGreaterThanOrEqual(10);
    expect(result).toBeLessThanOrEqual(20);
  });

  it("shuffleArray", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result).not.toEqual(arr);
    expect(result).toHaveLength(arr.length);
    expect(result).toEqual(expect.arrayContaining(arr));
  });
});
