/**
 * @fileoverview Tests for radix rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/radix"),
    { RuleTester } = require("../../../lib/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("radix", rule, {

    valid: [
        "parseInt(\"10\", 10);",
        "parseInt(\"10\", 2);",
        "parseInt(\"10\", 36);",
        "parseInt(\"10\", 0x10);",
        "parseInt(\"10\", 1.6e1);",
        "parseInt(\"10\", 10.0);",
        "parseInt(\"10\", foo);",
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
        },
        "parseInt",
        "Number.foo();",
        "Number[parseInt]();",

        // Ignores if it's shadowed or disabled.
        "var parseInt; parseInt();",
        { code: "var parseInt; parseInt(foo);", options: ["always"] },
        { code: "var parseInt; parseInt(foo, 10);", options: ["as-needed"] },
        "var Number; Number.parseInt();",
        { code: "var Number; Number.parseInt(foo);", options: ["always"] },
        { code: "var Number; Number.parseInt(foo, 10);", options: ["as-needed"] },
        { code: "/* globals parseInt:off */ parseInt(foo);", options: ["always"] },
        { code: "Number.parseInt(foo, 10);", options: ["as-needed"], globals: { Number: "off" } }
    ],

    invalid: [
        {
            code: "parseInt();",
            options: ["as-needed"],
            errors: [{
                messageId: "missingParameters",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt();",
            errors: [{
                messageId: "missingParameters",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\");",
            errors: [{
                messageId: "missingRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", null);",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", undefined);",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", true);",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", \"foo\");",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", \"123\");",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", 1);",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", 37);",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", 10.5);",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "Number.parseInt();",
            errors: [{
                messageId: "missingParameters",
                type: "CallExpression"
            }]
        },
        {
            code: "Number.parseInt();",
            options: ["as-needed"],
            errors: [{
                messageId: "missingParameters",
                type: "CallExpression"
            }]
        },
        {
            code: "Number.parseInt(\"10\");",
            errors: [{
                messageId: "missingRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "Number.parseInt(\"10\", 1);",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "Number.parseInt(\"10\", 37);",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "Number.parseInt(\"10\", 10.5);",
            errors: [{
                messageId: "invalidRadix",
                type: "CallExpression"
            }]
        },
        {
            code: "parseInt(\"10\", 10);",
            options: ["as-needed"],
            errors: [{
                messageId: "redundantRadix",
                type: "CallExpression"
            }]
        }
    ]
});
