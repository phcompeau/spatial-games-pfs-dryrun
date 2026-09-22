var m = require("./model.js");
var C = m.COOPERATOR, D = m.DEFECTOR;
var passed = 0, failed = 0;
function ok(what, condition, detail) {
  console.log((condition ? "PASS  " : "FAIL  ") + what + (detail ? "\n        " + detail : ""));
  if (condition) passed++; else failed++;
}
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
var b = 1.85;

// 1. An all-cooperator grid must never change, whatever b is.
var allC = m.uniformGrid(7, C);
ok("all cooperators stay all cooperators at b = 1.85", same(m.stepGrid(allC, 1.85), allC));
ok("all cooperators stay all cooperators at b = 2.5", same(m.stepGrid(allC, 2.5), allC));
ok("all defectors stay all defectors", same(m.stepGrid(m.uniformGrid(7, D), b), m.uniformGrid(7, D)));

// 2. The one step Phillip can do on paper: a lone defector in a 5x5 grid.
// The defector scores 8b = 14.8. Its 8 neighbors are interior cooperators
// facing one defector, so each scores 8. Everyone touching the defector is
// beaten by it and flips, and nobody else is, so we get a 3x3 block.
var lone = m.singleDefectorGrid(5);
var after = m.stepGrid(lone, b);
var expected = [
  [C, C, C, C, C],
  [C, D, D, D, C],
  [C, D, D, D, C],
  [C, D, D, D, C],
  [C, C, C, C, C]
];
ok("one lone defector becomes a 3x3 block of defectors after one step", same(after, expected),
   "before:\n" + m.render(lone).split("\n").join("\n        ") + "\n        after:\n" + m.render(after).split("\n").join("\n        "));

// 3. Scores come from the OLD grid, all at once. If the code updated square by
// square, the top-left neighbor would already be a defector when the next
// square looked at it, and the block would come out lopsided. A symmetric
// start must stay symmetric.
function symmetric(grid) {
  var n = grid.length;
  for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
    if (grid[i][j] !== grid[j][i]) return false;              // main diagonal
    if (grid[i][j] !== grid[n - 1 - i][j]) return false;      // top to bottom
    if (grid[i][j] !== grid[i][n - 1 - j]) return false;      // left to right
  }
  return true;
}
var g = m.singleDefectorGrid(31);
var stillSymmetric = true;
for (var t = 0; t < 12; t++) { g = m.stepGrid(g, b); if (!symmetric(g)) { stillSymmetric = false; break; } }
ok("a single defector stays perfectly symmetric for 12 generations (the kaleidoscope)", stillSymmetric,
   "generations run: " + (stillSymmetric ? 12 : t + 1));

// 4. A defector too weak to beat its neighbors must not spread.
// At b = 1.05 a lone defector scores 8 * 1.05 = 8.4 against neighbors scoring
// 8, so it still wins. At b = 1.0 it scores exactly 8, a tie, and the tie rule
// says nobody flips.
ok("at b = 1.0 the lone defector ties its neighbors and nothing moves", same(m.stepGrid(m.singleDefectorGrid(5), 1.0), m.singleDefectorGrid(5)));

// 5. A single cooperator among defectors: it scores 1 (itself), every defector
// neighbor scores b, so the cooperator is beaten and vanishes.
var loneC = m.uniformGrid(5, D); loneC[2][2] = C;
ok("a single cooperator among defectors is wiped out in one step", same(m.stepGrid(loneC, b), m.uniformGrid(5, D)));

// 6. Edges: a 1x1 grid has nothing to copy and must never change.
ok("a 1x1 cooperator grid never changes", same(m.stepGrid([[C]], b), [[C]]));
ok("a 1x1 defector grid never changes", same(m.stepGrid([[D]], b), [[D]]));

// 7. scoreGrid must agree with scoring each cell on its own.
var rules = require("./rules.js");
var mixed = m.randomGrid(9, 0.3, (function () { var s = 1; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; })());
var scores = m.scoreGrid(mixed, b);
var agrees = true;
for (var i = 0; i < 9; i++) for (var j = 0; j < 9; j++) if (scores[i][j] !== rules.scoreCell(mixed, i, j, b)) agrees = false;
ok("scoring the whole grid agrees with scoring every square one at a time", agrees);

// 8. The step must not modify the grid it was given.
var before = m.singleDefectorGrid(5);
var copy = JSON.parse(JSON.stringify(before));
m.stepGrid(before, b);
ok("stepping the grid leaves the old grid untouched", same(before, copy));

console.log("\n" + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
