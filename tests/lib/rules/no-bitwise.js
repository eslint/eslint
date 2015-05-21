/**
 * @fileoverview Tests for no-bitwise rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint, validate);
eslintTester.addRuleTest("lib/rules/no-bitwise", {
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
