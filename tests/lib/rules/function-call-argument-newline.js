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

        /* "consistent" */
        { code: "fn(a, b, c)", options: ["consistent"] },
        { code: "fn(a,\n\tb,\n\tc)", options: ["consistent"] }
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
        }
    ]
});
