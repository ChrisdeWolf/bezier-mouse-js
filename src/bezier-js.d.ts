declare module "bezier-js" {
  interface BezierPoint {
    x: number;
    y: number;
    z?: number;
  }

  class Bezier {
    points: BezierPoint[];
    constructor(points: BezierPoint[]);
    getLUT(steps?: number): BezierPoint[];
  }

  export { Bezier };
}
