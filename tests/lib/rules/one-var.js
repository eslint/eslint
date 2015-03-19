/**
 * @fileoverview Tests for one-var.
 * @author Ian Christian Myers and Michael Paulukonis
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 * @copyright 2013 Michael Paulukonis. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/one-var", {
    valid: [
        "function foo() { var bar = true; }",
        "function foo() { var bar = true, baz = 1; if (qux) { bar = false; } }",
        "var foo = function () { var bar = true; baz(); }",
        {
            code: "function foo() { var bar = true, baz = false; }",
            args: [2, "always"]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            args: [2, "never"]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            args: [2, "never"]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            ecmaFeatures: {
                destructuring: true
            },
            args: [2, "never"]
        }
    ],
    invalid: [
        {
            code: "function foo() { var bar = true; var baz = false; }",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true; if (qux) { var baz = false; } else { var quxx = 42; } }",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                },
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = function () { var bar = true; var baz = false; }",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = () => { var bar = true; var baz = false; }",
            ecmaFeatures: { arrowFunctions: true },
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = function () { var bar = true; if (qux) { var baz = false; } }",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo; var bar;",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true, baz = false; }",
            args: [2, "never"],
            errors: [{
                message: "Split 'var' declaration into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            ecmaFeatures: {
                destructuring: true
            },
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        }
    ]
});
