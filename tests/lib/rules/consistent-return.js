/**
 * @fileoverview Tests for consistent-return rule.
 * @author Raphael Pigulla
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/consistent-return"),
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

ruleTester.run("consistent-return", rule, {
	valid: [
		"function foo() { return; }",
		"function foo() { if (true) return; }",
		"function foo() { if (true) return; else return; }",
		"function foo() { if (true) return true; else return false; }",
		"f(function() { return; })",
		"f(function() { if (true) return; })",
		"f(function() { if (true) return; else return; })",
		"f(function() { if (true) return true; else return false; })",
		"function foo() { function bar() { return true; } return; }",
		"function foo() { function bar() { return; } return false; }",
		"function Foo() { if (!(this instanceof Foo)) return new Foo(); }",
		"function foo() { if (true) return 5; else return undefined; }",
		"function foo() { if (true) return 5; else return void 0; }",
		{
			code: "function foo() { if (true) return; else return undefined; }",
			options: [{ treatUndefinedAsUnspecified: true }],
		},
		{
			code: "function foo() { if (true) return; else return void 0; }",
			options: [{ treatUndefinedAsUnspecified: true }],
		},
		{
			code: "function foo() { if (true) return undefined; else return; }",
			options: [{ treatUndefinedAsUnspecified: true }],
		},
		{
			code: "function foo() { if (true) return undefined; else return void 0; }",
			options: [{ treatUndefinedAsUnspecified: true }],
		},
		{
			code: "function foo() { if (true) return void 0; else return; }",
			options: [{ treatUndefinedAsUnspecified: true }],
		},
		{
			code: "function foo() { if (true) return void 0; else return undefined; }",
			options: [{ treatUndefinedAsUnspecified: true }],
		},
		{
			code: "var x = () => {  return {}; };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "if (true) { return 1; } return 0;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},

		// https://github.com/eslint/eslint/issues/7790
		{
			code: "class Foo { constructor() { if (true) return foo; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var Foo = class { constructor() { if (true) return foo; } }",
			languageOptions: { ecmaVersion: 6 },
		},
	],

	invalid: [
		{
			code: "function foo() { if (true) return true; else return; }",
			errors: [
				{
					messageId: "missingReturnValue",
					data: { name: "Function 'foo'" },
					line: 1,
					column: 46,
					endLine: 1,
					endColumn: 53,
				},
			],
		},
		{
			code: "var foo = () => { if (true) return true; else return; }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "missingReturnValue",
					data: { name: "Arrow function" },
					line: 1,
					column: 47,
					endLine: 1,
					endColumn: 54,
				},
			],
		},
		{
			code: "function foo() { if (true) return; else return false; }",
			errors: [
				{
					messageId: "unexpectedReturnValue",
					data: { name: "Function 'foo'" },
					line: 1,
					column: 41,
					endLine: 1,
					endColumn: 54,
				},
			],
		},
		{
			code: "f(function() { if (true) return true; else return; })",
			errors: [
				{
					messageId: "missingReturnValue",
					data: { name: "Function" },
					line: 1,
					column: 44,
					endLine: 1,
					endColumn: 51,
				},
			],
		},
		{
			code: "f(function() { if (true) return; else return false; })",
			errors: [
				{
					messageId: "unexpectedReturnValue",
					data: { name: "Function" },
					line: 1,
					column: 39,
					endLine: 1,
					endColumn: 52,
				},
			],
		},
		{
			code: "f(a => { if (true) return; else return false; })",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unexpectedReturnValue",
					data: { name: "Arrow function" },
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 46,
				},
			],
		},
		{
			code: "function foo() { if (true) return true; return undefined; }",
			options: [{ treatUndefinedAsUnspecified: true }],
			errors: [
				{
					messageId: "missingReturnValue",
					data: { name: "Function 'foo'" },
					line: 1,
					column: 41,
					endLine: 1,
					endColumn: 58,
				},
			],
		},
		{
			code: "function foo() { if (true) return true; return void 0; }",
			options: [{ treatUndefinedAsUnspecified: true }],
			errors: [
				{
					messageId: "missingReturnValue",
					data: { name: "Function 'foo'" },
					line: 1,
					column: 41,
					endLine: 1,
					endColumn: 55,
				},
			],
		},
		{
			code: "function foo() { if (true) return undefined; return true; }",
			options: [{ treatUndefinedAsUnspecified: true }],
			errors: [
				{
					messageId: "unexpectedReturnValue",
					data: { name: "Function 'foo'" },
					line: 1,
					column: 46,
					endLine: 1,
					endColumn: 58,
				},
			],
		},
		{
			code: "function foo() { if (true) return void 0; return true; }",
			options: [{ treatUndefinedAsUnspecified: true }],
			errors: [
				{
					messageId: "unexpectedReturnValue",
					data: { name: "Function 'foo'" },
					line: 1,
					column: 43,
					endLine: 1,
					endColumn: 55,
				},
			],
		},
		{
			code: "if (true) { return 1; } return;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
			errors: [
				{
					messageId: "missingReturnValue",
					data: { name: "Program" },
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "function foo() { if (a) return true; }",
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "function 'foo'" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "function _foo() { if (a) return true; }",
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "function '_foo'" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "f(function foo() { if (a) return true; });",
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "function 'foo'" },
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "f(function() { if (a) return true; });",
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "function" },
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "f(() => { if (a) return true; });",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "arrow function" },
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "var obj = {foo() { if (a) return true; }};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "method 'foo'" },
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "class A {foo() { if (a) return true; }};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "method 'foo'" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "if (a) return true;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "program" },
					line: 1,
					column: 1,
					endLine: void 0,
					endColumn: void 0,
				},
			],
		},
		{
			code: "class A { CapitalizedFunction() { if (a) return true; } }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "method 'CapitalizedFunction'" },
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 30,
				},
			],
		},
		{
			code: "({ constructor() { if (a) return true; } });",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "missingReturn",
					data: { name: "method 'constructor'" },
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
	],
	fatal: [
		{
			name: "first option wrong type (number)",
			code: "var x = 1;",
			options: [123],
			error: { name: "SchemaValidationError" },
		},
		{
			name: "treatUndefinedAsUnspecified option wrong type (string)",
			code: "var x = 1;",
			options: [{ treatUndefinedAsUnspecified: "true" }],
			error: { name: "SchemaValidationError" },
		},
	],
});
