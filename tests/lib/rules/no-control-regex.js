/**
 * @fileoverview Tests for no-control-regex rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-control-regex"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
        "new (function foo(){})('\\x1f')"
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
        }
    ]
});
