import { describe, beforeEach, it, expect, vi } from "vitest";
import {
  BlockDatum,
  calcYPositions,
  calcPercentage,
  createInitialBlockDatum,
  calcXPositions,
  alignToBottom,
  modifyOrderByType,
  adjustTotalHeight,
  adjustSameValueBlocks,
  addXFluctuation,
  filterDrawableData,
} from "./compute-blocks";
import type { StackedBlockDatum } from "./types";
import { palette } from "../../shared/model/palette";
import { createSeededRandomInt } from "../../shared/model/random";

describe("createInitialBlockDatum", () => {
  const mockRndFn = vi.fn();

  // A function to check if there is an overlap in the x-axis position of two blocks
  const isOverlap = (upper: BlockDatum, lower: BlockDatum) => {
    const upperStart = upper.x;
    const upperEnd = upper.x + upper.width;
    const lowerStart = lower.x;
    const lowerEnd = lower.x + lower.width;
    return upperStart < lowerEnd && lowerStart < upperEnd;
  };

  beforeEach(() => {
    mockRndFn.mockClear();
  });

  it("should create an initial block datum with default values", () => {
    const datum: StackedBlockDatum = {
      value: 10,
      name: "A",
      fill: "#000",
    };

    const result = createInitialBlockDatum(datum, 0);

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

  it("should take the palette colour for its index if it has no fill", () => {
    const block: StackedBlockDatum = {
      value: 10,
      name: "A",
      fill: "",
    };

    const result = createInitialBlockDatum(block, 0);

    expect(result).toEqual({
      value: 10,
      name: "A",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill: palette[0],
      percentage: 0,
    });
  });

  it("should not modify blockDatum if it already has a fill", () => {
    const block: StackedBlockDatum = {
      value: 10,
      name: "A",
      fill: "#000",
    };

    const result = createInitialBlockDatum(block, 0);
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

  it("should calculate the Y position of blocks correctly", () => {
    const blocks: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 0,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 0,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 0,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
    ];

    const result = calcYPositions(blocks);

    expect(result).toEqual([
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 0,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 10,
        width: 0,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 30,
        width: 0,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
    ]);
  });

  it("should calculate the X position of blocks correctly", () => {
    const blocks: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
    ];

    const svgCenterX = 50;
    const result = calcXPositions(blocks, svgCenterX);

    expect(result).toEqual([
      {
        value: 10,
        name: "A",
        x: 45,
        y: 0,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 40,
        y: 0,
        width: 20,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 35,
        y: 0,
        width: 30,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
    ]);
  });

  it("should add a random value to the X coordinate of the block 1", () => {
    // centerX is 0.

    // the upper block is on the left side of the lower block.
    const blocks: BlockDatum[] = [
      {
        value: 0,
        name: "upper",
        x: -20,
        y: 0,
        width: 20,
        height: 0,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 0,
        name: "lower",
        x: 0,
        y: 10,
        width: 20,
        height: 0,
        fill: "#000",
        percentage: 0,
      },
    ];

    mockRndFn.mockReturnValueOnce(0).mockReturnValueOnce(0);

    const result = addXFluctuation(blocks, mockRndFn);
    const blockA = result[0];
    const blockB = result[1];

    expect(isOverlap(blockA, blockB)).toBe(true);
  });

  it("should add a random value to the X coordinate of the block 2", () => {
    // centerX is 0

    // the upper block is on the right side of the lower block.
    const blocks: BlockDatum[] = [
      {
        value: 0,
        name: "upper",
        x: 0,
        y: 0,
        width: 20,
        height: 0,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 0,
        name: "lower",
        x: -20,
        y: 10,
        width: 20,
        height: 0,
        fill: "#000",
        percentage: 0,
      },
    ];

    mockRndFn.mockReturnValueOnce(0).mockReturnValueOnce(0);

    const result = addXFluctuation(blocks, mockRndFn);
    const blockA = result[0];
    const blockB = result[1];

    expect(isOverlap(blockA, blockB)).toBe(true);
  });

  it("should align blocks to the bottom of the svg", () => {
    const blocks: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
    ];

    const svgHeight = 100;
    const result = alignToBottom(calcYPositions(blocks), svgHeight);

    expect(result).toEqual([
      {
        value: 10,
        name: "A",
        x: 0,
        y: 40,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 50,
        width: 20,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 70,
        width: 30,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
    ]);
  });

  it("should return the blocks in reverse order if type is 'unstable-inverted'", () => {
    const blocks: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
    ];

    const result = modifyOrderByType(blocks, "unstable-inverted", createSeededRandomInt(42));

    expect(result).toEqual([
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
    ]);
  });

  it("should return the blocks in shuffled order if type is 'shuffled'", () => {
    const blocks: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
    ];

    const result = modifyOrderByType(blocks, "shuffled", createSeededRandomInt(42));

    expect(result).toEqual(expect.arrayContaining(blocks));
  });

  it("should return the blocks as is if type is not 'unstable-inverted' or 'shuffled'", () => {
    const blocks: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "",
        percentage: 0,
      },
    ];

    const result = modifyOrderByType(blocks, "stable-balanced", createSeededRandomInt(42));

    expect(result).toEqual(blocks);
  });

  it("should return the original data if total height is less than or equal to maxHeight", () => {
    const data: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
    ];
    const maxHeight = 100;

    const result = adjustTotalHeight(data, maxHeight);

    expect(result).toEqual(data);
  });

  it("should scale every block so that the total height fits within maxHeight", () => {
    const data: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 10,
        height: 50,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 20,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 30,
        height: 40,
        fill: "#000",
        percentage: 0,
      },
    ];
    const maxHeight = 100;

    const result = adjustTotalHeight(data, maxHeight);

    // total height is 120, so every block shrinks by 100 / 120
    const scale = 100 / 120;
    result.forEach((block, index) => {
      expect(block.width).toBeCloseTo(data[index].width * scale);
      expect(block.height).toBeCloseTo(data[index].height * scale);
    });

    const totalHeight = result.reduce((acc, d) => acc + d.height, 0);
    expect(totalHeight).toBeCloseTo(maxHeight);
  });

  it("should keep every block positive even when the excess exceeds the height of the last block", () => {
    const data: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 20,
        height: 100,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 20,
        height: 100,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 50,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
    ];
    // the excess (210 - 50 = 160) is far larger than the last block's height
    const maxHeight = 50;

    const result = adjustTotalHeight(data, maxHeight);

    result.forEach((block) => {
      expect(block.width).toBeGreaterThan(0);
      expect(block.height).toBeGreaterThan(0);
      expect(Number.isFinite(block.width)).toBe(true);
      expect(Number.isFinite(block.height)).toBe(true);
    });

    const totalHeight = result.reduce((acc, d) => acc + d.height, 0);
    expect(totalHeight).toBeCloseTo(maxHeight);
  });

  it("should keep blocks with the same shape identical after the adjustment", () => {
    const data: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 30,
        height: 60,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 10,
        name: "B",
        x: 0,
        y: 0,
        width: 30,
        height: 60,
        fill: "#000",
        percentage: 0,
      },
    ];
    const maxHeight = 100;

    const result = adjustTotalHeight(data, maxHeight);

    expect(result[0].width).toBeCloseTo(result[1].width);
    expect(result[0].height).toBeCloseTo(result[1].height);
  });
});
describe("adjustSameValueBlocks", () => {
  it("should return the same data if there are no blocks with the same value", () => {
    const data: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 20,
        name: "B",
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 30,
        name: "C",
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
    ];

    const result = adjustSameValueBlocks(data);

    expect(result).toEqual(data);
  });

  it("should adjust the width and height of blocks with the same value to match the block with lowest height", () => {
    const data: BlockDatum[] = [
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 10,
        name: "B",
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 10,
        name: "C",
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        fill: "#000",
        percentage: 0,
      },
    ];

    const result = adjustSameValueBlocks(data);

    expect(result).toEqual([
      {
        value: 10,
        name: "A",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 10,
        name: "B",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
      {
        value: 10,
        name: "C",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: "#000",
        percentage: 0,
      },
    ]);
  });
});

describe("filterDrawableData", () => {
  it("should keep data whose values are finite and not negative", () => {
    const data: StackedBlockDatum[] = [
      { value: 10, name: "A" },
      { value: 0, name: "B" },
      { value: 20.5, name: "C" },
    ];

    expect(filterDrawableData(data)).toEqual(data);
  });

  it("should remove data with a negative value", () => {
    const data: StackedBlockDatum[] = [
      { value: -10, name: "A" },
      { value: 20, name: "B" },
    ];

    expect(filterDrawableData(data)).toEqual([{ value: 20, name: "B" }]);
  });

  it("should remove data whose value is not a finite number", () => {
    const data: StackedBlockDatum[] = [
      { value: Number.NaN, name: "A" },
      { value: Number.POSITIVE_INFINITY, name: "B" },
      { value: Number.NEGATIVE_INFINITY, name: "C" },
      { value: 20, name: "D" },
    ];

    expect(filterDrawableData(data)).toEqual([{ value: 20, name: "D" }]);
  });

  it("should return an empty array for an empty array", () => {
    expect(filterDrawableData([])).toEqual([]);
  });

  it("should not modify the given array", () => {
    const data: StackedBlockDatum[] = [
      { value: -10, name: "A" },
      { value: 20, name: "B" },
    ];

    filterDrawableData(data);

    expect(data).toHaveLength(2);
  });
});
