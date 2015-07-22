/**
 * @fileoverview Tests for no-console rule.
 * @author Nicholas C. Zakas
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
eslintTester.addRuleTest("lib/rules/no-console", {
    valid: [
        "Console.info(foo)"
    ],
    invalid: [
        { code: "console.log(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.error(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.info(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] }
    ]
});
