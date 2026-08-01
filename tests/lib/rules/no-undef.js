/**
 * @fileoverview Tests for no-undef rule.
 * @author Mark Macdonald
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-undef"),
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

ruleTester.run("no-undef", rule, {
	valid: [
		"var a = 1, b = 2; a;",
		"/*global b*/ function f() { b; }",
		{
			code: "function f() { b; }",
			languageOptions: { globals: { b: false } },
		},
		"/*global b a:false*/  a;  function f() { b; a; }",
		"function a(){}  a();",
		"function f(b) { b; }",
		"var a; a = 1; a++;",
		"var a; function f() { a = 1; }",
		"/*global b:true*/ b++;",
		{
			code: "window;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: 'require("a");',
			languageOptions: { sourceType: "commonjs" },
		},
		"Object; isNaN();",
		"toString()",
		"hasOwnProperty()",
		"function evilEval(stuffToEval) { var ultimateAnswer; ultimateAnswer = 42; eval(stuffToEval); }",
		"typeof a",
		"typeof (a)",
		"var b = typeof a",
		"typeof a === 'undefined'",
		"if (typeof a === 'undefined') {}",
		{
			code: "function foo() { var [a, b=4] = [1, 2]; return {a, b}; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var toString = 1;", languageOptions: { ecmaVersion: 6 } },
		{
			code: "function myFunc(...foo) {  return foo;}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var React, App, a=1; React.render(<App attr={a} />);",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "var console; [1,2,3].forEach(obj => {\n  console.log(obj);\n});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var Foo; class Bar extends Foo { constructor() { super();  }}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "import Warning from '../lib/warning'; var warn = new Warning('text');",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import * as Warning from '../lib/warning'; var warn = new Warning('text');",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{ code: "var a; [a] = [0];", languageOptions: { ecmaVersion: 6 } },
		{ code: "var a; ({a} = {});", languageOptions: { ecmaVersion: 6 } },
		{ code: "var a; ({b: a} = {});", languageOptions: { ecmaVersion: 6 } },
		{
			code: "var obj; [obj.a, obj.b] = [0, 1];",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "URLSearchParams;",
			languageOptions: { globals: globals.browser },
		},
		{ code: "Intl;", languageOptions: { ecmaVersion: 2015 } },
		{
			code: "IntersectionObserver;",
			languageOptions: { globals: globals.browser },
		},
		{ code: "Credential;", languageOptions: { globals: globals.browser } },
		{
			code: "requestIdleCallback;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "customElements;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "PromiseRejectionEvent;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "(foo, bar) => { foo ||= WeakRef; bar ??= FinalizationRegistry; }",
			languageOptions: { ecmaVersion: 2021 },
		},
		{ code: "(class C extends C {})", languageOptions: { ecmaVersion: 6 } },

		// Notifications of readonly are removed: https://github.com/eslint/eslint/issues/4504
		"/*global b:false*/ function f() { b = 1; }",
		{
			code: "function f() { b = 1; }",
			languageOptions: { globals: { b: false } },
		},
		"/*global b:false*/ function f() { b++; }",
		"/*global b*/ b = 1;",
		"/*global b:false*/ var b = 1;",
		"Array = 1;",

		// new.target: https://github.com/eslint/eslint/issues/5420
		{
			code: "class A { constructor() { new.target; } }",
			languageOptions: { ecmaVersion: 6 },
		},

		// Rest property
		{
			code: "var {bacon, ...others} = stuff; foo(others)",
			languageOptions: {
				ecmaVersion: 2018,
				globals: { stuff: false, foo: false },
			},
		},

		// export * as ns from "source"
		{
			code: 'export * as ns from "source"',
			languageOptions: { ecmaVersion: 2020, sourceType: "module" },
		},

		// import.meta
		{
			code: "import.meta",
			languageOptions: { ecmaVersion: 2020, sourceType: "module" },
		},

		// class static blocks
		{
			code: "let a; class C { static {} } a;",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "var a; class C { static {} } a;",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "a; class C { static {} } var a;",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { C; } }",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "const C = class { static { C; } }",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { a; } } var a;",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { a; } } let a;",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { var a; a; } }",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { a; var a; } }",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { a; { var a; } } }",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { let a; a; } }",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { a; let a; } }",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { function a() {} a; } }",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { a; function a() {} } }",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "[Float16Array, Iterator]",
			languageOptions: { ecmaVersion: 2025 },
		},
		{
			code: "AsyncDisposableStack; DisposableStack; SuppressedError; Temporal",
			languageOptions: { ecmaVersion: 2026 },
		},
		{
			code: "/*global App*/ <App />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "const App = () => <div/>; <App />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "let Foo, Bar; <Foo><Bar /></Foo>;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "import App from './App.jsx'; <App />;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "function App() { return <div/> } <App />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
	],
	invalid: [
		{
			code: "a = 1;",
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 2,
				},
			],
		},
		{
			code: "if (typeof anUndefinedVar === 'string') {}",
			options: [{ typeof: true }],
			errors: [
				{
					messageId: "undef",
					data: { name: "anUndefinedVar" },
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "var a = b;",
			errors: [
				{
					messageId: "undef",
					data: { name: "b" },
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "function f() { b; }",
			errors: [
				{
					messageId: "undef",
					data: { name: "b" },
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "window;",
			errors: [
				{
					messageId: "undef",
					data: { name: "window" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "Intl;",
			errors: [
				{
					messageId: "undef",
					data: { name: "Intl" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: 'require("a");',
			errors: [
				{
					messageId: "undef",
					data: { name: "require" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "var React; React.render(<img attr={a} />);",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 36,
					endLine: 1,
					endColumn: 37,
				},
			],
		},
		{
			code: "var React, App; React.render(<App attr={a} />);",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 41,
					endLine: 1,
					endColumn: 42,
				},
			],
		},
		{
			code: "[a] = [0];",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "({a} = {});",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({b: a} = {});",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "[obj.a, obj.b] = [0, 1];",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "undef",
					data: { name: "obj" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
				{
					messageId: "undef",
					data: { name: "obj" },
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},

		// Experimental
		{
			code: "const c = 0; const a = {...b, c};",
			languageOptions: {
				ecmaVersion: 2018,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "b" },
					line: 1,
					column: 28,
					endLine: 1,
					endColumn: 29,
				},
			],
		},

		// class static blocks
		{
			code: "class C { static { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "class C { static { { let a; } a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "class C { static { { function a() {} } a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 40,
					endLine: 1,
					endColumn: 41,
				},
			],
		},
		{
			code: "class C { static { function foo() { var a; }  a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 47,
					endLine: 1,
					endColumn: 48,
				},
			],
		},
		{
			code: "class C { static { var a; } static { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "class C { static { let a; } static { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "class C { static { function a(){} } static { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 46,
					endLine: 1,
					endColumn: 47,
				},
			],
		},
		{
			code: "class C { static { var a; } foo() { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 37,
					endLine: 1,
					endColumn: 38,
				},
			],
		},
		{
			code: "class C { static { let a; } foo() { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 37,
					endLine: 1,
					endColumn: 38,
				},
			],
		},
		{
			code: "class C { static { var a; } [a]; }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 30,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "class C { static { let a; } [a]; }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 30,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "class C { static { function a() {} } [a]; }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 39,
					endLine: 1,
					endColumn: 40,
				},
			],
		},
		{
			code: "class C { static { var a; } } a;",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "a" },
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "<App />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "App" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "let React; React.render(<App />);",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "App" },
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "function f() { return <Button/> }",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "Button" },
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 30,
				},
			],
		},
		{
			code: "<Foo.Bar />",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "undef",
					data: { name: "Foo" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
	],
});
