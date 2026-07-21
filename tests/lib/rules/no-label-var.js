/**
 * @fileoverview Tests for no-label-var rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-label-var"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-label-var", rule, {
	valid: [
		"function bar() { q: for(;;) { break q; } } function foo () { var q = t; }",
		"function bar() { var x = foo; q: for(;;) { break q; } }",
	],
	invalid: [
		{
			code: "var x = foo; function bar() { x: for(;;) { break x; } }",
			errors: [
				{
					messageId: "identifierClashWithLabel",
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 54,
				},
			],
		},
		{
			code: "function bar() { var x = foo; x: for(;;) { break x; } }",
			errors: [
				{
					messageId: "identifierClashWithLabel",
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 54,
				},
			],
		},
		{
			code: "function bar(x) { x: for(;;) { break x; } }",
			errors: [
				{
					messageId: "identifierClashWithLabel",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 42,
				},
			],
		},
	],
});
