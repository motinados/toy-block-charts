import Block from "./block";
import {
  calcPercentages,
  calcRamdomRectDimensions,
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

function createBlocks(dimensionsList: { width: number; height: number }[]) {
  const blocks = [];
  let prevY = 0;
  for (const dimensions of dimensionsList) {
    const block = dimensionsToBlock(dimensions);
    block.y = prevY;
    prevY += block.height;
    blocks.push(block);
  }
  return blocks;
}

export default function Chart() {
  const data = [10, 20, 30, 40, 50];
  const percentages = calcPercentages(data);
  console.log(percentages);
  const dimensionsList = percentages.map((percentage) =>
    calcRamdomRectDimensions(percentage * 100)
  );

  const blocks = createBlocks(dimensionsList);

  return (
    <div>
      <svg width="100" height="400">
        {blocks.map((block, index) => (
          <Block key={index} {...block} />
        ))}
      </svg>
    </div>
  );
}
