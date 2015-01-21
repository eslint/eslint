/**
 * @fileoverview Tests for no-eq-null rule.
 * @author Ian Christian Myers
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
eslintTester.addRuleTest("lib/rules/no-eq-null", {
    valid: [
        "if (x === null) { }",
        "if (null === f()) { }"
    ],
    invalid: [
        { code: "if (x == null) { }", errors: [{ message: "Use ‘===’ to compare with ‘null’.", type: "BinaryExpression"}] },
        { code: "if (x != null) { }", errors: [{ message: "Use ‘===’ to compare with ‘null’.", type: "BinaryExpression"}] },
        { code: "do {} while (null == x)", errors: [{ message: "Use ‘===’ to compare with ‘null’.", type: "BinaryExpression"}] }
    ]
});
