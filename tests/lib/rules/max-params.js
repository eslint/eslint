/**
 * @fileoverview Tests for max-params rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/max-params"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("max-params", rule, {
    valid: [
        "function test(d, e, f) {}",
        { code: "var test = function(a, b, c) {};", options: [3] },
        { code: "var test = (a, b, c) => {};", options: [3], ecmaFeatures: { arrowFunctions: true } },
        { code: "var test = function test(a, b, c) {};", options: [3] }
    ],
    invalid: [
        { code: "function test(a, b, c) {}", options: [2], errors: [{ message: "This function has too many parameters (3). Maximum allowed is 2.", type: "FunctionDeclaration"}] },
        { code: "function test(a, b, c, d) {}", errors: [{ message: "This function has too many parameters (4). Maximum allowed is 3.", type: "FunctionDeclaration"}] },
        { code: "var test = function(a, b, c, d) {};", options: [3], errors: [{ message: "This function has too many parameters (4). Maximum allowed is 3.", type: "FunctionExpression"}] },
        { code: "var test = (a, b, c, d) => {};", options: [3], ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "This function has too many parameters (4). Maximum allowed is 3.", type: "ArrowFunctionExpression"}] },
        { code: "(function(a, b, c, d) {});", options: [3], errors: [{ message: "This function has too many parameters (4). Maximum allowed is 3.", type: "FunctionExpression"}] },
        { code: "var test = function test(a, b, c) {};", options: [1], errors: [{ message: "This function has too many parameters (3). Maximum allowed is 1.", type: "FunctionExpression"}] }
    ]
});
