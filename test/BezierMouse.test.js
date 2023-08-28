import { expect } from "chai";
import sinon from "sinon";
import BezierMouse from "../src/BezierMouse.js";
// TODO: figure out how to stub utils properly... or stub Math.x
// import utils from "../src/utils.js";
// import { choice, randint } from "../src/utils.js";
// const utils = require("../src/utils.js");
// const utils = { choice, randint };

describe("BezierMouse", () => {
  let BezMouse, initPos, finPos, deviation;
  beforeEach(() => {
    BezMouse = new BezierMouse();
    initPos = [100, 100];
    finPos = [600, 600];
    deviation = 20;
  });
  describe("cubicBezierCurve", () => {
    beforeEach(() => {
      sinon.stub(BezMouse, "getBezierControlPoint").returns([12, 12]);
    });
    afterEach(() => {
      BezMouse.getBezierControlPoint.restore();
    });
    it("properly generates a random cubic bezier curve", () => {
      const curve = BezMouse.cubicBezierCurve(initPos, finPos, deviation);
      expect(curve.points).eql([
        { x: initPos[0], y: initPos[1] },
        { x: 12, y: 12 },
        { x: 12, y: 12 },
        { x: finPos[0], y: finPos[1] },
      ]);
    });
  });

  describe("getBezierControlPoint", () => {
    // beforeEach(() => {
    //   sinon.stub(utils, "choice").returns(1);
    //   sinon.stub(utils, "randint").returns(16);
    // });
    // afterEach(() => {
    //   utils.choice.restore();
    // });
    // it("returns a psuedo-random bezier control point based on the initial/end positions and the deviation", () => {
    //   const point = BezMouse.getBezierControlPoint(initPos, finPos, deviation);
    //   expect(point).eql([12, 12]);
    // });
  });
});
