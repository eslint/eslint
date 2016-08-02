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

ruleTester.run("no-unsafe-negation", rule, {
    valid: [
        "a in b",
        "a in b === false",
        "!(a in b)",
        "(!a) in b",
        "a instanceof b",
        "a instanceof b === false",
        "!(a instanceof b)",
        "(!a) instanceof b",
    ],
    invalid: [
        {
            code: "!a in b",
            output: "!(a in b)",
            errors: ["Unexpected negating the left operand of 'in' operator."]
        },
        {
            code: "(!a in b)",
            output: "(!(a in b))",
            errors: ["Unexpected negating the left operand of 'in' operator."]
        },
        {
            code: "!(a) in b",
            output: "!((a) in b)",
            errors: ["Unexpected negating the left operand of 'in' operator."]
        },
        {
            code: "!a instanceof b",
            output: "!(a instanceof b)",
            errors: ["Unexpected negating the left operand of 'instanceof' operator."]
        },
        {
            code: "(!a instanceof b)",
            output: "(!(a instanceof b))",
            errors: ["Unexpected negating the left operand of 'instanceof' operator."]
        },
        {
            code: "!(a) instanceof b",
            output: "!((a) instanceof b)",
            errors: ["Unexpected negating the left operand of 'instanceof' operator."]
        },
    ]
});
