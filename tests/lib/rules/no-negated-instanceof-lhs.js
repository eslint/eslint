/**
 * @fileoverview Tests for the no-negated-instanceof-lhs rule
 * @author Kevin Partington
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-negated-instanceof-lhs"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-negated-instanceof-lhs", rule, {
    valid: [
        "a instanceof b",
        "!(a instanceof b)"
    ],
    invalid: [{
        code: "!a instanceof b",
        errors: [{
            message: "The `instanceof` expression's left operand is negated",
            type: "BinaryExpression"
        }]
    }]
});
