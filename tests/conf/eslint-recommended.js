/**
 * @fileoverview Tests for eslint-recommended.
 * @author Teddy Katz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const eslintRecommended = require("../../conf/eslint-recommended");
const rules = eslintRecommended.rules;

describe("eslint-recommended", () => {
    it("should include recommended rules", () => {
        const ruleNames = Object.keys(rules);

        assert.include(ruleNames, "valid-typeof");
    });

    it("should not include non-recommended rules", () => {
        const ruleNames = Object.keys(rules);

        assert.notInclude(ruleNames, "yoda");
    });

    it("should configure all rules as errors", () => {
        const ruleValues = Object.keys(rules).map(ruleId => rules[ruleId]);

        assert(ruleValues.every(config => config === "error"));
    });
});
