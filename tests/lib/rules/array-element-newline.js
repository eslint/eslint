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

const ERR_NO_BREAK_BEFORE = "There should be no line break before this item.";
const ERR_BREAK_BEFORE = "A line break is required before this item.";

ruleTester.run("array-element-newline", rule, {

    valid: [

        // ArrayExpression
        // "always"
        "var foo = [];",
        "var foo = [1];",
        "var foo = [1,\n2];",
        "var foo = [1, // any comment\n2];",
        "var foo = [// any comment \n1,\n2];",
        "var foo = [1,\n2 // any comment\n];",
        "var foo = [1,\n2,\n3];",
        "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\nosomething();\n}\n];",

        { code: "var foo = [];", options: ["always"] },
        { code: "var foo = [1];", options: ["always"] },
        { code: "var foo = [1,\n2];", options: ["always"] },
        { code: "var foo = [1, // any comment\n2];", options: ["always"] },
        { code: "var foo = [// any comment \n1,\n2];", options: ["always"] },
        { code: "var foo = [1,\n2 // any comment\n];", options: ["always"] },
        { code: "var foo = [1,\n2,\n3];", options: ["always"] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\nosomething();\n}\n];", options: ["always"] },

        // "never"
        { code: "var foo = [];", options: ["never"] },
        { code: "var foo = [1];", options: ["never"] },
        { code: "var foo = [1, 2];", options: ["never"] },
        { code: "var foo = [1, /* any comment */ 2];", options: ["never"] },
        { code: "var foo = [/* any comment */ 1, 2];", options: ["never"] },
        { code: "var foo = /* any comment */ [1, 2];", options: ["never"] },
        { code: "var foo = [1, 2, 3];", options: ["never"] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];", options: ["never"] },

        // { multiline: true }
        { code: "var foo = [];", options: [{ multiline: true }] },
        { code: "var foo = [1];", options: [{ multiline: true }] },
        { code: "var foo = [1, 2];", options: [{ multiline: true }] },
        { code: "var foo = [1, 2, 3];", options: [{ multiline: true }] },
        { code: "var foo = [1,\n2,\n3];", options: [{ multiline: true }] },
        { code: "var f = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];", options: [{ multiline: true }] },

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
        { code: "var foo = [1,\n2,\n];", options: [{ multiline: true, minItems: 3 }] },
        { code: "var foo = [1, // any comment\n2,\n];", options: [{ multiline: true, minItems: 3 }] },
        { code: "var foo = [1,\n2,\n// any comment\n];", options: [{ multiline: true, minItems: 3 }] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];", options: [{ multiline: true, minItems: 3 }] },

        // ArrayPattern
        // "always"
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

        // ArrayExpression
        // "always"
        {
            code: "var foo = [1, 2];",
            options: ["always"],
            output: "var foo = [1,\n2];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 16
                }
            ]
        },
        {
            code: "var foo = [1, 2, 3];",
            options: ["always"],
            output: "var foo = [1,\n2,\n3];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 16
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 19
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            options: ["always"],
            output: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 4,
                    column: 4
                }
            ]
        },

        // "never"
        {
            code: "var foo = [\n1,\n2\n];",
            options: ["never"],
            output: "var foo = [\n1, 2\n];",
            errors: [
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1, // any comment\n2\n];",
            options: ["never"],
            output: "var foo = [\n1, // any comment\n2\n];",
            errors: [
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1,\n2 // any comment\n];",
            options: ["never"],
            output: "var foo = [\n1, 2 // any comment\n];",
            errors: [
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1,\n2,\n3\n];",
            options: ["never"],
            output: "var foo = [\n1, 2, 3\n];",
            errors: [
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 2
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 4,
                    column: 1,
                    endLine: 4,
                    endColumn: 2
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            options: ["never"],
            output: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 5,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, /* any comment */\nfunction bar() {\ndosomething();\n}\n];",
            options: ["never"],
            output: "var foo = [\nfunction foo() {\ndosomething();\n}, /* any comment */\nfunction bar() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 5,
                    column: 1
                }
            ]
        },

        // { multiline: true }
        {
            code: "var foo = [1,\n2, 3];",
            options: [{ multiline: true }],
            output: "var foo = [1,\n2,\n3];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 4
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            options: [{ multiline: true }],
            output: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 4,
                    column: 4
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, /* any comment */ function bar() {\ndosomething();\n}\n];",
            options: [{ multiline: true }],
            output: "var foo = [\nfunction foo() {\ndosomething();\n}, /* any comment */\nfunction bar() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 4,
                    column: 22
                }
            ]
        },

        // { minItems: 3 }
        {
            code: "var foo = [1,\n2];",
            options: [{ minItems: 3 }],
            output: "var foo = [1, 2];",
            errors: [
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [1, 2, 3];",
            options: [{ minItems: 3 }],
            output: "var foo = [1,\n2,\n3];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 15
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            options: [{ minItems: 3 }],
            output: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 5,
                    column: 1
                }
            ]
        },

        // { multiline: true, minItems: 3 }
        {
            code: "var foo = [1, 2, 3];",
            options: [{ multiline: true, minItems: 3 }],
            output: "var foo = [1,\n2,\n3];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 15
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}, function bar() {\ndosomething();\n}\n];",
            options: [{ multiline: true, minItems: 3 }],
            output: "var foo = [\nfunction foo() {\ndosomething();\n},\nfunction bar() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 4,
                    column: 4
                }
            ]
        },

        // ArrayPattern
        // "always"
        {
            code: "var [a, b] = foo;",
            options: ["always"],
            output: "var [a,\nb] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 9
                }
            ]
        },
        {
            code: "var [a, b, c] = foo;",
            options: ["always"],
            output: "var [a,\nb,\nc] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 9
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 12
                }
            ]
        },

        // { minItems: 3 }
        {
            code: "var [a,\nb] = foo;",
            options: [{ minItems: 3 }],
            output: "var [a, b] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var [a, b, c] = foo;",
            options: [{ minItems: 3 }],
            output: "var [a,\nb,\nc] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 9
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 12
                }
            ]
        }
    ]

});
