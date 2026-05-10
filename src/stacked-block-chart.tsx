import { ComponentPropsWithRef, forwardRef } from "react";
import Block from "./block";
import BlockLabels from "./block-labels";
import Legend from "./legend";
import { useComputedBlocks } from "./use-computed-blocks";

export type StackType = "stable-balanced" | "unstable-inverted" | "shuffled";

export type StackedBlockDatum = {
  value: number;
  name: string;
  fill?: string;
};

type StackedBlockChartProps = ComponentPropsWithRef<"svg"> & {
  stackType: StackType;
  data: StackedBlockDatum[];
  seed?: number;
  showDataLabels?: boolean;
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
      ...rest
    }: StackedBlockChartProps,
    ref
  ) => {
    const svgWidth = 400;
    const svgHeight = 300;
    const legendWidth = 100;
    const legendItemHeight = 16;
    const legendPaddingTop = 10;
    const legendPaddingRight = 10;
    const { blocks, legendItems } = useComputedBlocks(data, stackType, seed);

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
