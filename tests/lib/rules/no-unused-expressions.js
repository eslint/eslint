/**
 * @fileoverview Tests for no-unused-expressions rule.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-expressions"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-unused-expressions", rule, {
	valid: [
		"function f(){}",
		"a = b",
		"new a",
		"{}",
		"f(); g()",
		"i++",
		"a()",
		{ code: "a && a()", options: [{ allowShortCircuit: true }] },
		{ code: "a() || (b = c)", options: [{ allowShortCircuit: true }] },
		{ code: "a ? b() : c()", options: [{ allowTernary: true }] },
		{
			code: "a ? b() || (c = d) : e()",
			options: [{ allowShortCircuit: true, allowTernary: true }],
		},
		"delete foo.bar",
		"void new C",
		'"use strict";',
		'"directive one"; "directive two"; f();',
		'function foo() {"use strict"; return true; }',
		{
			code: 'var foo = () => {"use strict"; return true; }',
			languageOptions: { ecmaVersion: 6 },
		},
		'function foo() {"directive one"; "directive two"; f(); }',
		'function foo() { var foo = "use strict"; return true; }',
		{
			code: "function* foo(){ yield 0; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "async function foo() { await 5; }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { await foo.bar; }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { bar && await baz; }",
			options: [{ allowShortCircuit: true }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { foo ? await bar : await baz; }",
			options: [{ allowTernary: true }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "tag`tagged template literal`",
			options: [{ allowTaggedTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "shouldNotBeAffectedByAllowTemplateTagsOption()",
			options: [{ allowTaggedTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'import("foo")',
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: 'func?.("foo")',
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: 'obj?.foo("bar")',
			languageOptions: { ecmaVersion: 11 },
		},

		// JSX
		{
			code: "<div />",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<></>",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "var partial = <div />",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "var partial = <div />",
			options: [{ enforceForJSX: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "var partial = <></>",
			options: [{ enforceForJSX: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: '"use strict";',
			options: [{ ignoreDirectives: true }],
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: '"directive one"; "directive two"; f();',
			options: [{ ignoreDirectives: true }],
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: 'function foo() {"use strict"; return true; }',
			options: [{ ignoreDirectives: true }],
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: 'function foo() {"directive one"; "directive two"; f(); }',
			options: [{ ignoreDirectives: true }],
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: '"use strict";',
			options: [{ ignoreDirectives: true }],
		},
		{
			code: '"directive one"; "directive two"; f();',
			options: [{ ignoreDirectives: true }],
		},
		{
			code: 'function foo() {"use strict"; return true; }',
			options: [{ ignoreDirectives: true }],
		},
		{
			code: 'function foo() {"directive one"; "directive two"; f(); }',
			options: [{ ignoreDirectives: true }],
		},
	],
	invalid: [
		{
			code: "0",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "f(), 0",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "{0}",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "[]",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a && b();",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a() || false",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a || (b = c)",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a ? b() || (c = d) : e",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "`untagged template literal`",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "unusedExpression" }],
		},
		{
			code: "tag`tagged template literal`",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "unusedExpression" }],
		},
		{
			code: "a && b()",
			options: [{ allowTernary: true }],
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a ? b() : c()",
			options: [{ allowShortCircuit: true }],
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a || b",
			options: [{ allowShortCircuit: true }],
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a() && b",
			options: [{ allowShortCircuit: true }],
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a ? b : 0",
			options: [{ allowTernary: true }],
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "a ? b : c()",
			options: [{ allowTernary: true }],
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "foo.bar;",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "!a",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "+a",
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: '"directive one"; f(); "directive two";',
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: 'function foo() {"directive one"; f(); "directive two"; }',
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: 'if (0) { "not a directive"; f(); }',
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: 'function foo() { var foo = true; "use strict"; }',
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: 'var foo = () => { var foo = true; "use strict"; }',
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "`untagged template literal`",
			options: [{ allowTaggedTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "unusedExpression" }],
		},
		{
			code: "`untagged template literal`",
			options: [{ allowTaggedTemplates: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "unusedExpression" }],
		},
		{
			code: "tag`tagged template literal`",
			options: [{ allowTaggedTemplates: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "unusedExpression" }],
		},

		// Optional chaining
		{
			code: "obj?.foo",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "obj?.foo.bar",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "obj?.foo().bar",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},

		// JSX
		{
			code: "<div />",
			options: [{ enforceForJSX: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "<></>",
			options: [{ enforceForJSX: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},

		// class static blocks do not have directive prologues
		{
			code: "class C { static { 'use strict'; } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: "class C { static { \n'foo'\n'bar'\n } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "unusedExpression",
					type: "ExpressionStatement",
					line: 2,
				},
				{
					messageId: "unusedExpression",
					type: "ExpressionStatement",
					line: 3,
				},
			],
		},
		{
			code: "foo;",
			options: [{ ignoreDirectives: true }],
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: '"use strict";',
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: '"directive one"; "directive two"; f();',
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: 'function foo() {"use strict"; return true; }',
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
		{
			code: 'function foo() {"directive one"; "directive two"; f(); }',
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
			errors: [
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
				{ messageId: "unusedExpression", type: "ExpressionStatement" },
			],
		},
	],
});

// TypeScript-specific tests
const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

/**
 * Helper function to create error messages for test cases.
 * @param {Array<Object>} messages Array of message objects to format
 * @returns {Array<Object>} Formatted error messages
 */
function error(messages) {
	return messages.map(message => ({
		...message,
		message:
			"Expected an assignment or function call and instead saw an expression.",
	}));
}

ruleTesterTypeScript.run("no-unused-expressions", rule, {
	valid: [
		`
		test.age?.toLocaleString();
	  `,
		`
		let a = (a?.b).c;
	  `,
		`
		let b = a?.['b'];
	  `,
		`
		let c = one[2]?.[3][4];
	  `,
		`
		one[2]?.[3][4]?.();
	  `,
		`
		a?.['b']?.c();
	  `,
		`
		module Foo {
		  'use strict';
		}
	  `,
		`
		namespace Foo {
		  'use strict';
  
		  export class Foo {}
		  export class Bar {}
		}
	  `,
		`
		function foo() {
		  'use strict';
  
		  return null;
		}
	  `,
		`
		import('./foo');
	  `,
		`
		import('./foo').then(() => {});
	  `,
		`
		class Foo<T> {}
		new Foo<string>();
	  `,
		{
			code: "foo && foo?.();",
			options: [{ allowShortCircuit: true }],
		},
		{
			code: "foo && import('./foo');",
			options: [{ allowShortCircuit: true }],
		},
		{
			code: "foo ? import('./foo') : import('./bar');",
			options: [{ allowTernary: true }],
		},
		{
			code: "<div/> as any",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "foo && foo()!;",
			options: [{ allowShortCircuit: true }],
		},
		{
			code: `
				declare const foo:  Function | undefined;
				<any>(foo && foo()!)
			`,
			options: [{ allowShortCircuit: true }],
		},
		{
			code: `
				(Foo && Foo())<string, number>;
			`,
			options: [{ allowShortCircuit: true }],
		},
	],
	invalid: [
		{
			code: `
  if (0) 0;
		`,
			errors: error([
				{
					column: 10,
					line: 2,
				},
			]),
		},
		{
			code: `
  f(0), {};
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  a, b();
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  a() &&
	function namedFunctionInExpressionContext() {
	  f();
	};
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  a?.b;
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  (a?.b).c;
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  a?.['b'];
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  (a?.['b']).c;
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  a?.b()?.c;
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  (a?.b()).c;
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  one[2]?.[3][4];
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  one.two?.three.four;
		`,
			errors: error([
				{
					column: 3,
					line: 2,
				},
			]),
		},
		{
			code: `
  module Foo {
	const foo = true;
	'use strict';
  }
		`,
			errors: error([
				{
					column: 2,
					endColumn: 15,
					endLine: 4,
					line: 4,
				},
			]),
		},
		{
			code: `
  namespace Foo {
	export class Foo {}
	export class Bar {}
  
	'use strict';
  }
		`,
			errors: error([
				{
					column: 2,
					endColumn: 15,
					endLine: 6,
					line: 6,
				},
			]),
		},
		{
			code: `
  function foo() {
	const foo = true;
  
	'use strict';
  }
		`,
			errors: error([
				{
					column: 2,
					endColumn: 15,
					endLine: 5,
					line: 5,
				},
			]),
		},
		{
			code: "foo && foo?.bar;",
			options: [{ allowShortCircuit: true }],
			errors: error([
				{
					column: 1,
					endColumn: 17,
					endLine: 1,
					line: 1,
				},
			]),
		},
		{
			code: "foo ? foo?.bar : bar.baz;",
			options: [{ allowTernary: true }],
			errors: error([
				{
					column: 1,
					endColumn: 26,
					endLine: 1,
					line: 1,
				},
			]),
		},
		{
			code: `
  class Foo<T> {}
  Foo<string>;
		`,
			errors: error([
				{
					column: 3,
					endColumn: 15,
					endLine: 3,
					line: 3,
				},
			]),
		},
		{
			code: "Map<string, string>;",
			errors: error([
				{
					column: 1,
					endColumn: 21,
					endLine: 1,
					line: 1,
				},
			]),
		},
		{
			code: `
  declare const foo: number | undefined;
  foo;
		`,
			errors: error([
				{
					column: 3,
					endColumn: 7,
					endLine: 3,
					line: 3,
				},
			]),
		},
		{
			code: `
  declare const foo: number | undefined;
  foo as any;
		`,
			errors: error([
				{
					column: 3,
					endColumn: 14,
					endLine: 3,
					line: 3,
				},
			]),
		},
		{
			code: `
  declare const foo: number | undefined;
  <any>foo;
		`,
			errors: error([
				{
					column: 3,
					endColumn: 12,
					endLine: 3,
					line: 3,
				},
			]),
		},
		{
			code: `
  declare const foo: number | undefined;
  foo!;
		`,
			errors: error([
				{
					column: 3,
					endColumn: 8,
					endLine: 3,
					line: 3,
				},
			]),
		},
	],
});
