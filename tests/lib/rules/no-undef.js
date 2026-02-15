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
			code: "AsyncDisposableStack; DisposableStack; SuppressedError",
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
				},
			],
		},
		{
			code: "var a = b;",
			errors: [
				{
					messageId: "undef",
					data: { name: "b" },
				},
			],
		},
		{
			code: "function f() { b; }",
			errors: [
				{
					messageId: "undef",
					data: { name: "b" },
				},
			],
		},
		{
			code: "window;",
			errors: [
				{
					messageId: "undef",
					data: { name: "window" },
				},
			],
		},
		{
			code: "Intl;",
			errors: [
				{
					messageId: "undef",
					data: { name: "Intl" },
				},
			],
		},
		{
			code: 'require("a");',
			errors: [
				{
					messageId: "undef",
					data: { name: "require" },
				},
			],
		},
		{
			code: "var React; React.render(<img attr={a} />);",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [{ messageId: "undef", data: { name: "a" } }],
		},
		{
			code: "var React, App; React.render(<App attr={a} />);",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [{ messageId: "undef", data: { name: "a" } }],
		},
		{
			code: "[a] = [0];",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "undef", data: { name: "a" } }],
		},
		{
			code: "({a} = {});",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "undef", data: { name: "a" } }],
		},
		{
			code: "({b: a} = {});",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "undef", data: { name: "a" } }],
		},
		{
			code: "[obj.a, obj.b] = [0, 1];",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{ messageId: "undef", data: { name: "obj" } },
				{ messageId: "undef", data: { name: "obj" } },
			],
		},

		// Experimental
		{
			code: "const c = 0; const a = {...b, c};",
			languageOptions: {
				ecmaVersion: 2018,
			},
			errors: [{ messageId: "undef", data: { name: "b" } }],
		},

		// class static blocks
		{
			code: "class C { static { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" } }],
		},
		{
			code: "class C { static { { let a; } a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 31 }],
		},
		{
			code: "class C { static { { function a() {} } a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 40 }],
		},
		{
			code: "class C { static { function foo() { var a; }  a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 47 }],
		},
		{
			code: "class C { static { var a; } static { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 38 }],
		},
		{
			code: "class C { static { let a; } static { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 38 }],
		},
		{
			code: "class C { static { function a(){} } static { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 46 }],
		},
		{
			code: "class C { static { var a; } foo() { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 37 }],
		},
		{
			code: "class C { static { let a; } foo() { a; } }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 37 }],
		},
		{
			code: "class C { static { var a; } [a]; }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 30 }],
		},
		{
			code: "class C { static { let a; } [a]; }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 30 }],
		},
		{
			code: "class C { static { function a() {} } [a]; }",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 39 }],
		},
		{
			code: "class C { static { var a; } } a;",
			languageOptions: {
				ecmaVersion: 2022,
			},
			errors: [{ messageId: "undef", data: { name: "a" }, column: 31 }],
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
	fatal: [
		{
			name: "first option wrong type (number)",
			code: "var x = 1;",
			options: [123],
			error: { name: "SchemaValidationError" },
		},
	],
});
