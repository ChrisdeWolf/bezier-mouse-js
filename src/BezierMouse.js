/**
  A javascript bezier-based natural mouse movement library.

  This code is MIT licensed.
**/
import { Bezier } from "bezier-js";
import { Point, mouse } from "@nut-tree/nut-js";
import Utils from "./Utils.js";

const { abs, ceil } = Math;

/**
 * BezierMouse class generates natural mouse movement using bezier curves
 */
export default class BezierMouse {
  /**
   * constructor
   * @param {number} mouseSpeed - mouse movement speed in pixels per second
   */
  constructor(mouseSpeed) {
    mouse.config.mouseSpeed = mouseSpeed || 100;
  }

  /**
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {number} deviation - deviation scale (larger = more curve)
   */
  async move(initPos, finPos, deviation) {
    await mouse.move(this.bezierCurveTo(initPos, finPos, deviation));
  }

  /**
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {number} deviation - deviation scale (larger = more curve)
   */
  async bezierCurveTo(initPos, finPos, deviation) {
    const curve = this.cubicBezierCurve(initPos, finPos, deviation);
    const steps = 120; // TODO: handle step: https://pomax.github.io/bezierjs/#getLUT
    const LUT = curve.getLUT(steps);

    // TODO: figure out why bezier is backwards!
    // return LUT.map((point) => new Point(point.x, point.y));
    let points = [];
    for (let t = LUT.length - 1; t >= 0; t--) {
      points.push(new Point(LUT[t].x, LUT[t].y));
    }
    return points;
  }

  /**
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {number} deviation - deviation scale (larger = more curve)
   */
  cubicBezierCurve(initPos, finPos, deviation) {
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
    return new Bezier(cubicPoints);
  }

  /**
   * returns a bezier control points between deviation/2 and
   * deviation of total distance (+/- random)
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
}
