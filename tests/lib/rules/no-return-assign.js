/**
 * @fileoverview Tests for no-return-assign.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-return-assign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const error = {
    message: "Return statement should not contain assignment.",
    type: "ReturnStatement"
};

const ruleTester = new RuleTester();

ruleTester.run("no-return-assign", rule, {
    valid: [
        {
            code: "module.exports = {'a': 1};",
            parserOptions: {
                sourceType: "module"
            }
        },
        "var result = a * b;",
        "function x() { var result = a * b; return result; }",
        "function x() { return (result = a * b); }",
        {
            code: "function x() { var result = a * b; return result; }",
            options: ["except-parens"]
        },
        {
            code: "function x() { return (result = a * b); }",
            options: ["except-parens"]
        },
        {
            code: "function x() { var result = a * b; return result; }",
            options: ["always"]
        },
        {
            code: "function x() { return function y() { result = a * b }; }",
            options: ["always"]
        },
        {
            code: "() => { return (result = a * b); }",
            options: ["except-parens"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => (result = a * b)",
            options: ["except-parens"],
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "function x() { return result = a * b; };",
            errors: [error]
        },
        {
            code: "function x() { return (result) = (a * b); };",
            errors: [error]
        },
        {
            code: "function x() { return result = a * b; };",
            options: ["except-parens"],
            errors: [error]
        },
        {
            code: "function x() { return (result) = (a * b); };",
            options: ["except-parens"],
            errors: [error]
        },
        {
            code: "() => { return result = a * b; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "() => result = a * b",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Arrow function should not return assignment."]
        },
        {
            code: "function x() { return result = a * b; };",
            options: ["always"],
            errors: [error]
        },
        {
            code: "function x() { return (result = a * b); };",
            options: ["always"],
            errors: [error]
        },
        {
            code: "function x() { return result || (result = a * b); };",
            options: ["always"],
            errors: [error]
        }
    ]
});
