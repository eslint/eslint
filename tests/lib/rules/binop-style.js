/**
 * @fileoverview Binary operator style
 * @author Benoît Zugmeyer
 * @copyright 2015 Benoît Zugmeyer. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var util = require("util");
var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var BAD_LN_BRK_MSG = "Bad line breaking before and after '%s'.",
    FIRST_MSG = "'%s' should be placed first.",
    LAST_MSG = "'%s' should be placed last.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/binop-style", {

    valid: [
        "1 + 1",
        "1 + 1 + 1",
        "1 +\n1",
        "1 + (1 +\n1)",
        "f(1 +\n1)",
        "1 || 1",
        "1 || \n1",
        "a += 1",
        "var a;",

        {code: "1\n+ 1", args: ["2", "first"]},
        {code: "1 + 1\n+ 1", args: ["2", "first"]},
        {code: "f(1\n+ 1)", args: ["2", "first"]},
        {code: "1 \n|| 1", args: ["2", "first"]},
        {code: "a += 1", args: ["2", "first"]},
        {
            code: "var o = \nsomething",
            args: ["2", "first", {exceptions: {VariableDeclarator: true}}]
        },
        {
            code: "o = \nsomething",
            args: ["2", "first", {exceptions: {AssignmentExpression: true}}]
        }
    ],

    invalid: [
        {
            code: "1\n+ 1",
            errors: [{
                message: util.format(LAST_MSG, "+"),
                type: "BinaryExpression"
            }]
        },
        {
            code: "1 + 2 \n + 3",
            errors: [{
                message: util.format(LAST_MSG, "+"),
                type: "BinaryExpression"
            }]
        },
        {
            code: "1\n+\n1",
            errors: [{
                message: util.format(BAD_LN_BRK_MSG, "+"),
                type: "BinaryExpression"
            }]
        },
        {
            code: "1 + (1\n+ 1)",
            errors: [{
                message: util.format(LAST_MSG, "+"),
                type: "BinaryExpression"
            }]
        },
        {
            code: "f(1\n+ 1);",
            errors: [{
                message: util.format(LAST_MSG, "+"),
                type: "BinaryExpression"
            }]
        },
        {
            code: "1 \n || 1",
            errors: [{
                message: util.format(LAST_MSG, "||"),
                type: "LogicalExpression"
            }]
        },
        {
            code: "a\n += 1",
            errors: [{
                message: util.format(LAST_MSG, "+="),
                type: "AssignmentExpression"
            }]
        },
        {
            code: "var a\n = 1",
            errors: [{
                message: util.format(LAST_MSG, "="),
                type: "VariableDeclarator"
            }]
        },

        {
            code: "1 +\n1",
            args: [2, "first"],
            errors: [{
                message: util.format(FIRST_MSG, "+"),
                type: "BinaryExpression"
            }]
        },
        {
            code: "f(1 +\n1);",
            args: [2, "first"],
            errors: [{
                message: util.format(FIRST_MSG, "+"),
                type: "BinaryExpression"
            }]
        },
        {
            code: "1 || \n 1",
            args: [2, "first"],
            errors: [{
                message: util.format(FIRST_MSG, "||"),
                type: "LogicalExpression"
            }]
        },
        {
            code: "a += \n1",
            args: [2, "first"],
            errors: [{
                message: util.format(FIRST_MSG, "+="),
                type: "AssignmentExpression"
            }]
        },
        {
            code: "var a = \n1",
            args: [2, "first"],
            errors: [{
                message: util.format(FIRST_MSG, "="),
                type: "VariableDeclarator"
            }]
        }
    ]
});
