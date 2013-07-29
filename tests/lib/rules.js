/**
 * @fileoverview Tests for rules.
 * @author Patrick Brosset
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    rules = require("../../lib/rules");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("rules").addBatch({

    "when given an invalid rules directory": {

        topic: "invaliddir",

        "should log an error and exit": function(topic) {
            var error = console.error;
            var exit = process.exit;

            var errorsLogged = [];
            console.error = function(error) {
                errorsLogged.push(error);
            };

            var processExitStatus = null;
            process.exit = function(status) {
                processExitStatus = status;
            };

            rules.load(topic);

            assert.equal(errorsLogged.length, 1);
            assert.notEqual(errorsLogged[0].indexOf("Couldn't load rules from " + topic), -1);
            assert.equal(processExitStatus, 1);

            console.error = error;
            process.exit = exit;
        }

    },

    "when given a valid rules directory": {

        topic: "lib/rules",

        "should load rules and not log an error or exit": function(topic) {
            var error = console.error;
            var exit = process.exit;

            var errorsLogged = [];
            console.error = function(error) {
                errorsLogged.push(error);
            };

            var processExitStatus = null;
            process.exit = function(status) {
                processExitStatus = status;
            };

            rules.load(topic);

            assert.equal(errorsLogged.length, 0);
            assert.equal(processExitStatus, null);
            assert.equal(typeof rules.get("new-cap"), "function");

            console.error = error;
            process.exit = exit;
        }

    }
}).export(module);
