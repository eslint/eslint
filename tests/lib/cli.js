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

var _log = console.log;
var captureLog = function() {
    var buffer = [];
    console.log = function(text) {
        buffer.push(text.replace("\r", "") + "\n");
    };
    var getLog = function (){
        console.log = _log;
        return buffer.join('');
    };
    getLog.peek = function (){
        return buffer.join('')
    };
    return getLog;
};

var pathSeperator = path.sep ? path.sep : (process.platform == 'win32' ? '\\' : '/');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

// Important: split each cli test in it's own addBatch() so vows runs them sequentially and
// This to make vows run them sequentially and allow us to capture and assert the console.log output

vows.describe("cli").addBatch({

    "when given a config file": {

        topic: "conf/eslint.json",

        "should load the specified config file": function(topic) {

            var _log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            assert.doesNotThrow(function () {
                cli.execute(["-c", topic, "lib/cli.js"]);
            });

            console.log = _log;
        }
    },
    "when calling execute more than once": {

        topic: ["tests/fixtures/missing-semicolon.js", "tests/fixtures/passing.js"],

        "should not print the results from previous execution": function(topic) {
            var getLog = captureLog();
            var exitCode = cli.execute([topic[0]]);
            var buffer = getLog();

            assert.notEqual(buffer, "\n0 problems\n");

            getLog = captureLog();
            exitCode = cli.execute([topic[1]]);
            buffer = getLog();
            assert.strictEqual(exitCode, 0);
            assert.equal(buffer, "\n0 problems\n");
        }
    },
    "when used with default settings on single valid file": {

        topic: [ fixtures + "/basic/valid-a.js" ],

        "should return exitCode 0 and 0 problems": function(topic) {
            var getLog = captureLog();
            var exitCode = cli.execute(topic);
            var buffer = getLog();

            var expected = "\n0 problems\n";
            assert.strictEqual(exitCode, 0);
            assert.strictEqual(buffer, expected);
        }
    },

    "when used with default settings on single invalid file": {

        topic: [ fixtures + "/basic/invalid-a.js" ],

        "should return exitCode 0 and some problems": function(topic) {
            var getLog = captureLog();
            var exitCode = cli.execute(topic);
            var buffer = getLog();

            var expected = fs.readFileSync(fixtures + "/basic/invalid-a-compact.txt", "utf8");
            assert.strictEqual(exitCode, 0);
            assert.strictEqual(buffer, expected);
        }
    },

    "when used with default settings on mixed files": {

        topic: [ fixtures + "/basic/valid-a.js", fixtures + "/basic/invalid-a.js", fixtures + "/basic/valid-b.js", fixtures + "/basic/invalid-b.js" ],

        "should return exitCode 0 with some problems": function(topic) {
            var getLog = captureLog();
            var exitCode = cli.execute(topic);
            var buffer = getLog();

            var expected = fs.readFileSync(fixtures + "/basic/mixed-compact.txt", "utf8");
            assert.strictEqual(exitCode, 0);
            assert.strictEqual(buffer, expected);
        }
    },

    "when used with minimal settings on invalid proto.js": {

        topic: [ "-c", "tests/fixtures/complex/minimal.json", fixtures + "/complex/proto.js" ],

        "should return exitCode 0 with some problems": function(topic) {
            var getLog = captureLog();
            var exitCode = cli.execute(topic);
            var buffer = getLog();

            var expected = fs.readFileSync(fixtures + "/complex/proto-default-compact.txt", "utf8");
            assert.strictEqual(exitCode, 0);
            assert.strictEqual(buffer, expected);
        }
    },

    "when used with minimal settings and path formatter on invalid proto.js": {

        topic: [ "-f", "path", "-c", "tests/fixtures/complex/minimal.json", fixtures + "/complex/proto.js" ],

        "should return exitCode 0 with some problems": function(topic) {
            var getLog = captureLog();
            var exitCode = cli.execute(topic);
            var buffer = getLog();

            var expected = fs.readFileSync(fixtures + "/complex/proto-default-path.txt", "utf8");
            expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/complex') + pathSeperator);
            assert.strictEqual(exitCode, 0);
            assert.strictEqual(buffer, expected);
        }
    },

     "when used with path reporter on simple typescript source-map": {

        topic: [ "-f", "path", "-c", "tests/fixtures/source-map-simple/config.json", fixtures + "/source-map-simple/main.js" ],

        "should return exitCode 0, with some problems and report positions in source files": function(topic) {
            var getLog = captureLog();
            var exitCode = cli.execute(topic);
            var buffer = getLog();

            var expected = fs.readFileSync(fixtures + "/source-map-simple/main-path.txt", "utf8");
            expected = expected.replace(/\$_PATH_\$/g, path.resolve('./tests/fixtures/source-map-simple') + pathSeperator);
            assert.strictEqual(exitCode, 0);
            assert.strictEqual(buffer, expected);
        }
    }
}).export(module);
