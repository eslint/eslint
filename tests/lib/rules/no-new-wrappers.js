/**
 * @fileoverview Tests for no-new-wrappers rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-wrappers"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-new-wrappers", rule, {
	valid: [
		"var a = new Object();",
		"var a = String('test'), b = String.fromCharCode(32);",
		`
        function test(Number) {
            return new Number;
        }
        `,
		{
			code: `
            import String from "./string";
            const str = new String(42);
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		`
        if (foo) {
            result = new Boolean(bar);
        } else {
            var Boolean = CustomBoolean;
        }
        `,
		{
			code: "new String()",
			languageOptions: {
				globals: {
					String: "off",
				},
			},
		},
		`
        /* global Boolean:off */
        assert(new Boolean);
        `,
	],
	invalid: [
		{
			code: "var a = new String('hello');",
			errors: [
				{
					messageId: "noConstructor",
					data: {
						fn: "String",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "var a = new Number(10);",
			errors: [
				{
					messageId: "noConstructor",
					data: {
						fn: "Number",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "var a = new Boolean(false);",
			errors: [
				{
					messageId: "noConstructor",
					data: {
						fn: "Boolean",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: `
            const a = new String('bar');
            {
                const String = CustomString;
                const b = new String('foo');
            }
            `,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noConstructor",
					data: {
						fn: "String",
					},
					line: 2,
					column: 23,
					endLine: 2,
					endColumn: 40,
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
