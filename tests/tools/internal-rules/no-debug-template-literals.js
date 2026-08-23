/**
 * @fileoverview Tests for internal no-debug-template-literals rule.
 * @author Francesco Trotta
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../tools/internal-rules/no-debug-template-literals");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("internal-rules/no-debug-template-literals", rule, {
	valid: [
		'debug("Hello");',
		'debug("Hello %s", name);',
		"debug();",
		"debug(...args);",
		"debug(format, `${value}`);",

		// only calls to `debug` and the configured methods are checked
		"createDebug(`eslint:worker:thread-${threadId}`);",
		"log(`Hello ${name}`);",
		"obj.debug(`Hello ${name}`);",
		"debug.dump.call(null, `Hello ${name}`);",
		{
			code: "debug[method](`Hello ${name}`);",
			options: [{ methods: ["dump"] }],
		},

		// no methods are checked by default
		"debug.dump(`${eventName} ${segment.id}`);",

		// methods that are not listed are not checked
		{
			code: "debug.extend(`worker:thread-${threadId}`);",
			options: [{ methods: ["dump"] }],
		},
		{
			code: "debug.log(`Hello ${name}`);",
			options: [{ methods: ["dump"] }],
		},

		// a listed method that isn't called with a template literal
		{
			code: "debug.dumpState(node, state, false);",
			options: [{ methods: ["dump", "dumpState"] }],
		},
	],
	invalid: [
		{
			code: "debug(`Hello`);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					column: 7,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("Hello");',
						},
					],
				},
			],
		},
		{
			code: "debug(`Hello ${name}`);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("Hello %s", name);',
						},
					],
				},
			],
		},
		{
			code: "debug(`${a} and ${b}`);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("%s and %s", a, b);',
						},
					],
				},
			],
		},
		{
			code: 'debug(`Using "${strategy}" strategy`);',
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("Using \\"%s\\" strategy", strategy);',
						},
					],
				},
			],
		},

		// `%` in the text is escaped
		{
			code: "debug(`100% of ${count} files`);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("100%% of %s files", count);',
						},
					],
				},
			],
		},

		// escape sequences and newlines are preserved
		{
			code: "debug(`Line 1\\nLine 2 ${value}`);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("Line 1\\nLine 2 %s", value);',
						},
					],
				},
			],
		},
		{
			code: "debug(`First\nSecond ${value}`);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("First\\nSecond %s", value);',
						},
					],
				},
			],
		},

		/*
		 * No suggestion is provided when other arguments are present: `%` sequences in the
		 * template text may be placeholders consuming them, so escaping those sequences and
		 * inserting new arguments before the existing ones would change the output.
		 */
		{
			code: "debug(`Hello ${name}`, extra);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [],
				},
			],
		},
		{
			code: "debug(`%s items in ${dir}`, count);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [],
				},
			],
		},
		{
			code: "debug(`No placeholders here`, extra);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [],
				},
			],
		},

		// a sequence expression must be parenthesized to remain a single argument
		{
			code: "debug(`Value: ${(a, b)}`);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("Value: %s", (a, b));',
						},
					],
				},
			],
		},

		// nested template literals are not reported, but are kept as arguments
		{
			code: "debug(`Hello ${`dear ${name}`}`);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("Hello %s", `dear ${name}`);',
						},
					],
				},
			],
		},

		// no suggestion is provided if a comment would be lost
		{
			code: "debug(`Hello ${/* comment */ name}`);",
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [],
				},
			],
		},

		// methods listed in the `methods` option are checked as well
		{
			code: "debug.dump(`${eventName} ${segment.id}`);",
			options: [{ methods: ["dump"] }],
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug.dump("%s %s", eventName, segment.id);',
						},
					],
				},
			],
		},
		{
			code: "debug.trace(`Hello ${name}`);",
			options: [{ methods: ["dump", "trace"] }],
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug.trace("Hello %s", name);',
						},
					],
				},
			],
		},

		// `debug()` itself is checked regardless of the `methods` option
		{
			code: "debug(`Hello ${name}`);",
			options: [{ methods: [] }],
			errors: [
				{
					messageId: "unexpectedTemplateLiteral",
					suggestions: [
						{
							messageId: "replaceWithFormatString",
							output: 'debug("Hello %s", name);',
						},
					],
				},
			],
		},
	],
});
