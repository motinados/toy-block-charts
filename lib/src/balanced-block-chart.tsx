import Block from "./block";
import {
  calcOrderdDimenstionsList,
  calcPercentages,
  getRandomColor,
  getRandomInt,
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
) {
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

type BalancedBlockChartProps = {
  data: number[];
};

export default function BalancedBlockChart({ data }: BalancedBlockChartProps) {
  const svgWidth = 400;
  const svgHeight = 200;
  const percentages = calcPercentages(data);
  percentages.sort((a, b) => a - b);
  const dimensionsList = calcOrderdDimenstionsList(
    percentages.map((p) => p * 100)
  );

  const svgCenterX = svgWidth / 2 - 50;
  const blocks = createBlocks(dimensionsList, svgCenterX);

  const legend: string[] = ["apple", "banana", "cherry", "date", "elderberry"];
  return (
    <div style={{ display: "flex" }}>
      <div>
        <svg width={svgWidth} height={svgHeight}>
          {blocks.map((block, index) => (
            <Block key={index} {...block} />
          ))}
        </svg>
      </div>
      <div>
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
  );
}
