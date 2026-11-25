/**
 * @fileoverview Tests for eqeqeq rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/eqeqeq"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const wantedEqEqEq = { expectedOperator: "===", actualOperator: "==" };
const wantedNotEqEq = { expectedOperator: "!==", actualOperator: "!=" };
const wantedEqEq = { expectedOperator: "==", actualOperator: "===" };
const wantedNotEq = { expectedOperator: "!=", actualOperator: "!==" };

ruleTester.run("eqeqeq", rule, {
	valid: [
		"a === b",
		"a !== b",
		{ code: "a === b", options: ["always"] },
		{ code: "typeof a == 'number'", options: ["smart"] },
		{ code: "'string' != typeof a", options: ["smart"] },
		{ code: "'hello' != 'world'", options: ["smart"] },
		{ code: "`hello` != `world`", options: ["smart"] },
		{ code: "`hello` == 'hello'", options: ["smart"] },
		{ code: "2 == 3", options: ["smart"] },
		{ code: "true == true", options: ["smart"] },
		{ code: "null == a", options: ["smart"] },
		{ code: "a == null", options: ["smart"] },
		{ code: "null == a", options: ["allow-null"] },
		{ code: "a == null", options: ["allow-null"] },
		{ code: "a == null", options: ["always", { null: "ignore" }] },
		{ code: "a != null", options: ["always", { null: "ignore" }] },
		{ code: "a !== null", options: ["always", { null: "ignore" }] },
		{ code: "a === null", options: ["always", { null: "always" }] },
		{ code: "a !== null", options: ["always", { null: "always" }] },
		{ code: "null === null", options: ["always", { null: "always" }] },
		{ code: "null !== null", options: ["always", { null: "always" }] },
		{ code: "a == null", options: ["always", { null: "never" }] },
		{ code: "a != null", options: ["always", { null: "never" }] },
		{ code: "null == null", options: ["always", { null: "never" }] },
		{ code: "null != null", options: ["always", { null: "never" }] },
		{ code: "a >= null", options: ["always", { null: "never" }] },
		{ code: "a + null", options: ["always", { null: "never" }] },
		{ code: "null + null", options: ["always", { null: "never" }] },
		{ code: "null instanceof Foo", options: ["always", { null: "never" }] },

		// https://github.com/eslint/eslint/issues/8020
		{
			code: "foo === /abc/u",
			options: ["always", { null: "never" }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// bigint
		{
			code: "foo === 1n",
			options: ["always", { null: "never" }],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
	invalid: [
		{
			code: "a == b",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === b",
						},
					],
				},
			],
		},
		{
			code: "a != b",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "a !== b",
						},
					],
				},
			],
		},
		{
			code: "typeof a == 'number'",
			output: "typeof a === 'number'",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "typeof a == 'number'",
			output: "typeof a === 'number'",
			options: ["always"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "'string' != typeof a",
			output: "'string' !== typeof a",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "true == true",
			output: "true === true",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "2 == 3",
			output: "2 === 3",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "2 == 3",
			output: "2 === 3",
			options: ["always"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "'hello' != 'world'",
			output: "'hello' !== 'world'",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "'hello' != 'world'",
			output: "'hello' !== 'world'",
			options: ["always"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "`hello` == `world`",
			output: "`hello` === `world`",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "`hello` != 'world'",
			output: "`hello` !== 'world'",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "a == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "a === null || a === undefined",
						},
					],
				},
			],
		},
		{
			code: "a == null",
			options: ["always"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "a === null || a === undefined",
						},
					],
				},
			],
		},
		{
			code: "null != a",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "null !== a",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "!==" },
							output: "null !== a && undefined !== a",
						},
					],
				},
			],
		},
		{
			code: "if (x == null) { }",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 9,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "if (x === null) { }",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "if (x === null || x === undefined) { }",
						},
					],
				},
			],
		},
		{
			code: "if (x != null) { }",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 9,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "if (x !== null) { }",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "!==" },
							output: "if (x !== null && x !== undefined) { }",
						},
					],
				},
			],
		},
		{
			code: "do {} while (null == x)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 21,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "do {} while (null === x)",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "do {} while (null === x || undefined === x)",
						},
					],
				},
			],
		},
		{
			code: "foo.bar.baz == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 15,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "foo.bar.baz === null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "foo.bar.baz === null || foo.bar.baz === undefined",
						},
					],
				},
			],
		},
		{
			code: "foo[0] != null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "foo[0] !== null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "!==" },
							output: "foo[0] !== null && foo[0] !== undefined",
						},
					],
				},
			],
		},
		{
			code: "foo[bar] == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "foo[bar] === null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "foo[bar] === null || foo[bar] === undefined",
						},
					],
				},
			],
		},
		{
			code: "foo?.bar[baz] == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 17,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "foo?.bar[baz] === null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "foo?.bar[baz] === null || foo?.bar[baz] === undefined",
						},
					],
				},
			],
		},
		{
			code: "class C { #foo; bar() { return this.#foo == null; } }",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 42,
					endLine: 1,
					endColumn: 44,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "class C { #foo; bar() { return this.#foo === null; } }",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "class C { #foo; bar() { return this.#foo === null || this.#foo === undefined; } }",
						},
					],
				},
			],
		},
		{
			code: "class A extends B { foo() { return super.foo == null; } }",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 46,
					endLine: 1,
					endColumn: 48,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "class A extends B { foo() { return super.foo === null; } }",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "class A extends B { foo() { return super.foo === null || super.foo === undefined; } }",
						},
					],
				},
			],
		},
		{
			code: "import.meta.foo != null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 19,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "import.meta.foo !== null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "!==" },
							output: "import.meta.foo !== null && import.meta.foo !== undefined",
						},
					],
				},
			],
		},
		{
			code: "(foo) == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 9,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(foo) === null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "(foo) === null || foo === undefined",
						},
					],
				},
			],
		},
		{
			code: "foo() == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 9,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "foo() === null",
						},
					],
				},
			],
		},
		{
			code: "foo().bar == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 13,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "foo().bar === null",
						},
					],
				},
			],
		},
		{
			code: "foo[bar()] != null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "foo[bar()] !== null",
						},
					],
				},
			],
		},
		{
			code: "foo?.bar() == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "foo?.bar() === null",
						},
					],
				},
			],
		},
		{
			code: "function foo(undefined) { return bar == null; }",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 40,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "function foo(undefined) { return bar === null; }",
						},
					],
				},
			],
		},
		{
			code: "const undefined = 0; if (foo != null) { }",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 30,
					endLine: 1,
					endColumn: 32,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "const undefined = 0; if (foo !== null) { }",
						},
					],
				},
			],
		},
		{
			code: "x == null",
			languageOptions: { globals: { undefined: "off" } },
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "x === null",
						},
					],
				},
			],
		},
		{
			code: "function foo(undefined) {} bar == null;",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 32,
					endLine: 1,
					endColumn: 34,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "function foo(undefined) {} bar === null;",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "function foo(undefined) {} bar === null || bar === undefined;",
						},
					],
				},
			],
		},
		{
			code: "x == null && y",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "x === null && y",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "(x === null || x === undefined) && y",
						},
					],
				},
			],
		},
		{
			code: "y && x == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "y && x === null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "y && (x === null || x === undefined)",
						},
					],
				},
			],
		},
		{
			code: "x == null || y",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "x === null || y",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "x === null || x === undefined || y",
						},
					],
				},
			],
		},
		{
			code: "x != null && y",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "x !== null && y",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "!==" },
							output: "x !== null && x !== undefined && y",
						},
					],
				},
			],
		},
		{
			code: "x != null || y",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "x !== null || y",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "!==" },
							output: "(x !== null && x !== undefined) || y",
						},
					],
				},
			],
		},
		{
			code: "x == null ?? y",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "x === null ?? y",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "(x === null || x === undefined) ?? y",
						},
					],
				},
			],
		},
		{
			code: "y & x != null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 9,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "y & x !== null",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "!==" },
							output: "y & (x !== null && x !== undefined)",
						},
					],
				},
			],
		},
		{
			code: "(x == null) && y",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 6,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(x === null) && y",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "(x === null || x === undefined) && y",
						},
					],
				},
			],
		},
		{
			code: "x == null ? y : z",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "x === null ? y : z",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "x === null || x === undefined ? y : z",
						},
					],
				},
			],
		},
		{
			code: "x /* a */ == /* b */ null && y",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 13,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "x /* a */ === /* b */ null && y",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "(x /* a */ === /* b */ null || x === undefined) && y",
						},
					],
				},
			],
		},
		{
			code: "foo()\nx == null && y()",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 2,
					column: 3,
					endLine: 2,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "foo()\nx === null && y()",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "foo()\n;(x === null || x === undefined) && y()",
						},
					],
				},
			],
		},
		{
			code: "foo();\nx == null && y()",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 2,
					column: 3,
					endLine: 2,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "foo();\nx === null && y()",
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator: "===" },
							output: "foo();\n(x === null || x === undefined) && y()",
						},
					],
				},
			],
		},
		{
			code: "true == 1",
			options: ["smart"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "true === 1",
						},
					],
				},
			],
		},
		{
			code: "0 != '1'",
			options: ["smart"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "0 !== '1'",
						},
					],
				},
			],
		},
		{
			code: "'wee' == /wee/",
			options: ["smart"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 9,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "'wee' === /wee/",
						},
					],
				},
			],
		},
		{
			code: "`hello${world}` == `hello`",
			options: ["smart"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 19,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "`hello${world}` === `hello`",
						},
					],
				},
			],
		},
		{
			code: "typeof a == 'number'",
			output: "typeof a === 'number'",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "'string' != typeof a",
			output: "'string' !== typeof a",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "'hello' != 'world'",
			output: "'hello' !== 'world'",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "2 == 3",
			output: "2 === 3",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "true == true",
			output: "true === true",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "true == null",
			options: ["always", { null: "always" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "true === null",
						},
					],
				},
			],
		},
		{
			code: "true != null",
			options: ["always", { null: "always" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "true !== null",
						},
					],
				},
			],
		},
		{
			code: "null == null",
			output: "null === null",
			options: ["always", { null: "always" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "null != null",
			output: "null !== null",
			options: ["always", { null: "always" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "true === null",
			options: ["always", { null: "never" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 9,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEq,
							output: "true == null",
						},
					],
				},
			],
		},
		{
			code: "true !== null",
			options: ["always", { null: "never" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 9,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEq,
							output: "true != null",
						},
					],
				},
			],
		},
		{
			code: "a === null",
			options: ["always", { null: "never" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 6,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEq,
							output: "a == null",
						},
					],
				},
			],
		},
		{
			code: "null === null",
			output: "null == null",
			options: ["always", { null: "never" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "null !== null",
			output: "null != null",
			options: ["always", { null: "never" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEq,
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "a\n==\nb",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 3,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a\n===\nb",
						},
					],
				},
			],
		},
		{
			code: "(a) == b",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 7,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a) === b",
						},
					],
				},
			],
		},
		{
			code: "(a) != b",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 7,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a) !== b",
						},
					],
				},
			],
		},
		{
			code: "a == (b)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === (b)",
						},
					],
				},
			],
		},
		{
			code: "a != (b)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "a !== (b)",
						},
					],
				},
			],
		},
		{
			code: "(a) == (b)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 7,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a) === (b)",
						},
					],
				},
			],
		},
		{
			code: "(a) != (b)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 7,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a) !== (b)",
						},
					],
				},
			],
		},
		{
			code: "(a == b) == (c)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 6,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a === b) == (c)",
						},
					],
				},
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a == b) === (c)",
						},
					],
				},
			],
		},
		{
			code: "(a != b) != (c)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 6,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a !== b) != (c)",
						},
					],
				},
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a != b) !== (c)",
						},
					],
				},
			],
		},

		// location tests
		{
			code: "a == b;",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === b;",
						},
					],
				},
			],
		},
		{
			code: "a!=b;",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "a!==b;",
						},
					],
				},
			],
		},
		{
			code: "(a + b) == c;",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a + b) === c;",
						},
					],
				},
			],
		},
		{
			code: "(a + b)  !=  c;",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a + b)  !==  c;",
						},
					],
				},
			],
		},
		{
			code: "((1) )  ==  (2);",
			output: "((1) )  ===  (2);",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
				},
			],
		},

		// If no output is provided, assert that no output is produced.
	].map(invalidCase => Object.assign({ output: null }, invalidCase)),
});
