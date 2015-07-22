/**
 * @fileoverview Validate strings passed to the RegExp constructor
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-invalid-regexp", {
    valid: [
        "RegExp('')",
        "RegExp()",
        "RegExp('.', 'g')",
        "new RegExp('.')",
        "new RegExp",
        "new RegExp('.', 'im')",
        "global.RegExp('\\\\')",
        { code: "new RegExp('.', 'y')", ecmaFeatures: { regexYFlag: true }},
        { code: "new RegExp('.', 'u')", ecmaFeatures: { regexUFlag: true }},
        { code: "new RegExp('.', 'yu')", ecmaFeatures: { regexUFlag: true, regexYFlag: true }},
        { code: "new RegExp('\/', 'yu')", ecmaFeatures: { regexUFlag: true, regexYFlag: true }}
    ],
    invalid: [
        { code: "RegExp('[');", errors: [{ message: "Invalid regular expression: /[/: Unterminated character class", type: "CallExpression" }] },
        { code: "RegExp('.', 'y');", errors: [{ message: "Invalid flags supplied to RegExp constructor 'y'", type: "CallExpression" }] },
        { code: "RegExp('.', 'u');", errors: [{ message: "Invalid flags supplied to RegExp constructor 'u'", type: "CallExpression" }] },
        { code: "RegExp('.', 'yu');", errors: [{ message: "Invalid flags supplied to RegExp constructor 'yu'", type: "CallExpression" }] },
        { code: "RegExp('.', 'z');", errors: [{ message: "Invalid flags supplied to RegExp constructor 'z'", type: "CallExpression" }] },
        { code: "new RegExp(')');", errors: [{ message: "Invalid regular expression: /)/: Unmatched ')'", type: "NewExpression" }] }
    ]
});
