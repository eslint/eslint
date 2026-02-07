/**
 * @fileoverview Tests for no-redeclare rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-redeclare");
const RuleTester = require("../../../lib/rule-tester/rule-tester");
const globals = require("globals");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		sourceType: "script",
	},
});

ruleTester.run("no-redeclare", rule, {
	valid: [
		"var a = 3; var b = function() { var a = 10; };",
		"var a = 3; a = 10;",
		{
			code: "if (true) {\n    let b = 2;\n} else {    \nlet b = 3;\n}",
			languageOptions: {
				ecmaVersion: 6,
			},
		},
		{
			code: "var a; class C { static { var a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "class C { static { var a; } } var a; ",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "function a(){} class C { static { var a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "var a; class C { static { function a(){} } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "class C { static { var a; } static { var a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "class C { static { function a(){} } static { function a(){} } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "class C { static { var a; { function a(){} } } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "class C { static { function a(){}; { function a(){} } } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "class C { static { var a; { let a; } } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "class C { static { let a; { let a; } } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{
			code: "class C { static { { let a; } { let a; } } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
		},
		{ code: "var Object = 0;", options: [{ builtinGlobals: false }] },
		{
			code: "var Object = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var Object = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{ code: "var top = 0;", options: [{ builtinGlobals: true }] },
		{
			code: "var top = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
				globals: globals.browser,
			},
		},
		{
			code: "var top = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				globals: globals.browser,
			},
		},
		{
			code: "var self = 1",
			options: [{ builtinGlobals: true }],
		},
		{
			code: "var globalThis = foo",
			options: [{ builtinGlobals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var globalThis = foo",
			options: [{ builtinGlobals: true }],
			languageOptions: { ecmaVersion: 2017 },
		},

		// Comments and built-ins.
		{
			code: "/*globals Array */",
			options: [{ builtinGlobals: false }],
		},
		{
			code: "/*globals a */",
			options: [{ builtinGlobals: false }],
			languageOptions: {
				globals: { a: "readonly" },
			},
		},
		{
			code: "/*globals a */",
			options: [{ builtinGlobals: false }],
			languageOptions: {
				globals: { a: "writable" },
			},
		},
		{
			code: "/*globals a:off */",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: { a: "readonly" },
			},
		},
		{
			code: "/*globals a */",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: { a: "off" },
			},
		},
	],
	invalid: [
		{
			code: "var a = 3; var a = 10;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "switch(foo) { case a: var b = 3;\ncase b: var b = 4}",
			errors: [
				{
					message: "'b' is already defined.",
				},
			],
		},
		{
			code: "var a = 3; var a = 10;",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "var a = {}; var a = [];",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "var a; function a() {}",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "function a() {} function a() {}",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "var a = function() { }; var a = function() { }",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "var a = function() { }; var a = new Date();",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "var a = 3; var a = 10; var a = 15;",
			errors: [
				{
					message: "'a' is already defined.",
				},
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "var a; var a;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "export var a; var a;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},

		// `var` redeclaration in class static blocks. Redeclaration of functions is not allowed in class static blocks.
		{
			code: "class C { static { var a; var a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "class C { static { var a; { var a; } } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "class C { static { { var a; } var a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "class C { static { { var a; } { var a; } } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},

		{
			code: "var Object = 0;",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Object' is already defined as a built-in global variable.",
				},
			],
		},
		{
			code: "var top = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					message:
						"'top' is already defined as a built-in global variable.",
				},
			],
		},
		{
			code: "var a; var {a = 0, b: Object = 0} = {};",
			options: [{ builtinGlobals: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "'a' is already defined.",
				},
				{
					message:
						"'Object' is already defined as a built-in global variable.",
				},
			],
		},
		{
			code: "var a; var {a = 0, b: Object = 0} = {};",
			options: [{ builtinGlobals: true }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "var a; var {a = 0, b: Object = 0} = {};",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "var a; var {a = 0, b: Object = 0} = {};",
			options: [{ builtinGlobals: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "var globalThis = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					message:
						"'globalThis' is already defined as a built-in global variable.",
				},
			],
		},
		{
			code: "var a; var {a = 0, b: globalThis = 0} = {};",
			options: [{ builtinGlobals: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					message: "'a' is already defined.",
				},
				{
					message:
						"'globalThis' is already defined as a built-in global variable.",
				},
			],
		},
		{
			code: "/*global b:false*/ var b = 1;",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'b' is already defined by a variable declaration.",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "/*global b:true*/ var b = 1;",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'b' is already defined by a variable declaration.",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "function f() { var a; var a; }",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "function f(a) { var a; }",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "function f() { var a; if (test) { var a; } }",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},
		{
			code: "for (var a, a;;);",
			errors: [
				{
					message: "'a' is already defined.",
				},
			],
		},

		{
			code: "var Object = 0;",
			errors: [
				{
					message:
						"'Object' is already defined as a built-in global variable.",
				},
			],
		},
		{
			code: "var top = 0;",
			languageOptions: { globals: globals.browser },
			errors: [
				{
					message:
						"'top' is already defined as a built-in global variable.",
				},
			],
		},

		// Comments and built-ins.
		{
			code: "/*globals Array */",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "/*globals parseInt */",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'parseInt' is already defined as a built-in global variable.",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "/*globals foo, Array */",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "/* globals foo, Array, baz */",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "/*global foo, Array, baz*/",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "/*global array, Array*/",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "/*globals a,Array*/",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "/*globals a:readonly, Array:writable */",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "\n/*globals Array */",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 2,
					column: 11,
					endLine: 2,
					endColumn: 16,
				},
			],
		},
		{
			code: "/*globals\nArray */",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 6,
				},
			],
		},
		{
			code: "\n/*globals\n\nArray*/",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 4,
					column: 1,
					endLine: 4,
					endColumn: 6,
				},
			],
		},
		{
			code: "/*globals foo,\n    Array */",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					message:
						"'Array' is already defined as a built-in global variable.",
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 10,
				},
			],
		},
		{
			code: "/*globals a */",
			options: [{ builtinGlobals: true }],
			languageOptions: { globals: { a: "readonly" } },
			errors: [
				{
					message:
						"'a' is already defined as a built-in global variable.",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "/*globals a */",
			options: [{ builtinGlobals: true }],
			languageOptions: { globals: { a: "writable" } },
			errors: [
				{
					message:
						"'a' is already defined as a built-in global variable.",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "/*globals a */ /*globals a */",
			errors: [
				{
					message: "'a' is already defined.",
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: "/*globals a */ /*globals a */ var a = 0",
			options: [{ builtinGlobals: true }],
			languageOptions: { globals: { a: "writable" } },
			errors: [
				{
					message:
						"'a' is already defined as a built-in global variable.",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 12,
				},
				{
					message:
						"'a' is already defined as a built-in global variable.",
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 27,
				},
				{
					message:
						"'a' is already defined as a built-in global variable.",
					line: 1,
					column: 35,
					endLine: 1,
					endColumn: 36,
				},
			],
		},
	],
});

//------------------------------------------------------------------------------
// TypeScript Tests
//------------------------------------------------------------------------------

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
		parserOptions: {
			sourceType: "module",
		},
	},
});

ruleTesterTypeScript.run("no-redeclare (TypeScript)", rule, {
	valid: [
		// Interface merging - valid TS pattern
		`
			interface A { prop1: number; }
			interface A { prop2: string; }
		`,

		// Multiple interface merging
		`
			interface Foo { a: number; }
			interface Foo { b: string; }
			interface Foo { c: boolean; }
		`,

		// Namespace merging - valid TS pattern
		`
			namespace Foo { export const a = 1; }
			namespace Foo { export const b = 2; }
		`,

		// Class + namespace merging - valid TS pattern
		`
			class Bar {}
			namespace Bar {}
		`,

		// Function + namespace merging - valid TS pattern
		`
			function Baz() {}
			namespace Baz {}
		`,

		// Enum + namespace merging - valid TS pattern
		`
			enum Direction { Up, Down }
			namespace Direction { export function isVertical(d: Direction) { return true; } }
		`,

		// Value + type collision - valid TS (different namespaces)
		`
			const a = 42;
			type a = string;
		`,

		// Value + interface collision - valid TS (different namespaces)
		`
			let b: object;
			interface b { foo: string; }
		`,

		// Function + interface - valid TS (different namespaces)
		`
			function MyFunc() {}
			interface MyFunc { prop: number; }
		`,

		// Class + interface merging - valid TS pattern
		`
			class MyClass {}
			interface MyClass { extra: string; }
		`,

		// Enum + interface - valid TS (different namespaces)
		`
			enum Status { Active, Inactive }
			interface Status { label: string; }
		`,

		// Type alias + value - valid TS (different namespaces)
		`
			type Handler = () => void;
			const Handler = () => {};
		`,

		// Namespace + interface - valid TS
		`
			namespace N {}
			interface N { prop: number; }
		`,

		// Multiple type aliases - handled by TypeScript compiler
		`
			type T = string;
			type T = number;
		`,

		// Declare function overloads - valid TS
		`
			declare function foo(): void;
			declare function foo(x: number): void;
		`,

		// Function overload signatures with implementation
		`
			function bar(): void;
			function bar(x: number): void;
			function bar(x?: number): void {}
		`,

		// Enum merging
		`
			enum Color { Red }
			enum Color { Blue }
		`,

		// Var + namespace - TypeScript compiler handles this
		`
			var a = 1;
			namespace a { export type T = string; }
		`,

		// Basic JS valid cases should still work
		{
			code: "var a = 3; var b = function() { var a = 10; };",
			languageOptions: {
				parser: require("@typescript-eslint/parser"),
				parserOptions: { sourceType: "script" },
			},
		},
	],

	invalid: [
		// var redeclaration - still invalid even in TS
		{
			code: "var a = 3; var a = 10;",
			languageOptions: {
				parser: require("@typescript-eslint/parser"),
				parserOptions: { sourceType: "script" },
			},
			errors: [
				{
					messageId: "redeclared",
					data: { id: "a" },
				},
			],
		},

		// let redeclaration - invalid
		{
			code: `
				let x = 1;
				let x = 2;
			`,
			errors: [
				{
					messageId: "redeclared",
					data: { id: "x" },
				},
			],
		},
	],
});
