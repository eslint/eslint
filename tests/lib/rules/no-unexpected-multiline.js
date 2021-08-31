/**
 * @fileoverview Tests for no-unexpected-multiline rule.
 * @author Glen Mailer
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unexpected-multiline"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-unexpected-multiline", rule, {
    valid: [
        "(x || y).aFunction()",
        "[a, b, c].forEach(doSomething)",
        "var a = b;\n(x || y).doSomething()",
        "var a = b\n;(x || y).doSomething()",
        "var a = b\nvoid (x || y).doSomething()",
        "var a = b;\n[1, 2, 3].forEach(console.log)",
        "var a = b\nvoid [1, 2, 3].forEach(console.log)",
        "\"abc\\\n(123)\"",
        "var a = (\n(123)\n)",
        "f(\n(x)\n)",
        "(\nfunction () {}\n)[1]",
        {
            code: "let x = function() {};\n   `hello`",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let x = function() {}\nx `hello`",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "String.raw `Hi\n${2+3}!`;",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "x\n.y\nz `Valid Test Case`",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "f(x\n)`Valid Test Case`",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "x.\ny `Valid Test Case`",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(x\n)`Valid Test Case`",
            parserOptions: { ecmaVersion: 6 }
        },
        `
            foo
            / bar /2
        `,
        `
            foo
            / bar / mgy
        `,
        `
            foo
            / bar /
            gym
        `,
        `
            foo
            / bar
            / ygm
        `,
        `
            foo
            / bar /GYM
        `,
        `
            foo
            / bar / baz
        `,
        "foo /bar/g",
        `
            foo
            /denominator/
            2
        `,
        `
            foo
            / /abc/
        `,
        `
            5 / (5
            / 5)
        `,

        // https://github.com/eslint/eslint/issues/11650
        {
            code: `
                tag<generic>\`
                    multiline
                \`;
            `,
            parser: require.resolve("../../fixtures/parsers/typescript-parsers/tagged-template-with-generic/tagged-template-with-generic-1")
        },
        {
            code: `
                tag<
                  generic
                >\`
                    multiline
                \`;
            `,
            parser: require.resolve("../../fixtures/parsers/typescript-parsers/tagged-template-with-generic/tagged-template-with-generic-2")
        },
        {
            code: `
                tag<
                  generic
                >\`multiline\`;
            `,
            parser: require.resolve("../../fixtures/parsers/typescript-parsers/tagged-template-with-generic/tagged-template-with-generic-3")
        },

        // Optional chaining
        {
            code: "var a = b\n  ?.(x || y).doSomething()",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "var a = b\n  ?.[a, b, c].forEach(doSomething)",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "var a = b?.\n  (x || y).doSomething()",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "var a = b?.\n  [a, b, c].forEach(doSomething)",
            parserOptions: { ecmaVersion: 2020 }
        },

        // Class fields
        {
            code: "class C { field1\n[field2]; }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { field1\n*gen() {} }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {

            // ArrowFunctionExpression doesn't connect to computed properties.
            code: "class C { field1 = () => {}\n[field2]; }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {

            // ArrowFunctionExpression doesn't connect to binary operators.
            code: "class C { field1 = () => {}\n*gen() {} }",
            parserOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "var a = b\n(x || y).doSomething()",
            errors: [{
                messageId: "function",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "var a = (a || b)\n(x || y).doSomething()",
            errors: [{
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2,
                messageId: "function"
            }]
        },
        {
            code: "var a = (a || b)\n(x).doSomething()",
            errors: [{
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2,
                messageId: "function"
            }]
        },
        {
            code: "var a = b\n[a, b, c].forEach(doSomething)",
            errors: [{
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 2,
                messageId: "property"
            }]
        },
        {
            code: "var a = b\n    (x || y).doSomething()",
            errors: [{
                line: 2,
                column: 5,
                endLine: 2,
                endColumn: 6,
                messageId: "function"
            }]
        },
        {
            code: "var a = b\n  [a, b, c].forEach(doSomething)",
            errors: [{
                line: 2,
                column: 3,
                endLine: 2,
                endColumn: 4,
                messageId: "property"
            }]
        },
        {
            code: "let x = function() {}\n `hello`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 2,
                column: 2,
                endLine: 2,
                endColumn: 3,
                messageId: "taggedTemplate"
            }]
        },
        {
            code: "let x = function() {}\nx\n`hello`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 3,
                column: 1,
                endLine: 3,
                endColumn: 2,
                messageId: "taggedTemplate"
            }]
        },
        {
            code: "x\n.y\nz\n`Invalid Test Case`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 4,
                column: 1,
                endLine: 4,
                endColumn: 2,
                messageId: "taggedTemplate"
            }]
        },
        {
            code: `
                foo
                / bar /gym
            `,
            errors: [{
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 18,
                messageId: "division"
            }]
        },
        {
            code: `
                foo
                / bar /g
            `,
            errors: [{
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 18,
                messageId: "division"
            }]
        },
        {
            code: `
                foo
                / bar /g.test(baz)
            `,
            errors: [{
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 18,
                messageId: "division"
            }]
        },
        {
            code: `
                foo
                /bar/gimuygimuygimuy.test(baz)
            `,
            errors: [{
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 18,
                messageId: "division"
            }]
        },
        {
            code: `
                foo
                /bar/s.test(baz)
            `,
            errors: [{
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 18,
                messageId: "division"
            }]
        },

        // https://github.com/eslint/eslint/issues/11650
        {
            code: [
                "const x = aaaa<",
                "  test",
                ">/*",
                "test",
                "*/`foo`"
            ].join("\n"),
            parser: require.resolve("../../fixtures/parsers/typescript-parsers/tagged-template-with-generic/tagged-template-with-generic-and-comment"),
            errors: [
                {
                    line: 5,
                    column: 3,
                    endLine: 5,
                    endColumn: 4,
                    messageId: "taggedTemplate"
                }
            ]
        },

        // Class fields
        {
            code: "class C { field1 = obj\n[field2]; }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 2,
                    messageId: "property"
                }
            ]
        },
        {
            code: "class C { field1 = function() {}\n[field2]; }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 2,
                    messageId: "property"
                }
            ]
        }

        // "class C { field1 = obj\n*gen() {} }" is syntax error: Unexpected token '{'
    ]
});
