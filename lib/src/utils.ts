export function calcPercentages(values: number[]) {
  const total = values.reduce((acc, value) => acc + value, 0);
  return values.map((value) => (value / total) * 100);
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calcRamdomRectDimensions(area: number) {
  const ratioWidth = getRandomInt(1, 10);
  const ratioHeight = getRandomInt(1, 10);
  const height = Math.sqrt(area * (ratioHeight / ratioWidth));
  const width = area / height;
  return [width, height, ratioWidth, ratioHeight];
}
