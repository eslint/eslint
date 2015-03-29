/**
 * @fileoverview Operator linebreak rule tests
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
    BEFORE_MSG = "'%s' should be placed at the beginning of the line.",
    AFTER_MSG = "'%s' should be placed at the end of the line.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/operator-linebreak", {

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
        "var o = \nsomething",
        "o = \nsomething",

        {code: "1\n+ 1", options: ["before"]},
        {code: "1 + 1\n+ 1", options: ["before"]},
        {code: "f(1\n+ 1)", options: ["before"]},
        {code: "1 \n|| 1", options: ["before"]},
        {code: "a += 1", options: ["before"]}
    ],

    invalid: [
        {
            code: "1\n+ 1",
            errors: [{
                message: util.format(AFTER_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 1
            }]
        },
        {
            code: "1 + 2 \n + 3",
            errors: [{
                message: util.format(AFTER_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 2
            }]
        },
        {
            code: "1\n+\n1",
            errors: [{
                message: util.format(BAD_LN_BRK_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 1
            }]
        },
        {
            code: "1 + (1\n+ 1)",
            errors: [{
                message: util.format(AFTER_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 1
            }]
        },
        {
            code: "f(1\n+ 1);",
            errors: [{
                message: util.format(AFTER_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 1
            }]
        },
        {
            code: "1 \n || 1",
            errors: [{
                message: util.format(AFTER_MSG, "||"),
                type: "LogicalExpression",
                line: 2,
                column: 3
            }]
        },
        {
            code: "a\n += 1",
            errors: [{
                message: util.format(AFTER_MSG, "+="),
                type: "AssignmentExpression",
                line: 2,
                column: 3
            }]
        },
        {
            code: "var a\n = 1",
            errors: [{
                message: util.format(AFTER_MSG, "="),
                type: "VariableDeclarator",
                line: 2,
                column: 2
            }]
        },

        {
            code: "1 +\n1",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "+"),
                type: "BinaryExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "f(1 +\n1);",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "+"),
                type: "BinaryExpression",
                line: 1,
                column: 5
            }]
        },
        {
            code: "1 || \n 1",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "||"),
                type: "LogicalExpression",
                line: 1,
                column: 4
            }]
        },
        {
            code: "a += \n1",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "+="),
                type: "AssignmentExpression",
                line: 1,
                column: 4
            }]
        },
        {
            code: "var a = \n1",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "="),
                type: "VariableDeclarator",
                line: 1,
                column: 7
            }]
        }
    ]
});
