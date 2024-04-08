export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
