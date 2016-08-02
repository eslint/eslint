/**
 * @fileoverview Tests for no-extra-boolean-cast rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extra-boolean-cast"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-extra-boolean-cast", rule, {

    valid: [
        "var foo = !!bar;",
        "function foo() { return !!bar; }",
        "var foo = bar() ? !!baz : !!bat",
        "for(!!foo;;) {}",
        "for(;; !!foo) {}",
        "var foo = Boolean(bar);",
        "function foo() { return Boolean(bar); }",
        "var foo = bar() ? Boolean(baz) : Boolean(bat)",
        "for(Boolean(foo);;) {}",
        "for(;; Boolean(foo)) {}",
        "if (new Boolean(foo)) {}"
    ],

    invalid: [
        {
            code: "if (!!foo) {}",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "do {} while (!!foo)",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "while (!!foo) {}",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!foo ? bar : baz",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "for (; !!foo;) {}",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!!foo",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "Boolean(!!foo)",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "new Boolean(!!foo)",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "if (Boolean(foo)) {}",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "do {} while (Boolean(foo))",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "while (Boolean(foo)) {}",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "Boolean(foo) ? bar : baz",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "for (; Boolean(foo);) {}",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo)",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        }
    ]
});
