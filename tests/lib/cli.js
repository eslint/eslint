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

    }

}).export(module);
