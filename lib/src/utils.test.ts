import {
  calcPercentages,
  calcPercentagesForData,
  getRandomInt,
  shuffleArray,
} from "./utils";

describe("utils", () => {
  it("calcPercentages", () => {
    const array = [10, 20, 30, 40, 50];
    const total = array.reduce((acc, cur) => acc + cur, 0);
    const result = calcPercentages(array);
    expect(result).toHaveLength(array.length);
    expect(result).toEqual([
      (10 / total) * 100,
      (20 / total) * 100,
      (30 / total) * 100,
      (40 / total) * 100,
      (50 / total) * 100,
    ]);
  });

  it("calcPercentagesForData", () => {
    const data = [
      { value: 10, name: "A" },
      { value: 20, name: "B" },
      { value: 30, name: "C" },
      { value: 40, name: "D" },
      { value: 50, name: "E" },
    ];
    const result = calcPercentagesForData(data);
    expect(result).toHaveLength(data.length);
    expect(result).toEqual([
      { value: 10, name: "A", percentage: (10 / 150) * 100 },
      { value: 20, name: "B", percentage: (20 / 150) * 100 },
      { value: 30, name: "C", percentage: (30 / 150) * 100 },
      { value: 40, name: "D", percentage: (40 / 150) * 100 },
      { value: 50, name: "E", percentage: (50 / 150) * 100 },
    ]);
  });

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
