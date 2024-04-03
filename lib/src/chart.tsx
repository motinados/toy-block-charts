import Block from "./block";
import {
  calcOrderdDimenstionsList,
  calcPercentages,
  getRandomColor,
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
  svgWidth: number
) {
  const svgCenterX = svgWidth / 2;

  const blocks = [];
  let prevY = 0;
  for (const dimensions of dimensionsList) {
    const block = dimensionsToBlock(dimensions);
    block.y = prevY;
    prevY += block.height;

    // Center the block
    block.x = svgCenterX - block.width / 2;
    blocks.push(block);
  }
  return blocks;
}

export default function Chart() {
  const svgWidth = 100;
  const svgHeight = 400;
  const data = [10, 20, 30, 40, 50];
  const percentages = calcPercentages(data);
  percentages.sort((a, b) => a - b);
  const dimensionsList = calcOrderdDimenstionsList(
    percentages.map((p) => p * 100)
  );

  const blocks = createBlocks(dimensionsList, svgWidth);

  return (
    <div>
      <svg width={svgWidth} height={svgHeight}>
        {blocks.map((block, index) => (
          <Block key={index} {...block} />
        ))}
      </svg>
    </div>
  );
}
