/**
 * @fileoverview Enforce newlines between operands of ternary expressions
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/multiline-ternary");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const testConsMsg = "Expected newline between test and consequent of ternary expression.";
const consAltMsg = "Expected newline between consequent and alternate of ternary expression.";

ruleTester.run("multiline-ternary", rule, {
    valid: [
        "a\n? b\n: c",
        "a ?\nb :\nc",
        "a\n? b\n? c\n: d\n: e",
    ],

    invalid: [
        {
            code: "a ? b : c",
            errors: [{
                message: testConsMsg,
                line: 1,
                column: 1
            },
            {
                message: consAltMsg,
                line: 1,
                column: 5
            }]
        },
        {
            code: "a\n? b : c",
            errors: [{
                message: consAltMsg,
                line: 2,
                column: 3
            }]
        },
        {
            code: "a ? b\n: c",
            errors: [{
                message: testConsMsg,
                line: 1,
                column: 1
            }]
        },
        {
            code: "a ? (b ? c : d) : e",
            errors: [{
                message: testConsMsg,
                line: 1,
                column: 1
            },
            {
                message: consAltMsg,
                line: 1,
                column: 6
            },
            {
                message: testConsMsg,
                line: 1,
                column: 6
            },
            {
                message: consAltMsg,
                line: 1,
                column: 10
            }]
        },
        {
            code: "a ?\n(b ? c : d) :\ne",
            errors: [{
                message: testConsMsg,
                line: 2,
                column: 2
            },
            {
                message: consAltMsg,
                line: 2,
                column: 6
            }]
        },
        {
            code: "a ? (b\n? c\n: d) : e",
            errors: [{
                message: testConsMsg,
                line: 1,
                column: 1
            },
            {
                message: consAltMsg,
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ?\n(b? c\n: d) : e",
            errors: [{
                message: consAltMsg,
                line: 2,
                column: 2
            },
            {
                message: testConsMsg,
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ?\n(b\n? c : d) : e",
            errors: [{
                message: consAltMsg,
                line: 2,
                column: 2
            },
            {
                message: consAltMsg,
                line: 3,
                column: 3
            }]
        },
        {
            code: "a ?\n(b\n? c\n : d) : e",
            errors: [{
                message: consAltMsg,
                line: 2,
                column: 2
            }]
        }
    ]
});
