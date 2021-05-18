/**
 * @fileoverview Tests for the no-negated-in-lhs rule
 * @author Michael Ficarra
 * @deprecated in ESLint v3.3.0
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-negated-in-lhs"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-negated-in-lhs", rule, {
    valid: [
        "a in b",
        "!(a in b)"
    ],
    invalid: [
        { code: "!a in b", errors: [{ message: "The 'in' expression's left operand is negated.", type: "BinaryExpression" }] }
    ]
});
