/**
 * @fileoverview Tests for eqeqeq rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/eqeqeq"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const wantedEqEqEq = { expectedOperator: "===", actualOperator: "==" };
const wantedNotEqEq = { expectedOperator: "!==", actualOperator: "!=" };
const wantedEqEq = { expectedOperator: "==", actualOperator: "===" };
const wantedNotEq = { expectedOperator: "!=", actualOperator: "!==" };

ruleTester.run("eqeqeq", rule, {
	valid: [
		"a === b",
		"a !== b",
		{ code: "a === b", options: ["always"] },
		{ code: "typeof a == 'number'", options: ["smart"] },
		{ code: "'string' != typeof a", options: ["smart"] },
		{ code: "'hello' != 'world'", options: ["smart"] },
		{ code: "2 == 3", options: ["smart"] },
		{ code: "true == true", options: ["smart"] },
		{ code: "null == a", options: ["smart"] },
		{ code: "a == null", options: ["smart"] },
		{ code: "null == a", options: ["allow-null"] },
		{ code: "a == null", options: ["allow-null"] },
		{ code: "a == null", options: ["always", { null: "ignore" }] },
		{ code: "a != null", options: ["always", { null: "ignore" }] },
		{ code: "a !== null", options: ["always", { null: "ignore" }] },
		{ code: "a === null", options: ["always", { null: "always" }] },
		{ code: "a !== null", options: ["always", { null: "always" }] },
		{ code: "null === null", options: ["always", { null: "always" }] },
		{ code: "null !== null", options: ["always", { null: "always" }] },
		{ code: "a == null", options: ["always", { null: "never" }] },
		{ code: "a != null", options: ["always", { null: "never" }] },
		{ code: "null == null", options: ["always", { null: "never" }] },
		{ code: "null != null", options: ["always", { null: "never" }] },

		// https://github.com/eslint/eslint/issues/8020
		{
			code: "foo === /abc/u",
			options: ["always", { null: "never" }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// bigint
		{
			code: "foo === 1n",
			options: ["always", { null: "never" }],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
	invalid: [
		{
			code: "a == b",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === b",
						},
					],
				},
			],
		},
		{
			code: "a != b",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "a !== b",
						},
					],
				},
			],
		},
		{
			code: "typeof a == 'number'",
			output: "typeof a === 'number'",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
				},
			],
		},
		{
			code: "typeof a == 'number'",
			output: "typeof a === 'number'",
			options: ["always"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
				},
			],
		},
		{
			code: "'string' != typeof a",
			output: "'string' !== typeof a",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
				},
			],
		},
		{
			code: "true == true",
			output: "true === true",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
				},
			],
		},
		{
			code: "2 == 3",
			output: "2 === 3",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
				},
			],
		},
		{
			code: "2 == 3",
			output: "2 === 3",
			options: ["always"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
				},
			],
		},
		{
			code: "'hello' != 'world'",
			output: "'hello' !== 'world'",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
				},
			],
		},
		{
			code: "'hello' != 'world'",
			output: "'hello' !== 'world'",
			options: ["always"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
				},
			],
		},
		{
			code: "a == null",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === null",
						},
					],
				},
			],
		},
		{
			code: "a == null",
			options: ["always"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === null",
						},
					],
				},
			],
		},
		{
			code: "null != a",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "null !== a",
						},
					],
				},
			],
		},
		{
			code: "true == 1",
			options: ["smart"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "true === 1",
						},
					],
				},
			],
		},
		{
			code: "0 != '1'",
			options: ["smart"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "0 !== '1'",
						},
					],
				},
			],
		},
		{
			code: "'wee' == /wee/",
			options: ["smart"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "'wee' === /wee/",
						},
					],
				},
			],
		},
		{
			code: "typeof a == 'number'",
			output: "typeof a === 'number'",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
				},
			],
		},
		{
			code: "'string' != typeof a",
			output: "'string' !== typeof a",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
				},
			],
		},
		{
			code: "'hello' != 'world'",
			output: "'hello' !== 'world'",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
				},
			],
		},
		{
			code: "2 == 3",
			output: "2 === 3",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
				},
			],
		},
		{
			code: "true == true",
			output: "true === true",
			options: ["allow-null"],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
				},
			],
		},
		{
			code: "true == null",
			options: ["always", { null: "always" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "true === null",
						},
					],
				},
			],
		},
		{
			code: "true != null",
			options: ["always", { null: "always" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "true !== null",
						},
					],
				},
			],
		},
		{
			code: "null == null",
			output: "null === null",
			options: ["always", { null: "always" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
				},
			],
		},
		{
			code: "null != null",
			output: "null !== null",
			options: ["always", { null: "always" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
				},
			],
		},
		{
			code: "true === null",
			options: ["always", { null: "never" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEq,
							output: "true == null",
						},
					],
				},
			],
		},
		{
			code: "true !== null",
			options: ["always", { null: "never" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEq,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEq,
							output: "true != null",
						},
					],
				},
			],
		},
		{
			code: "null === null",
			output: "null == null",
			options: ["always", { null: "never" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEq,
				},
			],
		},
		{
			code: "null !== null",
			output: "null != null",
			options: ["always", { null: "never" }],
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEq,
				},
			],
		},
		{
			code: "a\n==\nb",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 2,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a\n===\nb",
						},
					],
				},
			],
		},
		{
			code: "(a) == b",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a) === b",
						},
					],
				},
			],
		},
		{
			code: "(a) != b",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a) !== b",
						},
					],
				},
			],
		},
		{
			code: "a == (b)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === (b)",
						},
					],
				},
			],
		},
		{
			code: "a != (b)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "a !== (b)",
						},
					],
				},
			],
		},
		{
			code: "(a) == (b)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a) === (b)",
						},
					],
				},
			],
		},
		{
			code: "(a) != (b)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a) !== (b)",
						},
					],
				},
			],
		},
		{
			code: "(a == b) == (c)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a === b) == (c)",
						},
					],
				},
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a == b) === (c)",
						},
					],
				},
			],
		},
		{
			code: "(a != b) != (c)",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a !== b) != (c)",
						},
					],
				},
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					line: 1,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a != b) !== (c)",
						},
					],
				},
			],
		},

		// location tests
		{
			code: "a == b;",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					column: 3,
					endColumn: 5,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "a === b;",
						},
					],
				},
			],
		},
		{
			code: "a!=b;",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					column: 2,
					endColumn: 4,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "a!==b;",
						},
					],
				},
			],
		},
		{
			code: "(a + b) == c;",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					column: 9,
					endColumn: 11,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedEqEqEq,
							output: "(a + b) === c;",
						},
					],
				},
			],
		},
		{
			code: "(a + b)  !=  c;",
			errors: [
				{
					messageId: "unexpected",
					data: wantedNotEqEq,
					column: 10,
					endColumn: 12,
					suggestions: [
						{
							messageId: "replaceOperator",
							data: wantedNotEqEq,
							output: "(a + b)  !==  c;",
						},
					],
				},
			],
		},
		{
			code: "((1) )  ==  (2);",
			output: "((1) )  ===  (2);",
			errors: [
				{
					messageId: "unexpected",
					data: wantedEqEqEq,
					column: 9,
					endColumn: 11,
				},
			],
		},

		// If no output is provided, assert that no output is produced.
	].map(invalidCase => Object.assign({ output: null }, invalidCase)),
	fatal: [
		{
			name: "first option wrong type (number)",
			options: [123],
			error: { name: "SchemaValidationError" },
		},
		{
			name: "invalid enum value for first option",
			options: ["sometimes"],
			error: { name: "SchemaValidationError" },
		},
	],
});
