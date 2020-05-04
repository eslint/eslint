/**
 * @fileoverview Tests for rules.
 * @author Patrick Brosset
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    Rules = require("../../lib/rules"),
    Linter = require("../../lib/linter");

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

        it("should return the rule as an object with a create() method if the rule was defined as a function", () => {

            /**
             * A rule that does nothing
             * @returns {void}
             */
            function rule() {}
            rule.schema = [];
            rules.define("foo", rule);
            assert.deepStrictEqual(rules.get("foo"), { create: rule, schema: [] });
        });

        it("should return the rule as-is if it was defined as an object with a create() method", () => {
            const rule = { create() {} };

            rules.define("foo", rule);
            assert.strictEqual(rules.get("foo"), rule);
        });
    });

    describe("when a rule is not found", () => {
        it("should return a stub rule that reports an error if the rule is unknown", () => {
            const stubRule = rules.get("not-defined");
            const linter = new Linter();

            linter.defineRule("test-rule", stubRule);

            const problems = linter.verify("foo", { rules: { "test-rule": "error" } });

            assert.lengthOf(problems, 1);
            assert.strictEqual(problems[0].message, "Definition for rule 'not-defined' was not found");
            assert.strictEqual(problems[0].line, 1);
            assert.strictEqual(problems[0].column, 1);
            assert.typeOf(problems[0].endLine, "undefined");
            assert.typeOf(problems[0].endColumn, "undefined");
        });

        it("should return a stub rule that lists replacements if a rule is known to have been replaced", () => {
            const stubRule = rules.get("no-arrow-condition");
            const linter = new Linter();

            linter.defineRule("test-rule", stubRule);

            const problems = linter.verify("foo", { rules: { "test-rule": "error" } });

            assert.lengthOf(problems, 1);
            assert.strictEqual(
                problems[0].message,
                "Rule 'no-arrow-condition' was removed and replaced by: no-confusing-arrow, no-constant-condition"
            );
            assert.strictEqual(problems[0].line, 1);
            assert.strictEqual(problems[0].column, 1);
            assert.typeOf(problems[0].endLine, "undefined");
            assert.typeOf(problems[0].endColumn, "undefined");
        });
    });

    describe("when loading all rules", () => {
        it("should return a map", () => {
            const allRules = rules.getAllLoadedRules();

            assert.isAbove(allRules.size, 230);
            assert.instanceOf(allRules, Map);
            assert.isObject(allRules.get("no-alert"));
        });
    });
});
