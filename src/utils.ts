const { floor, random } = Math;

function choice<T>(items: T[]): T {
  return items[floor(random() * items.length)];
}

function randint(min: number, max: number): number {
  return floor(random() * (max - min + 1)) + min;
}

const utils = { choice, randint };
export default utils;
