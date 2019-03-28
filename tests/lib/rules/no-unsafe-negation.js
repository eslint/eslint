/**
 * @fileoverview Tests for no-unsafe-negation rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unsafe-negation"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const unexpectedInError = { messageId: "unexpected", data: { operator: "in" } };
const unexpectedInstanceofError = { messageId: "unexpected", data: { operator: "instanceof" } };

ruleTester.run("no-unsafe-negation", rule, {
    valid: [
        "a in b",
        "a in b === false",
        "!(a in b)",
        "(!a) in b",
        "a instanceof b",
        "a instanceof b === false",
        "!(a instanceof b)",
        "(!a) instanceof b"
    ],
    invalid: [
        {
            code: "!a in b",
            output: "!(a in b)",
            errors: [unexpectedInError]
        },
        {
            code: "(!a in b)",
            output: "(!(a in b))",
            errors: [unexpectedInError]
        },
        {
            code: "!(a) in b",
            output: "!((a) in b)",
            errors: [unexpectedInError]
        },
        {
            code: "!a instanceof b",
            output: "!(a instanceof b)",
            errors: [unexpectedInstanceofError]
        },
        {
            code: "(!a instanceof b)",
            output: "(!(a instanceof b))",
            errors: [unexpectedInstanceofError]
        },
        {
            code: "!(a) instanceof b",
            output: "!((a) instanceof b)",
            errors: [unexpectedInstanceofError]
        }
    ]
});
