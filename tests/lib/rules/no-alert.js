/**
 * @fileoverview Tests for no-alert rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-alert"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 5,
		sourceType: "script",
	},
});

ruleTester.run("no-alert", rule, {
	valid: [
		"a[o.k](1)",
		"foo.alert(foo)",
		"foo.confirm(foo)",
		"foo.prompt(foo)",
		"function alert() {} alert();",
		"var alert = function() {}; alert();",
		"function foo() { var alert = bar; alert(); }",
		"function foo(alert) { alert(); }",
		"var alert = function() {}; function test() { alert(); }",
		"function foo() { var alert = function() {}; function test() { alert(); } }",
		"function confirm() {} confirm();",
		"function prompt() {} prompt();",
		"window[alert]();",
		"function foo() { this.alert(); }",
		"function foo() { var window = bar; window.alert(); }",
		"globalThis.alert();",
		{ code: "globalThis['alert']();", languageOptions: { ecmaVersion: 6 } },
		{ code: "globalThis.alert();", languageOptions: { ecmaVersion: 2017 } },
		{
			code: "var globalThis = foo; globalThis.alert();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "function foo() { var globalThis = foo; globalThis.alert(); }",
			languageOptions: { ecmaVersion: 2020 },
		},
	],
	invalid: [
		{
			code: "alert(foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "window.alert(foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "window['alert'](foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "confirm(foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "confirm" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "window.confirm(foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "confirm" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "window['confirm'](foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "confirm" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "prompt(foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "prompt" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "window.prompt(foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "prompt" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "window['prompt'](foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "prompt" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "function alert() {} window.alert(foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 38,
				},
			],
		},
		{
			code: "var alert = function() {};\nwindow.alert(foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 18,
				},
			],
		},
		{
			code: "function foo(alert) { window.alert(); }",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 37,
				},
			],
		},
		{
			code: "function foo() { alert(); }",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "function foo() { var alert = function() {}; }\nalert();",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 8,
				},
			],
		},
		{
			code: "this.alert(foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "this['alert'](foo)",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "function foo() { var window = bar; window.alert(); }\nwindow.alert();",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 15,
				},
			],
		},
		{
			code: "globalThis['alert'](foo)",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "globalThis.alert();",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "function foo() { var globalThis = bar; globalThis.alert(); }\nglobalThis.alert();",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "unexpected",
					data: { name: "alert" },
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 19,
				},
			],
		},

		// Optional chaining
		{
			code: "window?.alert(foo)",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "unexpected", data: { name: "alert" } }],
		},
		{
			code: "(window?.alert)(foo)",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "unexpected", data: { name: "alert" } }],
		},
	],
});
