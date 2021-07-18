/**
 * @fileoverview Check that the Unicode BOM can be required and disallowed
 * @author Andrew Johnston <https://github.com/ehjay>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/unicode-bom"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const expectedError = { messageId: "expected", type: "Program" };
const unexpectedError = { messageId: "unexpected", type: "Program" };

ruleTester.run("unicode-bom", rule, {

    valid: [
        {
            code: "\uFEFF var a = 123;",
            options: ["always"]
        },
        {
            code: "var a = 123;",
            options: ["never"]
        },
        {
            code: "var a = 123; \uFEFF",
            options: ["never"]
        }
    ],

    invalid: [
        {
            code: "var a = 123;",
            output: "\uFEFFvar a = 123;",
            options: ["always"],
            errors: [{
                ...expectedError,
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 4

            }]
        },
        {
            code: " // here's a comment \nvar a = 123;",
            output: "\uFEFF // here's a comment \nvar a = 123;",
            options: ["always"],
            errors: [{
                ...expectedError,
                line: 1,
                column: 1,
                endLine: 2,
                endColumn: 4

            }]
        },
        {
            code: "\uFEFF var a = 123;",
            output: " var a = 123;",
            errors: [{
                ...unexpectedError,
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 5

            }]
        },
        {
            code: "\uFEFF var a = 123;",
            output: " var a = 123;",
            options: ["never"],
            errors: [{
                ...unexpectedError,
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 5

            }]
        }
    ]
});
