import { Bezier } from "bezier-js";
import utils from "./utils.js";
import type { Point, BezierMouseOptions, ClickType } from "./types.js";

const { abs, ceil } = Math;

type NutJsModule = typeof import("@nut-tree/nut-js");

export class BezierMouse {
  private mouseSpeed: number;
  private nutJsModule: NutJsModule | null = null;

  constructor(mouseSpeed: number = 100) {
    this.mouseSpeed = mouseSpeed;
  }

  private async getNutJs(): Promise<NutJsModule> {
    if (!this.nutJsModule) {
      try {
        this.nutJsModule = await import("@nut-tree/nut-js");
        this.nutJsModule.mouse.config.mouseSpeed = this.mouseSpeed;
      } catch {
        throw new Error(
          "bezier-mouse-js: @nut-tree/nut-js is required for mouse control methods. " +
            "Install it with: npm install @nut-tree/nut-js"
        );
      }
    }
    return this.nutJsModule;
  }

  async moveAndClick(
    initPos: Point,
    finPos: Point,
    clickType: ClickType = "LEFT",
    opts: BezierMouseOptions = {}
  ): Promise<void> {
    const nut = await this.getNutJs();
    await this.move(initPos, finPos, opts);
    await nut.mouse.click(nut.Button[clickType]);
  }

  async moveAndDoubleClick(
    initPos: Point,
    finPos: Point,
    clickType: ClickType = "LEFT",
    opts: BezierMouseOptions = {}
  ): Promise<void> {
    const nut = await this.getNutJs();
    await this.move(initPos, finPos, opts);
    await nut.mouse.doubleClick(nut.Button[clickType]);
  }

  async move(
    initPos: Point,
    finPos: Point,
    opts: BezierMouseOptions = {}
  ): Promise<void> {
    const nut = await this.getNutJs();
    let finishPosition = finPos;
    if (!opts.preciseClick) {
      const deviation = 5;
      const randDeviation = () => utils.randint(deviation / 2, deviation);
      const region = new nut.Region(
        finPos.x,
        finPos.y,
        randDeviation(),
        randDeviation()
      );
      finishPosition = await nut.randomPointIn(region);
    }
    const path = this.bezierCurveTo(initPos, finishPosition, opts);
    const nutPoints = path.map((p) => new nut.Point(p.x, p.y));
    await nut.mouse.move(nutPoints);
  }

  bezierCurveTo(
    initPos: Point,
    finPos: Point,
    opts: BezierMouseOptions = {}
  ): Point[] {
    const curve = this.cubicBezierCurve(initPos, finPos, opts);
    const LUT = curve.getLUT(opts.steps || 100);
    return LUT.map((point) => ({ x: point.x, y: point.y }));
  }

  cubicBezierCurve(
    initPos: Point,
    finPos: Point,
    opts: BezierMouseOptions = {}
  ): Bezier {
    const cntlPt1 = this.getBezierControlPoint(initPos, finPos, opts);
    const cntlPt2 = this.getBezierControlPoint(initPos, finPos, opts);
    return new Bezier([initPos, cntlPt1, cntlPt2, finPos]);
  }

  getBezierControlPoint(
    initPos: Point,
    finPos: Point,
    opts: BezierMouseOptions = {}
  ): Point {
    const { deviation = 20, flip = false } = opts;
    const deltaX = abs(ceil(finPos.x) - ceil(initPos.x));
    const deltaY = abs(ceil(finPos.y) - ceil(initPos.y));
    const randDeviation = () => utils.randint(deviation / 2, deviation);
    const refPointX = flip ? initPos.x : finPos.x;
    const refPointY = flip ? initPos.y : finPos.y;
    return {
      x: refPointX + utils.choice([-1, 1]) * deltaX * 0.01 * randDeviation(),
      y: refPointY + utils.choice([-1, 1]) * deltaY * 0.01 * randDeviation(),
    };
  }
}
