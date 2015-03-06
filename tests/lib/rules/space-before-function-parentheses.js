/**
 * @fileoverview Tests for space-before-function-parentheses.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 * @copyright 2015 Mathias Schreck
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
eslintTester.addRuleTest("lib/rules/space-before-function-parentheses", {

    valid: [
        { code: "function foo () {}" },
        { code: "var foo = function () {}" },
        { code: "var bar = function foo () {}" },
        { code: "var obj = { get foo () {}, set foo (val) {} };" },
        {
            code: "var obj = { foo () {} };",
            ecmaFeatures: { objectLiteralShorthandMethods: true }
        },
        { code: "function* foo () {}", ecmaFeatures: { generators: true } },
        { code: "var foo = function *() {};", ecmaFeatures: { generators: true } },

        { code: "function foo() {}", options: ["never"] },
        { code: "var foo = function() {}", options: ["never"] },
        { code: "var bar = function foo() {}", options: ["never"] },
        { code: "var obj = { get foo() {}, set foo(val) {} };", options: ["never"] },
        {
            code: "var obj = { foo() {} };",
            options: ["never"],
            ecmaFeatures: { objectLiteralShorthandMethods: true }
        },
        {
            code: "function* foo() {}",
            options: ["never"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*() {};",
            options: ["never"],
            ecmaFeatures: { generators: true }
        },

        {
            code: [
                "function foo() {}",
                "var bar = function () {}",
                "function* baz() {}",
                "var bat = function*() {};",
                "var obj = { get foo() {}, set foo(val) {}, bar() {} };"
            ].join("\n"),
            options: [ { named: "never", anonymous: "always" } ],
            ecmaFeatures: {
                generators: true,
                objectLiteralShorthandMethods: true
            }
        },
        {
            code: [
                "function foo () {}",
                "var bar = function() {}",
                "function* baz () {}",
                "var bat = function* () {};",
                "var obj = { get foo () {}, set foo (val) {}, bar () {} };"
            ].join("\n"),
            options: [ { named: "always", anonymous: "never" } ],
            ecmaFeatures: {
                generators: true,
                objectLiteralShorthandMethods: true
            }
        }
    ],

    invalid: [
        {
            code: "function foo() {}",
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            code: "var foo = function() {}",
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var bar = function foo() {}",
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 22
                }
            ]
        },
        {
            code: "var obj = { get foo() {}, set foo(val) {} };",
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 19
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 33
                }
            ]
        },
        {
            code: "var obj = { foo() {} };",
            ecmaFeatures: { objectLiteralShorthandMethods: true },
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 15
                }
            ]
        },
        {
            code: "function* foo() {}",
            ecmaFeatures: { generators: true },
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 13
                }
            ]
        },

        {
            code: "function foo () {}",
            options: ["never"],
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            code: "var foo = function () {}",
            options: ["never"],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var bar = function foo () {}",
            options: ["never"],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 22
                }
            ]
        },
        {
            code: "var obj = { get foo () {}, set foo (val) {} };",
            options: ["never"],
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 19
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 34
                }
            ]
        },
        {
            code: "var obj = { foo () {} };",
            options: ["never"],
            ecmaFeatures: { objectLiteralShorthandMethods: true },
            errors: [
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 15
                }
            ]
        },
        {
            code: "function* foo () {}",
            options: ["never"],
            ecmaFeatures: { generators: true },
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 13
                }
            ]
        },

        {
            code: [
                "function foo () {}",
                "var bar = function() {}",
                "var obj = { get foo () {}, set foo (val) {}, bar () {} };"
            ].join("\n"),
            options: [ { named: "never", anonymous: "always" } ],
            ecmaFeatures: { objectLiteralShorthandMethods: true },
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Unexpected space before function parentheses.",
                    line: 1,
                    column: 12
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 2,
                    column: 18
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 3,
                    column: 19
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 3,
                    column: 34
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 3,
                    column: 48
                }
            ]
        },
        {
            code: [
                "function foo() {}",
                "var bar = function () {}",
                "var obj = { get foo() {}, set foo(val) {}, bar() {} };"
            ].join("\n"),
            options: [ { named: "always", anonymous: "never" } ],
            ecmaFeatures: { objectLiteralShorthandMethods: true },
            errors: [
                {
                    type: "FunctionDeclaration",
                    message: "Missing space before function parentheses.",
                    line: 1,
                    column: 12
                },
                {
                    type: "FunctionExpression",
                    message: "Unexpected space before function parentheses.",
                    line: 2,
                    column: 18
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 3,
                    column: 19
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 3,
                    column: 33
                },
                {
                    type: "FunctionExpression",
                    message: "Missing space before function parentheses.",
                    line: 3,
                    column: 46
                }
            ]
        }
    ]
});
