/**
 * @fileoverview Tests for no-plusplus.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-plusplus", {
    valid: [
        "var foo = 0; foo=+1;"
    ],
    invalid: [
        { code: "var foo = 0; foo++;", errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}] },
        { code: "var foo = 0; foo--;", errors: [{ message: "Unary operator '--' used.", type: "UpdateExpression"}] }
    ]
});
