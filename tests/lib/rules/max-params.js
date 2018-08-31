/**
 * @fileoverview Tests for max-params rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-params"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("max-params", rule, {
    valid: [
        "function test(d, e, f) {}",
        { code: "var test = function(a, b, c) {};", options: [3] },
        { code: "var test = (a, b, c) => {};", options: [3], parserOptions: { ecmaVersion: 6 } },
        { code: "var test = function test(a, b, c) {};", options: [3] },

        // object property options
        { code: "var test = function(a, b, c) {};", options: [{ max: 3 }] }
    ],
    invalid: [
        {
            code: "function test(a, b, c) {}",
            options: [2],
            errors: [{
                message: "Function 'test' has too many parameters (3). Maximum allowed is 2.",
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "function test(a, b, c, d) {}",
            errors: [{
                message: "Function 'test' has too many parameters (4). Maximum allowed is 3.",
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "var test = function(a, b, c, d) {};",
            options: [3],
            errors: [{
                message: "Function has too many parameters (4). Maximum allowed is 3.",
                type: "FunctionExpression"
            }]
        },
        {
            code: "var test = (a, b, c, d) => {};",
            options: [3],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Arrow function has too many parameters (4). Maximum allowed is 3.",
                type: "ArrowFunctionExpression"
            }]
        },
        {
            code: "(function(a, b, c, d) {});",
            options: [3],
            errors: [{
                message: "Function has too many parameters (4). Maximum allowed is 3.",
                type: "FunctionExpression"
            }]
        },
        {
            code: "var test = function test(a, b, c) {};",
            options: [1],
            errors: [{
                message: "Function 'test' has too many parameters (3). Maximum allowed is 1.",
                type: "FunctionExpression"
            }]
        },

        // object property options
        {
            code: "function test(a, b, c) {}",
            options: [{ max: 2 }],
            errors: [{
                message: "Function 'test' has too many parameters (3). Maximum allowed is 2.",
                type: "FunctionDeclaration"
            }]
        },

        // Error location should not cover the entire function; just the name.
        {
            code: `function test(a, b, c) {
              // Just to make it longer
            }`,
            options: [{ max: 2 }],
            errors: [{
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 14
            }]
        }
    ]
});
