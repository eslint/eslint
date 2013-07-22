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
            var results = '',
                _log = console.log;

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

            console.log = _log;
        }

    }

}).export(module);
