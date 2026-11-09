/**
 * @fileoverview Tests for no-eq-null rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-eq-null"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-eq-null", rule, {
	valid: [
		"if (x === null) { }",
		"if (null === f()) { }",
		"if (x == undefined) { }",
	],
	invalid: [
		{
			code: "if (x == null) { }",
			errors: [
				{
					messageId: "unexpected",
					data: { expectedOperator: "===" },
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "!==" },
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "!==" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 20,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "!==" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 15,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "!==" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 17,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 22,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 32,
					endLine: 1,
					endColumn: 49,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
			code: "(foo) == null",
			errors: [
				{
					messageId: "unexpected",
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 18,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "!==" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 19,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "!==" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 19,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 45,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "!==" },
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 37,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "!==" },
							output: "const undefined = 0; if (foo !== null) { }",
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 28,
					endLine: 1,
					endColumn: 39,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "!==" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "!==" },
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
					data: { expectedOperator: "!==" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "!==" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "!==" },
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "!==" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 26,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
					data: { expectedOperator: "===" },
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 10,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator: "===" },
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
	],
});
