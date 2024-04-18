import { ComponentPropsWithRef, forwardRef, useEffect, useState } from "react";
import Block from "./block";
import BlockLabels from "./block-labels";
import Legend from "./legend";
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
  ensureBlockHasColor,
  modifyOrderByType,
} from "./compute-blocks";

export type StackType = "stable-balanced" | "unstable-inverted" | "shuffled";

export type StackedBlockDatum = {
  value: number;
  name: string;
  color?: string;
};

type StackedBlockChartProps = ComponentPropsWithRef<"svg"> & {
  stackType: StackType;
  data: StackedBlockDatum[];
  showDataLabels?: boolean;
};

export const StackedBlockChart = forwardRef<
  SVGSVGElement,
  StackedBlockChartProps
>(
  (
    { stackType, data, showDataLabels = true, ...rest }: StackedBlockChartProps,
    ref
  ) => {
    const svgWidth = 400;
    const svgHeight = 300;
    const blocksOffsetX = 40;
    const legendWidth = 100;
    const legendItemHeight = 16;
    const legendPaddingTop = 10;
    const legendPaddingRight = 10;
    const [blocks, setBlocks] = useState<BlockDatum[]>([]);
    const [legendItems, setLegendItems] = useState<
      { name: string; color: string }[]
    >([]);

    useEffect(() => {
      const initialBlocks = data.map(createInitialBlockDatum);
      const total = initialBlocks.reduce((acc, d) => acc + d.value, 0);
      const svgCenterX = (svgWidth - legendWidth) / 2 - blocksOffsetX;

      const ops: ((b: BlockDatum[]) => BlockDatum[])[] = [
        (b) => b.map(ensureBlockHasColor),
        (b) => b.map((datum) => calcPercentage(datum, total)),
        (b) => b.sort((a, b) => a.percentage - b.percentage),
        (b) => calcWidthsAndHeights(b, { multiple: 100 }),
        (b) => adjustSameValueBlocks(b),
        (b) => adjustTotalHeight(b, svgHeight),
        (b) => modifyOrderByType(b, stackType),
        (b) => calcYPositions(b),
        (b) => calcXPositions(b, svgCenterX),
        (b) => addXFluctuation(b),
        (b) => alignToBottom(b, svgHeight),
      ];

      const blocks = ops.reduce((acc, op) => op(acc), initialBlocks);
      const legendItems = blocks.map((d) => {
        return { name: d.name, color: d.fill };
      });

      setBlocks(blocks);
      setLegendItems(legendItems);
    }, [stackType, data]);

    return (
      <>
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: "100%", height: "auto" }}
          {...rest}
        >
          {blocks.map((block, index) => (
            <Block key={index} {...block} />
          ))}
          {showDataLabels && <BlockLabels blocks={blocks} />}
          <Legend
            items={legendItems}
            svgWidth={svgWidth}
            width={legendWidth}
            paddingRight={legendPaddingRight}
            paddingTop={legendPaddingTop}
            itemHeight={legendItemHeight}
          />
        </svg>
      </>
    );
  }
);
