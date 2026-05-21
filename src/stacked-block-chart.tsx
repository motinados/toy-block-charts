import { ComponentPropsWithRef, forwardRef } from "react";
import Block from "./block";
import BlockLabels from "./block-labels";
import Legend from "./legend";
import type { StackedBlockDatum, StackType } from "./types/chart";
import { useComputedBlocks } from "./use-computed-blocks";

export type { StackedBlockDatum, StackType } from "./types/chart";

export type StackedBlockChartProps = ComponentPropsWithRef<"svg"> & {
  stackType: StackType;
  data: StackedBlockDatum[];
  seed?: number;
  showDataLabels?: boolean;
  width?: number;
  height?: number;
  legendWidth?: number;
};

export const StackedBlockChart = forwardRef<
  SVGSVGElement,
  StackedBlockChartProps
>(
  (
    {
      stackType,
      data,
      seed = 42,
      showDataLabels = true,
      width = 400,
      height = 300,
      legendWidth = 100,
      ...rest
    }: StackedBlockChartProps,
    ref
  ) => {
    const svgWidth = width;
    const svgHeight = height;
    const legendItemHeight = 16;
    const legendPaddingTop = 10;
    const legendPaddingRight = 10;
    const { blocks, legendItems } = useComputedBlocks(data, stackType, seed, {
      width: svgWidth,
      height: svgHeight,
      legendWidth,
    });

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
