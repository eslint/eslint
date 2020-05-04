/**
 * @fileoverview Tests for require-unicode-regexp rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-unicode-regexp");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2015 }
});

ruleTester.run("require-unicode-regexp", rule, {
    valid: [
        "/foo/u",
        "/foo/gimuy",
        "RegExp('', 'u')",
        "new RegExp('', 'u')",
        "RegExp('', 'gimuy')",
        "new RegExp('', 'gimuy')",
        "const flags = 'u'; new RegExp('', flags)",
        "const flags = 'g'; new RegExp('', flags + 'u')",
        "const flags = 'gimu'; new RegExp('foo', flags.slice(1))",
        "new RegExp('', flags)",
        "function f(flags) { return new RegExp('', flags) }",
        "function f(RegExp) { return new RegExp('foo') }"
    ],
    invalid: [
        {
            code: "/foo/",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "/foo/gimy",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "RegExp('foo')",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "RegExp('foo', '')",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "RegExp('foo', 'gimy')",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "new RegExp('foo')",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "new RegExp('foo', '')",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "new RegExp('foo', 'gimy')",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "const flags = 'gi'; new RegExp('foo', flags)",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "const flags = 'gimu'; new RegExp('foo', flags.slice(0, -1))",
            errors: [{ messageId: "requireUFlag" }]
        },
        {
            code: "new window.RegExp('foo')",
            errors: [{ messageId: "requireUFlag" }],
            env: { browser: true }
        },
        {
            code: "new global.RegExp('foo')",
            errors: [{ messageId: "requireUFlag" }],
            env: { node: true }
        }
    ]
});
