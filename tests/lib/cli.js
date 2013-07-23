/**
 * @fileoverview Tests for cli.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    fs = require("fs"),
    path = require("path"),
    cli = require("../../lib/cli");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var fixtures = "tests/fixtures";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var log = console.log;
var captureLog = function() {
    var buffer = [];
    console.log = function(text) {
        buffer.push(text.replace("\r\n", "") + "\n");
    };
    var getLog = function (){
        console.log = log;
        return buffer.join('');
    };
    getLog.peek = function (){
        return buffer.join('')
    };
    return getLog;
};

var pathSeperator = path.sep ? path.sep : (process.platform === "win32" ? "\\" : "/");

var runCliTest = function(commandArray, expectedExitCode, expectedOutput) {

    var getLog = captureLog();
    var exitCode = cli.execute(commandArray);
    var buffer = getLog();

    assert.strictEqual(buffer, expectedOutput);
    assert.strictEqual(exitCode, expectedExitCode);
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

// Important: split each cli test in it's own addBatch() so vows runs them sequentially and
// This to make vows run them sequentially and allow us to capture and assert the console.log output

vows.describe("cli").addBatch({

    "when given a config file": {

        topic: "conf/eslint.json",

        "should load the specified config file": function(topic) {

            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            assert.doesNotThrow(function () {
                cli.execute(["-c", topic, "lib/cli.js"]);
            });

            console.log = log;
        }
    },
    "when calling execute more than once": {

        topic: [fixtures + "/missing-semicolon.js", fixtures + "/passing.js"],

        "should not print the results from previous execution": function(topic) {

            var expected = "tests/fixtures/missing-semicolon.js: line 1, col 0, Warning - Missing semicolon.\n\n1 problem\n";
            runCliTest([topic[0]], 0, expected);

            expected = "\n0 problems\n";
            runCliTest([topic[1]], 0, expected);
        }
    },
    "when used with default settings on single valid file": {

        topic: [ fixtures + "/basic/valid-a.js" ],

        "should return exitCode 0 and 0 problems": function(topic) {

            runCliTest(topic, 0, "\n0 problems\n");
        }
    },

    "when used with default settings on single invalid file": {

        topic: [ fixtures + "/basic/invalid-a.js" ],

        "should return exitCode 0 and some problems": function(topic) {

            var expected = fs.readFileSync(fixtures + "/basic/invalid-a-compact.txt", "utf8");
            runCliTest(topic, 0, expected);
        }
    },
    "when used with default settings on mixed files": {

        topic: [ fixtures + "/basic/valid-a.js", fixtures + "/basic/invalid-a.js", fixtures + "/basic/valid-b.js", fixtures + "/basic/invalid-b.js" ],

        "should return exitCode 0 with some problems": function(topic) {

            var expected = fs.readFileSync(fixtures + "/basic/mixed-compact.txt", "utf8");
            runCliTest(topic, 0, expected);
        }
    },

    "when using option -m / --map": {

        "on a coffeescript source-map with fileurl //# sourceMappingURL": {

            topic: [ "-m", "-f", "path", "-c", fixtures + "/source-map-coffee/config.json", fixtures + "/source-map-coffee/main-fileurl.js" ],

            "should return exitCode 0, with some problems and report positions in source files": function(topic) {

                var expected = fs.readFileSync(fixtures + "/source-map-coffee/enabled-path-fileurl.txt", "utf8");
                // apply local absolute path
                expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-coffee') + pathSeperator);

                runCliTest(topic, 0, expected);
            }
        },

        "on a coffeescript source-map with dataurl //# sourceMappingURL": {

            topic: [ "-m", "-f", "path", "-c", fixtures + "/source-map-coffee/config.json", fixtures + "/source-map-coffee/main-dataurl.js" ],

            "should return exitCode 0, with some problems and report positions in source files": function(topic) {

                var expected = fs.readFileSync(fixtures + "/source-map-coffee/enabled-path-dataurl.txt", "utf8");
                // apply local absolute path
                expected = expected.replace(/\$_PATH_\$/g, "data:application/json;base64,");

                runCliTest(topic, 0, expected);
            }
        },

        "on a coffeescript source-map with relative fileurl on compact reporter": {

            topic: [ "-m", "-f", "compact", "-c", fixtures + "/source-map-relative/config.json", fixtures + "/source-map-relative/main.js" ],

            "should return exitCode 0, with some problems and report positions in source files": function(topic) {

                var expected = fs.readFileSync(fixtures + "/source-map-relative/compact.txt", "utf8");
                // apply local absolute path to sibling directory
                expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-coffee') + pathSeperator);

                runCliTest(topic, 0, expected);
            }
        },

        "on a coffeescript source-map with relative fileurl on path reporter": {

            topic: [ "-m", "-f", "path", "-c", fixtures + "/source-map-relative/config.json", fixtures + "/source-map-relative/main.js" ],

            "should return exitCode 0, with some problems and report positions in source files": function(topic) {

                var expected = fs.readFileSync(fixtures + "/source-map-relative/path.txt", "utf8");
                // apply local absolute path to sibling directory
                expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-coffee') + pathSeperator);

                runCliTest(topic, 0, expected);
            }
        },

        "on a typescript source-map with //@ sourceMappingURL and two source files": {

            topic: [ "-m", "-f", "path", "-c", fixtures + "/source-map-typescript/config.json", fixtures + "/source-map-typescript/main.js" ],

            "should return exitCode 0, with some problems and report positions in source files": function(topic) {

                var expected = fs.readFileSync(fixtures + "/source-map-typescript/enabled-path.txt", "utf8");
                // apply local absolute path
                expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-typescript') + pathSeperator);

                runCliTest(topic, 0, expected);
            }
        }
    },

    "when not using option -m / --map": {

        "on a coffeescript source-map with //# sourceMappingURL": {

            topic: [ "-f", "path", "-c", fixtures + "/source-map-coffee/config.json", fixtures + "/source-map-coffee/main-fileurl.js" ],

            "should return exitCode 0, with some problems and report positions in linted files": function(topic) {

                var expected = fs.readFileSync(fixtures + "/source-map-coffee/disabled-path-fileurl.txt", "utf8");
                // apply local absolute path
                expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-coffee') + pathSeperator);

                runCliTest(topic, 0, expected);
            }
        },

        "on a typescript source-map with //@ sourceMappingURL and two source files": {

            topic: [ "-f", "path", "-c", fixtures + "/source-map-typescript/config.json", fixtures + "/source-map-typescript/main.js" ],

            "should return exitCode 0, with some problems and report positions in linted files": function(topic) {

                var expected = fs.readFileSync(fixtures + "/source-map-typescript/disabled-path.txt", "utf8");
                expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-typescript') + pathSeperator);

                runCliTest(topic, 0, expected);
            }
        }
    }
}).export(module);
