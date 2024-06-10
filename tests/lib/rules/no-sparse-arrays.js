/**
 * @fileoverview Disallow sparse arrays
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-sparse-arrays"),
    RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-sparse-arrays", rule, {

    valid: [
        "var a = [ 1, 2, ]"
    ],

    invalid: [
        {
            code: "var a = [,];",
            errors: [{
                messageId: "unexpectedSparseArray",
                type: "ArrayExpression",
                line: 1,
                column: 10,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "var a = [ 1,, 2];",
            errors: [{
                messageId: "unexpectedSparseArray",
                type: "ArrayExpression",
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 14
            }]
        },
        {
            code: "[,,];",
            errors: [
                {
                    messageId: "unexpectedSparseArray",
                    type: "ArrayExpression",
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 3
                },
                {
                    messageId: "unexpectedSparseArray",
                    type: "ArrayExpression",
                    line: 1,
                    column: 3,
                    endLine: 1,
                    endColumn: 4
                }
            ]
        },
        {
            code: "[(( [a,] )),,,];",
            errors: [
                {
                    messageId: "unexpectedSparseArray",
                    type: "ArrayExpression",
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 14
                },
                {
                    messageId: "unexpectedSparseArray",
                    type: "ArrayExpression",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                }
            ]
        },
        {
            code: "[,(( [a,] )),,];",
            errors: [
                {
                    messageId: "unexpectedSparseArray",
                    type: "ArrayExpression",
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 3
                },
                {
                    messageId: "unexpectedSparseArray",
                    type: "ArrayExpression",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                }
            ]
        }
    ]
});
