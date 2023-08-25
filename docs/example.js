import BezierMouse from "../src/BezierMouse.js";

console.log({ BezierMouse });
const BezMouse = new BezierMouse();

let cvs = document.getElementById("CurveCanvas");
let context = cvs.getContext("2d");
const initPos = [100, 100];
const finPos = [600, 600];
const deviation = 5;

const curve = BezMouse.cubicBezierCurve(initPos, finPos, deviation);
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
