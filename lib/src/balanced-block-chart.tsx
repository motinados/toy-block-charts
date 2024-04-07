import Block, { BlockItem } from "./block";
import {
  calcWidthAndHeight,
  calcPercentagesForData,
  getRandomColor,
  getRandomInt,
  shuffleArray,
} from "./utils";

function datumToBlock(datum: { width: number; height: number }) {
  return {
    x: 0,
    y: 0,
    width: datum.width,
    height: datum.height,
    fill: getRandomColor(),
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
    block.fill = datum.color || getRandomColor();
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
export type DatumWithPercentage = Datum & { percentage: number };
export type DatumWithWidthHeight = DatumWithPercentage & {
  width: number;
  height: number;
};

type BalancedBlockChartProps = {
  type: "stable-balanced" | "unstable-inverted" | "shuffled";
  data: Datum[];
};

export default function BalancedBlockChart({
  type,
  data,
}: BalancedBlockChartProps) {
  const svgWidth = 400;
  const svgHeight = 300;

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

  const svgCenterAdjustment = 50;
  const svgCenterX = svgWidth / 2 - svgCenterAdjustment;
  const blocks = createBlocks(dataWithWidthHeight, svgCenterX);
  const finalBlocks = alignToBottom(blocks, svgHeight);
  const legendItems = dataWithWidthHeight.map((d) => d.name);
  const legendWidth = 100;
  const legendItemHeight = 16;
  const legendPaddingTop = 10;
  const legendPaddingRight = 10;

  return (
    <>
      <div
        style={{ display: "flex", width: "100%", border: "1px solid black" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: "100%", maxWidth: "100%", height: "auto" }}
        >
          {finalBlocks.map((block, index) => (
            <Block key={index} {...block} />
          ))}
          <g
            transform={`translate(${svgWidth - legendWidth - legendPaddingRight}, ${0 + legendPaddingTop})`}
          >
            {legendItems.map((name, index) => (
              <g
                key={index}
                transform={`translate(0, ${index * legendItemHeight})`}
              >
                <rect
                  width="10"
                  height="10"
                  fill={dataWithColor[index].color}
                />
                <text x="15" y="10" style={{ fontSize: "16px" }}>
                  {name}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </>
  );
}
