/**
 * @fileoverview Tests for no-console rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-console"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-console", rule, {
	valid: [
		"Console.info(foo)",

		// single array item
		{ code: "console.info(foo)", options: [{ allow: ["info"] }] },
		{ code: "console.warn(foo)", options: [{ allow: ["warn"] }] },
		{ code: "console.error(foo)", options: [{ allow: ["error"] }] },
		{ code: "console.log(foo)", options: [{ allow: ["log"] }] },

		// multiple array items
		{ code: "console.info(foo)", options: [{ allow: ["warn", "info"] }] },
		{ code: "console.warn(foo)", options: [{ allow: ["error", "warn"] }] },
		{ code: "console.error(foo)", options: [{ allow: ["log", "error"] }] },
		{
			code: "console.log(foo)",
			options: [{ allow: ["info", "log", "warn"] }],
		},

		// https://github.com/eslint/eslint/issues/7010
		"var console = require('myconsole'); console.log(foo)",
	],
	invalid: [
		// no options
		{
			code: "if (a) console.warn(foo)",
			errors: [
				{
					messageId: "unexpected",
					suggestions: null,
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "foo(console.log)",
			errors: [
				{
					messageId: "unexpected",
					suggestions: null,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "console.log(foo)",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "log" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "console.error(foo)",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "error" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "console.info(foo)",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "info" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "console.warn(foo)",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "warn" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "switch (a) { case 1: console.log(foo) }",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "log" },
							output: "switch (a) { case 1:  }",
						},
					],
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 33,
				},
			],
		},
		{
			code: "if (a) { console.warn(foo) }",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "warn" },
							output: "if (a) {  }",
						},
					],
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "a();\nconsole.log(foo);\nb();",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "log" },
							output: "a();\n\nb();",
						},
					],
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 12,
				},
			],
		},
		{
			code: "class A { static { console.info(foo) } }",
			languageOptions: { ecmaVersion: "latest" },
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "info" },
							output: "class A { static {  } }",
						},
					],
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "a()\nconsole.log(foo);\n[1, 2, 3].forEach(a => doSomething(a))",
			languageOptions: { ecmaVersion: "latest" },
			errors: [
				{
					messageId: "unexpected",
					suggestions: null,
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 12,
				},
			],
		},
		{
			code: "a++\nconsole.log();\n/b/",
			languageOptions: { ecmaVersion: "latest" },
			errors: [
				{
					messageId: "unexpected",
					suggestions: null,
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 12,
				},
			],
		},
		{
			code: "a();\nconsole.log(foo);\n[1, 2, 3].forEach(a => doSomething(a));",
			languageOptions: { ecmaVersion: "latest" },
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "log" },
							output: "a();\n\n[1, 2, 3].forEach(a => doSomething(a));",
						},
					],
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 12,
				},
			],
		},

		//  one option
		{
			code: "if (a) console.info(foo)",
			options: [{ allow: ["warn"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "warn" },
					suggestions: null,
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "foo(console.warn)",
			options: [{ allow: ["log"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "log" },
					suggestions: null,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "console.log(foo)",
			options: [{ allow: ["error"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "error" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "log" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "console.error(foo)",
			options: [{ allow: ["warn"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "warn" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "error" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "console.info(foo)",
			options: [{ allow: ["log"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "log" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "info" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "console.warn(foo)",
			options: [{ allow: ["error"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "error" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "warn" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "switch (a) { case 1: console.log(foo) }",
			options: [{ allow: ["error"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "error" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "log" },
							output: "switch (a) { case 1:  }",
						},
					],
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 33,
				},
			],
		},
		{
			code: "if (a) { console.info(foo) }",
			options: [{ allow: ["warn"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "warn" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "info" },
							output: "if (a) {  }",
						},
					],
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "class A { static { console.error(foo) } }",
			options: [{ allow: ["log"] }],
			languageOptions: { ecmaVersion: "latest" },
			errors: [
				{
					messageId: "limited",
					data: { allowed: "log" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "error" },
							output: "class A { static {  } }",
						},
					],
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 33,
				},
			],
		},

		// multiple options
		{
			code: "if (a) console.log(foo)",
			options: [{ allow: ["warn", "error"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "warn, error" },
					suggestions: null,
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "foo(console.info)",
			options: [{ allow: ["warn", "error"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "warn, error" },
					suggestions: null,
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "console.log(foo)",
			options: [{ allow: ["warn", "info"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "warn, info" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "log" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "console.error(foo)",
			options: [{ allow: ["warn", "info", "log"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "warn, info, log" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "error" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "console.info(foo)",
			options: [{ allow: ["warn", "error", "log"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "warn, error, log" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "info" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "console.warn(foo)",
			options: [{ allow: ["info", "log"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "info, log" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "warn" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "switch (a) { case 1: console.error(foo) }",
			options: [{ allow: ["info", "log"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "info, log" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "error" },
							output: "switch (a) { case 1:  }",
						},
					],
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: "if (a) { console.log(foo) }",
			options: [{ allow: ["warn", "error"] }],
			errors: [
				{
					messageId: "limited",
					data: { allowed: "warn, error" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "log" },
							output: "if (a) {  }",
						},
					],
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "class A { static { console.info(foo) } }",
			options: [{ allow: ["log", "error", "warn"] }],
			languageOptions: { ecmaVersion: "latest" },
			errors: [
				{
					messageId: "limited",
					data: { allowed: "log, error, warn" },
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "info" },
							output: "class A { static {  } }",
						},
					],
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "console[foo](bar)",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeMethodCall",
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "console[0](foo)",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeMethodCall",
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},

		// In case that implicit global variable of 'console' exists
		{
			code: "console.log(foo)",
			languageOptions: {
				globals: {
					console: "readonly",
				},
			},
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "removeConsole",
							data: { propertyName: "log" },
							output: "",
						},
					],
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
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
