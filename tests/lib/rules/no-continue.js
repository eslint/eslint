/**
 * @fileoverview Tests for no-continue rule.
 * @author Borislav Zhivkov
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-continue"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-continue", rule, {
    valid: [
        "var sum = 0, i; for(i = 0; i < 10; i++){ if(i > 5) { sum += i; } }",
        "var sum = 0, i = 0; while(i < 10) { if(i > 5) { sum += i; } i++; }"
    ],

    invalid: [
        {
            code: "var sum = 0, i; for(i = 0; i < 10; i++){ if(i <= 5) { continue; } sum += i; }",
            errors: [{
                messageId: "unexpected",
                type: "ContinueStatement"
            }]
        },
        {
            code: "var sum = 0, i; myLabel: for(i = 0; i < 10; i++){ if(i <= 5) { continue myLabel; } sum += i; }",
            errors: [{
                messageId: "unexpected",
                type: "ContinueStatement"
            }]
        },
        {
            code: "var sum = 0, i = 0; while(i < 10) { if(i <= 5) { i++; continue; } sum += i; i++; }",
            errors: [{
                messageId: "unexpected",
                type: "ContinueStatement"
            }]
        },
        {
            code: "var sum = 0, i = 0; myLabel: while(i < 10) { if(i <= 5) { i++; continue myLabel; } sum += i; i++; }",
            errors: [{
                messageId: "unexpected",
                type: "ContinueStatement"
            }]
        }
    ]
});
