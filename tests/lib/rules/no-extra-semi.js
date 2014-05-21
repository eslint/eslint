/**
 * @fileoverview Tests for no-extra-semi rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-extra-semi", {
    valid: [
        "var x = 5;",
        "function foo(){}"
    ],
    invalid: [
        { code: "var x = 5;;", errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement"}] },
        { code: "function foo(){};", errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement"}] }
    ]
});
