# bezier-mouse-js
bezier-mouse-js is a lightweight javascript library to mirror human-like mouse movements with [Bézier curves](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).

**[Documentation Here](https://chrisdewolf.github.io/bezier-mouse-js/module-BezierMouse.html)**

**[Demos Here](https://chrisdewolf.github.io/bezier-mouse-js-docs/)**

Simple usage:
```
(async () => {
  const bezMouse = new BezierMouse();
  await bezMouse.move([100, 100], [700, 700]);
})();
```

Underlying mouse control framework:
https://nutjs.dev/
