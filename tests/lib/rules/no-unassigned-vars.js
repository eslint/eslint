/**
 * @fileoverview Tests for no-unassigned-vars rule.
 * @author Jacob Bandes-Storch <https://github.com/jtbandes>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unassigned-vars"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");
const { unIndent } = require("../../_utils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 2022,
		sourceType: "script",
	},
});

ruleTester.run("no-unassigned-vars", rule, {
	valid: [
		"let x;",
		"var x;",
		"const x = undefined; log(x);",
		"let y = undefined; log(y);",
		"var y = undefined; log(y);",
		"let a = x, b = y; log(a, b);",
		"var a = x, b = y; log(a, b);",
		"const foo = (two) => { let one; if (one !== two) one = two; }",
	],
	invalid: [
		{
			code: "let x; let a = x, b; log(x, a, b);",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 5,
					data: { name: "x" },
				},
				{
					messageId: "unassigned",
					line: 1,
					column: 19,
					data: { name: "b" },
				},
			],
		},
		{
			code: "const foo = (two) => { let one; if (one === two) {} }",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 28,
					data: { name: "one" },
				},
			],
		},
		{
			code: "let user; greet(user);",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 5,
					data: { name: "user" },
				},
			],
		},
		{
			code: "function test() { let error; return error || 'Unknown error'; }",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 23,
					data: { name: "error" },
				},
			],
		},
		{
			code: "let options; const { debug } = options || {};",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 5,
					data: { name: "options" },
				},
			],
		},
		{
			code: "let flag; while (!flag) { }",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 5,
					data: { name: "flag" },
				},
			],
		},
		{
			code: "let config; function init() { return config?.enabled; }",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 5,
					data: { name: "config" },
				},
			],
		},
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run("no-unassigned-vars", rule, {
	valid: [
		"let z: number | undefined = undefined; log(z);",
		"declare let c: string | undefined; log(c);",
		unIndent`
			const foo = (two: string): void => {
				let one: string | undefined;
				if (one !== two) {
					one = two;
				}
			}
		`,
		unIndent`
			declare module 'module' {
				import type { T } from 'module';
				let x: T;
				export = x;
			}
		`,
	],
	invalid: [
		{
			code: "let x: number; log(x);",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 5,
					data: { name: "x" },
				},
			],
		},
		{
			code: "let x: number | undefined; log(x);",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 5,
					data: { name: "x" },
				},
			],
		},
		{
			code: "const foo = (two: string): void => { let one: string | undefined; if (one === two) {} }",
			errors: [
				{
					messageId: "unassigned",
					line: 1,
					column: 42,
					data: { name: "one" },
				},
			],
		},
		{
			code: unIndent`
				declare module 'module' {
					let x: string;
				}
				let y: string;
				console.log(y);
			`,
			errors: [
				{
					messageId: "unassigned",
					line: 4,
					column: 9,
					data: { name: "y" },
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
