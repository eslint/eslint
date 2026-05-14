/**
 * @fileoverview Tests for no-ternary.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-ternary"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-ternary", rule, {
	valid: ['"x ? y";'],
	invalid: [
		{
			code: "var foo = true ? thing : stuff;",
			errors: [
				{
					messageId: "noTernaryOperator",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "true ? thing() : stuff();",
			errors: [
				{
					messageId: "noTernaryOperator",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "function foo(bar) { return bar ? baz : qux; }",
			errors: [
				{
					messageId: "noTernaryOperator",
					line: 1,
					column: 28,
					endLine: 1,
					endColumn: 43,
				},
			],
		},
	],
});
