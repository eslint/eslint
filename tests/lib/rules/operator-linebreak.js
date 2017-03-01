/**
 * @fileoverview Operator linebreak rule tests
 * @author Benoît Zugmeyer
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const util = require("util");
const rule = require("../../../lib/rules/operator-linebreak"),
    RuleTester = require("../../../lib/testers/rule-tester");

const BAD_LN_BRK_MSG = "Bad line breaking before and after '%s'.",
    BEFORE_MSG = "'%s' should be placed at the beginning of the line.",
    AFTER_MSG = "'%s' should be placed at the end of the line.",
    NONE_MSG = "There should be no line break before or after '%s'.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("operator-linebreak", rule, {

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
        "'a\\\n' +\n 'c'",
        "'a' +\n 'b\\\n'",
        "(a\n) + b",
        "answer = everything \n?  42 \n:  foo;",
        { code: "answer = everything ?\n  42 :\n  foo;", options: ["after"] },

        { code: "a ? 1 + 1\n:2", options: [null, { overrides: { "?": "after" } }] },
        { code: "a ?\n1 +\n 1\n:2", options: [null, { overrides: { "?": "after" } }] },
        { code: "o = 1 \n+ 1 - foo", options: [null, { overrides: { "+": "before" } }] },

        { code: "1\n+ 1", options: ["before"] },
        { code: "1 + 1\n+ 1", options: ["before"] },
        { code: "f(1\n+ 1)", options: ["before"] },
        { code: "1 \n|| 1", options: ["before"] },
        { code: "a += 1", options: ["before"] },
        { code: "answer = everything \n?  42 \n:  foo;", options: ["before"] },

        { code: "1 + 1", options: ["none"] },
        { code: "1 + 1 + 1", options: ["none"] },
        { code: "1 || 1", options: ["none"] },
        { code: "a += 1", options: ["none"] },
        { code: "var a;", options: ["none"] },
        { code: "\n1 + 1", options: ["none"] },
        { code: "1 + 1\n", options: ["none"] },
        { code: "answer = everything ? 42 : foo;", options: ["none"] },
        { code: "answer = everything \n?\n 42 : foo;", options: [null, { overrides: { "?": "ignore" } }] },
        { code: "answer = everything ? 42 \n:\n foo;", options: [null, { overrides: { ":": "ignore" } }] }
    ],

    invalid: [
        {
            code: "1\n+ 1",
            output: "1 +\n1",
            errors: [{
                message: util.format(AFTER_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 2
            }]
        },
        {
            code: "1 + 2 \n + 3",
            output: "1 + 2 + \n 3",
            errors: [{
                message: util.format(AFTER_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 3
            }]
        },
        {
            code: "1\n+\n1",
            output: "1+\n1",
            errors: [{
                message: util.format(BAD_LN_BRK_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 2
            }]
        },
        {
            code: "1 + (1\n+ 1)",
            output: "1 + (1 +\n1)",
            errors: [{
                message: util.format(AFTER_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 2
            }]
        },
        {
            code: "f(1\n+ 1);",
            output: "f(1 +\n1);",
            errors: [{
                message: util.format(AFTER_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 2
            }]
        },
        {
            code: "1 \n || 1",
            output: "1 || \n 1",
            errors: [{
                message: util.format(AFTER_MSG, "||"),
                type: "LogicalExpression",
                line: 2,
                column: 4
            }]
        },
        {
            code: "a\n += 1",
            output: "a +=\n 1",
            errors: [{
                message: util.format(AFTER_MSG, "+="),
                type: "AssignmentExpression",
                line: 2,
                column: 4
            }]
        },
        {
            code: "var a\n = 1",
            output: "var a =\n 1",
            errors: [{
                message: util.format(AFTER_MSG, "="),
                type: "VariableDeclarator",
                line: 2,
                column: 3
            }]
        },
        {
            code: "(b)\n*\n(c)",
            output: "(b)*\n(c)",
            errors: [{
                message: util.format(BAD_LN_BRK_MSG, "*"),
                type: "BinaryExpression",
                line: 2,
                column: 2
            }]
        },
        {
            code: "answer = everything ?\n  42 :\n  foo;",
            output: "answer = everything\n  ? 42\n  : foo;",
            errors: [{
                message: util.format(BEFORE_MSG, "?"),
                type: "ConditionalExpression",
                line: 1,
                column: 22
            },
            {
                message: util.format(BEFORE_MSG, ":"),
                type: "ConditionalExpression",
                line: 2,
                column: 7
            }]
        },

        {
            code: "answer = everything \n?  42 \n:  foo;",
            output: "answer = everything  ? \n42  : \nfoo;",
            options: ["after"],
            errors: [{
                message: util.format(AFTER_MSG, "?"),
                type: "ConditionalExpression",
                line: 2,
                column: 2
            },
            {
                message: util.format(AFTER_MSG, ":"),
                type: "ConditionalExpression",
                line: 3,
                column: 2
            }]
        },

        {
            code: "1 +\n1",
            output: "1\n+ 1",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "+"),
                type: "BinaryExpression",
                line: 1,
                column: 4
            }]
        },
        {
            code: "f(1 +\n1);",
            output: "f(1\n+ 1);",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "+"),
                type: "BinaryExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "1 || \n 1",
            output: "1 \n || 1",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "||"),
                type: "LogicalExpression",
                line: 1,
                column: 5
            }]
        },
        {
            code: "a += \n1",
            output: "a \n+= 1",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "+="),
                type: "AssignmentExpression",
                line: 1,
                column: 5
            }]
        },
        {
            code: "var a = \n1",
            output: "var a \n= 1",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "="),
                type: "VariableDeclarator",
                line: 1,
                column: 8
            }]
        },
        {
            code: "answer = everything ?\n  42 :\n  foo;",
            output: "answer = everything\n  ? 42\n  : foo;",
            options: ["before"],
            errors: [{
                message: util.format(BEFORE_MSG, "?"),
                type: "ConditionalExpression",
                line: 1,
                column: 22
            },
            {
                message: util.format(BEFORE_MSG, ":"),
                type: "ConditionalExpression",
                line: 2,
                column: 7
            }]
        },

        {
            code: "1 +\n1",
            output: "1 +1",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "+"),
                type: "BinaryExpression",
                line: 1,
                column: 4
            }]
        },
        {
            code: "1\n+1",
            output: "1+1",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 2
            }]
        },
        {
            code: "f(1 +\n1);",
            output: "f(1 +1);",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "+"),
                type: "BinaryExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "f(1\n+ 1);",
            output: "f(1+ 1);",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "+"),
                type: "BinaryExpression",
                line: 2,
                column: 2
            }]
        },
        {
            code: "1 || \n 1",
            output: "1 ||  1",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "||"),
                type: "LogicalExpression",
                line: 1,
                column: 5
            }]
        },
        {
            code: "1 \n || 1",
            output: "1  || 1",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "||"),
                type: "LogicalExpression",
                line: 2,
                column: 4
            }]
        },
        {
            code: "a += \n1",
            output: "a += 1",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "+="),
                type: "AssignmentExpression",
                line: 1,
                column: 5
            }]
        },
        {
            code: "a \n+= 1",
            output: "a += 1",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "+="),
                type: "AssignmentExpression",
                line: 2,
                column: 3
            }]
        },
        {
            code: "var a = \n1",
            output: "var a = 1",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "="),
                type: "VariableDeclarator",
                line: 1,
                column: 8
            }]
        },
        {
            code: "var a \n = 1",
            output: "var a  = 1",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "="),
                type: "VariableDeclarator",
                line: 2,
                column: 3
            }]
        },
        {
            code: "answer = everything ?\n  42 \n:  foo;",
            output: "answer = everything ?  42 :  foo;",
            options: ["none"],
            errors: [{
                message: util.format(NONE_MSG, "?"),
                type: "ConditionalExpression",
                line: 1,
                column: 22
            },
            {
                message: util.format(NONE_MSG, ":"),
                type: "ConditionalExpression",
                line: 3,
                column: 2
            }]
        },
        {
            code: "answer = everything\n?\n42 + 43\n:\nfoo;",
            output: "answer = everything?42 + 43:foo;",
            options: ["none"],
            errors: [{
                message: util.format(BAD_LN_BRK_MSG, "?"),
                type: "ConditionalExpression",
                line: 2,
                column: 2
            },
            {
                message: util.format(BAD_LN_BRK_MSG, ":"),
                type: "ConditionalExpression",
                line: 4,
                column: 2
            }]
        },
        {
            code: "foo +=\n42;\nbar -=\n12\n+ 5;",
            output: "foo +=42;\nbar -=\n12\n+ 5;",
            options: ["after", { overrides: { "+=": "none", "+": "before" } }],
            errors: [{
                message: util.format(NONE_MSG, "+="),
                type: "AssignmentExpression",
                line: 1,
                column: 7
            }]
        },
        {
            code: "answer = everything\n?\n42\n:\nfoo;",
            output: "answer = everything\n?\n42\n:foo;",
            options: ["after", { overrides: { "?": "ignore", ":": "before" } }],
            errors: [{
                message: util.format(BAD_LN_BRK_MSG, ":"),
                type: "ConditionalExpression",
                line: 4,
                column: 2
            }]
        },
        {

            // Insert an additional space to avoid changing the operator to ++ or --.
            code: "foo+\n+bar",
            output: "foo\n+ +bar",
            options: ["before"],
            errors: [{ message: util.format(BEFORE_MSG, "+"), type: "BinaryExpression", line: 1, column: 5 }]
        },
        {
            code: "foo //comment\n&& bar",
            output: "foo && //comment\nbar",
            errors: [{ message: util.format(AFTER_MSG, "&&"), type: "LogicalExpression", line: 2, column: 3 }]
        },
        {
            code: "foo//comment\n+\nbar",
            output: null,
            errors: [{ message: util.format(BAD_LN_BRK_MSG, "+"), type: "BinaryExpression", line: 2, column: 2 }]
        },
        {
            code: "foo\n+//comment\nbar",
            output: null,
            options: ["before"],
            errors: [{ message: util.format(BAD_LN_BRK_MSG, "+"), type: "BinaryExpression", line: 2, column: 2 }]
        },
        {
            code: "foo /* a */ \n+ /* b */ bar",
            output: null, // Not fixed because there is a comment on both sides
            errors: [{ message: util.format(AFTER_MSG, "+"), type: "BinaryExpression", line: 2, column: 2 }]
        },
        {
            code: "foo /* a */ +\n /* b */ bar",
            output: null, // Not fixed because there is a comment on both sides
            options: ["before"],
            errors: [{ message: util.format(BEFORE_MSG, "+"), type: "BinaryExpression", line: 1, column: 14 }]
        }
    ]
});
