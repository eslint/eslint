/**
 * @fileoverview Tests for no-implied-eval rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-implied-eval"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(),
    expectedError = { messageId: "impliedEval", type: "CallExpression" };

ruleTester.run("no-implied-eval", rule, {
    valid: [
        "setTimeout();",

        { code: "setTimeout;", env: { browser: true } },
        { code: "setTimeout = foo;", env: { browser: true } },
        { code: "window.setTimeout;", env: { browser: true } },
        { code: "window.setTimeout = foo;", env: { browser: true } },
        { code: "window['setTimeout'];", env: { browser: true } },
        { code: "window['setTimeout'] = foo;", env: { browser: true } },
        { code: "global.setTimeout;", env: { node: true } },
        { code: "global.setTimeout = foo;", env: { node: true } },
        { code: "global['setTimeout'];", env: { node: true } },
        { code: "global['setTimeout'] = foo;", env: { node: true } },
        { code: "globalThis['setTimeout'] = foo;", env: { es2020: true } },

        "window.setTimeout('foo')",
        "window.setInterval('foo')",
        "window['setTimeout']('foo')",
        "window['setInterval']('foo')",

        { code: "window.setTimeout('foo')", env: { node: true } },
        { code: "window.setInterval('foo')", env: { node: true } },
        { code: "window['setTimeout']('foo')", env: { node: true } },
        { code: "window['setInterval']('foo')", env: { node: true } },
        { code: "global.setTimeout('foo')", env: { browser: true } },
        { code: "global.setInterval('foo')", env: { browser: true } },
        { code: "global['setTimeout']('foo')", env: { browser: true } },
        { code: "global['setInterval']('foo')", env: { browser: true } },
        { code: "globalThis.setTimeout('foo')", env: { es6: true } },
        { code: "globalThis['setInterval']('foo')", env: { es2017: true } },

        { code: "window[`SetTimeOut`]('foo', 100);", parserOptions: { ecmaVersion: 6 }, env: { browser: true } },
        { code: "global[`SetTimeOut`]('foo', 100);", parserOptions: { ecmaVersion: 6 }, env: { node: true } },
        { code: "global[`setTimeout${foo}`]('foo', 100);", parserOptions: { ecmaVersion: 6 }, env: { browser: true } },
        { code: "global[`setTimeout${foo}`]('foo', 100);", parserOptions: { ecmaVersion: 6 }, env: { node: true } },
        { code: "globalThis[`setTimeout${foo}`]('foo', 100);", parserOptions: { ecmaVersion: 6 }, env: { es2020: true } },

        // normal usage
        "setTimeout(function() { x = 1; }, 100);",
        "setInterval(function() { x = 1; }, 100)",
        "execScript(function() { x = 1; }, 100)",
        { code: "window.setTimeout(function() { x = 1; }, 100);", env: { browser: true } },
        { code: "window.setInterval(function() { x = 1; }, 100);", env: { browser: true } },
        { code: "window.execScript(function() { x = 1; }, 100);", env: { browser: true } },
        { code: "window.setTimeout(foo, 100);", env: { browser: true } },
        { code: "window.setInterval(foo, 100);", env: { browser: true } },
        { code: "window.execScript(foo, 100);", env: { browser: true } },
        { code: "global.setTimeout(function() { x = 1; }, 100);", env: { node: true } },
        { code: "global.setInterval(function() { x = 1; }, 100);", env: { node: true } },
        { code: "global.execScript(function() { x = 1; }, 100);", env: { node: true } },
        { code: "global.setTimeout(foo, 100);", env: { node: true } },
        { code: "global.setInterval(foo, 100);", env: { node: true } },
        { code: "global.execScript(foo, 100);", env: { node: true } },
        { code: "globalThis.setTimeout(foo, 100);", env: { es2020: true } },

        // only checks on top-level statements or window.*
        "foo.setTimeout('hi')",

        // identifiers are fine
        "setTimeout(foo, 10)",
        "setInterval(1, 10)",
        "execScript(2)",

        // as are function expressions
        "setTimeout(function() {}, 10)",

        // setInterval
        "foo.setInterval('hi')",
        "setInterval(foo, 10)",
        "setInterval(function() {}, 10)",

        // execScript
        "foo.execScript('hi')",
        "execScript(foo)",
        "execScript(function() {})",

        // a binary plus on non-strings doesn't guarantee a string
        "setTimeout(foo + bar, 10)",

        // doesn't check anything but the first argument
        "setTimeout(foobar, 'buzz')",
        "setTimeout(foobar, foo + 'bar')",

        // only checks immediate subtrees of the argument
        "setTimeout(function() { return 'foobar'; }, 10)",

        // https://github.com/eslint/eslint/issues/7821
        "setTimeoutFooBar('Foo Bar')",

        { code: "foo.window.setTimeout('foo', 100);", env: { browser: true } },
        { code: "foo.global.setTimeout('foo', 100);", env: { node: true } },
        { code: "var window; window.setTimeout('foo', 100);", env: { browser: true } },
        { code: "var global; global.setTimeout('foo', 100);", env: { node: true } },
        { code: "function foo(window) { window.setTimeout('foo', 100); }", env: { browser: true } },
        { code: "function foo(global) { global.setTimeout('foo', 100); }", env: { node: true } },
        { code: "foo('', window.setTimeout);", env: { browser: true } },
        { code: "foo('', global.setTimeout);", env: { node: true } }
    ],

    invalid: [
        { code: "setTimeout(\"x = 1;\");", errors: [expectedError] },
        { code: "setTimeout(\"x = 1;\", 100);", errors: [expectedError] },
        { code: "setInterval(\"x = 1;\");", errors: [expectedError] },
        { code: "execScript(\"x = 1;\");", errors: [expectedError] },

        { code: "const s = 'x=1'; setTimeout(s, 100);", parserOptions: { ecmaVersion: 6 }, errors: [expectedError] },
        { code: "setTimeout(String('x=1'), 100);", parserOptions: { ecmaVersion: 6 }, errors: [expectedError] },

        // member expressions
        { code: "window.setTimeout('foo')", env: { browser: true }, errors: [expectedError] },
        { code: "window.setInterval('foo')", env: { browser: true }, errors: [expectedError] },
        { code: "window['setTimeout']('foo')", env: { browser: true }, errors: [expectedError] },
        { code: "window['setInterval']('foo')", env: { browser: true }, errors: [expectedError] },
        { code: "window[`setInterval`]('foo')", parserOptions: { ecmaVersion: 6 }, env: { browser: true }, errors: [expectedError] },
        { code: "window.window['setInterval']('foo')", env: { browser: true }, errors: [expectedError] },
        { code: "global.setTimeout('foo')", env: { node: true }, errors: [expectedError] },
        { code: "global.setInterval('foo')", env: { node: true }, errors: [expectedError] },
        { code: "global['setTimeout']('foo')", env: { node: true }, errors: [expectedError] },
        { code: "global['setInterval']('foo')", env: { node: true }, errors: [expectedError] },
        { code: "global[`setInterval`]('foo')", parserOptions: { ecmaVersion: 6 }, env: { node: true }, errors: [expectedError] },
        { code: "global.global['setInterval']('foo')", env: { node: true }, errors: [expectedError] },
        { code: "globalThis.setTimeout('foo')", env: { es2020: true }, errors: [expectedError] },
        { code: "globalThis.setInterval('foo')", env: { es2020: true }, errors: [expectedError] },

        // template literals
        { code: "setTimeout(`foo${bar}`)", parserOptions: { ecmaVersion: 6 }, errors: [expectedError] },
        { code: "window.setTimeout(`foo${bar}`)", parserOptions: { ecmaVersion: 6 }, env: { browser: true }, errors: [expectedError] },
        { code: "window.window.setTimeout(`foo${bar}`)", parserOptions: { ecmaVersion: 6 }, env: { browser: true }, errors: [expectedError] },
        { code: "global.global.setTimeout(`foo${bar}`)", parserOptions: { ecmaVersion: 6 }, env: { node: true }, errors: [expectedError] },

        // string concatenation
        { code: "setTimeout('foo' + bar)", errors: [expectedError] },
        { code: "setTimeout(foo + 'bar')", errors: [expectedError] },
        { code: "setTimeout(`foo` + bar)", parserOptions: { ecmaVersion: 6 }, errors: [expectedError] },
        { code: "setTimeout(1 + ';' + 1)", errors: [expectedError] },
        { code: "window.setTimeout('foo' + bar)", env: { browser: true }, errors: [expectedError] },
        { code: "window.setTimeout(foo + 'bar')", env: { browser: true }, errors: [expectedError] },
        { code: "window.setTimeout(`foo` + bar)", parserOptions: { ecmaVersion: 6 }, env: { browser: true }, errors: [expectedError] },
        { code: "window.setTimeout(1 + ';' + 1)", env: { browser: true }, errors: [expectedError] },
        { code: "window.window.setTimeout(1 + ';' + 1)", env: { browser: true }, errors: [expectedError] },
        { code: "global.setTimeout('foo' + bar)", env: { node: true }, errors: [expectedError] },
        { code: "global.setTimeout(foo + 'bar')", env: { node: true }, errors: [expectedError] },
        { code: "global.setTimeout(`foo` + bar)", parserOptions: { ecmaVersion: 6 }, env: { node: true }, errors: [expectedError] },
        { code: "global.setTimeout(1 + ';' + 1)", env: { node: true }, errors: [expectedError] },
        { code: "global.global.setTimeout(1 + ';' + 1)", env: { node: true }, errors: [expectedError] },
        { code: "globalThis.setTimeout('foo' + bar)", env: { es2020: true }, errors: [expectedError] },

        // gives the correct node when dealing with nesting
        {
            code:
                "setTimeout('foo' + (function() {\n" +
                "   setTimeout(helper);\n" +
                "   execScript('str');\n" +
                "   return 'bar';\n" +
                "})())",
            errors: [
                {
                    messageId: "impliedEval",
                    type: "CallExpression",
                    line: 1
                },

                // no error on line 2
                {
                    messageId: "impliedEval",
                    type: "CallExpression",
                    line: 3
                }
            ]
        },
        {
            code:
                "window.setTimeout('foo' + (function() {\n" +
                "   setTimeout(helper);\n" +
                "   window.execScript('str');\n" +
                "   return 'bar';\n" +
                "})())",
            env: { browser: true },
            errors: [
                {
                    messageId: "impliedEval",
                    type: "CallExpression",
                    line: 1
                },

                // no error on line 2
                {
                    messageId: "impliedEval",
                    type: "CallExpression",
                    line: 3
                }
            ]
        },
        {
            code:
                "global.setTimeout('foo' + (function() {\n" +
                "   setTimeout(helper);\n" +
                "   global.execScript('str');\n" +
                "   return 'bar';\n" +
                "})())",
            env: { node: true },
            errors: [
                {
                    messageId: "impliedEval",
                    type: "CallExpression",
                    line: 1
                },

                // no error on line 2
                {
                    messageId: "impliedEval",
                    type: "CallExpression",
                    line: 3
                }
            ]
        },

        // Optional chaining
        {
            code: "window?.setTimeout('code', 0)",
            parserOptions: { ecmaVersion: 2020 },
            globals: { window: "readonly" },
            errors: [{ messageId: "impliedEval" }]
        },
        {
            code: "(window?.setTimeout)('code', 0)",
            parserOptions: { ecmaVersion: 2020 },
            globals: { window: "readonly" },
            errors: [{ messageId: "impliedEval" }]
        }
    ]
});
