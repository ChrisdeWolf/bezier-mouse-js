import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
chai.use(sinonChai);
import { mouse } from "@nut-tree/nut-js";
import BezierMouse from "../src/BezierMouse.js";
import Utils from "../src/Utils.js";

describe("BezierMouse", () => {
  let BezMouse, initPos, finPos, deviation;
  beforeEach(async () => {
    BezMouse = new BezierMouse();
    initPos = [100, 100];
    finPos = [600, 600];
    deviation = 20;
  });
  describe("move", () => {
    beforeEach(async () => {
      sinon.stub(mouse, "move").resolves();
    });
    afterEach(async () => {
      mouse.move.restore();
    });
    it("uses nut-js mouse movement to move the mouse along the generated bezier curve", async () => {
      await BezMouse.move(initPos, finPos);
      expect(mouse.move).calledOnce;
    });
  });

  describe("bezierCurveTo", () => {
    beforeEach(async () => {
      sinon.stub(BezMouse, "getBezierControlPoint").returns([12, 12]);
    });
    afterEach(async () => {
      BezMouse.getBezierControlPoint.restore();
    });
    it("uses the generated bezier curve to create a Lookup Table (LUT) of Points on that curve (default is 100 points)", async () => {
      const points = await BezMouse.bezierCurveTo(initPos, finPos);
      expect(points).lengthOf(101);
    });
    it("if opts.steps provided, the LUT will contain steps+1 coordinates representing the coordinates from t=0 to t=1 at interval 1/steps", async () => {
      const points = await BezMouse.bezierCurveTo(initPos, finPos, {
        steps: 2,
      });
      expect(points).eql([
        { x: 100, y: 100 },
        { x: 96.5, y: 96.5 },
        { x: 600, y: 600 },
      ]);
    });
  });

  describe("cubicBezierCurve", () => {
    beforeEach(async () => {
      sinon.stub(BezMouse, "getBezierControlPoint").returns([12, 12]);
    });
    afterEach(async () => {
      BezMouse.getBezierControlPoint.restore();
    });
    it("properly generates a random cubic bezier curve", async () => {
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
    beforeEach(async () => {
      sinon.stub(Utils, "choice").returns(0.6);
      sinon.stub(Utils, "randint").returns(16);
    });
    afterEach(async () => {
      Utils.choice.restore();
      Utils.randint.restore();
    });
    it("returns a psuedo-random bezier control point based on the initial/end positions and the deviation", async () => {
      const point = BezMouse.getBezierControlPoint(initPos, finPos);
      expect(point).eql([648, 648]);
    });
    it("default deviation is 20", async () => {
      BezMouse.getBezierControlPoint(initPos, finPos);
      expect(Utils.randint).calledWithExactly(10, 20);
    });
    it("custom deviation can be passed in options", async () => {
      BezMouse.getBezierControlPoint(initPos, finPos, { deviation: 100 });
      expect(Utils.randint).calledWithExactly(50, 100);
    });
    it("can flip the reference point of the curve in options to use initPos (by default uses finPos)", async () => {
      const point = BezMouse.getBezierControlPoint(initPos, finPos, {
        flip: true,
      });
      expect(point).eql([148, 148]);
    });
  });
});
