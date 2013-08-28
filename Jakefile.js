/**
 * @fileoverview Build file for ESLint. You must have Jake installed to use
 * this. You can install Jake via npm i -g jake.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var jake   = require("jake");
var config = require("./conf/eslint.json");
var eslint = require("./lib/eslint"),
    fs = require("fs"),
    path = require("path"),
    existsSync = fs.existsSync || path.existsSync;

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var ISTANBUL_CLI    = "./node_modules/istanbul/lib/cli.js",
    VOWS_CLI        = "./node_modules/vows/bin/vows",
    JSHINT_CLI      = "node_modules/jshint/bin/jshint",
    ESLINT_CLI      = "./bin/eslint",
    ESLINT_CONFIG   = "./tests/eslint.json",
    COVERAGE_THRESHOLDS = "--statement 90 --branch 90 --function 90",
    LINTABLE_FILES  = (new jake.FileList().include("package.json").include("./conf/*.json").include("lib")).toArray().join(" ").replace(/\\/g, "/"),
    ESLINT_LINTABLE_FILES  = (new jake.FileList().include("lib")).toArray().join(" ").replace(/\\/g, "/"),
    TEST_FILES      = (new jake.FileList().include("tests/*.js").exclude("tests/fixtures/*.js").exclude("tests/performance/*.js").include("tests/*/*.js").include("tests/*/*/*.js")).toArray().join(" ").replace(/\\/g, "/");

//npm run-script lint && node $istanbul cover --print both $vows -- --spec $testfiles && node $istanbul check-coverage $thresholds

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Runs JSHint on the given files.
 * @param {string} files A space-separated list of filenames to lint.
 * @param {Function} callback The function to call when complete.
 * @returns {void}
 */
function jshint(files, callback) {

    var command = [ "node", JSHINT_CLI, files].join(" ");

    jake.exec(command, { printStdout: true, printStderr: true }, function() {
        callback();
    });
}


//------------------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------------------

task("default", [ "test" ], function() {
});

desc("Lints all JavaScript files with eslint.");
task("eslint", [], function() {
    var command = [ "node", ESLINT_CLI, "-c", ESLINT_CONFIG, ESLINT_LINTABLE_FILES].join(" ");

    jake.exec(command, { printStdout: true, printStderr: true }, function() {
        complete();
    });
});

desc("Lints all JSON and JavaScript files.");
task("lint", [], function() {
    jshint(LINTABLE_FILES, complete);
});


desc("Runs all of the tests.");
task("test", [ "lint" ], function() {

    var command = [
            "node",
            ISTANBUL_CLI,
            "cover --print both",
            VOWS_CLI,
            "-- --spec",
            TEST_FILES
        ].join(" ");

    jake.exec(command, { printStdout: true, printStderr: true }, function() {
        jake.Task["check-coverage"].invoke();
        complete();
    });

});


desc("Checks code coverage information.");
task("check-coverage", [ ], function() {

    var command = [
            "node",
            ISTANBUL_CLI,
            "check-coverage",
            COVERAGE_THRESHOLDS
        ].join(" ");

    jake.exec(command, { printStdout: true, printStderr: true }, function() {
        complete();
    });

});

desc("Check performance of eslint.");
task("check-performance", [ ], function() {
    var startTime = new Date().getTime();
    var command = "node bin/eslint.js tests/performance/jshint.js";
    jake.exec(command, { printStdout: false, printStderr: true}, function() {
        complete();
        var endTime = new Date().getTime();
        var runTime = endTime - startTime;
        console.log("Linting jshint took " + runTime + "ms");
    });
});

desc("Check performance of each eslint rule separatly.");
task("get-perf-table", [ ], function() {
    var startTime, endTime, results = [];
    
    var testRun = function(text, rules, name) {
        var resultTime = 0;
        for (var i = 2; i; i--) {
            startTime = new Date().getTime();
            eslint.verify(text, { rules: rules });
            endTime = new Date().getTime();
            resultTime = (resultTime + (endTime - startTime)) / 2;
        }
        results.push({ name: name, time: resultTime});
        console.log("|" + name.toString() + "|" + resultTime + "|");
    };

    var filePath = "tests/performance/jshint.js";
    var text;
    if (existsSync(filePath)) {
        text = fs.readFileSync(path.resolve(filePath), "utf8");
    }
    if (text) {
        testRun(text, {}, "none");
        Object.keys(config.rules).forEach(function(key) {
            rules = {};
            if (typeof config.rules[key] === "number") {
                rules[key] = config.rules[key] || 1;
            } else {
                var configValue = config.rules[key];
                configValue[0] = 1;
                rules[key] = configValue;
            }
            testRun(text, rules, key);
        });
        console.log(JSON.stringify(results));
    } else {
        console.log("Failed to load " + path.resolve(filePath) + " file");
    }

    jake.exec("echo perf tests complete", { printStdout: true, printStderr: true}, complete);
});

desc("Run single test.");
task("test-one", function(file) {
    if (file) {
        var command = "node tests/lib/rules/" + file

        jake.exec(command, { printStdout: true, printStderr: true}, complete);
    }
});