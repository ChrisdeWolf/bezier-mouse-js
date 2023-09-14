/**
  A javascript bezier-based natural mouse movement library.

  This code is MIT licensed.
**/
import { Bezier } from "bezier-js";
import { Point, mouse, Button } from "@nut-tree/nut-js";
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
   * @typedef {Object} Options
   * @property {number} deviation - deviation scale (larger = more curve). default=20.
   * @property {number} flip - controls where the control points are anchored from, false: curves closer to finish position, true: curves closer to init position. default=false.
   * @property {number} steps - number of steps (points) when moving on the bezier curve (t=0 to t=1 at interval 1/steps). default=100.
   * @param {Options} opts
   */
  async moveAndClick(initPos, finPos, clickType = "LEFT", opts = {}) {
    await this.move(initPos, finPos, opts);
    await mouse.click(Button[clickType]);
  }

  /**
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {String} clickType - LEFT, MIDDLE, RIGHT
   * @typedef {Object} Options
   * @property {number} deviation - deviation scale (larger = more curve). default=20.
   * @property {number} flip - controls where the control points are anchored from, false: curves closer to finish position, true: curves closer to init position. default=false.
   * @property {number} steps - number of steps (points) when moving on the bezier curve (t=0 to t=1 at interval 1/steps). default=100.
   * @param {Options} opts
   */
  async moveAndDoubleClick(initPos, finPos, clickType = "LEFT", opts = {}) {
    await this.move(initPos, finPos, opts);
    await mouse.doubleClick(Button[clickType]);
  }

  /**
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @typedef {Object} Options
   * @property {number} deviation - deviation scale (larger = more curve). default=20.
   * @property {number} flip - controls where the control points are anchored from, false: curves closer to finish position, true: curves closer to init position. default=false.
   * @property {number} steps - number of steps (points) when moving on the bezier curve (t=0 to t=1 at interval 1/steps). default=100.
   * @param {Options} opts
   */
  async move(initPos, finPos, opts = {}) {
    await mouse.move(this.bezierCurveTo(initPos, finPos, opts));
  }

  /**
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @typedef {Object} Options
   * @property {number} deviation - deviation scale (larger = more curve). default=20.
   * @property {number} flip - controls where the control points are anchored from, false: curves closer to finish position, true: curves closer to init position. default=false.
   * @property {number} steps - number of steps (points) when moving on the bezier curve (t=0 to t=1 at interval 1/steps). default=100.
   * @param {Options} opts
   */
  async bezierCurveTo(initPos, finPos, opts = {}) {
    const curve = this.cubicBezierCurve(initPos, finPos, opts);
    const LUT = curve.getLUT(opts.steps || 100);

    return LUT.map((point) => new Point(point.x, point.y));
  }

  /**
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @typedef {Object} Options
   * @property {number} deviation - deviation scale (larger = more curve). default=20.
   * @property {number} flip - controls where the control points are anchored from, false: curves closer to finish position, true: curves closer to init position. default=false.
   * @param {Options} opts
   */
  cubicBezierCurve(initPos, finPos, opts = {}) {
    const [c0x, c0y] = this.getBezierControlPoint(initPos, finPos, opts);
    const [c1x, c1y] = this.getBezierControlPoint(initPos, finPos, opts);
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
   * deviation of total distance (+/- random) against finPos
   */
  getBezierControlPoint(initPos, finPos, opts = {}) {
    const { deviation = 20, flip = false } = opts;
    const [initX, initY] = initPos;
    const [finX, finY] = finPos;

    const deltaX = abs(ceil(finX) - ceil(initX));
    const deltaY = abs(ceil(finY) - ceil(initY));
    const randDeviation = () => Utils.randint(deviation / 2, deviation);

    const refPointX = flip ? initX : finX;
    const refPointY = flip ? initY : finY;
    return [
      refPointX + Utils.choice([-1, 1]) * deltaX * 0.01 * randDeviation(),
      refPointY + Utils.choice([-1, 1]) * deltaY * 0.01 * randDeviation(),
    ];
  }

  //   _error() {
  //     //
  //   }
}
