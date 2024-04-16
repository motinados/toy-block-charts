import {
  BlockDatum,
  calcYPositions,
  calcPercentage,
  createInitialBlockDatum,
  ensureBlockHasColor,
  calcXPositions,
  alignToBottom,
  modifyOrderByType,
  adjustTotalHeight,
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

    const result = modifyOrderByType("unstable-inverted", blocks);

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

    const result = modifyOrderByType("shuffled", blocks);

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

    const result = modifyOrderByType("stable-balanced", blocks);

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
