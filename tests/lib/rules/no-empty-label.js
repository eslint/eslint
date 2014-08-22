/**
 * @fileoverview Tests for no-empty-label rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-empty-label", {
    valid: [
        "labeled: for (var i in {}) { }",
        "labeled: for (var i=10; i; i--) { }",
        "labeled: while(i) {}",
        "labeled: do {} while (i)",
        "labeled: switch(i) { case 1: break; default: break; }"
    ],
    invalid: [
        { code: "labeled: var a = 10;", errors: [{ message: "Unexpected label labeled", type: "LabeledStatement"}] }
    ]
});
