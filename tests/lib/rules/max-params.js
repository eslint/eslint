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
                messageId: "exceed",
                data: { name: "Function 'test'", count: 3, max: 2.0 },
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "function test(a, b, c, d) {}",
            errors: [{
                messageId: "exceed",
                data: { name: "Function 'test'", count: 4, max: 3.0 },
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "var test = function(a, b, c, d) {};",
            options: [3],
            errors: [{
                messageId: "exceed",
                data: { name: "Function", count: 4, max: 3.0 },
                type: "FunctionExpression"
            }]
        },
        {
            code: "var test = (a, b, c, d) => {};",
            options: [3],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exceed",
                data: { name: "Arrow function", count: 4, max: 3.0 },
                type: "ArrowFunctionExpression"
            }]
        },
        {
            code: "(function(a, b, c, d) {});",
            options: [3],
            errors: [{
                messageId: "exceed",
                data: { name: "Function", count: 4, max: 3.0 },
                type: "FunctionExpression"
            }]
        },
        {
            code: "var test = function test(a, b, c) {};",
            options: [1],
            errors: [{
                messageId: "exceed",
                data: { name: "Function 'test'", count: 3, max: 1.0 },
                type: "FunctionExpression"
            }]
        },

        // object property options
        {
            code: "function test(a, b, c) {}",
            options: [{ max: 2 }],
            errors: [{
                messageId: "exceed",
                data: { name: "Function 'test'", count: 3, max: 2.0 },
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "function test(a, b, c, d) {}",
            options: [{}],
            errors: [{
                messageId: "exceed",
                data: { name: "Function 'test'", count: 4, max: 3 }
            }]
        },
        {
            code: "function test(a) {}",
            options: [{ max: 0 }],
            errors: [{
                messageId: "exceed",
                data: { name: "Function 'test'", count: 1, max: 0 }
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
