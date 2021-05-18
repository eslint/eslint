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
        "a => { return 1 ? 2 : 3; }",
        "var x = a => { return 1 ? 2 : 3; }",
        "var x = (a) => { return 1 ? 2 : 3; }",
        { code: "var x = a => (1 ? 2 : 3)", options: [{ allowParens: true }] }
    ],
    invalid: [
        {
            code: "a => 1 ? 2 : 3",
            output: null,
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = a => 1 ? 2 : 3",
            output: null,
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = (a) => 1 ? 2 : 3",
            output: null,
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = a => (1 ? 2 : 3)",
            output: null,
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "a => 1 ? 2 : 3",
            output: "a => (1 ? 2 : 3)",
            options: [{ allowParens: true }],
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = a => 1 ? 2 : 3",
            output: "var x = a => (1 ? 2 : 3)",
            options: [{ allowParens: true }],
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = (a) => 1 ? 2 : 3",
            output: "var x = (a) => (1 ? 2 : 3)",
            options: [{ allowParens: true }],
            errors: [{ messageId: "confusing" }]
        }
    ]
});
