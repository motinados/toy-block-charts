import { useMemo } from "react";
import Block from "./block";
import BlockLabels from "./block-labels";
import Legend from "./legend";
import { shuffleArray } from "./utils";
import {
  alignToBottom,
  calcBlocksPosition,
  calcPercentage,
  calcWidthsAndHeights,
  createInitialBlockDatum,
  ensureBlockHasColor,
} from "./compute-blocks";

export type Datum = {
  value: number;
  name: string;
  color?: string;
};

type BalancedBlockChartProps = {
  type: "stable-balanced" | "unstable-inverted" | "shuffled";
  data: Datum[];
  showDataLabels?: boolean;
};

export default function StackedBlockChart({
  type,
  data,
  showDataLabels = true,
}: BalancedBlockChartProps) {
  const svgWidth = 400;
  const svgHeight = 300;
  const blocksOffsetX = 40;
  const legendWidth = 100;
  const legendItemHeight = 16;
  const legendPaddingTop = 10;
  const legendPaddingRight = 10;

  const { blocks, legendItems } = useMemo(() => {
    const initialBlocks = data.map(createInitialBlockDatum);
    const blocksWithColor = initialBlocks.map(ensureBlockHasColor);
    const total = blocksWithColor.reduce((acc, d) => acc + d.value, 0);
    const blocksWithPercentage = blocksWithColor.map((d) =>
      calcPercentage(d, total)
    );
    blocksWithPercentage.sort((a, b) => a.percentage - b.percentage);

    let blocksWithWidthHeight = calcWidthsAndHeights(blocksWithPercentage, 100);
    if (type === "unstable-inverted") {
      blocksWithWidthHeight.reverse();
    } else if (type === "shuffled") {
      blocksWithWidthHeight = shuffleArray(blocksWithWidthHeight);
    }

    const svgCenterX = (svgWidth - legendWidth) / 2 - blocksOffsetX;
    const blocksWithPosition = calcBlocksPosition(
      blocksWithWidthHeight,
      svgCenterX
    );
    const blocks = alignToBottom(blocksWithPosition, svgHeight);
    const legendItems = blocksWithWidthHeight.map((d) => {
      return { name: d.name, color: d.fill };
    });

    return { blocks, legendItems };
  }, [type, data]);

  return (
    <>
      <div style={{ display: "flex", width: "100%" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: "100%", maxWidth: "100%", height: "auto" }}
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
      </div>
    </>
  );
}
