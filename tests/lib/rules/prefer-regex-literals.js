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

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

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
        "RegExp(`a` + sufix);",
        "new RegExp(String.raw`a` + sufix);",
        "RegExp('a', flags)",
        "RegExp('a', 'g' + flags)",
        "new RegExp(String.raw`a`, flags);",
        "RegExp(`${prefix}abc`)",
        "new RegExp(`a${b}c`);",
        "new RegExp(`a${''}c`);",
        "new RegExp(String.raw`a${b}c`);",
        "new RegExp(String.raw`a${''}c`);",
        "new RegExp('a' + 'b')",
        "RegExp(1)",

        // invalid number of arguments
        "new RegExp;",
        "new RegExp();",
        "RegExp();",
        "new RegExp('a', 'g', 'b');",
        "RegExp('a', 'g', 'b');",
        "new RegExp(`a`, `g`, `b`);",
        "RegExp(`a`, `g`, `b`);",
        "new RegExp(String.raw`a`, String.raw`g`, String.raw`b`);",
        "RegExp(String.raw`a`, String.raw`g`, String.raw`b`);",

        // not String.raw``
        "new RegExp(String`a`);",
        "RegExp(raw`a`);",
        "new RegExp(f(String.raw)`a`);",
        "RegExp(string.raw`a`);",
        "new RegExp(String.Raw`a`);",
        "new RegExp(String[raw]`a`);",
        "RegExp(String.raw.foo`a`);",
        "new RegExp(String.foo.raw`a`);",
        "RegExp(foo.String.raw`a`);",
        "new RegExp(String.raw);",

        // not the global String in String.raw``
        "let String; new RegExp(String.raw`a`);",
        "function foo() { var String; new RegExp(String.raw`a`); }",
        "function foo(String) { RegExp(String.raw`a`); }",
        "if (foo) { const String = bar; RegExp(String.raw`a`); }",
        "/* globals String:off */ new RegExp(String.raw`a`);",
        {
            code: "RegExp('a', String.raw`g`);",
            globals: { String: "off" }
        },

        // not RegExp
        "new Regexp('abc');",
        "Regexp(`a`);",
        "new Regexp(String.raw`a`);",

        // not the global RegExp
        "let RegExp; new RegExp('a');",
        "function foo() { var RegExp; RegExp('a', 'g'); }",
        "function foo(RegExp) { new RegExp(String.raw`a`); }",
        "if (foo) { const RegExp = bar; RegExp('a'); }",
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
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(`abc`);",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(`abc`, `g`);",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(`abc`, `g`);",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw`abc`);",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(String.raw`abc`);",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw`abc`, String.raw`g`);",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(String.raw`abc`, String.raw`g`);",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String['raw']`a`);",
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
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "new RegExp('a', `g`);",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(`a`, 'g');",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "RegExp(String.raw`a`, 'g');",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw`\\d`, `g`);",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp('a', String.raw`g`);",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        }
    ]
});
