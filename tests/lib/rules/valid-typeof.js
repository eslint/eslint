/**
 * @fileoverview Ensures that the results of typeof are compared against a valid string
 * @author Ian Christian Myers
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/valid-typeof"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("valid-typeof", rule, {
	valid: [
		"typeof foo === 'string'",
		"typeof foo === 'object'",
		"typeof foo === 'function'",
		"typeof foo === 'undefined'",
		"typeof foo === 'boolean'",
		"typeof foo === 'number'",
		"typeof foo === 'bigint'",
		"'string' === typeof foo",
		"'object' === typeof foo",
		"'function' === typeof foo",
		"'undefined' === typeof foo",
		"'boolean' === typeof foo",
		"'number' === typeof foo",
		"typeof foo === typeof bar",
		"typeof foo === baz",
		"typeof foo !== someType",
		"typeof bar != someType",
		"someType === typeof bar",
		"someType == typeof bar",
		"typeof foo == 'string'",
		"typeof(foo) === 'string'",
		"typeof(foo) !== 'string'",
		"typeof(foo) == 'string'",
		"typeof(foo) != 'string'",
		"var oddUse = typeof foo + 'thing'",
		"function f(undefined) { typeof x === undefined }",
		{
			code: "typeof foo === 'number'",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: 'typeof foo === "number"',
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "var baz = typeof foo + 'thing'",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === typeof bar",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === `string`",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`object` === typeof foo",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "typeof foo === `str${somethingElse}`",
			languageOptions: { ecmaVersion: 6 },
		},
	],

	invalid: [
		{
			code: "typeof foo === 'strnig'",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "'strnig' === typeof foo",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "if (typeof bar === 'umdefined') {}",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "typeof foo !== 'strnig'",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "'strnig' !== typeof foo",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "if (typeof bar !== 'umdefined') {}",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "typeof foo != 'strnig'",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "'strnig' != typeof foo",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "if (typeof bar != 'umdefined') {}",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "typeof foo == 'strnig'",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "'strnig' == typeof foo",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "if (typeof bar == 'umdefined') {}",
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "if (typeof bar === `umdefined`) {}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "typeof foo == 'invalid string'",
			options: [{ requireStringLiterals: true }],
			errors: [
				{
					messageId: "invalidValue",
				},
			],
		},
		{
			code: "if (typeof bar !== undefined) {}",
			errors: [
				{
					messageId: "invalidValue",
					suggestions: [
						{
							messageId: "suggestString",
							data: { type: "undefined" },
							output: 'if (typeof bar !== "undefined") {}',
						},
					],
				},
			],
		},
		{
			code: "typeof foo == Object",
			options: [{ requireStringLiterals: true }],
			errors: [
				{
					messageId: "notString",
				},
			],
		},
		{
			code: "typeof foo === undefined",
			options: [{ requireStringLiterals: true }],
			errors: [
				{
					messageId: "notString",
					suggestions: [
						{
							messageId: "suggestString",
							data: { type: "undefined" },
							output: 'typeof foo === "undefined"',
						},
					],
				},
			],
		},
		{
			code: "undefined === typeof foo",
			options: [{ requireStringLiterals: true }],
			errors: [
				{
					messageId: "notString",
					suggestions: [
						{
							messageId: "suggestString",
							data: { type: "undefined" },
							output: '"undefined" === typeof foo',
						},
					],
				},
			],
		},
		{
			code: "undefined == typeof foo",
			options: [{ requireStringLiterals: true }],
			errors: [
				{
					messageId: "notString",
					suggestions: [
						{
							messageId: "suggestString",
							data: { type: "undefined" },
							output: '"undefined" == typeof foo',
						},
					],
				},
			],
		},
		{
			code: "typeof foo === `undefined${foo}`",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notString",
				},
			],
		},
		{
			code: "typeof foo === `${string}`",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notString",
				},
			],
		},
	],
	fatal: [
		{
			name: "first option wrong type (number)",
			code: "var x = 1;",
			options: [123],
			error: { name: "SchemaValidationError" },
		},
	],
});
