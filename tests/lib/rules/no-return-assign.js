/**
 * @fileoverview Tests for no-return-assign.
 * @author Ilya Volodin
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

var error = {
    message: "Return statement should not contain assignment.",
    type: "ReturnStatement"
};

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-return-assign", {
    valid: [
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
            code: "function x() { return result = a * b; };",
            options: ["always"],
            errors: [error]
        },
        {
            code: "function x() { return (result = a * b); };",
            options: ["always"],
            errors: [error]
        }
    ]
});
