// The rules of the game, kept on their own so they are easy to check.
// A square is either a cooperator ("C") or a defector ("D").

var COOPERATOR = "C";
var DEFECTOR = "D";

// One round between two squares. Returns the points MINE collects.
function payoff(mine, theirs, b) {
  if (mine === COOPERATOR && theirs === COOPERATOR) return 1;
  if (mine === COOPERATOR && theirs === DEFECTOR) return 0;
  if (mine === DEFECTOR && theirs === COOPERATOR) return b;
  return 0; // defector meeting a defector
}

// The squares a cell plays: the 8 squares touching it, plus itself.
// Squares on the edge simply have fewer neighbors.
function opponents(grid, row, col) {
  var found = [];
  var rows = grid.length;
  var cols = grid[0].length;
  for (var dr = -1; dr <= 1; dr++) {
    for (var dc = -1; dc <= 1; dc++) {
      var r = row + dr;
      var c = col + dc;
      if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
      found.push(grid[r][c]);
    }
  }
  return found;
}

// A square's score for this generation: one round against each opponent,
// including itself, added up.
// Counted first, multiplied once, so two squares in the same situation get
// bit-for-bit identical scores and a tie stays a tie.
function scoreCell(grid, row, col, b) {
  var mine = grid[row][col];
  var theirs = opponents(grid, row, col);
  var cooperatorsFaced = 0;
  for (var i = 0; i < theirs.length; i++) {
    if (theirs[i] === COOPERATOR) cooperatorsFaced++;
  }
  if (mine === COOPERATOR) return cooperatorsFaced * 1;
  return cooperatorsFaced * b;
}

var SpatialRules = { COOPERATOR: COOPERATOR, DEFECTOR: DEFECTOR, payoff: payoff, opponents: opponents, scoreCell: scoreCell };
if (typeof window !== "undefined") window.SpatialRules = SpatialRules;
if (typeof module !== "undefined") {
  module.exports = { COOPERATOR: COOPERATOR, DEFECTOR: DEFECTOR, payoff: payoff, opponents: opponents, scoreCell: scoreCell };
}
