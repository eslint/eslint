/**
 * @fileoverview Validate strings passed to the RegExp constructor
 * @author Michael Ficarra
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

eslintTester.addRuleTest("lib/rules/no-invalid-regexp", {
    valid: [
        "RegExp('')",
        "RegExp()",
        "RegExp('.', 'g')",
        "new RegExp('.')",
        "new RegExp",
        "new RegExp('.', 'im')",
        "global.RegExp('\\\\')"
    ],
    invalid: [
        { code: "RegExp('[');", errors: [{ message: "Invalid regular expression: /[/: Unterminated character class", type: "CallExpression" }] },
        { code: "RegExp('.', 'z');", errors: [{ message: "Invalid flags supplied to RegExp constructor 'z'", type: "CallExpression" }] },
        { code: "new RegExp(')');", errors: [{ message: "Invalid regular expression: /)/: Unmatched ')'", type: "NewExpression" }] }
    ]
});
