/**
 * @fileoverview Tests for no-wrap-func rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-wrap-func", {
    valid: [
        "(function() {})()",
        "var a = function() {}",
        "new Object(function() {})"
    ],
    invalid: [
        { code: "(function() {});", errors: [{ message: "Wrapping non-IIFE function literals in parens is unnecessary.", type: "FunctionExpression"}] },
        { code: "var a = (function() {});", errors: [{ message: "Wrapping non-IIFE function literals in parens is unnecessary.", type: "FunctionExpression"}] }
    ]
});
