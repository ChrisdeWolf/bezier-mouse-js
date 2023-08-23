/**
  A javascript bezier-based natural mouse movement library.

  This code is MIT licensed.
**/

import { Bezier } from "bezier-js";
import { choice } from "./utils.js";

const { abs, ceil } = Math;

/**
 * BezierMouse class generates natural mouse movement using bezier curves
 */
class BezierMouse {
  //   constructor(opts) {
  //     // TODO
  //   }

  /**
   * @typedef {Object} Point
   * @property {number} x - The x-coordinate of the point.
   * @property {number} y - The y-coordinate of the point.
   * @param {Point} initPos
   * @param {Point} finPos
   * @param {Point} deviation - max x, y distances from finPos ...TODO
   * @param {number} speed - integer multiplier for speed. 1=fastest, 1< slower
   */
  bezierCurve(initPos, finPos, deviation, speed) {
    // Calculate time parameter values
    // const ts = [];
    // for (let t = 0; t < speed * 101; t++) {
    //   ts.push(t / (speed * 100));
    // }
    // bezier centre control points between (deviation / 2) and (deviaion) of travel distance, plus or minus at random
    // const control1 = TODO...
    // const control2 = TODO...
    // cubicPoints = [init_pos, control_1, control_2, fin_pos];
    // const cubicCurve = new Bezier(cubicPoints);
  }
}

export { BezierMouse };
