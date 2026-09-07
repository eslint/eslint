/**
 * @fileoverview Tests for no-constant-binary-expression rule.
 * @author Jordan Eldredge <https://jordaneldredge.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-constant-binary-expression");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 2021,
		sourceType: "script",
		parserOptions: {
			ecmaFeatures: { jsx: true },
		},
	},
});

ruleTester.run("no-constant-binary-expression", rule, {
	valid: [
		// While this _would_ be a constant condition in React, ESLint has a policy of not attributing any specific behavior to JSX.
		"<p /> && foo",
		"<></> && foo",
		"<p /> ?? foo",
		"<></> ?? foo",
		"arbitraryFunction(n) ?? foo",
		"foo.Boolean(n) ?? foo",
		"(x += 1) && foo",
		"`${bar}` && foo",
		"bar && foo",
		"delete bar.baz && foo",
		"true ? foo : bar", // We leave ConditionalExpression for `no-constant-condition`.
		"new Foo() == true",
		"foo == true",
		"`${foo}` == true",
		"`${foo}${bar}` == true",
		"`0${foo}` == true",
		"`00000000${foo}` == true",
		"`0${foo}.000` == true",
		"[n] == true",

		"delete bar.baz === true",

		"foo.Boolean(true) && foo",
		"function Boolean(n) { return n; }; Boolean(x) ?? foo",
		"function String(n) { return n; }; String(x) ?? foo",
		"function Number(n) { return n; }; Number(x) ?? foo",
		"function Symbol(n) { return n; }; Symbol(x) ?? foo",
		"function BigInt(n) { return n; }; BigInt(x) ?? foo",
		"function Boolean(n) { return Math.random(); }; Boolean(x) === 1",
		"function Boolean(n) { return Math.random(); }; Boolean(1) == true",

		"new Foo() === x",
		"x === new someObj.Promise()",
		"Boolean(foo) === true",
		"function foo(undefined) { undefined ?? bar;}",
		"function foo(undefined) { undefined == true;}",
		"function foo(undefined) { undefined === true;}",
		"[...arr, 1] == true",
		"[,,,] == true",
		{
			code: "new Foo() === bar;",
			languageOptions: { globals: { Foo: "writable" } },
		},
		"(foo && true) ?? bar",
		"foo ?? null ?? bar",
		"a ?? (doSomething(), undefined) ?? b",
		"a ?? (something = null) ?? b",
		"5 < 10",
		"5 <= 10",
		"10 > 5",
		"10 >= 5",
		"'a' < 'b'",
		"undefined >= 5",
		"`` < ``",
		"1n < 2n",
		"null >= 5",
		{
			code: "5 < 10",
			options: [{ checkRelationalComparisons: false }],
		},
		{
			code: "x < 5",
			options: [{ checkRelationalComparisons: true }],
		},
		{
			code: "5 < x",
			options: [{ checkRelationalComparisons: true }],
		},
		{
			code: "x > y",
			options: [{ checkRelationalComparisons: true }],
		},
		{
			code: "x >= undefined",
			options: [{ checkRelationalComparisons: true }],
		},
		{
			code: "`${x}` < 5",
			options: [{ checkRelationalComparisons: true }],
		},
		{
			code: "5 > `${x}`",
			options: [{ checkRelationalComparisons: true }],
		},
		{
			code: "~x < 10",
			options: [{ checkRelationalComparisons: true }],
		},
		{
			code: "-x >= 5",
			options: [{ checkRelationalComparisons: true }],
		},
		{
			code: "x < /a/",
			options: [{ checkRelationalComparisons: true }],
		},
		{
			code: "/a/ >= x",
			options: [{ checkRelationalComparisons: true }],
		},
	],
	invalid: [
		// Error messages
		{
			code: "[] && greeting",
			errors: [
				{
					message:
						"Unexpected constant truthiness on the left-hand side of a `&&` expression.",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "[] || greeting",
			errors: [
				{
					message:
						"Unexpected constant truthiness on the left-hand side of a `||` expression.",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "[] ?? greeting",
			errors: [
				{
					message:
						"Unexpected constant nullishness on the left-hand side of a `??` expression.",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "[] == true",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the right-hand side of the `==`.",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "true == []",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the left-hand side of the `==`.",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "[] != true",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the right-hand side of the `!=`.",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "[] === true",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the right-hand side of the `===`.",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "[] !== true",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the right-hand side of the `!==`.",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},

		// Motivating examples from the original proposal https://github.com/eslint/eslint/issues/13752
		{
			code: "!foo == null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "!foo ?? bar",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "(a + b) / 2 ?? bar",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "String(foo.bar) ?? baz",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: '"hello" + name ?? ""',
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: '[foo?.bar ?? ""] ?? []',
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 17,
				},
			],
		},

		// Logical expression with constant truthiness
		{
			code: "true && hello",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "true || hello",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "||" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "true && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "'' && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "100 && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "+100 && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "-100 && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "~100 && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "/[a-z]/ && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "Boolean([]) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "Boolean() && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "Boolean([], n) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "({}) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "[] && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "(() => {}) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "(function() {}) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "(class {}) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "(class { valueOf() { return x; } }) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: "(class { [x]() { return x; } }) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "new Foo() && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},

		// (boxed values are always truthy)
		{
			code: "new Boolean(unknown) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "(bar = false) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "(bar.baz = false) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "(bar[0] = false) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "`hello ${hello}` && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "void bar && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "!true && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "typeof bar && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "(bar, baz, true) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "undefined && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},

		// Logical expression with constant nullishness
		{
			code: "({}) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "([]) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "(() => {}) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "(function() {}) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "(class {}) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "new Foo() ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "1 ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 2,
				},
			],
		},
		{
			code: "/[a-z]/ ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "`${''}` ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a = true) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "(a += 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a -= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a *= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a /= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a %= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a <<= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "(a >>= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "(a >>>= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "(a |= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a ^= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a &= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "undefined ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "!bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "void bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "typeof bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "+bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "-bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "~bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "++bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "bar++ ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "--bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "bar-- ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "(x == y) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(x + y) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(x / y) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(x instanceof String) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "(x in y) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "Boolean(x) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "String(x) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "Number(x) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "Symbol(x) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "BigInt(x) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},

		// Binary expression with comparison to null
		{
			code: "({}) != null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "!=" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({}) == null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "null == ({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "({}) == undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "undefined == ({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "Symbol(x) != null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "!=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "Symbol(x) != undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "!=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "BigInt(x) != null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "!=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "BigInt(x) != undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "!=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},

		// Binary expression with loose comparison to boolean
		{
			code: "({}) != true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "!=" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({}) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "([]) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "([a, b]) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(() => {}) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "(function() {}) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "void foo == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "typeof foo == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "![] == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "true == class {}",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "true == 1",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "undefined == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "true == undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "`hello` == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "/[a-z]/ == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "({}) == Boolean({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({}) == Boolean()",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({}) == Boolean(() => {}, foo)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},

		// Binary expression with strict comparison to boolean
		{
			code: "({}) !== true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "!==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({}) == !({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({}) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "([]) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "(function() {}) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "(() => {}) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "!{} === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "typeof n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "void n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "+n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "-n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "~n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "true === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "1 === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 2,
				},
			],
		},
		{
			code: "'hello' === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "/[a-z]/ === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "undefined === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "(a = {}) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a += 1) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a -= 1) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a *= 1) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a %= 1) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a ** b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a << b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a >> b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a >>> b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "--a === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "a-- === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "++a === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "a++ === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "(a + b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(a - b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(a * b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(a / b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(a % b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(a | b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(a ^ b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(a & b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "Boolean(0) === Boolean(1)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "true === String(x)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "true === Number(x)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "true === Symbol(x)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "true === BigInt(x)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "Boolean(0) == !({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 20,
				},
			],
		},

		// Binary expression with strict comparison to null
		{
			code: "({}) !== null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "!==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "([]) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "(() => {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "(function() {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "(class {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "new Foo() === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "`` === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "1 === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 2,
				},
			],
		},
		{
			code: "'hello' === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "/[a-z]/ === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "true === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "null === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "a++ === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "++a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "--a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "a-- === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "!a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "typeof a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "delete a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "void a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "undefined === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "(x = {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(x += y) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(x -= y) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a, b, {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "Symbol(x) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "BigInt(x) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},

		// Binary expression with strict comparison to undefined
		{
			code: "({}) !== undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "!==" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "([]) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "(() => {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "(function() {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "(class {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "new Foo() === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "`` === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "1 === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 2,
				},
			],
		},
		{
			code: "'hello' === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "/[a-z]/ === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "true === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "null === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "a++ === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "++a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "--a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "a-- === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "!a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
		{
			code: "typeof a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "delete a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "void a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "undefined === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "(x = {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(x += y) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(x -= y) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "(a, b, {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "Symbol(x) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "BigInt(x) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},

		/*
		 * If both sides are newly constructed objects, we can tell they will
		 * never be equal, even with == equality.
		 */
		{
			code: "[a] == [a]",
			errors: [
				{
					messageId: "bothAlwaysNew",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "[a] != [a]",
			errors: [
				{
					messageId: "bothAlwaysNew",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "({}) == []",
			errors: [
				{
					messageId: "bothAlwaysNew",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},

		// Comparing to always new objects
		{
			code: "x === {}",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "x !== {}",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "x === []",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "x === (() => {})",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "x === (function() {})",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "x === (class {})",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "x === new Boolean()",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "x === new Promise()",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "x === new WeakSet()",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "x === (foo, {})",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "x === (y = {})",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "x === (y ? {} : [])",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "x === /[a-z]/",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 14,
				},
			],
		},

		// It's not obvious what this does, but it compares the old value of `x` to the new object.
		{
			code: "x === (x = {})",
			errors: [
				{
					messageId: "alwaysNew",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 14,
				},
			],
		},

		{
			code: "window.abc && false && anything",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "window.abc || true || anything",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "||" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "window.abc ?? 'non-nullish' ?? anything",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "5 < 10",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "5 <= 10",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "10 > 5",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: ">" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "10 >= 5",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: ">=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "'a' < 'b'",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "true >= false",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: ">=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "undefined < 5",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "5 > undefined",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: ">" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "`` < ``",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "`` >= 5",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: ">=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "`foo` < `bar`",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "1n < 2n",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "null >= 5",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: ">=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "-5 < 10",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "10 >= +5",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: ">=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "~5 <= 10",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "~1 > ~2",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: ">" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "/a/ < /b/",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: "<" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "/a/ >= /b/",
			options: [{ checkRelationalComparisons: true }],
			errors: [
				{
					messageId: "constantRelationalComparison",
					data: { operator: ">=" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
	],
});
