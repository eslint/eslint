var eslint = require("../../lib/eslint"),
    fs = require("fs");

var config = require("../../conf/eslint.json");

var large = fs.readFileSync(__dirname + "/large.js", "utf8"), 
    medium = fs.readFileSync(__dirname + "/medium.js", "utf8"),
    small = fs.readFileSync(__dirname + "/small.js", "utf8");

var runs = {
    large: large,
    medium: medium,
    small: small
};

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
        eslint.reset();
        eslint.verify(content, config);
    }
}
