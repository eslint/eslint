/**
 * @fileoverview Tests for radix rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/radix", {

    valid: [
        "parseInt(\"10\", 10);",
        "parseInt(\"10\", foo);"
    ],

    invalid: [
        {
            code: "parseInt();",
            errors: [{
                message: "Missing radix parameter.",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\");",
            errors: [{
                message: "Missing radix parameter.",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", null);",
            errors: [{
                message: "Invalid radix parameter.",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", undefined);",
            errors: [{
                message: "Invalid radix parameter.",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", true);",
            errors: [{
                message: "Invalid radix parameter.",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", \"foo\");",
            errors: [{
                message: "Invalid radix parameter.",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", \"123\");",
            errors: [{
                message: "Invalid radix parameter.",
                type: "CallExpression"
            }]
        }
    ]
});
