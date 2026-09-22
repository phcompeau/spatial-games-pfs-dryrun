var m = require("./model.js");
function seeded(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
var SIZE = 101;
console.log("Cooperator share after 200 generations, random start with 10% defectors");
console.log("   b    seed42  seed7  seed99   verdict");
[1.1,1.2,1.3,1.4,1.5,1.55,1.6,1.7,1.75,1.8,1.85,1.99,2.0,2.1,2.2,2.5].forEach(function (b) {
  var out = [42,7,99].map(function (sd) {
    var g = m.randomGrid(SIZE, 0.10, seeded(sd));
    for (var t = 0; t < 200; t++) g = m.stepGrid(g, b);
    return m.cooperatorShare(g);
  });
  var avg = (out[0]+out[1]+out[2])/3;
  var verdict = avg > 0.999 ? "cooperators take over" : avg > 0.6 ? "cooperators dominate" : avg > 0.15 ? "coexistence" : avg > 0.001 ? "defectors dominate" : "defectors take over";
  console.log(("    "+b.toFixed(2)).slice(-6) + out.map(function(x){return ("       "+(100*x).toFixed(1)).slice(-7);}).join("") + "   " + verdict);
});
