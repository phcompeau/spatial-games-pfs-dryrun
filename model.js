// The model: score every square, then update every square at the same moment.

var R = (typeof require !== "undefined") ? require("./rules.js") : window.SpatialRules;
var COOPERATOR = R.COOPERATOR;
var DEFECTOR = R.DEFECTOR;

// Every square's score for this generation, from the grid as it stands now.
function scoreGrid(grid, b) {
  var scores = [];
  for (var row = 0; row < grid.length; row++) {
    scores.push([]);
    for (var col = 0; col < grid[0].length; col++) {
      scores[row].push(R.scoreCell(grid, row, col, b));
    }
  }
  return scores;
}

// One generation. Every square looks at itself and its 8 neighbors in the OLD
// grid and copies whoever scored highest. A tie leaves a square alone: a
// neighbor only flips it by scoring strictly higher.
// When two neighbors tie for the highest score but play different strategies,
// the tie is settled by strategy (by default the defector wins), never by
// which neighbor the loop happened to reach first. Settling it by loop order
// would make the outcome depend on the direction we scan the grid, which
// breaks the symmetry of a symmetric starting grid.
function stepGrid(grid, b, options) {
  var defectorWinsTies = !(options && options.cooperatorWinsTies);
  var scores = scoreGrid(grid, b);
  var next = [];
  var rows = grid.length;
  var cols = grid[0].length;
  for (var row = 0; row < rows; row++) {
    next.push([]);
    for (var col = 0; col < cols; col++) {
      var bestScore = scores[row][col];
      var bestStrategy = grid[row][col];
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          var r = row + dr, c = col + dc;
          if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
          if (r === row && c === col) continue;
          if (scores[r][c] > bestScore) {
            bestScore = scores[r][c];
            bestStrategy = grid[r][c];
          } else if (scores[r][c] === bestScore && grid[r][c] !== bestStrategy && bestStrategy !== grid[row][col]) {
            // Another square ties the best challenger so far with the other
            // strategy. Settle it by strategy, not by scan order.
            bestStrategy = defectorWinsTies ? DEFECTOR : COOPERATOR;
          }
        }
      }
      next[row].push(bestStrategy);
    }
  }
  return next;
}

function uniformGrid(size, who) {
  var g = [];
  for (var i = 0; i < size; i++) { g.push([]); for (var j = 0; j < size; j++) g[i].push(who); }
  return g;
}
function singleDefectorGrid(size) {
  var g = uniformGrid(size, COOPERATOR);
  var mid = Math.floor(size / 2);
  g[mid][mid] = DEFECTOR;
  return g;
}
function randomGrid(size, defectorFraction, random) {
  random = random || Math.random;
  var g = [];
  for (var i = 0; i < size; i++) {
    g.push([]);
    for (var j = 0; j < size; j++) g[i].push(random() < defectorFraction ? DEFECTOR : COOPERATOR);
  }
  return g;
}
function cooperatorShare(grid) {
  var n = 0, total = 0;
  for (var i = 0; i < grid.length; i++) for (var j = 0; j < grid[0].length; j++) { total++; if (grid[i][j] === COOPERATOR) n++; }
  return n / total;
}
function render(grid) {
  var out = [];
  for (var i = 0; i < grid.length; i++) out.push(grid[i].join(" "));
  return out.join("\n");
}

var SpatialModel = { scoreGrid: scoreGrid, stepGrid: stepGrid, uniformGrid: uniformGrid, singleDefectorGrid: singleDefectorGrid, randomGrid: randomGrid, cooperatorShare: cooperatorShare, render: render, COOPERATOR: COOPERATOR, DEFECTOR: DEFECTOR };
if (typeof window !== "undefined") window.SpatialModel = SpatialModel;
if (typeof module !== "undefined") {
  module.exports = { scoreGrid: scoreGrid, stepGrid: stepGrid, uniformGrid: uniformGrid, singleDefectorGrid: singleDefectorGrid, randomGrid: randomGrid, cooperatorShare: cooperatorShare, render: render, COOPERATOR: COOPERATOR, DEFECTOR: DEFECTOR };
}
