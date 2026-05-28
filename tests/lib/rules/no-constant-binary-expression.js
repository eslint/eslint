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
	],
	invalid: [
		// Error messages
		{
			code: "[] && greeting",
			errors: [
				{
					message:
						"Unexpected constant truthiness on the left-hand side of a `&&` expression.",
				},
			],
		},
		{
			code: "[] || greeting",
			errors: [
				{
					message:
						"Unexpected constant truthiness on the left-hand side of a `||` expression.",
				},
			],
		},
		{
			code: "[] ?? greeting",
			errors: [
				{
					message:
						"Unexpected constant nullishness on the left-hand side of a `??` expression.",
				},
			],
		},
		{
			code: "[] == true",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the right-hand side of the `==`.",
				},
			],
		},
		{
			code: "true == []",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the left-hand side of the `==`.",
				},
			],
		},
		{
			code: "[] != true",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the right-hand side of the `!=`.",
				},
			],
		},
		{
			code: "[] === true",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the right-hand side of the `===`.",
				},
			],
		},
		{
			code: "[] !== true",
			errors: [
				{
					message:
						"Unexpected constant binary expression. Compares constantly with the right-hand side of the `!==`.",
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
				},
			],
		},
		{
			code: "!foo ?? bar",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a + b) / 2 ?? bar",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "String(foo.bar) ?? baz",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: '"hello" + name ?? ""',
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: '[foo?.bar ?? ""] ?? []',
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
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
				},
			],
		},
		{
			code: "true || hello",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "||" },
				},
			],
		},
		{
			code: "true && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "'' && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "100 && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "+100 && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "-100 && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "~100 && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "/[a-z]/ && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "Boolean([]) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "Boolean() && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "Boolean([], n) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "({}) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "[] && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "(() => {}) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "(function() {}) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "(class {}) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "(class { valueOf() { return x; } }) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "(class { [x]() { return x; } }) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "new Foo() && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
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
				},
			],
		},
		{
			code: "(bar = false) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "(bar.baz = false) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "(bar[0] = false) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "`hello ${hello}` && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "void bar && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "!true && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "typeof bar && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "(bar, baz, true) && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
				},
			],
		},
		{
			code: "undefined && foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "truthiness", operator: "&&" },
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
				},
			],
		},
		{
			code: "([]) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(() => {}) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(function() {}) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(class {}) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "new Foo() ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "1 ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "/[a-z]/ ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "`${''}` ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a = true) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a += 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a -= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a *= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a /= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a %= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a <<= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a >>= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a >>>= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a |= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a ^= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(a &= 1) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "undefined ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "!bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "void bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "typeof bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "+bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "-bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "~bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "++bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "bar++ ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "--bar ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "bar-- ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(x == y) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(x + y) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(x / y) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(x instanceof String) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "(x in y) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "Boolean(x) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "String(x) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
				},
			],
		},
		{
			code: "Number(x) ?? foo",
			errors: [
				{
					messageId: "constantShortCircuit",
					data: { property: "nullishness", operator: "??" },
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
				},
			],
		},
		{
			code: "({}) == null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "null == ({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
				},
			],
		},
		{
			code: "({}) == undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "undefined == ({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
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
				},
			],
		},
		{
			code: "({}) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "([]) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "([a, b]) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "(() => {}) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "(function() {}) == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "void foo == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
				},
			],
		},
		{
			code: "typeof foo == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "![] == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
				},
			],
		},
		{
			code: "true == class {}",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
				},
			],
		},
		{
			code: "true == 1",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
				},
			],
		},
		{
			code: "undefined == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
				},
			],
		},
		{
			code: "true == undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
				},
			],
		},
		{
			code: "`hello` == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "/[a-z]/ == true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "({}) == Boolean({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "({}) == Boolean()",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "({}) == Boolean(() => {}, foo)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
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
				},
			],
		},
		{
			code: "({}) == !({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "==" },
				},
			],
		},
		{
			code: "({}) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "([]) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(function() {}) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(() => {}) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "!{} === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "typeof n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "void n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "+n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "-n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "~n === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "true === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "1 === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "'hello' === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "/[a-z]/ === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "undefined === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "(a = {}) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a += 1) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a -= 1) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a *= 1) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a %= 1) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a ** b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a << b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a >> b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a >>> b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "--a === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "a-- === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "++a === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "a++ === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a + b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a - b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a * b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a / b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a % b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a | b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a ^ b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a & b) === true",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "Boolean(0) === Boolean(1)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "true === String(x)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "true === Number(x)",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "Boolean(0) == !({})",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "==" },
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
				},
			],
		},
		{
			code: "({}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "([]) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(() => {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(function() {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(class {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "new Foo() === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "`` === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "1 === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "'hello' === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "/[a-z]/ === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "true === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "null === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "a++ === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "++a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "--a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "a-- === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "!a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "typeof a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "delete a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "void a === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "undefined === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "(x = {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(x += y) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(x -= y) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a, b, {}) === null",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
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
				},
			],
		},
		{
			code: "({}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "([]) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(() => {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(function() {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(class {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "new Foo() === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "`` === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "1 === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "'hello' === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "/[a-z]/ === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "true === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "null === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "a++ === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "++a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "--a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "a-- === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "!a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "typeof a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "delete a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "void a === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "undefined === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "left", operator: "===" },
				},
			],
		},
		{
			code: "(x = {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(x += y) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(x -= y) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},
		{
			code: "(a, b, {}) === undefined",
			errors: [
				{
					messageId: "constantBinaryOperand",
					data: { otherSide: "right", operator: "===" },
				},
			],
		},

		/*
		 * If both sides are newly constructed objects, we can tell they will
		 * never be equal, even with == equality.
		 */
		{ code: "[a] == [a]", errors: [{ messageId: "bothAlwaysNew" }] },
		{ code: "[a] != [a]", errors: [{ messageId: "bothAlwaysNew" }] },
		{ code: "({}) == []", errors: [{ messageId: "bothAlwaysNew" }] },

		// Comparing to always new objects
		{ code: "x === {}", errors: [{ messageId: "alwaysNew" }] },
		{ code: "x !== {}", errors: [{ messageId: "alwaysNew" }] },
		{ code: "x === []", errors: [{ messageId: "alwaysNew" }] },
		{ code: "x === (() => {})", errors: [{ messageId: "alwaysNew" }] },
		{ code: "x === (function() {})", errors: [{ messageId: "alwaysNew" }] },
		{ code: "x === (class {})", errors: [{ messageId: "alwaysNew" }] },
		{ code: "x === new Boolean()", errors: [{ messageId: "alwaysNew" }] },
		{
			code: "x === new Promise()",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "alwaysNew" }],
		},
		{
			code: "x === new WeakSet()",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "alwaysNew" }],
		},
		{ code: "x === (foo, {})", errors: [{ messageId: "alwaysNew" }] },
		{ code: "x === (y = {})", errors: [{ messageId: "alwaysNew" }] },
		{ code: "x === (y ? {} : [])", errors: [{ messageId: "alwaysNew" }] },
		{ code: "x === /[a-z]/", errors: [{ messageId: "alwaysNew" }] },

		// It's not obvious what this does, but it compares the old value of `x` to the new object.
		{ code: "x === (x = {})", errors: [{ messageId: "alwaysNew" }] },

		{
			code: "window.abc && false && anything",
			errors: [{ messageId: "constantShortCircuit" }],
		},
		{
			code: "window.abc || true || anything",
			errors: [{ messageId: "constantShortCircuit" }],
		},
		{
			code: "window.abc ?? 'non-nullish' ?? anything",
			errors: [{ messageId: "constantShortCircuit" }],
		},
	],
});
