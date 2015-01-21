/**
 * @fileoverview Tests for no-extra-boolean-cast rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-extra-boolean-cast", {

    valid: [
        "var foo = !!bar;",
        "function foo() { return !!bar; }",
        "var foo = bar() ? !!baz : !!bat",
        "for(!!foo;;) {}",
        "for(;; !!foo) {}"
    ],

    invalid: [
        {
            code: "if (!!foo) {}",
            errors: [{
                message: "Redundant double negation in an if statement condition.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "do {} while (!!foo)",
            errors: [{
                message: "Redundant double negation in a do while loop condition.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "while (!!foo) {}",
            errors: [{
                message: "Redundant double negation in a while loop condition.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!foo ? bar : baz",
            errors: [{
                message: "Redundant double negation in a ternary condition.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "for (; !!foo;) {}",
            errors: [{
                message: "Redundant double negation in a for loop condition.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!!foo",
            errors: [{
                message: "Redundant multiple negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "Boolean(!!foo)",
            errors: [{
                message: "Redundant double negation in call to Boolean().",
                type: "UnaryExpression"
            }]
        },
        {
            code: "Boolean(!!foo)",
            errors: [{
                message: "Redundant double negation in call to Boolean().",
                type: "UnaryExpression"
            }]
        },
        {
            code: "new Boolean(!!foo)",
            errors: [{
                message: "Redundant double negation in Boolean constructor call.",
                type: "UnaryExpression"
            }]
        }
    ]
});
