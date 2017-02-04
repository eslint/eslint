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
            output: "if (foo) {}",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "do {} while (!!foo)",
            output: "do {} while (foo)",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "while (!!foo) {}",
            output: "while (foo) {}",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!foo ? bar : baz",
            output: "foo ? bar : baz",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "for (; !!foo;) {}",
            output: "for (; foo;) {}",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!!foo",
            output: "!foo",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "Boolean(!!foo)",
            output: "Boolean(foo)",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "new Boolean(!!foo)",
            output: "new Boolean(foo)",
            errors: [{
                message: "Redundant double negation.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "if (Boolean(foo)) {}",
            output: "if (foo) {}",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "do {} while (Boolean(foo))",
            output: "do {} while (foo)",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "while (Boolean(foo)) {}",
            output: "while (foo) {}",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "Boolean(foo) ? bar : baz",
            output: "foo ? bar : baz",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "for (; Boolean(foo);) {}",
            output: "for (; foo;) {}",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo)",
            output: "!foo",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo && bar)",
            output: "!(foo && bar)",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo + bar)",
            output: "!(foo + bar)",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(+foo)",
            output: "!+foo",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo())",
            output: "!foo()",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo = bar)",
            output: "!(foo = bar)",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(...foo);",
            output: "!Boolean(...foo);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo, bar());",
            output: "!Boolean(foo, bar());",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean((foo, bar()));",
            output: "!(foo, bar());",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean();",
            output: "true;",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        },
        {
            code: "!(Boolean());",
            output: "true;",
            errors: [{
                message: "Redundant Boolean call.",
                type: "CallExpression"
            }]
        }
    ]
});
