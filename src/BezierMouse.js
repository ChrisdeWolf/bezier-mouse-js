/**
  A javascript bezier-based natural mouse movement library.

  This code is MIT licensed.
**/
import { Bezier } from "bezier-js";
import { Point, mouse, straightTo } from "@nut-tree/nut-js";
import Utils from "./Utils.js";

const { abs, ceil } = Math;

mouse.config.mouseSpeed = 100;

/**
 * BezierMouse class generates natural mouse movement using bezier curves
 */
export default class BezierMouse {
  // constructor(opts) {
  //   this.Bezier = Bezier;
  // }

  /**
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {number} deviation - deviation scale (larger = more curve)
   */
  cubicBezierCurve(initPos, finPos, deviation, speed) {
    const [c0x, c0y] = this.getBezierControlPoint(initPos, finPos, deviation);
    const [c1x, c1y] = this.getBezierControlPoint(initPos, finPos, deviation);
    const [initX, initY] = initPos;
    const [finX, finY] = finPos;

    const cubicPoints = [
      { x: initX, y: initY },
      { x: c0x, y: c0y },
      { x: c1x, y: c1y },
      { x: finX, y: finY },
    ];
    const cubicCurve = new Bezier(cubicPoints);
    return cubicCurve;
  }

  /**
   * returns a bezier control point between deviation/2 and
   * deviation of total distance (+/- random)
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {number} deviation - deviation scale (larger = more curve)
   */
  getBezierControlPoint(initPos, finPos, deviation = 5) {
    const [initX, initY] = initPos;
    const [finX, finY] = finPos;

    const deltaX = abs(ceil(finX) - ceil(initX));
    const deltaY = abs(ceil(finY) - ceil(initY));
    const randDeviation = () => Utils.randint(deviation / 2, deviation);

    return [
      initX + Utils.choice([-1, 1]) * deltaX * 0.01 * randDeviation(),
      initY + Utils.choice([-1, 1]) * deltaY * 0.01 * randDeviation(),
    ];
  }

  async move(point) {
    const p0 = new Point(100, 100);
    const p1 = new Point(500, 500);
    // TODO: need to copy what this does
    //  - see https://github.com/nut-tree/nut.js/blob/develop/lib/movement.function.ts
    //  - uses a linehelper class: https://github.com/nut-tree/nut.js/blob/develop/lib/util/linehelper.class.ts
    //  - this is where we will use our
    // console.log({ straightTo: await straightTo(p1) });
    await mouse.move(this.bezierCurveTo(p0, p1)); //

    // await mouse.move([p0, p1]);
  }

  async bezierCurveTo(origin, target) {
    const curve = this.cubicBezierCurve([100, 100], [700, 700], 20);
    const steps = 120; // https://pomax.github.io/bezierjs/#getLUT
    const LUT = curve.getLUT(steps);
    console.log({ points: curve.points, LUT });

    // TODO: figure out why bezier is backwards!
    // return LUT.map((point) => new Point(point.x, point.y));
    let points = [];
    for (let t = LUT.length - 1; t >= 0; t--) {
      points.push(new Point(LUT[t].x, LUT[t].y));
    }
    return points;
  }

  // TODO:
  //   * @param {number} speed - integer multiplier for speed. 1=fastest, 1< slower
  // Calculate time parameter values
  // const ts = [];
  // for (let t = 0; t < speed * 101; t++) {
  //   ts.push(t / (speed * 100));
  // }

  //   toString() {
  //     return utils.pointsToString(this.points);
  //   }

  //   _error(pc, np1, s, e) {
  //     //
  //   }
}

(async () => {
  const bezMouse = new BezierMouse();
  await bezMouse.move();
})();
