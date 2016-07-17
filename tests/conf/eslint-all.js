/**
 * @fileoverview Tests for eslint-all.
 * @author Alberto Rodríguez
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    eslintAll = require("../../conf/eslint-all"),
    rules = eslintAll.rules;

describe("eslint-all", function() {
    it("should only include rules", function() {
        var ruleNames = Object.keys(rules);

        assert.notInclude(ruleNames, ".eslintrc.yml");

    });

    it("should return all rules", function() {
        var ruleNames = Object.keys(rules);
        var count = ruleNames.length;
        var someRule = "yoda";

        assert.include(ruleNames, someRule);
        assert.isAbove(count, 200);
    });

    it("should configure all rules as errors", function() {
        var ruleNames = Object.keys(rules);
        var nonErrorRules = ruleNames.filter(function (ruleName) {
            return rules[ruleName] !== "error";
        });

        assert.equal(nonErrorRules.length, 0);
    });
});
