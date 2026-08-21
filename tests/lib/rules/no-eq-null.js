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
	valid: ["if (x === null) { }", "if (null === f()) { }"],
	invalid: [
		{
			code: "if (x == null) { }",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "if (x != null) { }",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "do {} while (null == x)",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
	],
	fatal: [
		{
			name: "options provided when schema allows none",
			options: [1],
			error: { name: "SchemaValidationError" },
		},
	],
});
