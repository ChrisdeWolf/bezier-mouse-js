# bezier-mouse-js
bezier-mouse-js is a lightweight javascript library to mirror human-like mouse movements with [Bézier curves](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).

## Getting Started

Install the [`bezier-mouse-js` package](https://www.npmjs.com/package/bezier-mouse-js):

```
npm install bezier-mouse-js
```

Simple usage:
```
const BezierMouse = require("bezier-mouse-js");

(async () => {
  const bezMouse = new BezierMouse();
  await bezMouse.moveAndClick({ x: 100, y: 100 }, { x: 700, y: 700 });
  await bezMouse.moveAndDoubleClick({ x: 700, y: 700 }, { x: 100, y: 100 });
})();
```

**[Documentation Here](https://chrisdewolf.github.io/bezier-mouse-js/module-BezierMouse.html)**

**[Demos Here](https://chrisdewolf.github.io/bezier-mouse-js-docs/)**

Advanced usage:
```
const BezierMouse = require("bezier-mouse-js");

(async () => {
  const bezMouse = new BezierMouse(75);
  await bezMouse.moveAndDoubleClick(
    { x: 100, y: 100 },
    { x: 700, y: 700 },
    "LEFT",
    { steps: 110, deviation: 45, flip: false }
  );
  await bezMouse.moveAndDoubleClick({ x: 700, y: 700 }, { x: 150, y: 150 });
})();
```

Underlying mouse control framework:
https://nutjs.dev/
