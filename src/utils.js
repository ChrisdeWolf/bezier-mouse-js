const { floor, random } = Math;

class Utils {
  static choice = (items) => items[floor(random() * items.length)];

  static randint = (min, max) => floor(random() * (max - min + 1)) + min;
}

module.exports = Utils;
