# bezier-mouse-js
bezier-mouse-js is a lightweight javascript library to mirror human-like mouse movements with [Bézier curves](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).

Documentation and Demos: [https://chrisdewolf.github.io/bezier-mouse-js-docs/](https://chrisdewolf.github.io/bezier-mouse-js-docs/)

Simple usage:
```
(async () => {
  const bezMouse = new BezierMouse();
  const initialPosition = [100, 100];
  const finalPosition = [700, 700];
  const deviation = 20;
  await bezMouse.move(initialPosition, finalPosition, deviation);
})();
```

Underlying mouse control framework:
https://nutjs.dev/
