/**
 * @fileoverview Tests for new-cap rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/new-cap", {
    valid: [
        "var x = new Constructor();",
        "var x = new a.b.Constructor();",
        "var x = new function(){};"
    ],
    invalid: [
        { code: "var x = new c();", errors: [{ message: "A constructor name should start with an uppercase letter.", type: "NewExpression"}] }
    ]
});
