const chai = require("chai");
const expect = require("chai").expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const { mouse, Button } = require("@nut-tree/nut-js");
const BezierMouse = require("../src/BezierMouse.js");
const Utils = require("../src/Utils.js");

describe("BezierMouse", () => {
  let BezMouse, initPos, finPos, deviation;
  beforeEach(async () => {
    BezMouse = new BezierMouse();
    initPos = { x: 100, y: 100 };
    finPos = { x: 600, y: 600 };
    deviation = 20;
  });
  describe("moveAndClick", () => {
    beforeEach(async () => {
      sinon.stub(mouse, "move").resolves();
      sinon.stub(mouse, "click").resolves();
    });
    afterEach(async () => {
      mouse.move.restore();
      mouse.click.restore();
    });
    it("moves the mouse to position", async () => {
      await BezMouse.moveAndClick(initPos, finPos);
      expect(mouse.move).calledOnce;
    });
    it("then clicks (default LEFT click)", async () => {
      await BezMouse.moveAndClick(initPos, finPos);
      expect(mouse.click).calledWith(Button.LEFT);
    });
    it("can use a different button to click", async () => {
      await BezMouse.moveAndClick(initPos, finPos, "RIGHT");
      expect(mouse.click).calledWith(Button.RIGHT);
    });
  });

  describe("moveAndDoubleClick", () => {
    beforeEach(async () => {
      sinon.stub(mouse, "move").resolves();
      sinon.stub(mouse, "doubleClick").resolves();
    });
    afterEach(async () => {
      mouse.move.restore();
      mouse.doubleClick.restore();
    });
    it("moves the mouse to position", async () => {
      await BezMouse.moveAndDoubleClick(initPos, finPos);
      expect(mouse.move).calledOnce;
    });
    it("then double-clicks (default LEFT click)", async () => {
      await BezMouse.moveAndDoubleClick(initPos, finPos);
      expect(mouse.doubleClick).calledWith(Button.LEFT);
    });
    it("can use a different button to click", async () => {
      await BezMouse.moveAndDoubleClick(initPos, finPos, "RIGHT");
      expect(mouse.doubleClick).calledWith(Button.RIGHT);
    });
  });

  describe("move", () => {
    beforeEach(async () => {
      sinon.spy(Utils, "randint");
      sinon.stub(mouse, "move").resolves();
    });
    afterEach(async () => {
      Utils.randint.restore();
      mouse.move.restore();
    });
    it("uses nut-js mouse movement to move the mouse along the generated bezier curve", async () => {
      await BezMouse.move(initPos, finPos);
      expect(mouse.move).calledOnce;
    });
    it("by default applies a slightly random deviation to the finish position", async () => {
      await BezMouse.move(initPos, finPos);
      expect(Utils.randint).callCount(6);
    });
    it("can use exact finish position coordinates by passing opts.preciseClick", async () => {
      await BezMouse.move(initPos, finPos, { preciseClick: true });
      expect(Utils.randint).callCount(4);
    });
  });

  describe("bezierCurveTo", () => {
    beforeEach(async () => {
      sinon.stub(BezMouse, "getBezierControlPoint").returns({ x: 12, y: 12 });
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
      sinon.stub(BezMouse, "getBezierControlPoint").returns({ x: 12, y: 12 });
    });
    afterEach(async () => {
      BezMouse.getBezierControlPoint.restore();
    });
    it("properly generates a random cubic bezier curve", async () => {
      const curve = BezMouse.cubicBezierCurve(initPos, finPos, deviation);
      expect(curve.points).eql([
        initPos,
        { x: 12, y: 12 },
        { x: 12, y: 12 },
        finPos,
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
      expect(point).eql({ x: 648, y: 648 });
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
      expect(point).eql({ x: 148, y: 148 });
    });
  });
  // usage example:
  // const BezierMouse = require("../src/BezierMouse.js");
  // (async () => {
  //   const bezMouse = new BezierMouse(75);
  //   await bezMouse.moveAndDoubleClick(
  //     { x: 100, y: 100 },
  //     { x: 700, y: 700 },
  //     "LEFT",
  //     {
  //       steps: 110,
  //       deviation: 45,
  //       flip: false,
  //     }
  //   );
  //   await bezMouse.moveAndDoubleClick({ x: 700, y: 700 }, { x: 150, y: 150 });
  // })();
});
