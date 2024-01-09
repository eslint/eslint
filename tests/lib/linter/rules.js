/**
 * @fileoverview Tests for rules.
 * @author Patrick Brosset
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    Rules = require("../../../lib/linter/rules"),
    { Linter } = require("../../../lib/linter");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("rules", () => {
    let rules = null;

    beforeEach(() => {
        rules = new Rules();
    });

    describe("when a rule has been defined", () => {
        it("should be able to retrieve the rule", () => {
            const ruleId = "michaelficarra";

            rules.define(ruleId, {});
            assert.ok(rules.get(ruleId));
        });

        it("should return the rule as-is if it was defined as an object with a create() method", () => {
            const rule = { create() {} };

            rules.define("foo", rule);
            assert.strictEqual(rules.get("foo"), rule);
        });
    });


    describe("when a rule is not found", () => {
        it("should report a linting error if the rule is unknown", () => {

            const linter = new Linter();

            assert.throws(() => {
                linter.verify("foo", { rules: { "test-rule": "error" } });
            }, TypeError, "Could not find \"test-rule\" in plugin \"@\".");

        });


        it("should report a linting error that lists replacements if a rule is known to have been replaced", () => {
            const linter = new Linter();

            assert.throws(() => {
                linter.verify("foo", { rules: { "no-arrow-condition": "error" } });
            }, TypeError, "Key \"rules\": Key \"no-arrow-condition\": Rule \"no-arrow-condition\" was removed and replaced by \"no-confusing-arrow,no-constant-condition\".");
        });
    });


    describe("when loading all rules", () => {
        it("should iterate all rules", () => {
            const allRules = new Map(rules);

            assert.isAbove(allRules.size, 230);
            assert.isObject(allRules.get("no-alert"));
        });
    });
});
