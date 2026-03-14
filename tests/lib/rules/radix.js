/**
 * @fileoverview Tests for radix rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/radix"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("radix", rule, {
	valid: [
		'parseInt("10", 10);',
		'parseInt("10", 2);',
		'parseInt("10", 36);',
		'parseInt("10", 0x10);',
		'parseInt("10", 1.6e1);',
		'parseInt("10", 10.0);',
		'parseInt("10", foo);',
		'Number.parseInt("10", foo);',
		"parseInt",
		"Number.foo();",
		"Number[parseInt]();",
		{
			code: "class C { #parseInt; foo() { Number.#parseInt(); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #parseInt; foo() { Number.#parseInt(foo); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #parseInt; foo() { Number.#parseInt(foo, 'bar'); } }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// Ignores if it's shadowed or disabled.
		"var parseInt; parseInt();",
		"var Number; Number.parseInt();",
		"/* globals parseInt:off */ parseInt(foo);",
		{
			code: "Number.parseInt(foo);",
			languageOptions: { globals: { Number: "off" } },
		},

		// Deprecated options "always" and "as-needed" should work the same as the default behavior of this rule
		{
			code: 'parseInt("10", 10);',
			options: ["always"],
		},
		{
			code: 'parseInt("10", 10);',
			options: ["as-needed"],
		},
		{
			code: 'parseInt("10", 8);',
			options: ["always"],
		},
		{
			code: 'parseInt("10", 8);',
			options: ["as-needed"],
		},
		{
			code: 'parseInt("10", foo);',
			options: ["always"],
		},
		{
			code: 'parseInt("10", foo);',
			options: ["as-needed"],
		},
	],

	invalid: [
		{
			code: "parseInt();",
			errors: [
				{
					messageId: "missingParameters",
				},
			],
		},
		{
			code: 'parseInt("10");',
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'parseInt("10", 10);',
						},
					],
				},
			],
		},
		{
			code: 'parseInt("10",);', // Function parameter with trailing comma
			languageOptions: { ecmaVersion: 2017 },
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'parseInt("10", 10,);',
						},
					],
				},
			],
		},
		{
			code: 'parseInt((0, "10"));', // Sequence expression (no trailing comma).
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'parseInt((0, "10"), 10);',
						},
					],
				},
			],
		},
		{
			code: 'parseInt((0, "10"),);', // Sequence expression (with trailing comma).
			languageOptions: { ecmaVersion: 2017 },
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'parseInt((0, "10"), 10,);',
						},
					],
				},
			],
		},
		{
			code: 'parseInt("10", null);',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'parseInt("10", undefined);',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'parseInt("10", true);',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'parseInt("10", "foo");',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'parseInt("10", "123");',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'parseInt("10", 1);',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'parseInt("10", 37);',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'parseInt("10", 10.5);',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: "Number.parseInt();",
			errors: [
				{
					messageId: "missingParameters",
				},
			],
		},
		{
			code: 'Number.parseInt("10");',
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'Number.parseInt("10", 10);',
						},
					],
				},
			],
		},
		{
			code: 'Number.parseInt("10", 1);',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'Number.parseInt("10", 37);',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'Number.parseInt("10", 10.5);',
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},

		// Optional chaining
		{
			code: 'parseInt?.("10");',
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'parseInt?.("10", 10);',
						},
					],
				},
			],
		},
		{
			code: 'Number.parseInt?.("10");',
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'Number.parseInt?.("10", 10);',
						},
					],
				},
			],
		},
		{
			code: 'Number?.parseInt("10");',
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'Number?.parseInt("10", 10);',
						},
					],
				},
			],
		},
		{
			code: '(Number?.parseInt)("10");',
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: '(Number?.parseInt)("10", 10);',
						},
					],
				},
			],
		},

		// Deprecated options "always" and "as-needed" should work the same as the default behavior of this rule
		{
			code: "parseInt();",
			options: ["always"],
			errors: [
				{
					messageId: "missingParameters",
				},
			],
		},
		{
			code: "parseInt();",
			options: ["as-needed"],
			errors: [
				{
					messageId: "missingParameters",
				},
			],
		},
		{
			code: 'parseInt("10");',
			options: ["always"],
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'parseInt("10", 10);',
						},
					],
				},
			],
		},
		{
			code: 'parseInt("10");',
			options: ["as-needed"],
			errors: [
				{
					messageId: "missingRadix",
					suggestions: [
						{
							messageId: "addRadixParameter10",
							output: 'parseInt("10", 10);',
						},
					],
				},
			],
		},
		{
			code: 'parseInt("10", 1);',
			options: ["always"],
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: 'parseInt("10", 1);',
			options: ["as-needed"],
			errors: [
				{
					messageId: "invalidRadix",
				},
			],
		},
		{
			code: "Number.parseInt();",
			options: ["always"],
			errors: [
				{
					messageId: "missingParameters",
				},
			],
		},
		{
			code: "Number.parseInt();",
			options: ["as-needed"],
			errors: [
				{
					messageId: "missingParameters",
				},
			],
		},
	],
	fatal: [
		{
			name: "first option wrong type (number)",
			options: [123],
			error: { name: "SchemaValidationError" },
		},
		{
			name: "invalid enum value for first option",
			options: ["never"],
			error: { name: "SchemaValidationError" },
		},
	],
});
