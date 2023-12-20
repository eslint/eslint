/**
 * @fileoverview Tests for no-implied-eval rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-implied-eval"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester"),
    globals = require("globals");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});
const expectedError = { messageId: "impliedEval", type: "CallExpression" };

ruleTester.run("no-implied-eval", rule, {
    valid: [
        "setTimeout();",

        { code: "setTimeout;", languageOptions: { globals: globals.browser } },
        { code: "setTimeout = foo;", languageOptions: { globals: globals.browser } },
        { code: "window.setTimeout;", languageOptions: { globals: globals.browser } },
        { code: "window.setTimeout = foo;", languageOptions: { globals: globals.browser } },
        { code: "window['setTimeout'];", languageOptions: { globals: globals.browser } },
        { code: "window['setTimeout'] = foo;", languageOptions: { globals: globals.browser } },
        { code: "global.setTimeout;", languageOptions: { sourceType: "commonjs" } },
        { code: "global.setTimeout = foo;", languageOptions: { sourceType: "commonjs" } },
        { code: "global['setTimeout'];", languageOptions: { sourceType: "commonjs" } },
        { code: "global['setTimeout'] = foo;", languageOptions: { sourceType: "commonjs" } },
        { code: "globalThis['setTimeout'] = foo;", languageOptions: { ecmaVersion: 2020 } },

        "window.setTimeout('foo')",
        "window.setInterval('foo')",
        "window['setTimeout']('foo')",
        "window['setInterval']('foo')",

        { code: "window.setTimeout('foo')", languageOptions: { sourceType: "commonjs" } },
        { code: "window.setInterval('foo')", languageOptions: { sourceType: "commonjs" } },
        { code: "window['setTimeout']('foo')", languageOptions: { sourceType: "commonjs" } },
        { code: "window['setInterval']('foo')", languageOptions: { sourceType: "commonjs" } },
        { code: "global.setTimeout('foo')", languageOptions: { globals: globals.browser } },
        { code: "global.setInterval('foo')", languageOptions: { globals: globals.browser } },
        { code: "global['setTimeout']('foo')", languageOptions: { globals: globals.browser } },
        { code: "global['setInterval']('foo')", languageOptions: { globals: globals.browser } },
        { code: "globalThis.setTimeout('foo')", languageOptions: { ecmaVersion: 6 } },
        { code: "globalThis['setInterval']('foo')", languageOptions: { ecmaVersion: 2017 } },

        { code: "window[`SetTimeOut`]('foo', 100);", languageOptions: { ecmaVersion: 6, globals: globals.browser } },
        { code: "global[`SetTimeOut`]('foo', 100);", languageOptions: { ecmaVersion: 6, sourceType: "commonjs" } },
        { code: "global[`setTimeout${foo}`]('foo', 100);", languageOptions: { ecmaVersion: 6, globals: globals.browser } },
        { code: "global[`setTimeout${foo}`]('foo', 100);", languageOptions: { ecmaVersion: 6, sourceType: "commonjs" } },
        { code: "globalThis[`setTimeout${foo}`]('foo', 100);", languageOptions: { ecmaVersion: 2020 } },

        // normal usage
        "setTimeout(function() { x = 1; }, 100);",
        "setInterval(function() { x = 1; }, 100)",
        "execScript(function() { x = 1; }, 100)",
        { code: "window.setTimeout(function() { x = 1; }, 100);", languageOptions: { globals: globals.browser } },
        { code: "window.setInterval(function() { x = 1; }, 100);", languageOptions: { globals: globals.browser } },
        { code: "window.execScript(function() { x = 1; }, 100);", languageOptions: { globals: globals.browser } },
        { code: "window.setTimeout(foo, 100);", languageOptions: { globals: globals.browser } },
        { code: "window.setInterval(foo, 100);", languageOptions: { globals: globals.browser } },
        { code: "window.execScript(foo, 100);", languageOptions: { globals: globals.browser } },
        { code: "global.setTimeout(function() { x = 1; }, 100);", languageOptions: { sourceType: "commonjs" } },
        { code: "global.setInterval(function() { x = 1; }, 100);", languageOptions: { sourceType: "commonjs" } },
        { code: "global.execScript(function() { x = 1; }, 100);", languageOptions: { sourceType: "commonjs" } },
        { code: "global.setTimeout(foo, 100);", languageOptions: { sourceType: "commonjs" } },
        { code: "global.setInterval(foo, 100);", languageOptions: { sourceType: "commonjs" } },
        { code: "global.execScript(foo, 100);", languageOptions: { sourceType: "commonjs" } },
        { code: "globalThis.setTimeout(foo, 100);", languageOptions: { ecmaVersion: 2020 } },

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

        { code: "foo.window.setTimeout('foo', 100);", languageOptions: { globals: globals.browser } },
        { code: "foo.global.setTimeout('foo', 100);", languageOptions: { sourceType: "commonjs" } },
        { code: "var window; window.setTimeout('foo', 100);", languageOptions: { globals: globals.browser } },
        { code: "var global; global.setTimeout('foo', 100);", languageOptions: { sourceType: "commonjs" } },
        { code: "function foo(window) { window.setTimeout('foo', 100); }", languageOptions: { globals: globals.browser } },
        { code: "function foo(global) { global.setTimeout('foo', 100); }", languageOptions: { sourceType: "commonjs" } },
        { code: "foo('', window.setTimeout);", languageOptions: { globals: globals.browser } },
        { code: "foo('', global.setTimeout);", languageOptions: { sourceType: "commonjs" } }
    ],

    invalid: [
        { code: "setTimeout(\"x = 1;\");", errors: [expectedError] },
        { code: "setTimeout(\"x = 1;\", 100);", errors: [expectedError] },
        { code: "setInterval(\"x = 1;\");", errors: [expectedError] },
        { code: "execScript(\"x = 1;\");", errors: [expectedError] },

        { code: "const s = 'x=1'; setTimeout(s, 100);", languageOptions: { ecmaVersion: 6 }, errors: [expectedError] },
        { code: "setTimeout(String('x=1'), 100);", languageOptions: { ecmaVersion: 6 }, errors: [expectedError] },

        // member expressions
        { code: "window.setTimeout('foo')", languageOptions: { globals: globals.browser }, errors: [expectedError] },
        { code: "window.setInterval('foo')", languageOptions: { globals: globals.browser }, errors: [expectedError] },
        { code: "window['setTimeout']('foo')", languageOptions: { globals: globals.browser }, errors: [expectedError] },
        { code: "window['setInterval']('foo')", languageOptions: { globals: globals.browser }, errors: [expectedError] },
        { code: "window[`setInterval`]('foo')", languageOptions: { ecmaVersion: 6, globals: globals.browser }, errors: [expectedError] },
        { code: "window.window['setInterval']('foo')", languageOptions: { globals: globals.browser }, errors: [expectedError] },
        { code: "global.setTimeout('foo')", languageOptions: { sourceType: "commonjs" }, errors: [expectedError] },
        { code: "global.setInterval('foo')", languageOptions: { sourceType: "commonjs" }, errors: [expectedError] },
        { code: "global['setTimeout']('foo')", languageOptions: { sourceType: "commonjs" }, errors: [expectedError] },
        { code: "global['setInterval']('foo')", languageOptions: { sourceType: "commonjs" }, errors: [expectedError] },
        { code: "global[`setInterval`]('foo')", languageOptions: { ecmaVersion: 6, sourceType: "commonjs" }, errors: [expectedError] },
        { code: "global.global['setInterval']('foo')", languageOptions: { sourceType: "commonjs" }, errors: [expectedError] },
        { code: "globalThis.setTimeout('foo')", languageOptions: { ecmaVersion: 2020 }, errors: [expectedError] },
        { code: "globalThis.setInterval('foo')", languageOptions: { ecmaVersion: 2020 }, errors: [expectedError] },

        // template literals
        { code: "setTimeout(`foo${bar}`)", languageOptions: { ecmaVersion: 6 }, errors: [expectedError] },
        { code: "window.setTimeout(`foo${bar}`)", languageOptions: { ecmaVersion: 6, globals: globals.browser }, errors: [expectedError] },
        { code: "window.window.setTimeout(`foo${bar}`)", languageOptions: { ecmaVersion: 6, globals: globals.browser }, errors: [expectedError] },
        { code: "global.global.setTimeout(`foo${bar}`)", languageOptions: { ecmaVersion: 6, globals: globals.node }, errors: [expectedError] },

        // string concatenation
        { code: "setTimeout('foo' + bar)", errors: [expectedError] },
        { code: "setTimeout(foo + 'bar')", errors: [expectedError] },
        { code: "setTimeout(`foo` + bar)", languageOptions: { ecmaVersion: 6 }, errors: [expectedError] },
        { code: "setTimeout(1 + ';' + 1)", errors: [expectedError] },
        { code: "window.setTimeout('foo' + bar)", languageOptions: { globals: globals.browser }, errors: [expectedError] },
        { code: "window.setTimeout(foo + 'bar')", languageOptions: { globals: globals.browser }, errors: [expectedError] },
        { code: "window.setTimeout(`foo` + bar)", languageOptions: { ecmaVersion: 6, globals: globals.browser }, errors: [expectedError] },
        { code: "window.setTimeout(1 + ';' + 1)", languageOptions: { globals: globals.browser }, errors: [expectedError] },
        { code: "window.window.setTimeout(1 + ';' + 1)", languageOptions: { globals: globals.browser }, errors: [expectedError] },
        { code: "global.setTimeout('foo' + bar)", languageOptions: { sourceType: "commonjs" }, errors: [expectedError] },
        { code: "global.setTimeout(foo + 'bar')", languageOptions: { sourceType: "commonjs" }, errors: [expectedError] },
        { code: "global.setTimeout(`foo` + bar)", languageOptions: { ecmaVersion: 6, sourceType: "commonjs" }, errors: [expectedError] },
        { code: "global.setTimeout(1 + ';' + 1)", languageOptions: { sourceType: "commonjs" }, errors: [expectedError] },
        { code: "global.global.setTimeout(1 + ';' + 1)", languageOptions: { sourceType: "commonjs" }, errors: [expectedError] },
        { code: "globalThis.setTimeout('foo' + bar)", languageOptions: { ecmaVersion: 2020 }, errors: [expectedError] },

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
            languageOptions: { globals: globals.browser },
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
            languageOptions: { sourceType: "commonjs" },
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
            languageOptions: {
                ecmaVersion: 2020,
                globals: { window: "readonly" }
            },
            errors: [{ messageId: "impliedEval" }]
        },
        {
            code: "(window?.setTimeout)('code', 0)",
            languageOptions: {
                ecmaVersion: 2020,
                globals: { window: "readonly" }
            },
            errors: [{ messageId: "impliedEval" }]
        }
    ]
});
