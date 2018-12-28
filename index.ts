type Cell = { a: number; b: number };
type CellRow = Array<Cell>;
type CellGrid = Array<CellRow>;

function constrain(n: number, low: number, high: number): number {
  return Math.max(Math.min(n, high), low);
}

export default class ReactionDiffusion {
  grid: CellGrid;
  next: CellGrid;
  size: number;
  diffuseA: number;
  diffuseB: number;
  killRate: number;
  feedRate: number;
  constructor(
    size: number,
    diffuseA: number,
    diffuseB: number,
    killRate: number,
    feedRate: number
  ) {
    this.grid = [];
    this.next = [];
    this.size = size;
    this.diffuseA = diffuseA;
    this.diffuseB = diffuseB;
    this.killRate = killRate;
    this.feedRate = feedRate;
    // Populate the grid
    this.initialize();
    this.seed();
  }

  seed() {}

  fill(sx: number, sy: number, width: number, height: number): void {
    for (let x = sx; x < sx + width; x++) {
      for (let y = sy; y < sy + height; y++) {
        let cell = this.grid[x][y];
        if (cell.b > 0.2) {
          cell.b = 0;
          cell.a = 1;
        } else {
          cell.b = 1;
          cell.a = 0;
        }
      }
    }
  }

  laplaceA(x: number, y: number): number {
    let { grid } = this;
    let a1 = 0.2;
    let a2 = 0.05;
    var sumA = 0;
    sumA += grid[x][y].a * -1;
    sumA += grid[x - 1][y].a * a1;
    sumA += grid[x + 1][y].a * a1;
    sumA += grid[x][y + 1].a * a1;
    sumA += grid[x][y - 1].a * a1;
    sumA += grid[x - 1][y - 1].a * a2;
    sumA += grid[x + 1][y - 1].a * a2;
    sumA += grid[x + 1][y + 1].a * a2;
    sumA += grid[x - 1][y + 1].a * a2;
    return sumA;
  }

  laplaceB(x: number, y: number): number {
    let { grid } = this;
    var sumB = 0;
    let b1 = 0.2;
    let b2 = 0.05;
    sumB += grid[x][y].b * -1;
    sumB += grid[x - 1][y].b * b1;
    sumB += grid[x + 1][y].b * b1;
    sumB += grid[x][y + 1].b * b1;
    sumB += grid[x][y - 1].b * b1;
    sumB += grid[x - 1][y - 1].b * b2;
    sumB += grid[x + 1][y - 1].b * b2;
    sumB += grid[x + 1][y + 1].b * b2;
    sumB += grid[x - 1][y + 1].b * b2;
    return sumB;
  }

  initialize(): void {
    let { grid, next, size } = this;
    for (let x = 0; x < size; x++) {
      grid[x] = [];
      next[x] = [];
      for (let y = 0; y < size; y++) {
        grid[x][y] = { a: 1, b: 0 };
        next[x][y] = { a: 1, b: 0 };
      }
    }
  }

  tick() {
    let { size, grid, next, killRate, feedRate, diffuseA, diffuseB } = this;
    for (let x = 1; x < size - 1; x++) {
      for (let y = 1; y < size - 1; y++) {
        var a = grid[x][y].a;
        var b = grid[x][y].b;
        next[x][y].a =
          a + (diffuseA * this.laplaceA(x, y) - a * b * b + feedRate * (1 - a));
        next[x][y].b =
          b +
          (diffuseB * this.laplaceB(x, y) +
            a * b * b -
            (killRate + feedRate) * b);
        next[x][y].a = constrain(next[x][y].a, 0, 1);
        next[x][y].b = constrain(next[x][y].b, 0, 1);
      }
    }
  }

  swap() {
    let tmp = this.grid;
    this.grid = this.next;
    this.next = tmp;
  }
}
