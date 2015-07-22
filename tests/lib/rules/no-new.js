/**
 * @fileoverview Tests for no-new rule.
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
eslintTester.addRuleTest("lib/rules/no-new", {
    valid: [
        "var a = new Date()",
        "var a; if (a === new Date()) { a = false; }"
    ],
    invalid: [
        { code: "new Date()", errors: [{ message: "Do not use 'new' for side effects.", type: "ExpressionStatement"}] }
    ]
});
