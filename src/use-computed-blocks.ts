import { useMemo } from "react";
import { unsafeUniformIntDistribution, xoroshiro128plus } from "pure-rand";
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
  modifyOrderByType,
} from "./compute-blocks";
import type {
  BlockDatum,
  LegendItem,
  StackedBlockDatum,
  StackType,
} from "./types/chart";

const SVG_WIDTH = 400;
const SVG_HEIGHT = 300;
const BLOCKS_OFFSET_X = 40;
const LEGEND_WIDTH = 100;

type UseComputedBlocksResult = {
  blocks: BlockDatum[];
  legendItems: LegendItem[];
};

export function useComputedBlocks(
  data: StackedBlockDatum[],
  stackType: StackType,
  seed: number
): UseComputedBlocksResult {
  return useMemo(() => {
    const generator = xoroshiro128plus(seed);
    const getRandomInt = (min: number, max: number) =>
      unsafeUniformIntDistribution(min, max, generator);

    const initialBlocks = data.map(createInitialBlockDatum);
    const total = initialBlocks.reduce((acc, d) => acc + d.value, 0);
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
  }, [data, stackType, seed]);
}
