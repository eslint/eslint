/**
 * @fileoverview Tests for no-return-assign.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-return-assign", {
    valid: [
        "function x() { var result = a * b; return result; };"
    ],
    invalid: [
        { code: "function x() { return result = a * b; };", errors: [{ message: "Return statement should not contain assigment.", type: "ReturnStatement"}] }
    ]
});
