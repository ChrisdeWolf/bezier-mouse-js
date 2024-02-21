# bezier-mouse-js
bezier-mouse-js is a lightweight javascript library to mirror human-like mouse movements with [Bézier curves](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).

## Getting Started

Install the [`bezier-mouse-js` package](https://www.npmjs.com/package/bezier-mouse-js):

```
npm install bezier-mouse-js
```

Simple usage:
```
const BezierMouse = require("../src/BezierMouse");

(async () => {
  const bezMouse = new BezierMouse();
  await bezMouse.moveAndClick([100, 100], [700, 700]);
  await bezMouse.moveAndDoubleClick([700, 700], [150, 150]);
})();
```

**[Documentation Here](https://chrisdewolf.github.io/bezier-mouse-js/module-BezierMouse.html)**

**[Demos Here](https://chrisdewolf.github.io/bezier-mouse-js-docs/)**

Advanced usage:
```
const BezierMouse = require("../src/BezierMouse");

(async () => {
  const bezMouse = new BezierMouse(75);
  await bezMouse.moveAndClick([100, 100], [700, 700]);
  await bezMouse.moveAndDoubleClick([700, 700], [150, 150], "LEFT", { steps: 110, deviation: 45, preciseClick: true });
})();
```

Underlying mouse control framework:
https://nutjs.dev/
