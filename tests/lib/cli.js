/**
 * @fileoverview Tests for cli.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    cli = require("../../lib/cli");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

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


    "when given a config file and a directory of files": {

        topic: ["--config","tests/fixtures/configurations/semi-error.json", "tests/fixtures/formatters"],

        "should load and execute without error": function(topic) {
            var log = console.log,
                exitStatus;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            assert.doesNotThrow(function () {
                exitStatus = cli.execute(topic);
            });
            console.log = log;

            assert.equal(exitStatus, 0);
        }

    },

    "when given a valid built-in formatter name": {

        topic: "checkstyle",

        "should execute without any errors": function(topic) {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute(["-f", topic, "tests/fixtures/passing.js"]);
            assert.equal(exit, 0);

            console.log = log;
        }

    },

    "when given an invalid built-in formatter name": {

        topic: "fakeformatter",

        "should execute with error": function(topic) {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute(["-f", topic, "tests/fixtures/passing.js"]);
            assert.equal(exit, 1);

            console.log = log;
        }

    },

    "when given a valid formatter path": {

        topic: "tests/fixtures/formatters/simple.js",

        "should execute without any errors": function(topic) {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute(["-f", topic, "tests/fixtures/passing.js"]);
            assert.equal(exit, 0);

            console.log = log;
        }

    },

    "when given an invalid formatter path": {

        topic: "tests/fixtures/formatters/file-does-not-exist.js",

        "should execute with error": function(topic) {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute(["-f", topic, "tests/fixtures/passing.js"]);
            assert.equal(exit, 1);

            console.log = log;
        }

    },

    "when executing a file with an error": {

        topic: "tests/fixtures/configurations/semi-error.js",

        "should execute with error": function(topic) {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute([topic]);
            assert.equal(exit, 1);

            console.log = log;
        }

    },

    "when calling execute more than once": {

        topic: ["tests/fixtures/missing-semicolon.js", "tests/fixtures/passing.js"],

        "should not print the results from previous execution": function(topic) {
            var results = '',
                log = console.log;

            // Collect the CLI output.
            console.log = function(msg) {
                results += msg;
            };

            cli.execute([topic[0]]);
            assert.notEqual(results, "\n0 problems");

            // Reset results collected between executions.
            results = '';

            cli.execute([topic[1]]);
            assert.equal(results, "\n0 problems");

            console.log = log;
        }

    }

}).export(module);
