/**
 * @fileoverview Tests for no-continue rule.
 * @author Borislav Zhivkov
 * @copyright 2015 Borislav Zhivkov. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-continue", {
    valid: [
        "var sum = 0, i; for(i = 0; i < 10; i++){ if(i > 5) { sum += i; } }",
        "var sum = 0, i = 0; while(i < 10) { if(i > 5) { sum += i; } i++; }"
    ],

    invalid: [
        {
            code: "var sum = 0, i; for(i = 0; i < 10; i++){ if(i <= 5) { continue; } sum += i; }",
            errors: [{ message: "Unexpected use of continue statement",
            type: "ContinueStatement"}]
        },
        {
            code: "var sum = 0, i; myLabel: for(i = 0; i < 10; i++){ if(i <= 5) { continue myLabel; } sum += i; }",
            errors: [{ message: "Unexpected use of continue statement",
            type: "ContinueStatement"}]
        },
        {
            code: "var sum = 0, i = 0; while(i < 10) { if(i <= 5) { i++; continue; } sum += i; i++; }",
            errors: [{ message: "Unexpected use of continue statement",
            type: "ContinueStatement"}]
        },
        {
            code: "var sum = 0, i = 0; myLabel: while(i < 10) { if(i <= 5) { i++; continue myLabel; } sum += i; i++; }",
            errors: [{ message: "Unexpected use of continue statement",
            type: "ContinueStatement"}]
        }
    ]
});
