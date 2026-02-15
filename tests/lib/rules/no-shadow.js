/**
 * @fileoverview Tests for no-shadow rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-shadow"),
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

ruleTester.run("no-shadow", rule, {
	valid: [
		"var a=3; function b(x) { a++; return x + a; }; setTimeout(function() { b(a); }, 0);",
		"(function() { var doSomething = function doSomething() {}; doSomething() }())",
		"(function() { var doSomething = foo || function doSomething() {}; doSomething() }())",
		"(function() { var doSomething = function doSomething() {} || foo; doSomething() }())",
		"(function() { var doSomething = foo && function doSomething() {}; doSomething() }())",
		{
			code: "(function() { var doSomething = foo ?? function doSomething() {}; doSomething() }())",
			languageOptions: { ecmaVersion: 2020 },
		},
		"(function() { var doSomething = foo || (bar || function doSomething() {}); doSomething() }())",
		"(function() { var doSomething = foo || (bar && function doSomething() {}); doSomething() }())",
		"(function() { var doSomething = foo ? function doSomething() {} : bar; doSomething() }())",
		"(function() { var doSomething = foo ? bar: function doSomething() {}; doSomething() }())",
		"(function() { var doSomething = foo ? bar: (baz || function doSomething() {}); doSomething() }())",
		"(function() { var doSomething = (foo ? bar: function doSomething() {}) || baz; doSomething() }())",
		{
			code: "(function() { var { doSomething = function doSomething() {} } = obj; doSomething() }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var { doSomething = function doSomething() {} || foo } = obj; doSomething() }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var { doSomething = foo ? function doSomething() {} : bar } = obj; doSomething() }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var { doSomething = foo ? bar : function doSomething() {} } = obj; doSomething() }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var { doSomething = foo || (bar ? baz : (qux || function doSomething() {})) || quux } = obj; doSomething() }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(doSomething = function doSomething() {}) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(doSomething = function doSomething() {} || foo) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(doSomething = foo ? function doSomething() {} : bar) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(doSomething = foo ? bar : function doSomething() {}) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(doSomething = foo || (bar ? baz : (qux || function doSomething() {})) || quux) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		"var arguments;\nfunction bar() { }",
		{
			code: "var a=3; var b = (x) => { a++; return x + a; }; setTimeout(() => { b(a); }, 0);",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "class A {}", languageOptions: { ecmaVersion: 6 } },
		{
			code: "class A { constructor() { var a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var A = class A {}; })()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var A = foo || class A {}; })()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var A = class A {} || foo; })()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var A = foo && class A {} || foo; })()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var A = foo ?? class A {}; })()",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(function() { var A = foo || (bar || class A {}); })()",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(function() { var A = foo || (bar && class A {}); })()",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(function() { var A = foo ? class A {} : bar; })()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var A = foo ? bar : class A {}; })()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var A = foo ? bar: (baz || class A {}); })()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var A = (foo ? bar: class A {}) || baz; })()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var { A = class A {} } = obj; }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var { A = class A {} || foo } = obj; }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var { A = foo ? class A {} : bar } = obj; }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var { A = foo ? bar : class A {} } = obj; }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { var { A = foo || (bar ? baz : (qux || class A {})) || quux } = obj; }())",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(A = class A {}) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(A = class A {} || foo) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(A = foo ? class A {} : bar) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(A = foo ? bar : class A {}) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(A = foo || (bar ? baz : (qux || class A {})) || quux) { doSomething(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "{ var a; } var a;", languageOptions: { ecmaVersion: 6 } }, // this case reports `no-redeclare`, not shadowing.
		{
			code: "{ let a; } let a;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "{ let a; } var a;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "{ let a; } function a() {}",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "{ const a = 0; } const a = 1;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "{ const a = 0; } var a;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "{ const a = 0; } function a() {}",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a; } let a;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a; } var a;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a; } function a() {}",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { var a; } let a;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { var a; } var a;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { var a; } function a() {}",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a) { } let a;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a) { } var a;",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a) { } function a() {}",
			options: [{ hoist: "never" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "{ let a; } let a;", languageOptions: { ecmaVersion: 6 } },
		{ code: "{ let a; } var a;", languageOptions: { ecmaVersion: 6 } },
		{
			code: "{ const a = 0; } const a = 1;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "{ const a = 0; } var a;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a; } let a;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a; } var a;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { var a; } let a;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { var a; } var a;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a) { } let a;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a) { } var a;",
			languageOptions: { ecmaVersion: 6 },
		},
		"function foo() { var Object = 0; }",
		{
			code: "function foo() { var top = 0; }",
			languageOptions: { globals: globals.browser },
		},
		{ code: "var Object = 0;", options: [{ builtinGlobals: true }] },
		{
			code: "var top = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "function foo(cb) { (function (cb) { cb(42); })(cb); }",
			options: [{ allow: ["cb"] }],
		},
		{
			code: "class C { foo; foo() { let foo; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { var x; } static { var x; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let x; } static { let x; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { var x; { var x; /* redeclaration */ } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { { var x; } { var x; /* redeclaration */ } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { { let x; } { let x; } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const a = [].find(a => a)",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = [].find(function(a) { return a; })",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [a = [].find(a => true)] = dummy",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a = [].find(a => true) } = dummy",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function func(a = [].find(a => true)) {}",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for (const a in [].find(a => true)) {}",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for (const a of [].find(a => true)) {}",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = [].map(a => true).filter(a => a === 'b')",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = [].map(a => true).filter(a => a === 'b').find(a => a === 'c')",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a } = (({ a }) => ({ a }))();",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const person = people.find(item => {const person = item.name; return person === 'foo'})",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var y = bar || foo(y => y);",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var y = bar && foo(y => y);",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var z = bar(foo(z => z));",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var z = boo(bar(foo(z => z)));",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var match = function (person) { return person.name === 'foo'; };\nconst person = [].find(match);",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = foo(x || (a => {}))",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a = 1 } = foo(a => {})",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const person = {...people.find((person) => person.firstName.startsWith('s'))}",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "const person = { firstName: people.filter((person) => person.firstName.startsWith('s')).map((person) => person.firstName)[0]}",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "() => { const y = foo(y => y); }",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = (x => x)()",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var y = bar || (y => y)();",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var y = bar && (y => y)();",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = (x => x)((y => y)());",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a = 1 } = (a => {})()",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "() => { const y = (y => y)(); }",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [x = y => y] = [].map(y => y)",
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "function a(x) { var b = function c() { var x = 'foo'; }; }",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 12,
					},
					line: 1,
					column: 44,
				},
			],
		},
		{
			code: "var a = (x) => { var b = () => { var x = 'foo'; }; }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 10,
					},
					line: 1,
					column: 38,
				},
			],
		},
		{
			code: "function a(x) { var b = function () { var x = 'foo'; }; }",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 12,
					},
					line: 1,
					column: 43,
				},
			],
		},
		{
			code: "var x = 1; function a(x) { return ++x; }",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
					line: 1,
					column: 23,
				},
			],
		},
		{
			code: "var a=3; function b() { var a=10; }",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
				},
			],
		},
		{
			code: "var a=3; function b() { var a=10; }; setTimeout(function() { b(); }, 0);",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
				},
			],
		},
		{
			code: "var a=3; function b() { var a=10; var b=0; }; setTimeout(function() { b(); }, 0);",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
				},
				{
					messageId: "noShadow",
					data: {
						name: "b",
						shadowedLine: 1,
						shadowedColumn: 19,
					},
				},
			],
		},
		{
			code: "var x = 1; { let x = 2; }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
				},
			],
		},
		{
			code: "let x = 1; { const x = 2; }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
				},
			],
		},
		{
			code: "{ let a; } function a() {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 21,
					},
				},
			],
		},
		{
			code: "{ const a = 0; } function a() {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 27,
					},
				},
			],
		},
		{
			code: "function foo() { let a; } function a() {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 36,
					},
				},
			],
		},
		{
			code: "function foo() { var a; } function a() {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 36,
					},
				},
			],
		},
		{
			code: "function foo(a) { } function a() {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 30,
					},
				},
			],
		},
		{
			code: "{ let a; } let a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 16,
					},
				},
			],
		},
		{
			code: "{ let a; } var a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 16,
					},
				},
			],
		},
		{
			code: "{ let a; } function a() {}",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 21,
					},
				},
			],
		},
		{
			code: "{ const a = 0; } const a = 1;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 24,
					},
				},
			],
		},
		{
			code: "{ const a = 0; } var a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 22,
					},
				},
			],
		},
		{
			code: "{ const a = 0; } function a() {}",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 27,
					},
				},
			],
		},
		{
			code: "function foo() { let a; } let a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 31,
					},
				},
			],
		},
		{
			code: "function foo() { let a; } var a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 31,
					},
				},
			],
		},
		{
			code: "function foo() { let a; } function a() {}",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 36,
					},
				},
			],
		},
		{
			code: "function foo() { var a; } let a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 31,
					},
				},
			],
		},
		{
			code: "function foo() { var a; } var a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 31,
					},
				},
			],
		},
		{
			code: "function foo() { var a; } function a() {}",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 36,
					},
				},
			],
		},
		{
			code: "function foo(a) { } let a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 25,
					},
				},
			],
		},
		{
			code: "function foo(a) { } var a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 25,
					},
				},
			],
		},
		{
			code: "function foo(a) { } function a() {}",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 30,
					},
				},
			],
		},
		{
			code: "(function a() { function a(){} })()",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 11,
					},
				},
			],
		},
		{
			code: "(function a() { class a{} })()",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 11,
					},
				},
			],
		},
		{
			code: "(function a() { (function a(){}); })()",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 11,
					},
				},
			],
		},
		{
			code: "(function a() { (class a{}); })()",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 11,
					},
				},
			],
		},
		{
			code: "(function() { var a = function(a) {}; })()",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 19,
					},
				},
			],
		},
		{
			code: "(function() { var a = function() { function a() {} }; })()",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 19,
					},
				},
			],
		},
		{
			code: "(function() { var a = function() { class a{} }; })()",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 19,
					},
				},
			],
		},
		{
			code: "(function() { var a = function() { (function a() {}); }; })()",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 19,
					},
				},
			],
		},
		{
			code: "(function() { var a = function() { (class a{}); }; })()",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 19,
					},
				},
			],
		},
		{
			code: "(function() { var a = class { constructor() { class a {} } }; })()",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 19,
					},
				},
			],
		},
		{
			code: "class A { constructor() { var A; } }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "A",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
				},
			],
		},
		{
			code: "(function a() { function a(){ function a(){} } })()",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 11,
					},
					line: 1,
					column: 26,
				},
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 26,
					},
					line: 1,
					column: 40,
				},
			],
		},
		{
			code: "function foo() { var Object = 0; }",
			options: [{ builtinGlobals: true }],
			errors: [
				{
					messageId: "noShadowGlobal",
					data: {
						name: "Object",
					},
				},
			],
		},
		{
			code: "function foo() { var top = 0; }",
			options: [{ builtinGlobals: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "noShadowGlobal",
					data: {
						name: "top",
					},
				},
			],
		},
		{
			code: "var Object = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					messageId: "noShadowGlobal",
					data: {
						name: "Object",
					},
				},
			],
		},
		{
			code: "var top = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				globals: globals.browser,
			},
			errors: [
				{
					messageId: "noShadowGlobal",
					data: {
						name: "top",
					},
				},
			],
		},
		{
			code: "var Object = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
			errors: [
				{
					messageId: "noShadowGlobal",
					data: {
						name: "Object",
					},
				},
			],
		},
		{
			code: "var top = 0;",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
				globals: globals.browser,
			},
			errors: [
				{
					messageId: "noShadowGlobal",
					data: {
						name: "top",
					},
				},
			],
		},
		{
			code: "function foo(cb) { (function (cb) { cb(42); })(cb); }",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "cb",
						shadowedLine: 1,
						shadowedColumn: 14,
					},
					line: 1,
					column: 31,
				},
			],
		},
		{
			code: "class C { static { let a; { let a; } } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 24,
					},
					line: 1,
					column: 33,
				},
			],
		},
		{
			code: "class C { static { var C; } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "C",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 24,
				},
			],
		},
		{
			code: "class C { static { let C; } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "C",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 24,
				},
			],
		},
		{
			code: "var a; class C { static { var a; } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
					line: 1,
					column: 31,
				},
			],
		},
		{
			code: "class C { static { var a; } } var a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 35,
					},
					line: 1,
					column: 24,
				},
			],
		},
		{
			code: "class C { static { let a; } } let a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 35,
					},
					line: 1,
					column: 24,
				},
			],
		},
		{
			code: "class C { static { var a; } } let a;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 35,
					},
					line: 1,
					column: 24,
				},
			],
		},
		{
			code: "class C { static { var a; class D { static { var a; } } } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 24,
					},
					line: 1,
					column: 50,
				},
			],
		},
		{
			code: "class C { static { let a; class D { static { let a; } } } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 24,
					},
					line: 1,
					column: 50,
				},
			],
		},
		{
			code: "let x = foo((x,y) => {});\nlet y;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
				},
				{
					messageId: "noShadow",
					data: {
						name: "y",
						shadowedLine: 2,
						shadowedColumn: 5,
					},
				},
			],
		},
		{
			code: "const a = fn(()=>{ class C { fn () { const a = 42; return a } } return new C() })",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 44,
				},
			],
		},
		{
			code: "function a() {}\nfoo(a => {});",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 10,
					},
					line: 2,
					column: 5,
				},
			],
		},
		{
			code: "const a = fn(()=>{ function C() { this.fn=function() { const a = 42; return a } } return new C() });",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 62,
				},
			],
		},
		{
			code: "const x = foo(() => { const bar = () => { return x => {}; }; return bar; });",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 50,
				},
			],
		},
		{
			code: "const x = foo(() => { return { bar(x) {} }; });",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 36,
				},
			],
		},
		{
			code: "const x = () => { foo(x => x); }",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 23,
				},
			],
		},
		{
			code: "const foo = () => { let x; bar(x => x); }",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 25,
					},
					line: 1,
					column: 32,
				},
			],
		},
		{
			code: "foo(() => { const x = x => x; });",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 19,
					},
					line: 1,
					column: 23,
				},
			],
		},
		{
			code: "const foo = (x) => { bar(x => {}) }",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 14,
					},
					line: 1,
					column: 26,
				},
			],
		},
		{
			code: "let x = ((x,y) => {})();\nlet y;",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
				},
				{
					messageId: "noShadow",
					data: {
						name: "y",
						shadowedLine: 2,
						shadowedColumn: 5,
					},
				},
			],
		},
		{
			code: "const a = (()=>{ class C { fn () { const a = 42; return a } } return new C() })()",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 42,
				},
			],
		},
		{
			code: "const x = () => { (x => x)(); }",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "x",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 20,
				},
			],
		},

		// https://github.com/eslint/eslint/issues/20425
		{
			code: "let x = false; export const a = wrap(function a() { if (!x) { x = true; a(); } });",
			options: [{ hoist: "all" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 29,
					},
					line: 1,
					column: 47,
				},
			],
		},
		{
			code: "const a = wrap(function a() {});",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 25,
				},
			],
		},
		{
			code: "const a = foo || wrap(function a() {});",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 32,
				},
			],
		},
		{
			code: "const { a = wrap(function a() {}) } = obj;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 9,
					},
					line: 1,
					column: 27,
				},
			],
		},
		{
			code: "const { a = foo || wrap(function a() {}) } = obj;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 9,
					},
					line: 1,
					column: 34,
				},
			],
		},
		{
			code: "const { a = foo, b = function a() {} } = {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 9,
					},
					line: 1,
					column: 31,
				},
			],
		},
		{
			code: "const { A = Foo, B = class A {} } = {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "A",
						shadowedLine: 1,
						shadowedColumn: 9,
					},
					line: 1,
					column: 28,
				},
			],
		},
		{
			code: "function foo(a = wrap(function a() {})) {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 14,
					},
					line: 1,
					column: 32,
				},
			],
		},
		{
			code: "function foo(a = foo || wrap(function a() {})) {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 14,
					},
					line: 1,
					column: 39,
				},
			],
		},
		{
			code: "const A = wrap(class A {});",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "A",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 22,
				},
			],
		},
		{
			code: "const A = foo || wrap(class A {});",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "A",
						shadowedLine: 1,
						shadowedColumn: 7,
					},
					line: 1,
					column: 29,
				},
			],
		},
		{
			code: "const { A = wrap(class A {}) } = obj;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "A",
						shadowedLine: 1,
						shadowedColumn: 9,
					},
					line: 1,
					column: 24,
				},
			],
		},
		{
			code: "const { A = foo || wrap(class A {}) } = obj;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "A",
						shadowedLine: 1,
						shadowedColumn: 9,
					},
					line: 1,
					column: 31,
				},
			],
		},
		{
			code: "function foo(A = wrap(class A {})) {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "A",
						shadowedLine: 1,
						shadowedColumn: 14,
					},
					line: 1,
					column: 29,
				},
			],
		},
		{
			code: "function foo(A = foo || wrap(class A {})) {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "A",
						shadowedLine: 1,
						shadowedColumn: 14,
					},
					line: 1,
					column: 36,
				},
			],
		},
		{
			code: "var a = function a() {} ? foo : bar",
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
					line: 1,
					column: 18,
				},
			],
		},
		{
			code: "var A = class A {} ? foo : bar",
			languageOptions: {
				ecmaVersion: 6,
			},
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "A",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
					line: 1,
					column: 15,
				},
			],
		},
		{
			code: "(function Array() {})",
			options: [{ builtinGlobals: true }],
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
			},
			errors: [
				{
					messageId: "noShadowGlobal",
					data: {
						name: "Array",
					},
					line: 1,
					column: 11,
				},
			],
		},
		{
			code: "let a; { let b = (function a() {}) }",
			languageOptions: {
				ecmaVersion: 6,
			},
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
					line: 1,
					column: 28,
				},
			],
		},
		{
			code: "let a = foo; { let b = (function a() {}) }",
			languageOptions: {
				ecmaVersion: 6,
			},
			errors: [
				{
					messageId: "noShadow",
					data: {
						name: "a",
						shadowedLine: 1,
						shadowedColumn: 5,
					},
					line: 1,
					column: 34,
				},
			],
		},
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run("no-shadow", rule, {
	invalid: [
		{
			code: `
  type T = 1;
  {
	type T = 2;
  }
		`,
			errors: [
				{
					data: {
						name: "T",
						shadowedColumn: 8,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  type T = 1;
  function foo<T>(arg: T) {}
		`,
			errors: [
				{
					data: {
						name: "T",
						shadowedColumn: 8,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  function foo<T>() {
	return function <T>() {};
  }
		`,
			errors: [
				{
					data: {
						name: "T",
						shadowedColumn: 16,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  type T = string;
  function foo<T extends (arg: any) => void>(arg: T) {}
		`,
			errors: [
				{
					data: {
						name: "T",
						shadowedColumn: 8,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  const x = 1;
  {
	type x = string;
  }
		`,
			options: [{ ignoreTypeValueShadow: false }],
			errors: [
				{
					data: {
						name: "x",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  type Foo = 1;
		`,
			options: [
				{
					builtinGlobals: true,
					ignoreTypeValueShadow: false,
				},
			],
			languageOptions: {
				globals: {
					Foo: "writable",
				},
			},
			errors: [
				{
					data: {
						name: "Foo",
					},
					messageId: "noShadowGlobal",
				},
			],
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2447
		{
			code: `
  const test = 1;
  type Fn = (test: string) => typeof test;
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
			errors: [
				{
					data: {
						name: "test",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  type Fn = (Foo: string) => typeof Foo;
		`,
			options: [
				{
					builtinGlobals: true,
					ignoreFunctionTypeParameterNameValueShadow: false,
				},
			],
			languageOptions: {
				globals: {
					Foo: "writable",
				},
			},
			errors: [
				{
					data: {
						name: "Foo",
					},
					messageId: "noShadowGlobal",
				},
			],
		},

		// https://github.com/typescript-eslint/typescript-eslint/issues/6098
		{
			code: `
  const arg = 0;
  
  interface Test {
	(arg: string): typeof arg;
  }
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
			errors: [
				{
					data: {
						name: "arg",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  const arg = 0;
  
  interface Test {
	p1(arg: string): typeof arg;
  }
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
			errors: [
				{
					data: {
						name: "arg",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  const arg = 0;
  
  declare function test(arg: string): typeof arg;
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
			errors: [
				{
					data: {
						name: "arg",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  const arg = 0;
  
  declare const test: (arg: string) => typeof arg;
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
			errors: [
				{
					data: {
						name: "arg",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  const arg = 0;
  
  declare class Test {
	p1(arg: string): typeof arg;
  }
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
			errors: [
				{
					data: {
						name: "arg",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  const arg = 0;
  
  declare const Test: {
	new (arg: string): typeof arg;
  };
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
			errors: [
				{
					data: {
						name: "arg",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  const arg = 0;
  
  type Bar = new (arg: number) => typeof arg;
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
			errors: [
				{
					data: {
						name: "arg",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  const arg = 0;
  
  declare namespace Lib {
	function test(arg: string): typeof arg;
  }
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
			errors: [
				{
					data: {
						name: "arg",
						shadowedColumn: 9,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  import type { foo } from './foo';
  function doThing(foo: number) {}
		`,
			options: [{ ignoreTypeValueShadow: false }],
			errors: [
				{
					data: {
						name: "foo",
						shadowedColumn: 17,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  import { type foo } from './foo';
  function doThing(foo: number) {}
		`,
			options: [{ ignoreTypeValueShadow: false }],
			errors: [
				{
					data: {
						name: "foo",
						shadowedColumn: 17,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  import { foo } from './foo';
  function doThing(foo: number, bar: number) {}
		`,
			options: [{ ignoreTypeValueShadow: true }],
			errors: [
				{
					data: {
						name: "foo",
						shadowedColumn: 12,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  interface Foo {}
  
  declare module 'bar' {
	export interface Foo {
	  x: string;
	}
  }
		`,
			errors: [
				{
					data: {
						name: "Foo",
						shadowedColumn: 13,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  import type { Foo } from 'bar';
  
  declare module 'baz' {
	export interface Foo {
	  x: string;
	}
  }
		`,
			errors: [
				{
					data: {
						name: "Foo",
						shadowedColumn: 17,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  import { type Foo } from 'bar';
  
  declare module 'baz' {
	export interface Foo {
	  x: string;
	}
  }
		`,
			errors: [
				{
					data: {
						name: "Foo",
						shadowedColumn: 17,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  let x = foo((x, y) => {});
  let y;
		`,
			options: [{ hoist: "all" }],
			languageOptions: { parserOptions: { ecmaVersion: 6 } },
			errors: [
				{
					data: {
						name: "x",
						shadowedColumn: 7,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
				{
					data: {
						name: "y",
						shadowedColumn: 7,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  let x = foo((x, y) => {});
  let y;
		`,
			options: [{ hoist: "functions" }],
			languageOptions: { parserOptions: { ecmaVersion: 6 } },
			errors: [
				{
					data: {
						name: "x",
						shadowedColumn: 7,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  type Foo<A> = 1;
  type A = 1;
		`,
			options: [{ hoist: "types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  interface Foo<A> {}
  type A = 1;
		`,
			options: [{ hoist: "types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  interface Foo<A> {}
  interface A {}
		`,
			options: [{ hoist: "types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 13,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  type Foo<A> = 1;
  interface A {}
		`,
			options: [{ hoist: "types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 13,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  {
	type A = 1;
  }
  type A = 1;
		`,
			options: [{ hoist: "types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 5,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  {
	interface A {}
  }
  type A = 1;
		`,
			options: [{ hoist: "types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 5,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  type Foo<A> = 1;
  type A = 1;
		`,
			options: [{ hoist: "all" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  interface Foo<A> {}
  type A = 1;
		`,
			options: [{ hoist: "all" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  interface Foo<A> {}
  interface A {}
		`,
			options: [{ hoist: "all" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 13,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  type Foo<A> = 1;
  interface A {}
		`,
			options: [{ hoist: "all" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 13,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  {
	type A = 1;
  }
  type A = 1;
		`,
			options: [{ hoist: "all" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 5,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  {
	interface A {}
  }
  type A = 1;
		`,
			options: [{ hoist: "all" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 5,
					},
					messageId: "noShadow",
				},
			],
		},

		{
			code: `
  type Foo<A> = 1;
  type A = 1;
		`,
			options: [{ hoist: "functions-and-types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
	if (true) {
		const foo = 6;
	}

	function foo() { }
		`,
			options: [{ hoist: "functions-and-types" }],
			errors: [
				{
					data: {
						name: "foo",
						shadowedColumn: 11,
						shadowedLine: 6,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
	// types
	type Bar<Foo> = 1;
	type Foo = 1;

	// functions
	if (true) {
		const b = 6;
	}

	function b() { }
		`,
			options: [{ hoist: "functions-and-types" }],
			errors: [
				{
					data: {
						name: "Foo",
						shadowedColumn: 7,
						shadowedLine: 4,
					},
					messageId: "noShadow",
				},
				{
					data: {
						name: "b",
						shadowedColumn: 11,
						shadowedLine: 11,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
	// types
	type Bar<Foo> = 1;
	type Foo = 1;

	// functions
	if (true) {
		const b = 6;
	}

	function b() { }
		`,
			options: [{ hoist: "types" }],
			errors: [
				{
					data: {
						name: "Foo",
						shadowedColumn: 7,
						shadowedLine: 4,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  interface Foo<A> {}
  type A = 1;
		`,
			options: [{ hoist: "functions-and-types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  interface Foo<A> {}
  interface A {}
		`,
			options: [{ hoist: "functions-and-types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 13,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  type Foo<A> = 1;
  interface A {}
		`,
			options: [{ hoist: "functions-and-types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 13,
						shadowedLine: 3,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  {
	type A = 1;
  }
  type A = 1;
		`,
			options: [{ hoist: "functions-and-types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 5,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
  {
	interface A {}
  }
  type A = 1;
		`,
			options: [{ hoist: "functions-and-types" }],
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 8,
						shadowedLine: 5,
					},
					messageId: "noShadow",
				},
			],
		},

		{
			code: `
  function foo<T extends (...args: any[]) => any>(fn: T, args: any[]) {}
		`,
			options: [
				{
					builtinGlobals: true,
					ignoreTypeValueShadow: false,
				},
			],
			languageOptions: {
				globals: {
					args: "writable",
				},
			},
			errors: [
				{
					data: {
						name: "args",
						shadowedColumn: 5,
						shadowedLine: 2,
					},
					messageId: "noShadowGlobal",
				},
			],
		},
		{
			code: `
  declare const has = (environment: 'dev' | 'prod' | 'test') => boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					has: false,
				},
			},
			errors: [
				{
					data: {
						name: "has",
					},
					messageId: "noShadowGlobal",
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: `
  declare const has: (environment: 'dev' | 'prod' | 'test') => boolean;
  const fn = (has: string) => {};
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					has: false,
				},
			},
			errors: [
				{
					data: {
						name: "has",
						shadowedColumn: 17,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
		{
			code: `
			const A = 2;
			enum Test {
				A = 1,
				B = A,
			}
		`,
			errors: [
				{
					data: {
						name: "A",
						shadowedColumn: 10,
						shadowedLine: 2,
					},
					messageId: "noShadow",
				},
			],
		},
	],
	valid: [
		"function foo<T = (arg: any) => any>(arg: T) {}",
		"function foo<T = ([arg]: [any]) => any>(arg: T) {}",
		"function foo<T = ({ args }: { args: any }) => any>(arg: T) {}",
		"function foo<T = (...args: any[]) => any>(fn: T, args: any[]) {}",
		"function foo<T extends (...args: any[]) => any>(fn: T, args: any[]) {}",
		"function foo<T extends (...args: any[]) => any>(fn: T, ...args: any[]) {}",
		"function foo<T extends ([args]: any[]) => any>(fn: T, args: any[]) {}",
		"function foo<T extends ([...args]: any[]) => any>(fn: T, args: any[]) {}",
		"function foo<T extends ({ args }: { args: any }) => any>(fn: T, args: any) {}",
		`
  function foo<T extends (id: string, ...args: any[]) => any>(
	fn: T,
	...args: any[]
  ) {}
	  `,
		`
  type Args = 1;
  function foo<T extends (Args: any) => void>(arg: T) {}
	  `,
		// nested conditional types
		`
  export type ArrayInput<Func> = Func extends (arg0: Array<infer T>) => any
	? T[]
	: Func extends (...args: infer T) => any
	  ? T
	  : never;
	  `,
		`
  function foo() {
	var Object = 0;
  }
	  `,
		// this params
		`
  function test(this: Foo) {
	function test2(this: Bar) {}
  }
	  `,
		// declaration merging
		`
  class Foo {
	prop = 1;
  }
  namespace Foo {
	export const v = 2;
  }
	  `,
		`
  function Foo() {}
  namespace Foo {
	export const v = 2;
  }
	  `,
		`
  class Foo {
	prop = 1;
  }
  interface Foo {
	prop2: string;
  }
	  `,
		`
  import type { Foo } from 'bar';
  
  declare module 'bar' {
	export interface Foo {
	  x: string;
	}
  }
	  `,
		// type value shadowing
		`
  const x = 1;
  type x = string;
	  `,
		`
  const x = 1;
  {
	type x = string;
  }
	  `,
		{
			code: `
  type Foo = 1;
		`,
			options: [{ ignoreTypeValueShadow: true }],
			languageOptions: {
				globals: {
					Foo: "writable",
				},
			},
		},
		{
			code: `
  type Foo = 1;
		`,
			options: [
				{
					builtinGlobals: false,
					ignoreTypeValueShadow: false,
				},
			],
			languageOptions: {
				globals: {
					Foo: "writable",
				},
			},
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2360
		`
  enum Direction {
	left = 'left',
	right = 'right',
  }
	  `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2447
		{
			code: `
  const test = 1;
  type Fn = (test: string) => typeof test;
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: true }],
		},
		{
			code: `
  type Fn = (Foo: string) => typeof Foo;
		`,
			options: [
				{
					builtinGlobals: false,
					ignoreFunctionTypeParameterNameValueShadow: true,
				},
			],
			languageOptions: {
				globals: {
					Foo: "writable",
				},
			},
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/6098
		{
			code: `
  const arg = 0;
  
  interface Test {
	(arg: string): typeof arg;
  }
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: true }],
		},
		{
			code: `
  const arg = 0;
  
  interface Test {
	p1(arg: string): typeof arg;
  }
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: true }],
		},
		{
			code: `
  const arg = 0;
  
  declare function test(arg: string): typeof arg;
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: true }],
		},
		{
			code: `
  const arg = 0;
  
  declare const test: (arg: string) => typeof arg;
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: true }],
		},
		{
			code: `
  const arg = 0;
  
  declare class Test {
	p1(arg: string): typeof arg;
  }
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: true }],
		},
		{
			code: `
  const arg = 0;
  
  declare const Test: {
	new (arg: string): typeof arg;
  };
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: true }],
		},
		{
			code: `
  const arg = 0;
  
  type Bar = new (arg: number) => typeof arg;
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: true }],
		},
		{
			code: `
  const arg = 0;
  
  declare namespace Lib {
	function test(arg: string): typeof arg;
  }
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: true }],
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2724
		{
			code: `
		  declare global {
			interface ArrayConstructor {}
		  }
		  export {};
		`,
			options: [{ builtinGlobals: true }],
		},
		`
		declare global {
		  const a: string;
  
		  namespace Foo {
			const a: number;
		  }
		}
		export {};
	  `,
		{
			code: `
		  declare global {
			type A = 'foo';
  
			namespace Foo {
			  type A = 'bar';
			}
		  }
		  export {};
		`,
			options: [{ ignoreTypeValueShadow: false }],
		},
		{
			code: `
		  declare global {
			const foo: string;
			type Fn = (foo: number) => void;
		  }
		  export {};
		`,
			options: [{ ignoreFunctionTypeParameterNameValueShadow: false }],
		},
		`
  export class Wrapper<Wrapped> {
	private constructor(private readonly wrapped: Wrapped) {}
  
	unwrap(): Wrapped {
	  return this.wrapped;
	}
  
	static create<Wrapped>(wrapped: Wrapped) {
	  return new Wrapper<Wrapped>(wrapped);
	}
  }
	  `,
		`
  function makeA() {
	return class A<T> {
	  constructor(public value: T) {}
  
	  static make<T>(value: T) {
		return new A<T>(value);
	  }
	};
  }
	  `,
		{
			// https://github.com/typescript-eslint/typescript-eslint/issues/3862
			code: `
  import type { foo } from './foo';
  type bar = number;
  
  // 'foo' is already declared in the upper scope
  // 'bar' is fine
  function doThing(foo: number, bar: number) {}
		`,
			options: [{ ignoreTypeValueShadow: true }],
		},
		{
			code: `
  import { type foo } from './foo';
  
  // 'foo' is already declared in the upper scope
  function doThing(foo: number) {}
		`,
			options: [{ ignoreTypeValueShadow: true }],
		},
		{
			code: "const a = [].find(a => a);",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: `
  const a = [].find(function (a) {
	return a;
  });
		`,
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "const [a = [].find(a => true)] = dummy;",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "const { a = [].find(a => true) } = dummy;",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "function func(a = [].find(a => true)) {}",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: `
  for (const a in [].find(a => true)) {
  }
		`,
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: `
  for (const a of [].find(a => true)) {
  }
		`,
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "const a = [].map(a => true).filter(a => a === 'b');",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: `
  const a = []
	.map(a => true)
	.filter(a => a === 'b')
	.find(a => a === 'c');
		`,
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "const { a } = (({ a }) => ({ a }))();",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: `
  const person = people.find(item => {
	const person = item.name;
	return person === 'foo';
  });
		`,
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "var y = bar || foo(y => y);",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "var y = bar && foo(y => y);",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "var z = bar(foo(z => z));",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "var z = boo(bar(foo(z => z)));",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: `
  var match = function (person) {
	return person.name === 'foo';
  };
  const person = [].find(match);
		`,
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "const a = foo(x || (a => {}));",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "const { a = 1 } = foo(a => {});",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "const person = { ...people.find(person => person.firstName.startsWith('s')) };",
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { parserOptions: { ecmaVersion: 2021 } },
		},
		{
			code: `
  const person = {
	firstName: people
	  .filter(person => person.firstName.startsWith('s'))
	  .map(person => person.firstName)[0],
  };
		`,
			options: [{ ignoreOnInitialization: true }],
			languageOptions: { parserOptions: { ecmaVersion: 2021 } },
		},
		{
			code: `
  () => {
	const y = foo(y => y);
  };
		`,
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "const x = (x => x)();",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "var y = bar || (y => y)();",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "var y = bar && (y => y)();",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "var x = (x => x)((y => y)());",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: "const { a = 1 } = (a => {})();",
			options: [{ ignoreOnInitialization: true }],
		},
		{
			code: `
  () => {
	const y = (y => y)();
  };
		`,
			options: [{ ignoreOnInitialization: true }],
		},
		"const [x = y => y] = [].map(y => y);",

		{
			code: `
  type Foo<A> = 1;
  type A = 1;
		`,
			options: [{ hoist: "never" }],
		},
		{
			code: `
  interface Foo<A> {}
  type A = 1;
		`,
			options: [{ hoist: "never" }],
		},
		{
			code: `
  interface Foo<A> {}
  interface A {}
		`,
			options: [{ hoist: "never" }],
		},
		{
			code: `
  type Foo<A> = 1;
  interface A {}
		`,
			options: [{ hoist: "never" }],
		},
		{
			code: `
  {
	type A = 1;
  }
  type A = 1;
		`,
			options: [{ hoist: "never" }],
		},
		{
			code: `
  {
	interface Foo<A> {}
  }
  type A = 1;
		`,
			options: [{ hoist: "never" }],
		},

		{
			code: `
  type Foo<A> = 1;
  type A = 1;
		`,
			options: [{ hoist: "functions" }],
		},
		{
			code: `
  interface Foo<A> {}
  type A = 1;
		`,
			options: [{ hoist: "functions" }],
		},
		{
			code: `
  interface Foo<A> {}
  interface A {}
		`,
			options: [{ hoist: "functions" }],
		},
		{
			code: `
  type Foo<A> = 1;
  interface A {}
		`,
			options: [{ hoist: "functions" }],
		},
		{
			code: `
  {
	type A = 1;
  }
  type A = 1;
		`,
			options: [{ hoist: "functions" }],
		},
		{
			code: `
  {
	interface Foo<A> {}
  }
  type A = 1;
		`,
			options: [{ hoist: "functions" }],
		},
		`
  import type { Foo } from 'bar';
  
  declare module 'bar' {
	export type Foo = string;
  }
		`,
		`
  import type { Foo } from 'bar';
  
  declare module 'bar' {
	interface Foo {
	  x: string;
	}
  }
		`,
		`
  import { type Foo } from 'bar';
  
  declare module 'bar' {
	export type Foo = string;
  }
		`,
		`
  import { type Foo } from 'bar';
  
  declare module 'bar' {
	export interface Foo {
	  x: string;
	}
  }
		`,
		`
  import { type Foo } from 'bar';
  
  declare module 'bar' {
	type Foo = string;
  }
		`,
		`
  import { type Foo } from 'bar';
  
  declare module 'bar' {
	interface Foo {
	  x: string;
	}
  }
		`,
		{
			filename: "baz.d.ts",
			code: `
  declare const foo1: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo1: false,
				},
			},
		},
		{
			filename: "baz.d.ts",
			code: `
  declare let foo2: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo2: false,
				},
			},
		},
		{
			filename: "baz.d.ts",
			code: `
  declare var foo3: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo3: false,
				},
			},
		},
		{
			filename: "baz.d.ts",
			code: `
  function foo4(name: string): void;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo4: false,
				},
			},
		},
		{
			filename: "baz.d.ts",
			code: `
  declare class Foopy1 {
	name: string;
  }
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy1: false,
				},
			},
		},
		{
			filename: "baz.d.ts",
			code: `
  declare interface Foopy2 {
	name: string;
  }
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy2: false,
				},
			},
		},
		{
			filename: "baz.d.ts",
			code: `
  declare type Foopy3 = {
	x: number;
  };
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy3: false,
				},
			},
		},
		{
			filename: "baz.d.ts",
			code: `
  declare enum Foopy4 {
	x,
  }
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy4: false,
				},
			},
		},
		{
			filename: "baz.d.ts",
			code: `
  declare namespace Foopy5 {}
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy5: false,
				},
			},
		},
		{
			filename: "baz.d.ts",
			code: `
  declare;
  foo5: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo5: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  declare const foo1: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo1: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  declare let foo2: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo2: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  declare var foo3: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo3: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  function foo4(name: string): void;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo4: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  declare class Foopy1 {
	name: string;
  }
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy1: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  declare interface Foopy2 {
	name: string;
  }
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy2: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  declare type Foopy3 = {
	x: number;
  };
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy3: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  declare enum Foopy4 {
	x,
  }
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy4: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  declare namespace Foopy5 {}
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy5: false,
				},
			},
		},
		{
			filename: "baz.d.cts",
			code: `
  declare;
  foo5: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo5: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  declare const foo1: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo1: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  declare let foo2: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo2: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  declare var foo3: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo3: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  function foo4(name: string): void;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo4: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  declare class Foopy1 {
	name: string;
  }
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy1: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  declare interface Foopy2 {
	name: string;
  }
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy2: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  declare type Foopy3 = {
	x: number;
  };
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy3: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  declare enum Foopy4 {
	x,
  }
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy4: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  declare namespace Foopy5 {}
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					Foopy5: false,
				},
			},
		},
		{
			filename: "baz.d.mts",
			code: `
  declare;
  foo5: boolean;
		`,
			options: [{ builtinGlobals: true }],
			languageOptions: {
				globals: {
					foo5: false,
				},
			},
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
			name: "invalid enum value for hoist option",
			code: "var x = 1;",
			options: [{ hoist: "invalid" }],
			error: { name: "SchemaValidationError" },
		},
	],
});
