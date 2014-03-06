/**
 * @fileoverview Tests for wrap-iife rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


eslintTester.addRuleTest("lib/rules/wrap-iife", {
    valid: [
        "(function(){ }());",
        "(function(){ })();",
        "(function a(){ }());",
        "(function a(){ })();"
    ],
    invalid: [
        {
            code: "0, function(){ }();",
            errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}]
        },
        {
            code: "[function(){ }()];",
            errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}]
        },
        {
            code: "var a = function(){ }();",
            errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}]
        },
        {
            code: "(function(){ }(), 0);",
            errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}]
        }
    ]
});
