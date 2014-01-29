/**
 * @fileoverview Tests for no-extra-semi rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

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
