var m = require("./model.js");
var rules = require("./rules.js");
var C = rules.COOPERATOR, D = rules.DEFECTOR;
function symmetric(g) {
  var n = g.length;
  for (var i=0;i<n;i++) for (var j=0;j<n;j++) {
    if (g[i][j]!==g[j][i] || g[i][j]!==g[n-1-i][j] || g[i][j]!==g[i][n-1-j]) return false;
  }
  return true;
}
// Scan-order tie-break: what a naive implementation writes.
function stepScanOrder(grid, b) {
  var s = m.scoreGrid(grid, b), rows = grid.length, cols = grid[0].length, next = [];
  for (var row=0; row<rows; row++) { next.push([]);
    for (var col=0; col<cols; col++) {
      var best = s[row][col], who = grid[row][col];
      for (var dr=-1;dr<=1;dr++) for (var dc=-1;dc<=1;dc++) {
        var r=row+dr,c=col+dc;
        if (r<0||r>=rows||c<0||c>=cols||(r===row&&c===col)) continue;
        if (s[r][c] > best) { best = s[r][c]; who = grid[r][c]; }
      }
      next[row].push(who);
    }
  }
  return next;
}
[["strategy tie-break (ours)", m.stepGrid], ["scan-order tie-break (naive)", stepScanOrder]].forEach(function (pair) {
  var g = m.singleDefectorGrid(101), firstBreak = null;
  for (var t=1; t<=45; t++) { g = pair[1](g, 1.85); if (!symmetric(g) && firstBreak === null) firstBreak = t; }
  console.log(pair[0] + ": symmetry " + (firstBreak === null ? "held all 45 generations" : "BROKE at generation " + firstBreak) + ", cooperators " + (100*m.cooperatorShare(g)).toFixed(1) + "%");
});
// Show the kaleidoscope small enough to read.
var g = m.singleDefectorGrid(21);
[1,2,3,6].forEach(function (target, idx) {
  while (g.__t === undefined) g.__t = 0;
});
g = m.singleDefectorGrid(21);
for (var t = 1; t <= 6; t++) {
  g = m.stepGrid(g, 1.85);
  if (t === 1 || t === 3 || t === 6) {
    console.log("\ngeneration " + t + " (21x21, b = 1.85), cooperators " + (100*m.cooperatorShare(g)).toFixed(1) + "%");
    console.log(m.render(g).replace(/C/g, ".").replace(/D/g, "#"));
  }
}
