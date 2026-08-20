import { useMemo } from "react";
import {
  SVG_HEIGHT,
  SVG_WIDTH,
  LEGEND_WIDTH,
} from "../../shared/model/geometry";
import { createSeededRandomInt } from "../../shared/model/random";
import {
  addXFluctuation,
  adjustSameValueBlocks,
  adjustTotalHeight,
  alignToBottom,
  calcPercentage,
  calcWidthsAndHeights,
  calcXPositions,
  calcYPositions,
  createInitialBlockDatum,
  filterDrawableData,
  modifyOrderByType,
} from "./compute-blocks";
import type {
  BlockDatum,
  LegendItem,
  StackedBlockDatum,
  StackType,
} from "./types";

/** How far left of the legend column the stack sits. */
const BLOCKS_OFFSET_X = 40;

type UseComputedBlocksResult = {
  blocks: BlockDatum[];
  legendItems: LegendItem[];
};

export function useComputedBlocks(
  data: StackedBlockDatum[],
  stackType: StackType,
  seed: number,
  palette?: readonly string[]
): UseComputedBlocksResult {
  return useMemo(() => {
    // Built fresh on every recomputation so that a seed always yields the same
    // chart; see createSeededRandomInt.
    const getRandomInt = createSeededRandomInt(seed);

    const initialBlocks = filterDrawableData(data).map((datum, index) =>
      createInitialBlockDatum(datum, index, palette)
    );
    const total = initialBlocks.reduce((acc, d) => acc + d.value, 0);

    // Every size in the pipeline is derived from a share of the total, so
    // without a positive total there is nothing to lay out.
    if (total <= 0) {
      return { blocks: [], legendItems: [] };
    }

    const svgCenterX = (SVG_WIDTH - LEGEND_WIDTH) / 2 - BLOCKS_OFFSET_X;

    const ops: ((b: BlockDatum[]) => BlockDatum[])[] = [
      (b) => b.map((datum) => calcPercentage(datum, total)),
      (b) => b.sort((a, b) => a.percentage - b.percentage),
      (b) => calcWidthsAndHeights(b, getRandomInt, { multiple: 100 }),
      (b) => adjustSameValueBlocks(b),
      (b) => adjustTotalHeight(b, SVG_HEIGHT),
      (b) => modifyOrderByType(b, stackType, getRandomInt),
      (b) => calcYPositions(b),
      (b) => calcXPositions(b, svgCenterX),
      (b) => addXFluctuation(b, getRandomInt),
      (b) => alignToBottom(b, SVG_HEIGHT),
    ];

    const computed = ops.reduce((acc, op) => op(acc), initialBlocks);
    return {
      blocks: computed,
      legendItems: computed.map((d) => ({ name: d.name, color: d.fill })),
    };
  }, [data, stackType, seed, palette]);
}
