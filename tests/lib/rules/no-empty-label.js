/**
 * @fileoverview Tests for no-empty-label rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-empty-label", {
    valid: [
        "labeled: for (var i=10; i; i--) { }",
        "labeled: while(i) {}",
        "labeled: do {} while (i)",
        "labeled: switch(i) { case 1: break; default: break; }"
    ],
    invalid: [
        { code: "labeled: var a = 10;", errors: [{ message: "Unexpected label labeled", type: "LabeledStatement"}] }
    ]
});
