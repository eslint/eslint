/**
 * @fileoverview Tests for eslint-off.
 * @author Dave Lunny
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const eslintOff = require("../../conf/eslint-off");
const rules = eslintOff.rules;

describe("eslint-all", () => {
    it("should only include rules", () => {
        const ruleNames = Object.keys(rules);

        assert.notInclude(ruleNames, ".eslintrc.yml");
    });

    it("should return all rules", () => {
        const ruleNames = Object.keys(rules);
        const count = ruleNames.length;
        const someRule = "yoda";

        assert.include(ruleNames, someRule);
        assert.isAbove(count, 200);
    });

    it("should configure all rules as off", () => {
        const ruleNames = Object.keys(rules);
        const nonErrorRules = ruleNames.filter(ruleName => rules[ruleName] !== "off");

        assert.strictEqual(nonErrorRules.length, 0);
    });
});
