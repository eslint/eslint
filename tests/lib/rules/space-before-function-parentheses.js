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

        { code: "function foo() {}", options: ["never"] },
        { code: "var foo = function() {}", options: ["never"] },
        { code: "var bar = function foo() {}", options: ["never"] },

        {
            code: [
                "function foo() {}",
                "var bar = function () {}"
            ].join("\n"),
            options: [ { named: "never", anonymous: "always" } ]
        },
        {
            code: [
                "function foo () {}",
                "var bar = function() {}"
            ].join("\n"),
            options: [ { named: "always", anonymous: "never" } ]
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
            code: [
                "function foo () {}",
                "var bar = function() {}"
            ].join("\n"),
            options: [ { named: "never", anonymous: "always" } ],
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
                }
            ]
        },
        {
            code: [
                "function foo() {}",
                "var bar = function () {}"
            ].join("\n"),
            options: [ { named: "always", anonymous: "never" } ],
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
                }
            ]
        }
    ]
});
