import { useMemo } from "react";
import Block from "./block";
import BlockLabels from "./block-labels";
import Legend from "./legend";
import {
  getRandomColor,
  getRandomInt,
  shuffleArray,
  getOrderdRandomInt,
  calcHeight,
} from "./utils";

//Align BlockItem to the bottom of the svg based on svgHeight
function alignToBottom(blocks: BlockDatum[], svgHeight: number): BlockDatum[] {
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

export type Datum = {
  value: number;
  name: string;
  color?: string;
};

export type BlockDatum = {
  value: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  percentage: number;
};

/** Create initial BlockDatum */
function createInitialBlockDatum(datum: Datum): BlockDatum {
  return {
    value: datum.value,
    name: datum.name,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fill: datum.color || "",
    percentage: 0,
  };
}

/** Ensure BlockDatum has color */
function ensureBlockHasColor(blockDatum: BlockDatum): BlockDatum {
  if (!blockDatum.fill) {
    return { ...blockDatum, fill: getRandomColor() };
  }
  return { ...blockDatum };
}

/** Calculate the percentage of BlockDatum */
function calcPercentage(blockDatum: BlockDatum, total: number): BlockDatum {
  return { ...blockDatum, percentage: (blockDatum.value / total) * 100 };
}

/** Calculate the width and height of BlockDatum */
function calcWidthsAndHeights(
  data: BlockDatum[],
  multiple: number
): BlockDatum[] {
  const widths = getOrderdRandomInt(10, 100, data.length);
  return data.map((datum, index) => ({
    ...datum,
    width: widths[index],
    height: calcHeight(datum.percentage * multiple, widths[index]),
  }));
}

/** Calculate x, y of BlockDatum */
function calcBlocksPosition(
  blocks: BlockDatum[],
  svgCenterX: number
): BlockDatum[] {
  const resultBlocks: BlockDatum[] = [];
  let prevY = 0;
  for (const block of blocks) {
    const newBlock = { ...block };

    newBlock.y = prevY;
    prevY += block.height;

    const fluctuation = getRandomInt(-10, 10);
    newBlock.x = svgCenterX - block.width / 2 + fluctuation;

    resultBlocks.push(newBlock);
  }
  return resultBlocks;
}

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

    const svgCenterX = (svgWidth - legendWidth) / 2 - 40;
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
