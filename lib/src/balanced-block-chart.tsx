import Block, { BlockItem } from "./block";
import {
  calcWidthAndHeight,
  // calcPercentages,
  calcPercentagesForData,
  getRandomColor,
  getRandomInt,
  shuffleArray,
} from "./utils";

function dimensionsToBlock(dimensions: { width: number; height: number }) {
  return {
    x: 0,
    y: 0,
    width: dimensions.width,
    height: dimensions.height,
    fill: getRandomColor(),
  };
}

function createBlocks(
  dimensionsList: DatumWithWidthHeight[],
  // colors: string[],
  svgCenterX: number
): BlockItem[] {
  const blocks = [];
  let prevY = 0;
  for (const dimensions of dimensionsList) {
    const block = dimensionsToBlock(dimensions);
    block.fill = dimensions.color || getRandomColor();
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

  const svgCenterX = svgWidth / 2;
  const blocks = createBlocks(dataWithWidthHeight, svgCenterX);
  const finalBlocks = alignToBottom(blocks, svgHeight);
  const legend = dataWithWidthHeight.map((d) => d.name);

  return (
    <>
      <div style={{ display: "flex", width: "100%" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: "80%", maxWidth: "100%", height: "auto" }}
        >
          {finalBlocks.map((block, index) => (
            <Block key={index} {...block} />
          ))}
        </svg>
        <div style={{ width: "20%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            {legend.map((str, index) => (
              <div key={index} style={{ display: "flex", fontSize: "12px" }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: finalBlocks[index].fill,
                  }}
                ></div>
                {str}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
