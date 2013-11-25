/**
 * @fileoverview Tests for rules.
 * @author Patrick Brosset
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    rules = require("../../lib/rules");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("rules", function() {
    describe("when given an invalid rules directory", function() {
        var code = "invaliddir";

        it("should log an error and exit", function() {
            assert.throws(function() { rules.load(code); });
        });
    });

    describe("when given a valid rules directory", function() {
        var code = "tests/fixtures/rules";

        it("should load rules and not log an error or exit", function() {
            assert.equal(typeof rules.get("fixture-rule"), "undefined");
            rules.load(code);
            assert.equal(typeof rules.get("fixture-rule"), "object");
        });
    });

    describe("when a rule has been defined", function() {
        it("should be able to retrieve the rule", function() {
            var ruleId = "michaelficarra";
            rules.define(ruleId, {});
            assert.ok(rules.get(ruleId));
        });
    });
});
