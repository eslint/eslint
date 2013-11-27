/**
 * @fileoverview Tests for dot-notation rule.
 * @author Josh Perez
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

eslintTester.addRuleTest("dot-notation", {
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
