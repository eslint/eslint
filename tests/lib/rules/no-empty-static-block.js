/**
 * @fileoverview Tests for no-empty-static-block rule.
 * @author Sosuke Suzuki
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-static-block"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 2022 },
});

ruleTester.run("no-empty-static-block", rule, {
	valid: [
		"class Foo { static { bar(); } }",
		"class Foo { static { /* comments */ } }",
		"class Foo { static {\n// comment\n} }",
		"class Foo { static { bar(); } static { bar(); } }",
	],
	invalid: [
		{
			code: "class Foo { static {} }",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 22,
					suggestions: [
						{
							messageId: "suggestComment",
							output: "class Foo { static { /* empty */ } }",
						},
					],
				},
			],
		},
		{
			code: "class Foo { static { } }",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 23,
					suggestions: [
						{
							messageId: "suggestComment",
							output: "class Foo { static { /* empty */ } }",
						},
					],
				},
			],
		},
		{
			code: "class Foo { static { \n\n } }",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 20,
					endLine: 3,
					endColumn: 3,
					suggestions: [
						{
							messageId: "suggestComment",
							output: "class Foo { static { /* empty */ } }",
						},
					],
				},
			],
		},
		{
			code: "class Foo { static { bar(); } static {} }",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 40,
					suggestions: [
						{
							messageId: "suggestComment",
							output: "class Foo { static { bar(); } static { /* empty */ } }",
						},
					],
				},
			],
		},
		{
			code: "class Foo { static // comment\n {} }",
			errors: [
				{
					messageId: "unexpected",
					line: 2,
					column: 2,
					endLine: 2,
					endColumn: 4,
					suggestions: [
						{
							messageId: "suggestComment",
							output: "class Foo { static // comment\n { /* empty */ } }",
						},
					],
				},
			],
		},
		{
			code: "class Foo { static /* empty */ {} /* empty */ }",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 32,
					endLine: 1,
					endColumn: 34,
					suggestions: [
						{
							messageId: "suggestComment",
							output: "class Foo { static /* empty */ { /* empty */ } /* empty */ }",
						},
					],
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
