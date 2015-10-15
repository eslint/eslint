/**
 * @fileoverview Tests for consistent-return rule.
 * @author Raphael Pigulla
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var rule = require("../../../lib/rules/consistent-return"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("consistent-return", rule, {

    valid: [
        "function foo() { return; }",
        "function foo() { if (true) return; }",
        "function foo() { if (true) return; else return; }",
        "function foo() { if (true) return true; else return false; }",
        "f(function() { return; })",
        "f(function() { if (true) return; })",
        "f(function() { if (true) return; else return; })",
        "f(function() { if (true) return true; else return false; })",
        "function foo() { function bar() { return true; } return; }",
        "function foo() { function bar() { return; } return false; }",
        { code: "var x = () => {  return {}; };", ecmaFeatures: { arrowFunctions: true } },
        { code: "if (true) { return 1; } return 0;", ecmaFeatures: { globalReturn: true } }
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
            code: "var foo = () => { if (true) return true; else return; }",
            ecmaFeatures: { arrowFunctions: true },
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
            code: "f(function() { if (true) return true; else return; })",
            errors: [
                {
                    message: "Expected a return value.",
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "f(function() { if (true) return; else return false; })",
            errors: [
                {
                    message: "Expected no return value.",
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "f(a => { if (true) return; else return false; })",
            ecmaFeatures: { arrowFunctions: true },
            errors: [
                {
                    message: "Expected no return value.",
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "if (true) { return 1; } return;",
            ecmaFeatures: { globalReturn: true },
            errors: [
                {
                    message: "Expected a return value.",
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "function foo() { if (a) return true; }",
            errors: [
                {
                    message: "Expected to return a value at the end of this function.",
                    type: "FunctionDeclaration",
                    column: 10
                }
            ]
        },
        {
            code: "f(function foo() { if (a) return true; });",
            errors: [
                {
                    message: "Expected to return a value at the end of this function.",
                    type: "FunctionExpression",
                    column: 12
                }
            ]
        },
        {
            code: "f(function() { if (a) return true; });",
            errors: [
                {
                    message: "Expected to return a value at the end of this function.",
                    type: "FunctionExpression",
                    column: 3
                }
            ]
        },
        {
            code: "f(() => { if (a) return true; });",
            ecmaFeatures: {arrowFunctions: true},
            errors: [
                {
                    message: "Expected to return a value at the end of this function.",
                    type: "ArrowFunctionExpression",
                    column: 6
                }
            ]
        },
        {
            code: "var obj = {foo() { if (a) return true; }};",
            ecmaFeatures: {objectLiteralShorthandMethods: true},
            errors: [
                {
                    message: "Expected to return a value at the end of this method.",
                    type: "FunctionExpression",
                    column: 12
                }
            ]
        },
        {
            code: "class A {foo() { if (a) return true; }};",
            ecmaFeatures: {classes: true},
            errors: [
                {
                    message: "Expected to return a value at the end of this method.",
                    type: "FunctionExpression",
                    column: 10
                }
            ]
        },
        {
            code: "if (a) return true;",
            ecmaFeatures: {globalReturn: true},
            errors: [
                {
                    message: "Expected to return a value at the end of this program.",
                    type: "Program",
                    column: 1
                }
            ]
        }
    ]
});
