/**
 * @fileoverview Tests for no-unsafe-optional-chaining rule.
 * @author Yeon JuAn
 */

"use strict";

const rule = require("../../../lib/rules/no-unsafe-optional-chaining");

const { RuleTester } = require("../../../lib/rule-tester");

const parserOptions = {
    ecmaVersion: 2021,
    sourceType: "module"
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-unsafe-optional-chaining", rule, {
    valid: [
        "var foo;",
        "class Foo {}",
        "!!obj?.foo",
        "obj?.foo();",
        "obj?.foo?.();",
        "(obj?.foo ?? bar)();",
        "(obj?.foo)?.()",
        "(obj?.foo ?? bar?.baz)?.()",
        "(obj.foo)?.();",
        "obj?.foo.bar;",
        "obj?.foo?.bar;",
        "(obj?.foo)?.bar;",
        "(obj?.foo)?.bar.baz;",
        "(obj?.foo)?.().bar",
        "(obj?.foo ?? bar).baz;",
        "(obj?.foo ?? val)`template`",
        "new (obj?.foo ?? val)()",
        "new bar();",
        "obj?.foo?.()();",
        "const {foo} = obj?.baz || {};",
        "bar(...obj?.foo ?? []);",
        "var bar = {...foo?.bar};",
        "foo?.bar in {};",
        "[foo = obj?.bar] = [];",

        // logical operations
        "(obj?.foo ?? bar?.baz ?? qux)();",
        "((obj?.foo ?? bar?.baz) || qux)();",
        "((obj?.foo || bar?.baz) || qux)();",
        "((obj?.foo && bar?.baz) || qux)();",

        // The default value option disallowArithmeticOperators is false
        "obj?.foo - bar;",
        "obj?.foo + bar;",
        "obj?.foo * bar;",
        "obj?.foo / bar;",
        "obj?.foo % bar;",
        "obj?.foo ** bar;",

        {
            code: "(obj?.foo || baz) + bar;",
            options: [{
                disallowArithmeticOperators: true
            }]
        },
        {
            code: "(obj?.foo ?? baz) + bar;",
            options: [{
                disallowArithmeticOperators: true
            }]
        },
        {
            code: "bar += obj?.foo ?? val",
            options: [{
                disallowArithmeticOperators: true
            }]
        }
    ],

    invalid: [
        ...[
            "(obj?.foo)();",
            "(obj?.foo ?? bar?.baz)();",
            "(obj?.foo || bar?.baz)();",
            "(obj?.foo && bar)();",
            "(bar && obj?.foo)();",
            "(obj?.foo?.())();",
            "(obj?.foo).bar",
            "(obj?.foo)[1];",
            "(obj?.foo)`template`",
            "new (obj?.foo)();",
            "new (obj?.foo?.())()",
            "new (obj?.foo?.() || obj?.bar)()",

            // spread
            "[...obj?.foo];",
            "bar(...obj?.foo);",
            "new Bar(...obj?.foo);",

            // destructuring
            "const {foo} = obj?.bar;",
            "const {foo} = obj?.bar();",
            "const [foo] = obj?.bar;",
            "const [foo] = obj?.bar || obj?.foo;",
            "([foo] = obj?.bar);",
            "const [foo] = obj?.bar?.();",
            "[{ foo } = obj?.bar] = [];",
            "({bar: [ foo ] = obj?.prop} = {});",
            "[[ foo ] = obj?.bar] = [];",

            // class declaration
            "class A extends obj?.foo {}",

            // class expression
            "var a = class A extends obj?.foo {}",

            // relational operations
            "foo instanceof obj?.prop",
            "1 in foo?.bar;",

            // for...of
            "for (foo of obj?.bar);"
        ].map(code => ({
            code,
            errors: [{ messageId: "unsafeOptionalChain", type: "ChainExpression" }]
        })),
        {
            code: "(obj?.foo && obj?.baz).bar",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 2
                },
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            code: "with (obj?.foo) {};",
            parserOptions: {
                sourceType: "script"
            },
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 7
                }
            ]
        },
        ...[
            "obj?.foo + bar;",
            "(foo || obj?.foo) + bar;",
            "bar + (foo || obj?.foo);",
            "obj?.foo - bar;",
            "obj?.foo * bar;",
            "obj?.foo / bar;",
            "obj?.foo % bar;",
            "obj?.foo ** bar;",
            "+obj?.foo;",
            "-obj?.foo;",
            "bar += obj?.foo;",
            "bar -= obj?.foo;",
            "bar %= obj?.foo;",
            "bar **= obj?.foo;"
        ].map(code => ({
            code,
            options: [{ disallowArithmeticOperators: true }],
            errors: [{ messageId: "unsafeArithmetic", type: "ChainExpression" }]
        }))
    ]
});
