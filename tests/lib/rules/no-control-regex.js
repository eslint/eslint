/**
 * @fileoverview Tests for no-control-regex rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-control-regex"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-control-regex", rule, {
    valid: [
        "var regex = /x1f/",
        String.raw`var regex = /\\x1f/`,
        "var regex = new RegExp('x1f')",
        "var regex = RegExp('x1f')",
        "new RegExp('[')",
        "RegExp('[')",
        "new (function foo(){})('\\x1f')",
        { code: String.raw`/\u{20}/u`, parserOptions: { ecmaVersion: 2015 } },
        String.raw`/\u{1F}/`,
        String.raw`/\u{1F}/g`,
        String.raw`new RegExp("\\u{20}", "u")`,
        String.raw`new RegExp("\\u{1F}")`,
        String.raw`new RegExp("\\u{1F}", "g")`,
        String.raw`new RegExp("\\u{1F}", flags)` // when flags are unknown, this rule assumes there's no `u` flag
    ],
    invalid: [
        { code: String.raw`var regex = /\x1f/`, errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }] },
        { code: String.raw`var regex = /\\\x1f\\x1e/`, errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }] },
        { code: String.raw`var regex = /\\\x1fFOO\\x00/`, errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }] },
        { code: String.raw`var regex = /FOO\\\x1fFOO\\x1f/`, errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }] },
        { code: "var regex = new RegExp('\\x1f\\x1e')", errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f, \\x1e" }, type: "Literal" }] },
        { code: "var regex = new RegExp('\\x1fFOO\\x00')", errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f, \\x00" }, type: "Literal" }] },
        { code: "var regex = new RegExp('FOO\\x1fFOO\\x1f')", errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f, \\x1f" }, type: "Literal" }] },
        { code: "var regex = RegExp('\\x1f')", errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }] },
        {
            code: "var regex = /(?<a>\\x1f)/",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }]
        },
        {
            code: String.raw`var regex = /(?<\u{1d49c}>.)\x1f/`,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }]
        },
        {
            code: String.raw`new RegExp("\\u001F", flags)`,
            errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }]
        },
        {
            code: String.raw`/\u{1111}*\x1F/u`,
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }]
        },
        {
            code: String.raw`new RegExp("\\u{1111}*\\x1F", "u")`,
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }]
        },
        {
            code: String.raw`/\u{1F}/u`,
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }]
        },
        {
            code: String.raw`/\u{1F}/gui`,
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }]
        },
        {
            code: String.raw`new RegExp("\\u{1F}", "u")`,
            errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }]
        },
        {
            code: String.raw`new RegExp("\\u{1F}", "gui")`,
            errors: [{ messageId: "unexpected", data: { controlChars: "\\x1f" }, type: "Literal" }]
        }
    ]
});
