var r = require("./rules.js");
var C = r.COOPERATOR, D = r.DEFECTOR;
var passed = 0, failed = 0;

function check(what, expected, actual) {
  var ok = Math.abs(expected - actual) < 1e-12;
  console.log((ok ? "PASS  " : "FAIL  ") + what + "\n        expected " + expected + ", got " + actual);
  if (ok) passed++; else failed++;
}
function uniform(n, who) {
  var g = [];
  for (var i = 0; i < n; i++) { g.push([]); for (var j = 0; j < n; j++) g[i].push(who); }
  return g;
}

var b = 1.85;

// The four single rounds, straight from the spec.
check("two cooperators meet: each gets 1", 1, r.payoff(C, C, b));
check("cooperator meets defector: cooperator gets nothing", 0, r.payoff(C, D, b));
check("defector meets cooperator: defector takes b", b, r.payoff(D, C, b));
check("two defectors meet: nobody gets anything", 0, r.payoff(D, D, b));

// Opponent counts, which is where the self game and the edges live.
check("an interior square plays 9 opponents", 9, r.opponents(uniform(5, C), 2, 2).length);
check("an edge square plays 6 opponents", 6, r.opponents(uniform(5, C), 0, 2).length);
check("a corner square plays 4 opponents", 4, r.opponents(uniform(5, C), 0, 0).length);

// The two checks Phillip named in the spec.
check("cooperator among cooperators scores 9", 9, r.scoreCell(uniform(5, C), 2, 2, b));
var lone = uniform(5, C); lone[2][2] = D;
check("lone defector among cooperators scores 8b", 8 * b, r.scoreCell(lone, 2, 2, b));

// Independently computable mixed case: 3 cooperator neighbors, 5 defector
// neighbors, the center is a cooperator, so it scores 3 + 1 for itself = 4.
var mixed = [[C, C, C], [D, C, D], [D, D, D]];
check("cooperator facing 3 cooperators plus itself scores 4", 4, r.scoreCell(mixed, 1, 1, b));
// Same grid, the defector at (1,0) sits on the left edge, so it plays only
// 6 squares: (0,0) (0,1) (1,0) (1,1) (2,0) (2,1). Three of those are
// cooperators, so it scores 3b.
check("that grid's left-edge defector scores 3b", 3 * b, r.scoreCell(mixed, 1, 0, b));

// Edges and degenerate sizes.
check("cooperator in a corner of an all-cooperator grid scores 4", 4, r.scoreCell(uniform(5, C), 0, 0, b));
check("a defector in an all-defector grid scores 0", 0, r.scoreCell(uniform(5, D), 2, 2, b));
check("a 1x1 cooperator plays only itself and scores 1", 1, r.scoreCell([[C]], 0, 0, b));
check("a 1x1 defector has nobody to exploit and scores 0", 0, r.scoreCell([[D]], 0, 0, b));
// b must not leak into the cooperator's arithmetic.
check("cooperator's score does not depend on b", 9, r.scoreCell(uniform(5, C), 2, 2, 999));
// Ties must be bit-for-bit, not approximately: two identical lone defectors
// on separate grids must score exactly the same number.
var a1 = uniform(5, C); a1[2][2] = D;
var a2 = uniform(7, C); a2[3][3] = D;
console.log((r.scoreCell(a1,2,2,b) === r.scoreCell(a2,3,3,b) ? "PASS  " : "FAIL  ") + "two identical lone defectors score bit-for-bit the same\n        " + r.scoreCell(a1,2,2,b) + " === " + r.scoreCell(a2,3,3,b));
if (r.scoreCell(a1,2,2,b) === r.scoreCell(a2,3,3,b)) passed++; else failed++;

console.log("\n" + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
