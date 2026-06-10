/**
 * @fileoverview Tests for max-depth.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-depth"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("max-depth", rule, {
	valid: [
		{
			code: "function foo() { if (true) { if (false) { if (true) { } } } }",
			options: [3],
		},
		{
			code: "function foo() { if (true) { } else if (false) { } else if (true) { } else if (false) {} }",
			options: [3],
		},
		{
			code: "var foo = () => { if (true) { if (false) { if (true) { } } } }",
			options: [3],
			languageOptions: { ecmaVersion: 6 },
		},
		"function foo() { if (true) { if (false) { if (true) { } } } }",

		// object property options
		{
			code: "function foo() { if (true) { if (false) { if (true) { } } } }",
			options: [{ max: 3 }],
		},

		{
			code: "class C { static { if (1) { if (2) {} } } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { if (1) { if (2) {} } if (1) { if (2) {} } } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { if (1) { if (2) {} } } static { if (1) { if (2) {} } } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "if (1) { class C { static { if (1) { if (2) {} } } } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "function foo() { if (1) { class C { static { if (1) { if (2) {} } } } } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "function foo() { if (1) { if (2) { class C { static { if (1) { if (2) {} } if (1) { if (2) {} } } } } } if (1) { if (2) {} } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
		},
	],
	invalid: [
		{
			code: "function foo() { if (true) { if (false) { if (true) { } } } }",
			options: [2],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 3, maxDepth: 2 },
					line: 1,
					column: 43,
					endLine: 1,
					endColumn: 45,
				},
			],
		},
		{
			code: "var foo = () => { if (true) { if (false) { if (true) { } } } }",
			options: [2],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 3, maxDepth: 2 },
					line: 1,
					column: 44,
					endLine: 1,
					endColumn: 46,
				},
			],
		},
		{
			code: "function foo() { if (true) {} else { for(;;) {} } }",
			options: [1],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 2, maxDepth: 1 },
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 41,
				},
			],
		},
		{
			code: "function foo() { if (a) {} else if (b) {} if (c) { if (d) {} } }",
			options: [1],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 2, maxDepth: 1 },
					line: 1,
					column: 52,
					endLine: 1,
					endColumn: 54,
				},
			],
		},
		{
			code: "if (a) if (b) {}",
			options: [1],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 2, maxDepth: 1 },
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "function foo() { while (true) { if (true) {} } }",
			options: [1],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 2, maxDepth: 1 },
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: "function foo() { if (a) { switch (b) { case 1: foo(); } } }",
			options: [1],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 2, maxDepth: 1 },
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 33,
				},
			],
		},
		{
			code: "function foo() { for (let x of foo) { if (true) {} } }",
			options: [1],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 2, maxDepth: 1 },
					line: 1,
					column: 39,
					endLine: 1,
					endColumn: 41,
				},
			],
		},
		{
			code: "function foo() { while (true) { if (true) { if (false) { } } } }",
			options: [1],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 2, maxDepth: 1 },
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 35,
				},
				{
					messageId: "tooDeeply",
					data: { depth: 3, maxDepth: 1 },
					line: 1,
					column: 45,
					endLine: 1,
					endColumn: 47,
				},
			],
		},
		{
			code: "function foo() { if (true) { if (false) { if (true) { if (false) { if (true) { } } } } } }",
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 5, maxDepth: 4 },
					line: 1,
					column: 68,
					endLine: 1,
					endColumn: 70,
				},
			],
		},

		// object property options
		{
			code: "function foo() { if (true) { if (false) { if (true) { } } } }",
			options: [{ max: 2 }],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 3, maxDepth: 2 },
					line: 1,
					column: 43,
					endLine: 1,
					endColumn: 45,
				},
			],
		},

		{
			code: "function foo() { if (a) { if (b) { if (c) { if (d) { if (e) {} } } } } }",
			options: [{}],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 5, maxDepth: 4 },
					line: 1,
					column: 54,
					endLine: 1,
					endColumn: 56,
				},
			],
		},
		{
			code: "function foo() { if (true) {} }",
			options: [{ max: 0 }],
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 1, maxDepth: 0 },
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 20,
				},
			],
		},

		{
			code: "class C { static { if (1) { if (2) { if (3) {} } } } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 3, maxDepth: 2 },
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 40,
				},
			],
		},
		{
			code: "if (1) { class C { static { if (1) { if (2) { if (3) {} } } } } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 3, maxDepth: 2 },
					line: 1,
					column: 47,
					endLine: 1,
					endColumn: 49,
				},
			],
		},
		{
			code: "function foo() { if (1) { class C { static { if (1) { if (2) { if (3) {} } } } } } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 3, maxDepth: 2 },
					line: 1,
					column: 64,
					endLine: 1,
					endColumn: 66,
				},
			],
		},
		{
			code: "function foo() { if (1) { class C { static { if (1) { if (2) {} } } } if (2) { if (3) {} } } }",
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "tooDeeply",
					data: { depth: 3, maxDepth: 2 },
					line: 1,
					column: 80,
					endLine: 1,
					endColumn: 82,
				},
			],
		},
	],
});
