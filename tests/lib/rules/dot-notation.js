/**
 * @fileoverview Tests for dot-notation rule.
 * @author Josh Perez
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/dot-notation", {
    valid: [
        "a.b;",
        "a.b.c;",
        "a['12'];",
        "a['while'];",
        "a[b()];"
    ],
    invalid: [
        { code: "a['b'];", errors: [{ message: "['b'] is better written in dot notation." }] },
        { code: "a.b['c'];", errors: [{ message: "['c'] is better written in dot notation." }] }
    ]
});
