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

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });

ruleTester.run("prefer-regex-literals", rule, {
    valid: [
        "/abc/",
        "/abc/g",


        // considered as dynamic
        "new RegExp(pattern)",
        "RegExp(pattern, 'g')",
        "new RegExp(f('a'))",
        "RegExp(prefix + 'a')",
        "new RegExp('a' + suffix)",
        "RegExp(`a` + suffix);",
        "new RegExp(String.raw`a` + suffix);",
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
        "new RegExp(/a/, 'u');",
        "new RegExp(/a/);",
        {
            code: "new RegExp(/a/, flags);",
            options: [{ disallowRedundantWrapping: true }]
        },
        {
            code: "new RegExp(/a/, `u${flags}`);",
            options: [{ disallowRedundantWrapping: true }]
        },

        // redundant wrapping is allowed
        {
            code: "new RegExp(/a/);",
            options: [{}]
        },
        {
            code: "new RegExp(/a/);",
            options: [{ disallowRedundantWrapping: false }]
        },

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
        {
            code: "new RegExp(/a/, 'u', 'foo');",
            options: [{ disallowRedundantWrapping: true }]
        },

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
        },
        "new globalThis.RegExp('a');",
        {
            code: "new globalThis.RegExp('a');",
            env: { es6: true }
        },
        {
            code: "new globalThis.RegExp('a');",
            env: { es2017: true }
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
        },
        {
            code: "new globalThis.RegExp('a');",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "globalThis.RegExp('a');",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },

        {
            code: "new RegExp(/a/);",
            options: [{ disallowRedundantWrapping: true }],
            errors: [{ messageId: "unexpectedRedundantRegExp", type: "NewExpression", line: 1, column: 1 }]
        },
        {
            code: "new RegExp(/a/, 'u');",
            options: [{ disallowRedundantWrapping: true }],
            errors: [{ messageId: "unexpectedRedundantRegExpWithFlags", type: "NewExpression", line: 1, column: 1 }]
        },
        {
            code: "new RegExp(/a/, `u`);",
            options: [{ disallowRedundantWrapping: true }],
            errors: [{ messageId: "unexpectedRedundantRegExpWithFlags", type: "NewExpression", line: 1, column: 1 }]
        },
        {
            code: "new RegExp('a');",
            options: [{ disallowRedundantWrapping: true }],
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression", line: 1, column: 1 }]
        },

        // Optional chaining
        {
            code: "new RegExp((String?.raw)`a`);",
            errors: [{ messageId: "unexpectedRegExp" }]
        }
    ]
});
