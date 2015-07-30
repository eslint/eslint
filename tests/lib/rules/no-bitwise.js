/**
 * @fileoverview Tests for no-bitwise rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-bitwise"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-bitwise", rule, {
    valid: [
        "a + b",
        "!a",
        "a += b"
    ],
    invalid: [
        { code: "a ^ b", errors: [{ message: "Unexpected use of '^'.", type: "BinaryExpression"}] },
        { code: "a | b", errors: [{ message: "Unexpected use of '|'.", type: "BinaryExpression"}] },
        { code: "a & b", errors: [{ message: "Unexpected use of '&'.", type: "BinaryExpression"}] },
        { code: "a << b", errors: [{ message: "Unexpected use of '<<'.", type: "BinaryExpression"}] },
        { code: "a >> b", errors: [{ message: "Unexpected use of '>>'.", type: "BinaryExpression"}] },
        { code: "a >>> b", errors: [{ message: "Unexpected use of '>>>'.", type: "BinaryExpression"}] },
        { code: "~a", errors: [{ message: "Unexpected use of '~'.", type: "UnaryExpression"}] },
        { code: "a ^= b", errors: [{ message: "Unexpected use of '^='.", type: "AssignmentExpression" }] },
        { code: "a |= b", errors: [{ message: "Unexpected use of '|='.", type: "AssignmentExpression" }] },
        { code: "a &= b", errors: [{ message: "Unexpected use of '&='.", type: "AssignmentExpression" }] },
        { code: "a <<= b", errors: [{ message: "Unexpected use of '<<='.", type: "AssignmentExpression" }] },
        { code: "a >>= b", errors: [{ message: "Unexpected use of '>>='.", type: "AssignmentExpression" }] },
        { code: "a >>>= b", errors: [{ message: "Unexpected use of '>>>='.", type: "AssignmentExpression" }] }
    ]
});
