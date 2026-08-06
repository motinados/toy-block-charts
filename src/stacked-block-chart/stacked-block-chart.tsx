import { ComponentPropsWithRef, forwardRef, useId } from "react";
import Block from "./components/block";
import BlockLabels from "./components/block-labels";
import Legend from "./components/legend";
import type { StackedBlockDatum, StackType } from "./model/types";
import { useComputedBlocks } from "./model/use-computed-blocks";

export type { StackedBlockDatum, StackType } from "./model/types";

export const defaultTitle = "Stacked block chart";

export type StackedBlockChartProps = ComponentPropsWithRef<"svg"> & {
  stackType: StackType;
  data: StackedBlockDatum[];
  seed?: number;
  showDataLabels?: boolean;
  /**
   * The accessible name of the chart, rendered as <title>.
   * Pass an empty string to leave the chart unnamed.
   */
  title?: string;
  /** A longer description of the chart, rendered as <desc>. */
  desc?: string;
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
      title = defaultTitle,
      desc,
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

    const id = useId();
    const titleId = `${id}-title`;
    const descId = `${id}-desc`;

    // A caller who supplies their own label owns the accessible name, so the
    // generated <title> must not compete with it.
    const hasOwnLabel =
      rest["aria-label"] !== undefined || rest["aria-labelledby"] !== undefined;
    const showTitle = title !== "" && !hasOwnLabel;
    const showDesc = desc !== undefined;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
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
        aria-labelledby={showTitle ? titleId : undefined}
        aria-describedby={
          showDesc && rest["aria-describedby"] === undefined
            ? descId
            : undefined
        }
        {...rest}
      >
        {showTitle && <title id={titleId}>{title}</title>}
        {showDesc && <desc id={descId}>{desc}</desc>}
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
    );
  }
);
