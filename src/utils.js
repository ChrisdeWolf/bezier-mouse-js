const { floor, random } = Math;

export const choice = (items) => items[floor(random() * items.length)];

export const randint = (min, max) => floor(random() * (max - min + 1)) + min;
