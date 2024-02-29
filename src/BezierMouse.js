/**
 * @module BezierMouse
 */

const { Bezier } = require("bezier-js");
const {
  Point,
  mouse,
  Button,
  Region,
  randomPointIn,
} = require("@nut-tree/nut-js");
const Utils = require("./Utils.js");

const { abs, ceil } = Math;

/**
 * BezierMouse class generates natural mouse movement using bezier curves
 */
class BezierMouse {
  /**
   * constructor
   * @param {number} mouseSpeed - mouse movement speed in pixels per second
   */
  constructor(mouseSpeed) {
    mouse.config.mouseSpeed = mouseSpeed || 100;
  }

  /**
   * moveAndClick: moves mouse on a bezier curve and clicks
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {String} clickType - enum: LEFT, MIDDLE, RIGHT
   * @param {Options} opts
   */
  async moveAndClick(initPos, finPos, clickType = "LEFT", opts = {}) {
    await this.move(initPos, finPos, opts);
    await mouse.click(Button[clickType]);
  }

  /**
   * moveAndDoubleClick: moves mouse on a bezier curve and double clicks
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {String} clickType - enum: LEFT, MIDDLE, RIGHT
   * @param {Options} opts
   */
  async moveAndDoubleClick(initPos, finPos, clickType = "LEFT", opts = {}) {
    await this.move(initPos, finPos, opts);
    await mouse.doubleClick(Button[clickType]);
  }

  /**
   * move: moves mouse on a bezier curve
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {Options} opts
   */
  async move(initPos, finPos, opts = {}) {
    let finishPosition = finPos;
    if (!opts.preciseClick) {
      const deviation = 5;
      const randDeviation = () => Utils.randint(deviation / 2, deviation);
      const region = new Region(
        finPos.x,
        finPos.y,
        randDeviation(),
        randDeviation()
      );
      finishPosition = await randomPointIn(region);
    }
    await mouse.move(this.bezierCurveTo(initPos, finishPosition, opts));
  }

  // async click(finPos, clickType, natural = true) {
  //   // TODO:
  //   // - factor in a random (not very likely) total misclick, where the region is large
  //   //    - if this misclick=true, then do a recovery click after to ensure click is made
  //
  //   await mouse.click(Button[clickType]);
  // }

  async bezierCurveTo(initPos, finPos, opts = {}) {
    const curve = this.cubicBezierCurve(initPos, finPos, opts);
    const LUT = curve.getLUT(opts.steps || 100);

    return LUT.map((point) => new Point(point.x, point.y));
  }

  cubicBezierCurve(initPos, finPos, opts = {}) {
    const cntlPt1 = this.getBezierControlPoint(initPos, finPos, opts);
    const cntlPt2 = this.getBezierControlPoint(initPos, finPos, opts);
    const cubicPoints = [initPos, cntlPt1, cntlPt2, finPos];
    return new Bezier(cubicPoints);
  }

  getBezierControlPoint(initPos, finPos, opts = {}) {
    const { deviation = 20, flip = false } = opts;

    const deltaX = abs(ceil(finPos.x) - ceil(initPos.x));
    const deltaY = abs(ceil(finPos.y) - ceil(initPos.y));
    const randDeviation = () => Utils.randint(deviation / 2, deviation);

    const refPointX = flip ? initPos.x : finPos.x;
    const refPointY = flip ? initPos.y : finPos.y;
    return {
      x: refPointX + Utils.choice([-1, 1]) * deltaX * 0.01 * randDeviation(),
      y: refPointY + Utils.choice([-1, 1]) * deltaY * 0.01 * randDeviation(),
    };
  }
}

/* typedefs */
/**
 * @typedef {Object} Point
 * @property {number} x - The x-coordinate of the point.
 * @property {number} y - The y-coordinate of the point.
 */
/**
 * @typedef {Object} Options
 * @property {number} deviation - deviation scale (larger = more curve). default=20.
 * @property {number} flip - controls where the control points are anchored from, false: curves closer to finish position, true: curves closer to init position. default=false.
 * @property {number} steps - number of steps (points) when moving on the bezier curve (t=0 to t=1 at interval 1/steps). default=100.
 * @property {boolean} preciseClick - controls if click action should be on exact point. default=false.
 */

module.exports = BezierMouse;
