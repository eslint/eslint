/**
 * @fileoverview Tests for no-octal rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-octal"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-octal", rule, {
    valid: [
        "var a = 'hello world';",
        "0x1234",
        "0X5;",
        "a = 0;",
        "0.1",
        "0.5e1"
    ],
    invalid: [
        {
            code: "var a = 01234;",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "a = 1 + 01234;",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "00",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "08",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "09.1",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "09e1",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "09.1e1",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "018",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "019.1",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "019e1",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        },
        {
            code: "019.1e1",
            errors: [{
                messageId: "noOcatal",
                type: "Literal"
            }]
        }
    ]
});
