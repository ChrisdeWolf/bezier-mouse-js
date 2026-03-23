import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { BezierMouse } from "../src/BezierMouse.js";
import utils from "../src/utils.js";

const { expect } = chai;
chai.use(sinonChai);

function createNutJsMock() {
  return {
    mouse: {
      move: sinon.stub().resolves(),
      click: sinon.stub().resolves(),
      doubleClick: sinon.stub().resolves(),
      config: { mouseSpeed: 100 },
    },
    Button: { LEFT: 0, MIDDLE: 1, RIGHT: 2 } as Record<string, number>,
    Point: class {
      constructor(public x: number, public y: number) {}
    },
    Region: class {
      constructor(
        public left: number,
        public top: number,
        public width: number,
        public height: number
      ) {}
    },
    randomPointIn: sinon.stub().resolves({ x: 605, y: 605 }),
  };
}

describe("BezierMouse", () => {
  let bezMouse: BezierMouse;
  let initPos: { x: number; y: number };
  let finPos: { x: number; y: number };

  beforeEach(() => {
    bezMouse = new BezierMouse();
    initPos = { x: 100, y: 100 };
    finPos = { x: 600, y: 600 };
  });

  describe("moveAndClick", () => {
    let mockNut: ReturnType<typeof createNutJsMock>;

    beforeEach(() => {
      mockNut = createNutJsMock();
      (bezMouse as any).getNutJs = sinon.stub().resolves(mockNut);
    });

    it("moves the mouse to position", async () => {
      await bezMouse.moveAndClick(initPos, finPos);
      expect(mockNut.mouse.move).to.have.been.calledOnce;
    });

    it("then clicks (default LEFT click)", async () => {
      await bezMouse.moveAndClick(initPos, finPos);
      expect(mockNut.mouse.click).to.have.been.calledWith(
        mockNut.Button.LEFT
      );
    });

    it("can use a different button to click", async () => {
      await bezMouse.moveAndClick(initPos, finPos, "RIGHT");
      expect(mockNut.mouse.click).to.have.been.calledWith(
        mockNut.Button.RIGHT
      );
    });
  });

  describe("moveAndDoubleClick", () => {
    let mockNut: ReturnType<typeof createNutJsMock>;

    beforeEach(() => {
      mockNut = createNutJsMock();
      (bezMouse as any).getNutJs = sinon.stub().resolves(mockNut);
    });

    it("moves the mouse to position", async () => {
      await bezMouse.moveAndDoubleClick(initPos, finPos);
      expect(mockNut.mouse.move).to.have.been.calledOnce;
    });

    it("then double-clicks (default LEFT click)", async () => {
      await bezMouse.moveAndDoubleClick(initPos, finPos);
      expect(mockNut.mouse.doubleClick).to.have.been.calledWith(
        mockNut.Button.LEFT
      );
    });

    it("can use a different button to click", async () => {
      await bezMouse.moveAndDoubleClick(initPos, finPos, "RIGHT");
      expect(mockNut.mouse.doubleClick).to.have.been.calledWith(
        mockNut.Button.RIGHT
      );
    });
  });

  describe("move", () => {
    let mockNut: ReturnType<typeof createNutJsMock>;
    let randintSpy: sinon.SinonStub;

    beforeEach(() => {
      mockNut = createNutJsMock();
      (bezMouse as any).getNutJs = sinon.stub().resolves(mockNut);
      randintSpy = sinon.stub(utils, "randint").returns(3);
    });

    afterEach(() => {
      randintSpy.restore();
    });

    it("uses nut-js mouse movement to move the mouse along the generated bezier curve", async () => {
      await bezMouse.move(initPos, finPos);
      expect(mockNut.mouse.move).to.have.been.calledOnce;
    });

    it("by default applies a slightly random deviation to the finish position", async () => {
      await bezMouse.move(initPos, finPos);
      expect(utils.randint).to.have.callCount(6);
    });

    it("can use exact finish position coordinates by passing opts.preciseClick", async () => {
      await bezMouse.move(initPos, finPos, { preciseClick: true });
      expect(utils.randint).to.have.callCount(4);
    });
  });

  describe("bezierCurveTo", () => {
    beforeEach(() => {
      sinon
        .stub(bezMouse, "getBezierControlPoint")
        .returns({ x: 12, y: 12 });
    });

    afterEach(() => {
      (bezMouse.getBezierControlPoint as sinon.SinonStub).restore();
    });

    it("uses the generated bezier curve to create a Lookup Table (LUT) of Points on that curve (default is 100 points)", () => {
      const points = bezMouse.bezierCurveTo(initPos, finPos);
      expect(points).to.have.lengthOf(101);
    });

    it("if opts.steps provided, the LUT will contain steps+1 coordinates representing the coordinates from t=0 to t=1 at interval 1/steps", () => {
      const points = bezMouse.bezierCurveTo(initPos, finPos, { steps: 2 });
      expect(points).to.eql([
        { x: 100, y: 100 },
        { x: 96.5, y: 96.5 },
        { x: 600, y: 600 },
      ]);
    });
  });

  describe("cubicBezierCurve", () => {
    beforeEach(() => {
      sinon
        .stub(bezMouse, "getBezierControlPoint")
        .returns({ x: 12, y: 12 });
    });

    afterEach(() => {
      (bezMouse.getBezierControlPoint as sinon.SinonStub).restore();
    });

    it("properly generates a random cubic bezier curve", () => {
      const curve = bezMouse.cubicBezierCurve(initPos, finPos);
      expect(curve.points).to.eql([
        initPos,
        { x: 12, y: 12 },
        { x: 12, y: 12 },
        finPos,
      ]);
    });
  });

  describe("getBezierControlPoint", () => {
    let choiceStub: sinon.SinonStub;
    let randintStub: sinon.SinonStub;

    beforeEach(() => {
      choiceStub = sinon.stub(utils, "choice").returns(0.6);
      randintStub = sinon.stub(utils, "randint").returns(16);
    });

    afterEach(() => {
      choiceStub.restore();
      randintStub.restore();
    });

    it("returns a pseudo-random bezier control point based on the initial/end positions and the deviation", () => {
      const point = bezMouse.getBezierControlPoint(initPos, finPos);
      expect(point).to.eql({ x: 648, y: 648 });
    });

    it("default deviation is 20", () => {
      bezMouse.getBezierControlPoint(initPos, finPos);
      expect(utils.randint).to.have.been.calledWithExactly(10, 20);
    });

    it("custom deviation can be passed in options", () => {
      bezMouse.getBezierControlPoint(initPos, finPos, { deviation: 100 });
      expect(utils.randint).to.have.been.calledWithExactly(50, 100);
    });

    it("can flip the reference point of the curve in options to use initPos (by default uses finPos)", () => {
      const point = bezMouse.getBezierControlPoint(initPos, finPos, {
        flip: true,
      });
      expect(point).to.eql({ x: 148, y: 148 });
    });
  });

  describe("when @nut-tree/nut-js is not installed", () => {
    beforeEach(() => {
      (bezMouse as any).getNutJs = sinon.stub().rejects(
        new Error(
          "bezier-mouse-js: @nut-tree/nut-js is required for mouse control methods. " +
            "Install it with: npm install @nut-tree/nut-js"
        )
      );
    });

    it("moveAndClick throws a clear error", async () => {
      try {
        await bezMouse.moveAndClick(initPos, finPos);
        expect.fail("should have thrown");
      } catch (e: any) {
        expect(e.message).to.include("@nut-tree/nut-js is required");
      }
    });

    it("moveAndDoubleClick throws a clear error", async () => {
      try {
        await bezMouse.moveAndDoubleClick(initPos, finPos);
        expect.fail("should have thrown");
      } catch (e: any) {
        expect(e.message).to.include("@nut-tree/nut-js is required");
      }
    });

    it("move throws a clear error", async () => {
      try {
        await bezMouse.move(initPos, finPos);
        expect.fail("should have thrown");
      } catch (e: any) {
        expect(e.message).to.include("@nut-tree/nut-js is required");
      }
    });

    it("pure math methods still work without nut-js", () => {
      const point = bezMouse.getBezierControlPoint(initPos, finPos);
      expect(point).to.have.property("x");
      expect(point).to.have.property("y");
    });
  });
});
