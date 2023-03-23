/**
 * @fileoverview Tests for require-unicode-regexp rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-unicode-regexp");
const { RuleTester } = require("../../../lib/rule-tester");

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
        "const flags = 'gimu'; new RegExp('foo', flags[3])",
        "new RegExp('', flags)",
        "function f(flags) { return new RegExp('', flags) }",
        "function f(RegExp) { return new RegExp('foo') }",
        { code: "new globalThis.RegExp('foo')", env: { es6: true } },
        { code: "new globalThis.RegExp('foo')", env: { es2017: true } },
        { code: "new globalThis.RegExp('foo', 'u')", env: { es2020: true } },
        { code: "globalThis.RegExp('foo', 'u')", env: { es2020: true } },
        { code: "const flags = 'u'; new globalThis.RegExp('', flags)", env: { es2020: true } },
        { code: "const flags = 'g'; new globalThis.RegExp('', flags + 'u')", env: { es2020: true } },
        { code: "const flags = 'gimu'; new globalThis.RegExp('foo', flags[3])", env: { es2020: true } },
        { code: "class C { #RegExp; foo() { new globalThis.#RegExp('foo') } }", parserOptions: { ecmaVersion: 2022 }, env: { es2020: true } }
    ],
    invalid: [
        {
            code: "/\\a/",
            errors: [{
                messageId: "requireUFlag",
                suggestions: null
            }]
        },
        {
            code: "/foo/",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "/foo/u"
                    }
                ]
            }]
        },
        {
            code: "/foo/gimy",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "/foo/gimyu"
                    }
                ]
            }]
        },
        {
            code: "RegExp('foo')",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "RegExp('foo', \"u\")"
                    }
                ]
            }]
        },
        {
            code: "RegExp('\\\\a')",
            errors: [{
                messageId: "requireUFlag",
                suggestions: null
            }]
        },
        {
            code: "RegExp('foo', '')",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "RegExp('foo', 'u')"
                    }
                ]
            }]
        },
        {
            code: "RegExp('foo', 'gimy')",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "RegExp('foo', 'gimyu')"
                    }
                ]
            }]
        },
        {
            code: "new RegExp('foo')",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "new RegExp('foo', \"u\")"
                    }
                ]
            }]
        },
        {
            code: "new RegExp('foo', false)",
            errors: [{
                messageId: "requireUFlag",
                suggestions: null
            }]
        },
        {
            code: "new RegExp('foo', 1)",
            errors: [{
                messageId: "requireUFlag",
                suggestions: null
            }]
        },
        {
            code: "new RegExp('foo', '')",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "new RegExp('foo', 'u')"
                    }
                ]
            }]
        },
        {
            code: "new RegExp('foo', 'gimy')",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "new RegExp('foo', 'gimyu')"
                    }
                ]
            }]
        },
        {
            code: "new RegExp(('foo'))",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "new RegExp(('foo'), \"u\")"
                    }
                ]
            }]
        },
        {
            code: "new RegExp(('unrelated', 'foo'))",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "new RegExp(('unrelated', 'foo'), \"u\")"
                    }
                ]
            }]
        },
        {
            code: "const flags = 'gi'; new RegExp('foo', flags)",
            errors: [{
                messageId: "requireUFlag",
                suggestions: null
            }]
        },
        {
            code: "const flags = 'gi'; new RegExp('foo', ('unrelated', flags))",
            errors: [{
                messageId: "requireUFlag",
                suggestions: null
            }]
        },
        {
            code: "const flags = 'gimu'; new RegExp('foo', flags[0])",
            errors: [{
                messageId: "requireUFlag",
                suggestions: null
            }]
        },
        {
            code: "new window.RegExp('foo')",
            env: { browser: true },
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "new window.RegExp('foo', \"u\")"
                    }
                ]
            }]
        },
        {
            code: "new global.RegExp('foo')",
            env: { node: true },
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "new global.RegExp('foo', \"u\")"
                    }
                ]
            }]
        },
        {
            code: "new globalThis.RegExp('foo')",
            env: { es2020: true },
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "new globalThis.RegExp('foo', \"u\")"
                    }
                ]
            }]
        }
    ]
});
