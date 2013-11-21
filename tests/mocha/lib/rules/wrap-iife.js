/**
 * @fileoverview Tests for wrap-iife rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


eslintTester.add("wrap-iife", {
    valid: [
        "var x = (function () { return { y: 1 };})();",
        "var x = test(function () { return { y: 1 };})();"
    ],
    invalid: [

        { code: "var x = function () { return { y: 1 };}();",
          errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}] },
        { code: "var x = [function () { return { y: 1 };}()];",
          errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}] }
    ]
});
