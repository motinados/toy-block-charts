import { Datum } from "./stacked-block-chart";
import {
  calcHeight,
  getOrderdRandomInt,
  getRandomColor,
  getRandomInt,
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
export function createInitialBlockDatum(datum: Datum): BlockDatum {
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
  multiple: number
): BlockDatum[] {
  const widths = getOrderdRandomInt(10, 100, data.length);
  return data.map((datum, index) => ({
    ...datum,
    width: widths[index],
    height: calcHeight(datum.percentage * multiple, widths[index]),
  }));
}

/** Calculate x, y of BlockDatum */
export function calcBlocksPosition(
  blocks: BlockDatum[],
  svgCenterX: number
): BlockDatum[] {
  const resultBlocks: BlockDatum[] = [];
  let prevY = 0;
  for (const block of blocks) {
    const newBlock = { ...block };

    newBlock.y = prevY;
    prevY += block.height;

    const fluctuation = getRandomInt(-10, 10);
    newBlock.x = svgCenterX - block.width / 2 + fluctuation;

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
