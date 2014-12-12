/**
 * @fileoverview Rule to enforce consistent spacing after function names
 * @author Roberto Vidal
 * @copyright 2014 Roberto Vidal. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/space-after-function-name", {

    valid: [
        { args: [2, "never"], code: "function foo() {}" },
        { args: [2, "never"], code: "var x = function foo() {}" },
        { args: 2, code: "function foo() {}" },
        { args: 2, code: "var x = function foo() {}" },
        { args: [2, "always"], code: "var x = function foo () {}" },
        { args: [2, "always"], code: "function foo () {}" },
        { args: [2, "always"], code: "var x = function() {}" },
        { args: [2, "never"], code: "var x = function () {}" }
    ],

    invalid: [
        {
            args: [2, "never"],
            code: "function foo (x) {}",
            errors: [{
                message: "Function name \"foo\" must not be followed by whitespace.",
                type: "FunctionDeclaration"
            }]
        },
        {
            args: [2, "never"],
            code: "var x = function bar (x) {}",
            errors: [{
                message: "Function name \"bar\" must not be followed by whitespace.",
                type: "FunctionExpression"
            }]
        },
        {
            args: 2,
            code: "function foo (x) {}",
            errors: [{
                message: "Function name \"foo\" must not be followed by whitespace.",
                type: "FunctionDeclaration"
            }]
        },
        {
            args: 2,
            code: "var x = function bar (x) {}",
            errors: [{
                message: "Function name \"bar\" must not be followed by whitespace.",
                type: "FunctionExpression"
            }]
        },
        {
            args: [2, "always"],
            code: "function baz(x) {}",
            errors: [{
                message: "Function name \"baz\" must be followed by whitespace.",
                type: "FunctionDeclaration"
            }]
        },
        {
            args: [2, "always"],
            code: "var x = function qux(x) {}",
            errors: [{
                message: "Function name \"qux\" must be followed by whitespace.",
                type: "FunctionExpression"
            }]
        }
    ]
});
