import { useMemo } from "react";
import {
  BlockDatum,
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
import { StackedBlockDatum, StackType } from "./stacked-block-chart";

const SVG_WIDTH = 400;
const SVG_HEIGHT = 300;
const BLOCKS_OFFSET_X = 40;
const LEGEND_WIDTH = 100;

type UseComputedBlocksResult = {
  blocks: BlockDatum[];
  legendItems: { name: string; color: string }[];
};

export function useComputedBlocks(
  data: StackedBlockDatum[],
  stackType: StackType,
  getRandomInt: (min: number, max: number) => number
): UseComputedBlocksResult {
  return useMemo(() => {
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
  }, [data, stackType, getRandomInt]);
}
