/**
 * @fileoverview Tests for no-return-assign.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-return-assign", {
    valid: [
        "function x() { var result = a * b; return result; };"
    ],
    invalid: [
        { code: "function x() { return result = a * b; };", errors: [{ message: "Return statement should not contain assigment.", type: "ReturnStatement"}] }
    ]
});
