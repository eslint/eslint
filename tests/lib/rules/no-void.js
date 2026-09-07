/**
 * @fileoverview Rule to disallow use of void operator.
 * @author Mike Sidorov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-void");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		sourceType: "script",
	},
});

ruleTester.run("no-void", rule, {
	valid: [
		"var foo = bar()",
		"foo.void()",
		"foo.void = bar",
		"delete foo;",
		{
			code: "void 0",
			options: [{ allowAsStatement: true }],
		},
		{
			code: "void(0)",
			options: [{ allowAsStatement: true }],
		},
	],

	invalid: [
		{
			code: "void 0",
			errors: [
				{
					messageId: "noVoid",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "void 0",
			options: [{}],
			errors: [
				{
					messageId: "noVoid",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "void 0",
			options: [{ allowAsStatement: false }],
			errors: [
				{
					messageId: "noVoid",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "void(0)",
			errors: [
				{
					messageId: "noVoid",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "var foo = void 0",
			errors: [
				{
					messageId: "noVoid",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "var foo = void 0",
			options: [{ allowAsStatement: true }],
			errors: [
				{
					messageId: "noVoid",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
	],
});
