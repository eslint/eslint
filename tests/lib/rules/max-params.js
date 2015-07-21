/**
 * @fileoverview Tests for max-params rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/max-params", {
    valid: [
        "function test(d, e, f) {}",
        { code: "var test = function(a, b, c) {};", args: [1, 3] },
        { code: "var test = (a, b, c) => {};", args: [1, 3], ecmaFeatures: { arrowFunctions: true } },
        { code: "var test = function test(a, b, c) {};", args: [1, 3] }
    ],
    invalid: [
        { code: "function test(a, b, c) {}", args: [1, 2], errors: [{ message: "This function has too many parameters (3). Maximum allowed is 2.", type: "FunctionDeclaration"}] },
        { code: "function test(a, b, c, d) {}", errors: [{ message: "This function has too many parameters (4). Maximum allowed is 3.", type: "FunctionDeclaration"}] },
        { code: "var test = function(a, b, c, d) {};", args: [1, 3], errors: [{ message: "This function has too many parameters (4). Maximum allowed is 3.", type: "FunctionExpression"}] },
        { code: "var test = (a, b, c, d) => {};", args: [1, 3], ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "This function has too many parameters (4). Maximum allowed is 3.", type: "ArrowFunctionExpression"}] },
        { code: "(function(a, b, c, d) {});", args: [1, 3], errors: [{ message: "This function has too many parameters (4). Maximum allowed is 3.", type: "FunctionExpression"}] },
        { code: "var test = function test(a, b, c) {};", args: [1, 1], errors: [{ message: "This function has too many parameters (3). Maximum allowed is 1.", type: "FunctionExpression"}] }
    ]
});
