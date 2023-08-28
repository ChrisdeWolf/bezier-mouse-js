/**
  A javascript bezier-based natural mouse movement library.

  This code is MIT licensed.
**/
import { Bezier } from "bezier-js";
import { Point, mouse, straightTo } from "@nut-tree/nut-js";
import { choice, randint } from "./utils.js";

const { abs, ceil } = Math;

mouse.config.mouseSpeed = 40;

/**
 * BezierMouse class generates natural mouse movement using bezier curves
 */
export default class BezierMouse {
  //   constructor(opts) {
  //     // TODO
  //   }

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
    const randDeviation = () => randint(deviation / 2, deviation);

    return [
      initX + choice([-1, 1]) * deltaX * 0.01 * randDeviation(),
      initY + choice([-1, 1]) * deltaY * 0.01 * randDeviation(),
    ];
  }
