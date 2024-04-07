import {
  DatumWithColor,
  DatumWithPercentage,
  DatumWithWidthHeight,
} from "./stacked-block-chart";

export function calcPercentages(values: number[]) {
  const total = values.reduce((acc, value) => acc + value, 0);
  return values.map((value) => (value / total) * 100);
}

export function calcPercentagesForData(
  data: DatumWithColor[]
): DatumWithPercentage[] {
  const values = data.map((d) => d.value);
  const percentages = calcPercentages(values);
  return data.map((d, index) => ({
    ...d,
    percentage: percentages[index],
  }));
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calcRamdomRectDimensions(area: number): {
  width: number;
  height: number;
} {
  const ratioWidth = getRandomInt(1, 10);
  const ratioHeight = getRandomInt(1, 10);
  const height = Math.sqrt(area * (ratioHeight / ratioWidth));
  const width = area / height;
  return { width, height };
}

export function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// Generate multiple random numbers and return an array of them sorted in ascending order
export function getOrderdRandomInt(min: number, max: number, size: number) {
  const numbers = Array.from({ length: size }, () => getRandomInt(min, max));
  return numbers.sort((a, b) => a - b);
}

// Calculate the height and return it by receiving the area and width
export function calcHeight(area: number, width: number) {
  return area / width;
}

export function calcWidthAndHeight(
  data: DatumWithPercentage[],
  multiple: number
): DatumWithWidthHeight[] {
  const widths = getOrderdRandomInt(10, 100, data.length);
  return data.map((datum, index) => ({
    width: widths[index],
    height: calcHeight(datum.percentage * multiple, widths[index]),
    area: datum.percentage,
    ...datum,
  }));
}

export function makeSampleData(size: number) {
  return Array.from({ length: size }, () => getRandomInt(1, 100));
}

// Receives an array and returns a shuffled array
export function shuffleArray<T>(array: T[]): T[] {
  const shffledArray = [...array];
  for (let i = shffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shffledArray[i];
    shffledArray[i] = shffledArray[j];
    shffledArray[j] = temp;
  }
  return shffledArray;
}
