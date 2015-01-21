/**
 * @fileoverview Tests for generator-star rule.
 * @author Jamund Ferguson
 * @copyright 2014 Jamund Ferguson. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/generator-star", {
    valid: [
        {
            code: "function *foo(){}",
            ecmaFeatures: { "generators": true }
        },
        {
            code: "function* foo(){}",
            args: [1, "start"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "function *foo(){}",
            args: [1, "end"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var foo = function* foo(){}",
            args: [1, "start"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var foo = function *(){}",
            args: [1, "end"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var foo = function* foo(){}",
            args: [1, "start"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var foo = function *foo(){}",
            args: [1, "end"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var foo = function* foo(){}",
            args: [1, "start"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var foo = function *foo(){}",
            args: [1, "end"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var x = { *foo(){} }",
            args: [1, "start"],
            ecmaFeatures: { "generators": true, "objectLiteralShorthandMethods": true }
        },
        {
            code: "var x = { *foo(){} }",
            args: [1, "end"],
            ecmaFeatures: { "generators": true, "objectLiteralShorthandMethods": true }
        },
        {
            code: "var x = {\n    *foo(){} }",
            args: [1, "start"],
            ecmaFeatures: { "generators": true, "objectLiteralShorthandMethods": true }
        },
        {
            code: "var foo = function*(){}",
            args: [1, "start"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var foo = function*(){}",
            args: [1, "end"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var foo = function* ( arg1 ){};",
            args: [1, "start"],
            ecmaFeatures: { "generators": true }
        },
        {
            code: "var foo = function *( arg1 ){};",
            args: [1, "end"],
            ecmaFeatures: { "generators": true }
        }
    ],

    invalid: [
        {
            code: "function * foo(){}",
            args: [1, "start"],
            ecmaFeatures: {"generators": true},
            errors: [
                {
                    message: "Expected no space before *.",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "function * foo(){}",
            args: [1, "end"],
            ecmaFeatures: {"generators": true},
            errors: [
                {
                    message: "Expected a space before *.",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "function *foo(){}",
            ecmaFeatures: {"generators": true},
            args: [1, "start"],
            errors: [
                {
                    message: "Expected no space before *.",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "var foo = function* (){}",
            args: [1, "end"],
            ecmaFeatures: { "generators": true },
            errors: [
                {
                    message: "Expected a space before *.",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = function * (){}",
            args: [1, "start"],
            ecmaFeatures: { "generators": true },
            errors: [
                {
                    message: "Expected no space before *.",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = function * (){}",
            args: [1, "end"],
            ecmaFeatures: { "generators": true },
            errors: [
                {
                    message: "Expected a space before *.",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = function* foo(){}",
            args: [1, "end"],
            ecmaFeatures: { "generators": true },
            errors: [
                {
                    message: "Expected a space before *.",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = function *foo(){}",
            args: [1, "start"],
            ecmaFeatures: { "generators": true },
            errors: [
                {
                    message: "Expected no space before *.",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = function * foo(){}",
            args: [1, "end"],
            ecmaFeatures: { "generators": true },
            errors: [
                {
                    message: "Expected a space before *.",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = function * foo(){}",
            args: [1, "start"],
            ecmaFeatures: { "generators": true },
            errors: [
                {
                    message: "Expected no space before *.",
                    type: "FunctionExpression"
                }
            ]
        }

    ]
});
