import { expect } from "chai";
import sinon from "sinon";
import BezierMouse from "../src/BezierMouse.js";
import Utils from "../src/Utils.js";

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
    beforeEach(() => {
      sinon.stub(Utils, "choice").returns(0.6);
      sinon.stub(Utils, "randint").returns(16);
    });
    afterEach(() => {
      Utils.choice.restore();
      Utils.randint.restore();
    });
    it("returns a psuedo-random bezier control point based on the initial/end positions and the deviation", () => {
      const point = BezMouse.getBezierControlPoint(initPos, finPos, deviation);
      expect(point).eql([648, 648]);
    });
  });
});
