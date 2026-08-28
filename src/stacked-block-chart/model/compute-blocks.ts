import type { BlockDatum, StackedBlockDatum, StackType } from "./types";
import { calcHeight } from "../../shared/model/geometry";
import { paletteColorAt } from "../../shared/model/palette";
import { getOrderdRandomInt, shuffleArray } from "../../shared/model/random";

/**
 * Keep only the data that can be drawn as an area.
 * Blocks are sized by area, so a value that is not a finite number has no size
 * to derive, and a negative value has no area to represent. Zero is kept: it
 * has a well defined area of nothing, and the name still belongs in the legend.
 */
export function filterDrawableData(
  data: StackedBlockDatum[]
): StackedBlockDatum[] {
  return data.filter(
    (datum) => Number.isFinite(datum.value) && datum.value >= 0
  );
}

/**
 * Create initial BlockDatum.
 * Data without a fill of its own takes the palette colour for its position in
 * the caller's array, so a colour stays with its entry however the blocks are
 * later reordered. Omitting `palette` leaves the choice of default to
 * paletteColorAt.
 */
export function createInitialBlockDatum(
  datum: StackedBlockDatum,
  index: number,
  palette?: readonly string[]
): BlockDatum {
  return {
    value: datum.value,
    name: datum.name,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fill: datum.fill || paletteColorAt(index, palette),
    percentage: 0,
  };
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
  rndFn: (min: number, max: number) => number,
  opt?: { multiple: number }
): BlockDatum[] {
  const widths = getOrderdRandomInt(10, 100, data.length, rndFn);
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
 *  If the total height exceeds the maximum height, shrink every block by the same
 *  scale factor so that the stack fits.
 *  Scaling both dimensions keeps the area ratio between blocks intact, so the
 *  "area represents the value" encoding still holds after the adjustment.
 */
export function adjustTotalHeight(
  data: BlockDatum[],
  maxHeight: number
): BlockDatum[] {
  const totalHeight = data.reduce((acc, d) => acc + d.height, 0);
  if (totalHeight <= maxHeight) {
    return data;
  }

  const scale = maxHeight / totalHeight;

  return data.map((datum) => ({
    ...datum,
    width: datum.width * scale,
    height: datum.height * scale,
  }));
}

export function modifyOrderByType(
  blocks: BlockDatum[],
  type: StackType,
  rndFn: (min: number, max: number) => number
): BlockDatum[] {
  if (type === "unstable-inverted") {
    return blocks.reverse();
  } else if (type === "shuffled") {
    return shuffleArray(blocks, rndFn);
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
 * Add a random value to the X coordinate of the block.
 * Note: The blocks are assumed to be arranged from top to bottom.
 */
export function addXFluctuation(
  blocks: BlockDatum[],
  rndFn: (min: number, max: number) => number
): BlockDatum[] {
  const minFluctuation = -10;
  const maxFluctuation = 10;
  const overlap = 1;

  // process blocks from bottom to top
  return blocks.reduceRight<BlockDatum[]>((acc, block) => {
    const newBlock = { ...block };

    const fluctuation = rndFn(minFluctuation, maxFluctuation);
    newBlock.x += fluctuation;

    // Adjust the position so that the blocks overlap
    if (acc.length > 0) {
      const lowerBlock = acc[0];
      const lowerStartX = lowerBlock.x;
      const lowerEndX = lowerBlock.x + lowerBlock.width;
      const upperStartX = newBlock.x;
      const upperEndX = newBlock.x + newBlock.width;

      if (upperEndX <= lowerStartX) {
        // Upper block is to the left of the lower block
        const adjustment = lowerStartX - upperEndX + overlap;
        newBlock.x += adjustment;
      } else if (upperStartX >= lowerEndX) {
        // Upper block is to the right of the lower block
        const adjustment = upperStartX - lowerEndX + overlap;
        newBlock.x -= adjustment;
      }
    }

    acc.unshift(newBlock);
    return acc;
  }, []);
}

//Align blocks to the bottom of the svg based on svgHeight
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
