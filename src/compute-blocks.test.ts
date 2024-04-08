import {
  BlockDatum,
  calcPercentage,
  createInitialBlockDatum,
  ensureBlockHasColor,
} from "./compute-blocks";

describe("createInitialBlockDatum", () => {
  it("should create an initial block datum with default values", () => {
    const datum = {
      value: 10,
      name: "A",
      color: "#000",
    };

    const result = createInitialBlockDatum(datum);

    expect(result).toEqual({
      value: 10,
      name: "A",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill: "#000",
      percentage: 0,
    });
  });

  it("should create an initial block datum with empty fill if color is not provided", () => {
    const datum = {
      value: 20,
      name: "B",
    };

    const result = createInitialBlockDatum(datum);

    expect(result).toEqual({
      value: 20,
      name: "B",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill: "",
      percentage: 0,
    });
  });

  it("should add a random color if blockDatum does not have a fill", () => {
    const block: BlockDatum = {
      value: 10,
      name: "A",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill: "",
      percentage: 0,
    };

    const result = ensureBlockHasColor(block);

    expect(result).toHaveProperty("fill");
    expect(result.fill).not.toBe("");
  });

  it("should not modify blockDatum if it already has a fill", () => {
    const block: BlockDatum = {
      value: 10,
      name: "A",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill: "#000",
      percentage: 0,
    };

    const result = ensureBlockHasColor(block);
    expect(result).toEqual(block);
  });

  it("should calculate the percentage correctly", () => {
    const blockDatum: BlockDatum = {
      value: 10,
      name: "A",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill: "",
      percentage: 0,
    };
    const total = 100;

    const result = calcPercentage(blockDatum, total);
    expect(result.percentage).toBe(10);
  });
});
