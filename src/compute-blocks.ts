import { StackedBlockDatum, StackType } from "./stacked-block-chart";
import {
  calcHeight,
  getOrderdRandomInt,
  getRandomColor,
  getRandomInt,
  shuffleArray,
} from "./utils";

export type BlockDatum = {
  value: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  percentage: number;
};

/** Create initial BlockDatum */
export function createInitialBlockDatum(datum: StackedBlockDatum): BlockDatum {
  return {
    value: datum.value,
    name: datum.name,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fill: datum.color || "",
    percentage: 0,
  };
}

/** Ensure BlockDatum has color */
export function ensureBlockHasColor(blockDatum: BlockDatum): BlockDatum {
  if (!blockDatum.fill) {
    return { ...blockDatum, fill: getRandomColor() };
  }
  return { ...blockDatum };
}

/** Calculate the percentage of BlockDatum */
export function calcPercentage(
  blockDatum: BlockDatum,
  total: number
): BlockDatum {
  return { ...blockDatum, percentage: (blockDatum.value / total) * 100 };
}

/** Calculate the width and height of BlockDatum */
export function calcWidthsAndHeights(
  data: BlockDatum[],
  opt?: { multiple: number }
): BlockDatum[] {
  const widths = getOrderdRandomInt(10, 100, data.length);
  const multiple = opt?.multiple || 1;
  return data.map((datum, index) => ({
    ...datum,
    width: widths[index],
    height: calcHeight(datum.percentage * multiple, widths[index]),
  }));
}

/**
 * If there are blocks with the same value, make all blocks the same height and width.
 * The block to refer to at that time is the block with the lowest height.
 */
export function adjustSameValueBlocks(data: BlockDatum[]): BlockDatum[] {
  const valueMap = data.reduce(
    (acc, d) => {
      if (!acc[d.value]) {
        acc[d.value] = [];
      }
      acc[d.value].push(d);
      return acc;
    },
    {} as { [key: number]: BlockDatum[] }
  );

  const results = data.map((d) => {
    const blocks = valueMap[d.value];
    if (blocks.length === 1) {
      return d;
    }

    const minHeightBlock = blocks.reduce((acc, b) =>
      acc.height < b.height ? acc : b
    );

    return {
      ...d,
      width: minHeightBlock.width,
      height: minHeightBlock.height,
    };
  });

  return results;
}

/**
 *  If the total height exceeds the maximum height, adjust the height.
 *  If the height needs to be adjusted, expand the width of the last block and adjust the height.
 *  Note: Adjust only the last block
 */
export function adjustTotalHeight(
  data: BlockDatum[],
  maxHeight: number
): BlockDatum[] {
  const totalHeight = data.reduce((acc, d) => acc + d.height, 0);
  if (totalHeight <= maxHeight) {
    return data;
  }

  const diff = totalHeight - maxHeight;
  const lastBlock = data[data.length - 1];
  const newHeight = lastBlock.height - diff;
  const newWidth = calcAdjustedWidthKeepingArea(
    lastBlock.width,
    lastBlock.height,
    newHeight
  );

  const results = [...data];
  results[results.length - 1] = {
    ...lastBlock,
    width: newWidth,
    height: newHeight,
  };

  return results;
}

/**
 * Calculate the width to change the height while keeping the area
 */
function calcAdjustedWidthKeepingArea(
  currentWidth: number,
  currentHeight: number,
  targetHeight: number
) {
  const area = currentWidth * currentHeight;
  const newWidth = area / targetHeight;
  return newWidth;
}

export function modifyOrderByType(
  blocks: BlockDatum[],
  type: StackType
): BlockDatum[] {
  if (type === "unstable-inverted") {
    return blocks.reverse();
  } else if (type === "shuffled") {
    return shuffleArray(blocks);
  }
  return blocks;
}

/**
 * Set Y to stack blocks
 */
export function calcYPositions(blocks: BlockDatum[]): BlockDatum[] {
  const resultBlocks: BlockDatum[] = [];
  let prevY = 0;
  for (const block of blocks) {
    const newBlock = { ...block };

    newBlock.y = prevY;
    prevY += block.height;

    resultBlocks.push(newBlock);
  }
  return resultBlocks;
}

/**
 * Set X so that svgCenterX is the center of each block
 */
export function calcXPositions(
  blocks: BlockDatum[],
  svgCenterX: number
): BlockDatum[] {
  const resultBlocks: BlockDatum[] = [];
  for (const block of blocks) {
    const newBlock = { ...block };

    newBlock.x = svgCenterX - block.width / 2;

    resultBlocks.push(newBlock);
  }
  return resultBlocks;
}

/**
 * Add a random value to the X coordinate of the block
 */
export function addXFluctuation(blocks: BlockDatum[]): BlockDatum[] {
  const resultBlocks: BlockDatum[] = [];
  for (const block of blocks) {
    const newBlock = { ...block };

    const fluctuation = getRandomInt(-10, 10);
    newBlock.x += fluctuation;

    resultBlocks.push(newBlock);
  }
  return resultBlocks;
}

//Align BlockItem to the bottom of the svg based on svgHeight
export function alignToBottom(
  blocks: BlockDatum[],
  svgHeight: number
): BlockDatum[] {
  const resultBlocks: BlockDatum[] = [];
  const blocksHeight = blocks.reduce((acc, block) => acc + block.height, 0);
  const diff = svgHeight - blocksHeight;

  for (const block of blocks) {
    const newBlock = { ...block };
    newBlock.y += diff;
    resultBlocks.push(newBlock);
  }

  return resultBlocks;
}
