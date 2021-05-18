/**
 * @fileoverview Tests for array-element-newline rule.
 * @author Jan Peer Stöcklmair <https://github.com/JPeer264>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/array-element-newline");
const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("array-element-newline", rule, {

    valid: [

        /*
         * ArrayExpression
         * "always"
         */
        "var foo = [];",
        "var foo = [1];",
        "var foo = [1,\n2];",
        "var foo = [1, // any comment\n2];",
        "var foo = [// any comment \n1,\n2];",
        "var foo = [1,\n2 // any comment\n];",
        "var foo = [1,\n2,\n3];",
        "var foo = [1\n, (2\n, 3)];",
        "var foo = [1,\n(  2   ),\n3];",
        "var foo = [1,\n((((2)))),\n3];",
        "var foo = [1,\n(\n2\n),\n3];",
        "var foo = [1,\n(2),\n3];",
        "var foo = [1,\n(2)\n, 3];",
        "var foo = [1\n, 2\n, 3];",
        "var foo = [1,\n2,\n,\n3];",
        "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\nosomething();\n}\n];",

        { code: "var foo = [];", options: ["always"] },
        { code: "var foo = [1];", options: ["always"] },
        { code: "var foo = [1,\n2];", options: ["always"] },
        { code: "var foo = [1,\n(2)];", options: ["always"] },
        { code: "var foo = [1\n, (2)];", options: ["always"] },
        { code: "var foo = [1, // any comment\n2];", options: ["always"] },
        { code: "var foo = [// any comment \n1,\n2];", options: ["always"] },
        { code: "var foo = [1,\n2 // any comment\n];", options: ["always"] },
        { code: "var foo = [1,\n2,\n3];", options: ["always"] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];", options: ["always"] },

        // "never"
        { code: "var foo = [];", options: ["never"] },
        { code: "var foo = [1];", options: ["never"] },
        { code: "var foo = [1, 2];", options: ["never"] },
        { code: "var foo = [1, /* any comment */ 2];", options: ["never"] },
        { code: "var foo = [/* any comment */ 1, 2];", options: ["never"] },
        { code: "var foo = /* any comment */ [1, 2];", options: ["never"] },
        { code: "var foo = [1, 2, 3];", options: ["never"] },
        { code: "var foo = [1, (\n2\n), 3];", options: ["never"] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];", options: ["never"] },

        // "consistent"
        { code: "var foo = [];", options: ["consistent"] },
        { code: "var foo = [1];", options: ["consistent"] },
        { code: "var foo = [1, 2];", options: ["consistent"] },
        { code: "var foo = [1,\n2];", options: ["consistent"] },
        { code: "var foo = [1, 2, 3];", options: ["consistent"] },
        { code: "var foo = [1,\n2,\n3];", options: ["consistent"] },
        { code: "var foo = [1,\n2,\n,\n3];", options: ["consistent"] },
        { code: "var foo = [1, // any comment\n2];", options: ["consistent"] },
        { code: "var foo = [/* any comment */ 1, 2];", options: ["consistent"] },
        { code: "var foo = [1, (\n2\n), 3];", options: ["consistent"] },
        { code: "var foo = [1,\n(2)\n, 3];", options: ["consistent"] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];", options: ["consistent"] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];", options: ["consistent"] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}];", options: ["consistent"] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}, function bar() {\ndosomething();\n}];", options: ["consistent"] },

        // { multiline: true }
        { code: "var foo = [];", options: [{ multiline: true }] },
        { code: "var foo = [1];", options: [{ multiline: true }] },
        { code: "var foo = [1, 2];", options: [{ multiline: true }] },
        { code: "var foo = [1, 2, 3];", options: [{ multiline: true }] },
        { code: "var f = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];", options: [{ multiline: true }] },

        // { minItems: null }
        { code: "var foo = [];", options: [{ minItems: null }] },
        { code: "var foo = [1];", options: [{ minItems: null }] },
        { code: "var foo = [1, 2];", options: [{ minItems: null }] },
        { code: "var foo = [1, 2, 3];", options: [{ minItems: null }] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];", options: [{ minItems: null }] },

        // { minItems: 0 }
        { code: "var foo = [];", options: [{ minItems: 0 }] },
        { code: "var foo = [1];", options: [{ minItems: 0 }] },
        { code: "var foo = [1,\n2];", options: [{ minItems: 0 }] },
        { code: "var foo = [1,\n2,\n3];", options: [{ minItems: 0 }] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];", options: [{ minItems: 0 }] },

        // { minItems: 3 }
        { code: "var foo = [];", options: [{ minItems: 3 }] },
        { code: "var foo = [1];", options: [{ minItems: 3 }] },
        { code: "var foo = [1, 2];", options: [{ minItems: 3 }] },
        { code: "var foo = [1,\n2,\n3];", options: [{ minItems: 3 }] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];", options: [{ minItems: 3 }] },

        // { multiline: true, minItems: 3 }
        { code: "var foo = [];", options: [{ multiline: true, minItems: 3 }] },
        { code: "var foo = [1];", options: [{ multiline: true, minItems: 3 }] },
        { code: "var foo = [1, 2];", options: [{ multiline: true, minItems: 3 }] },
        { code: "var foo = [1, // any comment\n2,\n, 3];", options: [{ multiline: true, minItems: 3 }] },
        { code: "var foo = [1,\n2,\n// any comment\n, 3];", options: [{ multiline: true, minItems: 3 }] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];", options: [{ multiline: true, minItems: 3 }] },

        /*
         * ArrayPattern
         * "always"
         */
        { code: "var [] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a,\nb] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a, // any comment\nb] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [// any comment \na,\nb] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a,\nb // any comment\n] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a,\nb,\nb] = foo;", parserOptions: { ecmaVersion: 6 } },

        // { minItems: 3 }
        { code: "var [] = foo;", options: [{ minItems: 3 }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [a] = foo;", options: [{ minItems: 3 }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [a, b] = foo;", options: [{ minItems: 3 }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [a,\nb,\nc] = foo;", options: [{ minItems: 3 }], parserOptions: { ecmaVersion: 6 } }

    ],

    invalid: [

        /*
         * ArrayExpression
         * "always"
         */
        {
            code: "var foo = [1, 2];",
            output: "var foo = [1,\n2];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                }
            ]
        },
        {
            code: "var foo = [1, 2, 3];",
            output: "var foo = [1,\n2,\n3];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 17,
                    endLine: 1,
                    endColumn: 18
                }
            ]
        },
        {
            code: "var foo = [1,2, 3];",
            output: "var foo = [1,\n2,\n3];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 14
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 16,
                    endLine: 1,
                    endColumn: 17
                }
            ]
        },
        {
            code: "var foo = [1, (2), 3];",
            output: "var foo = [1,\n(2),\n3];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 20
                }
            ]
        },
        {
            code: "var foo = [1,(\n2\n), 3];",
            output: "var foo = [1,\n(\n2\n),\n3];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14
                },
                {
                    messageId: "missingLineBreak",
                    line: 3,
                    column: 3
                }
            ]
        },
        {
            code: "var foo = [1,        \t      (\n2\n),\n3];",
            output: "var foo = [1,\n(\n2\n),\n3];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            code: "var foo = [1, ((((2)))), 3];",
            output: "var foo = [1,\n((((2)))),\n3];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 25,
                    endLine: 1,
                    endColumn: 26
                }
            ]
        },
        {
            code: "var foo = [1,/* any comment */(2), 3];",
            output: "var foo = [1,/* any comment */\n(2),\n3];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 31,
                    endLine: 1,
                    endColumn: 31
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 35,
                    endLine: 1,
                    endColumn: 36
                }
            ]
        },
        {
            code: "var foo = [1,(  2), 3];",
            output: "var foo = [1,\n(  2),\n3];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 14
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 20,
                    endLine: 1,
                    endColumn: 21
                }
            ]
        },
        {
            code: "var foo = [1, [2], 3];",
            output: "var foo = [1,\n[2],\n3];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 20
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            output: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 4,
                    column: 3
                }
            ]
        },
        {
            code: "var foo = [\n(function foo() {\ndosomething();\n}), function bar() {\ndosomething();\n}\n];",
            output: "var foo = [\n(function foo() {\ndosomething();\n}),\nfunction bar() {\ndosomething();\n}\n];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 4,
                    column: 4
                }
            ]
        },

        // "never"
        {
            code: "var foo = [\n1,\n2\n];",
            output: "var foo = [\n1, 2\n];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 3
                }
            ]
        },
        {
            code: "var foo = [\n1\n, 2\n];",
            output: "var foo = [\n1, 2\n];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 3,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = [\n1 // any comment\n, 2\n];",
            output: null,
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 3,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = [\n1, // any comment\n2\n];",
            output: null,
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = [\n1,\n2 // any comment\n];",
            output: "var foo = [\n1, 2 // any comment\n];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 3
                }
            ]
        },
        {
            code: "var foo = [\n1,\n2,\n3\n];",
            output: "var foo = [\n1, 2, 3\n];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 3,
                    endLine: 3,
                    endColumn: 1
                },
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
            code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            output: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 4,
                    column: 3
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, /* any comment */\nfunction bar() {\ndosomething();\n}\n];",
            output: null,
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 4,
                    column: 21
                }
            ]
        },

        // "consistent"
        {
            code: "var foo = [1,\n2, 3];",
            output: "var foo = [1,\n2,\n3];",
            options: ["consistent"],
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
        {
            code: "var foo = [1, 2,\n3];",
            output: "var foo = [1,\n2,\n3];",
            options: ["consistent"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                }
            ]
        },
        {
            code: "var foo = [1,\n(\n2), 3];",
            output: "var foo = [1,\n(\n2),\n3];",
            options: ["consistent"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 3,
                    column: 4,
                    endLine: 3,
                    endColumn: 5
                }
            ]
        },
        {
            code: "var foo = [1,        \t      (\n2\n),\n3];",
            output: "var foo = [1,\n(\n2\n),\n3];",
            options: ["consistent"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 29
                }
            ]
        },
        {
            code: "var foo = [1, /* any comment */(2),\n3];",
            output: "var foo = [1, /* any comment */\n(2),\n3];",
            options: ["consistent"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 32
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n},function bar() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}];",
            output: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}];",
            options: ["consistent"],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 4,
                    column: 3
                }
            ]
        },

        // { multiline: true }
        {
            code: "var foo = [1,\n2, 3];",
            output: "var foo = [1, 2, 3];",
            options: [{ multiline: true }],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            output: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            options: [{ multiline: true }],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 4,
                    column: 3
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, /* any comment */ function bar() {\ndosomething();\n}\n];",
            output: "var foo = [\nfunction foo() {\ndosomething();\n}, /* any comment */\nfunction bar() {\ndosomething();\n}\n];",
            options: [{ multiline: true }],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 4,
                    column: 21
                }
            ]
        },

        // { minItems: null }
        {
            code: "var foo = [1,\n2];",
            output: "var foo = [1, 2];",
            options: [{ minItems: null }],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            code: "var foo = [1,\n2,\n3];",
            output: "var foo = [1, 2, 3];",
            options: [{ minItems: null }],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 14
                },
                {
                    messageId: "unexpectedLineBreak",
                    line: 2,
                    column: 3
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            output: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            options: [{ minItems: null }],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 4,
                    column: 3
                }
            ]
        },

        // { minItems: 0 }
        {
            code: "var foo = [1, 2];",
            output: "var foo = [1,\n2];",
            options: [{ minItems: 0 }],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            code: "var foo = [1, 2, 3];",
            output: "var foo = [1,\n2,\n3];",
            options: [{ minItems: 0 }],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            output: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            options: [{ minItems: 0 }],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 4,
                    column: 3
                }
            ]
        },

        // { minItems: 3 }
        {
            code: "var foo = [1,\n2];",
            output: "var foo = [1, 2];",
            options: [{ minItems: 3 }],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            code: "var foo = [1, 2, 3];",
            output: "var foo = [1,\n2,\n3];",
            options: [{ minItems: 3 }],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            output: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            options: [{ minItems: 3 }],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 4,
                    column: 3
                }
            ]
        },

        // { multiline: true, minItems: 3 }
        {
            code: "var foo = [1, 2, 3];",
            output: "var foo = [1,\n2,\n3];",
            options: [{ multiline: true, minItems: 3 }],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 14
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "var foo = [1,\n2];",
            output: "var foo = [1, 2];",
            options: [{ multiline: true, minItems: 3 }],
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            output: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            options: [{ multiline: true, minItems: 3 }],
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 4,
                    column: 3
                }
            ]
        },

        /*
         * ArrayPattern
         * "always"
         */
        {
            code: "var [a, b] = foo;",
            output: "var [a,\nb] = foo;",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 8
                }
            ]
        },
        {
            code: "var [a, b, c] = foo;",
            output: "var [a,\nb,\nc] = foo;",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 8
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 11
                }
            ]
        },

        // { minItems: 3 }
        {
            code: "var [a,\nb] = foo;",
            output: "var [a, b] = foo;",
            options: [{ minItems: 3 }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedLineBreak",
                    line: 1,
                    column: 8
                }
            ]
        },
        {
            code: "var [a, b, c] = foo;",
            output: "var [a,\nb,\nc] = foo;",
            options: [{ minItems: 3 }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 8
                },
                {
                    messageId: "missingLineBreak",
                    line: 1,
                    column: 11
                }
            ]
        }
    ]

});
