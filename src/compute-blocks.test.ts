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
  defaultColor,
  addXFluctuation,
} from "./compute-blocks";
import { StackedBlockDatum } from "./stacked-block-chart";
import { getRandomInt } from "./utils";

describe("createInitialBlockDatum", () => {
  const mockRndFn = jest.fn();

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

  it("should add a random color if blockDatum does not have a fill", () => {
    const block: StackedBlockDatum = {
      value: 10,
      name: "A",
      fill: "",
    };

    const result = createInitialBlockDatum(block);

    expect(result).toEqual({
      value: 10,
      name: "A",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill: defaultColor,
      percentage: 0,
    });
  });

  it("should not modify blockDatum if it already has a fill", () => {
    const block: StackedBlockDatum = {
      value: 10,
      name: "A",
      fill: "#000",
    };

    const result = createInitialBlockDatum(block);
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

    const result = modifyOrderByType(blocks, "unstable-inverted", getRandomInt);

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

    const result = modifyOrderByType(blocks, "shuffled", getRandomInt);

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

    const result = modifyOrderByType(blocks, "stable-balanced", getRandomInt);

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

  it("should adjust the height of the last block to fit within maxHeight", () => {
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

    expect(result).toEqual([
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
        width: 60,
        height: 20,
        fill: "#000",
        percentage: 0,
      },
    ]);
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
