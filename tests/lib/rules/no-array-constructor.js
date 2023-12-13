/**
 * @fileoverview Tests for the no-array-constructor rule
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-array-constructor"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        sourceType: "script"
    }
});

ruleTester.run("no-array-constructor", rule, {
    valid: [
        "new Array(x)",
        "Array(x)",
        "new Array(9)",
        "Array(9)",
        "new foo.Array()",
        "foo.Array()",
        "new Array.foo",
        "Array.foo()",
        "new globalThis.Array",
        "const createArray = Array => new Array()",
        "var Array; new Array;",
        {
            code: "new Array()",
            languageOptions: {
                globals: {
                    Array: "off"
                }
            }
        }
    ],
    invalid: [
        {
            code: "new Array()",
            errors: [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    messageId: "useLiteral",
                    output: "[]"
                }]
            }]
        },
        {
            code: "new Array",
            errors:
            [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    messageId: "useLiteral",
                    output: "[]"
                }]
            }]
        },
        {
            code: "new Array(x, y)",
            errors: [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    messageId: "useLiteral",
                    output: "[x, y]"
                }]
            }]
        },
        {
            code: "new Array(0, 1, 2)",
            errors: [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    messageId: "useLiteral",
                    output: "[0, 1, 2]"
                }]
            }]
        },
        {
            code: "const array = Array?.();",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    messageId: "useLiteral",
                    output: "const array = [];"
                }]
            }]
        },
        {
            code: `
                    const array = (Array)(
                        /* foo */ a,
                        b = c() // bar
                    );
                    `,
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    messageId: "useLiteral",
                    output: `
                    const array = [
                        /* foo */ a,
                        b = c() // bar
                    ];
                    `
                }]
            }]
        },
        {
            code: "const array = Array(...args);",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    messageId: "useLiteral",
                    output: "const array = [...args];"
                }]
            }]
        },
        {
            code: "a = new (Array);",
            errors: [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    messageId: "useLiteral",
                    output: "a = [];"
                }]
            }]
        },
        {
            code: "a = new (Array) && (foo);",
            errors: [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    messageId: "useLiteral",
                    output: "a = [] && (foo);"
                }]
            }]
        },

        ...[

            // Semicolon required before array literal to compensate for ASI
            {
                code: `
                foo
                Array()
                `
            },
            {
                code: `
                foo()
                Array(bar, baz)
                `
            },
            {
                code: `
                new foo
                Array()
                `
            },
            {
                code: `
                (a++)
                Array()
                `
            },
            {
                code: `
                ++a
                Array()
                `
            },
            {
                code: `
                const foo = function() {}
                Array()
                `
            },
            {
                code: `
                const foo = class {}
                Array("a", "b", "c")
                `
            },
            {
                code: `
                foo = this.return
                Array()
                `
            },
            {
                code: `
                var yield = bar.yield
                Array()
                `
            },
            {
                code: `
                var foo = { bar: baz }
                Array()
                `
            },
            {
                code: `
                <foo />
                Array()
                `,
                languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } }
            },
            {
                code: `
                <foo></foo>
                Array()
                `,
                languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } }
            }
        ].map(props => ({
            ...props,
            errors: [{
                messageId: "preferLiteral",
                suggestions: [{
                    desc: "Replace with an array literal, add preceding semicolon.",
                    messageId: "useLiteralAfterSemicolon",
                    output: props.code.replace(/(new )?Array\((?<args>.*?)\)/su, ";[$<args>]")
                }]
            }]
        })),

        ...[

            // No semicolon required before array literal because ASI does not occur
            { code: "Array()" },
            {
                code: `
                {}
                Array()
                `
            },
            {
                code: `
                function foo() {}
                Array()
                `
            },
            {
                code: `
                class Foo {}
                Array()
                `
            },
            { code: "foo: Array();" },
            { code: "foo();Array();" },
            { code: "{ Array(); }" },
            { code: "if (a) Array();" },
            { code: "if (a); else Array();" },
            { code: "while (a) Array();" },
            {
                code: `
                do Array();
                while (a);
                `
            },
            { code: "for (let i = 0; i < 10; i++) Array();" },
            { code: "for (const prop in obj) Array();" },
            { code: "for (const element of iterable) Array();" },
            { code: "with (obj) Array();", languageOptions: { sourceType: "script" } },

            // No semicolon required before array literal because ASI still occurs
            {
                code: `
                const foo = () => {}
                Array()
                `
            },
            {
                code: `
                a++
                Array()
                `
            },
            {
                code: `
                a--
                Array()
                `
            },
            {
                code: `
                function foo() {
                    return
                    Array();
                }
                `
            },
            {
                code: `
                function * foo() {
                    yield
                    Array();
                }
                `
            },
            {
                code: `
                do {}
                while (a)
                Array()
                `
            },
            {
                code: `
                debugger
                Array()
                `
            },
            {
                code: `
                for (;;) {
                    break
                    Array()
                }
                `
            },
            {
                code: `
                for (;;) {
                    continue
                    Array()
                }
                `
            },
            {
                code: `
                foo: break foo
                Array()
                `
            },
            {
                code: `
                foo: while (true) continue foo
                Array()
                `
            },
            {
                code: `
                const foo = bar
                export { foo }
                Array()
                `,
                languageOptions: { sourceType: "module" }
            },
            {
                code: `
                export { foo } from 'bar'
                Array()
                `,
                languageOptions: { sourceType: "module" }
            },
            {
                code: `
                export * as foo from 'bar'
                Array()
                `,
                languageOptions: { sourceType: "module" }
            },
            {
                code: `
                import foo from 'bar'
                Array()
                `,
                languageOptions: { sourceType: "module" }
            },
            {
                code: `
                var yield = 5;

                yield: while (foo) {
                    if (bar)
                        break yield
                    new Array();
                }
                `
            }
        ].map(props => ({
            ...props,
            errors: [{
                messageId: "preferLiteral",
                suggestions: [{
                    desc: "Replace with an array literal.",
                    messageId: "useLiteral",
                    output: props.code.replace(/(new )?Array\((?<args>.*?)\)/su, "[$<args>]")
                }]
            }]
        }))
    ]
});
