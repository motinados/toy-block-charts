import { useMemo } from "react";
import Block, { BlockItem } from "./block";
import BlockLabels from "./block-labels";
import Legend from "./legend";
import {
  calcWidthAndHeight,
  calcPercentagesForData,
  getRandomColor,
  getRandomInt,
  shuffleArray,
} from "./utils";

function datumToBlock(datum: DatumWithWidthHeight) {
  return {
    x: 0,
    y: 0,
    width: datum.width,
    height: datum.height,
    value: datum.value,
    fill: datum.color,
  };
}

function createBlocks(
  data: DatumWithWidthHeight[],
  svgCenterX: number
): BlockItem[] {
  const blocks = [];
  let prevY = 0;
  for (const datum of data) {
    const block = datumToBlock(datum);
    block.fill = datum.color;
    block.y = prevY;
    prevY += block.height;

    // Center the block
    const fluctuation = getRandomInt(-10, 10);
    block.x = svgCenterX - block.width / 2 + fluctuation;
    blocks.push(block);
  }
  return blocks;
}

//Align BlockItem to the bottom of the svg based on svgHeight
function alignToBottom(blocks: BlockItem[], svgHeight: number): BlockItem[] {
  const resultBlocks: BlockItem[] = [];
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

export type DatumWithColor = Required<Datum>;
export type DatumWithPercentage = DatumWithColor & { percentage: number };
export type DatumWithWidthHeight = DatumWithPercentage & {
  width: number;
  height: number;
};

type BalancedBlockChartProps = {
  type: "stable-balanced" | "unstable-inverted" | "shuffled";
  data: Datum[];
  showDataLabels?: boolean;
};

export default function BalancedBlockChart({
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
    const dataWithColor = data.map((d) => ({
      ...d,
      color: d.color || getRandomColor(),
    }));

    const dataWithPercentage = calcPercentagesForData(dataWithColor);
    dataWithPercentage.sort((a, b) => a.percentage - b.percentage);

    let dataWithWidthHeight = calcWidthAndHeight(dataWithPercentage, 100);

    if (type === "unstable-inverted") {
      dataWithWidthHeight.reverse();
    } else if (type === "shuffled") {
      dataWithWidthHeight = shuffleArray(dataWithWidthHeight);
    }

    const svgCenterX = (svgWidth - legendWidth) / 2 - 40;
    const rawBlocks = createBlocks(dataWithWidthHeight, svgCenterX);
    const blocks = alignToBottom(rawBlocks, svgHeight);
    const legendItems = dataWithWidthHeight.map((d) => {
      return { name: d.name, color: d.color };
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
