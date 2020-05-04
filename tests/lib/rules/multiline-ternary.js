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

        // "always-multiline"
        { code: "a\n? b\n: c", options: ["always-multiline"] },
        { code: "a ?\nb :\nc", options: ["always-multiline"] },
        { code: "a\n? b\n? c\n: d\n: e", options: ["always-multiline"] },
        { code: "a\n? (b\n? c\n: d)\n: e", options: ["always-multiline"] },
        { code: "a ? b : c", options: ["always-multiline"] },
        { code: "a ? b ? c : d : e", options: ["always-multiline"] },
        { code: "a ? (b ? c : d) : e", options: ["always-multiline"] },
        { code: "a\n? (b ? c : d)\n: e", options: ["always-multiline"] },
        { code: "a ?\n(b ? c : d) :\ne", options: ["always-multiline"] },

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
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 5
            }]
        },
        {
            code: "a\n? b : c",
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 3
            }]
        },
        {
            code: "a ? b\n: c",
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            }]
        },
        {
            code: "a ? (b ? c : d) : e",
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 6
            },
            {
                messageId: "expectedTestCons",
                line: 1,
                column: 6
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 10
            }]
        },
        {
            code: "a ?\n(b ? c : d) :\ne",
            errors: [{
                messageId: "expectedTestCons",
                line: 2,
                column: 2
            },
            {
                messageId: "expectedConsAlt",
                line: 2,
                column: 6
            }]
        },
        {
            code: "a ? (b\n? c\n: d) : e",
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ?\n(b? c\n: d) : e",
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            },
            {
                messageId: "expectedTestCons",
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ?\n(b\n? c : d) : e",
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            },
            {
                messageId: "expectedConsAlt",
                line: 3,
                column: 3
            }]
        },
        {
            code: "a ?\n(b\n? c\n : d) : e",
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            }]
        },

        // "always"
        {
            code: "a ? b : c",
            options: ["always"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 5
            }]
        },
        {
            code: "a\n? b : c",
            options: ["always"],
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 3
            }]
        },
        {
            code: "a ? b\n: c",
            options: ["always"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            }]
        },
        {
            code: "a ? (b ? c : d) : e",
            options: ["always"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 6
            },
            {
                messageId: "expectedTestCons",
                line: 1,
                column: 6
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 10
            }]
        },
        {
            code: "a ?\n(b ? c : d) :\ne",
            options: ["always"],
            errors: [{
                messageId: "expectedTestCons",
                line: 2,
                column: 2
            },
            {
                messageId: "expectedConsAlt",
                line: 2,
                column: 6
            }]
        },
        {
            code: "a ? (b\n? c\n: d) : e",
            options: ["always"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ?\n(b? c\n: d) : e",
            options: ["always"],
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            },
            {
                messageId: "expectedTestCons",
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ?\n(b\n? c : d) : e",
            options: ["always"],
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            },
            {
                messageId: "expectedConsAlt",
                line: 3,
                column: 3
            }]
        },
        {
            code: "a ?\n(b\n? c\n : d) : e",
            options: ["always"],
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            }]
        },

        // "always-multiline"
        {
            code: "a\n? b : c",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 3
            }]
        },
        {
            code: "a ? b\n: c",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            }]
        },
        {
            code: "a &&\nb ? c : d",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 2,
                column: 5
            }]
        },
        {
            code: "a ? b +\nc : d",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 5
            }]
        },
        {
            code: "a ? b : c +\nd",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 5
            }]
        },
        {
            code: "a ?\n(b ? c : d) : e",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ? (b ? c : d) :\ne",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            }]
        },
        {
            code: "a ? (b\n? c\n: d) : e",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "expectedConsAlt",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ?\n(b ? c\n: d) : e",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            },
            {
                messageId: "expectedTestCons",
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ?\n(b\n? c : d) : e",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            },
            {
                messageId: "expectedConsAlt",
                line: 3,
                column: 3
            }]
        },
        {
            code: "a ?\n(b\n? c\n : d) : e",
            options: ["always-multiline"],
            errors: [{
                messageId: "expectedConsAlt",
                line: 2,
                column: 2
            }]
        },

        // "never"
        {
            code: "a\n? b : c",
            options: ["never"],
            errors: [{
                messageId: "unexpectedTestCons",
                line: 1,
                column: 1
            }]
        },
        {
            code: "a ? b\n: c",
            options: ["never"],
            errors: [{
                messageId: "unexpectedConsAlt",
                line: 1,
                column: 5
            }]
        },
        {
            code: "a ?\n(b ? c : d) :\ne",
            options: ["never"],
            errors: [{
                messageId: "unexpectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "unexpectedConsAlt",
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ? (b\n? c\n: d) : e",
            options: ["never"],
            errors: [{
                messageId: "unexpectedTestCons",
                line: 1,
                column: 6
            },
            {
                messageId: "unexpectedConsAlt",
                line: 2,
                column: 3
            }]
        },
        {
            code: "a ?\n(b? c\n: d) : e",
            options: ["never"],
            errors: [{
                messageId: "unexpectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "unexpectedConsAlt",
                line: 2,
                column: 5
            }]
        },
        {
            code: "a ?\n(b\n? c : d) : e",
            options: ["never"],
            errors: [{
                messageId: "unexpectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "unexpectedTestCons",
                line: 2,
                column: 2
            }]
        },
        {
            code: "a ?\n(b\n? c\n : d) : e",
            options: ["never"],
            errors: [{
                messageId: "unexpectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "unexpectedTestCons",
                line: 2,
                column: 2
            },
            {
                messageId: "unexpectedConsAlt",
                line: 3,
                column: 3
            }]
        },
        {
            code: "a ? (b\n? c\n: d)\n: e",
            options: ["never"],
            errors: [{
                messageId: "unexpectedConsAlt",
                line: 1,
                column: 6
            },
            {
                messageId: "unexpectedTestCons",
                line: 1,
                column: 6
            },
            {
                messageId: "unexpectedConsAlt",
                line: 2,
                column: 3
            }]
        },
        {
            code: "a\n?\n(b\n?\nc\n:\nd)\n:\ne",
            options: ["never"],
            errors: [{
                messageId: "unexpectedTestCons",
                line: 1,
                column: 1
            },
            {
                messageId: "unexpectedConsAlt",
                line: 3,
                column: 2
            },
            {
                messageId: "unexpectedTestCons",
                line: 3,
                column: 2
            },
            {
                messageId: "unexpectedConsAlt",
                line: 5,
                column: 1
            }]
        }
    ]
});
