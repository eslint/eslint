/**
 * @fileoverview Tests for no-wrap-func rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-wrap-func", {
    valid: [
        "(function() {})()",
        "var a = function() {}",
        "new Object(function() {})",
        {
            code: "opts.ease = opts.ease || (a => a * a * a)",
            ecmaFeatures: { arrowFunctions: true }
        }
    ],
    invalid: [
        { code: "(() => {});", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "Wrapping non-IIFE function literals in parens is unnecessary.", type: "ArrowFunctionExpression"}] },
        { code: "opts.ease = opts.ease || (function() {});", errors: [{ message: "Wrapping non-IIFE function literals in parens is unnecessary.", type: "FunctionExpression"}] },
        { code: "(function() {});", errors: [{ message: "Wrapping non-IIFE function literals in parens is unnecessary.", type: "FunctionExpression"}] },
        { code: "var a = (function() {});", errors: [{ message: "Wrapping non-IIFE function literals in parens is unnecessary.", type: "FunctionExpression"}] }
    ]
});
