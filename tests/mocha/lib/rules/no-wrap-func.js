/**
 * @fileoverview Tests for no-wrap-func rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-wrap-func", {
    valid: [
        "(function() {})()",
        "var a = function() {}",
        "new Object(function() {})"
    ],
    invalid: [
        { code: "(function() {});", errors: [{ message: "Wrapping non-IIFE function literals in parens is unnecessary.", type: "FunctionExpression"}] },
        { code: "var a = (function() {});", errors: [{ message: "Wrapping non-IIFE function literals in parens is unnecessary.", type: "FunctionExpression"}] }
    ]
});
