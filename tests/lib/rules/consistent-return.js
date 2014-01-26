/**
 * @fileoverview Tests for consistent-return rule.
 * @author Raphael Pigulla
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("consistent-return", {

    valid: [
        "function foo() { return; }",
        "function foo() { if (true) return; else return; }",
        "function foo() { if (true) return true; else return false; }",
        "f(function() { return; })",
        "f(function() { if (true) return; else return; })",
        "f(function() { if (true) return true; else return false; })",
        "function foo() { function bar() { return true; } return; }",
        "function foo() { function bar() { return; } return false; }"
    ],

    invalid: [
        {
            code: "function foo() { if (true) return true; else return; }",
            errors: [
                {
                    message: "Expected a return value.",
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "function foo() { if (true) return; else return false; }",
            errors: [
                {
                    message: "Expected no return value.",
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "f(function () { if (true) return true; else return; })",
            errors: [
                {
                    message: "Expected a return value.",
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "f(function () { if (true) return; else return false; })",
            errors: [
                {
                    message: "Expected no return value.",
                    type: "ReturnStatement"
                }
            ]
        }
    ]
});
