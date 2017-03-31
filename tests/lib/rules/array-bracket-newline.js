/**
 * @fileoverview Tests for array-bracket-newline rule.
 * @author Jan Peer Stöcklmair <https://github.com/JPeer264>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/array-bracket-newline");
const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const ERR_NO_BREAK_AFTER = "There should be no linebreak after '['.";
const ERR_BREAK_AFTER = "A linebreak is required after '['.";
const ERR_NO_BREAK_BEFORE = "There should be no linebreak before ']'.";
const ERR_BREAK_BEFORE = "A linebreak is required before ']'.";

ruleTester.run("array-bracket-newline", rule, {

    valid: [

        // ArrayExpression
        // "default" { multiline: true }
        "var foo = [];",
        "var foo = [1];",
        "var foo = /* any comment */[1];",
        "var foo = /* any comment */\n[1];",
        "var foo = [1, 2];",
        "var foo = [ // any comment\n1, 2\n];",
        "var foo = [\n// any comment\n1, 2\n];",
        "var foo = [\n1, 2\n// any comment\n];",
        "var foo = [\n1,\n2\n];",
        "var foo = [\nfunction foo() {\nreturn dosomething();\n}\n];",

        // "always"
        { code: "var foo = [\n];", options: ["always"] },
        { code: "var foo = [\n1\n];", options: ["always"] },
        { code: "var foo = [\n// any\n1\n];", options: ["always"] },
        { code: "var foo = [\n/* any */\n1\n];", options: ["always"] },
        { code: "var foo = [\n1, 2\n];", options: ["always"] },
        { code: "var foo = [\n1, 2 // any comment\n];", options: ["always"] },
        { code: "var foo = [\n1, 2 /* any comment */\n];", options: ["always"] },
        { code: "var foo = [\n1,\n2\n];", options: ["always"] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n}\n];", options: ["always"] },

        // "never"
        { code: "var foo = [];", options: ["never"] },
        { code: "var foo = [1];", options: ["never"] },
        { code: "var foo = [/* any comment */1];", options: ["never"] },
        { code: "var foo = [1, 2];", options: ["never"] },
        { code: "var foo = [1,\n2];", options: ["never"] },
        { code: "var foo = [1,\n/* any comment */\n2];", options: ["never"] },
        { code: "var foo = [function foo() {\ndosomething();\n}];", options: ["never"] },

        // { multiline: true }
        { code: "var foo = [];", options: [{ multiline: true }] },
        { code: "var foo = [1];", options: [{ multiline: true }] },
        { code: "var foo = /* any comment */[1];", options: [{ multiline: true }] },
        { code: "var foo = /* any comment */\n[1];", options: [{ multiline: true }] },
        { code: "var foo = [1, 2];", options: [{ multiline: true }] },
        { code: "var foo = [ // any comment\n1, 2\n];", options: [{ multiline: true }] },
        { code: "var foo = [\n// any comment\n1, 2\n];", options: [{ multiline: true }] },
        { code: "var foo = [\n1, 2\n// any comment\n];", options: [{ multiline: true }] },
        { code: "var foo = [\n1,\n2\n];", options: [{ multiline: true }] },
        { code: "var foo = [\nfunction foo() {\nreturn dosomething();\n}\n];", options: [{ multiline: true }] },

        // { multiline: false }
        { code: "var foo = [];", options: [{ multiline: false }] },
        { code: "var foo = [1];", options: [{ multiline: false }] },
        { code: "var foo = [1]/* any comment*/;", options: [{ multiline: false }] },
        { code: "var foo = [1]\n/* any comment*/\n;", options: [{ multiline: false }] },
        { code: "var foo = [1, 2];", options: [{ multiline: false }] },
        { code: "var foo = [1,\n2];", options: [{ multiline: false }] },
        { code: "var foo = [function foo() {\nreturn dosomething();\n}];", options: [{ multiline: false }] },

        // { minItems: 2 }
        { code: "var foo = [];", options: [{ minItems: 2 }] },
        { code: "var foo = [1];", options: [{ minItems: 2 }] },
        { code: "var foo = [\n1, 2\n];", options: [{ minItems: 2 }] },
        { code: "var foo = [\n1,\n2\n];", options: [{ minItems: 2 }] },
        { code: "var foo = [function foo() {\ndosomething();\n}];", options: [{ minItems: 2 }] },

        // { minItems: 0 }
        { code: "var foo = [\n];", options: [{ minItems: 0 }] },
        { code: "var foo = [\n1\n];", options: [{ minItems: 0 }] },
        { code: "var foo = [\n1, 2\n];", options: [{ minItems: 0 }] },
        { code: "var foo = [\n1,\n2\n];", options: [{ minItems: 0 }] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n}\n];", options: [{ minItems: 0 }] },

        // { minItems: null }
        { code: "var foo = [];", options: [{ minItems: null }] },
        { code: "var foo = [1];", options: [{ minItems: null }] },
        { code: "var foo = [1, 2];", options: [{ minItems: null }] },
        { code: "var foo = [1,\n2];", options: [{ minItems: null }] },
        { code: "var foo = [function foo() {\ndosomething();\n}];", options: [{ minItems: null }] },

        // { multiline: true, minItems: null }
        { code: "var foo = [];", options: [{ multiline: true, minItems: null }] },
        { code: "var foo = [1];", options: [{ multiline: true, minItems: null }] },
        { code: "var foo = [1, 2];", options: [{ multiline: true, minItems: null }] },
        { code: "var foo = [\n1,\n2\n];", options: [{ multiline: true, minItems: null }] },
        { code: "var foo = [\nfunction foo() {\ndosomething();\n}\n];", options: [{ multiline: true, minItems: null }] },

        // { multiline: true, minItems: 2 }
        { code: "var a = [];", options: [{ multiline: true, minItems: 2 }] },
        { code: "var b = [1];", options: [{ multiline: true, minItems: 2 }] },
        { code: "var b = [ // any comment\n1\n];", options: [{ multiline: true, minItems: 2 }] },
        { code: "var b = [ /* any comment */ 1];", options: [{ multiline: true, minItems: 2 }] },
        { code: "var c = [\n1, 2\n];", options: [{ multiline: true, minItems: 2 }] },
        { code: "var c = [\n/* any comment */1, 2\n];", options: [{ multiline: true, minItems: 2 }] },
        { code: "var c = [\n1, /* any comment */ 2\n];", options: [{ multiline: true, minItems: 2 }] },
        { code: "var d = [\n1,\n2\n];", options: [{ multiline: true, minItems: 2 }] },
        { code: "var e = [\nfunction foo() {\ndosomething();\n}\n];", options: [{ multiline: true, minItems: 2 }] },

        // ArrayPattern
        // default { multiline: true }
        { code: "var [] = foo", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var /* any comment */[a] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var /* any comment */\n[a] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a, b] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [ // any comment\na, b\n] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [\n// any comment\na, b\n] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [\na, b\n// any comment\n] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [\na,\nb\n] = foo;", parserOptions: { ecmaVersion: 6 } },

        // "always"
        { code: "var [\n] = foo;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\na\n] = foo;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\n// any\na\n] = foo;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\n/* any */\na\n] = foo;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\na, b\n] = foo;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\na, b // any comment\n] = foo;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\na, b /* any comment */\n] = foo;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\na,\nb\n] = foo;", options: ["always"], parserOptions: { ecmaVersion: 6 } },

        // { multiline: true }
        { code: "var [] = foo;", options: [{ multiline: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [a] = foo;", options: [{ multiline: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var /* any comment */[a] = foo;", options: [{ multiline: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var /* any comment */\n[a] = foo;", options: [{ multiline: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [a, b] = foo;", options: [{ multiline: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [ // any comment\na, b\n] = foo;", options: [{ multiline: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\n// any comment\na, b\n] = foo;", options: [{ multiline: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\na, b\n// any comment\n] = foo;", options: [{ multiline: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\na,\nb\n] = foo;", options: [{ multiline: true }], parserOptions: { ecmaVersion: 6 } }

    ],

    invalid: [

        // ArrayExpression
        // "always"
        {
            code: "var foo = [];",
            options: ["always"],
            output: "var foo = [\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var foo = [1];",
            options: ["always"],
            output: "var foo = [\n1\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 13
                }
            ]
        },
        {
            code: "var foo = [ // any comment\n1];",
            options: ["always"],
            output: "var foo = [ // any comment\n1\n];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 3
                }
            ]
        },
        {
            code: "var foo = [ /* any comment */\n1];",
            options: ["always"],
            output: "var foo = [ /* any comment */\n1\n];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = [1, 2];",
            options: ["always"],
            output: "var foo = [\n1, 2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 16,
                    endLine: 1,
                    endColumn: 17
                }
            ]
        },
        {
            code: "var foo = [1, 2 // any comment\n];",
            options: ["always"],
            output: "var foo = [\n1, 2 // any comment\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var foo = [1, 2 /* any comment */];",
            options: ["always"],
            output: "var foo = [\n1, 2 /* any comment */\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 34
                }
            ]
        },
        {
            code: "var foo = [1,\n2];",
            options: ["always"],
            output: "var foo = [\n1,\n2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = [function foo() {\ndosomething();\n}];",
            options: ["always"],
            output: "var foo = [\nfunction foo() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 2
                }
            ]
        },

        // "never"
        {
            code: "var foo = [\n];",
            options: ["never"],
            output: "var foo = [];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1\n];",
            options: ["never"],
            output: "var foo = [1];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 2
                }
            ]
        },
        {
            code: "var foo = [\n1\n];",
            options: ["never"],
            output: "var foo = [1];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [ /* any comment */\n1, 2\n];",
            options: ["never"],
            output: "var foo = [ /* any comment */\n1, 2];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1, 2\n/* any comment */];",
            options: ["never"],
            output: "var foo = [1, 2\n/* any comment */];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = [ // any comment\n1, 2\n];",
            options: ["never"],
            output: "var foo = [ // any comment\n1, 2];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1,\n2\n];",
            output: "var foo = [1,\n2];",
            options: ["never"],
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}\n];",
            options: ["never"],
            output: "var foo = [function foo() {\ndosomething();\n}];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
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
            code: "var foo = [\n];",
            options: [{ multiline: true }],
            output: "var foo = [];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n// any comment\n];",
            options: [{ multiline: true }],
            output: "var foo = [\n// any comment\n];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1\n];",
            options: [{ multiline: true }],
            output: "var foo = [1];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1, 2\n];",
            options: [{ multiline: true }],
            output: "var foo = [1, 2];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [1,\n2];",
            options: [{ multiline: true }],
            output: "var foo = [\n1,\n2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = [function foo() {\ndosomething();\n}];",
            options: [{ multiline: true }],
            output: "var foo = [\nfunction foo() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 2
                }
            ]
        },

        // { minItems: 2 }
        {
            code: "var foo = [\n];",
            options: [{ minItems: 2 }],
            output: "var foo = [];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1\n];",
            options: [{ minItems: 2 }],
            output: "var foo = [1];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [1, 2];",
            options: [{ minItems: 2 }],
            output: "var foo = [\n1, 2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 16
                }
            ]
        },
        {
            code: "var foo = [1,\n2];",
            options: [{ minItems: 2 }],
            output: "var foo = [\n1,\n2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}\n];",
            options: [{ minItems: 2 }],
            output: "var foo = [function foo() {\ndosomething();\n}];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 5,
                    column: 1
                }
            ]
        },

        // { minItems: 0 }
        {
            code: "var foo = [];",
            options: [{ minItems: 0 }],
            output: "var foo = [\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            code: "var foo = [1];",
            options: [{ minItems: 0 }],
            output: "var foo = [\n1\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 13
                }
            ]
        },
        {
            code: "var foo = [1, 2];",
            options: [{ minItems: 0 }],
            output: "var foo = [\n1, 2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 16
                }
            ]
        },
        {
            code: "var foo = [1,\n2];",
            options: [{ minItems: 0 }],
            output: "var foo = [\n1,\n2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 2
                }

            ]
        },
        {
            code: "var foo = [function foo() {\ndosomething();\n}];",
            options: [{ minItems: 0 }],
            output: "var foo = [\nfunction foo() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 2
                }
            ]
        },

        // { minItems: null }
        {
            code: "var foo = [\n];",
            options: [{ minItems: null }],
            output: "var foo = [];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1\n];",
            options: [{ minItems: null }],
            output: "var foo = [1];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1, 2\n];",
            options: [{ minItems: null }],
            output: "var foo = [1, 2];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1,\n2\n];",
            options: [{ minItems: null }],
            output: "var foo = [1,\n2];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}\n];",
            options: [{ minItems: null }],
            output: "var foo = [function foo() {\ndosomething();\n}];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 5,
                    column: 1
                }
            ]
        },

        // { multiline: true, minItems: null }
        {
            code: "var foo = [\n];",
            options: [{ multiline: true, minItems: null }],
            output: "var foo = [];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1\n];",
            options: [{ multiline: true, minItems: null }],
            output: "var foo = [1];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1, 2\n];",
            options: [{ multiline: true, minItems: null }],
            output: "var foo = [1, 2];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [1,\n2];",
            options: [{ multiline: true, minItems: null }],
            output: "var foo = [\n1,\n2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = [function foo() {\ndosomething();\n}];",
            options: [{ multiline: true, minItems: null }],
            output: "var foo = [\nfunction foo() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 2
                }
            ]
        },

        // { multiline: true, minItems: 2 }
        {
            code: "var foo = [\n];",
            options: [{ multiline: true, minItems: 2 }],
            output: "var foo = [];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1\n];",
            options: [{ multiline: true, minItems: 2 }],
            output: "var foo = [1];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [1, 2];",
            options: [{ multiline: true, minItems: 2 }],
            output: "var foo = [\n1, 2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 16
                }
            ]
        },
        {
            code: "var foo = [1,\n2];",
            options: [{ multiline: true, minItems: 2 }],
            output: "var foo = [\n1,\n2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = [function foo() {\ndosomething();\n}];",
            options: [{ multiline: true, minItems: 2 }],
            output: "var foo = [\nfunction foo() {\ndosomething();\n}\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 2
                }
            ]
        },

        // extra test cases
        // "always"
        {
            code: "var foo = [\n1, 2];",
            options: ["always"],
            output: "var foo = [\n1, 2\n];",
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 5
                }
            ]
        },
        {
            code: "var foo = [\t1, 2];",
            options: ["always"],
            output: "var foo = [\n\t1, 2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "var foo = [1,\n2\n];",
            options: ["always"],
            output: "var foo = [\n1,\n2\n];",
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                }
            ]
        },

        //  { multiline: false }
        {
            code: "var foo = [\n];",
            options: [{ multiline: false }],
            output: "var foo = [];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1\n];",
            options: [{ multiline: false }],
            output: "var foo = [1];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1, 2\n];",
            options: [{ multiline: false }],
            output: "var foo = [1, 2];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\n1,\n2\n];",
            options: [{ multiline: false }],
            output: "var foo = [1,\n2];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = [\nfunction foo() {\ndosomething();\n}\n];",
            options: [{ multiline: false }],
            output: "var foo = [function foo() {\ndosomething();\n}];",
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayExpression",
                    line: 5,
                    column: 1
                }
            ]
        },

        // ArrayPattern
        // "always"
        {
            code: "var [] = foo;",
            options: ["always"],
            output: "var [\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 6
                }
            ]
        },
        {
            code: "var [a] = foo;",
            options: ["always"],
            output: "var [\na\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 7
                }
            ]
        },
        {
            code: "var [ // any comment\na] = foo;",
            options: ["always"],
            output: "var [ // any comment\na\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 2,
                    column: 2
                }
            ]
        },
        {
            code: "var [ /* any comment */\na] = foo;",
            options: ["always"],
            output: "var [ /* any comment */\na\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 2,
                    column: 2
                }
            ]
        },
        {
            code: "var [a, b] = foo;",
            options: ["always"],
            output: "var [\na, b\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 10
                }
            ]
        },
        {
            code: "var [a, b // any comment\n] = foo;",
            options: ["always"],
            output: "var [\na, b // any comment\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code: "var [a, b /* any comment */] = foo;",
            options: ["always"],
            output: "var [\na, b /* any comment */\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 28
                }
            ]
        },
        {
            code: "var [a,\nb] = foo;",
            options: ["always"],
            output: "var [\na,\nb\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 2,
                    column: 2
                }
            ]
        },

        // { minItems: 2 }
        {
            code: "var [\n] = foo;",
            options: [{ minItems: 2 }],
            output: "var [] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var [\na\n] = foo;",
            options: [{ minItems: 2 }],
            output: "var [a] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_NO_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: ERR_NO_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var [a, b] = foo;",
            options: [{ minItems: 2 }],
            output: "var [\na, b\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 1,
                    column: 10
                }
            ]
        },
        {
            code: "var [a,\nb] = foo;",
            options: [{ minItems: 2 }],
            output: "var [\na,\nb\n] = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ERR_BREAK_AFTER,
                    type: "ArrayPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: ERR_BREAK_BEFORE,
                    type: "ArrayPattern",
                    line: 2,
                    column: 2
                }
            ]
        }

    ]
});
