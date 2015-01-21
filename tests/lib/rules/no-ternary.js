/**
 * @fileoverview Tests for no-ternary.
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
eslintTester.addRuleTest("lib/rules/no-ternary", {
    valid: [
        "\"x ? y\";"
    ],
    invalid: [
        { code: "var foo = true ? thing : stuff;", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] },
        { code: "true ? thing() : stuff();", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] },
        { code: "function foo(bar) { return bar ? baz : qux; }", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] }
    ]
});
