/**
 * @fileoverview Tests for no-implied-eval rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-implied-eval"),
	RuleTester = require("../../../lib/rule-tester/rule-tester"),
	globals = require("globals");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 5,
		sourceType: "script",
	},
});
const expectedError = { messageId: "impliedEval", type: "CallExpression" };

ruleTester.run("no-implied-eval", rule, {
	valid: [
		{
			code: "setTimeout();",
			languageOptions: { globals: globals.browser },
		},

		{ code: "setTimeout;", languageOptions: { globals: globals.browser } },
		{
			code: "setTimeout = foo;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window.setTimeout;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window.setTimeout = foo;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window['setTimeout'];",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window['setTimeout'] = foo;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "global.setTimeout;",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "global.setTimeout = foo;",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "global['setTimeout'];",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "global['setTimeout'] = foo;",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "globalThis['setTimeout'] = foo;",
			languageOptions: { ecmaVersion: 2020, globals: globals.browser },
		},

		"window.setTimeout('foo')",
		"window.setInterval('foo')",
		"window['setTimeout']('foo')",
		"window['setInterval']('foo')",

		{
			code: "window.setTimeout('foo')",
			languageOptions: { sourceType: "commonjs" },
		},
		{
			code: "window.setInterval('foo')",
			languageOptions: { sourceType: "commonjs" },
		},
		{
			code: "window['setTimeout']('foo')",
			languageOptions: { sourceType: "commonjs" },
		},
		{
			code: "window['setInterval']('foo')",
			languageOptions: { sourceType: "commonjs" },
		},
		{
			code: "global.setTimeout('foo')",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "global.setInterval('foo')",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "global['setTimeout']('foo')",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "global['setInterval']('foo')",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "globalThis.setTimeout('foo')",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
		},
		{
			code: "globalThis['setInterval']('foo')",
			languageOptions: { ecmaVersion: 2017, globals: globals.browser },
		},

		{
			code: "window[`SetTimeOut`]('foo', 100);",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
		},
		{
			code: "global[`SetTimeOut`]('foo', 100);",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "global[`setTimeout${foo}`]('foo', 100);",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
		},
		{
			code: "global[`setTimeout${foo}`]('foo', 100);",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "globalThis[`setTimeout${foo}`]('foo', 100);",
			languageOptions: { ecmaVersion: 2020, globals: globals.browser },
		},

		// normal usage
		{
			code: "setTimeout(function() { x = 1; }, 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "setInterval(function() { x = 1; }, 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "execScript(function() { x = 1; }, 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window.setTimeout(function() { x = 1; }, 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window.setInterval(function() { x = 1; }, 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window.execScript(function() { x = 1; }, 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window.setTimeout(foo, 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window.setInterval(foo, 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "window.execScript(foo, 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "global.setTimeout(function() { x = 1; }, 100);",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "global.setInterval(function() { x = 1; }, 100);",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "global.execScript(function() { x = 1; }, 100);",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "global.setTimeout(foo, 100);",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "global.setInterval(foo, 100);",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "global.execScript(foo, 100);",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "globalThis.setTimeout(foo, 100);",
			languageOptions: { ecmaVersion: 2020, globals: globals.browser },
		},

		// only checks on top-level statements or window.*
		{
			code: "foo.setTimeout('hi')",
			languageOptions: { globals: globals.browser },
		},

		// identifiers are fine
		{
			code: "setTimeout(foo, 10)",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "setInterval(1, 10)",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "execScript(2)",
			languageOptions: { globals: globals.browser },
		},

		// as are function expressions
		{
			code: "setTimeout(function() {}, 10)",
			languageOptions: { globals: globals.browser },
		},

		// setInterval
		{
			code: "foo.setInterval('hi')",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "setInterval(foo, 10)",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "setInterval(function() {}, 10)",
			languageOptions: { globals: globals.browser },
		},

		// execScript
		{
			code: "foo.execScript('hi')",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "execScript(foo)",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "execScript(function() {})",
			languageOptions: { globals: globals.browser },
		},

		// a binary plus on non-strings doesn't guarantee a string
		"setTimeout(foo + bar, 10)",

		// doesn't check anything but the first argument
		{
			code: "setTimeout(foobar, 'buzz')",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "setTimeout(foobar, foo + 'bar')",
			languageOptions: { globals: globals.browser },
		},

		// only checks immediate subtrees of the argument
		{
			code: "setTimeout(function() { return 'foobar'; }, 10)",
			languageOptions: { globals: globals.browser },
		},

		// https://github.com/eslint/eslint/issues/7821
		{
			code: "setTimeoutFooBar('Foo Bar')",
			languageOptions: { globals: globals.browser },
		},

		{
			code: "foo.window.setTimeout('foo', 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "foo.global.setTimeout('foo', 100);",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "var window; window.setTimeout('foo', 100);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "var global; global.setTimeout('foo', 100);",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "function foo(window) { window.setTimeout('foo', 100); }",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "function foo(global) { global.setTimeout('foo', 100); }",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
		},
		{
			code: "foo('', window.setTimeout);",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "foo('', global.setTimeout);",
			languageOptions: { sourceType: "commonjs" },
		},

		// https://github.com/eslint/eslint/issues/19923
		{
			code: `
			function execScript(string) {
				console.log("This is not your grandparent's execScript().");
			}

			execScript('wibble');
			`,
			languageOptions: {
				globals: { execScript: false },
			},
		},
		{
			code: `
			function setTimeout(string) {
				console.log("This is not your grandparent's setTimeout().");
			}

			setTimeout('wibble');
			`,
			languageOptions: {
				globals: globals.browser,
			},
		},
		{
			code: `
			function setInterval(string) {
				console.log("This is not your grandparent's setInterval().");
			}

			setInterval('wibble');
			`,
			languageOptions: {
				globals: globals.browser,
			},
		},
		{
			code: `
			function outer() {
				function setTimeout(string) {
					console.log("Shadowed setTimeout");
				}
				setTimeout('code');
			}
			`,
			languageOptions: {
				globals: globals.browser,
			},
		},
		{
			code: `
			function outer() {
				function setInterval(string) {
					console.log("Shadowed setInterval");
				}
				setInterval('code');
			}
			`,
			languageOptions: {
				globals: globals.browser,
			},
		},
		{
			code: `
			function outer() {
				function execScript(string) {
					console.log("Shadowed execScript");
				}
				execScript('code');
			}
			`,
			languageOptions: {
				globals: { execScript: false },
			},
		},
		{
			code: `
			{
				const setTimeout = function(string) {
					console.log("Block-scoped setTimeout");
				};
				setTimeout('code');
			}
			`,
			languageOptions: {
				ecmaVersion: 6,
				globals: globals.browser,
			},
		},
		{
			code: `
			{
				const setInterval = function(string) {
					console.log("Block-scoped setInterval");
				};
				setInterval('code');
			}
			`,
			languageOptions: {
				ecmaVersion: 6,
				globals: globals.browser,
			},
		},
		{
			code: "setTimeout('code');",
			languageOptions: {
				globals: {}, // No globals defined
			},
		},
		{
			code: "setInterval('code');",
			languageOptions: {
				globals: {}, // No globals defined
			},
		},
		{
			code: "execScript('code');",
			languageOptions: {
				globals: {}, // No globals defined
			},
		},
		{
			code: "window.setTimeout('code');",
			languageOptions: {
				globals: {}, // No window global defined
			},
		},
	],

	invalid: [
		{
			code: 'setTimeout("x = 1;");',
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: 'setTimeout("x = 1;", 100);',
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: 'setInterval("x = 1;");',
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: 'execScript("x = 1;");',
			languageOptions: { globals: { execScript: false } },
			errors: [expectedError],
		},

		{
			code: "const s = 'x=1'; setTimeout(s, 100);",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "setTimeout(String('x=1'), 100);",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
			errors: [expectedError],
		},

		// member expressions
		{
			code: "window.setTimeout('foo')",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window.setInterval('foo')",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window['setTimeout']('foo')",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window['setInterval']('foo')",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window[`setInterval`]('foo')",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window.window['setInterval']('foo')",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "global.setTimeout('foo')",
			languageOptions: { sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "global.setInterval('foo')",
			languageOptions: { sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "global['setTimeout']('foo')",
			languageOptions: { sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "global['setInterval']('foo')",
			languageOptions: { sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "global[`setInterval`]('foo')",
			languageOptions: { ecmaVersion: 6, sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "global.global['setInterval']('foo')",
			languageOptions: { sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "globalThis.setTimeout('foo')",
			languageOptions: { ecmaVersion: 2020 },
			errors: [expectedError],
		},
		{
			code: "globalThis.setInterval('foo')",
			languageOptions: { ecmaVersion: 2020 },
			errors: [expectedError],
		},

		// template literals
		{
			code: "setTimeout(`foo${bar}`)",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window.setTimeout(`foo${bar}`)",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window.window.setTimeout(`foo${bar}`)",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "global.global.setTimeout(`foo${bar}`)",
			languageOptions: { ecmaVersion: 6, globals: globals.node },
			errors: [expectedError],
		},

		// string concatenation
		{
			code: "setTimeout('foo' + bar)",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "setTimeout(foo + 'bar')",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "setTimeout(`foo` + bar)",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "setTimeout(1 + ';' + 1)",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window.setTimeout('foo' + bar)",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window.setTimeout(foo + 'bar')",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window.setTimeout(`foo` + bar)",
			languageOptions: { ecmaVersion: 6, globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window.setTimeout(1 + ';' + 1)",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "window.window.setTimeout(1 + ';' + 1)",
			languageOptions: { globals: globals.browser },
			errors: [expectedError],
		},
		{
			code: "global.setTimeout('foo' + bar)",
			languageOptions: { sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "global.setTimeout(foo + 'bar')",
			languageOptions: { sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "global.setTimeout(`foo` + bar)",
			languageOptions: { ecmaVersion: 6, sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "global.setTimeout(1 + ';' + 1)",
			languageOptions: { sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "global.global.setTimeout(1 + ';' + 1)",
			languageOptions: { sourceType: "commonjs" },
			errors: [expectedError],
		},
		{
			code: "globalThis.setTimeout('foo' + bar)",
			languageOptions: { ecmaVersion: 2020 },
			errors: [expectedError],
		},

		// gives the correct node when dealing with nesting
		{
			code:
				"setTimeout('foo' + (function() {\n" +
				"   setTimeout(helper);\n" +
				"   execScript('str');\n" +
				"   return 'bar';\n" +
				"})())",
			languageOptions: {
				globals: { ...globals.browser, execScript: false },
			},
			errors: [
				{
					messageId: "impliedEval",
					type: "CallExpression",
					line: 1,
				},

				// no error on line 2
				{
					messageId: "impliedEval",
					type: "CallExpression",
					line: 3,
				},
			],
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
					line: 1,
				},

				// no error on line 2
				{
					messageId: "impliedEval",
					type: "CallExpression",
					line: 3,
				},
			],
		},
		{
			code:
				"global.setTimeout('foo' + (function() {\n" +
				"   setTimeout(helper);\n" +
				"   global.execScript('str');\n" +
				"   return 'bar';\n" +
				"})())",
			languageOptions: {
				sourceType: "commonjs",
				globals: globals.browser,
			},
			errors: [
				{
					messageId: "impliedEval",
					type: "CallExpression",
					line: 1,
				},

				// no error on line 2
				{
					messageId: "impliedEval",
					type: "CallExpression",
					line: 3,
				},
			],
		},

		// Optional chaining
		{
			code: "window?.setTimeout('code', 0)",
			languageOptions: {
				ecmaVersion: 2020,
				globals: { window: "readonly" },
			},
			errors: [{ messageId: "impliedEval" }],
		},
		{
			code: "(window?.setTimeout)('code', 0)",
			languageOptions: {
				ecmaVersion: 2020,
				globals: { window: "readonly" },
			},
			errors: [{ messageId: "impliedEval" }],
		},
	],
});
