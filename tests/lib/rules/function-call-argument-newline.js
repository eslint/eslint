"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/function-call-argument-newline"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("function-call-argument-newline", rule, {
    valid: [

        /* early return */
        "fn()",
        "fn(a)",
        "new Foo()",
        "new Foo(b)",

        /* default ("always") */
        "fn(a,\n\tb)",

        /* "always" */
        { code: "fn(a,\n\tb)", options: ["always"] },
        { code: "fn(\n\ta,\n\tb\n)", options: ["always"] },
        { code: "fn(\n\ta,\n\tb,\n\tc\n)", options: ["always"] },
        {
            code: "fn(\n\ta,\n\tb,\n\t[\n\t\t1,\n\t\t2\n\t]\n)",
            options: ["always"]
        },
        {
            code: "fn(\n\ta,\n\tb,\n\t{\n\t\ta: 1,\n\t\tb: 2\n\t}\n)",
            options: ["always"]
        },
        {
            code: "fn(\n\ta,\n\tb,\n\tfunction (x) {\n\t\tx()\n\t}\n)",
            options: ["always"]
        },
        {
            code: "fn(\n\ta,\n\tb,\n\tx => {\n\t\tx()\n\t}\n)",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        { code: "fn({\n\ta: 1\n},\n\tb,\n\tc)", options: ["always"] },
        { code: "fn(`\n`,\n\ta)", options: ["always"], parserOptions: { ecmaVersion: 6 } },

        /* "never" */
        { code: "fn(a, b)", options: ["never"] },
        { code: "fn(\n\ta, b\n)", options: ["never"] },
        { code: "fn(a, b, c)", options: ["never"] },
        { code: "fn(a, b, [\n\t1,\n\t2\n])", options: ["never"] },
        { code: "fn(a, b, {\n\ta: 1,\n\tb: 2\n})", options: ["never"] },
        { code: "fn(a, b, function (x) {\n\tx()\n})", options: ["never"] },
        {
            code: "fn(a, b, x => {\n\tx()\n})",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        { code: "fn({\n\ta: 1\n}, b)", options: ["never"] },
        { code: "fn(`\n`, a)", options: ["never"], parserOptions: { ecmaVersion: 6 } },

        /* "consistent" */
        { code: "fn(a, b, c)", options: ["consistent"] },
        { code: "fn(a,\n\tb,\n\tc)", options: ["consistent"] },
        { code: "fn({\n\ta: 1\n}, b, c)", options: ["consistent"] },
        { code: "fn({\n\ta: 1\n},\n\tb,\n\tc)", options: ["consistent"] },
        { code: "fn(`\n`, b, c)", options: ["consistent"], parserOptions: { ecmaVersion: 6 } },
        { code: "fn(`\n`,\n\tb,\n\tc)", options: ["consistent"], parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [

        /* default ("always") */
        {
            code: "fn(a, b)",
            output: "fn(a,\nb)",
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 7
                }
            ]
        },

        /* "always" */
        {
            code: "fn(a, b)",
            output: "fn(a,\nb)",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 7
                }
            ]
        },
        {
            code: "fn(a, b, c)",
            output: "fn(a,\nb,\nc)",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 7
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10
                }
            ]
        },
        {
            code: "fn(a, b, [\n\t1,\n\t2\n])",
            output: "fn(a,\nb,\n[\n\t1,\n\t2\n])",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 7
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10
                }
            ]
        },
        {
            code: "fn(a, b, {\n\ta: 1,\n\tb: 2\n})",
            output: "fn(a,\nb,\n{\n\ta: 1,\n\tb: 2\n})",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 7
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10
                }
            ]
        },
        {
            code: "fn(a, b, function (x) {\n\tx()\n})",
            output: "fn(a,\nb,\nfunction (x) {\n\tx()\n})",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 7
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10
                }
            ]
        },
        {
            code: "fn(a, b, x => {\n\tx()\n})",
            output: "fn(a,\nb,\nx => {\n\tx()\n})",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 7
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10
                }
            ]
        },
        {
            code: "fn({\n\ta: 1\n}, b)",
            output: "fn({\n\ta: 1\n},\nb)",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 3,
                    column: 3,
                    endLine: 3,
                    endColumn: 4
                }
            ]
        },
        {
            code: "fn(`\n`, b)",
            output: "fn(`\n`,\nb)",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 2,
                    column: 3,
                    endLine: 2,
                    endColumn: 4
                }
            ]
        },

        /* "never" */
        {
            code: "fn(a,\n\tb)",
            output: "fn(a, b)",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 2,
                    endColumn: 2
                }
            ]
        },
        {
            code: "fn(a,\n\tb,\n\tc)",
            output: "fn(a, b, c)",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 2,
                    endColumn: 2
                },
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 4,
                    endLine: 3,
                    endColumn: 2
                }
            ]
        },
        {
            code: "fn(a,\n\tb,\n\t[\n\t\t1,\n\t\t2\n])",
            output: "fn(a, b, [\n\t\t1,\n\t\t2\n])",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 2,
                    endColumn: 2
                },
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 4,
                    endLine: 3,
                    endColumn: 2
                }
            ]
        },
        {
            code: "fn(a,\n\tb,\n\t{\n\t\ta: 1,\n\t\tb: 2\n})",
            output: "fn(a, b, {\n\t\ta: 1,\n\t\tb: 2\n})",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 2,
                    endColumn: 2
                },
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 4,
                    endLine: 3,
                    endColumn: 2
                }
            ]
        },
        {
            code: "fn(a,\n\tb,\n\tfunction (x) {\n\t\tx()\n})",
            output: "fn(a, b, function (x) {\n\t\tx()\n})",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 2,
                    endColumn: 2
                },
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 4,
                    endLine: 3,
                    endColumn: 2
                }
            ]
        },
        {
            code: "fn(a,\n\tb,\n\tx => {\n\t\tx()\n})",
            output: "fn(a, b, x => {\n\t\tx()\n})",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 6,
                    endLine: 2,
                    endColumn: 2
                },
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 4,
                    endLine: 3,
                    endColumn: 2
                }
            ]
        },
        {
            code: "fn({\n\ta: 1\n},\nb)",
            output: "fn({\n\ta: 1\n}, b)",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 3,
                    column: 3,
                    endLine: 4,
                    endColumn: 1
                }
            ]
        },
        {
            code: "fn(`\n`,\nb)",
            output: "fn(`\n`, b)",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 3,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "fn(a,/* comment */\nb)",
            output: "fn(a,/* comment */ b)",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 19,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },

        /* "consistent" */
        {
            code: "fn(a, b,\n\tc)",
            output: "fn(a, b, c)",
            options: ["consistent"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 9,
                    endLine: 2,
                    endColumn: 2
                }
            ]
        },
        {
            code: "fn(a,\n\tb, c)",
            output: "fn(a,\n\tb,\nc)",
            options: ["consistent"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 2,
                    column: 4,
                    endLine: 2,
                    endColumn: 5
                }
            ]
        },
        {
            code: "fn(a,\n\tb /* comment */, c)",
            output: "fn(a,\n\tb /* comment */,\nc)",
            options: ["consistent"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 2,
                    column: 18,
                    endLine: 2,
                    endColumn: 19
                }
            ]
        },
        {
            code: "fn(a,\n\tb, /* comment */ c)",
            output: "fn(a,\n\tb, /* comment */\nc)",
            options: ["consistent"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 2,
                    column: 18,
                    endLine: 2,
                    endColumn: 19
                }
            ]
        },
        {
            code: "fn({\n\ta: 1\n},\nb, c)",
            output: "fn({\n\ta: 1\n},\nb,\nc)",
            options: ["consistent"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 4,
                    column: 3,
                    endLine: 4,
                    endColumn: 4
                }
            ]
        },
        {
            code: "fn({\n\ta: 1\n}, b,\nc)",
            output: "fn({\n\ta: 1\n}, b, c)",
            options: ["consistent"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 3,
                    column: 6,
                    endLine: 4,
                    endColumn: 1
                }
            ]
        },
        {
            code: "fn(`\n`,\nb, c)",
            output: "fn(`\n`,\nb,\nc)",
            options: ["consistent"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 3,
                    column: 3,
                    endLine: 3,
                    endColumn: 4
                }
            ]
        },
        {
            code: "fn(`\n`, b,\nc)",
            output: "fn(`\n`, b, c)",
            options: ["consistent"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 6,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: "fn(a,// comment\n{b, c})",
            output: null,
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 16,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "fn(a, // comment\nb)",
            output: null,
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 17,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "fn(`\n`, b, // comment\nc)",
            output: null,
            options: ["consistent"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 17,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        }
    ]
});
