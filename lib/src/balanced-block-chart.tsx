import Block, { BlockItem } from "./block";
import {
  calcOrderdDimenstionsList,
  calcPercentages,
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
  dimensionsList: { width: number; height: number }[],
  svgCenterX: number
): BlockItem[] {
  const blocks = [];
  let prevY = 0;
  for (const dimensions of dimensionsList) {
    const block = dimensionsToBlock(dimensions);
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

type BalancedBlockChartProps = {
  type: "stable-balanced" | "unstable-inverted" | "shuffled";
  data: number[];
};

export default function BalancedBlockChart({
  type,
  data,
}: BalancedBlockChartProps) {
  const svgWidth = 400;
  const svgHeight = 300;
  const percentages = calcPercentages(data);
  percentages.sort((a, b) => a - b);
  let dimensionsList = calcOrderdDimenstionsList(
    percentages.map((p) => p * 100)
  );

  if (type === "unstable-inverted") {
    dimensionsList.reverse();
  } else if (type === "shuffled") {
    dimensionsList = shuffleArray(dimensionsList);
  }

  const svgCenterX = svgWidth / 2 - 50;
  let blocks = createBlocks(dimensionsList, svgCenterX);
  blocks = alignToBottom(blocks, svgHeight);

  const legend: string[] = ["apple", "banana", "cherry", "date", "elderberry"];
  return (
    <>
      <div style={{ display: "flex", width: "100%" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: "80%", maxWidth: "100%", height: "auto" }}
        >
          {blocks.map((block, index) => (
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
            {legend.map((legend, index) => (
              <div key={index} style={{ display: "flex", fontSize: "12px" }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: blocks[index].fill,
                  }}
                ></div>
                {legend}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
