/**
 * @fileoverview Check that the Unicode BOM can be required and disallowed
 * @author Andrew Johnston <https://github.com/ehjay>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/unicode-bom"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
            errors: [expectedError]
        },
        {
            code: " // here's a comment \nvar a = 123;",
            output: "\uFEFF // here's a comment \nvar a = 123;",
            options: ["always"],
            errors: [expectedError]
        },
        {
            code: "\uFEFF var a = 123;",
            output: " var a = 123;",
            errors: [unexpectedError]
        },
        {
            code: "\uFEFF var a = 123;",
            output: " var a = 123;",
            options: ["never"],
            errors: [unexpectedError]
        }
    ]
});
