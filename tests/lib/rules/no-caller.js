/**
 * @fileoverview Tests for no-caller rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-caller"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-caller", rule, {
	valid: [
		"var x = arguments.length",
		"var x = arguments",
		"var x = arguments[0]",
		"var x = arguments[caller]",
	],
	invalid: [
		{
			code: "var x = arguments.callee",
			errors: [
				{
					messageId: "unexpected",
					data: { prop: "callee" },
				},
			],
		},
		{
			code: "var x = arguments.caller",
			errors: [
				{
					messageId: "unexpected",
					data: { prop: "caller" },
				},
			],
		},
	],
	fatal: [
		{
			name: "options provided when schema allows none",
			code: "var x = 1;",
			options: [1],
			error: { name: "SchemaValidationError" },
		},
	],
});
