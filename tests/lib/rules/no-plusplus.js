/**
 * @fileoverview Tests for no-plusplus.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-plusplus"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-plusplus", rule, {
    valid: [
        "var foo = 0; foo=+1;",

        // With "allowForLoopAfterthoughts" allowed
        { code: "var foo = 0; foo=+1;", options: [{ allowForLoopAfterthoughts: true }] },
        { code: "for (i = 0; i < l; i++) { console.log(i); }", options: [{ allowForLoopAfterthoughts: true }] },
        { code: "for (var i = 0, j = i + 1; j < example.length; i++, j++) {}", options: [{ allowForLoopAfterthoughts: true }] },
        { code: "for (;; i--, foo());", options: [{ allowForLoopAfterthoughts: true }] },
        { code: "for (;; foo(), --i);", options: [{ allowForLoopAfterthoughts: true }] },
        { code: "for (;; foo(), ++i, bar);", options: [{ allowForLoopAfterthoughts: true }] },
        { code: "for (;; i++, (++j, k--));", options: [{ allowForLoopAfterthoughts: true }] },
        { code: "for (;; foo(), (bar(), i++), baz());", options: [{ allowForLoopAfterthoughts: true }] },
        { code: "for (;; (--i, j += 2), bar = j + 1);", options: [{ allowForLoopAfterthoughts: true }] },
        { code: "for (;; a, (i--, (b, ++j, c)), d);", options: [{ allowForLoopAfterthoughts: true }] }
    ],

    invalid: [
        {
            code: "var foo = 0; foo++;",
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "++"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "var foo = 0; foo--;",
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "--"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "for (i = 0; i < l; i++) { console.log(i); }",
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "++"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "for (i = 0; i < l; foo, i++) { console.log(i); }",
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "++"
                },
                type: "UpdateExpression"
            }]
        },

        // With "allowForLoopAfterthoughts" allowed
        {
            code: "var foo = 0; foo++;",
            options: [{ allowForLoopAfterthoughts: true }],
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "++"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "for (i = 0; i < l; i++) { v++; }",
            options: [{ allowForLoopAfterthoughts: true }],
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "++"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "for (i++;;);",
            options: [{ allowForLoopAfterthoughts: true }],
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "++"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "for (;--i;);",
            options: [{ allowForLoopAfterthoughts: true }],
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "--"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "for (;;) ++i;",
            options: [{ allowForLoopAfterthoughts: true }],
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "++"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "for (;; i = j++);",
            options: [{ allowForLoopAfterthoughts: true }],
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "++"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "for (;; i++, f(--j));",
            options: [{ allowForLoopAfterthoughts: true }],
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "--"
                },
                type: "UpdateExpression"
            }]
        },
        {
            code: "for (;; foo + (i++, bar));",
            options: [{ allowForLoopAfterthoughts: true }],
            errors: [{
                messageId: "unexpectedUnaryOp",
                data: {
                    operator: "++"
                },
                type: "UpdateExpression"
            }]
        }
    ]
});
