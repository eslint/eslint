/**
 * @fileoverview Tests for require-yield rule
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint");
var ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var errorMessage = "This generator function does not have `yield`.";

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/require-yield", {
    valid: [
        {
            code: "function foo() { return 0; }",
            ecmaFeatures: {generators: true}
        },
        {
            code: "function* foo() { yield 0; }",
            ecmaFeatures: {generators: true}
        },
        {
            code: "function* foo() { }",
            ecmaFeatures: {generators: true}
        },
        {
            code: "(function* foo() { yield 0; })();",
            ecmaFeatures: {generators: true}
        },
        {
            code: "(function* foo() { })();",
            ecmaFeatures: {generators: true}
        },
        {
            code: "var obj = { *foo() { yield 0; } };",
            ecmaFeatures: {generators: true, objectLiteralShorthandMethods: true}
        },
        {
            code: "var obj = { *foo() { } };",
            ecmaFeatures: {generators: true, objectLiteralShorthandMethods: true}
        },
        {
            code: "class A { *foo() { yield 0; } };",
            ecmaFeatures: {classes: true, generators: true}
        },
        {
            code: "class A { *foo() { } };",
            ecmaFeatures: {classes: true, generators: true}
        }
    ],
    invalid: [
        {
            code: "function* foo() { return 0; }",
            ecmaFeatures: {generators: true},
            errors: [{message: errorMessage, type: "FunctionDeclaration"}]
        },
        {
            code: "(function* foo() { return 0; })();",
            ecmaFeatures: {generators: true},
            errors: [{message: errorMessage, type: "FunctionExpression"}]
        },
        {
            code: "var obj = { *foo() { return 0; } }",
            ecmaFeatures: {generators: true, objectLiteralShorthandMethods: true},
            errors: [{message: errorMessage, type: "FunctionExpression"}]
        },
        {
            code: "class A { *foo() { return 0; } }",
            ecmaFeatures: {classes: true, generators: true},
            errors: [{message: errorMessage, type: "FunctionExpression"}]
        },
        {
            code: "function* foo() { function* bar() { yield 0; } }",
            ecmaFeatures: {generators: true},
            errors: [{
                message: errorMessage,
                type: "FunctionDeclaration",
                column: 0
            }]
        },
        {
            code: "function* foo() { function* bar() { return 0; } yield 0; }",
            ecmaFeatures: {generators: true},
            errors: [{
                message: errorMessage,
                type: "FunctionDeclaration",
                column: 18
            }]
        }
    ]
});
