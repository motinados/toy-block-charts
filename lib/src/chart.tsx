import Block from "./block";
import {
  calcPercentages,
  calcRamdomRectDimensions,
  getRandomColor,
} from "./utils";

function dimensionsToBlock(dimensions: number[]) {
  return {
    x: 0,
    y: 0,
    width: dimensions[0],
    height: dimensions[1],
    fill: getRandomColor(),
  };
}

export default function Chart() {
  const data = [10, 20, 30, 40, 50];
  const percentages = calcPercentages(data);
  console.log(percentages);
  const dimensionsList = percentages.map((percentage) =>
    calcRamdomRectDimensions(percentage * 100)
  );

  const blocks = dimensionsList.map(dimensionsToBlock);

  return (
    <div>
      <svg width="100" height="100">
        {blocks.map((block, index) => (
          <Block key={index} {...block} />
        ))}
      </svg>
    </div>
  );
}
