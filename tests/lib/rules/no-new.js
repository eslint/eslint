/**
 * @fileoverview Tests for no-new rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-new", {
    valid: [
        "var a = new Date()",
        "var a; if (a === new Date()) { a = false; }"
    ],
    invalid: [
        { code: "new Date()", errors: [{ message: "Do not use 'new' for side effects.", type: "ExpressionStatement"}] }
    ]
});
