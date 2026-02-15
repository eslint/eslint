/**
 * @fileoverview Warn when using template string syntax in regular strings.
 * @author Jeroen Engels
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-template-curly-in-string"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const messageId = "unexpectedTemplateExpression";

ruleTester.run("no-template-curly-in-string", rule, {
	valid: [
		"`Hello, ${name}`;",
		"templateFunction`Hello, ${name}`;",
		"`Hello, name`;",
		"'Hello, name';",
		"'Hello, ' + name;",
		"`Hello, ${index + 1}`",
		'`Hello, ${name + " foo"}`',
		'`Hello, ${name || "foo"}`',
		'`Hello, ${{foo: "bar"}.foo}`',
		"'$2'",
		"'${'",
		"'$}'",
		"'{foo}'",
		"'{foo: \"bar\"}'",
		"const number = 3",
	],
	invalid: [
		{
			code: "'Hello, ${name}'",
			errors: [
				{
					messageId,
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: '"Hello, ${name}"',
			errors: [
				{
					messageId,
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "'${greeting}, ${name}'",
			errors: [
				{
					messageId,
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "'Hello, ${index + 1}'",
			errors: [
				{
					messageId,
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "'Hello, ${name + \" foo\"}'",
			errors: [
				{
					messageId,
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "'Hello, ${name || \"foo\"}'",
			errors: [
				{
					messageId,
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "'Hello, ${{foo: \"bar\"}.foo}'",
			errors: [
				{
					messageId,
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 29,
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
