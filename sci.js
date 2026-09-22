var m = require("./model.js");
function seeded(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
var SIZE = 101, GENS = 200;
console.log("Random start, 10% defectors, " + SIZE + "x" + SIZE + ", cooperator share by generation");
console.log("   b      g0     g10    g25    g50   g100   g200");
[1.6, 1.7, 1.8, 1.85, 1.9, 1.95, 2.0, 2.05].forEach(function (b) {
  var g = m.randomGrid(SIZE, 0.10, seeded(42));
  var row = [m.cooperatorShare(g)];
  for (var t = 1; t <= GENS; t++) {
    g = m.stepGrid(g, b);
    if (t === 10 || t === 25 || t === 50 || t === 100 || t === 200) row.push(m.cooperatorShare(g));
  }
  console.log(("    " + b.toFixed(2)).slice(-6) + row.map(function (x) { return ("      " + (100 * x).toFixed(1)).slice(-7); }).join(""));
});
