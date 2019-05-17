var Linter = require("../../lib/linter"),
    fs = require("fs");

var config = require("../../conf/eslint-recommended");

var large = fs.readFileSync(__dirname + "/large.js", "utf8"),
    medium = fs.readFileSync(__dirname + "/medium.js", "utf8"),
    small = fs.readFileSync(__dirname + "/small.js", "utf8");

var runs = {
    large: large,
    medium: medium,
    small: small
};
var linter = new Linter();

benchmark.runs = runs;
benchmark(Boolean, 1);

function benchmark(grep, times) {
    console.profile("all");
    for(var key in runs) {
        if(grep(key)) {
            console.time(key);
            console.profile(key);
            run(runs[key], times);
            console.profileEnd(key);
            console.timeEnd(key);
        }
    }
    console.profileEnd("all");
}

function run(content, times) {
    while(times--) {
        linter.verify(content, config);
    }
}
