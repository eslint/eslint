/**
 * @fileoverview Tests for sort-vars rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("sort-vars", {
    valid: [
        "var a=10, b=4, c='abc'",
        "var a, b, c, d",
        "var b; var a; var d;",
        "var _a, a"
    ],
    invalid: [
        { code: "var b, a", errors: [{ message: "Variables within the same declaration block should be sorted alphabetically", type: "VariableDeclarator"}] },
        { code: "var b=10, a=20;", errors: [{ message: "Variables within the same declaration block should be sorted alphabetically", type: "VariableDeclarator"}] },
        { code: "var all=10, a = 1", errors: [{ message: "Variables within the same declaration block should be sorted alphabetically", type: "VariableDeclarator"}] },
        { code: "var b, c, a, d", errors: [{ message: "Variables within the same declaration block should be sorted alphabetically", type: "VariableDeclarator"}] },
        { code: "var c, d, a, b", errors: 2 }
    ]
});
