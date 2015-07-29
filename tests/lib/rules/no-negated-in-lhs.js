/**
 * @fileoverview Tests for the no-negated-in-lhs rule
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-negated-in-lhs"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-negated-in-lhs", rule, {
    valid: [
        "a in b",
        "!(a in b)"
    ],
    invalid: [
        { code: "!a in b", errors: [{ message: "The `in` expression's left operand is negated", type: "BinaryExpression"}] }
    ]
});
