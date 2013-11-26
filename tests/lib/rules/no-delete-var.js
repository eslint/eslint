/**
 * @fileoverview Tests for no-delete-var rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-delete-var", {
    valid: [
        "delete x.prop;"
    ],
    invalid: [
        { code: "delete x", errors: [{ message: "Variables should not be deleted​.", type: "UnaryExpression"}] }
    ]
});
