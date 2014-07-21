/**
 * @fileoverview Tests for dot-notation rule.
 * @author Josh Perez
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/dot-notation", {
    valid: [
        "a.b;",
        "a.b.c;",
        "a['12'];",
        "a[b];",
        "a[0];",
        "a['while'];",
        "a['true'];",
        "a['false'];",
        "a['null'];",
        "a[true];",
        "a[false];",
        "a[null];",
        "a[undefined];",
        "a[void 0];",
        "a[b()];"
    ],
    invalid: [
        { code: "a['b'];", errors: [{ message: "['b'] is better written in dot notation." }] },
        { code: "a.b['c'];", errors: [{ message: "['c'] is better written in dot notation." }] }
    ]
});
