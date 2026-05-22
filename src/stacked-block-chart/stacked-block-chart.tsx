import { ComponentPropsWithRef, forwardRef } from "react";
import Block from "./components/block";
import BlockLabels from "./components/block-labels";
import Legend from "./components/legend";
import type { StackedBlockDatum, StackType } from "./model/types";
import { useComputedBlocks } from "./model/use-computed-blocks";

export type { StackedBlockDatum, StackType } from "./model/types";

export type StackedBlockChartProps = ComponentPropsWithRef<"svg"> & {
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
      width,
      height,
      style,
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
          width={width}
          height={height}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            width: "100%",
            height: "auto",
            ...(width === undefined ? {} : { maxWidth: width }),
            ...(height === undefined ? {} : { maxHeight: height }),
            ...style,
          }}
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
