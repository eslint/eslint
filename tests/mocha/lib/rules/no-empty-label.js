/**
 * @fileoverview Tests for no-empty-label rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-empty-label", {
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
