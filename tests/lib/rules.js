/**
 * @fileoverview Tests for rules.
 * @author Patrick Brosset
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    rules = require("../../lib/rules"),
    path = require("path");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("rules").addBatch({

    "when given an invalid rules directory": {

        topic: "invaliddir",

        "should log an error and exit": function(topic) {
            assert.throws(function() { rules.load(topic); });
        }

    },

    "when given a valid rules directory": {

        topic: path.join(process.cwd(), "tests/fixtures/rules"),

        "should load rules and not log an error or exit": function(topic) {
            assert.equal(typeof rules.get("fixture-rule"), "undefined");
            rules.load(topic);
            assert.equal(typeof rules.get("fixture-rule"), "object");
        }
    },

    "when a rule has been defined": {

        "should be able to retrieve the rule": function() {
            var ruleId = "michaelficarra";
            rules.define(ruleId, {});
            assert.ok(rules.get(ruleId));
        }

    }

}).export(module);
