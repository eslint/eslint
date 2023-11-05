/**
 * @fileoverview Tests for the no-object-constructor rule
 * @author Francesco Trotta
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-object-constructor"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: "latest" } });

ruleTester.run("no-object-constructor", rule, {
    valid: [
        "new Object(x)",
        "Object(x)",
        "new globalThis.Object",
        "const createObject = Object => new Object()",
        "var Object; new Object;",
        {
            code: "new Object()",
            globals: {
                Object: "off"
            }
        }
    ],
    invalid: [
        {
            code: "new Object",
            errors: [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    desc: "Replace with '({})'.",
                    messageId: "useLiteral",
                    output: "({})"
                }]
            }]
        },
        {
            code: "Object()",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    desc: "Replace with '({})'.",
                    messageId: "useLiteral",
                    output: "({})"
                }]
            }]
        },
        {
            code: "const fn = () => Object();",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    desc: "Replace with '({})'.",
                    messageId: "useLiteral",
                    output: "const fn = () => ({});"
                }]
            }]
        },
        {
            code: "Object() instanceof Object;",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    desc: "Replace with '({})'.",
                    messageId: "useLiteral",
                    output: "({}) instanceof Object;"
                }]
            }]
        },
        {
            code: "const obj = Object?.();",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    desc: "Replace with '{}'.",
                    messageId: "useLiteral",
                    output: "const obj = {};"
                }]
            }]
        },
        {
            code: "(new Object() instanceof Object);",
            errors: [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    desc: "Replace with '{}'.",
                    messageId: "useLiteral",
                    output: "({} instanceof Object);"
                }]
            }]
        },

        ...[

            // Semicolon required before `({})` to compensate for ASI
            {
                code: `
                foo
                Object()
                `
            },
            {
                code: `
                foo()
                Object()
                `
            },
            {
                code: `
                new foo
                Object()
                `
            },
            {
                code: `
                (a++)
                Object()
                `
            },
            {
                code: `
                ++a
                Object()
                `
            },
            {
                code: `
                const foo = function() {}
                Object()
                `
            },
            {
                code: `
                const foo = class {}
                Object()
                `
            },
            {
                code: `
                foo = this.return
                Object()
                `
            },
            {
                code: `
                var yield = bar.yield
                Object()
                `
            },
            {
                code: `
                var foo = { bar: baz }
                Object()
                `
            },
            {
                code: `
                <foo />
                Object()
                `,
                parserOptions: { ecmaFeatures: { jsx: true } }
            },
            {
                code: `
                <foo></foo>
                Object()
                `,
                parserOptions: { ecmaFeatures: { jsx: true } }
            }
        ].map(props => ({
            ...props,
            errors: [{
                messageId: "preferLiteral",
                suggestions: [{
                    desc: "Replace with '({})', add preceding semicolon.",
                    messageId: "useLiteralAfterSemicolon",
                    output: props.code.replace(/(new )?Object\(\)/u, ";({})")
                }]
            }]
        })),

        ...[

            // No semicolon required before `({})` because ASI does not occur
            { code: "Object()" },
            {
                code: `
                {}
                Object()
                `
            },
            {
                code: `
                function foo() {}
                Object()
                `
            },
            {
                code: `
                class Foo {}
                Object()
                `
            },
            { code: "foo: Object();" },
            { code: "foo();Object();" },
            { code: "{ Object(); }" },
            { code: "if (a) Object();" },
            { code: "if (a); else Object();" },
            { code: "while (a) Object();" },
            {
                code: `
                do Object();
                while (a);
                `
            },
            { code: "for (let i = 0; i < 10; i++) Object();" },
            { code: "for (const prop in obj) Object();" },
            { code: "for (const element of iterable) Object();" },
            { code: "with (obj) Object();" },

            // No semicolon required before `({})` because ASI still occurs
            {
                code: `
                const foo = () => {}
                Object()
                `
            },
            {
                code: `
                a++
                Object()
                `
            },
            {
                code: `
                a--
                Object()
                `
            },
            {
                code: `
                function foo() {
                    return
                    Object();
                }
                `
            },
            {
                code: `
                function * foo() {
                    yield
                    Object();
                }
                `
            },
            {
                code: `
                do {}
                while (a)
                Object()
                `
            },
            {
                code: `
                debugger
                Object()
                `
            },
            {
                code: `
                for (;;) {
                    break
                    Object()
                }
                `
            },
            {
                code: `
                for (;;) {
                    continue
                    Object()
                }
                `
            },
            {
                code: `
                foo: break foo
                Object()
                `
            },
            {
                code: `
                foo: while (true) continue foo
                Object()
                `
            },
            {
                code: `
                const foo = bar
                export { foo }
                Object()
                `,
                parserOptions: { sourceType: "module" }
            },
            {
                code: `
                export { foo } from 'bar'
                Object()
                `,
                parserOptions: { sourceType: "module" }
            },
            {
                code: `
                export * as foo from 'bar'
                Object()
                `,
                parserOptions: { sourceType: "module" }
            },
            {
                code: `
                import foo from 'bar'
                Object()
                `,
                parserOptions: { sourceType: "module" }
            },
            {
                code: `
                var yield = 5;

                yield: while (foo) {
                    if (bar)
                        break yield
                    new Object();
                }
                `
            }
        ].map(props => ({
            ...props,
            errors: [{
                messageId: "preferLiteral",
                suggestions: [{
                    desc: "Replace with '({})'.",
                    messageId: "useLiteral",
                    output: props.code.replace(/(new )?Object\(\)/u, "({})")
                }]
            }]
        }))
    ]
});
