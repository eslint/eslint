/**
 * @fileoverview Tests for no-empty-label rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-empty-label", {
    valid: [
        "labeled: for (var i in {}) { }",
        { code: "labeled: for (var i of {}) { }", ecmaFeatures: { forOf: true } },
        "labeled: for (var i=10; i; i--) { }",
        "labeled: while(i) {}",
        "labeled: do {} while (i)",
        "labeled: switch(i) { case 1: break; default: break; }"
    ],
    invalid: [
        { code: "labeled: var a = 10;", errors: [{ message: "Unexpected label labeled", type: "LabeledStatement"}] }
    ]
});
