import BezierMouse from "../src/BezierMouse.js";

const BezMouse = new BezierMouse();

const initPos = [100, 100];
const finPos = [600, 600];
const deviation = 20;
const curve = BezMouse.cubicBezierCurve(initPos, finPos, deviation);

let cvs = document.getElementById("CurveCanvas");
let context = cvs.getContext("2d");
context.lineWidth = 3;
context.beginPath();
const [init, control0, control1, fin] = curve.points;
context.strokeText(".", init.x, init.y);
context.strokeText("x", control0.x, control0.y);
context.strokeText("x", control1.x, control1.y);
context.strokeText(".", fin.x, fin.y);
context.moveTo(init.x, init.y);
context.bezierCurveTo(
  control0.x,
  control0.y,
  control1.x,
  control1.y,
  fin.x,
  fin.y
);
context.stroke();
