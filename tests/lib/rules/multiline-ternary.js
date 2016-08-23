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
const expectedTestConsMsg = "Expected newline between test and consequent of ternary expression.";
const expectedConsAltMsg = "Expected newline between consequent and alternate of ternary expression.";
const unexpectedTestConsMsg = "Unexpected newline between test and consequent of ternary expression.";
const unexpectedConsAltMsg = "Unexpected newline between consequent and alternate of ternary expression.";

ruleTester.run("multiline-ternary", rule, {
    valid: [

        // default "always"
        "a\n? b\n: c",
        "a ?\nb :\nc",
        "a\n? b\n? c\n: d\n: e",
        "a\n? (b\n? c\n: d)\n: e",

        // "always"
        { code: "a\n? b\n: c", options: ["always"] },
        { code: "a ?\nb :\nc", options: ["always"] },
        { code: "a\n? b\n? c\n: d\n: e", options: ["always"] },
        { code: "a\n? (b\n? c\n: d)\n: e", options: ["always"] },

        // "never"
        { code: "a ? b : c", options: ["never"] },
        { code: "a ? b ? c : d : e", options: ["never"] },
        { code: "a ? (b ? c : d) : e", options: ["never"] }
    ],

    invalid: [

        // default "always"
        {
            code: "a ? b : c",
            errors: [{
                message: expectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: expectedConsAltMsg,
                line: 1,
                column: 5
            }]
        },
        {
            code: "a\n? b : c",
            errors: [{
                message: expectedConsAltMsg,
                line: 2,
                column: 3
            }]
        },
        {
            code: "a ? b\n: c",
            errors: [{
                message: expectedTestConsMsg,
                line: 1,
                column: 1
            }]
        },
        {
            code: "a ? (b ? c : d) : e",
            errors: [{
                message: expectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: expectedConsAltMsg,
                line: 1,
                column: 6
            },
            {
                message: expectedTestConsMsg,
                line: 1,
                column: 6
            },
            {
                message: expectedConsAltMsg,
                line: 1,
                column: 10
            }]
        },
        {
            code: "a ?\n(b ? c : d) :\ne",
            errors: [{
                message: expectedTestConsMsg,
                line: 2,
                column: 2
            },
            {
                message: expectedConsAltMsg,
                line: 2,
                column: 6
            }]
        },
        {
            code: "a ? (b\n? c\n: d) : e",
            errors: [{
                message: expectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: expectedConsAltMsg,
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ?\n(b? c\n: d) : e",
            errors: [{
                message: expectedConsAltMsg,
                line: 2,
                column: 2
            },
            {
                message: expectedTestConsMsg,
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ?\n(b\n? c : d) : e",
            errors: [{
                message: expectedConsAltMsg,
                line: 2,
                column: 2
            },
            {
                message: expectedConsAltMsg,
                line: 3,
                column: 3
            }]
        },
        {
            code: "a ?\n(b\n? c\n : d) : e",
            errors: [{
                message: expectedConsAltMsg,
                line: 2,
                column: 2
            }]
        },

        // "always"
        {
            code: "a ? b : c",
            options: ["always"],
            errors: [{
                message: expectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: expectedConsAltMsg,
                line: 1,
                column: 5
            }]
        },
        {
            code: "a\n? b : c",
            options: ["always"],
            errors: [{
                message: expectedConsAltMsg,
                line: 2,
                column: 3
            }]
        },
        {
            code: "a ? b\n: c",
            options: ["always"],
            errors: [{
                message: expectedTestConsMsg,
                line: 1,
                column: 1
            }]
        },
        {
            code: "a ? (b ? c : d) : e",
            options: ["always"],
            errors: [{
                message: expectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: expectedConsAltMsg,
                line: 1,
                column: 6
            },
            {
                message: expectedTestConsMsg,
                line: 1,
                column: 6
            },
            {
                message: expectedConsAltMsg,
                line: 1,
                column: 10
            }]
        },
        {
            code: "a ?\n(b ? c : d) :\ne",
            options: ["always"],
            errors: [{
                message: expectedTestConsMsg,
                line: 2,
                column: 2
            },
            {
                message: expectedConsAltMsg,
                line: 2,
                column: 6
            }]
        },
        {
            code: "a ? (b\n? c\n: d) : e",
            options: ["always"],
            errors: [{
                message: expectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: expectedConsAltMsg,
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ?\n(b? c\n: d) : e",
            options: ["always"],
            errors: [{
                message: expectedConsAltMsg,
                line: 2,
                column: 2
            },
            {
                message: expectedTestConsMsg,
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ?\n(b\n? c : d) : e",
            options: ["always"],
            errors: [{
                message: expectedConsAltMsg,
                line: 2,
                column: 2
            },
            {
                message: expectedConsAltMsg,
                line: 3,
                column: 3
            }]
        },
        {
            code: "a ?\n(b\n? c\n : d) : e",
            options: ["always"],
            errors: [{
                message: expectedConsAltMsg,
                line: 2,
                column: 2
            }]
        },

        // "never"
        {
            code: "a\n? b : c",
            options: ["never"],
            errors: [{
                message: unexpectedTestConsMsg,
                line: 1,
                column: 1
            }]
        },
        {
            code: "a ? b\n: c",
            options: ["never"],
            errors: [{
                message: unexpectedConsAltMsg,
                line: 1,
                column: 5
            }]
        },
        {
            code: "a ?\n(b ? c : d) :\ne",
            options: ["never"],
            errors: [{
                message: unexpectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: unexpectedConsAltMsg,
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ? (b\n? c\n: d) : e",
            options: ["never"],
            errors: [{
                message: unexpectedTestConsMsg,
                line: 1,
                column: 6
            },
            {
                message: unexpectedConsAltMsg,
                line: 2,
                column: 3
            }]
        },
        {
            code: "a ?\n(b? c\n: d) : e",
            options: ["never"],
            errors: [{
                message: unexpectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: unexpectedConsAltMsg,
                line: 2,
                column: 5
            }]
        },
        {
            code: "a ?\n(b\n? c : d) : e",
            options: ["never"],
            errors: [{
                message: unexpectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: unexpectedTestConsMsg,
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ?\n(b\n? c\n : d) : e",
            options: ["never"],
            errors: [{
                message: unexpectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: unexpectedTestConsMsg,
                line: 2,
                column: 2
            },
            {
                message: unexpectedConsAltMsg,
                line: 3,
                column: 3
            }]
        },
        {
            code: "a ? (b\n? c\n: d)\n: e",
            options: ["never"],
            errors: [{
                message: unexpectedConsAltMsg,
                line: 1,
                column: 6
            },
            {
                message: unexpectedTestConsMsg,
                line: 1,
                column: 6
            },
            {
                message: unexpectedConsAltMsg,
                line: 2,
                column: 3
            }]
        },
        {
            code: "a\n?\n(b\n?\nc\n:\nd)\n:\ne",
            options: ["never"],
            errors: [{
                message: unexpectedTestConsMsg,
                line: 1,
                column: 1
            },
            {
                message: unexpectedConsAltMsg,
                line: 3,
                column: 2
            },
            {
                message: unexpectedTestConsMsg,
                line: 3,
                column: 2
            },
            {
                message: unexpectedConsAltMsg,
                line: 5,
                column: 1
            }]
        }
    ]
});
