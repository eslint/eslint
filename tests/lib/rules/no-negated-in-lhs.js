/**
 * @fileoverview Tests for the no-negated-in-lhs rule
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-negated-in-lhs", {
    valid: [
        "a in b",
        "!(a in b)",
        "a instanceof b",
        "!(a instanceof b)"
    ],
    invalid: [
        { code: "!a in b", errors: [{ message: "The `in` expression's left operand is negated", type: "BinaryExpression"}] },
        { code: "!a instanceof b", errors: [{ message: "The `instanceof` expression's left operand is negated", type: "BinaryExpression"}] }
    ]
});
