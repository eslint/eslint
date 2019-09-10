/**
 * @fileoverview Tests for the prefer-regex-literals rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-regex-literals");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("prefer-regex-literals", rule, {
    valid: [
        "/abc/",
        "/abc/g",

        // considered as dynamic
        "new RegExp(pattern)",
        "RegExp(pattern, 'g')",
        "new RegExp(f('a'))",
        "RegExp(prefix + 'a')",
        "new RegExp('a' + sufix)",
        {
            code: "RegExp(`a` + sufix);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(String.raw`a` + sufix);",
            parserOptions: { ecmaVersion: 2015 }
        },
        "RegExp('a', flags)",
        "RegExp('a', 'g' + flags)",
        {
            code: "new RegExp(String.raw`a`, flags);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "RegExp(`${prefix}abc`)",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(`a${b}c`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(`a${''}c`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(String.raw`a${b}c`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(String.raw`a${''}c`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        "new RegExp('a' + 'b')",
        "RegExp(1)",

        // invalid number of arguments
        "new RegExp;",
        "new RegExp();",
        "RegExp();",
        "new RegExp('a', 'g', 'b');",
        "RegExp('a', 'g', 'b');",
        {
            code: "new RegExp(`a`, `g`, `b`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "RegExp(`a`, `g`, `b`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(String.raw`a`, String.raw`g`, String.raw`b`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "RegExp(String.raw`a`, String.raw`g`, String.raw`b`);",
            parserOptions: { ecmaVersion: 2015 }
        },

        // not String.raw``
        {
            code: "new RegExp(String`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "RegExp(raw`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(f(String.raw)`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "RegExp(string.raw`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(String.Raw`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(String[raw]`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "RegExp(String.raw.foo`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(String.foo.raw`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "RegExp(foo.String.raw`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new RegExp(String.raw);",
            parserOptions: { ecmaVersion: 2015 }
        },

        // not the global RegExp
        "new Regexp('abc');",
        {
            code: "Regexp(`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "new Regexp(String.raw`a`);",
            parserOptions: { ecmaVersion: 2015 }
        },
        "function foo() { var RegExp; RegExp('a', 'g'); }",
        {
            code: "if (foo) { const RegExp = bar; RegExp('a'); }",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "function foo(RegExp) { new RegExp(String.raw`a`); }",
            parserOptions: { ecmaVersion: 2015 }
        },
        "/* globals RegExp:off */ new RegExp('a');",
        {
            code: "RegExp('a');",
            globals: { RegExp: "off" }
        }
    ],

    invalid: [
        {
            code: "new RegExp('abc');",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp('abc');",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp('abc', 'g');",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp('abc', 'g');",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(`abc`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(`abc`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(`abc`, `g`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(`abc`, `g`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw`abc`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(String.raw`abc`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw`abc`, String.raw`g`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(String.raw`abc`, String.raw`g`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String['raw']`a`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "new RegExp('');",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp('', '');",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw``);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "new RegExp('a', `g`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(`a`, 'g');",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "RegExp(String.raw`a`, 'g');",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw`\\d`, `g`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp('a', String.raw`g`);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        }
    ]
});
