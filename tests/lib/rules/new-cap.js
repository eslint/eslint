/**
 * @fileoverview Tests for new-cap rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("new-cap", {
    valid: [
       	"var x = new C();",
        "var x = new [];"
    ],
    invalid: [
        { code: "var x = new c();", errors: [{ message: "A constructor name should start with an uppercase letter.", type: "NewExpression"}] }
    ]
});
