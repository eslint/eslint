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
        { code: "for (i = 0; i < l; i++) { console.log(i); }", options: [{ allowForLoopAfterthoughts: true }] }
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
        }
    ]
});
