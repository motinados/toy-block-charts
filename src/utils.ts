export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate multiple random numbers and return an array of them sorted in ascending order
export function getOrderdRandomInt(
  min: number,
  max: number,
  size: number,
  rndFn: (min: number, max: number) => number
) {
  const numbers = Array.from({ length: size }, () => rndFn(min, max));
  return numbers.sort((a, b) => a - b);
}

// Calculate the height and return it by receiving the area and width
export function calcHeight(area: number, width: number) {
  return area / width;
}

// Receives an array and returns a shuffled array
export function shuffleArray<T>(
  array: T[],
  rndFn: (min: number, max: number) => number
): T[] {
  if (array.length <= 1) {
    return array;
  }

  const allEqual = array.every((e) => e === array[0]);
  if (allEqual) {
    return array;
  }

  let shffledArray = [];
  let attempts = 0;
  const maxAttempts = 100;

  do {
    shffledArray = [...array];

    for (let i = shffledArray.length - 1; i > 0; i--) {
      const j = rndFn(0, i);
      const temp = shffledArray[i];
      shffledArray[i] = shffledArray[j];
      shffledArray[j] = temp;
    }

    attempts++;
  } while (
    shffledArray.every((e, i) => e === array[i]) &&
    attempts < maxAttempts
  );

  return shffledArray;
}
