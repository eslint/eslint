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
        "const foo = obj?.bar",
        "foo = obj?.bar",
        "foo.bar = obj?.bar",
        "bar(...obj?.foo ?? []);",
        "var bar = {...foo?.bar};",
        "foo?.bar in {};",
        "foo?.bar < foo?.baz;",
        "foo?.bar <= foo?.baz;",
        "foo?.bar > foo?.baz;",
        "foo?.bar >= foo?.baz;",
        "[foo = obj?.bar] = [];",
        "[foo.bar = obj?.bar] = [];",
        "({foo = obj?.bar} = obj);",
        "({foo: obj.bar = obj?.baz} = obj);",
        "(foo?.bar, bar)();",
        "(foo?.bar ? baz : qux)();",

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
        "+obj?.foo;",
        "-obj?.foo;",
        "bar += obj?.foo;",
        "bar -= obj?.foo;",
        "bar %= obj?.foo;",
        "bar **= obj?.foo;",
        "bar *= obj?.boo",
        "bar /= obj?.boo",
        ...[
            "obj?.foo | bar",
            "obj?.foo & bar",
            "obj?.foo >> obj?.bar;",
            "obj?.foo << obj?.bar;",
            "obj?.foo >>> obj?.bar;",
            "(obj?.foo || baz) + bar;",
            "(obj?.foo ?? baz) + bar;",
            "(obj?.foo ?? baz) - bar;",
            "(obj?.foo ?? baz) * bar;",
            "(obj?.foo ?? baz) / bar;",
            "(obj?.foo ?? baz) % bar;",
            "(obj?.foo ?? baz) ** bar;",
            "void obj?.foo;",
            "typeof obj?.foo;",
            "!obj?.foo",
            "~obj?.foo",
            "+(obj?.foo ?? bar)",
            "-(obj?.foo ?? bar)",
            "bar |= obj?.foo;",
            "bar &= obj?.foo;",
            "bar ^= obj?.foo;",
            "bar <<= obj?.foo;",
            "bar >>= obj?.foo;",
            "bar >>>= obj?.foo;",
            "bar ||= obj?.foo",
            "bar &&= obj?.foo",
            "bar += (obj?.foo ?? baz);",
            "bar -= (obj?.foo ?? baz)",
            "bar *= (obj?.foo ?? baz)",
            "bar /= (obj?.foo ?? baz)",
            "bar %= (obj?.foo ?? baz);",
            "bar **= (obj?.foo ?? baz)"
        ].map(code => ({
            code,
            options: [{
                disallowArithmeticOperators: true
            }]
        })),
        {
            code: "obj?.foo - bar;",
            options: [{}]
        },
        {
            code: "obj?.foo - bar;",
            options: [{
                disallowArithmeticOperators: false
            }]
        }
    ],

    invalid: [
        ...[
            "(obj?.foo)();",
            "(obj.foo ?? bar?.baz)();",
            "(obj.foo || bar?.baz)();",
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
            "const {foo: bar} = obj?.bar();",
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
            "for (foo of obj?.bar);",

            // sequence expression
            "(foo, obj?.foo)();",
            "(foo, obj?.foo)[1];",

            // conditional expression
            "(a ? obj?.foo : b)();",
            "(a ? b : obj?.foo)();",
            "(a ? obj?.foo : b)[1];",
            "(a ? b : obj?.foo).bar;"
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
        {
            code: "(foo ? obj?.foo : obj?.bar).bar",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 8
                },
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 19
                }
            ]
        },
        ...[
            "obj?.foo + bar;",
            "(foo || obj?.foo) + bar;",
            "bar + (foo || obj?.foo);",
            "(a ? obj?.foo : b) + bar",
            "(a ? b : obj?.foo) + bar",
            "(foo, bar, baz?.qux) + bar",
            "obj?.foo - bar;",
            "obj?.foo * bar;",
            "obj?.foo / bar;",
            "obj?.foo % bar;",
            "obj?.foo ** bar;",
            "+obj?.foo;",
            "-obj?.foo;",
            "+(foo ?? obj?.foo);",
            "+(foo || obj?.bar);",
            "+(obj?.bar && foo);",
            "+(foo ? obj?.foo : bar);",
            "+(foo ? bar : obj?.foo);",
            "bar += obj?.foo;",
            "bar -= obj?.foo;",
            "bar %= obj?.foo;",
            "bar **= obj?.foo;",
            "bar *= obj?.boo",
            "bar /= obj?.boo",
            "bar += (foo ?? obj?.foo);",
            "bar += (foo || obj?.foo);",
            "bar += (foo && obj?.foo);",
            "bar += (foo ? obj?.foo : bar);",
            "bar += (foo ? bar : obj?.foo);"
        ].map(code => ({
            code,
            options: [{ disallowArithmeticOperators: true }],
            errors: [{ messageId: "unsafeArithmetic", type: "ChainExpression" }]
        }))
    ]
});
