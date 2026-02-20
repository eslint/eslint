/**
 * @fileoverview Tests for no-use-before-define rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-use-before-define"),
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

ruleTester.run("no-use-before-define", rule, {
	valid: [
		"unresolved",
		"Array",
		"function foo () { arguments; }",
		"var a=10; alert(a);",
		"function b(a) { alert(a); }",
		"Object.hasOwnProperty.call(a);",
		"function a() { alert(arguments);}",
		{
			code: "a(); function a() { alert(arguments); }",
			options: ["nofunc"],
		},
		{
			code: "(() => { var a = 42; alert(a); })();",
			languageOptions: { ecmaVersion: 6 },
		},
		"a(); try { throw new Error() } catch (a) {}",
		{ code: "class A {} new A();", languageOptions: { ecmaVersion: 6 } },
		"var a = 0, b = a;",
		{
			code: "var {a = 0, b = a} = {};",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [a = 0, b = a] = {};",
			languageOptions: { ecmaVersion: 6 },
		},
		"function foo() { foo(); }",
		"var foo = function() { foo(); };",
		"var a; for (a in a) {}",
		{ code: "var a; for (a of a) {}", languageOptions: { ecmaVersion: 6 } },
		{
			code: "let a; class C { static { a; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a; a; } }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// Block-level bindings
		{
			code: '"use strict"; a(); { function a() {} }',
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: '"use strict"; { a(); function a() {} }',
			options: ["nofunc"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (foo) { case 1:  { a(); } default: { let a; }}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "a(); { let a = function () {}; }",
			languageOptions: { ecmaVersion: 6 },
		},

		// object style options
		{
			code: "a(); function a() { alert(arguments); }",
			options: [{ functions: false }],
		},
		{
			code: '"use strict"; { a(); function a() {} }',
			options: [{ functions: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { new A(); } class A {};",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},

		// "variables" option
		{
			code: "function foo() { bar; } var bar;",
			options: [{ variables: false }],
		},
		{
			code: "var foo = () => bar; var bar;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static { () => foo; let foo; } }",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},

		// Tests related to class definition evaluation. These are not TDZ errors.
		{
			code: "class C extends (class { method() { C; } }) {}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class extends (class { method() { C; } }) {});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = (class extends (class { method() { C; } }) {});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C extends (class { field = C; }) {}",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class extends (class { field = C; }) {});",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = (class extends (class { field = C; }) {});",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [() => C](){} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { [() => C](){} });",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { [() => C](){} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static [() => C](){} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { static [() => C](){} });",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { static [() => C](){} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { [() => C]; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { [() => C]; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { [() => C]; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static [() => C]; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static [() => C]; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static [() => C]; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { method() { C; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { method() { C; } });",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { method() { C; } };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static method() { C; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { static method() { C; } });",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { static method() { C; } };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { field = C; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { field = C; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { field = C; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = C; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = C; });",
			languageOptions: { ecmaVersion: 2022 },
		}, // `const C = class { static field = C; };` is TDZ error
		{
			code: "class C { static field = class { static field = C; }; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = class { static field = C; }; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = () => C; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { field = () => C; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { field = () => C; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = () => C; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = () => C; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static field = () => C; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = class extends C {}; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { field = class extends C {}; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { field = class extends C {}; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = class extends C {}; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = class extends C {}; });",
			languageOptions: { ecmaVersion: 2022 },
		}, // `const C = class { static field = class extends C {}; };` is TDZ error
		{
			code: "class C { static field = class { [C]; }; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = class { [C]; }; });",
			languageOptions: { ecmaVersion: 2022 },
		}, // `const C = class { static field = class { [C]; } };` is TDZ error
		{
			code: "const C = class { static field = class { field = C; }; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { method() { a; } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static method() { a; } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { field = a; } let a;", // `class C { static field = a; } let a;` is TDZ error
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = D; } class D {}", // `class C { static field = D; } class D {}` is TDZ error
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = class extends D {}; } class D {}", // `class C { static field = class extends D {}; } class D {}` is TDZ error
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = () => a; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = () => a; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = () => D; } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = () => D; } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = class { field = a; }; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { C; } }", // `const C = class { static { C; } }` is TDZ error
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { C; } static {} static { C; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static { C; } })",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { class D extends C {} } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { (class { static { C } }) } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { () => C; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static { () => C; } })",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static { () => C; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { () => D; } } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { () => a; } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class C { static { C.x; } }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// "allowNamedExports" option
		{
			code: "export { a }; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a as b }; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a, b }; let a, b;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a }; var a;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { f }; function f() {}",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { C }; class C {}",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
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
			code: "function App() { return <div/> } <App />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "<App />; function App() { return <div/> }",
			options: [{ functions: false }],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},

		// allowDeferredReferences: false - direct function assignments are still valid
		{
			code: "const x = () => x;",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = function() { return x; };",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = function() { foo(); };",
			options: [{ allowDeferredReferences: false }],
		},
		{
			code: "const x = () => { const y = () => x; };",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
		},

		// allowDeferredReferences: true (default) - all deferred references allowed
		{
			code: "const a = foo(() => a);",
			options: [{ allowDeferredReferences: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = [() => a];",
			options: [{ allowDeferredReferences: true }],
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "a++; var a=19;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "a++; var a=19;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "a++; var a=19;",
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "a(); var a=function() {};",
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "alert(a[1]); var a=[1,3];",
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "a(); function a() { alert(b); var b=10; a(); }",
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
				{
					messageId: "usedBeforeDefined",
					data: { name: "b" },
				},
			],
		},
		{
			code: "a(); var a=function() {};",
			options: ["nofunc"],
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "(() => { alert(a); var a = 42; })();",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "(() => a())(); function a() { }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: '"use strict"; a(); { function a() {} }',
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "a(); try { throw new Error() } catch (foo) {var a;}",
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "var f = () => a; var a;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "new A(); class A {};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "A" },
				},
			],
		},
		{
			code: "function foo() { new A(); } class A {};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "A" },
				},
			],
		},
		{
			code: "new A(); var A = class {};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "A" },
				},
			],
		},
		{
			code: "function foo() { new A(); } var A = class {};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "A" },
				},
			],
		},

		// Block-level bindings
		{
			code: "a++; { var a; }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: '"use strict"; { a(); function a() {} }',
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "{a; let a = 1}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "switch (foo) { case 1: a();\n default: \n let a;}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "if (true) { function foo() { a; } let a;}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},

		// object style options
		{
			code: "a(); var a=function() {};",
			options: [{ functions: false, classes: false }],
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "new A(); class A {};",
			options: [{ functions: false, classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "A" },
				},
			],
		},
		{
			code: "new A(); var A = class {};",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "A" },
				},
			],
		},
		{
			code: "function foo() { new A(); } var A = class {};",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "A" },
				},
			],
		},

		// invalid initializers
		{
			code: "var a = a;",
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "let a = a + b;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "const a = foo(a);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "function foo(a = a) {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "var {a = a} = [];",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "var [a = a] = [];",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "var {b = a, a} = {};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "var [b = a, a] = {};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "var {a = 0} = a;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "var [a = 0] = a;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "for (var a in a) {}",
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "for (var a of a) {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},

		// "variables" option
		{
			code: "function foo() { bar; var bar = 1; } var bar;",
			options: [{ variables: false }],
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "bar" },
				},
			],
		},
		{
			code: "foo; var foo;",
			options: [{ variables: false }],
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "foo" },
				},
			],
		},

		// https://github.com/eslint/eslint/issues/10227
		{
			code: "for (let x = x;;); let x = 0",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "x" },
				},
			],
		},
		{
			code: "for (let x in xs); let xs = []",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "xs" },
				},
			],
		},
		{
			code: "for (let x of xs); let xs = []",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "xs" },
				},
			],
		},
		{
			code: "try {} catch ({message = x}) {} let x = ''",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "x" },
				},
			],
		},
		{
			code: "with (obj) x; let x = {}",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "x" },
				},
			],
		},

		// WithStatements.
		{
			code: "with (x); let x = {}",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "x" },
				},
			],
		},
		{
			code: "with (obj) { x } let x = {}",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "x" },
				},
			],
		},
		{
			code: "with (obj) { if (a) { x } } let x = {}",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "x" },
				},
			],
		},
		{
			code: "with (obj) { (() => { if (a) { x } })() } let x = {}",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "x" },
				},
			],
		},

		// Tests related to class definition evaluation. These are TDZ errors.
		{
			code: "class C extends C {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class extends C {};",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C extends (class { [C](){} }) {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class extends (class { [C](){} }) {};",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C extends (class { static field = C; }) {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class extends (class { static field = C; }) {};",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C { [C](){} }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "(class C { [C](){} });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { [C](){} };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C { static [C](){} }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "(class C { static [C](){} });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { static [C](){} };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C { [C]; }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "(class C { [C]; });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { [C]; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C { [C] = foo; }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "(class C { [C] = foo; });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { [C] = foo; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C { static [C]; }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "(class C { static [C]; });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { static [C]; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C { static [C] = foo; }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "(class C { static [C] = foo; });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { static [C] = foo; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { static field = C; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { static field = class extends C {}; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { static field = class { [C]; } };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { static field = class { static field = C; }; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C extends D {} class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "D" },
				},
			],
		},
		{
			code: "class C extends (class { [a](){} }) {} let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C extends (class { static field = a; }) {} let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { [a]() {} } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { static [a]() {} } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { [a]; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { static [a]; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { [a] = foo; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { static [a] = foo; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { static field = a; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { static field = D; } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "D" },
				},
			],
		},
		{
			code: "class C { static field = class extends D {}; } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "D" },
				},
			],
		},
		{
			code: "class C { static field = class { [a](){} } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { static field = class { static field = a; }; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "const C = class { static { C; } };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "const C = class { static { (class extends C {}); } };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "class C { static { a; } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { static { D; } } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "D" },
				},
			],
		},
		{
			code: "class C { static { (class extends D {}); } } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "D" },
				},
			],
		},
		{
			code: "class C { static { (class { [a](){} }); } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "class C { static { (class { static field = a; }); } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "(class C extends C {});",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "(class C extends (class { [C](){} }) {});",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "(class C extends (class { static field = C; }) {});",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},

		// "allowNamedExports" option
		{
			code: "export { a }; const a = 1;",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "export { a }; const a = 1;",
			options: [{}],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "export { a }; const a = 1;",
			options: [{ allowNamedExports: false }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "export { a }; const a = 1;",
			options: ["nofunc"],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "export { a as b }; const a = 1;",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "export { a, b }; let a, b;",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
				{
					messageId: "usedBeforeDefined",
					data: { name: "b" },
				},
			],
		},
		{
			code: "export { a }; var a;",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "export { f }; function f() {}",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "f" },
				},
			],
		},
		{
			code: "export { C }; class C {}",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "C" },
				},
			],
		},
		{
			code: "export const foo = a; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "export default a; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "export function foo() { return a; }; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "export class C { foo() { return a; } }; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "a" },
				},
			],
		},
		{
			code: "<App />; const App = () => <div />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "App" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "function render() { return <Widget /> }; const Widget = () => <span />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "usedBeforeDefined",
					data: { name: "Widget" },
					line: 1,
					column: 29,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: "<Foo.Bar />; const Foo = { Bar: () => <div/> };",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "usedBeforeDefined",
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

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

const parserOptions = { ecmaVersion: 6 };

ruleTesterTypeScript.run("no-use-before-define", rule, {
	valid: [
		`
	type foo = 1;
	const x: foo = 1;
		`,
		`
	type foo = 1;
	type bar = foo;
		`,
		`
	interface Foo {}
	const x: Foo = {};
		`,
		`
	var a = 10;
	alert(a);
		`,
		`
	function b(a) {
	  alert(a);
	}
		`,
		"Object.hasOwnProperty.call(a);",
		`
	function a() {
	  alert(arguments);
	}
		`,
		"declare function a();",
		`
	declare class a {
	  foo();
	}
		`,
		"const updatedAt = data?.updatedAt;",
		`
	function f() {
	  return function t() {};
	}
	f()?.();
		`,
		`
	var a = { b: 5 };
	alert(a?.b);
		`,
		{
			code: `
	a();
	function a() {
	  alert(arguments);
	}
		  `,
			options: ["nofunc"],
		},
		{
			code: `
	(() => {
	  var a = 42;
	  alert(a);
	})();
		  `,
			languageOptions: { parserOptions },
		},
		`
	a();
	try {
	  throw new Error();
	} catch (a) {}
		`,
		{
			code: `
	class A {}
	new A();
		  `,
			languageOptions: { parserOptions },
		},
		`
	var a = 0,
	  b = a;
		`,
		{
			code: "var { a = 0, b = a } = {};",
			languageOptions: { parserOptions },
		},
		{
			code: "var [a = 0, b = a] = {};",
			languageOptions: { parserOptions },
		},
		`
	function foo() {
	  foo();
	}
		`,
		`
	var foo = function () {
	  foo();
	};
		`,
		`
	var a;
	for (a in a) {
	}
		`,
		{
			code: `
	var a;
	for (a of a) {
	}
		  `,
			languageOptions: { parserOptions },
		},

		// Block-level bindings
		{
			code: `
	'use strict';
	a();
	{
	  function a() {}
	}
		  `,
			languageOptions: { parserOptions },
		},
		{
			code: `
	'use strict';
	{
	  a();
	  function a() {}
	}
		  `,
			options: ["nofunc"],
			languageOptions: { parserOptions },
		},
		{
			code: `
	switch (foo) {
	  case 1: {
		a();
	  }
	  default: {
		let a;
	  }
	}
		  `,
			languageOptions: { parserOptions },
		},
		{
			code: `
	a();
	{
	  let a = function () {};
	}
		  `,
			languageOptions: { parserOptions },
		},

		// object style options
		{
			code: `
	a();
	function a() {
	  alert(arguments);
	}
		  `,
			options: [{ functions: false }],
		},
		{
			code: `
	'use strict';
	{
	  a();
	  function a() {}
	}
		  `,
			options: [{ functions: false }],
			languageOptions: { parserOptions },
		},
		{
			code: `
	function foo() {
	  new A();
	}
	class A {}
		  `,
			options: [{ classes: false }],
			languageOptions: { parserOptions },
		},

		// "variables" option
		{
			code: `
	function foo() {
	  bar;
	}
	var bar;
		  `,
			options: [{ variables: false }],
		},
		{
			code: `
	var foo = () => bar;
	var bar;
		  `,
			options: [{ variables: false }],
			languageOptions: { parserOptions },
		},

		// "typedefs" option
		{
			code: `
	var x: Foo = 2;
	type Foo = string | number;
		  `,
			options: [{ typedefs: false }],
		},
		{
			code: `
	var x: Foo = {};
	interface Foo {}
		  `,
			options: [{ typedefs: false, ignoreTypeReferences: false }],
		},
		{
			code: `
	let myVar: String;
	type String = string;
		  `,
			options: [{ typedefs: false, ignoreTypeReferences: false }],
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2572
		{
			code: `
	interface Bar {
	  type: typeof Foo;
	}
	
	const Foo = 2;
		  `,
			options: [{ ignoreTypeReferences: true }],
		},
		{
			code: `
	interface Bar {
	  type: typeof Foo.FOO;
	}
	
	class Foo {
	  public static readonly FOO = '';
	}
		  `,
			options: [{ ignoreTypeReferences: true }],
		},
		{
			code: `
	interface Bar {
	  type: typeof Foo.Bar.Baz;
	}
	
	const Foo = {
	  Bar: {
		Baz: 1,
	  },
	};
		  `,
			options: [{ ignoreTypeReferences: true }],
		},
		// https://github.com/bradzacher/eslint-plugin-typescript/issues/141
		{
			code: `
	interface ITest {
	  first: boolean;
	  second: string;
	  third: boolean;
	}
	
	let first = () => console.log('first');
	
	export let second = () => console.log('second');
	
	export namespace Third {
	  export let third = () => console.log('third');
	}
		  `,
			languageOptions: {
				parserOptions: { ecmaVersion: 6, sourceType: "module" },
			},
		},
		// https://github.com/eslint/typescript-eslint-parser/issues/550
		`
	function test(file: Blob) {
	  const slice: typeof file.slice =
		file.slice || (file as any).webkitSlice || (file as any).mozSlice;
	  return slice;
	}
		`,
		// https://github.com/eslint/typescript-eslint-parser/issues/435
		`
	interface Foo {
	  bar: string;
	}
	const bar = 'blah';
		`,
		{
			code: `
	function foo(): Foo {
	  return Foo.FOO;
	}
	
	enum Foo {
	  FOO,
	}
		  `,
			options: [{ enums: false }],
		},
		{
			code: `
	let foo: Foo;
	
	enum Foo {
	  FOO,
	}
		  `,
			options: [{ enums: false }],
		},
		{
			code: `
	class Test {
	  foo(args: Foo): Foo {
		return Foo.FOO;
	  }
	}
	
	enum Foo {
	  FOO,
	}
		  `,
			options: [{ enums: false }],
		},

		// "allowNamedExports" option
		{
			code: `
	export { a };
	const a = 1;
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
		},
		{
			code: `
	export { a as b };
	const a = 1;
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
		},
		{
			code: `
	export { a, b };
	let a, b;
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
		},
		{
			code: `
	export { a };
	var a;
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
		},
		{
			code: `
	export { f };
	function f() {}
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
		},
		{
			code: `
	export { C };
	class C {}
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
		},
		{
			code: `
	export { Foo };
	
	enum Foo {
	  BAR,
	}
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
		},
		{
			code: `
	export { Foo };
	
	namespace Foo {
	  export let bar = () => console.log('bar');
	}
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
		},
		{
			code: `
	export { Foo, baz };
	
	enum Foo {
	  BAR,
	}
	
	let baz: Enum;
	enum Enum {}
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2502
		{
			code: `
	import * as React from 'react';
	
	<div />;
		  `,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					sourceType: "module",
				},
			},
		},
		{
			code: `
	import React from 'react';
	
	<div />;
		  `,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					sourceType: "module",
				},
			},
		},
		{
			code: `
	import { h } from 'preact';
	
	<div />;
		  `,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					jsxPragma: "h",
					sourceType: "module",
				},
			},
		},
		{
			code: `
	const React = require('react');
	
	<div />;
		  `,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2527
		`
	type T = (value: unknown) => value is Id;
		`,
		`
	global.foo = true;
	
	declare global {
	  namespace NodeJS {
		interface Global {
		  foo?: boolean;
		}
	  }
	}
		`,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2824
		`
	@Directive({
	  selector: '[rcCidrIpPattern]',
	  providers: [
		{
		  provide: NG_VALIDATORS,
		  useExisting: CidrIpPatternDirective,
		  multi: true,
		},
	  ],
	})
	export class CidrIpPatternDirective implements Validator {}
		`,
		{
			code: `
	@Directive({
	  selector: '[rcCidrIpPattern]',
	  providers: [
		{
		  provide: NG_VALIDATORS,
		  useExisting: CidrIpPatternDirective,
		  multi: true,
		},
	  ],
	})
	export class CidrIpPatternDirective implements Validator {}
		  `,
			options: [
				{
					classes: false,
				},
			],
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2941
		`
	class A {
	  constructor(printName) {
		this.printName = printName;
	  }
	
	  openPort(printerName = this.printerName) {
		this.tscOcx.ActiveXopenport(printerName);
	
		return this;
	  }
	}
		`,
		{
			code: `
	const obj = {
	  foo: 'foo-value',
	  bar: 'bar-value',
	} satisfies {
	  [key in 'foo' | 'bar']: \`\${key}-value\`;
	};
		  `,
			options: [{ ignoreTypeReferences: false }],
		},
		{
			code: `
	const obj = {
	  foo: 'foo-value',
	  bar: 'bar-value',
	} as {
	  [key in 'foo' | 'bar']: \`\${key}-value\`;
	};
		  `,
			options: [{ ignoreTypeReferences: false }],
		},
		{
			code: `
	const obj = {
	  foo: {
		foo: 'foo',
	  } as {
		[key in 'foo' | 'bar']: key;
	  },
	};
		  `,
			options: [{ ignoreTypeReferences: false }],
		},
		{
			code: `
	const foo = {
	  bar: 'bar',
	} satisfies {
	  bar: typeof baz;
	};
	
	const baz = '';
		  `,
			options: [{ ignoreTypeReferences: true }],
		},
		`
	namespace A.X.Y {}
	
	import Z = A.X.Y;
	
	const X = 23;
		`,
		`
		namespace A {
			export namespace X {
				export namespace Y {
					export const foo = 40;
				}
			}
		}

		import Z = A.X.Y;

		const X = 23;
		`,
	],
	invalid: [
		{
			code: `
	a++;
	var a = 19;
		  `,
			languageOptions: {
				parserOptions: { sourceType: "module" },
			},
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	a++;
	var a = 19;
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	a++;
	var a = 19;
		  `,
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	a();
	var a = function () {};
		  `,
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	alert(a[1]);
	var a = [1, 3];
		  `,
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	a();
	function a() {
	  alert(b);
	  var b = 10;
	  a();
	}
		  `,
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
				{
					data: { name: "b" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	a();
	var a = function () {};
		  `,
			options: ["nofunc"],
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	(() => {
	  alert(a);
	  var a = 42;
	})();
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	(() => a())();
	function a() {}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	a();
	try {
	  throw new Error();
	} catch (foo) {
	  var a;
	}
		  `,
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	var f = () => a;
	var a;
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	new A();
	class A {}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "A" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	function foo() {
	  new A();
	}
	class A {}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "A" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	new A();
	var A = class {};
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "A" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	function foo() {
	  new A();
	}
	var A = class {};
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "A" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// Block-level bindings
		{
			code: `
	a++;
	{
	  var a;
	}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	'use strict';
	{
	  a();
	  function a() {}
	}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	{
	  a;
	  let a = 1;
	}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	switch (foo) {
	  case 1:
		a();
	  default:
		let a;
	}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	if (true) {
	  function foo() {
		a;
	  }
	  let a;
	}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// object style options
		{
			code: `
	a();
	var a = function () {};
		  `,
			options: [{ classes: false, functions: false }],
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	new A();
	var A = class {};
		  `,
			options: [{ classes: false }],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "A" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	function foo() {
	  new A();
	}
	var A = class {};
		  `,
			options: [{ classes: false }],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "A" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// invalid initializers
		{
			code: "var a = a;",
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "let a = a + b;",
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "const a = foo(a);",
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "function foo(a = a) {}",
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "var { a = a } = [];",
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "var [a = a] = [];",
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "var { b = a, a } = {};",
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "var [b = a, a] = {};",
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "var { a = 0 } = a;",
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "var [a = 0] = a;",
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	for (var a in a) {
	}
		  `,
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	for (var a of a) {
	}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// "ignoreTypeReferences" option
		{
			code: `
	interface Bar {
	  type: typeof Foo;
	}
	
	const Foo = 2;
		  `,
			options: [{ ignoreTypeReferences: false }],
			errors: [
				{
					data: { name: "Foo" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	let var1: StringOrNumber;

type StringOrNumber = string | number;
		  `,
			options: [{ ignoreTypeReferences: false, typedefs: true }],
			errors: [
				{
					data: { name: "StringOrNumber" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	interface Bar {
	  type: typeof Foo.FOO;
	}
	
	class Foo {
	  public static readonly FOO = '';
	}
		  `,
			options: [{ ignoreTypeReferences: false }],
			errors: [
				{
					data: { name: "Foo" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	interface Bar {
	  type: typeof Foo.Bar.Baz;
	}
	
	const Foo = {
	  Bar: {
		Baz: 1,
	  },
	};
		  `,
			options: [{ ignoreTypeReferences: false }],
			errors: [
				{
					data: { name: "Foo" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	const foo = {
	  bar: 'bar',
	} satisfies {
	  bar: typeof baz;
	};
	
	const baz = '';
		  `,
			options: [{ ignoreTypeReferences: false }],
			errors: [
				{
					data: { name: "baz" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// "variables" option
		{
			code: `
	function foo() {
	  bar;
	  var bar = 1;
	}
	var bar;
		  `,
			options: [{ variables: false }],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "bar" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	class Test {
	  foo(args: Foo): Foo {
		return Foo.FOO;
	  }
	}
	
	enum Foo {
	  FOO,
	}
		  `,
			options: [{ enums: true }],
			errors: [
				{
					data: { name: "Foo" },
					line: 4,
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	function foo(): Foo {
	  return Foo.FOO;
	}
	
	enum Foo {
	   FOO,
	 }
	`,
			options: [{ enums: true }],
			errors: [
				{
					data: { name: "Foo" },
					line: 3,
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	const foo = Foo.Foo;
	
	enum Foo {
	  FOO,
	}
		  `,
			options: [{ enums: true }],
			errors: [
				{
					data: { name: "Foo" },
					line: 2,
					messageId: "usedBeforeDefined",
				},
			],
		},
		// "allowNamedExports" option
		{
			code: `
	export { a };
	const a = 1;
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { a };
	const a = 1;
		  `,
			options: [{}],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { a };
	const a = 1;
		  `,
			options: [{ allowNamedExports: false }],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { a };
	const a = 1;
		  `,
			options: ["nofunc"],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { a as b };
	const a = 1;
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { a, b };
	let a, b;
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
				{
					data: { name: "b" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { a };
	var a;
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { f };
	function f() {}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "f" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { C };
	class C {}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "C" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export const foo = a;
	const a = 1;
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export function foo() {
	  return a;
	}
	const a = 1;
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export class C {
	  foo() {
		return a;
	  }
	}
	const a = 1;
		  `,
			options: [{ allowNamedExports: true }],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { Foo };
	
	enum Foo {
	  BAR,
	}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "Foo" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { Foo };
	
	namespace Foo {
	  export let bar = () => console.log('bar');
	}
		  `,
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "Foo" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	export { Foo, baz };
	
	enum Foo {
	  BAR,
	}
	
	let baz: Enum;
	enum Enum {}
		  `,
			options: [{ allowNamedExports: false, ignoreTypeReferences: true }],
			languageOptions: { parserOptions },
			errors: [
				{
					data: { name: "Foo" },
					messageId: "usedBeforeDefined",
				},
				{
					data: { name: "baz" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	f();
	function f() {}
		  `,
			errors: [
				{
					data: { name: "f" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	alert(a);
	var a = 10;
		  `,
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	f()?.();
	function f() {
	  return function t() {};
	}
		  `,
			errors: [
				{
					data: { name: "f" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	alert(a?.b);
	var a = { b: 5 };
		  `,
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: `
	@decorator
	class C {
  		static x = "foo";
  		[C.x]() { }
	}
		  `,
			errors: [
				{
					data: { name: "C" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// allowDeferredReferences: false - functions as call arguments
		{
			code: "const a = foo(() => a);",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
		{
			code: "const a = TestFunction(arr, (T) => { console.log(a); return T; });",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// allowDeferredReferences: false - functions in arrays
		{
			code: "const a = [() => a];",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// allowDeferredReferences: false - functions in object literals
		{
			code: "const a = { f: () => a };",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// allowDeferredReferences: false - IIFE
		{
			code: "const a = (() => a)();",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// allowDeferredReferences: false - new expression
		{
			code: "const a = new Foo(() => a);",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},

		// allowDeferredReferences: false - function expression as argument
		{
			code: "const a = foo(function() { return a; });",
			options: [{ allowDeferredReferences: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					data: { name: "a" },
					messageId: "usedBeforeDefined",
				},
			],
		},
	],
});
