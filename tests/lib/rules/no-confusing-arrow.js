/**
 * @fileoverview Tests for no-confusing-arrow rule.
 * @author Jxck <https://github.com/Jxck>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-confusing-arrow"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-confusing-arrow", rule, {
    valid: [
        { code: "a => { return 1 ? 2 : 3; }" },
        { code: "var x = a => { return 1 ? 2 : 3; }" },
        { code: "var x = (a) => { return 1 ? 2 : 3; }" },
        { code: "var x = a => (1 ? 2 : 3)", options: [{ allowParens: true }] }
    ],
    invalid: [
        {
            code: "a => 1 ? 2 : 3",
            errors: [{ message: "Arrow function used ambiguously with a conditional expression." }]
        },
        {
            code: "var x = a => 1 ? 2 : 3",
            errors: [{ message: "Arrow function used ambiguously with a conditional expression." }]
        },
        {
            code: "var x = (a) => 1 ? 2 : 3",
            errors: [{ message: "Arrow function used ambiguously with a conditional expression." }]
        },
        {
            code: "var x = a => (1 ? 2 : 3)",
            errors: [{ message: "Arrow function used ambiguously with a conditional expression." }]
        }
    ]
});
