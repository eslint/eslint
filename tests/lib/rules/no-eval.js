/**
 * @fileoverview Tests for no-eval rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-eval", {
    valid: [
        "Eval(foo)"
    ],
    invalid: [
        { code: "eval(foo)", errors: [{ message: "eval can be harmful.", type: "CallExpression"}] }
    ]
});
