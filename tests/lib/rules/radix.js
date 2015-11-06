/**
 * @fileoverview Tests for radix rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/radix"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("radix", rule, {

    valid: [
        "parseInt(\"10\", 10);",
        "parseInt(\"10\", foo);",
        "Number.parseInt(\"10\", foo);",
        "Number.parseInt(\"10\", foo);",
        {
            code: "parseInt(\"10\", 10);",
            options: ["always"]
        },
        {
            code: "parseInt(\"10\");",
            options: ["as-needed"]
        },
        {
            code: "parseInt(\"10\", 8);",
            options: ["as-needed"]
        },
        {
            code: "parseInt(\"10\", foo);",
            options: ["as-needed"]
        }
    ],

    invalid: [
        {
            code: "parseInt();",
            options: ["as-needed"],
            errors: [{
                message: "Missing parameters.",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt();",
            errors: [{
                message: "Missing parameters.",
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
        },
        {
            code: "Number.parseInt();",
            errors: [{
                message: "Missing parameters.",
                type: "CallExpression"
            }]
        },
        {
            code: "Number.parseInt();",
            options: ["as-needed"],
            errors: [{
                message: "Missing parameters.",
                type: "CallExpression"
            }]
        },
        {
            code: "Number.parseInt(\"10\");",
            errors: [{
                message: "Missing radix parameter.",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", 10);",
            options: ["as-needed"],
            errors: [{
                message: "Redundant radix parameter.",
                type: "CallExpression"
            }]
        }
    ]
});
