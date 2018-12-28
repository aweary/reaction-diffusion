"use strict";
exports.__esModule = true;
function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}
var ReactionDiffusion = /** @class */ (function () {
    function ReactionDiffusion(size, diffuseA, diffuseB, killRate, feedRate) {
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
    ReactionDiffusion.prototype.seed = function () { };
    ReactionDiffusion.prototype.fill = function (sx, sy, width, height) {
        for (var x = sx; x < sx + width; x++) {
            for (var y = sy; y < sy + height; y++) {
                var cell = this.grid[x][y];
                if (cell.b > 0.2) {
                    cell.b = 0;
                    cell.a = 1;
                }
                else {
                    cell.b = 1;
                    cell.a = 0;
                }
            }
        }
    };
    ReactionDiffusion.prototype.laplaceA = function (x, y) {
        var grid = this.grid;
        var a1 = 0.2;
        var a2 = 0.05;
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
    };
    ReactionDiffusion.prototype.laplaceB = function (x, y) {
        var grid = this.grid;
        var sumB = 0;
        var b1 = 0.2;
        var b2 = 0.05;
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
    };
    ReactionDiffusion.prototype.initialize = function () {
        var _a = this, grid = _a.grid, next = _a.next, size = _a.size;
        for (var x = 0; x < size; x++) {
            grid[x] = [];
            next[x] = [];
            for (var y = 0; y < size; y++) {
                grid[x][y] = { a: 1, b: 0 };
                next[x][y] = { a: 1, b: 0 };
            }
        }
    };
    ReactionDiffusion.prototype.tick = function () {
        var _a = this, size = _a.size, grid = _a.grid, next = _a.next, killRate = _a.killRate, feedRate = _a.feedRate, diffuseA = _a.diffuseA, diffuseB = _a.diffuseB;
        for (var x = 1; x < size - 1; x++) {
            for (var y = 1; y < size - 1; y++) {
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
    };
    ReactionDiffusion.prototype.swap = function () {
        var tmp = this.grid;
        this.grid = this.next;
        this.next = tmp;
    };
    return ReactionDiffusion;
}());
exports["default"] = ReactionDiffusion;
