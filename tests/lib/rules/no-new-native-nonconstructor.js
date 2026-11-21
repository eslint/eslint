/**
 * @fileoverview Tests for the no-new-native-nonconstructor rule
 * @author Sosuke Suzuki
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-native-nonconstructor"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } });

ruleTester.run("no-new-native-nonconstructor", rule, {
	valid: [
		// Symbol
		"var foo = Symbol('foo');",
		"function bar(Symbol) { var baz = new Symbol('baz');}",
		"function Symbol() {} new Symbol();",
		"new foo(Symbol);",
		"new foo(bar, Symbol);",

		// BigInt
		"var foo = BigInt(9007199254740991);",
		"function bar(BigInt) { var baz = new BigInt(9007199254740991);}",
		"function BigInt() {} new BigInt();",
		"new foo(BigInt);",
		"new foo(bar, BigInt);",
	],
	invalid: [
		// Symbol
		{
			code: "var foo = new Symbol('foo');",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 21,
					suggestions: [
						{
							messageId: "removeNew",
							output: "var foo = Symbol('foo');",
						},
					],
				},
			],
		},
		{
			code: "function bar() { return function Symbol() {}; } var baz = new Symbol('baz');",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 1,
					column: 63,
					endLine: 1,
					endColumn: 69,
					suggestions: [
						{
							messageId: "removeNew",
							output: "function bar() { return function Symbol() {}; } var baz = Symbol('baz');",
						},
					],
				},
			],
		},
		{
			code: "const foo = new Symbol();",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 23,
					suggestions: [
						{
							messageId: "removeNew",
							output: "const foo = Symbol();",
						},
					],
				},
			],
		},
		{
			code: "const foo = new Symbol;",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 23,
					suggestions: [
						{
							messageId: "removeNew",
							output: "const foo = Symbol();",
						},
					],
				},
			],
		},
		{
			code: "function foo() { return new\n    Symbol('foo'); }",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 11,
					suggestions: [
						{
							messageId: "removeNew",
							output: "function foo() { return Symbol('foo'); }",
						},
					],
				},
			],
		},
		{
			code: "const foo = new /* comment */ Symbol('foo');",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 37,
					suggestions: [
						{
							messageId: "removeNew",
							output: "const foo = /* comment */ Symbol('foo');",
						},
					],
				},
			],
		},
		{
			code: "function foo() { return new // comment\n    Symbol('foo'); }",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 11,
				},
			],
		},
		{
			code: "const foo = new (Symbol)('foo');",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 24,
					suggestions: [
						{
							messageId: "removeNew",
							output: "const foo = (Symbol)('foo');",
						},
					],
				},
			],
		},
		{
			code: "const foo = new (Symbol);",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 24,
					suggestions: [
						{
							messageId: "removeNew",
							output: "const foo = (Symbol)();",
						},
					],
				},
			],
		},
		{
			code: "foo()\nnew (Symbol)('bar');",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 2,
					column: 6,
					endLine: 2,
					endColumn: 12,
					suggestions: [
						{
							messageId: "removeNew",
							output: "foo()\n;(Symbol)('bar');",
						},
					],
				},
			],
		},
		{
			code: "foo();\nnew (Symbol)('bar');",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 2,
					column: 6,
					endLine: 2,
					endColumn: 12,
					suggestions: [
						{
							messageId: "removeNew",
							output: "foo();\n(Symbol)('bar');",
						},
					],
				},
			],
		},
		{
			code: "foo()\nnew Symbol('bar');",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "Symbol" },
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 11,
					suggestions: [
						{
							messageId: "removeNew",
							output: "foo()\nSymbol('bar');",
						},
					],
				},
			],
		},

		// BigInt
		{
			code: "var foo = new BigInt(9007199254740991);",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "BigInt" },
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 21,
					suggestions: [
						{
							messageId: "removeNew",
							output: "var foo = BigInt(9007199254740991);",
						},
					],
				},
			],
		},
		{
			code: "function bar() { return function BigInt() {}; } var baz = new BigInt(9007199254740991);",
			errors: [
				{
					messageId: "noNewNonconstructor",
					data: { name: "BigInt" },
					line: 1,
					column: 63,
					endLine: 1,
					endColumn: 69,
					suggestions: [
						{
							messageId: "removeNew",
							output: "function bar() { return function BigInt() {}; } var baz = BigInt(9007199254740991);",
						},
					],
				},
			],
		},
	],
});
