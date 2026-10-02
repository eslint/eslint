/**
 * @fileoverview Tests for require-yield rule
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-yield");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 6 } });

ruleTester.run("require-yield", rule, {
	valid: [
		"function foo() { return 0; }",
		"function* foo() { yield 0; }",
		"function* foo() { }",
		"(function* foo() { yield 0; })();",
		"(function* foo() { })();",
		"var obj = { *foo() { yield 0; } };",
		"var obj = { *foo() { } };",
		"class A { *foo() { yield 0; } };",
		"class A { *foo() { } };",
	],
	invalid: [
		{
			code: "function* foo() { return 0; }",
			errors: [
				{
					messageId: "missingYield",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "(function* foo() { return 0; })();",
			errors: [
				{
					messageId: "missingYield",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "var obj = { *foo() { return 0; } }",
			errors: [
				{
					messageId: "missingYield",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "class A { *foo() { return 0; } }",
			errors: [
				{
					messageId: "missingYield",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "function* foo() { function* bar() { yield 0; } }",
			errors: [
				{
					messageId: "missingYield",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "function* foo() { function* bar() { return 0; } yield 0; }",
			errors: [
				{
					messageId: "missingYield",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 32,
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
