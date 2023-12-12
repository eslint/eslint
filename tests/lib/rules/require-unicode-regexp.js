/**
 * @fileoverview Tests for require-unicode-regexp rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-unicode-regexp");
const RuleTester = require("../../../lib/rule-tester/flat-rule-tester");
const globals = require("globals");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: { ecmaVersion: 2015 }
});

ruleTester.run("require-unicode-regexp", rule, {
    valid: [
        "/foo/u",
        "/foo/gimuy",
        "RegExp('', 'u')",
        "RegExp('', `u`)",
        "new RegExp('', 'u')",
        "RegExp('', 'gimuy')",
        "RegExp('', `gimuy`)",
        "RegExp(...patternAndFlags)",
        "new RegExp('', 'gimuy')",
        "const flags = 'u'; new RegExp('', flags)",
        "const flags = 'g'; new RegExp('', flags + 'u')",
        "const flags = 'gimu'; new RegExp('foo', flags[3])",
        "new RegExp('', flags)",
        "function f(flags) { return new RegExp('', flags) }",
        "function f(RegExp) { return new RegExp('foo') }",
        "function f(patternAndFlags) { return new RegExp(...patternAndFlags) }",
        { code: "new globalThis.RegExp('foo')", languageOptions: { ecmaVersion: 6 } },
        { code: "new globalThis.RegExp('foo')", languageOptions: { ecmaVersion: 2017 } },
        { code: "new globalThis.RegExp('foo', 'u')", languageOptions: { ecmaVersion: 2020 } },
        { code: "globalThis.RegExp('foo', 'u')", languageOptions: { ecmaVersion: 2020 } },
        { code: "const flags = 'u'; new globalThis.RegExp('', flags)", languageOptions: { ecmaVersion: 2020 } },
        { code: "const flags = 'g'; new globalThis.RegExp('', flags + 'u')", languageOptions: { ecmaVersion: 2020 } },
        { code: "const flags = 'gimu'; new globalThis.RegExp('foo', flags[3])", languageOptions: { ecmaVersion: 2020 } },
        { code: "class C { #RegExp; foo() { new globalThis.#RegExp('foo') } }", languageOptions: { ecmaVersion: 2022 } },

        // for v flag
        { code: "/foo/v", languageOptions: { ecmaVersion: 2024 } },
        { code: "/foo/gimvy", languageOptions: { ecmaVersion: 2024 } },
        { code: "RegExp('', 'v')", languageOptions: { ecmaVersion: 2024 } },
        { code: "RegExp('', `v`)", languageOptions: { ecmaVersion: 2024 } },
        { code: "new RegExp('', 'v')", languageOptions: { ecmaVersion: 2024 } },
        { code: "RegExp('', 'gimvy')", languageOptions: { ecmaVersion: 2024 } },
        { code: "RegExp('', `gimvy`)", languageOptions: { ecmaVersion: 2024 } },
        { code: "new RegExp('', 'gimvy')", languageOptions: { ecmaVersion: 2024 } },
        { code: "const flags = 'v'; new RegExp('', flags)", languageOptions: { ecmaVersion: 2024 } },
        { code: "const flags = 'g'; new RegExp('', flags + 'v')", languageOptions: { ecmaVersion: 2024 } },
        { code: "const flags = 'gimv'; new RegExp('foo', flags[3])", languageOptions: { ecmaVersion: 2024 } }
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
            code: "RegExp()",
            errors: [{
                messageId: "requireUFlag",
                suggestions: null
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
            code: "RegExp('foo', `gimy`)",
            errors: [{
                messageId: "requireUFlag",
                suggestions: [
                    {
                        messageId: "addUFlag",
                        output: "RegExp('foo', `gimyu`)"
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
            code: "let flags; new RegExp('foo', flags = 'g')",
            errors: [{
                messageId: "requireUFlag",
                suggestions: null
            }]
        },
        {
            code: "const flags = `gi`; new RegExp(`foo`, (`unrelated`, flags))",
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
            languageOptions: { globals: globals.browser },
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
            languageOptions: { sourceType: "commonjs" },
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
            languageOptions: { ecmaVersion: 2020 },
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
