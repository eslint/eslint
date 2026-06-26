/**
 * @fileoverview The rule should warn against code that tries to compare against -0.
 * @author Aladdin-ADD<hh_2013@foxmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-compare-neg-zero");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-compare-neg-zero", rule, {
	valid: [
		"x === 0",
		"0 === x",
		"x == 0",
		"0 == x",
		"x === '0'",
		"'0' === x",
		"x == '0'",
		"'0' == x",
		"x === '-0'",
		"'-0' === x",
		"x == '-0'",
		"'-0' == x",
		"x === -1",
		"-1 === x",
		"x < 0",
		"0 < x",
		"x <= 0",
		"0 <= x",
		"x > 0",
		"0 > x",
		"x >= 0",
		"0 >= x",
		"x != 0",
		"0 != x",
		"x !== 0",
		"0 !== x",
		"Object.is(x, -0)",
	],

	invalid: [
		{
			code: "x === -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "===" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "x === 0",
						},
						{
							messageId: "suggestObjectIs",
							output: "Object.is(x, -0)",
						},
					],
				},
			],
		},
		{
			code: "-0 === x",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "===" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "0 === x",
						},
						{
							messageId: "suggestObjectIs",
							output: "Object.is(-0, x)",
						},
					],
				},
			],
		},
		{
			code: "x !== -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "!==" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "x !== 0",
						},
						{
							messageId: "suggestNotObjectIs",
							output: "!Object.is(x, -0)",
						},
					],
				},
			],
		},
		{
			code: "-0 !== x",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "!==" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "0 !== x",
						},
						{
							messageId: "suggestNotObjectIs",
							output: "!Object.is(-0, x)",
						},
					],
				},
			],
		},
		{
			code: "x == -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "==" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "x == 0",
						},
					],
				},
			],
		},
		{
			code: "-0 == x",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "==" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "0 == x",
						},
					],
				},
			],
		},
		{
			code: "x != -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "!=" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "x != 0",
						},
					],
				},
			],
		},
		{
			code: "-0 != x",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "!=" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "0 != x",
						},
					],
				},
			],
		},
		{
			code: "x > -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: ">" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "x > 0",
						},
					],
				},
			],
		},
		{
			code: "-0 > x",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: ">" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "0 > x",
						},
					],
				},
			],
		},
		{
			code: "x >= -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: ">=" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "x >= 0",
						},
					],
				},
			],
		},
		{
			code: "-0 >= x",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: ">=" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "0 >= x",
						},
					],
				},
			],
		},
		{
			code: "x < -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "<" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "x < 0",
						},
					],
				},
			],
		},
		{
			code: "-0 < x",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "<" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "0 < x",
						},
					],
				},
			],
		},
		{
			code: "x <= -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "<=" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "x <= 0",
						},
					],
				},
			],
		},
		{
			code: "-0 <= x",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "<=" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "0 <= x",
						},
					],
				},
			],
		},

		{
			code: "(a + b) === -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "===" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "(a + b) === 0",
						},
						{
							messageId: "suggestObjectIs",
							output: "Object.is(a + b, -0)",
						},
					],
				},
			],
		},

		{
			code: "if (x !== -0) {}",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "!==" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "if (x !== 0) {}",
						},
						{
							messageId: "suggestNotObjectIs",
							output: "if (!Object.is(x, -0)) {}",
						},
					],
				},
			],
		},

		// the Object.is suggestion is skipped when the node has comments
		{
			code: "x === /* keep */ -0",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "===" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "x === /* keep */ 0",
						},
					],
				},
			],
		},

		// `Object` is shadowed: only the remove-minus suggestion is offered
		{
			code: "function f(Object) { return x === -0; }",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "===" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "function f(Object) { return x === 0; }",
						},
					],
				},
			],
		},
		{
			code: "function f(Object) { return x !== -0; }",
			errors: [
				{
					messageId: "unexpected",
					data: { operator: "!==" },
					suggestions: [
						{
							messageId: "suggestRemoveMinus",
							output: "function f(Object) { return x !== 0; }",
						},
					],
				},
			],
		},
	],
});
