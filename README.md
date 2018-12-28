# `reaction-diffusion`

> A reaction-diffusion system using the [Gray Scott model](http://www.karlsims.com/rd.html)

## Usage

`reaction-diffusion` exports a single class, `ReactionDiffusion` which is instantiated with the paramters for the system.

```js
import ReactionDiffusion from "reaction-diffusion";
// Or if you're not using ES6 modules:
// const ReactionDefault = require("reaction-diffusion").default;

// Size of the grid
const size = 200;
// Diffusion rates
const diffuseA = 1.0;
const diffuseB = 0.5;
const feedRate = 0.055;
const killRate = 0.062;

const diffusion = new ReactionDiffusion(
  size,
  diffuseA,
  diffuseB,
  feedRate,
  killRate
);
```

To fill the grid with some starting "chemicals" use the `fill` method.

This would fill a rectangle at coordinates (50, 150) that is 10 pixels wide and 20 pixels tall.

```js
diffusion.fill(50, 150, 10, 20)
```

Now you need to manually call the `tick` method so that it processes the next step in the reaction-diffusion process. This is something you'd usually do within your `requestAnimationFrame` calback before using any of the values

```js
diffusion.tick()
```

The sytem is accessible via the `grid` property, which is a square grid of `size` width and `size` height. It's an array of arrays, so to access the cell at (50, 150) you would do:

```js
diffusion.grid[50][150]
```

Each cell is an object with an `a` and `b` property, which will be bewteen `0` and `1`. The system is setup so that `b` is the starting chemical and will diffuse into `a`.